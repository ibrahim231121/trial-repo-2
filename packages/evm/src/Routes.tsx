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
import VideoPlayer from "./components/MediaPlayer/VideoPlayerBase";
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
  path: string,
  expires:Date
}

const updatetokens = (refreshToken : string, accessToken: string)=>
{
  localStorage.setItem("refreshToken", refreshToken) 
  const condition = localStorage.getItem('remember me')   
  if (condition == "True")
  {
  const date:any = localStorage.getItem('expiryDate')
  const dateToTimeStamp = new Date(date).getTime()
  const currentDate = new Date().getTime()
  const difference = dateToTimeStamp - currentDate
  var newdateInTimeStamp = difference + currentDate
  var newdateReadable = new Date(newdateInTimeStamp)
  const options:CounterState = { path:'/',expires:newdateReadable };
  cookies.set('access_token', accessToken, options)     
  }
  else
  {
    const options = {path:'/'}
    cookies.set('access_token',accessToken,options);
  }
  
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
      dispatch(timerActionCreator(3480)) //time in sec
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
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.assets)[0].url} exact={true} component={MannageAsset} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.adminUserGroups)[0].url}  exact={true} component={UserGroup} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.adminUserGroupId)[0].url} exact={true} component={Group} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.userGroupCreate)[0].url} exact={true} component={Group} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.adminUsers)[0].url} exact={true} component={User} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url} exact={true} component={UnitAndDevices} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.unitsAndDevicesDetail)[0].url} exact={true} component={UnitAndDevicesDetial} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.assetsDetail)[0].url} exact={true} component={AssetDetailsTemplate} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.adminUnitConfiguration)[0].url} exact={true} component={UnitConfiguration} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.adminUnitConfigurationTemplate)[0].url} exact={true} component={UnitConfigurationTemplate} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.adminUnitConfigurationTemplateCreate)[0].url} exact={true} component={CreateUnitConfigurationTemplate} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreate)[0].url} exact={true} component={CreateTemplate} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateClone)[0].url} exact={true} component={CloneTemplate} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplate)[0].url} exact={true} component={DevicesTemplate} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreateBCO4)[0].url} exact={true} component={CreateUnitAndDevicesTemplateBC04} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreateBCO3)[0].url} exact={true} component={CreateUnitAndDevicesTemplateBC03} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreateBCO3Lte)[0].url} exact={true} component={CreateUnitAndDevicesTemplateBC03lte} />
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.testVideoPlayer)[0].url} exact={true} component={VideoPlayer} />
              <PrivateRoute path="/admin/TestDemo" exact={true} component={TestViewsForDemo} />
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