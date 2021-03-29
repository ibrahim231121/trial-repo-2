import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import './CRXDrawer.scss'

type Anchor = 'top' | 'left' | 'bottom' | 'right';
type Variant = 'permanent' | 'persistent' | 'temporary';
type CBXDrawerProps = {
    children : React.ReactNode,
    anchor : Anchor,
    variant? : Variant,
    button? : React.ReactNode,
    className? : string
}

const CRXDrawer = ({children, anchor, variant, button, className} : CBXDrawerProps) => {
  
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });


  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <>
        <Button className="drawerButton" onClick={toggleDrawer(anchor, true)}>{button}</Button>
        <Drawer className={"CBXdrawerPanel " + className} anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} variant={variant}>
            {children}
        </Drawer>
    </>
  );
}

export default CRXDrawer;