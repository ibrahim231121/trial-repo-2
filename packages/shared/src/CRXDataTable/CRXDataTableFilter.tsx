import React, { useEffect, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import CRXButton from '../controls/CRXButton/CRXButton'
import CRXTypography from '../CRXTypography/Typography'
import IconButton from '@material-ui/core/IconButton';
import CRXTooltip  from "../controls/CRXTooltip/CRXTooltip";
import Grid from '@material-ui/core/Grid';
import {useTranslation} from 'react-i18next'; 
import { DataTableClearFilterProps } from "./CRXDataTableTypes"

const DataTableClearFilter: React.FC<DataTableClearFilterProps> = ({columnVisibilityBar, filterClose, onClearAll}) => {

  const {t} = useTranslation<string>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined | null>(null)

  const clearAllFilters = () => {
    setAnchorEl(null);
    onClearAll()
  }
  
  useEffect(()=>{
      setAnchorEl(filterClose);
  },[filterClose])
  
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
                <CRXTooltip iconName="fas fa-filter" className='crxTooltipFilter' placement="top-start" arrow={false} title="filter"></CRXTooltip>
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
            <CRXTypography className="DRPTitle" variant="h3" >{t('Tables_columns_filter')} </CRXTypography>

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
                    {t('Clear_all_filters')}
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
