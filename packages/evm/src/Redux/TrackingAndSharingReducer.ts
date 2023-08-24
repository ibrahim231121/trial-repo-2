import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {  TrackingAndSharingAgent } from '../utils/Api/ApiAgent';
import { TrackingAndSharing } from '../utils/Api/models/TrackingAndSharingModels';
import { MAX_REQUEST_SIZE_FOR} from '../utils/constant'
import { setLoaderValue } from './loaderSlice';

export const getTrackingAndSharingInfoAsync: any = createAsyncThunk('getTrackingAndSharingInfo', async (pageiFilter: any, thunkAPI) => {
    let headers = [
      {   
          key : 'GridFilter', 
          value : JSON.stringify(pageiFilter.gridFilter)
      },
      {
          key: 'GridSort', 
          value : JSON.stringify(pageiFilter.gridSort)
      }, 
      {
          key: "InquireDepth", 
          value:"shallow"
      }]
    thunkAPI.dispatch(setLoaderValue({isLoading: true}))
    return await TrackingAndSharingAgent.getAllTrackingAndSharing(`?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
      .then((response:any) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
        return response
      })
      .catch((error: any) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
        console.error(error.response.data);
      });
  });

  export const getAllSharedTypeKeyValuesAsync: any = createAsyncThunk(
    'getAllSharedTypeKeyValues',
    async () => {
            return await TrackingAndSharingAgent
            .getAllSharedTypeKeyValues(`/RequestTracking/GetAllSharedTypeKeyValues`)
            .then((response) => {       
                return response
        })

  });
  export const getAllStatusKeyValuesAsync: any = createAsyncThunk(
    'getAllStatusKeyValues',
    async () => {
            return await TrackingAndSharingAgent
            .getAllStatusKeyValues(`/RequestTracking/GetAllStatusKeyValues`)
            .then((response) => {       
                return response
        })

  });
  export const getAllRequestTypeKeyValuesAsync: any = createAsyncThunk(
    'getAllRequestTypeKeyValues',
    async () => {
            return await TrackingAndSharingAgent
            .getAllRequestTypeKeyValues(`/RequestTracking/GetAllRequestTypeKeyValues`)
            .then((response) => {       
                return response
        })

  });
  export const setRevokeAccess: any = createAsyncThunk(
    'setRevokeAccess',
    async (Ids: any) => {

            const url = `/RequestTracking/Revoke`
            return await TrackingAndSharingAgent
            .setRevokeAccess(url, Ids)
            .then(() => {       
                return true
        })

  });

  export const trackingAndSharingSlice = createSlice({
    name: 'trackingAndSharing',
    initialState: { trackingAndSharingInfo: [], trackingAndSharing: [], trackingAndSharingSharedType: [], trackingAndSharingStatus: [], trackingAndSharingRequestType: [] },
    reducers: {},
  
    extraReducers: (builder) => {
      builder.addCase(getTrackingAndSharingInfoAsync.fulfilled, (state: any, { payload }) => {
          state.trackingAndSharing = payload;
      }).addCase(getAllSharedTypeKeyValuesAsync.fulfilled, (state: any, { payload })=>{
          state.trackingAndSharingSharedType = payload;
      }).addCase(getAllStatusKeyValuesAsync.fulfilled, (state: any, { payload })=>{
          state.trackingAndSharingStatus = payload;
      }).addCase(getAllRequestTypeKeyValuesAsync.fulfilled, (state: any, { payload })=>{
          state.trackingAndSharingRequestType = payload;
      })
      
    }
  });
  
  export default trackingAndSharingSlice;
  