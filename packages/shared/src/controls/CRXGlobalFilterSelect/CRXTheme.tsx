import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";



export const darkTheme = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#fff",
      border: "2px solid transparent",
      outline: "1px solid #888787",
      paddingLeft: "6px",
      fontFamily: "Arial",
      "&:hover": {
        outline: "1px solid #888787",
      },

      "& > *": {
        margin: theme.spacing(0),
      },
    },

    focused: {
      border: "2px solid #fff",
      outline: "3px solid #888787",
      "&:hover": {
        border: "2px solid #fff",
        outline: "3px solid #888787",
      },
    },
    icon: {
      color: "#D1D2D4",
      fontSize: "14px",
      fontWeight: "normal",
      paddingRight: "7px",
      marginTop: "1px",
      "&:hover": {
        color: "#333333",
      },
    },

    paper: {
      borderRadius: "0px",
      border: "1px solid #707070",
      boxShadow: "0px 0px 5px #00000033",
      marginTop: "0px",
      marginLeft: "0px",
      maxHeight: "332px",
      minHeight: "165px",
      overflowY: "auto",
      width: "326px",
      position: "relative",
      backgroundColor: "#404041",
      top: "3px",
      left: "-8px",
      "& > ul": {
        padding: "0px",
        maxHeight: "100vh",
        overflow: "hidden",
      },
    },
    popper: {},
    clearIndicator: {
      color: "#333333",
      background: "transparent",
      fontSize: "12px",
      padding: "0px 0px 0px",
      "&:hover": {
        background: "transparent",
      },
      "&:i": {
        fontWeight: "bold",
      },
    },
    endAdornment: {
      right: "10px !important",
      top: "3px",
    },
    option: {
      height: "33px",
      fontFamily: "Arial, Helvetica, sans-serif",
      color: "#D1D2D4",
      fontSize: "14px",
      alignItems: "flex-start",
      padding: "0px 15px",
      placeItems: "center",
      '&[aria-selected="true"]': {
        backgroundColor: "#231F20",
        color: "#D1D2D4",
        "&:hover": {
          backgroundColor: "#6E6E6E",
          color: "#F5F5F5",
        },
      },
      // '&[data-focus="true"]': {
      //   backgroundColor: "#6E6E6E",
      //   color: "#F5F5F5",
      // },
      "&:hover": {
        backgroundColor: "#231F20",
        color: "#D1D2D4",
      },
      "&:focus": {
        backgroundColor: "#6E6E6E",
        color: "#F5F5F5",
      },
    },
    popupIndicator: {
      backgroundColor: "transparent",
      color: "#333",
      fontSize: "21px",
      paddingRight: "3px",
      paddingTop: "0px",
      "&:hover": {
        backgroundColor: "transparent",
      },
    },

    popupIndicatorOpen: {
      transform: "rotate(0deg)",
    },
    tag: {
      backgroundColor: "#fff",
      border: "1px solid #bebebe",
      borderRadius: "1px",
      color: "#333",
      padding: "0px",
      height: "22px",
      position: "relative",
      marginRight: "4px",
      marginLeft: "3px",
      top: "0px",
      "&:hover": {
        backgroundColor: "#F3F4F5",
        border: "1px solid #888787",
        color: "#333333",
        "&:after": {
          color: "#333333",
        },
      },
      "&:span": {
        padding: "0px",
      },
    },
  })
);


export const lightTheme = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#fff",
      border: "2px solid transparent",
      outline: "1px solid #d1d2d4",
      paddingLeft: "6px",
      fontFamily: "Arial",
      "&:hover": {
        outline: "1px solid #888787",
      },

      "& > *": {
        margin: theme.spacing(0),
      },
    },

    focused: {
      border: "2px solid #fff",
      outline: "3px solid #888787",
      "&:hover": {
        border: "2px solid #fff",
        outline: "1px solid #888787",
      },
    },
    icon: {
      color: "#D1D2D4",
      fontSize: "14px",
      fontWeight: "normal",
      paddingRight: "7px",
      marginTop: "1px",
      "&:hover": {
        color: "#333333",
      },
    },

    paper: {
      borderRadius: "0px",
      border: "1px solid #707070",
      boxShadow: "0px 0px 5px #00000033",
      marginTop: "0px",
      marginLeft: "0px",
      maxHeight: "332px",
      minHeight: "165px",
      overflowY: "auto",
      width: "326px",
      position: "relative",
      backgroundColor: "#fff",
      top: "3px",
      left: "-8px",
      "& > ul": {
        padding: "0px",
        maxHeight: "100vh",
        overflow: "hidden",
      },
    },
    popper: {},
    clearIndicator: {
      color: "#333333",
      background: "transparent",
      fontSize: "12px",
      padding: "0px 0px 0px",
      "&:hover": {
        background: "transparent",
      },
      "&:i": {
        fontWeight: "bold",
      },
    },
    endAdornment: {
      right: "10px !important",
      top: "3px",
    },
    option: {
      height: "33px",
      fontFamily: "Arial, Helvetica, sans-serif",
      color: "#333",
      fontSize: "14px",
      alignItems: "flex-start",
      padding: "0px 15px",
      placeItems: "center",
      '&[aria-selected="true"]': {
        backgroundColor: "#6e6e6e",
        color: "#f5f5f5",
        "&:hover": {
          backgroundColor: "#f5f5f5",
          color: "#333",
        },
      },
      // '&[data-focus="true"]': {
      //   backgroundColor: "#6E6E6E",
      //   color: "#F5F5F5",
      // },
      "&:hover": {
        backgroundColor: "#f5f5f5",
        color: "#333",
      },
      "&:focus": {
        backgroundColor: "#6e6e6e",
        color: "#F5F5F5",
      },
    },
    popupIndicator: {
      backgroundColor: "transparent",
      color: "#333",
      fontSize: "21px",
      paddingRight: "3px",
      paddingTop: "0px",
      "&:hover": {
        backgroundColor: "transparent",
      },
    },

    popupIndicatorOpen: {
      transform: "rotate(0deg)",
    },
    tag: {
      backgroundColor: "#fff",
      border: "1px solid #bebebe",
      borderRadius: "1px",
      color: "#333",
      padding: "0px",
      height: "22px",
      position: "relative",
      marginRight: "4px",
      marginLeft: "3px",
      top: "0px",
      "&:hover": {
        backgroundColor: "#F3F4F5",
        border: "1px solid #888787",
        color: "#333333",
        "&:after": {
          color: "#333333",
        },
      },
      "&:span": {
        padding: "0px",
      },
    },
  })
);
