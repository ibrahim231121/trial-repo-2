import React, { useEffect, useRef } from "react";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {
  useStyles,
  DataTableContainerProps,
} from "./CRXDataTableTypes";
import DataTableBody from "./CRXDataTableBody";
import CRXDataTableStickyHeaders from './CRXDataTableStickyHeaders'
const DataTableContainer: React.FC<DataTableContainerProps> = ({
  id,
  keyId,
  orderColumn,
  headCells,
  orderData,
  selectedItems,
  container,
  actionComponent,
  page,
  rowsPerPage,
  className,
  searchHeader,
  onHandleClick,
  onHandleRequestSort,
  onMoveReorder,
  onReorderEnd,
  onResizeRow,
  allColHide,
  getRowOnActionClick,
  dragVisibility,
  showCheckBoxesCol,
  showActionCol,
  showActionSearchHeaderCell,
  onSetCheckAll,
  checkAllPageWise,
  initialRows,
  offsetY,
  showHeaderCheckAll,
  selfPaging
}) => {

  //NOTE : Sticky Header code block please dont do the any changes on this block 
  const classes = useStyles();
  const [stickeyStickyScroll, setStickeyStickyScroll] = React.useState(0)
  const [bodyCellWidth, setBodyCellWidth] = React.useState<any>()
  const scrolled50Ref:any = React.useRef();
  
  useEffect(() => {
    const tableScrollValue = document.getElementsByClassName("tableScrollValue")[0];
    
    const userTabId = document.querySelector("#crx-tabpanel-1");
    const userTabId_tabs = document.querySelector("#crx-tabpanel-2");
    const scrollFun = () => {
      const tbl : any = document.getElementsByClassName('tableHeaderVisibility')[0];
      const tbl2 : any = document.getElementsByClassName("visibleTable")[0];
      if (offsetY && window.pageYOffset > 40 || userTabId && userTabId?.scrollTop > 100 || userTabId_tabs && userTabId_tabs?.scrollTop > 74) {
        
        if (!scrolled50Ref.current) {
          
          scrolled50Ref.current = true;
          tbl.children[0].style.visibility = "collapse";
          tbl.children[1].style.visibility = "collapse";

          tbl2.children[0].style.visibility = "visible";
          tbl2.children[1].style.visibility = "visible";
         
        }

      } else {

        scrolled50Ref.current = false;
        tbl.children[0].style.visibility = "visible";
        tbl.children[1].style.visibility = "visible";

        tbl2.children[0].style.visibility = "collapse";
        tbl2.children[1].style.visibility = "collapse";
       
      }
      
      setStickeyStickyScroll(tableScrollValue.scrollLeft);
      
    };
    
      userTabId?.addEventListener("scroll", scrollFun)
      userTabId_tabs?.addEventListener("scroll", scrollFun)
      window.addEventListener("scroll", scrollFun);
      tableScrollValue.addEventListener("scroll", scrollFun);

    return () => {

      window.removeEventListener("scroll", scrollFun);
      tableScrollValue.removeEventListener("scroll", scrollFun);
      userTabId?.removeEventListener("scroll", scrollFun)
      userTabId_tabs?.removeEventListener("scroll", scrollFun)

    };

  }, []);

const tableHeader = useRef(null);

useEffect(()=> {
  const stickyTableHeader = document.getElementsByClassName("stickyTableHeader")[0];
  stickyTableHeader.scrollLeft = stickeyStickyScroll;
},[stickeyStickyScroll])
  return (
    <>
    
   <TableContainer
      id="customizedStickyHeader"
      ref={tableHeader}
      className={classes.container + " AssetsDataGrid stickyTableHeader  " + className}
      style={{overflowX : "hidden", position: "sticky", top : offsetY + "px", zIndex : "100", transition: "all 1s ease-in-out !important"}}
      component={Paper}
    >
    <Table
        className={"CRXDataTableCustom visibleTable " + classes.table}
        style={{
          width: `${allColHide === undefined || allColHide ? "140px" : "auto"}`,
        }}
        aria-label="simple table"
        size="small"
        stickyHeader
      >
        
     <CRXDataTableStickyHeaders
          id={id}
          orderColumn={orderColumn}
          headCells={headCells}
          orderData={orderData}
          selectedItems={selectedItems}
          container={container}
          initialRows={initialRows}
          actionComponent={actionComponent}
          searchHeader={searchHeader}
          page={page}
          onMoveReorder={onMoveReorder}
          onReorderEnd={(e: any, _) => onReorderEnd(e, _)}
          onResizeRow={(e: any) => onResizeRow(e)}
          getRowOnActionClick={getRowOnActionClick}
          onHandleRequestSort={(e) => onHandleRequestSort(e)}
          onSetCheckAll={onSetCheckAll}
          dragVisibility={dragVisibility}
          showCheckBoxesCol={showCheckBoxesCol}
          showActionCol={showActionCol}
          showActionSearchHeaderCell={showActionSearchHeaderCell}
          showHeaderCheckAll={showHeaderCheckAll}
          checkAllPageWise={checkAllPageWise}
          setBodyCellWidth={setBodyCellWidth}
        />

        </Table>
        </TableContainer> 
       
    <TableContainer
      className={classes.container + " AssetsDataGrid tableScrollValue " + className}
      component={Paper}
    >
      
      <Table
        className={"CRXDataTableCustom  tableHeaderVisibility " + classes.table}
        style={{
          width: `${allColHide === undefined || allColHide ? "140px" : "auto"}`,
        }}
        aria-label="simple table"
        size="small"
        stickyHeader
      >
        
        <CRXDataTableStickyHeaders
          id={id}
          orderColumn={orderColumn}
          headCells={headCells}
          orderData={orderData}
          selectedItems={selectedItems}
          container={container}
          initialRows={initialRows}
          actionComponent={actionComponent}
          searchHeader={searchHeader}
          page={page}
          onMoveReorder={onMoveReorder}
          onReorderEnd={(e: any, _) => onReorderEnd(e, _)}
          onResizeRow={(e: any) => onResizeRow(e)}
          getRowOnActionClick={getRowOnActionClick}
          onHandleRequestSort={(e) => onHandleRequestSort(e)}
          onSetCheckAll={onSetCheckAll}
          dragVisibility={dragVisibility}
          showCheckBoxesCol={showCheckBoxesCol}
          showActionCol={showActionCol}
          showActionSearchHeaderCell={showActionSearchHeaderCell}
          showHeaderCheckAll={showHeaderCheckAll}
          checkAllPageWise={checkAllPageWise}
          setBodyCellWidth={setBodyCellWidth}
        />

        <DataTableBody
            page={page}
            rowsPerPage={rowsPerPage}
            orderColumn={orderColumn}
            selectedItems={selectedItems}
            headCells={headCells}
            container={container}
            actionComponent={actionComponent}
            keyId={keyId}
            onSetSelectedItems={(row: any) => onHandleClick(row)}
            getRowOnActionClick={getRowOnActionClick}
            dragVisibility={dragVisibility}
			      showCheckBoxesCol={showCheckBoxesCol}
            showActionCol={showActionCol}
            bodyCellWidth={bodyCellWidth}
            selfPaging={selfPaging}
          />
      </Table>
      
    </TableContainer>
      <div className="overlayPanel"></div>
    </>
  );
};

export default DataTableContainer;
