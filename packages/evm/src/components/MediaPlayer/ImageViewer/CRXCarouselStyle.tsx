import { makeStyles } from "@material-ui/core";


export const carouselStyle = makeStyles({
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
     width : "100% !important",
     marginLeft : "0px !important"
    },

    scrollButtons : {
      backgroundColor:"#333333",
      color:"#d1d2d4",
      borderRadius:"0px",
      width: "40px",
      minWidth : "40px",
      height: "151px",
      fontSize: "14px",
      position:"absolute",
      zIndex : 9,
      '&.MuiIconButton-root.Mui-disabled' : {
        background:"#333333",
        color:"#d1d2d4",
        opacity : "0"
      },
      '&[direction="right"]' : {
          right : "0px",
          marginRight: "0px !important",
      },
      '&[direction="left"]' : {
        left : "0px",
        marginLeft : "0px !important"
      },
      '&:hover' : {
        background:"#333333",
        color:"#d1d2d4",
      },
      '&:focus' : {
        background:"#333333",
        color:"#d1d2d4",
      }
    },
    
    scroller : {
      paddingBottom : "16px"
    }
  })
