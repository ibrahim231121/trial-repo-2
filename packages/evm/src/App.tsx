import React from "react";
import Routes from "./Routes";
import { CRXAppBar, CRXContainer } from "@cb/shared";
import AppHeader from './Application/Headeer/Header'
function App() {


  return (

    <>
       <CRXAppBar>
          <AppHeader />
      </CRXAppBar>
      <div />
      <CRXContainer maxWidth="xl" disableGutters={true}>
        <Routes />
      </CRXContainer>
    </>
  );
}

export default App;

