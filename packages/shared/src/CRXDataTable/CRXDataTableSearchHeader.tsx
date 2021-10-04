import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  SearchHeaderProps,
  useStyles,
} from "./CRXDataTableTypes";

const SearchHeader: React.FC<SearchHeaderProps> = ({
  id,
  orderColumn,
  selectedItems,
  headCells,
  orderData,
  container,
  actionComponent,
  dragVisibility,
  showCheckBoxesCol,
  showActionCol,
  showActionSearchHeaderCell,
  getRowOnActionClick,
}) => {
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        {(dragVisibility === true || dragVisibility === undefined) ? 
          <TableCell
            className={
              classes.searchHeaderStickness +
              " TableSearchAbleHead tableSearchHead"
            }
            style={{left: 0, position: "sticky", zIndex: 4 }}
          ></TableCell>
          : null
        }
        {(showCheckBoxesCol === true || showCheckBoxesCol === undefined) ? 
          <TableCell
            padding="checkbox"
            className={classes.searchHeaderStickness + " TableSearchAbleHead"}
            style={{left: `${(dragVisibility === false) ? "0px" : "60px"}`, position: "sticky", zIndex: 4 }}
          ></TableCell>
        : null
        }
        <TableCell
          className={classes.searchHeaderStickness + " TableSearchAbleHead"}
          style={{left: `${dragVisibility === false ? 
                    (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? "0px" : "62px" 
                    : 
                    (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? "62px" : "118px" 
                  }`,
                  position: "sticky", 
                  zIndex: 4 }}
        >
          {(showActionSearchHeaderCell) ?
            <div
              className={
                selectedItems.length > 1 ? "" : "disableHeaderActionMenu"
              }
				onClick={() => getRowOnActionClick(null)}
            >
              {actionComponent}
            </div>
            :
            null
          } 
        </TableCell>
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
                  colIdx
                )
              : null}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default SearchHeader;
