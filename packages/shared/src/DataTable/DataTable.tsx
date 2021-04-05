import React, { useState, useCallback, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from '@material-ui/core/IconButton';
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Order, useStyles, DataTableProps, theme} from "./DataTableTypes"
import SwapVertIcon from '@material-ui/icons/SwapVert';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import DataTableToolbar from "./DataTableToolbar"
import { ThemeProvider } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import RootRef from "@material-ui/core/RootRef";
import List from "@material-ui/core/List";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import Grid from "@material-ui/core/Grid";

export default function DataTable(props: DataTableProps) {
  const {dataRows, headCells, orderParam, orderByParam, searchHeader, columnVisibilityBar, allowDragableToList} = props;
  const classes = useStyles();
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  //const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState<Order>(orderParam);
  const [orderBy, setOrderBy] = React.useState<string>(orderByParam);
  const [orderColumn, setOrderColumn] = useState(
    new Array(headCells.length).fill(null).map((n, i) => i)
  );

  useEffect(() => {
    stableSort(containers.dataTable.rows, getComparator(order, orderBy))
  },[])

  const keyId = headCells.filter(n => n.keyCol === true).map((v => v.value)).toString()

  const secondRows: any[] = [];

  const initialContainers: any = {
    dataTable: {
      id: "dataTable",
      rows: dataRows
    },
    list: {
      id: "list",
      rows: secondRows
    }
  };

  const [containers, setContainers] = useState(initialContainers);

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator<Key extends keyof any>(order: Order, orderBy: Key,): 
    //(a: { [key in Key]: number | string | Person | Date | any }, b: { [key in Key]: number | string | Person | Date | any }) => number {
    (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    containers.dataTable.rows = (stabilizedThis.map((el) => el[0]))
    //return stabilizedThis.map((el) => el[0]);
  }

  const createSortHandler = (property: any) => () => {
    handleRequestSort(property);
  };

  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    stableSort(containers.dataTable.rows, getComparator(order, orderBy))
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = containers.dataTable.rows.map((n: any) => n[keyId]);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
  
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
  
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setDense(event.target.checked);
  // };

  const onReorderEnd = useCallback(
    ({ oldIndex, newIndex}, e) => {
      const newOrder = [...orderColumn];
      const moved = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved[0]);
      setOrderColumn(newOrder);
    },
    [orderColumn, setOrderColumn]
  );

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  function onColumnVisibility(){
    if(open === true )
      setOpen(false)
    else
      setOpen(true)
  }

  const onDragEnd = ({ source, destination }: any) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;
    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    const start = containers[source.droppableId];
    const end = containers[destination.droppableId];

    const startIndex = source.index + (page*rowsPerPage)
    let destinationIndex = destination.index 

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      console.log("If");
      const newList = start.rows.filter((_: any, idx: any) => idx !== startIndex);
      destinationIndex = destination.index + (page*rowsPerPage)
      // Then insert the item at the right location
      newList.splice(destinationIndex, 0, start.rows[startIndex]);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        rows: newList
      };

      // Update the state
      setContainers((state: any) => ({ ...state, [newCol.id]: newCol }));
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
        rows: start.rows
      };

      // Make a new end list array
      const newEndList = end.rows;

      // Insert the item into the end list
      newEndList.splice(destinationIndex, 0, start.rows[startIndex]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        rows: newEndList
      };

      // Update the state
      setContainers((state: any) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }));
      return null;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {Object.values(containers).map((container: any) => {
        return (
          <Grid item > 
            {container.id === "dataTable" ?  (
              <ThemeProvider theme={theme}>
              <div className={classes.root}>
                <Paper className={classes.paper}>
                <DataTableToolbar 
                    numSelected={selected.length} 
                    headCells={headCells} 
                    rowCount={container.rows.length}
                    columnVisibilityBar={columnVisibilityBar}
                    onChange={onColumnVisibility}  />
                <TableContainer className={classes.container} component={Paper}>
                <Table className={classes.table} 
                  aria-label="simple table"
                  size='small'
                  stickyHeader>
                  <DragableHead axis="x" onSortEnd={onReorderEnd}>
                    <TableCell className={classes.headerStickness} ></TableCell>
                    <TableCell className={classes.headerStickness} ></TableCell>  
                    {orderColumn.map((colIdx, i) => (
                      //index needs to be CURRENT
                      //key needs to be STATIC
                      <>
                      <TableCell className={classes.headerStickness} key={i} 
                          style={{display:`${(headCells[colIdx].visible === undefined || headCells[colIdx].visible === true) ? "" : "none"}`}}
                          align={(headCells[colIdx].align === "right") ? 'right' : (headCells[colIdx].align === "left") ? 'left' : 'center'}>
                        <div className={classes.headerCellDiv}>
                        <TableHead>
                          <TableRow>
                            <DragableCell
                              index={i} key={colIdx} 
                              value={
                                    //   <TableCell className={classes.headerStickness} 
                                    //     style={{minWidth:`${headCells[colIdx].minWidth}`}}
                                    //     key={headCells[colIdx].value}
                                    //     align={(headCells[colIdx].align === "right") ? 'right' : (headCells[colIdx].align === "left") ? 'left' : 'center'}
                                    //     padding={headCells[colIdx].disablePadding ? 'none' : 'default'}
                                    //     sortDirection={orderBy === headCells[colIdx].value ? order : false}
                                    //   >
                                    //   {headCells[colIdx].label}
                                    // </TableCell>
                                    <div className={classes.headerStickness}
                                        style={{minWidth:`${headCells[colIdx].minWidth}`}}
                                        key={headCells[colIdx].value}>
                                      <label> 
                                          {headCells[colIdx].label} 
                                      </label>
                                    </div>
                                    }
                            />  
                          </TableRow>
                        </TableHead>
                        {(headCells[colIdx].sort === true) ? (
                              <TableSortLabel 
                                //active={orderBy === headCells[colIdx].value}
                                direction={orderBy === headCells[colIdx].value ? order : 'asc'}
                                onClick={createSortHandler(headCells[colIdx].value)}
                                >
                                {(orderBy === headCells[colIdx].value) ? (
                                    <span> 
                                      {/* className={classes.visuallyHidden}> */}
                                    {order === 'desc' ? 
                                      <IconButton aria-label="expand row" size="small" className={classes.iconArrows}>
                                          <SwapVertIcon/>
                                      </IconButton>
                                      : 
                                      <IconButton aria-label="expand row" size="small" className={classes.iconArrows}>
                                          <SwapVertIcon/>
                                      </IconButton>
                                      }
                                    </span>
                                ) : 
                                <IconButton aria-label="expand row" size="small" className={classes.iconArrows}>
                                    <SwapVertIcon/>
                                </IconButton>
                              }
                              </TableSortLabel>
                          ) : (
                            null
                          )
                        }    
                        </div>     
                      </TableCell>  
                      </>
                    ))}
                  </DragableHead>
                  {searchHeader === true ? 
                    <DragableHead axis="x" onSortEnd={onReorderEnd}>
                      <TableCell className={classes.searchHeaderStickness} ></TableCell>
                      <TableCell padding="checkbox" className={classes.searchHeaderStickness}>            
                        <Checkbox style={{color:"white"}}
                          indeterminate={selected.length > 0 && selected.length < container.rows.length}
                          checked={container.rows.length > 0 && selected.length === container.rows.length}
                          onChange={handleSelectAllClick}
                          inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                      </TableCell>

                      {/* <TableCell className={classes.searchHeaderStickness}></TableCell>   */}
                      {orderColumn.map((colIdx, i) => (
                        //index needs to be CURRENT
                        //key needs to be STATIC
                        <DragableCell
                          index={i} key={colIdx} 
                          value={
                                    <TableCell className={classes.searchHeaderStickness} 
                                      style={{display:`${(headCells[colIdx].visible === undefined || headCells[colIdx].visible === true) ? "" : "none"}`}}
                                      key={headCells[colIdx].value}
                                      align={(headCells[colIdx].align === "right") ? 'right' : (headCells[colIdx].align === "left") ? 'left' : 'center'}
                                      padding={headCells[colIdx].disablePadding ? 'none' : 'default'}
                                      sortDirection={orderBy === headCells[colIdx].value ? order : false}
                                    >    
                                      {/* {children[colIdx]} */}
                                      {headCells[colIdx].searchFilter === true ? 
                                          headCells[colIdx].searchComponent(container.rows, headCells, colIdx)
                                          :
                                          null
                                      }
                                    </TableCell>
                                }
                        />
                      ))}
                    </DragableHead>
                    :
                    null
                  }
                  <Droppable droppableId={container.id}>
                  {(provided: any) => (
                    <RootRef rootRef={provided.innerRef}>
                      <TableBody>
                        {
                          //stableSort(container.rows, getComparator(order, orderBy))
                          container.rows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row : any, index: number) => {
                          //.map((row, index) => {
                            const isItemSelected = isSelected(row[keyId]);
                            const labelId = `checkbox with default color-${index}`;
                            return (
                              <React.Fragment>
                                      <TableRow hover
                                        key={row[keyId]}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        selected={isItemSelected}
                                      >
                                        {console.log(index + (page*rowsPerPage))}
                                        <TableCell>
                                        <Draggable draggableId={row[keyId]} key={row[keyId]} index={index}>
                                        {(provided: any) => (
                                                <ListItem 
                                                  key={row[keyId]}
                                                  role={undefined}
                                                  dense
                                                  button
                                                  ContainerComponent="div"
                                                  ContainerProps={{ ref: provided.innerRef }}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  >
                                                  <DragIndicatorIcon />
                                                  <ListItemSecondaryAction>
                                                      <IconButton
                                                        edge="end"
                                                        aria-label="comments"
                                                        question-uid={row[keyId]}
                                                      >
                                                      </IconButton>
                                                  </ListItemSecondaryAction>
                                                </ListItem>
                                              )}
                                        </Draggable> 
                                        </TableCell>
                                        <TableCell padding="checkbox">
                                          <Checkbox onClick={() => handleClick(row[keyId])}
                                            color="default"
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                          />
                                        </TableCell>
                                        {orderColumn.map((colIdx, i) =>
                                          <TableCell  key={i}
                                            align={(headCells[colIdx].align === "right") ? 'right' : (headCells[colIdx].align === "left") ? 'left' : 'center'}
                                            style={{display:`${(headCells[colIdx].visible === undefined || headCells[colIdx].visible  === true) ? "" : "none"}`}}>
                                            {headCells[colIdx].dataComponent(row[headCells[colIdx].value])}
                                          </TableCell>
                                        )}
                                    </TableRow>
                              </React.Fragment>
                            );
                          }
                        )}
                        {provided.placeholder}
                        </TableBody>
                    </RootRef>
                  )}
                </Droppable>
              </Table>
              </TableContainer>
              <TablePagination 
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={container.rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
              </Paper>
              </div>
              </ThemeProvider>
            ) : (
              <>       
                {allowDragableToList === true ? (
                <div>
                  Raw JSON
                <div style={{border: "1px solid black"}} >
                  <Droppable droppableId={container.id}>
                  {(provided: any) => (
                    <RootRef rootRef={provided.innerRef}>
                      <List>
                        {container.rows.map((row: any) => {
                          return (
                              <>
                                <ListItem
                                    key={row[keyId]}
                                    role={undefined}
                                    dense
                                    // button
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
                              </>
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
                )}
              </>
            )}
          </Grid>
        );
      })}
    </DragDropContext>
  );
}

//Use the react-sortable-hoc wrappers around the matui elements
const DragableHead = SortableContainer(( props: any) => {
  return (
    <TableHead>
      <TableRow>
        {props.children}
      </TableRow>
    </TableHead>
  );
});

const DragableCell = SortableElement(( props: any) => {
  return <>{props.value}</>;
});
