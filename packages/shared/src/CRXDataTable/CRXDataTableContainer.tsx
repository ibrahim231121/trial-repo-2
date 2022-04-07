import React, { useEffect, useRef, useState } from "react";
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
  //headerOffSetY
}) => {

  //NOTE : Sticky Header code block please dont do the any changes on this block 
  const classes = useStyles();
  const [stickeyStickyScroll, setStickeyStickyScroll] = React.useState(0)
  const [getScroll, setScrollVal] = useState<number>(0);
  const [sliderThumbs, setScrollWidth] = useState<number>()
  const [sliderValue, setSliderVal] = useState<number>(0)

  const scrolled50Ref:any = React.useRef();
  
  useEffect(() => {
    const tableScrollValue = document.getElementsByClassName("tableScrollValue")[0];
    setScrollVal(tableScrollValue.clientWidth);
    const scrollClientWidth:number = tableScrollValue.scrollWidth - tableScrollValue.clientWidth;
    
    setScrollWidth(scrollClientWidth)

    const scrollFun = () => {
      const tbl : any = document.getElementsByClassName('tableHeaderVisibility')[0];
      const tbl2 : any = document.getElementsByClassName("visibleTable")[0];
      
      if (offsetY && window.pageYOffset > 40) {

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

      window.addEventListener("scroll", scrollFun);
      tableScrollValue.addEventListener("scroll", scrollFun);

    return () => {

      window.removeEventListener("scroll", scrollFun);
      tableScrollValue.removeEventListener("scroll", scrollFun);

    };

  }, []);

const tableHeader = useRef(null);
  
const tableScrollChnage = (e : any) => {
  setStickeyStickyScroll(e.target.value);
  setSliderVal((e.target.value));
  console.log("Slider value : ", e.target.value)
  const stickyTableHeader = document.getElementsByClassName("stickyTableHeader")[0];
  const tableScrollValue = document.getElementsByClassName("tableScrollValue")[0];

  if(stickyTableHeader) {
      stickyTableHeader.scrollLeft = e.target.value + 10;
      tableScrollValue.scrollLeft = e.target.value + 10;
  }

} 

useEffect(()=> {
  const stickyTableHeader = document.getElementsByClassName("stickyTableHeader")[0];
  stickyTableHeader.scrollLeft = stickeyStickyScroll;
},[stickeyStickyScroll])
  return (
    <>
   <TableContainer
      ref={tableHeader}
      className={classes.container + " AssetsDataGrid stickyTableHeader " + className}
      style={{overflowX : "hidden", position: "sticky", top : offsetY + "px", zIndex : "999", transition: "all 1s ease-in-out !important"}}
      component={Paper}
    >
    <Table
        className={"CRXDataTableCustom " + classes.table + " visibleTable"}
        style={{
          width: `${allColHide === undefined || allColHide ? "188px" : "100%"}`,
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
          showHeaderCheckAll={false}
          checkAllPageWise={checkAllPageWise}
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
          width: `${allColHide === undefined || allColHide ? "188px" : "100%"}`,
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
          showHeaderCheckAll={false}
          checkAllPageWise={checkAllPageWise}
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
          />
      </Table>
      
    </TableContainer>
      {/* <div className="overlayScroll">
        <input type="range" min="0" max={sliderThumbs} value={sliderValue} className="table-scroll" id="myRange" onChange={(e : any) => tableScrollChnage(e)} />
      </div> */}
      <div className="overlayPanel"></div>
    </>
  );
};

export default DataTableContainer;
