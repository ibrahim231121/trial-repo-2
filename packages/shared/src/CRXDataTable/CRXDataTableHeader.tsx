import React, { useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Draggable from "react-draggable";
import { useStyles, DataTableHeaderProps } from "./CRXDataTableTypes";
import { useTranslation } from "react-i18next";
import { fixedColumnAlignment } from './FixedColumnAlignment'
const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  orderColumn,
  headCells,
  orderData,
  onHandleRequestSort,
  //   onResizeRow,
  dragVisibility,
  showCheckBoxesCol,
  showActionCol,
}) => {
  const classes = useStyles();
  const { t } = useTranslation<string>();
  const [clientWidth, setClientWidth] = useState<any>([]);

  const [resizeWidth, setResizeWidth] = useState<any>();

  React.useEffect(() => {
    const divWidth = document.getElementsByClassName("getWidth");

    setClientWidth(divWidth);
  }, []);

  // React.useEffect(() => {
  //   console.log("orderColumn", orderColumn);
  // });

  // console.log("clientWidth", clientWidth);
  // console.log("resizeWidth.colIdx", resizeWidth?.colIdx);

  let finalWidth =
    resizeWidth &&
    resizeWidth.deltaX + clientWidth[resizeWidth.colIdx + 3].clientWidth + "px";

  // console.log("finalWidth", finalWidth);

  const resizeRow = (e: { colIdx: number; deltaX: number }) => {
    setResizeWidth(e);
  };

  return (
    <>
      {/* {dragVisibility === true || dragVisibility === undefined ? (
        <TableCell
          className={
            classes.headerStickness +
            " CRXDataTableLabelCell crxTableHeaderSize"
          }
          style={{
            width: "60px",
            minWidth: "60px",
            left: "-2px",
            position: "sticky",
            zIndex: 4,
          }}
        ></TableCell>
      ) : null} */}
      {showCheckBoxesCol === true || showCheckBoxesCol === undefined ? (
        <TableCell
          className={
            classes.headerStickness +
            " CRXDataTableLabelCell crxTableHeaderSize"
          }
          style={{
            width: "60px",
            minWidth: "60px",
            left: "0px",
            // left: `${fixedColumnAlignment(
            //   dragVisibility,
            //   showCheckBoxesCol,
            //   1
            // )}`,
            //left : dragVisibility && "58px",
            position: "sticky",
            zIndex: 30,
          }}
        ></TableCell>
      ) : null}
      {showActionCol === true || showActionCol === undefined ? (
        <TableCell
          className={
            classes.headerStickness +
            " CRXDataTableLabelCell crxTableHeaderSize"
          }
          style={{
            width: "80px",
            minWidth: "80px",
            // left: `${fixedColumnAlignment(
            //   dragVisibility,
            //   showCheckBoxesCol,
            //   4
            // )}`,
            left : "58px",
            position: "sticky",
            zIndex: 4,
          }}
        >
          {t("Actions")}
        </TableCell>
      ) : null}

      {orderColumn.map((colIdx, i) => (
        //index needs to be CURRENT
        //key needs to be STATIC

        <TableCell
          className={
            classes.headerStickness + " CRXDataTableLabelCell getWidth"
          }
          key={headCells[colIdx].id}
          id={headCells[colIdx].id}
          style={{
            display: `${
              headCells[colIdx].visible === undefined ||
              headCells[colIdx].visible === true
                ? ""
                : "none"
            }`,
            // minWidth:
            //   resizeWidth &&
            //   colIdx === resizeWidth?.colIdx &&
            //   resizeWidth.deltaX +
            //     clientWidth[resizeWidth.colIdx + 3].clientWidth >
            //     249
            //     ? resizeWidth.deltaX +
            //       clientWidth[resizeWidth.colIdx + 3].clientWidth
            //     : "250px",

            userSelect: "none",
            minWidth: headCells[colIdx].minWidth + "px",
            
            
          }}
          align={
            headCells[colIdx].align === "right"
              ? "right"
              : headCells[colIdx].align === "left"
              ? "left"
              : "center"
          }
        >
          
          <div
            className={classes.headerCellDiv + " crxTableHeaderSize"}
            id={headCells[colIdx].id}
            style={{
              minWidth: "100%",
              width:
                colIdx === resizeWidth?.colIdx
                  ? finalWidth
                  : headCells[colIdx].minWidth + "px",
                  
            }}
          >
            <div className={classes.headerStickness} key={headCells[colIdx].id}>
              <label>{headCells[colIdx].label}</label>
            </div>
            <div className="gridSortResize">
              {headCells[colIdx].sort === true ? (
                <span
                  className="GridSortIcon"
                  onClick={() => onHandleRequestSort(headCells[colIdx].id)}
                >
                  {orderData.orderBy === headCells[colIdx].id ? (
                    <span>
                      {orderData.order === "desc" ? (
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          className={classes.iconArrows}
                        >
                          <i className="fas fa-sort-up"></i>
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          className={classes.iconArrows}
                        >
                          <i className="fas fa-sort-down"></i>
                        </IconButton>
                      )}
                    </span>
                  ) : (
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      className={classes.iconArrows}
                    >
                      <i className="fas fa-sort"></i>
                    </IconButton>
                  )}
                </span>
              ) : null}
              <Draggable
                axis="none"
                defaultClassName="DragHandle"
                defaultClassNameDragging="DragHandleActive"
                onDrag={(_, deltaX) => {
                  resizeRow({
                    //Using deltax.x because of consistant value in x direction (drag) divide by 2 because of react dragable doc says.
                    colIdx,
                    deltaX: deltaX.x / 2,
                  });
                }}
                onStop={() => {
                  const memo: any = {};
                  for (i = 0; i < clientWidth.length; i++) {
                    if (clientWidth[colIdx + 3] in memo)
                      return clientWidth[colIdx + 3].id;
                    if (clientWidth[colIdx + 3].id == headCells[colIdx].id) {
                      memo[clientWidth[colIdx + 3]] =
                        clientWidth[colIdx + 3].id;

                      headCells[colIdx].minWidth =
                        resizeWidth.deltaX +
                        clientWidth[colIdx + 3].clientWidth;
                    }
                  }

                  // clientWidth.map((item, index, arr) => {
                  //   console.log(item[index].id);
                  // });

                  // console.log("Stoped");
                  // headCells[resizeWidth.colIdx + 3].minWidth =
                  //   resizeWidth.deltaX +
                  //     clientWidth[resizeWidth.colIdx + 3].clientWidth >
                  //   249
                  //     ? resizeWidth.deltaX +
                  //       clientWidth[resizeWidth.colIdx + 3].clientWidth
                  //     : headCells[resizeWidth.colIdx + 3].minWidth;
                }}
                position={{ x: 0, y: 0 }}
              >
                <span className="DragHandleIcon"></span>
              </Draggable>
            </div>
          </div>
        </TableCell>
      ))}
    </>
  );
};

export default DataTableHeader;
