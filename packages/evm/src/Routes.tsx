import React from "react";
import { Switch, Route } from "react-router-dom";
import MannageAsset from "./Application/Assets/pages/MannageAsset";
import ErrorPage from "./components/ErrorPage/ErrorPage";
const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact={true} component={() => <>Home componentss</>} />
      <Route path="/assets"  exact={true} component={MannageAsset} />
      <Route  path="*"  component={ErrorPage} />
    </Switch>
  );
};

export default Routes;
