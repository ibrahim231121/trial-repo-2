import React, { useRef } from "react";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { DataTableBodyProps } from "./CRXDataTableTypes";
import RootRef from "@material-ui/core/RootRef";
import { Draggable, Droppable } from "react-beautiful-dnd";
import CRXCheckBox from "../controls/CRXCheckBox/CRXCheckBox";
import { fixedColumnAlignment } from "./FixedColumnAlignment";


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
}) => {
  const isSelected = (id: string) => {
    const findIndex = selectedItems.findIndex((val: any) => val.id == id);
    return findIndex === -1 ? false : true;
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
      .querySelector(".rc-menu--open")
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
    console.log(" out side click");
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
  return (
    <>
      <Droppable
        droppableId={container.id}
        key={container.id}
        isDropDisabled={true}
      >
        {(provided: any) => (
          <RootRef rootRef={provided.innerRef}>
            <TableBody>
              {container.rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: number) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `checkbox with default color-${index}`;
                  return (
                    <React.Fragment key={index}>
                      <TableRow
                        hover
                        key={row[keyId]}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        selected={isItemSelected}
                      >
                        {dragVisibility === true ||
                        dragVisibility === undefined ? (
                          <TableCell
                            className="DataTableBodyCell col-one"
                            scope="row"
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
                          </TableCell>
                        ) : null}
                        {showCheckBoxesCol === true ||
                        showCheckBoxesCol === undefined ? (
                          <TableCell
                            style={{
                              //left: `${dragVisibility === false ? "0px" : "60px"}`,
                              left: `${fixedColumnAlignment(
                                dragVisibility,
                                showCheckBoxesCol,
                                1
                              )}`,
                            }}
                            className="DataTableBodyCell CellCheckBox col-two"
                            scope="row"
                          >
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
                              // left: `${dragVisibility === false ?
                              //   (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? "0px" : "62px"
                              //   :
                              //   (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? "62px" : "118px"
                              // }`,
                              left: `${fixedColumnAlignment(
                                dragVisibility,
                                showCheckBoxesCol,
                                2
                              )}`,
                            }}
                            className="DataTableBodyCell col-three"
                            scope="row"
                            ref={node}
                          >
                            <span onClick={() => getRowOnActionClick(row)}>
                              {actionComponent}
                            </span>
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
                                  ? undefined
                                  : "none"
                              }`,
                              whiteSpace:
                                headCells[colIdx].id === "recordingStarted"
                                  ? "nowrap"
                                  : "normal",
                            }}
                          >
                            {headCells[colIdx].detailedDataComponentId !==
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
                                  row[headCells[colIdx].id]
                                )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              {provided.placeholder}
            </TableBody>
          </RootRef>
        )}
      </Droppable>
    </>
  );
};

export default DataTableBody;
