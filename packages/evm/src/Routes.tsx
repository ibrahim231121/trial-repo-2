import React,{useEffect} from "react";
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
import { urlList, urlNames } from "./utils/urlList"
import IdleTimer from 'react-idle-timer'
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
import CreateComponent from "./components/CreateTemplate/CreateTemplate";
import CreateTemplate from "./Application/Admin/DevicesTemplate/CreateTemplate";
import CloneTemplate from "./Application/Admin/DevicesTemplate/CloneTemplate";
import DevicesTemplate from "./Application/Admin/DevicesTemplate/DevicesTemplate";

import { isAuthenticated } from "./Login/API/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Redux/rootReducer";
import { timerActionCreator } from "../src/Redux/timerslice";
import { AUTHENTICATION_NewAccessToken_URL } from './utils/Api/url'
import CreateUnitAndDevicesTemplateBC04 from './UnitAndDevice/DeviceTemplate/CreateTemplateBC04'
import CreateUnitAndDevicesTemplateBC03 from './UnitAndDevice/DeviceTemplate/CreateTemplateBC03'
import CreateUnitAndDevicesTemplateBC03lte from './UnitAndDevice/DeviceTemplate/CreateTemplateBC03LTE'
import Cookies from "universal-cookie";
import TestViewsForDemo from '../../evm/src/TestForComponents/index';
const cookies = new Cookies();

interface CounterState {
  path: string
}

const options: CounterState = {
  path: '/' ,
}
const updatetokens = (refreshToken : string, accessToken: string)=>
{
  localStorage.setItem("refreshToken", refreshToken)      
  cookies.set('access_token', accessToken, options)
}


const Routes = () => {
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(true);
  const classes = CRXPanelStyle();


  const timer: number = useSelector((state: RootState) => state.timerReducers.value);
  const timers = () => dispatch(timerActionCreator(timer - 1));
  const refreshToken = localStorage.getItem('refreshToken')

 
  useEffect(() => {
    if (isAuthenticated()){

     if (timer == 0){
      fetch(AUTHENTICATION_NewAccessToken_URL+`?refreshToken=${refreshToken}`)
           .then(response  => response.json())
            .then(response =>                      
                 updatetokens(response.refreshToken, response.accessToken)
                 );
      dispatch(timerActionCreator(2053)) //time in sec
     }
    
      var id = setInterval(timers, 1000);      
      return () => clearInterval(id);
    }
  },
  
);


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
            className={clsx(classes.content,'crx-main-container', {
              [classes.contentShift]: open,
            })}
          >
            <Switch>

              {/* <Route path="/" exact={true} component={() => <>Home componentss</>} /> */}
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.assets)[0].url} exact={true} component={MannageAsset} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminUserGroups)[0].url}  exact={true} component={UserGroup} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminUserGroupId)[0].url} exact={true} component={Group} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.userGroupCreate)[0].url} exact={true} component={Group} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminUsers)[0].url} exact={true} component={User} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url} exact={true} component={UnitAndDevices} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.unitsAndDevicesDetail)[0].url} exact={true} component={UnitAndDevicesDetial} />
              
              <Route path={urlList.filter((item:any) => item.name === urlNames.assetsDetail)[0].url} exact={true} component={AssetDetailsTemplate} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminUnitConfiguration)[0].url} exact={true} component={UnitConfiguration} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminUnitConfigurationTemplate)[0].url} exact={true} component={UnitConfigurationTemplate} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminUnitConfigurationTemplateCreate)[0].url} exact={true} component={CreateUnitConfigurationTemplate} />
            
              <Route path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreate)[0].url} exact={true} component={CreateTemplate} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateClone)[0].url} exact={true} component={CloneTemplate} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplate)[0].url} exact={true} component={DevicesTemplate} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreateBCO4)[0].url} exact={true} component={CreateUnitAndDevicesTemplateBC04} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreateBCO3)[0].url} exact={true} component={CreateUnitAndDevicesTemplateBC03} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreateBCO3Lte)[0].url} exact={true} component={CreateUnitAndDevicesTemplateBC03lte} />
           
        
              
              <Route path="/admin/TestDemo" exact={true} component={TestViewsForDemo} />
              <Route path="/token/:token" exact={true} component={Token} />
              {/* <PrivateRoute  path="/test/CreateTemplate" component={CreateComponent} />
              <PrivateRoute path={Object.entries(urlList)[5][0].toString()} exact={true} component={UnitAndDevices} />
              <PrivateRoute path={Object.entries(urlList)[8][0].toString()} exact={true} component={UnitConfiguration} />
              <PrivateRoute path={Object.entries(urlList)[6][0].toString()} exact={true} component={UnitConfigurationTemplate} />
              <PrivateRoute path={Object.entries(urlList)[7][0].toString()} exact={true} component={CreateUnitConfigurationTemplate} />
              <PrivateRoute path={Object.entries(urlList)[9][0].toString() }  exact={true} component={UnitAndDevicesDetial} />
              <PrivateRoute  path={Object.entries(urlList)[10][0].toString()} exact={true} component={AssetDetailsTemplate} />
              <PrivateRoute path={Object.entries(urlList)[11][0].toString()} exact={true} component={CreateTemplate} />
              <PrivateRoute path={Object.entries(urlList)[12][0].toString()} exact={true} component={CloneTemplate} />
              <PrivateRoute path={Object.entries(urlList)[13][0].toString()} exact={true} component={DevicesTemplate} />
              <PrivateRoute path={Object.entries(urlList)[15][0].toString()} exact={true} component={CreateUnitAndDevicesTemplateBC04} />
              <PrivateRoute path={Object.entries(urlList)[16][0].toString()} exact={true} component={CreateUnitAndDevicesTemplateBC03} />
              <PrivateRoute path="*" component={ErrorPage} /> */}
              
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