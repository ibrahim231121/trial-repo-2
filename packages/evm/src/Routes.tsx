import React from "react";
import { Switch, Route } from "react-router-dom";
import clsx from 'clsx';
import { CRXAppBar, CRXContainer, CRXPanelStyle, } from "@cb/shared";
import AppHeader from './Application/Headeer/Header'
import Footer from './Application/Headeer/Footer'
import MannageAsset from "./Application/Assets/pages/MannageAsset";
import UserGroup from "./Application/Admin/UserGroup/UserGroup";
import CreateUserGroup from "./Application/Admin/UserGroup/CreateUserGroup";
import Group from "./Application/Admin/Group/Group";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Home from './Login/Components/Login'
import Login from './Login/index';
import Token from './Login/Components/Token';
import PrivateRoute from "./Routes/PrivateRoute";
import HomeRoute from "./Routes/HomeRoute";
import IdleTimer from 'react-idle-timer'
import Logout from "./Logout/index";
import SessionRoute from './Routes/SessionRoute';
import {logOutUserSessionExpired} from './Logout/API/auth'
import Session from './SessionExpired/index'
import UnitAndDevices from './UnitAndDevice/UnitsAndDevices'
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
              <PrivateRoute path="/assets" exact={true} component={MannageAsset}/>
              <Route path="/admin/usergroups" exact={true} component={UserGroup}/>
              <Route path="/admin/usergroups/createusergroup" exact={true} component={CreateUserGroup} />
              <PrivateRoute path="/unitsAndDevices" exact={true} component={UnitAndDevices} />
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