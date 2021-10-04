import {
  createStyles,
  makeStyles,
  createMuiTheme,
  Theme,
} from "@material-ui/core/styles";

export const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
      paddingBottom: theme.spacing(2.9),
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
      lineHeight: "0",
    },
    alignment: {
      textAlign: "left",
      fontSize: "12pt",
      width: "300px",
      zIndex: 3,
    },
  })
);

export const theme = createMuiTheme({
  overrides: {
    MuiTableRow: {
      root: {
        "&$selected": {
          // <-- mixing the two classes
          backgroundColor: "#f2f2f2",
        },
        "&$selected:hover": {
          // <-- mixing the two classes
          backgroundColor: "#f2f2f2",
        },
        "&:hover": {
          backgroundColor: "#333333",
        },
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
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      //width: 188,
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
      // maxHeight: 800,

      overflowX: "auto",
    },
    headerStickness: {
      top: 0,
      left: 0,
      zIndex: 2,
      position: "sticky",
      backgroundColor: "#333333",
      color: "#d1d2d4",
      whiteSpace: "nowrap",
    },
    searchHeaderStickness: {
      top: 35,
      left: 0,
      zIndex: 2,
      position: "sticky",
      backgroundColor: "#333333",
      color: "#d1d2d4",
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
}

export interface HeadCellProps {
  //disablePadding: boolean;
  id: any;
  //value: any;
  label: string;
  align: string;
  sort?: boolean;
  visible?: boolean;
  minWidth: string;
  maxWidth?: string;
  dataComponent?: any;
  searchFilter?: boolean;
  searchComponent?: any; // (Dropdown / Multiselect / Input / Custom Component)
  keyCol?: boolean; // This is a Key column. Do not assign it to maximum 1 column
  headerArray?: ValueString[];
  headerObject?: any;
  detailedDataComponentId?: string;
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
  showCustomizeIcon?: boolean;
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
};

export type SearchHeaderProps = {
  id: string;
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
};

export type DataTableHeaderProps = {
  orderColumn: number[];
  headCells: HeadCellProps[];
  orderData: OrderData;
  onHandleRequestSort: (e: any) => void;
  onResizeRow: (e: any) => void;
  dragVisibility?: boolean;
  showCheckBoxesCol?: boolean;
  showActionCol?: boolean;
};

export type DataTableClearFilterProps = {
  columnVisibilityBar: boolean | undefined;
  onClearAll: () => void;
};

export type DataTableCustomizeColumnsProps = {
  headCells: HeadCellProps[];
  orderingColumn: number[];
  onReorder: (e: number[]) => void;
  onChange: () => void;
  onHeadCellChange: (e: HeadCellProps[]) => void;
  showCustomizeIcon?: boolean;
};

export type OrderValue = {
  order: number;
  value: boolean | undefined;
}