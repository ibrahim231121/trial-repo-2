import { combineReducers } from '@reduxjs/toolkit'
import pathNameReducer from './breadCrumbReducer';
import assetBucketSlice from './AssetActionReducer';
import groupSlice from './GroupReducer';
import userSlice from './UserReducer';
import timerSlice from './timerslice';
//combine Reducers
export const reducer = combineReducers({
  pathName: pathNameReducer.reducer,
  assetBucket: assetBucketSlice.reducer,
  groupReducer: groupSlice.reducer,
  userReducer: userSlice.reducer,
 timerReducers: timerSlice.reducer
})
export type RootState = ReturnType<typeof reducer>
