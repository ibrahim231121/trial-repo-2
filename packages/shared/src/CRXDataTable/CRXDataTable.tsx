import React, { useState, useCallback, useEffect } from "react";
import {
  Order,
  OrderData,
  DataTableProps,
  HeadCellProps,
  OrderValue,
  theme,
  CheckAllPageWise
} from "./CRXDataTableTypes";
import TablePagination from '@material-ui/core/TablePagination';
import DataTableToolbar from "./CRXDataTableToolbar";
import { ThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import "./CRXDataTable.scss";
import DataTableContainer from "./CRXDataTableContainer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  
  selectDropdown: {
    color: "#333333",
    backgroundColor: "#fff",
    
    width : "46px",
    paddingTop: "0px",
    borderRadius: "0px",
    textAlign: "center",
    "& .MuiMenu-list" : {
      paddingTop : "0px",
      paddingBottom : "0px",
      boxShadow: "0px 3px 6px #00000029",
    }
  },
  menuItem: {
    padding : "1px 0px",
    fontSize : "14px",
    justifyContent: "center",
    color:"#333333",
    "&:hover": {
      backgroundColor: "#d1d2d4",
    },
    "&.Mui-selected": {
      backgroundColor: "#d1d2d4",
    },
    "&.Mui-selected:hover": {
      backgroundColor: "#d1d2d4",
    },
  },
  root: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },

  gridStyle : {
    paddingBottom : "0px"
  },

  pagination : {
    height:"60px",
    overflow : "hidden",
    position: "fixed",
    left: "0px",
    bottom: "26px",
    background: "#FFF",
    borderTop: "1px solid var(--color-ccc)",
    width: "calc(100% - 26px)",
    zIndex: 2,
    '& .MuiToolbar-regular' : {
      height:"45px",
      minHeight: "45px",
    }
  },
 
}));

const CRXDataTable: React.FC<DataTableProps> = ({
  id,
  dataRows,
  initialRows,
  headCells,
  orderParam,
  orderByParam,
  className,
  searchHeader,
  columnVisibilityBar,
  actionComponent,
  onClearAll,
  onResizeRow,
  getSelectedItems,
  onHeadCellChange,
  getRowOnActionClick,
  dragVisibility,
  showToolbar,
  selectedItems,
  setSelectedItems,
  showCheckBoxesCol,
  showActionCol,
  showActionSearchHeaderCell,
  showCountText,
  showTotalSelectedText,
  showCustomizeIcon,
  lightMode,
  toolBarButton,
  offsetY,
  headerOffSetY,
  showHeaderCheckAll,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  totalRecords,
  selfPaging,
  setSortOrder,
  searchHeaderPosition,
  dragableHeaderPosition,
  topSpaceDrag,
  headerPositionInit,
  stickyToolbar,
  isPaginationRequired,
}) => {
  const classes = useStyles();
  
  const [open, setOpen] = React.useState<boolean>(false);
  const [orderData, setOrderData] = React.useState<OrderData>({
    order: orderParam,
    orderBy: orderByParam,
  });
  const [orderColumn, setOrderColumn] = useState(
    new Array(headCells.length).fill(null).map((_, i) => i)
  );
  const keyId = headCells
    .filter((n) => n.keyCol === true)
    .map((v) => v.id)
    .toString();
  const [allColHide, setAllColHide] = React.useState<boolean>(false);
  const [checkAllPageWise, setCheckAllPageWise] = React.useState<CheckAllPageWise[]>([]);

  let initialContainers: any = {
    tableId: {
      id: id,
      rows: dataRows,
    },
  };

  const [containers, setContainers] = useState(initialContainers);

  useEffect(() => {
    let rows = stableSort(
      dataRows,
      getComparator(orderData.order, orderData.orderBy)
    );
    const dataTable = {
      id: id,
      rows: rows,
    };

    setContainers((state: any) => ({ ...state, [dataTable.id]: dataTable }));

    let checkOrderPreset = localStorage.getItem("checkOrderPreset_" + id);

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
      let containerTable: any = {
        tableId: {
          id: id,
          rows: stableSort(
            dataRows,
            getComparator(orderData.order, orderData.orderBy)
          ),
        },
      };
      setContainers(containerTable);
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
    containers.tableId.rows = stabilizedThis.map((el) => el[0]);
    return containers.tableId.rows;
  }

  const handleRequestSort = async (property: any) => {
    const isAsc = orderData.orderBy === property && orderData.order === "asc";
    setOrderData({ order: isAsc ? "desc" : "asc", orderBy: property });
    //setPage(0);
    setCheckAllPageWise([])
    //setSelectedItems([]);
  };

  useEffect(() => {
    if(id == "assetDataTable")
      stableSort(
        containers.tableId.rows,
        getComparator(orderData.order, orderData.orderBy)
      );
    else
      setSortOrder && setSortOrder(orderData)
    if (open === true) setOpen(false);
    else setOpen(true);
  }, [orderData]);

  const unCheckCurrentPage = () => {
    const items = checkAllPageWise.filter(
      (Item: CheckAllPageWise) => Item.page !== page
    );
    setCheckAllPageWise(items);
  }

  const handleSelectAllClick = (event: boolean) => {
    if (event) {
      // if commented then it will maintain old state
      //setCheckAllPageWise([]); //remove previous selected CheckAllPageWise, then add new page.
      setCheckAllPageWise((prev: CheckAllPageWise[]) => [...prev, { page, isChecked: event }])
    }
    else {
      unCheckCurrentPage();
    }

    const newSelecteds = selfPaging ? containers.tableId.rows.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage) : containers.tableId.rows
    if (event) {
      // if commented then it will maintain old state
      //setSelectedItems([]); //remove previous selected item, then add new items from select all checkbox.
      newSelecteds.map((item: any) => {
        setSelectedItems((prev: any) =>
          [...(prev.filter((x: any) => x.id !== item.id)), item]
        );
      })
      return;
    }
    else {
      var items = selectedItems.filter(function (objFromA: any) {
        return !newSelecteds.find(function (objFromB: any) {
          return objFromA.id === objFromB.id
        })
      })
      setSelectedItems(items);
    }
  };

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
      unCheckCurrentPage();
      
    } else {
      setSelectedItems((prev: any) => [...prev, row]);
    }
  };

  useEffect(() => {
    getSelectedItems(selectedItems);
    const newSelecteds = selfPaging ? containers.tableId.rows.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage) : containers.tableId.rows
    const newSelected = newSelecteds.map((item: any) => {
      if (selectedItems.map((x: any) => x.id).includes(item.id))
        return item.id
      else
        return null
    }).filter((y: any) => y !== null);
    if (newSelected.length === rowsPerPage)
      setCheckAllPageWise((prev: CheckAllPageWise[]) => [...prev, { page, isChecked: true }])
  }, [selectedItems]);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage); 
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setCheckAllPageWise([])
    //setSelectedItems([]);
  };

  // useEffect(() => {
  //   setPage(page);
  // },[page])

  // useEffect(() => {
  //   setRowsPerPage(rowsPerPage);
  // },[rowsPerPage])

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
  }
  
  return (
    <>
      {Object.values(containers).map((container: any) => {
        return (
          <React.Fragment key={container.id}>
            <Grid className={classes.gridStyle} item>
              {container.id === id ? (
                <ThemeProvider theme={theme}>
                  <div className={classes.root}>
                    {(showToolbar === undefined || showToolbar === true) && (
                      <DataTableToolbar
                        id={id}
                        numSelected={selectedItems.length}
                        headCells={headCells}
                        rowCount={totalRecords}
                        columnVisibilityBar={columnVisibilityBar}
                        onChange={onColumnVisibility}
                        onClearAll={() => onClearAll()}
                        onReOrder={(e: number[]) => setOrderColumn(e)}
                        orderingColumn={orderColumn}
                        onHeadCellChange={onHeadCellChange}
                        showCountText={showCountText}
                        showCustomizeIcon={showCustomizeIcon}
                        showTotalSelectedText={showTotalSelectedText}
                        toolBarButton={toolBarButton}
                        stickyToolbar={stickyToolbar}
                        offsetY={offsetY}
                      />
                    )}

                    <DataTableContainer
                      id={id}
                      orderColumn={orderColumn}
                      headCells={headCells}
                      orderData={orderData}
                      selectedItems={selectedItems}
                      container={container}
                      initialRows={initialRows}
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
                      showCheckBoxesCol={showCheckBoxesCol}
                      showActionCol={showActionCol}
                      showActionSearchHeaderCell={showActionSearchHeaderCell}
                      showHeaderCheckAll={showHeaderCheckAll}
                      lightMode={lightMode}
                      onSetCheckAll={handleSelectAllClick}
                      checkAllPageWise={checkAllPageWise}
                      offsetY={offsetY}
                      headerOffSetY={headerOffSetY}
                      selfPaging={selfPaging}
                      searchHeaderPosition={searchHeaderPosition}
                      dragableHeaderPosition={dragableHeaderPosition}
                      topSpaceDrag={topSpaceDrag}
                      headerPositionInit={headerPositionInit}
                    />
                    {(isPaginationRequired == null || isPaginationRequired == true) ?
                      <TablePagination
                        className="dataTablePages"
                        //classes = {clxFooter.root}  
                        SelectProps={{
                          MenuProps: {
                            classes: {paper: classes.selectDropdown }
                          },
                        }}
                        
                        classes={{ 
                          menuItem: classes.menuItem, 
                          root : classes.pagination,
                        }}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        component="div"
                        count={totalRecords}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                   : null
                    }
                    <div className="overlayPanel_Right"></div>
                   <div className="overlayPanel"></div>
                   <div className="overlayPanel_bottom"></div>
                  </div>
                </ThemeProvider>
              ) : null}
            </Grid>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default CRXDataTable;
