import React, { useEffect, useRef } from "react";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { DataTableBodyProps } from "./CRXDataTableTypes";
import RootRef from "@material-ui/core/RootRef";
import { Draggable, Droppable } from "react-beautiful-dnd";
import CRXCheckBox from "../controls/CRXCheckBox/CRXCheckBox";
import CRXTooltip from "../controls/CRXTooltip/CRXTooltip";
import { useTranslation } from "react-i18next";

const DataTableBody: React.FC<DataTableBodyProps> = ({
  page,
  rowsPerPage,
  orderColumn,
  selectedItems,
  headCells,
  container,
  actionComponent,
  keyId,
  onSetSelectedItems,
  getRowOnActionClick,
  dragVisibility,
  showCheckBoxesCol,
  showActionCol,
  lightMode,
  bodyCellWidth,
  selfPaging,
  totalRecords
  
}) => {
  const { t } = useTranslation<string>();
  const isSelected = (id: string) => {
    const findIndex = selectedItems.findIndex((val: any) => val.id == id);
    return findIndex === -1 ? false : true;
  };
  const [showScroll, setShowScroll] = React.useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 10) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 10) {
      setShowScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleChange = (row: any) => {
    onSetSelectedItems(row);
  };

  const onMouseEvent = (row: any) => {
   
    if (selectedItems.length > 0)
      localStorage.setItem("AssetContainer", JSON.stringify(selectedItems));
    else localStorage.setItem("AssetContainer", JSON.stringify([row]));
  };

 
  React.useEffect(() => {
    const trAtiveValue = document
      .querySelector(".rc-menu-button--open")
      ?.closest(".MuiTableRow-root.MuiTableRow-hover");
    let dataui = document.querySelectorAll(".MuiTableRow-root");
    let trAtiveArray = Array.from(dataui);
    trAtiveArray.map((e) => {
      if (e.classList.contains("SelectedActionMenu") && !trAtiveValue) {
        e.classList.remove("SelectedActionMenu");
      } else {
        trAtiveValue?.classList.add("SelectedActionMenu");
      }
    });
  });

  const node = useRef();
  const handleClickOutside = () => {
    let dataui = document.querySelectorAll(".MuiTableRow-root");
    let trAtiveArray = Array.from(dataui);
    trAtiveArray.map((e: any) => {
      if (e.classList.contains("SelectedActionMenu")) {
        e.classList.remove("SelectedActionMenu");
      }
    });
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const OnResizeHeader = (headCellId : any) => {
    let width = bodyCellWidth != undefined && 
    bodyCellWidth.resizeWidth != undefined &&
    bodyCellWidth.finalWidth != undefined &&
    headCellId == bodyCellWidth?.resizeWidth.colID ? 
    bodyCellWidth?.finalWidth : "0px";
    
    const removePx = width.slice(0, 3);
    let cellFinalWidth = parseInt(removePx) + 6 + "px";
    
    return cellFinalWidth;

  }
 
  let containerRows = selfPaging ? container.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : container.rows

  const DisabledAction = headCells.filter((n) => n.isDisabledActionFunction?.key === true).map((v) => v)[0];
  
  return (
    <>
    
      <Droppable
        droppableId={container.id}
        key={container.id}
        isDropDisabled={true}
      >
        
        {(provided: any) => (
          <RootRef rootRef={provided.innerRef}>
            <TableBody className="table_body_">
              {
                //container.rows
                //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                containerRows.length > 0 ? containerRows
                .map((row: any, index: number) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `checkbox with default color-${index}`;
                  return (
                    <React.Fragment key={index}>
                      <TableRow
                        hover
                        id={row.id}
                        key={row[keyId]}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        selected={isItemSelected}
                        data-qa={"table-row" + "-" + index}
                      >
                       
                        {showCheckBoxesCol === true ||
                        showCheckBoxesCol === undefined ? (
                          <TableCell
                            style={{
                              left : "90px",
                              zIndex : "2"
                            }}
                            className="DataTableBodyCell CellCheckBox col-two dataTableActionColumn"
                            scope="row"
                            data-qa="action-col"
                          >
                             {dragVisibility === true ||
                        dragVisibility === undefined ? (
                          <div
                            className="dragableCellCustomize"
                            
                          >
                            <Draggable
                              draggableId={row[keyId].toString() + container.id}
                              key={container.id}
                              index={index}
                            >
                              {(provided: any) => (
                                <div
                                  id={
                                    "draggableItem" +
                                    index.toString() +
                                    container.id
                                  }
                                  className="draggableCellIcon"
                                  key={row[keyId]}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <a
                                    className="grid-grip-icon"
                                    onMouseDown={() => onMouseEvent(row)}
                                  >
                                    <i className="fas fa-grip-vertical"></i>
                                  </a>
                                </div>
                              )}
                            </Draggable>
                          </div>
                        ) : null}
                            <CRXCheckBox
                              onChange={() => handleChange(row)}
                              checked={isItemSelected}
                              inputProps={labelId}
                              selectedRow={isItemSelected}
                              lightMode={lightMode}
                            />
                          </TableCell>
                        ) : null}
                        {showActionCol === true ||
                        showActionCol === undefined ? (
                          <TableCell
                            style={{
                              left :`${showCheckBoxesCol == true || showCheckBoxesCol == undefined ? "150px" : "89px"}`,
                              zIndex : "2"
                            }}
                            className="DataTableBodyCell col-three dataTableCheckBoxColumn"
                            scope="row"
                            ref={node}
                          >
                            {
                              DisabledAction && row[DisabledAction.id].toString() == DisabledAction.isDisabledActionFunction?.value ?
                              <CRXTooltip
                                content={
                                  <a 
                                    className="row_anchor_point row_disabled"
                                    onClick={() => getRowOnActionClick(row)} 
                                    data-qa="col-anchor" 
                                  >
                                    {actionComponent}
                                  </a>}
                                arrow={true}
                                title={t(`${DisabledAction &&  DisabledAction.isDisabledActionFunction?.Message}`)}
                                placement="top-start"
                              />
                            :
                              <a 
                                className="row_anchor_point "
                                onClick={() => getRowOnActionClick(row)} 
                                data-qa="col-anchor" 
                              >
                                {actionComponent}
                              </a>

                            }
                            
                          </TableCell>
                        ) : null}
                        {orderColumn.map((colIdx, i) => (
                          <TableCell
                            className="DataTableBodyCell"
                            key={i}
                            align={
                              headCells[colIdx].align === "right"
                                ? "right"
                                : headCells[colIdx].align === "left"
                                ? "left"
                                : "center"
                            }
                            style={{
                              display: `${
                                headCells[colIdx].visible === undefined ||
                                headCells[colIdx].visible === true
                                  ? ""
                                  : "none"
                              }`,
                              whiteSpace:
                                headCells[colIdx].id === "recordingStarted"
                                  ? "nowrap"
                                  : "normal",
                            }}
                          >
                           {
                                headCells[colIdx].detailedDataComponentId !==
                                undefined
                                  ? headCells[colIdx].dataComponent(
                                      row[headCells[colIdx].id],
                                      row[
                                        headCells[colIdx]
                                          .detailedDataComponentId !== undefined
                                          ? headCells[colIdx]
                                              .detailedDataComponentId
                                          : headCells[colIdx].id
                                      ]
                                    )
                                  : headCells[colIdx].dataComponent(
                                      row[headCells[colIdx].id], row[keyId],
                                      
                                    )
                              }
                              
                           <div style={{
                            width:`${OnResizeHeader(headCells[colIdx].id)}`,
                           }}></div>
                          </TableCell>
                        ))
                      
                      }
                      </TableRow>
                    </React.Fragment>
                  );
                }) : <div className="noDataInTable">No records found</div>}
              {provided.placeholder}
            </TableBody>
          </RootRef>
        )}
      </Droppable>
       <i
        className="fas fa-chevron-up gotoTop"
        onClick={scrollTop}
        style={{ display: showScroll &&  totalRecords > 8 ? "flex" : "none" }}
      ></i>
    </>
  );
};

export default DataTableBody;

