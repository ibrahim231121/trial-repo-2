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
            //backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            //backgroundColor: theme.palette.secondary.dark,
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
          backgroundColor: '#DCDCDC',    
        },
        '&$selected:hover': { // <-- mixing the two classes
          backgroundColor: '#DCDCDC',    
        },
      },
    },

    MuiTableCell: {
      root: {
        color: 'white',
        borderBottom: "1px solid rgba(224, 224, 224, 1)",
        borderLeft: "1px solid rgba(224, 224, 224, 1)"
      },
    },

    MuiTableSortLabel: {
      icon:{
        color: 'white',
      },
      // root:{
      //   color: 'white',
      // },
      // active:{
      //   color: "white"
      // },
    },
  }
});

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // root: {
    //   width: '100%',
    // },
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
      maxHeight: 500,
    },
    headerStickness: {
      top: 0, left: 0, zIndex: 2, position:'sticky', backgroundColor: "#333", color: "white"
    },
    searchHeaderStickness: {
      top: 39, left: 0, zIndex: 2, position:'sticky', backgroundColor: "#333", color: "white"
    },
    headerCellDiv: {
      display: "flex"
    },
    iconArrows: {
      color: "white",
      maxHeight: "25px"
    },
  }),
);

export type Order = 'asc' | 'desc';

export interface HeadCellProps {
  disablePadding: boolean;
  //id: keyof RowDataProps;
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
}

export type DataTableProps = {
  dataRows: any[];
  headCells: HeadCellProps[];
  orderParam: Order;
  orderByParam: string;
  searchHeader?: boolean;
  columnVisibilityBar?: boolean;
  allowDragableToList?: boolean;
}
