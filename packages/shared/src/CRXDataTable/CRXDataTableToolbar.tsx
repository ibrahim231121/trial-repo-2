import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import "@material-ui/icons"
import IconButton from '@material-ui/core/IconButton';

import { DataTableToolbarProps, useToolbarStyles } from "./CRXDataTableTypes"
import { useTranslation } from 'react-i18next';
import DataTableClearFilter from "./CRXDataTableFilter"
import DataTableCustomizeColumns from "./CRXDataTableCustomizeColumns"
import CRXTooltip from '../controls/CRXTooltip/CRXTooltip';


const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  id,
  headCells,
  rowCount,
  columnVisibilityBar,
  onChange,
  onClearAll,
  onReOrder,
  orderingColumn,
  onHeadCellChange,
  showCountText,
  showCustomizeIcon,
  numSelected,
  showTotalSelectedText,
  toolBarButton,
  stickyToolbar,
  offsetY,
  expanView,
  toggleExpanView,
  showExpandViewOption
}) => {
  const classes = useToolbarStyles();
  const { t } = useTranslation<string>();

  const [showCustomize,setShowCustomize] = useState<any>();
  const ToolBarRefs:any = useRef()

   
  function createScrollStopListener(element : any, callback : any, timeout : number) {
    let handle: any = null;
    const onScroll = function() {
        
        if (handle) {
            clearTimeout(handle);
        }
        
        handle = setTimeout(callback, timeout || 100); 
        
        if(offsetY && element.pageYOffset >= offsetY ) {
         
          ToolBarRefs.current.style.position = "fixed",
          ToolBarRefs.current.style.width = "calc(100% - 117px)";
        }
        else if (offsetY && element.pageYOffset <= offsetY && element.pageXOffset > 1) {
          
          ToolBarRefs.current.style.position = "fixed",
          ToolBarRefs.current.style.width = "calc(100% - 117px)";
         
        }

        
    };

    element.addEventListener('scroll', onScroll);
    return function() {
        element.removeEventListener('scroll', onScroll);
    };
  }
  
  useEffect(() => {
    createScrollStopListener(window, function() {
      if(offsetY && window.pageYOffset < offsetY && window.pageXOffset < 1) {
          ToolBarRefs.current.style.position = "sticky",
          ToolBarRefs.current.style.width = "100%";
      }
    },50);

  },[])
  
  return (

    <Toolbar ref={ToolBarRefs} style={{"top" : stickyToolbar + "px", position : "sticky"}} className={clsx("crxClearfilter stickyPos " + classes.root)} disableGutters>
      
      <div className='toolbar-button'>
        
        {toolBarButton}
      </div>
      {
        (showCountText || showCountText === undefined) ?
          <Typography className={classes.title + " toolbar_counter_text"} color="inherit" variant="subtitle1" component="div">
            {<><b>{rowCount}</b> {t(id)}</>}
          </Typography> : <></>
      }
      {
        (showTotalSelectedText || showTotalSelectedText === undefined) ?
          <Typography className={classes.title + " toolbar_counter_text"} color="inherit" variant="subtitle1" component="div">
            {<>{numSelected} {t("total_users_in_group")} </>}
          </Typography> : <></>
      }
      {showExpandViewOption == true ?
      <div className='expandViewButton'>
      <IconButton
          aria-controls="viewControle"
          className="viewControleButton"
          aria-haspopup="true"
          onClick={() => toggleExpanView()}
          disableRipple={true}
      >
          <CRXTooltip iconName={expanView == true ? "fa-solid fa-down-left-and-up-right-to-center " : "fa-solid fa-up-right-and-down-left-from-center"} className='crxTooltipFilter' placement={expanView == true ? "left" : "top"} arrow={false} title={expanView == true ? "Collapse view" : "Expand view"}></CRXTooltip>
      </IconButton>
      </div> : ""
      }
      <DataTableClearFilter
        columnVisibilityBar={columnVisibilityBar}
        filterClose={showCustomize}
        onClearAll={() => onClearAll()}
        expanView={expanView} />
       {(showCustomizeIcon || showCountText === undefined) &&
        <DataTableCustomizeColumns
          id={id}
          filterWindow = {setShowCustomize}
          headCells={headCells}
          orderingColumn={orderingColumn}
          onReorder={(e: number[]) => onReOrder(e)}
          onChange={onChange}
          onHeadCellChange={onHeadCellChange}
          showCustomizeIcon={showCustomizeIcon}
          expanView={expanView}
        />
      }

    </Toolbar>

  );
};

export default DataTableToolbar;


