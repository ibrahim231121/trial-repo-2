import React from "react";
import { Switch, Route } from "react-router-dom";
import CounterPage from "./Application/Assets/components/CounterPage";
import MannageAsset from "./Application/Assets/pages/MannageAsset";
const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact={true} component={()=><>Home componentss</>} />
      <Route path="/counter" component={CounterPage} exact={true} />
      <Route path="/assets" component={MannageAsset} exact={true} />
    </Switch>
  );
};

export default Routes;
