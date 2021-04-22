import { createStyles, makeStyles, createMuiTheme, Theme } from '@material-ui/core/styles';

export const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
          }
        : {
            color: theme.palette.text.primary,
          },
    title: {
      flex: '1 1 100%',
    },
    alignment:{
      textAlign: "left",
      fontSize: "12pt",
      width: "300px",
      zIndex: 3,
    }
  }),
);

export const theme = createMuiTheme({
  overrides: {
    MuiTableRow: {
      root: {
        '&$selected': { // <-- mixing the two classes
          backgroundColor: '#f2f2f2',    
        },
        '&$selected:hover': { // <-- mixing the two classes
          backgroundColor: '#f2f2f2',    
        },
      },
    },

    MuiTableCell: {
      root: {
        // color: '#d1d2d4',
        // borderBottom: "1px solid #cccccc",
        // borderLeft: "1px solid #cccccc"
      },
    },

    MuiTableSortLabel: {
      icon:{
        color: 'white',
      },
    },
  }
});

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        '& > *': {
          borderBottom: 'unset', width: '100%',
        },
    },
    paper: {
      width: '100%', marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', top: 20, width: 1,
    },    
    container: {
      maxHeight: 800,
      overflow:'auto'
    },
    headerStickness: {
      top: 0,
      left: 0,
      zIndex: 2,
      position:'sticky',
      backgroundColor: "#333333",
      color: "#d1d2d4",
      whiteSpace : 'nowrap',
      width: "92%"
      
    },
    searchHeaderStickness: {
      top: 35, left: 0, zIndex: 2, position:'sticky', backgroundColor: "#333333", color: "#d1d2d4"
    },
    headerCellDiv: {
      display: "flex"
    },
    iconArrows: {
      color: "#d1d2d4",
      maxHeight: "25px"
    },
  }),
);

export type Order = 'asc' | 'desc';

export interface HeadCellProps {
  disablePadding: boolean;
  id: any;
  value: any;
  label: string;
  align: string;
  sort?: boolean;
  visible?: boolean;
  minWidth?: string;
  dataComponent?: any;
  searchFilter?: boolean; 
  searchComponent?: any; // (Dropdown / Multiselect / Input / Custom Component) 
  keyCol?: boolean; // This is a Key column. Do not assign it to maximum 1 column
}

export interface DataTableToolbarProps {
  numSelected: number;
  headCells: HeadCellProps[];
  rowCount: number;
  columnVisibilityBar?: boolean;
  onChange: () => void;
  onReOrder: (event: number[]) => void;
}

export type DataTableProps = {
  dataRows: any[];
  headCells: HeadCellProps[];
  orderParam: Order;
  orderByParam: string;
  searchHeader?: boolean;
  columnVisibilityBar?: boolean;
  allowDragableToList?: boolean;
  className?: string;
  allowRowReOrdering?: boolean;
}
