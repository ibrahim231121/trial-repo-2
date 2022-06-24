import { combineReducers } from '@reduxjs/toolkit'
import pathNameReducer from './breadCrumbReducer';
import assetBucketSlice from './AssetActionReducer';
import groupSlice from './GroupReducer';
import categorySlice from './categoryReducer';
import CategoryFormSlice from './CategoryFormSlice';
import unitSlice from './UnitReducer';
import userSlice from './UserReducer';
import notificationMessages from './notificationPanelMessages'
import timerSlice from './timerslice';
import templateSlice from './TemplateConfiguration';
import cultureSlice from './languageSlice';
import templateSlice1 from './AssetConfiguration';
import unitTemplateSlice from './templateDynamicForm';
import categoriesSlice from './SetupConfigurationReducer';
import stationsSlice from './StationReducer';
import assetSearchSlice from './AssetSearchReducer';
import  configurationTemplatesReducerSlice from './ConfigurationTemplatesReducer';

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
  timerReducers: timerSlice.reducer,
  templateSlice: templateSlice.reducer,
  unitTemplateSlice: unitTemplateSlice.reducer,
  templateSlice1: templateSlice1.reducer,
  cultureReducer: cultureSlice.reducer,
  unitReducer: unitSlice.reducer,
  setupConfigurationReducer : categoriesSlice.reducer,
  assetSearchReducer: assetSearchSlice.reducer,
  configurationTemplatesSlice : configurationTemplatesReducerSlice.reducer,
})
export type RootState = ReturnType<typeof reducer>
