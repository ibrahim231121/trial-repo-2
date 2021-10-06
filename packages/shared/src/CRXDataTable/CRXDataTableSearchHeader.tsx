import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  SearchHeaderProps,
  useStyles,
} from "./CRXDataTableTypes";
import { fixedColumnAlignment } from "./FixedColumnAlignment"

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
  dragVisibility,
  showCheckBoxesCol,
  showActionCol,
  showActionSearchHeaderCell
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
            style={{left: `${fixedColumnAlignment(dragVisibility,showCheckBoxesCol,1)}`, 
                    position: "sticky", 
                    zIndex: 4 }}
          ></TableCell>
        : null
        }
        {(showActionCol === true || showActionCol === undefined) ? 
          <TableCell
            className={classes.searchHeaderStickness + " TableSearchAbleHead"}
            style={{left: `${fixedColumnAlignment(dragVisibility,showCheckBoxesCol,2)}`,
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
