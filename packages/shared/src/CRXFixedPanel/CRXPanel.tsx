import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import CRXPanelStyle  from "./CRXPanelStyle";
import CRXTooltip  from "../controls/CRXTooltip/CRXTooltip";
import './CRXPanel.scss';

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





const CRXFixedPanel = ({className, open, onClick,  children, anchor, variant = "temporary"} : propsType) => {
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
         {/* <span className="icon icon-menu3"></span> */}
      <CRXTooltip iconName='icon icon-menu3' arrow={false} className="crxTooltipMenuIcon" placement="bottom-start" title="menu" />
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