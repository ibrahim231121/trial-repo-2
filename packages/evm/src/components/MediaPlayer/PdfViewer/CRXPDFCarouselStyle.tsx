import { makeStyles } from "@material-ui/core";


export const pdfCarouselStyle = makeStyles({
    carousel : {
      height : "calc(100vh - 266px)",
      "& img" : {
        height : "100%",
        width: "-webkit-fill-available"
      }
    },

    scrollButtons : {
      background:"#333333",
      color:"#d1d2d4",
      borderRadius:"0px",
      width: "40px",
      height: "149px",
      fontSize: "14px",
      '&.MuiIconButton-root.Mui-disabled' : {
        background:"#231F20",
        color:"#d1d2d4",
      },
      '&:hover' : {
        background:"#231F20",
        color:"#d1d2d4",
      },
      '&:focus' : {
        background:"#231F20",
        color:"#d1d2d4",
      }
    }
  })

export const ImageTabsStyled = makeStyles({
    root : {
      height : "calc(100vh - 170px)",
      marginLeft : "0px !important",
      width : "100% !important"
    },

    scrollButtons : {
      backgroundColor:"#333333",
      color:"#fff",
      borderRadius:"0px",
      width: "264px",
      minWidth : "40px",
      height: "40px",
      fontSize: "28px",
      position:"absolute",
      zIndex : 9,
      '&.MuiIconButton-root.Mui-disabled' : {
        background:"#333333",
        color:"#d1d2d4",
        opacity : "0"
      },
      '&[direction="right"]' : {
          bottom : "0px;"
      },
      '&[direction="left"]' : {
        top : "0px;"
      },
      '&:hover' : {
        background:"#231f20",
        color:"#fff",
      },
      '&:focus' : {
        background:"#333333",
        color:"#d1d2d4",
      }
    },
    
    scroller : {
      paddingBottom : "0px",
      marginLeft : "0px !important",
      width : "100% !important"
    }
  })

  
  export const PDFItemStyled = makeStyles({ 
    labelIcon : {
      fontSize : "14px",
      background: "#000",
      color : "#d1d2d4",
      position: "absolute",
      bottom: "5px",
      width: "auto",
      maxWidth : "90%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      padding: "0px 4px",
      textTransform: "capitalize"
    }
  })