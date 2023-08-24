import { combineReducers } from '@reduxjs/toolkit';
import pathNameReducer from './breadCrumbReducer';
import assetBucketSlice from './AssetActionReducer';
import groupSlice from './GroupReducer';
import categorySlice from './categoryReducer';
import CategoryFormSlice from './CategoryFormSlice';
import unitSlice from './UnitReducer';
import userSlice from './UserReducer';
import HotListSlice from './AlprHotListReducer';
import notificationMessages from './notificationPanelMessages';
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
import metadatainfoDetailSlice from './MetaDataInfoDetailReducer';
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
import assetSeeMoreSlice from './AssetSeeMoreReducer';
import casesSlice from './CasesReducer';
import UpdateVersionsSlice from './UpdateVersionSlices';
import FilteredUpdateVersionsSlice, { getAllFilteredUpdateVersionsPagedAsync } from './FilteredUpdateVersionsSlice';
import trackingAndSharingSlice from './TrackingAndSharingReducer';
import VideoPlayerSettingsSlice from './VideoPlayerSettingsReducer';
import ActionMenuEffectSlice from './ActionMenuEffectReducer';
import caseSharingSlice from './CaseSharingReducer';
import NavigationStateSlice from './NavigationStateReducer';
import caseAuditSlice from './CaseAuditReducer';
import FilteredRelatedAssetSlice from './FilteredRelatedAssetsReducer';
import caseStatusSlice from './CaseStatusReducer';
import AssetDetailPrimaryBreadcrumbSlice from './AssetDetailPrimaryBreadcrumbReducer';
import caseClosedReasonSlice from './CaseClosedReasonReducer';
import GPSAndSensorsReducerSlice from './VideoPlayerGPSAndSensorsReducer';
import tenantSettingsSlice from './TenantSettingsReducer';
import FilteredSearchEvidenceSlice from './FilterSearchEvidence';
import AlprDataSourceSlice from './AlprDataSourceReducer';
import LicensePlateSlice from './AlprLicensePlateReducer';
import alprCapturePlateSlice from './AlprCapturePlateReducer';
import alprPlateHistorySlice from './AlprPlateHistoryReducer';
import AlprAdvanceSearchSlice from './AlprAdvanceSearchReducer';
//combine Reducers
export const reducer = combineReducers({
  pathName: pathNameReducer.reducer,
  assetBucket: assetBucketSlice.reducer,
  groupReducer: groupSlice.reducer,
  assetCategory: categorySlice.reducer,
  CategoryFormFields: CategoryFormSlice.reducer,
  userReducer: userSlice.reducer,
  stationReducer: stationsSlice.reducer,
  notificationReducer: notificationMessages.reducer,
  groupedSelectedAssetsReducer: groupedSelectedAssets.reducer,
  groupedSelectedAssetsActionsReducer: groupedSelectedAssetsActions.reducer,
  timerReducers: timerSlice.reducer,
  NavigationStateReducer:NavigationStateSlice.reducer,
  loaderSlice: loaderSlice.reducer,
  templateSlice: templateSlice.reducer,
  unitTemplateSlice: unitTemplateSlice.reducer,
  accessAndRefreshTokenSlice: accessAndRefreshTokenSlice.reducer,
  templateSlice1: templateSlice1.reducer,
  cultureReducer: cultureSlice.reducer,
  timelineDetailReducer: timelineDetailSlice.reducer,
  metadatainfoDetailReducer: metadatainfoDetailSlice.reducer,
  GPSAndSensorsReducerSlice: GPSAndSensorsReducerSlice.reducer,
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
  trackingAndSharingReducer: trackingAndSharingSlice.reducer,
  videoPlayerSettingsSlice : VideoPlayerSettingsSlice.reducer,
  AssetDetailPrimaryBreadcrumbSlice : AssetDetailPrimaryBreadcrumbSlice.reducer,
  ActionMenuEffectSlice : ActionMenuEffectSlice.reducer,
  caseSharingSlice : caseSharingSlice.reducer,
  caseAuditSlice : caseAuditSlice.reducer,
  assetSeeMoreSlice: assetSeeMoreSlice.reducer,
  caseStatusSlice : caseStatusSlice.reducer,
  caseClosedReasonSlice : caseClosedReasonSlice.reducer,
  filteredRelatedAssetsSlice : FilteredRelatedAssetSlice.reducer,
  FilteredSearchEvidenceSlice: FilteredSearchEvidenceSlice.reducer,
  tenantSettingsReducer: tenantSettingsSlice.reducer,
  hotListReducer: HotListSlice.reducer,
  alprDataSourceReducer: AlprDataSourceSlice.reducer,
  alprLicensePlateReducer: LicensePlateSlice.reducer,
  alprCapturePlateReducer: alprCapturePlateSlice.reducer,
  alprPlateHistoryReducer: alprPlateHistorySlice.reducer,
  alprAdvanceSearchReducer: AlprAdvanceSearchSlice.reducer,
})
export type RootState = ReturnType<typeof reducer>
