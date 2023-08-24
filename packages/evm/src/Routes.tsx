import React, { useEffect } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import clsx from 'clsx';
import { CRXAppBar, CRXPanelStyle, } from "@cb/shared";
import AppHeader from './Application/Header/index'
import MannageAsset from "./Application/Assets/AssetLister";
import UserGroup from "./Application/Admin/UserGroup";
import Group from "./Application/Admin/UserGroup/Group";
import ErrorPage from "./GlobalComponents/ErrorPage";
import Login from './Login/index';
import Token from './Login/Components/Token';
import Authenticate from './Login/Components/Authenticate';
import PrivateRoute from "./Routes/PrivateRoute";
import HomeRoute from "./Routes/HomeRoute";
import { urlList, urlNames } from "./utils/urlList";
import User from "./Application/Admin/User/";
import Station from "./Application/Admin/Station/Station";
import StationDetail from "./Application/Admin/Station/StationDetail";
import TestViewsForDemo from '../../evm/src/TestForComponents/index'
import IdleTimer from 'react-idle-timer'
import Logout from "./Logout/index";
import SessionRoute from './Routes/SessionRoute';
import { logOutUserSessionExpired } from './Logout/API/auth'
import Session from './SessionExpired/index'
import AccessDenied from './AccessDenied/Index'
import UnitAndDevices from './UnitAndDevice/UnitsAndDevices'
import UnitConfiguration from "./Application/Admin/UnitConfiguration/UnitConfiguration";
import UnitConfigurationTemplate from "./Application/Admin/UnitConfiguration/ConfigurationTemplates/ConfigurationTemplate";
import AssetDetailsTemplate from "./Application/Assets/Detail/AssetDetailsTemplate";
import VideoPlayer from "./components/MediaPlayer/VideoPlayerBase";
import CreateUnitAndDevicesTemplateBC04 from './UnitAndDevice/DeviceTemplate/CreateTemplateBC04'
import ViewConfigurationTemplateLog from './Application/Admin/UnitConfiguration/ConfigurationTemplates/ViewConfigurationTemplateLog'
import UnitCreate from './UnitAndDevice/Detail/UnitDetail'
import SharedMedia from "./Application/Assets/SharedMedia/SharedMedia";
import TenantSettings from "./Application/Admin/SetupAndConfiguration/TenantSettings";
import ADGroupsMapping from "./Application/Admin/ADGroupsMapping/ADGroupsMapping";
import CreateUserForm from "./Application/Admin/User/CreateUserForm";
import DefaultUnitTemplate from "./Application/Admin/Station/DefaultUnitTemplate/DefaultUnitTemplate";
import SensorsAndTriggersDetail from "./Application/Admin/SensorsAndTriggers/SensorsAndTriggersDetail/SensorsAndTriggersDetail";
import SensorAndTriggersList from './Application/Admin/SensorsAndTriggers/SensorsAndTriggersLister/SensorsAndTriggersList';
import UploadPoliciesDetail from "./Application/Admin/UploadPolicies/UploadPoliciesDetail/UploadPoliciesDetail";
import UploadPoliciesList from './Application/Admin/UploadPolicies/UploadPoliciesLister/UploadPoliciesList';
import RetentionPoliciesList from './Application/Admin/RetentionPolicies/RetentionPoliciesLister/RetentionPoliciesList';
import CategoriesList from "./Application/Admin/Categories/CategoriesLister/CategoriesList";
import CategoryFormsAndFields from "./Application/Admin/CategoryForms/CategoryFormsAndFields/CategoryFormsAndFields";
import CategoryFormsDetail from "./Application/Admin/CategoryForms/CategoryFormsLister/CategoryFormsDetail";
import Cookies from "universal-cookie";
import MicroservicesBuildVersion from "./Application/MicroservicesBV";
import CasesList from "./Application/Cases/CasesLister/CasesList";
import CaseDetail from "./Application/Cases/CaseDetail/CaseDetail";
import CreateCaseWizard from "./Application/Cases/CreateCase/CreateCaseWizard";
import ImageViewer from "./components/MediaPlayer/ImageViewer/ImageViewer";
import CategoriesDetail from "./Application/Admin/Categories/CategoriesDetail/CategoriesDetail";
import RetentionPoliciesDetailPage from "./Application/Admin/RetentionPolicies/RetentionPoliciesDetail/RetentionPoliciesDetail";
import FilterUpdateVersion from "./Application/Admin/Fota/FilterUpdateVersion";
import UpdateVersions from "./Application/Admin/Fota/UpdateVersion";
import TrackingAndSharingList from "./Application/TrackingAndSharing/TrackingAndSharingLister/TrackingAndSharingList";
import CaseAccessPermission from './Application/Cases/CaseAccessPermission/CaseAccessPermission';
import { authenticate } from "./Login/API/auth";
import HotList from "./Application/ALPR/HotList/Index";
import HotListDetail from "./Application/ALPR/HotList/HotListDetail";
import HotListDataSource from "./Application/ALPR/HotListDataSource/Index";
import DataSourceTab from "./Application/ALPR/HotListDataSource/DataSourcePanel";
import CaptureFormPanel from "./Application/ALPR/Capture/CapturePanel";
import {LicensePlate} from "./Application/ALPR/LicensePlate/Index";
import LicensePlateDetail from "./Application/ALPR/LicensePlate/LicensePlateDetail";
import LicensePlateHistory from "./Application/ALPR/LicensePlate/LicensePlateHistory";
import CapturePlateLister from "./Application/ALPR/Capture/CapturePlateLister";
import AlprAdvanceSearch from "./Application/ALPR/AdvanceSearch/AlprAdvanceSearch";
import ManageALPR from "./Application/ALPR/AdvanceSearch/Index";
import AdvanceSearchLister from "./Application/ALPR/AdvanceSearch/AdvanceSearchDataTable/Index";

declare const window: any;
window.URL = window.URL || window.webkitURL;

const cookies = new Cookies();

const Routes = () => {

  const [open, setOpen] = React.useState(true);
  const classes = CRXPanelStyle();
  const history = useHistory();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  //session expiration method
  const handleOnIdle = () => {
   
    // If File inprogress do not session out
    if (window.TotalFilePer != undefined && window.TotalFilePer != 0 && window.TotalFilePer != 100) {
      return true;
    }
    // If command is open in another tab we would not apply idle logic/condition.
    if (!(parseInt(cookies.get("command_tab_count")) > 0)) {
      localStorage.setItem("sessionRoute", "sessionRoute")
      logOutUserSessionExpired(() => {
        history.push('/sessionExpiration')
      })
    }
  }
  const urlLocation = useLocation();

  useEffect(() => {
    let htmlElementTag: any = document.documentElement;
    if (urlLocation.pathname == "/assets/assetSearchResult") {
      htmlElementTag.style.overflowX = "scroll";
    }
    else {
      htmlElementTag.style.overflowX = "auto";
    }
  }, [urlLocation])

  return (
    <div>

      <Switch>
        <HomeRoute path="/" exact={true} component={Login} />
        <HomeRoute exact path="/logout" component={Logout} />
        <SessionRoute exact path="/sessionExpiration" component={Session} />
        <HomeRoute exact path="/accessDenied" component={AccessDenied} />
        <Route exact path="/token/:token" component={Token} />
        <Route path="/authenticate" exact={true} component={Authenticate} />
        <Route exact path="/ImageViewer" component={ImageViewer} />
        <>
          <IdleTimer
            timeout={1200000}
            onIdle={handleOnIdle}
          >
            <CRXAppBar position="fixed">
              <AppHeader onClick={handleDrawerToggle} onClose={handleDrawerToggle} open={open} />
            </CRXAppBar>
            <main
              className={clsx(classes.content, `crx-main-container ${open == true ? "drawerOn " : "drawerOff "}`, {
                [classes.contentShift]: open,
              })}
            >
              <div className="searchComponents">
              <Switch>
                <PrivateRoute moduleId={1} path={urlList.filter((item: any) => item.name === urlNames.assets)[0].url} exact={true} component={MannageAsset} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url} exact={true} component={AssetDetailsTemplate} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.assetSearchResult)[0].url} exact={true} component={MannageAsset} />
                <PrivateRoute moduleId={5} path={urlList.filter((item: any) => item.name === urlNames.adminUserGroups)[0].url} exact={true} component={UserGroup} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.adminUserGroupId)[0].url} exact={true} component={Group} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.userGroupCreate)[0].url} exact={true} component={Group} />
                
                <PrivateRoute moduleId={8} path={urlList.filter((item: any) => item.name === urlNames.adminUsers)[0].url} exact={true} component={User} />
                <PrivateRoute moduleId={93} path={urlList.filter((item: any) => item.name === urlNames.updateVersion)[0].url} exact={true} component={UpdateVersions} />
                <PrivateRoute moduleId={93} path={urlList.filter((item: any) => item.name === urlNames.filterUpdateVersion)[0].url} exact={true} component={FilterUpdateVersion} />
                <PrivateRoute moduleId={93} path={urlList.filter((item: any) => item.name === urlNames.filterUpdateVersionEdit)[0].url} exact={true} component={FilterUpdateVersion} />

                  <PrivateRoute moduleId={13} path={urlList.filter((item: any) => item.name === urlNames.unitsAndDevices)[0].url} exact={true} component={UnitAndDevices} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.adminUnitConfiguration)[0].url} exact={true} component={UnitConfiguration} />
                  <PrivateRoute moduleId={22} path={urlList.filter((item: any) => item.name === urlNames.adminUnitConfigurationTemplate)[0].url} exact={true} component={UnitConfigurationTemplate} />
                  <PrivateRoute moduleId={23} path={urlList.filter((item: any) => item.name === urlNames.unitDeviceTemplateCreateBCO4)[0].url} exact={true} component={CreateUnitAndDevicesTemplateBC04} />
                  <PrivateRoute moduleId={24} path={urlList.filter((item: any) => item.name === urlNames.unitDeviceTemplateEditBCO4)[0].url} exact={true} component={CreateUnitAndDevicesTemplateBC04} />

                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.unitDeviceTemplateViewLog)[0].url} exact={true} component={(routeProps: any) => <ViewConfigurationTemplateLog {...routeProps} />} />

                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.about)[0].url} exact={true} component={MicroservicesBuildVersion} />
                  <PrivateRoute moduleId={17} path={urlList.filter((item: any) => item.name === urlNames.adminStation)[0].url} exact={true} component={Station} />
                  <PrivateRoute moduleId={18} path={urlList.filter((item: any) => item.name === urlNames.adminStationCreate)[0].url} exact={true} component={StationDetail} />
                  <PrivateRoute moduleId={19} path={urlList.filter((item: any) => item.name === urlNames.adminStationEdit)[0].url} exact={true} component={StationDetail} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.manageUnitDeviceTemplate)[0].url} exact={true} component={DefaultUnitTemplate} />

                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.createUser)[0].url} exact={true} component={CreateUserForm} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.editUser)[0].url} exact={true} component={CreateUserForm} />
                  {/* <PrivateRoute moduleId={0} path={urlList.filter((item:any) => item.name === urlNames.sharedMedia)[0].url}  component={SharedMedia}  /> */}
                  <Route path="/admin/TestDemo" exact={true} component={TestViewsForDemo} />
                  <Route path={urlList.filter((item: any) => item.name === urlNames.sharedMedia)[0].url} exact={true} component={SharedMedia} />


                  <PrivateRoute moduleId={17} path={urlList.filter((item: any) => item.name === urlNames.adminStation)[0].url} exact={true} component={Station} />
                  <PrivateRoute moduleId={18} path={urlList.filter((item: any) => item.name === urlNames.adminStationCreate)[0].url} exact={true} component={StationDetail} />
                  <PrivateRoute moduleId={19} path={urlList.filter((item: any) => item.name === urlNames.adminStationEdit)[0].url} exact={true} component={StationDetail} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.manageUnitDeviceTemplate)[0].url} exact={true} component={DefaultUnitTemplate} />

                  <PrivateRoute moduleId={51} path={urlList.filter((item: any) => item.name === urlNames.sensorsAndTriggersEdit)[0].url} exact={true} component={SensorsAndTriggersDetail} />
                  <PrivateRoute moduleId={52} path={urlList.filter((item: any) => item.name === urlNames.sensorsAndTriggersCreate)[0].url} exact={true} component={SensorsAndTriggersDetail} />
                  <PrivateRoute moduleId={49} path={urlList.filter((item: any) => item.name === urlNames.sensorsAndTriggers)[0].url} exact={true} component={SensorAndTriggersList} />

                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.retentionPolicies)[0].url} exact={true} component={RetentionPoliciesList} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.uploadPoliciesEdit)[0].url} exact={true} component={UploadPoliciesDetail} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.uploadPoliciesCreate)[0].url} exact={true} component={UploadPoliciesDetail} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.uploadPolicies)[0].url} exact={true} component={UploadPoliciesList} />
                  <PrivateRoute moduleId={53} path={urlList.filter((item: any) => item.name === urlNames.categories)[0].url} exact={true} component={CategoriesList} />
                  <PrivateRoute moduleId={55} path={urlList.filter((item: any) => item.name === urlNames.categoryForms)[0].url} exact={true} component={CategoryFormsAndFields} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.categoryFormsCreate)[0].url} exact={true} component={CategoryFormsDetail} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.categoryFormsEdit)[0].url} exact={true} component={CategoryFormsDetail} />
                  <Route path="/token/:token" exact={true} component={Token} />
                  <Route path="/authenticate" exact={true} component={Authenticate} />

                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.unitsAndDevicesDetail)[0].url} exact={true} component={UnitCreate} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.tenantSettings)[0].url} exact={true} component={TenantSettings} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.ADGroupsMapping)[0].url} exact={true} component={ADGroupsMapping} />


                  {/* Cases */}
                  <PrivateRoute moduleId={78} path={urlList.filter((item: any) => item.name === urlNames.cases)[0].url} exact={true} component={CasesList} />
                  <PrivateRoute moduleId={79} path={urlList.filter((item: any) => item.name === urlNames.createCase)[0].url} exact={true} component={CreateCaseWizard} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.editCase)[0].url} exact={true} component={CaseDetail} />
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.editCaseWithSharing)[0].url} exact={true} component={CaseDetail} />


                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.createCategory)[0].url} exact={true} component={CategoriesDetail} />
                {/* ALPR Start*/}
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.HotList)[0].url} exact={true} component={HotList} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.HotListDetail)[0].url} exact={true} component={HotListDetail} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.dataSourceList)[0].url} exact={true} component={HotListDataSource} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.editDataSourceTab)[0].url} exact={true} component={DataSourceTab} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.createDataSourceTab)[0].url} exact={true} component={DataSourceTab} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.AlprCapturePanel)[0].url} exact={true} component={CapturePlateLister} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.LicensePlateList)[0].url} exact={true} component={LicensePlate} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.LicensePlateDetailEdit)[0].url} exact={true} component={LicensePlateDetail} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.LicensePlateDetailCreate)[0].url} exact={true} component={LicensePlateDetail} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.LicensePlateHistory)[0].url} exact={true} component={LicensePlateHistory} />
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.AlprAdvanceSearch)[0].url} exact={true} component={ManageALPR} /> 
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.AlprAdvanceSearchResult)[0].url} exact={true} component={ManageALPR} /> 
                <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.AlprSearchLister)[0].url} exact={true} component={AdvanceSearchLister} />
                {/* ALPR End*/}


                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.categoryEdit)[0].url} exact={true} component={CategoriesDetail} />

                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.createRetentionPolicies)[0].url} exact={true} component={RetentionPoliciesDetailPage} />

                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.editRetentionPolicy)[0].url} exact={true} component={RetentionPoliciesDetailPage} />

                  {/* Tracking and Sharing */}
                  <PrivateRoute moduleId={0} path={urlList.filter((item: any) => item.name === urlNames.trackingAndSharing)[0].url} exact={true} component={TrackingAndSharingList} />

                  <Route path="/caseExpired" component={CaseAccessPermission} />
                  <Route path="/accessDenied" component={CaseAccessPermission} />

                  <Route path="/notfound" component={ErrorPage} />
                  <Route path="*" component={ErrorPage} />

                </Switch>
              </div>
            </main>

          </IdleTimer>
        </>
      </Switch>

    </div>
  );
};


export default Routes;