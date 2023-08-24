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
  showExpandViewOption,
  showSearchPanel,
  searchResultText,
  advanceSearchText,
  presetPerUser,
  title
}) => {
  const classes = useToolbarStyles();
  const { t } = useTranslation<string>();

  const [showCustomize,setShowCustomize] = useState<any>();
  const [paddingRightWebkit, setPaddingRight] = useState<number>(25)
  const ToolBarRefs:any = useRef()

   
  function createScrollStopListener(element : any, callback : any, timeout : number) {
    let handle: any = null;
   
    const onScroll = function() {
        
        if (handle) {
            clearTimeout(handle);
        }
        
        handle = setTimeout(callback, timeout || 100); 
        if(offsetY && element.pageYOffset >= offsetY && ToolBarRefs.current != null) {
         
          ToolBarRefs.current.style.position = "fixed"
          ToolBarRefs.current.style.width = "calc(100% - 115px)";
          setPaddingRight(0)
        }
       
        else if (offsetY && element.pageYOffset <= offsetY && element.pageXOffset > 1 && ToolBarRefs.current != null) {
          window.pageXOffset = 1;
          ToolBarRefs.current.style.position = "fixed",
          ToolBarRefs.current.style.width = "calc(100% - 115px)";
          setPaddingRight(0)
        }
    };

    element.addEventListener('scroll', onScroll);
    return function() {
        element.removeEventListener('scroll', onScroll);
    };
  }
  
  useEffect(() => {
    createScrollStopListener(window, function() {
      if(offsetY && window.pageYOffset < offsetY && window.pageXOffset < 1 && ToolBarRefs.current != null) {
          ToolBarRefs.current.style.position = "fixed",
          ToolBarRefs.current.style.width = "-webkit-fill-available";
          setPaddingRight(25)
      }
    },50);

  },[])

  const ui: any = document.querySelectorAll(".advance-type-count")
  useEffect(()=>{
    
  },[advanceSearchText])


  let spanstyle = {
    padding: "0px 2px"
  }
  return (
    <>
    <Toolbar key={ToolBarRefs} ref={ToolBarRefs} style={{"top" : stickyToolbar + "px", position : "fixed", paddingRight : paddingRightWebkit + "px"}} className={clsx("crxClearfilter stickyPos " + classes.root)} disableGutters>
      
      <div className='toolbar-button'>
        
        {toolBarButton}
        
      </div>
      {
        (showCountText || showCountText === undefined) ?
          <Typography className={classes.title + " toolbar_counter_text"} color="inherit" variant="subtitle1" component="div">
            {<><b>{rowCount}</b><span style={spanstyle}></span> {title == undefined ? t(id) : title} {(searchResultText?.type && advanceSearchText.length == 0)   && <div className='searchResultText'>
            [<span className='s-type'>{searchResultText?.type}</span>
            <span className='s-name'>{searchResultText?.name}</span>]
            </div>}
              {advanceSearchText && advanceSearchText.length > 0 && <div className='searchResultText'>[<div className='searchType'>{ui.length == 1 ? "Advanced Search Term" : "Advanced Search Term(s)"}:</div>
              {advanceSearchText.map((x : any,_: any) => {
                if(x.isUsed == true) {
                    return <div className='advance-type advance-type-count'><div className='valueName'>{x.value}</div> : <div className='valueData'>{x.inputValue}</div><span className="CRXComma">,</span></div>
                  }else {
                    return false
                  }
              })}
              ]</div>}
            
            </>}
          </Typography> : <></>
      }
      {
        
        (showTotalSelectedText || showTotalSelectedText === undefined) && numSelected > 0 ?
          <Typography className={classes.title + " toolbar_counter_text"} color="inherit" variant="subtitle1" component="div">
            {<><b>{numSelected}</b><span style={spanstyle}></span> {t("selected")} {title && title == undefined ? id : title } </>}
          </Typography> : <></>
      }

    {/* <><b>{rowCount}</b> { t(id)} </>
    <>{numSelected} {t(id)} </> */}

      {headCells.length > 0 ?
      <div className='expandViewButton'>
        {showSearchPanel}
      </div> : ""
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
          presetPerUser= {presetPerUser}
        />
      }

    </Toolbar>
    
    </>
  );
};

export default DataTableToolbar;


