import React from "react";
import { Switch, Route } from "react-router-dom";
import clsx from 'clsx';
import { CRXAppBar, CRXContainer, CRXPanelStyle, } from "@cb/shared";
import AppHeader from './Application/Headeer/Header'
import Footer from './Application/Headeer/Footer'
import MannageAsset from "./Application/Assets/pages/MannageAsset";
import UserGroup from "./Application/Admin/UserGroup/UserGroup";
import User from "./Application/Admin/UserGroup/User/User";
import Group from "./Application/Admin/Group/Group";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Login from './Login/index';
import Token from './Login/Components/Token';
import PrivateRoute from "./Routes/PrivateRoute";
import HomeRoute from "./Routes/HomeRoute";
import IdleTimer from 'react-idle-timer'
import { urlList } from "./utils/urlList"
import Logout from "./Logout/index";
import SessionRoute from './Routes/SessionRoute';
import {logOutUserSessionExpired} from './Logout/API/auth'
import Session from './SessionExpired/index'
import UnitAndDevices from './UnitAndDevice/UnitsAndDevices'
import UnitConfiguration from "./Application/Admin/UnitConfiguration/UnitConfiguration";
import UnitConfigurationTemplate from "./Application/Admin/UnitConfiguration/ConfigurationTemplates/ConfigurationTemplate";
import CreateUnitConfigurationTemplate from "./Application/Admin/UnitConfiguration/ConfigurationTemplates/CreateConfigurationTemplate";
import UnitAndDevicesDetial from './UnitAndDevice/Detail/Detail'
import AssetDetailsTemplate from "./Application/Assets/pages/AssetDetailsTemplate";

const Routes = () => {
  const [open, setOpen] = React.useState(true);
  const classes = CRXPanelStyle();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

 //session expiration method
 const handleOnIdle = () => {
  localStorage.setItem("sessionRoute","sessionRoute")
  logOutUserSessionExpired();
  window.location.replace("/sessionExpiration");
}

  return (
    <div>
      <Switch>
      <HomeRoute path="/" exact={true} component={Login} />
      <HomeRoute exact path="/logout"  component={Logout} />
      <SessionRoute  exact path="/sessionExpiration" component={Session} />
      <Route exact path="/token/:token" component={Token}/>
        <>
        <IdleTimer 
          timeout={1200000}
          onIdle={handleOnIdle}
        > 
          <CRXAppBar position="fixed">
            <AppHeader onClick={handleDrawerToggle} onClose={handleDrawerToggle} open={open} />
          </CRXAppBar>
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <Switch>

              {/* <Route path="/" exact={true} component={() => <>Home componentss</>} /> */}
              <PrivateRoute  path={Object.entries(urlList)[0][0].toString()} exact={true} component={MannageAsset} />
              <Route path={Object.entries(urlList)[1][0].toString()} exact={true} component={UserGroup} />
              <Route path={Object.entries(urlList)[2][0].toString()} exact={true} component={Group} />
              <Route path={Object.entries(urlList)[3][0].toString()} exact={true} component={Group} />
              <Route path={Object.entries(urlList)[4][0].toString()} exact={true} component={User} />
              <Route path="/token/:token" exact={true} component={Token} />
              <PrivateRoute path={Object.entries(urlList)[5][0].toString()} exact={true} component={UnitAndDevices} />
              <PrivateRoute path={Object.entries(urlList)[8][0].toString()} exact={true} component={UnitConfiguration} />
              <PrivateRoute path={Object.entries(urlList)[6][0].toString()} exact={true} component={UnitConfigurationTemplate} />
              <PrivateRoute path={Object.entries(urlList)[7][0].toString()} exact={true} component={CreateUnitConfigurationTemplate} />
              <PrivateRoute path={Object.entries(urlList)[9][0].toString() }  exact={true} component={UnitAndDevicesDetial} />
              <PrivateRoute  path={Object.entries(urlList)[10][0].toString()} exact={true} component={AssetDetailsTemplate} />
              <PrivateRoute path="*" component={ErrorPage} />
              
            </Switch>
          </main>
          <footer>
            <Footer />
          </footer>
          </IdleTimer>
        </>
      </Switch>
     
    </div>
  );
};


export default Routes;