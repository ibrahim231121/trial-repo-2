import React, { useEffect, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import CRXButton from '../controls/CRXButton/CRXButton'
import CRXTypography from '../CRXTypography/Typography'
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from 'react-i18next'; 
import { DataTableClearFilterProps } from "./CRXDataTableTypes"

const DataTableClearFilter: React.FC<DataTableClearFilterProps> = ({columnVisibilityBar, filterClose, onClearAll}) => {

const DataTableClearFilter: React.FC<DataTableClearFilterProps> = ({columnVisibilityBar, onClearAll, filterOuter}) => {

  const {t} = useTranslation<string>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined | null>(null)

  const clearAllFilters = () => {
    setAnchorEl(null);
    onClearAll()
  }
  
  useEffect(()=>{
      setAnchorEl(filterClose);
  },[filterClose])
  useEffect(() => {
    setAnchorEl(filterOuter)
    console.log(filterOuter)
  },[filterOuter])
  
  return (
    <div className="dataTableColumnShoHide">
        { columnVisibilityBar === true ? (
            <>
            <IconButton
                aria-controls="dataTableShowHideOpt"
                className="dataIconButton"
                aria-haspopup="true"
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setAnchorEl(e.currentTarget)}
                disableRipple={true}
            >
                <i className="fas fa-filter"></i>
            </IconButton>
            {/* <ClickAwayListener onClickAway={() => setAnchorEl(filterOuter)}> */}
            <Menu
                id="dataTableShowHideOpt"
                anchorEl={anchorEl}
                className="checkedDataTable"
                getContentAnchorEl={null}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(anchorEl)}
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
                    onClick={() => setAnchorEl(null)}
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
            {/* </ClickAwayListener> */}
            </>
        ) : null
        }
    </div>  
  );
};

export default DataTableClearFilter;
