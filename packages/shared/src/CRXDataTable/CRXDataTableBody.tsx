import React from "react";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { DataTableBodyProps } from "./CRXDataTableTypes";
import { Draggable } from "react-beautiful-dnd";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
// import IconButton from '@material-ui/core/IconButton';
import CRXCheckBox from "../controls/CRXCheckBox/CRXCheckBox";

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
}) => {
  const isSelected = (id: string) => {
    const findIndex = selectedItems.findIndex((val: any) => val.id == id);
    return findIndex === -1 ? false : true;
  };

  const handleChange = (row: any) => {
    onSetSelectedItems(row);
  };

  const onMouseEvent = (e: any, row: any) => {
    if (selectedItems.length > 0)
      localStorage.setItem("AssetContainer", JSON.stringify(selectedItems));
    else localStorage.setItem("AssetContainer", JSON.stringify([row]));
  };

  return (
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
                {dragVisibility === true || dragVisibility === undefined ? (
                  <TableCell className="DataTableBodyCell col-one" scope="row">
                    {/* <Draggable draggableId={JSON.stringify(selectedItems)} key={row[keyId]} index={index} > */}
                    <Draggable
                      draggableId={row[keyId].toString()}
                      key={row[keyId]}
                      index={index}
                    >
                      {(provided: any) => (
                        <div
                          id={"draggableItem" + index.toString()}
                          className="draggableCellIcon"
                          key={row[keyId]}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DragIndicatorIcon
                            onMouseDown={(e: any) => onMouseEvent(e, row)}
                          />
                        </div>
                        // <ListItem
                        //     id={"draggableItem"+index.toString()}
                        //     className="draggableCellIcon"
                        //     key={row[keyId]}
                        //     role={undefined}
                        //     dense
                        //     button
                        //     ContainerComponent="div"
                        //     ContainerProps={{ ref: provided.innerRef }}
                        //     {...provided.draggableProps}
                        //     {...provided.dragHandleProps}
                        //     >
                        //         <DragIndicatorIcon onMouseDown ={(e) => onMouseEvent(e)} />
                        //     <ListItemSecondaryAction>
                        //         <IconButton
                        //         edge="end"
                        //         aria-label="comments"
                        //         question-uid={row[keyId]}
                        //         >

                        //         </IconButton>
                        //     </ListItemSecondaryAction>

                        // </ListItem>
                      )}
                    </Draggable>
                  </TableCell>
                ) : null}
                <TableCell
                  style={{
                    left: `${dragVisibility === false ? "0px" : "55px"}`,
                  }}
                  className="DataTableBodyCell CellCheckBox "
                  scope="row"
                >
                  <CRXCheckBox
                    onClick={() => handleChange(row)}
                    checked={isItemSelected}
                    inputProps={labelId}
                    selectedRow={isItemSelected}
                    lightMode={true}
                  />
                </TableCell>
                <TableCell
                  style={{
                    left: `${dragVisibility === false ? "62px" : "113px"}`,
                  }}
                  className="DataTableBodyCell "
                  scope="row"
                >
                  <span onClick={() => getRowOnActionClick(row)}>
                    {actionComponent}
                  </span>
                </TableCell>
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
                    }}
                  >
                    {headCells[colIdx].detailedDataComponentId !== undefined
                      ? headCells[colIdx].dataComponent(
                          row[headCells[colIdx].id],
                          row[
                            headCells[colIdx].detailedDataComponentId !==
                            undefined
                              ? headCells[colIdx].detailedDataComponentId
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
      {/* {provided.placeholder} */}
    </TableBody>
  );
};

export default DataTableBody;
