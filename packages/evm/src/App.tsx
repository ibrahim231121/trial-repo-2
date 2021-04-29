import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import clsx from 'clsx';
import { CRXAppBar, CRXContainer, CRXPanelStyle } from "@cb/shared";
import AppHeader from './Application/Headeer/Header'

function App() {
  const [open, setOpen] = useState(true);
  const classes = CRXPanelStyle()
   
  const handleDrawerToggle = () => {
      setOpen(!open);
  };
  return (
    
    <>
      <CRXAppBar position="fixed">
          <AppHeader onClick={handleDrawerToggle} onClose={handleDrawerToggle} open={open} />
      </CRXAppBar>
      
      <main 
      className={clsx(classes.content, {
        [classes.contentShift]: open,
      })}
      >
      <CRXContainer className="mainContainer" maxWidth="xl" disableGutters={true}>
        <Routes />
      </CRXContainer>
      </main>
    </>
  );
}

export default App;

