import React, { useEffect } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  SearchHeaderProps,
  useStyles,
  CheckAllPageWise
} from "./CRXDataTableTypes";
import CRXCheckBox from "../controls/CRXCheckBox/CRXCheckBox";

const SearchHeader: React.FC<SearchHeaderProps> = ({
  page,
  orderColumn,
  selectedItems,
  headCells,
  orderData,
  container,
  actionComponent,
  getRowOnActionClick,
  offsetY,
  searchHeaderPosition,
  showCheckBoxesCol,
  showActionCol,
  showActionSearchHeaderCell,
  showHeaderCheckAll,
  onSetCheckAll,
  checkAllPageWise,
  initialRows,
}) => {
  const classes = useStyles();
  const [checkAll, setCheckAll] = React.useState<boolean>(false);

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckAll(event.target.checked);
    onSetCheckAll(event.target.checked)
  }

  useEffect(() => {
    let count: boolean = false
    checkAllPageWise.map((item:CheckAllPageWise) => {
      if(item.page === page)
      {
        count = true
        setCheckAll(true)
      }
    })
    if(!count)
      setCheckAll(false)

  },[page,checkAllPageWise])

  const [windScrollValue, setWindScrollValue] = React.useState<any>(0)
  
  function createScrollStopListener(element : any, callback : any, timeout : number) {
    let handle: any = null;
    const tbl : any = document.getElementsByClassName('tableScrollValue')[0]
    const table2 : any = document.getElementById("customizedStickyHeader");
    const dataTable : any = document.getElementsByClassName('tableHeaderVisibility')[0];
    const onScroll = function() {
        
        if (handle) {
            clearTimeout(handle);
        }
        
        handle = setTimeout(callback, timeout || 200); // default 200 ms
        table2.style.visibility = "visible"
        tbl && ( tbl.style.display = "inline-table")
        tbl && (dataTable.children[0].style.opacity = 0, dataTable.children[1].style.opacity = 0)
        offsetY && window.pageYOffset > offsetY && setWindScrollValue(searchHeaderPosition); 
        
    };

    element.addEventListener('scroll', onScroll);
    return function() {
        element.removeEventListener('scroll', onScroll);
    };
  }
  
  useEffect(() => {
    const tblBlock : any = document.getElementsByClassName('tableScrollValue')[0]
    const dataTableOnStop : any = document.getElementsByClassName('tableHeaderVisibility')[0];
    const dataTableOnScroll : any = document.getElementById("customizedStickyHeader");
    let minSticky : any =  offsetY && (offsetY - 3)
    if(window.pageYOffset == 0 ) {
        dataTableOnScroll.style.visibility = "collapse"
      }
    createScrollStopListener(window, function() {
      dataTableOnScroll.style.visibility = "hidden"
      tblBlock && (dataTableOnStop.children[0].style.opacity = 1, dataTableOnStop.children[1].style.opacity = 1)
      tblBlock && (tblBlock.style.display = "block")
      setWindScrollValue(window.pageYOffset - minSticky)
      
      if(window.pageYOffset == 0 ) {
        dataTableOnScroll.style.visibility = "collapse"
      }
    },100);

  },[windScrollValue])
  
  return (
    <TableHead style={{"top" : windScrollValue +  "px"}}>
      <TableRow>
        {/* {(dragVisibility === true || dragVisibility === undefined) ? 
          <TableCell
            className={
              classes.searchHeaderStickness +
              " TableSearchAbleHead tableSearchHead"
            }
            style={{left: "-2px", position: "sticky", zIndex: 4 }}
          ></TableCell>
          : null
        } */}
        {(showCheckBoxesCol === true || showCheckBoxesCol === undefined) ? 
          <TableCell
            padding="checkbox"
            className={classes.searchHeaderStickness + " TableSearchAbleHead"}
            style={{
            left: "0px", 
            //left: `${fixedColumnAlignment(dragVisibility,showCheckBoxesCol,1)}`, 
                    position: "sticky", 
                    zIndex: 30 }}
          >

            {(showHeaderCheckAll || showHeaderCheckAll === undefined) ? 
              <CRXCheckBox
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleCheckAll(e)}
                checked={checkAll}
                selectedRow={checkAll}
                lightMode={true}
              />
            : null
            }
          </TableCell>
        : null
        }
        {(showActionCol || showActionCol === undefined) ? 
          <TableCell
            className={classes.searchHeaderStickness + " TableSearchAbleHead"}
            style={{
            width: "80px",
            minWidth : "80px",
            left : "60px",
                    position: "sticky", 
                    zIndex: 4 }}
          >
            {((showCheckBoxesCol || showCheckBoxesCol === undefined) && (showActionSearchHeaderCell || showActionSearchHeaderCell === undefined)) ?
              <div
                className={
                  selectedItems.length > 1 ? "" : "disableHeaderActionMenu"
                }
                onClick={() => getRowOnActionClick(null)}
              >
                {actionComponent}
              </div>
              :
              /** Changed code in order to cater the requirement of GEP-1153, */
              (!showCheckBoxesCol && showActionSearchHeaderCell) ?
                  <div onClick={() => getRowOnActionClick(null)}>
                    {actionComponent}
                  </div>
                  :
                  null
            }
          </TableCell>
        : null
        }
        {orderColumn.map((colIdx, _) => (
          <TableCell
            className={classes.searchHeaderStickness + " TableSearchAbleHead"}
            style={{
              display: `${
                headCells[colIdx].visible === undefined ||
                headCells[colIdx].visible === true
                  ? ""
                  : "none"
              }`,
            }}
            key={colIdx}
            align={
              headCells[colIdx].align === "right"
                ? "right"
                : headCells[colIdx].align === "left"
                ? "left"
                : "center"
            }
            //padding={headCells[colIdx].disablePadding ? 'none' : 'default'}
            sortDirection={
              orderData.orderBy === headCells[colIdx].id
                ? orderData.order
                : false
            }
          >
            {headCells[colIdx].searchFilter === true
              ? headCells[colIdx].searchComponent(
                  container.rows,
                  headCells,
                  colIdx,
                  initialRows
                )
              : null}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default SearchHeader;
