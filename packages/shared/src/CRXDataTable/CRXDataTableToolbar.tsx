import React, { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import "@material-ui/icons"
import Menu from '@material-ui/core/Menu';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import { makeStyles } from '@material-ui/core/styles';
import {DataTableToolbarProps, useToolbarStyles, HeadCellProps} from "./CRXDataTableTypes"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CRXButton from '../controls/CRXButton/CRXButton'
import CRXTypography from '../CRXTypography/Typography'
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import CRXCheckBox from '../controls/CRXCheckBox/CRXCheckBox'
import {useTranslation} from 'react-i18next'; 
import Tooltip from '@material-ui/core/Tooltip';

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
    const {headCells, rowCount, columnVisibilityBar, onChange, onClearAll, onReOrder, closePopupIcon } = props;
    const [selected, setSelected] = React.useState<HeadCellProps[]>(headCells);
    const [anchorEl, setAnchorEl] = useState<any>(null)
    const [customizeColumn, setCustomize] = useState<boolean>(false)
    const [orderColumn, setOrderColumn] = useState(props.orderingColumn)
    const [onPreset, setOnPreSet] = useState<boolean>()
    const {t} = useTranslation<string>();
    const DragList = React.useRef<React.ReactNode>(null);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const stateArry = headCells.map((i : any) => {
      return i.id;
    })
    const [dragState, setDragState] = useState<any>(stateArry);
   
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
      setCustomize(false)
    }

    const customizeColumnOpen = (event : any) => {
      setCustomize((prevOpen) => !prevOpen)
    }

    const prevOpen = React.useRef(customizeColumn);
    React.useEffect(() => {
      prevOpen.current = customizeColumn;

    }, [customizeColumn]); 
     

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
      }
      else
      {
        let orderingColumns = localStorage.getItem("checkOrderPreset");
        localStorage.removeItem("checkOrderPreset");
      }
      setCustomize(false)    
    }
   
    const clearAllFilters = () => {
      setAnchorEl(null);
      onClearAll()
    }

    const resetToCustomizeDefault = () => {

      let local_headCells = localStorage.getItem("headCells");  
      
      if(local_headCells !== null)
      {
        let headCells_private = JSON.parse(local_headCells)
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
      ({ oldIndex, newIndex}, e) => {
        const newOrder = [...orderColumn];
        const moved = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, moved[0]);
        setOrderColumn(newOrder);
        onReOrder(newOrder);
        var dx = document.querySelector(".ghostView");
        if(dx != null) {
           dx.children[1].remove();
           dx.className = "";
        }
         for(var i in Object.entries(e.target.children)){
            const clax = Object.entries<any>(e.target.children)[i][1];
            if(clax.className === "ghostView")
            Object.entries<any>(e.target.children)[i][1].className = "";
            const targetState = headCells[i];
            if(targetState != undefined)
            setDragState({[targetState.id] : false});
        }
      },
      [orderColumn, setOrderColumn]
      
    );
    
    const onSortableStart = (e:any) => {
      e.helper.className = "onSortDragable";
      e.helper.innerHTML += '<i class="fas fa-grip-vertical sortAbledragIcon"></i>';
      e.node.className = "ghostView";
      e.node.innerHTML += '<i class="fas fa-grip-vertical sortAbledragIcon"></i>';
      
    }

    const onSortOverFunc = (e : any) => {
      const head = headCells[e.newIndex].id;
        if(e.newIndex > 0 ) {
          
          e.nodes[e.newIndex].node.style.transform = "translate3d(0px, 0px, 0px)";
          setDragState({[head] : true})
        }
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
                ref={anchorRef}
                aria-controls={customizeColumn ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                className="dataIconButton"
                onClick={customizeColumnOpen}
                disableRipple={true}
              >
                <i className="fas fa-columns"></i>
              </IconButton>
            </Tooltip>
             
          <Popper 
            id="CustomizeColumns"
            className="columnReOrderOpup"
            open={customizeColumn} 
            anchorEl={anchorRef.current} 
            role={undefined} 
            placement="top-end"
            transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'top-end' ? 'right-start' : 'right-start' }}
            >
              <Paper>
              <ClickAwayListener onClickAway={customizeColumnClose}>
                <div>
                <div className="popupFreezTitle">
                <div style={{position:'absolute', top:"-10px", right:"0px"}}>
                  <IconButton aria-label="clear" disableRipple={true} className="closePopup"  onClick={customizeColumnClose} >
                    <span className="icon-cross2 croseIcon"></span>
                  </IconButton>
                </div>
              
              <CRXTypography className="DRPTitle" variant="h3" >{t('Customizecolumns')}</CRXTypography>
              <CRXTypography className="subTItle" variant="h5" >{t('Select to show a column. Drag and drop to recorder.')}</CRXTypography>
              </div>
              <div className="columnList">
                <SortableList 
                  orderColumn={orderColumn} 
                  selected={selected} 
                  chkStyle={chkStyle} 
                  dragHideState={dragState}
                  hideSortableGhost={false}
                  disableAutoscroll={false}
                  lockAxis="y"
                  onSortStart={onSortableStart}
                  onSortEnd={onReorderEnd}
                  onSortOver={onSortOverFunc}
                  lockToContainerEdges={true}
                  transitionDuration={0}
                  onReOrderChange={handleCustomizeChange}/>
              </div>
              <div className="footerDRPReOrder">
              
                  <CRXButton 
                    id="closeDropDown"
                    onClick={onSavecloseHandle}
                    color="primary"
                    variant="contained" 
                    className="closeDRP"
                    >
                      {t('Saveandclose')}
                    </CRXButton>
                
                  <CRXButton 
                    id="resetCheckBox"
                    onClick={resetToCustomizeDefault}
                    color="default"
                    variant="outlined" 
                    className="resetCheckBox"
                    >
                      {t('Resettodefault')}
                    </CRXButton>
                
                  <FormControlLabel
                    control={<CRXCheckBox checked={onPreset}
                      onChange={(e) => handlePreset(e)}
                      className="shoHideCheckbox"
                      inputProps="primary checkbox"
                      />}
                    label={t('Saveaspreset')}
                    labelPlacement="end"
                  />
                
              
              </div>
              </div>
              </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
          </div>     
      
      </Toolbar>

    );
};

const SortableItem = SortableElement(({value}: any, {index} : any) => (
  <li tabIndex={index}>
    {value}
  </li>
  
));

const SortableList = SortableContainer((props: any) => {
  const {orderColumn, selected, chkStyle, onReOrderChange, dragHideState, id} = props;
  const handleCheckChange = (event: any, index: number) => {    

    onReOrderChange(event.target.checked,index)
  }

  let hide:any; 
  const dragableSortTarget = (colIdx : any) =>{
      
      const names : any = selected[colIdx].id;
      if(colIdx > 0 && dragHideState[names] === true) {
        return hide = ""
      }else {
        return hide = "sortDragHide"
      }
   }
  return (
    <ul className="columnUlList">
      {orderColumn.map((colIdx: any, index: number) => (
        
        dragableSortTarget(colIdx),
        <>
        {(selected[colIdx].keyCol === false || selected[colIdx].keyCol === undefined) ? 
        <>
        <SortableItem 
          key={colIdx} 
          index={index}
          id={id}
          value={
   
              <FormControlLabel
                value={selected[colIdx].label}
                control={<CRXCheckBox className="customizeCheckBox" checked={selected[colIdx].visible} onChange={(e) => handleCheckChange(e,colIdx)} />}
                //icon={<span className={chkStyle.icon} />}
                className={chkStyle.root + " shoHideCheckbox"}
                
                //color="default" />}
                label={selected[colIdx].label}
                labelPlacement="end"
              />
                  
            } 
        />
        <div className={"dragableGuide " + hide} ><i className="fas fa-scrubber leftCircle"></i><i className="fas fa-scrubber rightCircle"></i></div>
            </>  
        :
        null
      }
        </>
      ))}
    </ul>
  );
});
