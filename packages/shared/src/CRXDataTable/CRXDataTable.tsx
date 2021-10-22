import React, { useState, useCallback, useEffect } from "react";
import {
  Order,
  OrderData,
  useStyles,
  DataTableProps,
  HeadCellProps,
  OrderValue,
  theme,
  CheckAllPageWise
} from "./CRXDataTableTypes";
import TablePagination from "@material-ui/core/TablePagination";
import DataTableToolbar from "./CRXDataTableToolbar";
import { ThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import "./CRXDataTable.scss";
import DataTableContainer from "./CRXDataTableContainer";

const CRXDataTable: React.FC<DataTableProps> = ({
  id,
  dataRows,
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
  showCustomizeIcon,
  showHeaderCheckAll,
}) => {
  const classes = useStyles();
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
    }
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
    containers.tableId.rows = stabilizedThis.map((el) => el[0]);
    return containers.tableId.rows;
  }

  const handleRequestSort = async (property: any) => {
    const isAsc = orderData.orderBy === property && orderData.order === "asc";
    setOrderData({ order: isAsc ? "desc" : "asc", orderBy: property });
    setPage(0);
    setCheckAllPageWise([])
    setSelectedItems([]);
  };

  useEffect(() => {
    stableSort(
      containers.tableId.rows,
      getComparator(orderData.order, orderData.orderBy)
    );
    if (open === true) setOpen(false);
    else setOpen(true);
  }, [orderData]);

  const handleSelectAllClick = (event: boolean) => {

    if(event) 
      setCheckAllPageWise((prev: CheckAllPageWise[]) => [...prev, {page,isChecked:event}])
    else {
      const items = checkAllPageWise.filter(
        (Item: CheckAllPageWise) => Item.page !== page
      );
      setCheckAllPageWise(items);
    }

    const newSelecteds = containers.tableId.rows.slice(page*rowsPerPage, (page*rowsPerPage)+rowsPerPage)
    if (event) {
      newSelecteds.map((item:any) => {
        setSelectedItems((prev: any) => [...prev, item]);
      })
      return;
    }
    else {   
      var items = selectedItems.filter(function(objFromA:any) {
        return !newSelecteds.find(function(objFromB:any) {
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
    } else {
      setSelectedItems((prev: any) => [...prev, row]);
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
    setCheckAllPageWise([])
    setSelectedItems([]);
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
  }

  return (
    <>
      {Object.values(containers).map((container: any) => {
        return (
          <React.Fragment key={container.id}>
            <Grid item>
              {container.id === id ? (
                <ThemeProvider theme={theme}>
                  <div className={classes.root}>
                    {(showToolbar === undefined || showToolbar === true) && (
                      <DataTableToolbar
                        id={id}
                        numSelected={selectedItems.length}
                        headCells={headCells}
                        rowCount={container.rows.length}
                        columnVisibilityBar={columnVisibilityBar}
                        onChange={onColumnVisibility}
                        onClearAll={() => onClearAll()}
                        onReOrder={(e: number[]) => setOrderColumn(e)}
                        orderingColumn={orderColumn}
                        onHeadCellChange={onHeadCellChange}
                        showCountText={showCountText}
                        showCustomizeIcon={showCustomizeIcon}
                      />
                    )}

                    <DataTableContainer
                      id={id}
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
                      showCheckBoxesCol={showCheckBoxesCol}
                      showActionCol={showActionCol}
                      showActionSearchHeaderCell={showActionSearchHeaderCell}
                      showHeaderCheckAll={showHeaderCheckAll}
                      onSetCheckAll={handleSelectAllClick}
                      checkAllPageWise={checkAllPageWise}
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
              ) : null
              }
            </Grid>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default CRXDataTable;
