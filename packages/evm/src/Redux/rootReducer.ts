import { combineReducers } from '@reduxjs/toolkit'
import pathNameReducer from './breadCrumbReducer';
import assetBucketSlice from './AssetActionReducer';
import assetThumbnailSlice from './AssetThumbnailReducer';
import groupSlice from './GroupReducer';
import categorySlice from './categoryReducer';
import CategoryFormSlice from './CategoryFormSlice';
import unitSlice from './UnitReducer';
import userSlice from './UserReducer';
import HotListSlice from './AlprHotListReducer';
import notificationMessages from './notificationPanelMessages'
import timerSlice from './timerslice';
import templateSlice from './TemplateConfiguration';
import cultureSlice from './languageSlice';
import templateSlice1 from './AssetConfiguration';
import unitTemplateSlice from './templateDynamicForm';
import stationsSlice from './StationReducer';
import assetSearchSlice from './AssetSearchReducer';
import configurationTemplatesReducerSlice from './ConfigurationTemplatesReducer';
import auditLogSlice from './AuditLogReducer';
import timelineDetailSlice from './VideoPlayerTimelineDetailReducer';
import assetDetailSlice from './AssetDetailsReducer';
import loaderSlice from './loaderSlice';
import accessAndRefreshTokenSlice from './AccessAndRefreshTokenReducer';
import sensorEventsSlice from './SensorEvents';
import retentionPoliciesSlice from './RetentionPolicies';
import uploadPoliciesSlice from './UploadPolicies';
import categoriesSlice from './Categories';
import categoryFromsSlice from './CategoryForms';
import groupedSelectedAssets from './groupedSelectedAssets';
import groupedSelectedAssetsActions from './groupedSelectedAssetsActions';
import fromFieldsSlice from './FormFields';
import assetBucketBasketSlice from './assetBucketBasketSlice';
import casesSlice from './CasesReducer';
import UpdateVersionsSlice from './UpdateVersionSlices';
import FilteredUpdateVersionsSlice, { getAllFilteredUpdateVersionsPagedAsync } from './FilteredUpdateVersionsSlice';
import VideoPlayerSettingsSlice from './VideoPlayerSettingsReducer';
import ActionMenuEffectSlice from './ActionMenuEffectReducer';
import caseSharingSlice from './CaseSharingReducer';
import AlprDataSourceSlice from './AlprDataSourceReducer';
import LicensePlateSlice from './AlprLicensePlateReducer';
//combine Reducers
export const reducer = combineReducers({
  pathName: pathNameReducer.reducer,
  assetBucket: assetBucketSlice.reducer,
  assetThumbnail: assetThumbnailSlice.reducer,
  groupReducer: groupSlice.reducer,
  assetCategory: categorySlice.reducer,
  CategoryFormFields: CategoryFormSlice.reducer,
  userReducer: userSlice.reducer,
  stationReducer: stationsSlice.reducer,
  notificationReducer: notificationMessages.reducer,
  groupedSelectedAssetsReducer: groupedSelectedAssets.reducer,
  groupedSelectedAssetsActionsReducer: groupedSelectedAssetsActions.reducer,
  timerReducers: timerSlice.reducer,
  loaderSlice: loaderSlice.reducer,
  templateSlice: templateSlice.reducer,
  unitTemplateSlice: unitTemplateSlice.reducer,
  accessAndRefreshTokenSlice: accessAndRefreshTokenSlice.reducer,
  templateSlice1: templateSlice1.reducer,
  cultureReducer: cultureSlice.reducer,
  timelineDetailReducer: timelineDetailSlice.reducer,
  unitReducer: unitSlice.reducer,
  assetSearchReducer: assetSearchSlice.reducer,
  assetDetailReducer: assetDetailSlice.reducer,
  configurationTemplatesSlice: configurationTemplatesReducerSlice.reducer,
  auditLogSlice: auditLogSlice.reducer,
  sensorEventsSlice : sensorEventsSlice.reducer, 
  retentionPoliciesSlice : retentionPoliciesSlice.reducer, 
  uploadPoliciesSlice : uploadPoliciesSlice.reducer,
  categoriesSlice : categoriesSlice.reducer,
  CategoryFormSlice : categoryFromsSlice.reducer,
  FormFieldsSlice : fromFieldsSlice.reducer,
  assetBucketBasketSlice : assetBucketBasketSlice.reducer,
  caseReducer: casesSlice.reducer,
  updateVersionsSlice : UpdateVersionsSlice.reducer,
  filteredUpdateVersionsSlice : FilteredUpdateVersionsSlice.reducer,
  videoPlayerSettingsSlice : VideoPlayerSettingsSlice.reducer,
  ActionMenuEffectSlice : ActionMenuEffectSlice.reducer,
  caseSharingSlice : caseSharingSlice.reducer,
  hotListReducer: HotListSlice.reducer,
  alprDataSourceReducer: AlprDataSourceSlice.reducer,
  alprLicensePlateReducer: LicensePlateSlice.reducer,

})
export type RootState = ReturnType<typeof reducer>
