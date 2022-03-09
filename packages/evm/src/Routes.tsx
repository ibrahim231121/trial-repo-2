import React,{useEffect} from "react";
import { Switch, Route } from "react-router-dom";
import clsx from 'clsx';
import { CRXAppBar, CRXContainer, CRXPanelStyle, } from "@cb/shared";
import AppHeader from './Application/Header/index'
import Footer from './Application/Footer'
import MannageAsset from "./Application/Assets/AssetLister";
import UserGroup from "./Application/Admin/UserGroup";
import Group from "./Application/Admin/UserGroup/Group";
import ErrorPage from "./GlobalComponents/ErrorPage";
import Login from './Login/index';
import Token from './Login/Components/Token';
import PrivateRoute from "./Routes/PrivateRoute";
import HomeRoute from "./Routes/HomeRoute";
import { urlList, urlNames } from "./utils/urlList"
import User from "./Application/Admin/User/";
import TestViewsForDemo from '../../evm/src/TestForComponents/index'
import IdleTimer from 'react-idle-timer'
import Logout from "./Logout/index";
import SessionRoute from './Routes/SessionRoute';
import {logOutUserSessionExpired} from './Logout/API/auth'
import Session from './SessionExpired/index'
import UnitAndDevices from './UnitAndDevice/UnitsAndDevices'
import UnitConfiguration from "./Application/Admin/UnitConfiguration/UnitConfiguration";
import UnitConfigurationTemplate from "./Application/Admin/UnitConfiguration/ConfigurationTemplates/ConfigurationTemplate";
import AssetDetailsTemplate from "./Application/Assets/Detail/AssetDetailsTemplate";
import VideoPlayer from "./components/MediaPlayer/VideoPlayerBase";
import Evidence from "./components/Evidence/ConfigEvidence";
import { isAuthenticated } from "./Login/API/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Redux/rootReducer";
import { timerActionCreator } from "../src/Redux/timerslice";
import { AUTHENTICATION_NewAccessToken_URL } from './utils/Api/url'
import CreateUnitAndDevicesTemplateBC04 from './UnitAndDevice/DeviceTemplate/CreateTemplateBC04'
import UnitCreate from './UnitAndDevice/Detail/UnitDetail'
import Cookies from "universal-cookie";
import Restricted from "./ApplicationPermission/Restricted";

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

//   useEffect(() => {
//     if (isAuthenticated()){

//      if (timer == 0){
//       fetch(AUTHENTICATION_NewAccessToken_URL+`?refreshToken=${refreshToken}`)
//            .then(response  => response.json())
//             .then(response =>                      
//                  updatetokens(response.refreshToken, response.accessToken)
//                  );
//       dispatch(timerActionCreator(3480)) //time in sec
//      }
    
//       var id = setInterval(timers, 1000);      
//       return () => clearInterval(id);
//     }
//   },
  
// );


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
              <PrivateRoute moduleId={1} path={urlList.filter((item:any) => item.name === urlNames.assets)[0].url} exact={true} component={MannageAsset} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.assetsDetail)[0].url} exact={true} component={(routeProps:any) => <AssetDetailsTemplate {...routeProps} />} />           
              <PrivateRoute moduleId={5} path={urlList.filter((item:any) => item.name === urlNames.adminUserGroups)[0].url}  exact={true} component={UserGroup} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.adminUserGroupId)[0].url} exact={true} component={Group} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) =>  item.name === urlNames.userGroupCreate)[0].url} exact={true} component={Group} />
              <PrivateRoute moduleId={8} path={urlList.filter((item:any) => item.name === urlNames.adminUsers)[0].url} exact={true} component={User} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url} exact={true} component={UnitAndDevices} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.adminUnitConfiguration)[0].url} exact={true} component={UnitConfiguration} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.adminUnitConfigurationTemplate)[0].url} exact={true} component={UnitConfigurationTemplate} />     
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreateBCO4)[0].url} exact={true}  component={(routeProps:any) => <CreateUnitAndDevicesTemplateBC04 {...routeProps} />} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.testVideoPlayer)[0].url} exact={true} component={VideoPlayer} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.unitsAndDevicesDetail)[0].url} exact={true} component={(routeProps:any) => <UnitCreate {...routeProps} />} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.testEvidence)[0].url} exact={true} component={Evidence} />
              <Route path="/admin/TestDemo" exact={true} component={TestViewsForDemo} />
              <Route path="/notfound" component={ErrorPage} /> 
              <Route path="*" component={ErrorPage} />

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