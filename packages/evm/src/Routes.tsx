import React from "react";
import { Switch, Route } from "react-router-dom";
import MannageAsset from "./Application/Assets/pages/MannageAsset";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Home from './Home/Home'
const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact={true} component={Home} />
      <Route path="/assets"  exact={true} component={MannageAsset} />
      <Route  path="*"  component={ErrorPage} />
    </Switch>
  );
};

export default Routes;
