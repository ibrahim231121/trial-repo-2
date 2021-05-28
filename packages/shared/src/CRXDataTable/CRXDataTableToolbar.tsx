import React, { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import "@material-ui/icons"
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import {DataTableToolbarProps, useToolbarStyles, HeadCellProps} from "./CRXDataTableTypes"
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CRXButton from '../controls/CRXButton/CRXButton'
import CRXTypography from '../CRXTypography/Typography'
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import CRXCheckBox from '../controls/CRXCheckBox/CRXCheckBox'
import {useTranslation} from 'react-i18next'; 
import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';

const checkboxStyle = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 0,
    border: "1px solid #797979",
    width: 16,
    height: 16,
    boxShadow: 'none',
    backgroundColor: '#fff',
    'input:hover ~ &': {
      backgroundColor: '#797979',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#797979',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
      top:'8px',
      position:"absolute",
      color:'#797979',
    },
    'input:hover ~ &': {
      backgroundColor: '#797979',
    },
  },
});


export default function  EnhancedTableToolbar (props: DataTableToolbarProps){
    const classes = useToolbarStyles();
    const chkStyle = checkboxStyle();
    const {headCells, rowCount, columnVisibilityBar, onChange, onClearAll, onReOrder } = props;
    const [selected, setSelected] = React.useState<HeadCellProps[]>(headCells);
    const [anchorEl, setAnchorEl] = useState<any>(null)
    const [customizeColumn, setCustomize] = useState<any>(null)
    const [orderColumn, setOrderColumn] = useState(props.orderingColumn)
    const [onPreset, setOnPreSet] = useState<boolean>()
    const {t} = useTranslation<string>();

    useEffect(() => {
      
      headCells.map((headCell: any, x) => {
          selected[x].visible = (headCell.visible || headCell.visible === undefined) ? true : false 
          setSelected(prevState  => ({...prevState}))
      }) 
      let checkOrderPreset = localStorage.getItem("checkOrderPreset");
      if(checkOrderPreset !== null)
        setOnPreSet(true)
      else
        setOnPreSet(false)  

    },[])

    useEffect(() => {
      setOrderColumn(props.orderingColumn)
    }, [props.orderingColumn])

    const openHandleClick = (event : any) => {
      setAnchorEl(event.currentTarget);
    }

    const customizeColumnClose = () => {
      setCustomize(null)
    }

    const customizeColumnOpen = (event : any) => {
      setCustomize(event.currentTarget);
    }

    const handleCheckChange = (event: any, index: number) => {
      selected[index].visible = event.target.checked;     
      headCells[index].visible = selected[index].visible 
      setSelected(prevState  => ({...prevState}))
      onChange()    
    }

    const handlePreset = (event: any) => {
        setOnPreSet(event.target.checked)
    }

    const closeHandle = () => {
      setAnchorEl(null);
    }

    function onSavecloseHandle() {

      let checkOrderPreset = orderColumn.map((i, _) => {
        let rObj: any = {}
        rObj["order"] = i
        rObj["value"] = headCells[i].visible
        return rObj
      })

      if(onPreset)
      {
        localStorage.setItem("checkOrderPreset", JSON.stringify(checkOrderPreset));
        alert("Success: Your Customized columns have been saved.")
      }
      else
      {
        let orderingColumns = localStorage.getItem("checkOrderPreset");
        localStorage.removeItem("checkOrderPreset");
        if(orderingColumns !== null)
          alert("Success: Your Customized columns have been cleared.")
      }
      setCustomize(null)    
    }
   
    const clearAllFilters = () => {
      // headCells.map((headCell, x) => {
      //   if(headCell.keyCol === false || headCell.keyCol === undefined)
      //   {
      //     selected[x].visible = true
      //     headCell.visible = selected[x].visible
      //     setSelected(prevState  => ({...prevState}))
      //   }
      // }) 
      setAnchorEl(null);
      onClearAll()
    }

    const resetToCustomizeDefault = () => {

      let local_headCells = localStorage.getItem("headCells");  
      
      if(local_headCells !== null)
      {
        let headCells_private = JSON.parse(local_headCells)
        console.log("HeadCells", headCells_private)
        headCells.map((x: any, i: number) => {
          headCells[i].visible = headCells_private[i].visible
        })
        setSelected(headCells_private)
      }
      let sortOrder = orderColumn.sort((a: number, b: number) => a - b)
      setOrderColumn(sortOrder)
      onChange()
    }

    const handleCustomizeChange = (checked: boolean, index: number) => {
      selected[index].visible = checked;     
      headCells[index].visible = selected[index].visible 
      setSelected(prevState  => ({...prevState}))
      onChange()
    }

    const onReorderEnd = useCallback(    
      ({ oldIndex, newIndex}, _) => {
        const newOrder = [...orderColumn];
        const moved = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, moved[0]);

        setOrderColumn(newOrder);
        onReOrder(newOrder)
      },
      [orderColumn, setOrderColumn]
    );
    
    const onSortableStart = (e:any) => {
      e.helper.className = "onSortDragable";
      e.helper.innerHTML += '<i class="fas fa-grip-vertical sortAbledragIcon"></i>';
      e.helper.innerHTML += '<i class="fas fa-scrubber leftCircle"></i>';
      e.helper.innerHTML += '<i class="fas fa-scrubber rightCircle"></i>';
    }

    const onSortMoveStart = (e : any) => {
      console.log(e);
    }
    return (

      <Toolbar
        className={clsx(classes.root)}>
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            <b>{rowCount}</b> {t('assets')}  
          </Typography>
        
          <div className="dataTableColumnShoHide">
              { columnVisibilityBar === true ? (
                  <>
                    <IconButton
                      aria-controls="dataTableShowHideOpt"
                      className="dataIconButton"
                      aria-haspopup="true"
                      onClick={openHandleClick}
                      disableRipple={true}
                    >
                      <i className="fas fa-filter"></i>
                    </IconButton>
                    <Menu
                      id="dataTableShowHideOpt"
                      anchorEl={anchorEl}
                      className="checkedDataTable"
                      getContentAnchorEl={null}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={closeHandle}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
                    <div style={{position:'absolute', top:"-20px", right:"0px"}}>
                      
                    </div>
                    <CRXTypography className="DRPTitle" variant="h3" >{t('Tablescolumnsfilter')} </CRXTypography>

                    <div className="footerDRP">
                    <Grid container spacing={0}>
                      <Grid item xs={4}>
                        <CRXButton 
                          id="closeDropDown"
                          onClick={closeHandle}
                          color="primary"
                          variant="contained" 
                          className="closeDRP CRXPrimaryButton"
                          >
                            {t('Close')}
                          </CRXButton>
                      </Grid>
                      <Grid item xs={4}>
                        <CRXButton 
                          id="resetCheckBox"
                          onClick={clearAllFilters}
                          color="default"
                          variant="outlined" 
                          className="clearAllFilterBtn"
                          >
                            {t('Clearallfilters')}
                          </CRXButton>
                      </Grid>
                      
                    </Grid>
                    </div>
                    </Menu>
                  
                  </>
                ) : null
              }
          </div>          
          
          <div className="dataTableColumnShoHide">
            <Tooltip title="Customize Columns" placement="top-start">         
             <IconButton
                aria-controls="CustomizeColumns"
                className="dataIconButton"
                aria-haspopup="true"
                onClick={customizeColumnOpen}
                disableRipple={true}
              >
                <i className="fas fa-columns"></i>
              </IconButton>
            </Tooltip>
              <Menu
                id="CustomizeColumns"
                anchorEl={customizeColumn}
                className="columnReOrderOpup"
                getContentAnchorEl={null}
                keepMounted
                open={Boolean(customizeColumn)}
                onClose={customizeColumnClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
              <div style={{position:'absolute', top:"-20px", right:"0px"}}>
                <IconButton aria-label="clear"  onClick={customizeColumnClose} >
                  <ClearIcon fontSize="small"/>
                </IconButton>
              </div>
              <CRXTypography className="DRPTitle" variant="h3" >{t('Customizecolumns')}</CRXTypography>
              <ul className="columnList">
                <SortableList 
                  orderColumn={orderColumn} 
                  selected={selected} 
                  chkStyle={chkStyle} 
                  lockAxis="y"
                  onSortStart={onSortableStart}
                  onSortMove={onSortMoveStart}
                  onSortEnd={onReorderEnd} 
                  onReOrderChange={handleCustomizeChange}/>
              </ul>
              <div className="footerDRPReOrder">
              <Grid container spacing={2}>
                <Grid item >
                  <CRXButton 
                    id="closeDropDown"
                    onClick={onSavecloseHandle}
                    color="primary"
                    variant="contained" 
                    className="closeDRP"
                    >
                      {t('Saveandclose')}
                    </CRXButton>
                </Grid>
                <Grid item>
                  <CRXButton 
                    id="resetCheckBox"
                    onClick={resetToCustomizeDefault}
                    color="default"
                    variant="outlined" 
                    className="resetCheckBox"
                    >
                      {t('Resettodefault')}
                    </CRXButton>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={<CRXCheckBox checked={onPreset}
                      onChange={(e) => handlePreset(e)}
                      className="shoHideCheckbox"
                      inputProps="primary checkbox"
                      />}
                    label={t('Saveaspreset')}
                    labelPlacement="end"
                  />
                </Grid>
              </Grid>
              </div>
              </Menu>
          </div>     
      
      </Toolbar>

    );
};

const SortableItem = SortableElement(({value}: any) => (
  <li tabIndex={0}>{value}</li>
));

const SortableList = SortableContainer((props: any) => {
  const {orderColumn, selected, chkStyle, onReOrderChange} = props;
  const handleCheckChange = (event: any, index: number) => {    
    onReOrderChange(event.target.checked,index)
  }

  return (
    <span>
      {orderColumn.map((colIdx: any, index: number) => (
        <SortableItem 
          key={colIdx} 
          index={index} 
          value={
                  (selected[colIdx].keyCol === false || selected[colIdx].keyCol === undefined) ? 
                    <FormControlLabel
                      value={selected[colIdx].label}
                      control={<CRXCheckBox className="customizeCheckBox" checked={selected[colIdx].visible} onChange={(e) => handleCheckChange(e,colIdx)} />}
                     //icon={<span className={chkStyle.icon} />}
                      className={chkStyle.root + " shoHideCheckbox"}
                      
                      //color="default" />}
                      label={selected[colIdx].label}
                      labelPlacement="end"
                    />
                  :
                  null
                } 
        />
      ))}
    </span>
  );
});
