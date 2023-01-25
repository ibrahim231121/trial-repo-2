import * as React from 'react';
import {  withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import  "./CrxTab.scss";

const CrxTabsParent = withStyles({
  root: {
    borderBottom: "1px solid #878787",
    position: "sticky",
    top: "138px",
    background: "#fff",
    zIndex : 9999,
  },
  indicator: {
    backgroundColor: '#C34400',
  },
  scrollButtons : {
    background:"#333333",
    color:"#d1d2d4",
    borderRadius:"0px",
    minWidth: "39px",
    height: "34px",
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
})(Tabs);

  const CrxTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 120,
      FontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(0),
      border: "1px solid #333",
      borderBottom:"0",
      borderRight: "0px",
      background:"#eee",
      color:"#333",
      position:"sticky",
      top: "186px",
      opacity: 1,
    },
    '&selected': {
      color: '#333',
      FontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#333',
    },
  },  
),
)((props: CRXTabProps) => <Tab disableRipple disableFocusRipple {...props} />)

interface CRXTabProps {
    label: string;
    index : number,
    icon? : string
  }
  
interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue : number) => void;
  tabitems : Array<CRXTabProps>,
  selectionFollowsFocus?: boolean;
  stickyTab? : number
}



const CRXTabs = ({value, onChange, tabitems, stickyTab, selectionFollowsFocus = true} : StyledTabsProps) => {
    
    const tabItemsRender = tabitems && tabitems.map((item : CRXTabProps) => {
        return <CrxTab  icon={item.icon} label={item.label} index={item.index}/>
    })

  return (
    <>
        
        <CrxTabsParent 
            selectionFollowsFocus={selectionFollowsFocus}
            value={value}
            onChange={onChange}
            aria-label="ant example"
            variant="scrollable"
            scrollButtons="auto"
            className="crxMainTab"
            style={{"top" : stickyTab + "px"}}
            ScrollButtonComponent = {(props) => {
             
              if (
                props.direction === "left" &&
                props.disabled == false
            ) {
                return (
                    <Button  disableRipple {...props}>
                        <i
                            style={{
                                marginLeft: "0px"
                            }}
                            color="#fff"
                            className='fas fa-chevron-left'
                        ></i>
                    </Button>
                );
            } else if (
                props.direction === "right" && 
                props.disabled == false
            ) {
                return (
                    <Button disableRipple {...props}>
                          <i
                            style={{
                                marginLeft: "0px"
                            }}
                            color="#fff"
                            className='fas fa-chevron-right'
                        ></i>
                    </Button>
                );
            } else {
                return null;
            }

            }}
        >
          {tabItemsRender}
        </CrxTabsParent>
        </>
  );
}

export default CRXTabs;