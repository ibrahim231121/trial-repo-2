import React from "react";
import { Switch, Route } from "react-router-dom";
import clsx from 'clsx';
import { CRXAppBar, CRXPanelStyle, } from "@cb/shared";
import AppHeader from './Application/Headeer/Header'
import Footer from './Application/Headeer/Footer'
import MannageAsset from "./Application/Assets/pages/MannageAsset";
import UserGroup from "./Application/Admin/UserGroup/UserGroup";
import Group from "./Application/Admin/Group/Group";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Login from './Login/index';
import Token from './Login/Components/Token';
import PrivateRoute from "./Routes/PrivateRoute";
import HomeRoute from "./Routes/HomeRoute";
import TestViewsForDemo from './TestForComponents/'
import { urlList } from "./utils/urlList"
import User from "./Application/Admin/UserGroup/User/User";
const Routes = () => {
  const [open, setOpen] = React.useState(true);
  const classes = CRXPanelStyle();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <HomeRoute path="/" exact={true} component={Login} />
      <Route path={'/(.+)'} render={() => (
        <>
          <CRXAppBar position="fixed">
            <AppHeader onClick={handleDrawerToggle} onClose={handleDrawerToggle} open={open} />
          </CRXAppBar>
          <main
            className={clsx(classes.content,'crx-main-container', {
              [classes.contentShift]: open,
            })}
          >
            <Switch>

              {/* <Route path="/" exact={true} component={() => <>Home componentss</>} /> */}
              <PrivateRoute path={Object.entries(urlList)[0][0].toString()} exact={true} component={MannageAsset} />
              <Route path={Object.entries(urlList)[1][0].toString()} exact={true} component={UserGroup} />
              <Route path={Object.entries(urlList)[2][0].toString()} exact={true} component={Group} />
              <Route path={Object.entries(urlList)[3][0].toString()} exact={true} component={Group} />
              <Route path={Object.entries(urlList)[4][0].toString()} exact={true} component={User} />
              <Route path={Object.entries(urlList)[5][0].toString()} exact={true} component={TestViewsForDemo} />
              <Route path="/token/:token" exact={true} component={Token} />
              <PrivateRoute path="*" component={ErrorPage} />
            </Switch>
          </main>
          <footer>
            <Footer />
          </footer>
        </>
      )}>
      </Route>
    </div>
  );
};


export default Routes;