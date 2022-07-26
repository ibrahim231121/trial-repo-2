import { makeStyles  } from '@material-ui/core/styles';

export const SmallSwitcher = makeStyles({
  
    root: {
      width: 30,
      height: 18,
      padding: 0,
      display: 'flex',
      overflow: "visible",
    },
    
    switchBase: {
      padding: 1,
      color: "#fff",
      '&$checked': {
        transform: 'translateX(12px)',
        color: "#fff",
        '& + $track': {
          
          opacity: 1,
          backgroundColor: "#003A5D",
          outline: "2px solid  #888787",
          borderWidth: '1px',
          borderStyle : "solid",
          borderRadius: "12px",  
        },
      },
      
    },
    thumb: {
      width: 16,
      height: 16,
      boxShadow: 'none',
    },
    track: {
        outline: '2px solid tranparent',
        border: '1px solid tranparent',
        borderRadius: "9px",
        opacity: 1,
        backgroundColor: "#E5E5E5",
        position : "relative",
        
    },
    checked: {},
    
    sizeSmall : {
        
        '&.MuiSwitch-switchBase' : {
            padding: "1px",
        }
    },
    disabled : {
      color : "#979797 !important",
      '& + $track': { 
        backgroundColor: "#e5e5e5 !important",
        opacity : "1 !important"
      }
    },
});

export const LargeSwitcher = makeStyles({

    root: {
      width: 42,
      height: 25,
      padding: 0,
      display: 'flex',
      overflow: "visible",
    },
    switchBase: {
      padding: 2,
      color: "#fff",
      '&$checked': {
        transform: 'translateX(16px)',
        color: "#fff",
        '& + $track': {
          opacity: 1,
          backgroundColor: "#003A5D",
          outline: "2px solid  #888787",
          borderWidth: '1px',
          borderStyle : "solid",
          borderRadius: "22px",  
        },
      },
      '&:disabled' : {
        color : "#979797"
      }
    },
    thumb: {
      width: 21,
      height: 21,
      boxShadow: 'none',
    },
    track: {
        outline: '2px solid tranparent',
        border: '1px solid tranparent',
        borderRadius: "22px",
        opacity: 1,
        backgroundColor: "#E5E5E5",
        position : "relative",
        
    },
    checked: {},
    disabled : {
      color : "#979797 !important",
      '& + $track': { 
        backgroundColor: "#e5e5e5 !important",
        opacity : "1 !important"
      }
    },
    sizeSmall : {
        
        '&.MuiSwitch-switchBase' : {
            padding: "1px",
        }
    }
});