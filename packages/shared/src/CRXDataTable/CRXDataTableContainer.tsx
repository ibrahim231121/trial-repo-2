import React from "react";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {
  useStyles,
  DataTableContainerProps
} from "./CRXDataTableTypes";
import { useTranslation } from "react-i18next";
import DragableHead from "./CRXDragableHead";
import SearchHeader from "./CRXDataTableSearchHeader";
import DataTableBody from "./CRXDataTableBody";
import DataTableHeader from "./CRXDataTableHeader";

const DataTableContainer: React.FC<DataTableContainerProps> = ({
  keyId,
  orderColumn,
  headCells,
  orderData,
  selectedItems,
  container,
  actionComponent,
  page,
  rowsPerPage,
  className,
  searchHeader,
  onHandleClick,
  onHandleRequestSort,
  onMoveReorder,
  onReorderEnd,
  onResizeRow,
  allColHide,
  getRowOnActionClick,
  dragVisibility,
}) => {

  const classes = useStyles();

  return (
    <TableContainer
      className={classes.container + " AssetsDataGrid " + className}
      component={Paper}
    >
      <Table
        className={"CRXDataTableCustom " + classes.table}
        style={{
          width: `${allColHide === undefined || allColHide ? "188px" : "100%"}`,
        }}
        aria-label="simple table"
        size="small"
        stickyHeader
      >
        <DragableHead
          lockAxis="x"
          hideSortableGhost={false}
          helperClass="helperClass"
          axis="x"
          onSortEnd={(e: any, _: any) => onReorderEnd(e,_)}
          onSortStart={(e:any) => onMoveReorder(e)}
        >
          <DataTableHeader
            orderColumn={orderColumn}
            headCells={headCells}
            orderData={orderData}
            onHandleRequestSort={(e:any) => onHandleRequestSort(e)}
            onResizeRow={(e:any) => onResizeRow(e)}
            dragVisibility={dragVisibility}
          />
        </DragableHead>
        {searchHeader === true ? (
          <SearchHeader
            orderColumn={orderColumn}
            selectedItems={selectedItems}
            headCells={headCells}
            orderData={orderData}
            container={container}
            actionComponent={actionComponent}
            getRowOnActionClick={getRowOnActionClick}
            dragVisibility={dragVisibility}
            getRowOnActionClick={getRowOnActionClick}
          />
        ) : null}
          <DataTableBody
            page={page}
            rowsPerPage={rowsPerPage}
            orderColumn={orderColumn}
            selectedItems={selectedItems}
            headCells={headCells}
            container={container}
            actionComponent={actionComponent}
            keyId={keyId}
            onSetSelectedItems={(row: any) => onHandleClick(row)}
            getRowOnActionClick={getRowOnActionClick}
            dragVisibility={dragVisibility}
          />
      </Table>
    </TableContainer>
  );
};

export default DataTableContainer;
