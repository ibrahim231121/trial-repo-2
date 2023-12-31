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

  return (
    <TableHead style={{"top" : searchHeaderPosition + "px"}} className="searchable_header">
      <TableRow
      data-qa="filters-row"
      >
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
            className={classes.searchHeaderStickness + " TableSearchAbleHead dragHeadFirstCol dataTableActionColumn"}
            style={{
            left: "90px", 
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
            className={classes.searchHeaderStickness + " TableSearchAbleHead dragHeadsecondCol dataTableCheckBoxColumn"}
            style={{
            width: "80px",
            minWidth : "80px",
            left :`${showCheckBoxesCol == true || showCheckBoxesCol == undefined ? "150px" : "89px"}`,
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
