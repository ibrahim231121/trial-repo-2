import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import CounterPage from "./Application/Assets/components/CounterPage";
import MannageAsset from "./Application/Assets/pages/MannageAsset";
const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact={true} component={MannageAsset} />
      <Route path="/counter" component={CounterPage} exact={true} />
    </BrowserRouter>
  );
};

export default Routes;
