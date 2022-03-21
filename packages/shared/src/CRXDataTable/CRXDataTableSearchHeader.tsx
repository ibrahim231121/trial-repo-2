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
import { fixedColumnAlignment } from "./FixedColumnAlignment"

const SearchHeader: React.FC<SearchHeaderProps> = ({
  page,
  orderColumn,
  selectedItems,
  headCells,
  orderData,
  container,
  actionComponent,
  getRowOnActionClick,
  dragVisibility,
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
            style={{//left: "60px", 
            left: `${fixedColumnAlignment(dragVisibility,showCheckBoxesCol,1)}`, 
                    position: "sticky", 
                    zIndex: 4 }}
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
            style={{//left: "118px",
            left: `${fixedColumnAlignment(dragVisibility,showCheckBoxesCol,2)}`,
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
