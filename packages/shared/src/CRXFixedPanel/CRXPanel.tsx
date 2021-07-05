import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import CRXPanelStyle  from "./CRXPanelStyle"
import './CRXPanel.scss'

type Anchor = 'top' | 'left' | 'bottom' | 'right';
type Variant = 'permanent' | 'persistent' | 'temporary';

interface propsType {
  open : boolean,
  onClick: (e : any) => void,
  onClose : (e : any) => void,
  children : React.ReactNode,
  anchor : Anchor,
  variant : Variant ,
  className? : string
}

const CRXFixedPanel = ({className, open, onClick, onClose, children, anchor, variant = "temporary"} : propsType) => {
  const classes = CRXPanelStyle();
  return (
    <div>
      <div className="panelButton">
      <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={onClick}
      disableRipple={true}
      >
      <span className="icon-menu"></span>
      </IconButton>
      
      </div>
      <Drawer
        className={classes.drawer + " crxPanel " + className}
        variant={variant}
        anchor={anchor}
        open={open}
      >
     
        { children }
      </Drawer>

    </div>
  );
}

export default CRXFixedPanel;