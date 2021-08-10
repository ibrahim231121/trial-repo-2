import { combineReducers } from '@reduxjs/toolkit'
import pathNameReducer from './breadCrumbReducer';
import assetBucketSlice from './AssetActionReducer';

//combine Reducers
export const reducer = combineReducers({
    pathName:pathNameReducer.reducer,
    assetBucket:assetBucketSlice.reducer
  })
  export type RootState = ReturnType<typeof reducer>
