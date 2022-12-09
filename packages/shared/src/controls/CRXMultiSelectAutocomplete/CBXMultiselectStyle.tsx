import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
const useSelectBoxStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#fff",
      border: "3px solid transparent",
      outline: "1px solid #d1d2d4",
      paddingLeft: "5px",
      '&:hover': {
        outline: "1px solid #888787",
      },

      '& > *': {
        margin: theme.spacing(0),
      },
    },

    focused: {
      border: "3px solid #888787",
      outline: "1px solid transparent",
      '&:over': {
        border: "3px solid #888787",
        outline: "1px solid transparent",
      }
    },
    icon : {
        color : "#d1d2d4",
        fontSize:"14px",
        fontWeight : "normal",
        paddingRight:"0",
        marginTop: "1px",
        '&:hover' : {
          color : "#333333"
        }
    },

    paper : {
        borderRadius:"0px",
        border: "1px solid #BEBEBE",
        boxShadow: "0px 0px 5px #25252529",
        marginTop:"0px",
        marginLeft:"-3px",
        maxHeight:"332px",
        minHeight:"165px",
        overflowY: "auto",
        position:"relative",
        top:"2px",
        left:"0px",
        '& > ul' : {
            padding: "0px",
            maxHeight: "100vh",
            overflow:"hidden",
        }
    },  
    popper: {

    },
    option: {
        height: '33px',
        fontFamily : "Arial, Helvetica, sans-serif",
        color: "#333",
        fontSize: "14px",
        alignItems: 'flex-start',
        padding: "0px 16px",
        placeItems: "center",
        '&[data-focus="true"]': {
          backgroundColor: "#6E6E6E",
          borderColor: "0",
          color: "#F5F5F5",
          height: "33px",
        },
        // '&[aria-selected="true"]': {
        //   backgroundColor: "red",
        //   borderColor: "transparent",
        //   color: "#d1d2d4",
        //   height: "33px",
        // },
        
        '&:hover' : {
            backgroundColor : "#F5F5F5",
            color: "#333333",
        },
      },
      // '&[data-focus="true"]': {
      //   backgroundColor: "#6E6E6E",
      //   color: "#F5F5F5",
      // },
      '&:hover': {
        backgroundColor: "#F5F5F5",
      },
      '&:focus': {
        backgroundColor: "#6E6E6E",
        color: "#F5F5F5",
      },
    
    popupIndicator: {
      backgroundColor: "transparent",
      color: "#333",
      fontSize: "21px",
      paddingRight: "3px",
      paddingTop: "4px",
      '&:hover': {
        backgroundColor: "transparent",
      }
    },


    popupIndicatorOpen: {
      transform: "rotate(0deg)"
    },
    tag: {
      backgroundColor: '#fff',
      border: "1px solid #bebebe",
      borderRadius: "1px",
      color: "#333",
      padding: "0px",
      height: "20px",
      position: "relative",
      marginRight: "14px",
      marginLeft: "5px",
      top: "-1px",
      '&:hover': {
        backgroundColor: '#F3F4F5',
        border: "1px solid #888787",
        color: "#333333",
        '&:after': {
          color: "#333333"
        }
      },
      '&:span': {
        padding: "0px"
      },
    },
      
  }),
);

export default useSelectBoxStyle;