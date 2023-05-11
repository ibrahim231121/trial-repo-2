import { responsiveFontSizes } from '@material-ui/core';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import React from 'react';
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

export const GetHotListData: any = createAsyncThunk(
  'GetHotListData',
  async (param: any) => {
    let temp: any = rows;
    if (param!==undefined && param.gridFilter.filters.length > 0) {
      param.gridFilter.filters.map((item: any) => {
        if (item.value.includes('@')) 
        {
          temp = temp.filter((x: any) =>item.value.toLowerCase().includes( x[`${item.field}`].toString().toLowerCase()));
        }
        else 
        {
          temp = temp.filter((x: any) => x[`${item.field}`].toString().toLowerCase().includes(item.value.toLowerCase()));
        }
      });
      return temp;
    }
    else {

      return rows;
    }
  }
);



export const UpdateHotListData: any = createAsyncThunk(
  'UpdateHotListData',
  async (params: any) => {
    return params.newGridData;
  }
);



export const HotListSlice = createSlice({
  name: 'hotList',
  initialState: { HotList: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetHotListData.fulfilled, (state: any, { payload }) => {
      state.HotList = payload;
    })
      .addCase(UpdateHotListData.fulfilled, (state: any, { payload }) => {
        state.HotList = payload;
      })
  }
});

export default HotListSlice;