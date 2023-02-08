import React, { useEffect, useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Draggable from "react-draggable";
import { useStyles, DataTableHeaderProps } from "./CRXDataTableTypes";
import { useTranslation } from "react-i18next";
const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  id,
  orderColumn,
  headCells,
  orderData,
  onHandleRequestSort,
  //   onResizeRow,
  viewName,
  showCheckBoxesCol,
  showActionCol,
  setBodyCellWidth,
  expanViews,
}) => {
  const classes = useStyles();
  const { t } = useTranslation<string>();
  const [clientWidth, setClientWidth] = useState<any>([]);

  const [resizeWidth, setResizeWidth] = useState<any>();

  React.useEffect(() => {
    const divWidth = document.getElementsByClassName("getWidth");
      setClientWidth(divWidth);
  }, []);

  let finalWidth =
    resizeWidth &&
    resizeWidth.deltaX + clientWidth[(resizeWidth.colIdx)].clientWidth + "px";

    React.useEffect(() => {
      
      setBodyCellWidth({finalWidth, resizeWidth })
    },[resizeWidth]);
  

  //

  const resizeRow = (e: { colIdx: number; deltaX: number, colID : any }) => {
    setResizeWidth(e);
  };

  const getGridColWidth = (window : any) => {
    let winMinus : any;
    let colWidth : any;
    if(showCheckBoxesCol == true && showActionCol == true && viewName === "assetListerView") {

        winMinus = window - 253;
    }else if (showCheckBoxesCol == false && showActionCol == true) {

        winMinus = window;
    }else if (showCheckBoxesCol == true && showActionCol == false) {

        winMinus = window - 173;
    }else {

       winMinus = window - 286.5;
    }
    
   
    if(window < 1600 && window > 1365)  {
      
        headCells && headCells.map((x:any, i : any) => {
          let assetIdMinu = (x.id != "id" || x.id != "assetId" && headCells.length > 6) ? winMinus - 141 : winMinus - 60;
          let valueInPercentage : any = (assetIdMinu / window) * 100
          console.log("valueInPercentage", valueInPercentage)

            if(x.id != "id" && x.id != "assetId" && headCells.length > 6) {
                if(i < 7 ) {
                  colWidth = x.minWidth = Math.round(assetIdMinu / 6);
                }
            }else if(headCells.length > 6 ) {
              if(i <= 6) {
                colWidth = x.minWidth = Math.round(assetIdMinu / 5);
              }
            }else if(headCells.length == 6 ) {
              if(i <= 5) {
                const minColWidth = winMinus - 78
                colWidth = x.minWidth = (Math.round(minColWidth / 6));
              }
            }else if(headCells.length == 5 ){
              if(i < 6 && i != 0 && showActionCol == true && showCheckBoxesCol == false) {
                
                const minColWidths = assetIdMinu  - 165;
                colWidth = x.minWidth = (Math.round(minColWidths / 4));
                
              }else if(i < 6 && i != 0 && showActionCol == true && showCheckBoxesCol == true) {
               
                const minColWidths = assetIdMinu + 52;
                colWidth = x.minWidth = (Math.round(minColWidths / 4));
              }
            }else if(headCells.length < 3){
              if(i < 3 && i != 0) {
                
                const forOneColumn = winMinus - 20;
                colWidth = x.minWidth = (Math.round(forOneColumn));
              }
            }else if(headCells.length == 4){
              if(i < 4 && i != 0) {
                
                const forThreeColumn = assetIdMinu - 140
                colWidth = x.minWidth = (Math.round(forThreeColumn / 3));
              }
            }else {
              if(i != 0) {
                const forTwoColumn = winMinus - 46
                colWidth = x.minWidth = (Math.round(forTwoColumn / 2));
              }
            }
          return colWidth
      })
    }
  }

  useEffect(() => {
    const win = window.screen.width;
   getGridColWidth(win);
   
  },[])

  const gridColumnWidthExpand = (window : any) => {
    
    if(window > 1680 && expanViews === true) {
      
        const dx = headCells && headCells.map((x : any, _ : any) => {
        let calcWidth : any = 0;
        calcWidth += parseInt(x.minWidth);
          return calcWidth;
        })
        
        const totalGridWidth = dx.reduce((d : any, a:any) => d + a, 0);
      
        const PercentageFullwidth = totalGridWidth / 1920;
        const Percentage = PercentageFullwidth  * 100;
        
        const PercentageToPixel = Percentage * window / 100;
        
        let colWidths : any; 
        headCells && headCells.map((x : any, _ : any) => {
        
        //let calcCol = parseInt(x.minWidth) / totalGridWidth * 100;
        
        // let colPercentangeToPX = calcCol * PercentageToPixel / 100;

        let getRemaining = window - PercentageToPixel;
          if(PercentageToPixel < window && x.id != "id") {
              let oneColumn = Math.round(getRemaining / headCells.length);
              colWidths = x.minWidth = parseInt(x.minWidth) + oneColumn;
          }else {
             colWidths = x.minWidth = parseInt(x.minWidth);
          }
          
      
          return colWidths;
        })
    }
  }
  useEffect(() => {
     gridColumnWidthExpand(window.screen.width) 
  }, [expanViews])

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

      {orderColumn.map((colIdx, i) => (
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
            className={classes.headerCellDiv + " crxTableHeaderSize getWidth"}
            id={headCells[colIdx].id}
            style={{
              minWidth: "100%",
              width:
                colIdx === resizeWidth?.colIdx
                  ? finalWidth : headCells[colIdx].id == "assetId" ? "121px" : 
                   headCells[colIdx].minWidth + "px",
              
            }}
            
          >
            <div className={classes.headerStickness} key={headCells[colIdx].id}>
              <label>{headCells[colIdx].label}</label>
            </div>
            <div className="gridSortResize">
              {headCells[colIdx].sort === true ? (
                <span
                  className="GridSortIcon"
                  onClick={() => onHandleRequestSort(id == "assetDataTable" ? headCells[colIdx].id : headCells[colIdx].attributeName)} 
                >
                  {orderData.orderBy === (id == "assetDataTable" ? headCells[colIdx].id : headCells[colIdx].attributeName) ? (
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
                  resizeRow({
                    //Using deltax.x because of consistant value in x direction (drag) divide by 3 because of react dragable doc says.
                    colIdx,
                    deltaX: deltaX.x / 2,
                    colID : headCells[colIdx].id
                  });
                  console.log("deltaX", deltaX)
                }}
                onStop={() => {
                  const memo: any = {};
                  for (i = 0; i < clientWidth.length; i++) {
                    if (clientWidth[colIdx + 2] in memo)
                      return clientWidth[colIdx + 2].id;
                    if (clientWidth[colIdx + 2].id == headCells[colIdx].id) {
                      memo[clientWidth[colIdx + 2]] =
                        clientWidth[colIdx + 2].id;

                      headCells[colIdx].width =
                        resizeWidth.deltaX +
                          clientWidth[colIdx + 2].clientWidth >
                        (headCells[colIdx]?.minWidth || 125)
                          ? resizeWidth.deltaX +
                            clientWidth[colIdx + 2].clientWidth
                          : headCells[colIdx].minWidth;
                    }
                  }
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
