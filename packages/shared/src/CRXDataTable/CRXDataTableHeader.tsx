import React, { useState, useRef } from "react";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Draggable from "react-draggable";
import { useStyles, DataTableHeaderProps } from "./CRXDataTableTypes";
import { useTranslation } from "react-i18next";
const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  orderColumn,
  headCells,
  orderData,
  onHandleRequestSort,
  //   onResizeRow,
  //viewName,
  showCheckBoxesCol,
  showActionCol,
  setBodyCellWidth,
  selfSorting,
  //expanViews,
}) => {
  const classes = useStyles();
  const { t } = useTranslation<string>();
  const [clientWidth, setClientWidth] = useState<any>([]);
  const [resizeWidth, setResizeWidth] = useState<any>();
  const [newWidth, setNewWidth] = useState<any>()
  const colResizeRef : any = useRef(null)

  React.useEffect(() => {
    const divWidth = document.getElementsByClassName("getWidth");
    setClientWidth(divWidth);
    
  }, []);

  let finalWidth : any;

    React.useEffect(() => {
      setBodyCellWidth({finalWidth, resizeWidth })
    },[]);
  

 
  const onDraggingStop = (_ : any, ui : any) => {
    console.log("resizeWidth", newWidth)
    if(clientWidth[resizeWidth.colIdx].id == headCells[resizeWidth.colIdx].id) {
        setNewWidth(ui.x)
    }
  }

  const onDragResize = (e : {colIdx: number; deltaX: number, colID : any }) => {
    setResizeWidth(e);
  }
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
          data-qa="col-1"
          className={
            classes.headerStickness +
            " CRXDataTableLabelCell crxTableHeaderSize dataTableActionColumn"
          }
          style={{
            width: "60px",
            minWidth: "60px",
            left: "90px",
            position: "sticky",
            zIndex: 30,
          }}
        ></TableCell>
      ) : null}
      {showActionCol === true || showActionCol === undefined ? (
        <TableCell
        data-qa="col-action"
          className={
            classes.headerStickness +
            " CRXDataTableLabelCell crxTableHeaderSize dataTableCheckBoxColumn"
          }
          style={{
            width: "80px",
            minWidth: "80px",
            // left: `${fixedColumnAlignment(
            //   false,
            //   showCheckBoxesCol,
            //   2
            // )}`,
            left :`${showCheckBoxesCol == true || showCheckBoxesCol == undefined  ? "150px" : "89px"}`,
            position: "sticky",
            zIndex: 4,
          }}
        >
          {t("Actions")}
        </TableCell>
      ) : null}

      {orderColumn.map((colIdx, _) => (
        //index needs to be CURRENT
        //key needs to be STATIC

        <TableCell
          className={classes.headerStickness + " CRXDataTableLabelCell"}
          key={headCells[colIdx].id}
          id={headCells[colIdx].id}
          style={{
            display: `${
              headCells[colIdx].visible === undefined ||
              headCells[colIdx].visible === true
                ? ""
                : "none"
            }`,
            userSelect: "none",
            minWidth : headCells[colIdx].id == "assetId" ? "121px" : headCells[colIdx].minWidth + "px",
            width : headCells[colIdx].id == "assetId" ? "121px" : ""
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
          ref={colResizeRef}
            className={classes.headerCellDiv + " crxTableHeaderSize getWidth"}
            id={headCells[colIdx].id}
            style={{
              minWidth: "100%",
              width:colIdx === resizeWidth?.colIdx ? resizeWidth.deltaX + clientWidth[(resizeWidth.colIdx)].clientWidth + "px" : headCells[colIdx].minWidth
            }}
            
          >
            <div className={classes.headerStickness} key={headCells[colIdx].id}>
              <label>{t(headCells[colIdx].label)}</label>
            </div>
            <div className="gridSortResize">
              {headCells[colIdx].sort === true ? (
                <span
                  className="GridSortIcon"
                  onClick={() => onHandleRequestSort(selfSorting ? headCells[colIdx].id : headCells[colIdx].attributeName)} 
                >
                  {orderData.orderBy === (selfSorting ? headCells[colIdx].id : headCells[colIdx].attributeName) ? (
                    <span>
                      {orderData.order === "desc" ? (
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          className={classes.iconArrows}
                        >
                          <i className="fas fa-sort-down"></i>
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          className={classes.iconArrows}
                        >
                          <i className="fas fa-sort-up"></i>
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
                  onDragResize({
                    colIdx,
                    deltaX: deltaX.x,
                    colID : headCells[colIdx].id
                  })
                }}
                onStop={onDraggingStop}
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
