import { combineReducers } from '@reduxjs/toolkit'
import pathNameReducer from './breadCrumbReducer';
import assetBucketSlice from './AssetActionReducer';
import groupSlice from './GroupReducer';
import unitSlice from './UnitReducer';
import userSlice from './UserReducer';
import timerSlice from './timerslice';
import templateSlice from './TemplateConfiguration';
import cultureSlice from './languageSlice';
//combine Reducers
export const reducer = combineReducers({
  pathName: pathNameReducer.reducer,
  assetBucket: assetBucketSlice.reducer,
  groupReducer: groupSlice.reducer, 
  timerReducers: timerSlice.reducer,
  userReducer: userSlice.reducer,

 templateSlice: templateSlice.reducer,
  cultureReducer: cultureSlice.reducer,
  unitReducer: unitSlice.reducer
})
export type RootState = ReturnType<typeof reducer>
