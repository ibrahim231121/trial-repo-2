import React from "react";
import { Switch, Route } from "react-router-dom";
import clsx from 'clsx';
import { CRXAppBar, CRXContainer, CRXPanelStyle, } from "@cb/shared";
import AppHeader from './Application/Header'
import Footer from './Application/Footer'
import MannageAsset from "./Application/Assets/AssetLister";
import UserGroup from "./Application/Admin/UserGroup";
import Group from "./Application/Admin/UserGroup/Group";
import ErrorPage from "./GlobalComponents/ErrorPage";
import Login from './Login/index';
import Token from './Login/Components/Token';
import PrivateRoute from "./Routes/PrivateRoute";
import HomeRoute from "./Routes/HomeRoute";
import { urlList, urlNames } from "./utils/urlList";
import User from "./Application/Admin/User";
import Station from "./Application/Admin/Station/Station";
import StationDetail from "./Application/Admin/Station/StationDetail";
import TestViewsForDemo from '../../evm/src/TestForComponents/index'
import Restricted from "./ApplicationPermission/Restricted";

const Routes = () => {
  const [open, setOpen] = React.useState(true);
  const classes = CRXPanelStyle();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };



  return (
    <div>
      <HomeRoute path="/" exact={true} component={Login} />
      <Route 
       path={'/(.+)'} 
      render={() => (
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
{/* 
              <Route path="/" exact={true} component={() => <>Home componentss</>} /> */}
              <PrivateRoute moduleId={1} path={urlList.filter((item:any) => item.name === urlNames.assets)[0].url} exact={true} component={MannageAsset} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.adminUserGroups)[0].url}  exact={true} component={UserGroup} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.adminUserGroupId)[0].url} exact={true} component={Group} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) =>  item.name === urlNames.userGroupCreate)[0].url} exact={true} component={Group} />
              <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.adminUsers)[0].url} exact={true} component={User} />
              <Route path="/admin/TestDemo" exact={true} component={TestViewsForDemo} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminStation)[0].url} exact={true} component={Station} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminStationCreate)[0].url} exact={true} component={StationDetail} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminStationEdit)[0].url} exact={true} component={StationDetail} />
              <Route path="/token/:token" exact={true} component={Token} />

              <Route path="/notfound" component={ErrorPage} /> 
              <Route path="*" component={ErrorPage} />
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