import * as React from 'react';
import {  withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const CrxTabsParent = withStyles({
    root: {
      borderBottom: '1px solid #333',
    },
    indicator: {
      backgroundColor: '#C34400',
    },
  })(Tabs);

  const CrxTab = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      minWidth: 120,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(0),
      border: "1px solid #333",
      borderBottom:"0px",
      borderRight: "0px",
      background:"#eee",
      color:"#333",
      opacity: 1,
      '&:last-child' : {
        borderRight: "1px solid #333",
      },
      '&:hover': {
        color: '#000',
        opacity: 1,
      },
      '&$selected': {
        color: '#333',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#333',
      },
    },
    selected: {},
}))((props : CRXTabProps) => <Tab disableRipple {...props} />);

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
}



const CRXTabs = ({value, onChange, tabitems, selectionFollowsFocus = true} : StyledTabsProps) => {
    
    const tabItemsRender = tabitems && tabitems.map((item : CRXTabProps) => {
        return <CrxTab  icon={item.icon} label={item.label} index={item.index}/>
    })

  return (
        <CrxTabsParent 
            selectionFollowsFocus={selectionFollowsFocus}
            value={value}
            onChange={onChange}
            aria-label="ant example"
        >
          {tabItemsRender}
        </CrxTabsParent>
  );
}

export default CRXTabs;