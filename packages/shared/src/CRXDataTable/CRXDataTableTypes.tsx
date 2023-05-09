import React from 'react'
import {
  createStyles,
  makeStyles,
  createTheme,
  Theme,
} from "@material-ui/core/styles";

export const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
      paddingBottom: "25px",
      paddingTop : "0px",
      minHeight : "unset !important",
      height : "unset",
      position : "fixed",
      width : "-webkit-fill-available",
      alignItems: "self-end !important",
      gap:"16px"
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
          }
        : {
            color: theme.palette.text.primary,
          },
    title: {
      flex: "1 1 100%",
      lineHeight: "0.5",
      fontSize: "14px",
      color: "#333",
      position: "relative",
      left: "-16px"
    },
    alignment: {
      textAlign: "left",
      fontSize: "12pt",
      width: "300px",
      zIndex: 3,
    },
  })
);

export const theme = createTheme({
  overrides: {
    MuiTableRow: {
      root: {
        // "&$selected": {
        //   // <-- mixing the two classes
        //   backgroundColor: "#f2f2f2",
        // },
        // "&$selected:hover": {
        //   // <-- mixing the two classes
        //   backgroundColor: "#f2f2f2",
        // },
        // "&:hover": {
        //   backgroundColor: "#333333",
        // },
      },
    },

    MuiTableCell: {
      root: {
        // color: '#d1d2d4',
        // borderBottom: "1px solid #cccccc",
        // borderLeft: "1px solid #cccccc"
        textAlign: "center",
      },
    },

    MuiTableSortLabel: {
      icon: {
        color: "white",
      },
    },
  },
});

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        borderBottom: "unset",
        width: "100%",
      },
    },

    title: {
      fontSize: "14px",
      color: "#333",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      width: "auto",
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    container: {
      width: "99.8%",
      height: "auto",
      overflowY : "hidden",
      display : "table",
      paddingRight: "26px",
      paddingBottom: "58px",
      //scrollBehavior: "smooth"
    },
    multiTableStikcyHeader: {
      top: 0,
      left: 0,
      zIndex: 2,
      position: "sticky",
      backgroundColor: "#333333 !important",
    },
    headerStickness: {
      left: 0,
      zIndex: 3,
      position: "sticky",
      backgroundColor: "#333333 !important",
      color: "#d1d2d4 !important",
      whiteSpace: "nowrap",
      padding : "0px 11px !important"
    },
    searchHeaderStickness: {
      left: 0,
      zIndex: 2,
      position: "sticky",
      backgroundColor: "#333333 !important",
      color: "#d1d2d4 !important",
    },
    headerCellDiv: {
      display: "flex",
    },
    iconArrows: {
      color: "#d1d2d4",
      maxHeight: "25px",
    },
  })
);

export type Order = "asc" | "desc";

export type ValueString = {
  value: string;
};

export interface HeadCellProps {
  //disablePadding: boolean;
  id: any;
  //value: any;
  label: string;
  align: string;
  sort?: boolean;
  visible?: boolean;
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  dataComponent?: any;
  searchFilter?: boolean;
  searchComponent?: any; // (Dropdown / Multiselect / Input / Custom Component)
  keyCol?: boolean; // This is a Key column. Do not assign it to maximum 1 column
  headerArray?: ValueString[];
  headerObject?: any;
  detailedDataComponentId?: string;
  isPopover? : boolean;
  attributeName? : string;
  attributeType? : string;
  attributeOperator? : string;
}

interface searchTypeName {
  type: string;
  name: string;
}

export interface DataTableToolbarProps {
  id: string;
  numSelected: number;
  headCells: HeadCellProps[];
  rowCount: number;
  columnVisibilityBar?: boolean;
  onChange: () => void;
  onClearAll: () => void;
  onReOrder: (event: number[]) => void;
  orderingColumn: number[];
  onHeadCellChange: (e: HeadCellProps[]) => void;
  showCountText?: boolean;
  showCustomizeIcon?: boolean;
  showTotalSelectedText?: boolean;
  toolBarButton? : React.ReactNode,
  stickyToolbar? : number,
  offsetY? : number,
  expanView : any,
  toggleExpanView : () => void,
  showExpandViewOption : boolean,
  showSearchPanel?: any,
  searchResultText? : searchTypeName,
  advanceSearchText? : any,
  presetPerUser? : string
}

export type DataTableProps = {
  id: string;
  dataRows: any[];
  headCells: HeadCellProps[];
  orderParam: Order;
  orderByParam: string;
  searchHeader?: boolean;
  columnVisibilityBar?: boolean;
  className?: string;
  onClearAll: () => void;
  actionComponent?: React.ReactNode;
  getSelectedItems: (v: any) => void;
  onResizeRow: (e: any) => void;
  onHeadCellChange: (e: HeadCellProps[]) => void;
  getRowOnActionClick: (data: any) => void;
  dragVisibility?: boolean;
  selectedItems: string[];
  setSelectedItems: any;
  showToolbar?: boolean;
  showCheckBoxesCol?: boolean;
  showActionCol?: boolean;
  showActionSearchHeaderCell?: boolean;
  showCountText?: boolean;
  showTotalSelectedText?: boolean;
  showCustomizeIcon?: boolean;
  showHeaderCheckAll?: boolean;
  lightMode?: boolean;
  initialRows?: any[];
  toolBarButton? : React.ReactNode,
  offsetY? : number,
  headerOffSetY? : number,
  page: number
  rowsPerPage: number;
  setPage: (e: any) => void;
  setRowsPerPage: (e: any) => void;
  totalRecords: number;
  selfPaging?: boolean;
  setSortOrder?: (e: any) => void;
  searchHeaderPosition? : number,
  dragableHeaderPosition? : number,
  topSpaceDrag? : number,
  headerPositionInit? : number,
  stickyToolbar? : number,
  isPaginationRequired?: boolean,
  viewName? : string,
  showExpandViewOption : boolean,
  showSearchPanel?: any,
  searchResultText? : searchTypeName,
  advanceSearchText? : any
  presetPerUser? : string
  selfSorting?: boolean
};

export type OrderData = {
  order: Order;
  orderBy: string;
};

export type DataTableContainerProps = {
  id: string;
  orderColumn: number[];
  headCells: HeadCellProps[];
  orderData: OrderData;
  selectedItems: string[];
  container: any;
  actionComponent: React.ReactNode;
  className: string | undefined;
  searchHeader: boolean | undefined;
  page: number;
  rowsPerPage: number;
  keyId: string;
  onHandleClick: (e: any) => void;
  onHandleRequestSort: (e: any) => void;
  onMoveReorder: (e: any) => void;
  onReorderEnd: (e: any, _: any) => void;
  onResizeRow: (e: any) => void;
  allColHide: boolean;
  getRowOnActionClick: (data: any) => void;
  dragVisibility?: boolean;
  showCheckBoxesCol?: boolean;
  showActionCol?: boolean;
  showActionSearchHeaderCell?: boolean;
  showCountText?: boolean;
  showCustomizeIcon?: boolean;
  showHeaderCheckAll?: boolean;
  onSetCheckAll: (e: boolean) => void;
  checkAllPageWise: CheckAllPageWise[];
  lightMode?: boolean;
  initialRows?: any[];
  offsetY? : number;
  headerOffSetY? : number;
  selfPaging?: boolean;
  searchHeaderPosition? : number,
  dragableHeaderPosition? : number,
  topSpaceDrag? : number,
  headerPositionInit? : number,
  viewName? : string,
  expanViews : boolean,
  totalRecords? : undefined | any
};

export type DataTableStickyHeadersProps = {
  
  id: string;
  orderColumn: number[];
  headCells: HeadCellProps[];
  orderData: OrderData;
  selectedItems: string[];
  container: any;
  actionComponent: React.ReactNode;
  searchHeader: boolean | undefined;
  page: number;
  onHandleRequestSort: (e: any) => void;
  onMoveReorder: (e: any) => void;
  onReorderEnd: (e: any, _: any) => void;
  onResizeRow: (e: any) => void;
  getRowOnActionClick: (data: any) => void;
  dragVisibility?: boolean;
  showCheckBoxesCol?: boolean;
  showActionCol?: boolean;
  showActionSearchHeaderCell?: boolean;
  showCountText?: boolean;
  showCustomizeIcon?: boolean;
  showHeaderCheckAll?: boolean;
  onSetCheckAll: (e: boolean) => void;
  checkAllPageWise: CheckAllPageWise[];
  lightMode?: boolean;
  initialRows?: any[];
  setBodyCellWidth? : any,
  offsetY? : number,
  searchHeaderPosition? : number,
  dragableHeaderPosition? : number,
  topSpaceDrag? : number,
  viewName? : string,
  expanViews : boolean
};

export type DataTableBodyProps = {
  page: number;
  rowsPerPage: number;
  orderColumn: number[];
  selectedItems: string[];
  headCells: HeadCellProps[];
  container: any;
  actionComponent: React.ReactNode;
  keyId: string;
  onSetSelectedItems: (e: string[]) => void;
  getRowOnActionClick: (data: any) => void;
  dragVisibility?: boolean;
  showCheckBoxesCol?: boolean;
  showActionCol?: boolean;
  lightMode?: boolean;
  bodyCellWidth?: any;
  selfPaging?: boolean;
  totalRecords?: undefined | any
  
};

export type SearchHeaderProps = {
  id: string;
  page: number;
  orderColumn: number[];
  selectedItems: string[];
  headCells: HeadCellProps[];
  orderData: OrderData;
  container: any;
  actionComponent: React.ReactNode;
  getRowOnActionClick: (data: any) => void;
  dragVisibility?: boolean;
  showCheckBoxesCol?: boolean;
  showActionCol?: boolean;
  showActionSearchHeaderCell?: boolean;
  showHeaderCheckAll?: boolean;
  onSetCheckAll: (e: boolean) => void;
  checkAllPageWise: CheckAllPageWise[];
  initialRows?: any[];
  offsetY? : number,
  searchHeaderPosition? : number
};

export type DataTableHeaderProps = {
  id: string;
  orderColumn: number[];
  headCells: HeadCellProps[];
  orderData: OrderData;
  onHandleRequestSort: (e: any) => void;
  onResizeRow: (e: any) => void;
  dragVisibility?: boolean;
  showCheckBoxesCol?: boolean;
  showActionCol?: boolean;
  setBodyCellWidth? : any,
  viewName? : string,
  expanViews : boolean
};

export type DataTableClearFilterProps = {
  columnVisibilityBar: boolean | undefined;
  filterClose: any;
  onClearAll: () => void;
  expanView : boolean,
};

export type DataTableCustomizeColumnsProps = {
  id: string;
  headCells: HeadCellProps[];
  orderingColumn: number[];
  onReorder: (e: number[]) => void;
  onChange: () => void;
  onHeadCellChange: (e: HeadCellProps[]) => void;
  showCustomizeIcon?: boolean;
  filterWindow: any;
  expanView : boolean,
  presetPerUser? : string
};

export type OrderValue = {
  order: number;
  value: boolean | undefined;
};

export type CheckAllPageWise = {
  page: number;
  isChecked: boolean;
};

export type MultiLevelProps = {
  rows: any[];
  headCells: HeadCellProps[];
  className?: string;
  finalLevel: number;
  onSetRow: (check: boolean, row: any) => void;
  onSetCheckAllLevel: (e: boolean, type: string) => void;
  onCheckUnCheckChildren: (e: boolean, row: any) => void;
};
