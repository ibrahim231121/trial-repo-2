import React from "react";
import Routes from "./Routes";
import { CRXAppBar, CRXContainer } from "@cb/shared";
function App() {


  return (

    <>
      <CRXAppBar />
      <div />
      <CRXContainer maxWidth="xl" disableGutters={true}>
        <Routes />
      </CRXContainer>
    </>
  );
}

export default App;
