import React from "react";
import { Switch, Route } from "react-router-dom";
import clsx from 'clsx';
import { CRXAppBar, CRXContainer, CRXPanelStyle, } from "@cb/shared";
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
import { urlList, urlNames } from "./utils/urlList";
import User from "./Application/Admin/UserGroup/User/User";
import Station from "./Application/Admin/Station/Station";
import StationDetail from "./Application/Admin/Station/StationDetail";
import TestViewsForDemo from '../../evm/src/TestForComponents/index'
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
              <PrivateRoute path={urlList.filter((item:any) => item.name === urlNames.assets)[0].url} exact={true} component={MannageAsset} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminUserGroups)[0].url}  exact={true} component={UserGroup} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminUserGroupId)[0].url} exact={true} component={Group} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.userGroupCreate)[0].url} exact={true} component={Group} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminUsers)[0].url} exact={true} component={User} />
              <Route path="/admin/TestDemo" exact={true} component={TestViewsForDemo} />
              <Route path={urlList.filter((item:any) => item.name === urlNames.adminStation)[0].url} exact={true} component={Station} />
              {/* <Route path={urlList.filter((item:any) => item.name === urlNames.adminStationId)[0].url} exact={true} component={StationDetail} /> */}
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