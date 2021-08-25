import React, { useState, useCallback, useEffect } from "react";
// import IconButton from '@material-ui/core/IconButton';
import {
  Order,
  OrderData,
  useStyles,
  DataTableProps,
  HeadCellProps,
  OrderValue,
  theme,
} from "./CRXDataTableTypes";
import TablePagination from "@material-ui/core/TablePagination";
import DataTableToolbar from "./CRXDataTableToolbar";
import { ThemeProvider } from "@material-ui/core/styles";
//import { DragDropContext, Droppable } from "react-beautiful-dnd";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemText from "@material-ui/core/ListItemText";
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
// import DeleteIcon from "@material-ui/icons/Delete";
// import RootRef from "@material-ui/core/RootRef";
// import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import "./CRXDataTable.scss";
import { useTranslation } from "react-i18next";
import DataTableContainer from "./CRXDataTableContainer";

const CRXDataTable: React.FC<DataTableProps> = ({
  dataRows,
  headCells,
  orderParam,
  orderByParam,
  className,
  searchHeader,
  columnVisibilityBar,
  allowDragableToList,
  allowRowReOrdering,
  actionComponent,
  onClearAll,
  onResizeRow,
  getSelectedItems,
  onHeadCellChange,
  getRowOnActionClick,
  dragVisibility,
  showToolbar,
}) => {
  const classes = useStyles();
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [open, setOpen] = React.useState<boolean>(false);
  const [orderData, setOrderData] = React.useState<OrderData>({
    order: orderParam,
    orderBy: orderByParam,
  });
  const [orderColumn, setOrderColumn] = useState(
    new Array(headCells.length).fill(null).map((_, i) => i)
  );
  const { t } = useTranslation<string>();
  const keyId = headCells
    .filter((n) => n.keyCol === true)
    .map((v) => v.id)
    .toString();
  const [allColHide, setAllColHide] = React.useState<boolean>(false);

  const secondRows: HeadCellProps[] = [];

  let initialContainers: any = {
    dataTable: {
      id: "dataTable",
      rows: dataRows,
    },
    list: {
      id: "list",
      rows: secondRows,
    },
  };

  const [containers, setContainers] = useState(initialContainers);

  useEffect(() => {
    let rows = stableSort(
      dataRows,
      getComparator(orderData.order, orderData.orderBy)
    );
    const dataTable = {
      id: "dataTable",
      rows: rows,
    };

    setContainers((state: any) => ({ ...state, [dataTable.id]: dataTable }));

    let checkOrderPreset = localStorage.getItem("checkOrderPreset");

    if (checkOrderPreset !== null) {
      let arr = JSON.parse(checkOrderPreset).map((x: OrderValue) => x.order);
      setOrderColumn(arr);

      // JSON.parse(checkOrderPreset).map((x: OrderValue) => {
      //   headCells[x.order].visible = x.value
      // })

      let headCellOrder: HeadCellProps[] = headCells;
      let headCellsArray = JSON.parse(checkOrderPreset).map(
        (x: OrderValue, index: number) => {
          headCellOrder[x.order].visible = x.value;
          return headCellOrder[index];
        }
      );
      onHeadCellChange(headCellsArray);
    }
  }, []);

  useEffect(() => {
    setContainers(initialContainers);
  }, [dataRows]);

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    containers.dataTable.rows = stabilizedThis.map((el) => el[0]);
    return containers.dataTable.rows;
  }

  const handleRequestSort = async (property: any) => {
    const isAsc = orderData.orderBy === property && orderData.order === "asc";
    setOrderData({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  useEffect(() => {
    stableSort(
      containers.dataTable.rows,
      getComparator(orderData.order, orderData.orderBy)
    );
    if (open === true) setOpen(false);
    else setOpen(true);
  }, [orderData]);

  const handleClick = (row: any) => {
    const { id } = row;
    const found = selectedItems.find(
      (selectedItem: any) => selectedItem.id === id
    );
    if (found) {
      const newSelected = selectedItems.filter(
        (selectedItem: any) => selectedItem.id !== id
      );
      setSelectedItems(newSelected);
    } else {
      setSelectedItems((prev) => [...prev, row]);
    }
  };

  useEffect(() => {
    getSelectedItems(selectedItems);
  }, [selectedItems]);

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onReorderEnd = useCallback(
    ({ oldIndex, newIndex }, _) => {
      const newOrder = [...orderColumn];
      const moved = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved[0]);
      setOrderColumn(newOrder);
    },
    [orderColumn, setOrderColumn]
  );

  const onMoveReorder = (e: any) => {
    let targetHead = e.helper;
    if (targetHead != null) {
      targetHead.innerHTML += '<i class="fas fa-grip-vertical dragIcon"></i>';
    }
  };

  function onColumnVisibility() {
    let a = 0;

    headCells.map((x, _) => {
      if (!x.visible) {
        a = a + 1;
        if (a === headCells.length) setAllColHide(true);
        else setAllColHide(false);
      }
    });
    //setOpen(!open)
  }

  const onDragEnd = (e: any) => {
    console.log("Drag End", e);
    // Make sure we have a valid destination
    if (e.destination === undefined || e.destination === null) return null;
    // Make sure we're actually moving the item
    if (
      e.source.droppableId === e.destination.droppableId &&
      e.destination.index === e.source.index
    )
      return null;

    // Set start and end variables
    const start = containers[e.source.droppableId];
    const end = containers[e.destination.droppableId];

    const startIndex = e.source.index + page * rowsPerPage;
    let destinationIndex = e.destination.index;

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      if (allowRowReOrdering) {
        console.log("If");
        const newList = start.rows.filter(
          (_: any, idx: any) => idx !== startIndex
        );
        destinationIndex = e.destination.index + page * rowsPerPage;
        // Then insert the item at the right location
        newList.splice(destinationIndex, 0, start.rows[startIndex]);

        // Then create a new copy of the column object
        const newCol = {
          id: start.id,
          rows: newList,
        };

        // Update the state
        setContainers((state: any) => ({ ...state, [newCol.id]: newCol }));
      }
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      //const newStartList = start.rows.filter((_: any, idx: any) => idx !== source.index);
      console.log("Else");
      // Create a new start column
      const newStartCol = {
        id: start.id,
        //rows: newStartList
        rows: start.rows,
      };

      // Make a new end list array
      const newEndList = end.rows;

      // Insert the item into the end list
      newEndList.splice(destinationIndex, 0, start.rows[startIndex]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        rows: newEndList,
      };

      // Update the state
      setContainers((state: any) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  return (
    // <DragDropContext onDragEnd={onDragEnd} >
    // </DragDropContext>
    <>
      {Object.values(containers).map((container: any) => {
        return (
          <React.Fragment key={container.id}>
            <Grid item>
              {container.id === "dataTable" ? (
                <ThemeProvider theme={theme}>
                  <div className={classes.root}>
                    {(showToolbar === undefined || showToolbar === true) && (
                      <DataTableToolbar
                        numSelected={selectedItems.length}
                        headCells={headCells}
                        rowCount={container.rows.length}
                        columnVisibilityBar={columnVisibilityBar}
                        onChange={onColumnVisibility}
                        onClearAll={() => onClearAll()}
                        onReOrder={(e: number[]) => setOrderColumn(e)}
                        orderingColumn={orderColumn}
                        onHeadCellChange={onHeadCellChange}
                      />
                    )}

                    <DataTableContainer
                      orderColumn={orderColumn}
                      headCells={headCells}
                      orderData={orderData}
                      selectedItems={selectedItems}
                      container={container}
                      actionComponent={actionComponent}
                      className={className}
                      searchHeader={searchHeader}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      keyId={keyId}
                      onHandleClick={handleClick}
                      onHandleRequestSort={handleRequestSort}
                      onMoveReorder={onMoveReorder}
                      onReorderEnd={(e: any, _) => onReorderEnd(e, _)}
                      onResizeRow={(e: any) => onResizeRow(e)}
                      allColHide={allColHide}
                      getRowOnActionClick={getRowOnActionClick}
                      dragVisibility={dragVisibility}
                    />

                    <TablePagination
                      className="dataTablePages"
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={container.rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </div>
                </ThemeProvider>
              ) : (
                <>
                  {/* {allowDragableToList === true ? (
                <div>
                  Raw JSON
                <div style={{border: "1px solid black"}} >
                  <Droppable droppableId={container.id} key={container.id}>
                  {(provided: any) => (
                    <RootRef rootRef={provided.innerRef}>
                      <List>
                        {container.rows.map((row: any, index: number) => {
                          return (
                              <React.Fragment key={index}>
                                <ListItem
                                    key={row[keyId]}
                                    role={undefined}
                                    dense
                                    ContainerComponent="li"
                                    ContainerProps={{ ref: provided.innerRef }}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    >
                                    <ListItemText
                                        style={{ fontFamily: "Quicksand" }}
                                        primary={`${JSON.stringify(row)}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                          edge="end"
                                          aria-label="comments"
                                          question-uid={row[keyId]}
                                        >
                                        <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                              </React.Fragment>
                          );
                        })}
                        {provided.placeholder}
                      </List>
                    </RootRef>
                  )}
                </Droppable>
                </div>
                </div>
                ) : (
                  null
                )} */}
                </>
              )}
            </Grid>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default CRXDataTable;
