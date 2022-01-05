import { combineReducers } from '@reduxjs/toolkit'
import pathNameReducer from './breadCrumbReducer';
import assetBucketSlice from './AssetActionReducer';
import groupSlice from './GroupReducer';
import categorySlice from './categoryReducer';
import CategoryFormSlice from './CategoryFormSlice';
import userSlice from './UserReducer';
import notificationMessages from './notificationPanelMessages'
//combine Reducers
export const reducer = combineReducers({
  pathName: pathNameReducer.reducer,
  assetBucket: assetBucketSlice.reducer,
  groupReducer: groupSlice.reducer,
  assetCategory:categorySlice.reducer,
  CategoryFormFields:CategoryFormSlice.reducer,
  userReducer: userSlice.reducer,
  notificationReducer: notificationMessages.reducer,
})
export type RootState = ReturnType<typeof reducer>
