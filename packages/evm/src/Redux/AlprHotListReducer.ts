import { responsiveFontSizes } from '@material-ui/core';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import React from 'react';
import { setLoaderValue } from './loaderSlice';
import { ALPR_HOTLIST } from '../utils/Api/url';
import { HotListAgent } from '../utils/Api/ApiAgent';
const rows = [{
  id: 1,
  Name: 'John',
  description: 'Hot list contain sensitive Data',
  sourceName: 1,
  ruleExpressions: '',
  color: '#ff0000',
  alertPriority: 12,
  audio: ''
}
  ,
{
  id: 2,
  Name: 'Webster',
  description: 'my Description',
  sourceName: 1,
  ruleExpressions: '',
  color: '',
  alertPriority: 20,
  audio: 'as'
}
  ,
{
  id: 3,
  Name: 'adam',
  description: 'I am new here',
  sourceName: 0,
  ruleExpressions: '',
  color: '#000000',
  alertPriority: 20,
  audio: 'as'
}
  ,
{
  id: 4,
  Name: 'Brock',
  description: 'my Description',
  sourceName: 0,
  ruleExpressions: '',
  color: '',
  alertPriority: 20,
  audio: 'as'
}
  ,
{
  id: 5,
  Name: 'Lesnar',
  description: 'my Description',
  sourceName: 0,
  ruleExpressions: '',
  color: '',
  alertPriority: 20,
  audio: 'as'
}
  ,
{
  id: 6,
  Name: 'Hack',
  description: 'my Description',
  sourceName: 0,
  ruleExpressions: '',
  color: '',
  alertPriority: 20,
  audio: 'as'
}
  ,
{
  id: 7,
  Name: 'hacker',
  description: 'my Description',
  sourceName: 1,
  ruleExpressions: '',
  color: '',
  alertPriority: 20,
  audio: 'as'
}
  ,
{
  id: 8,
  Name: 'bytebytego',
  description: 'my Description',
  sourceName: 2,
  ruleExpressions: '',
  color: '',
  alertPriority: 20,
  audio: 'as' 
}
];

export const GetAllHotListData: any = createAsyncThunk(
  'GetAllHotListData',
  async (param: any, thunkAPI) => {
    thunkAPI.dispatch(setLoaderValue({isLoading: true}))
    
    const url = ALPR_HOTLIST + `?Page=${param.page+1}&Size=${param.size}`
        let headers = [
            {   
                key : 'GridFilter', 
                value : JSON.stringify(param.gridFilter)
            },
            {
                key: 'GridSort', 
                value : JSON.stringify(param.gridSort)
            }]
             return await HotListAgent
             .getAllHotListInfosAsync(url, headers)
             .then((response) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
                return response
            }).catch((error: any) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
                console.error(error.response.data);
                return error.response.status
              });
  }
);

export const GetHotListData: any = createAsyncThunk(
  'GetHotListData',
  async (param: any, thunkAPI) => {
    thunkAPI.dispatch(setLoaderValue({isLoading: true}))
    
    const url = ALPR_HOTLIST + `/${param}`
        
             return await HotListAgent
             .getHotListInfoAsync(url)
             .then((response) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
                return response
            }).catch((error: any) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
                console.error(error.response.data);
                return error.response.status
              });
  }
);




export const HotListSlice = createSlice({
  name: 'hotList',
  initialState: { HotList: [], hotListDetails:{} },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetAllHotListData.fulfilled, (state: any, { payload }) => {
      state.HotList = payload;
    })
    .addCase(GetHotListData.fulfilled, (state: any, { payload }) => {
      state.hotListDetails = payload;
    })
  }
});

export default HotListSlice;