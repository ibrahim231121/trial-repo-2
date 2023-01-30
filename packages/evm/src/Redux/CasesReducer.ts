import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {  CasesAgent } from '../utils/Api/ApiAgent';
import { Cases } from '../utils/Api/models/CasesModels';
import { MAX_REQUEST_SIZE_FOR} from '../utils/constant'
import { setLoaderValue } from './loaderSlice';

export const getCasesInfoAsync: any = createAsyncThunk('getCasesInfo', async (pageiFilter: any, thunkAPI) => {
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
    return await CasesAgent.getAllCases(`?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
      .then((response:any) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
        return response
      })
      .catch((error: any) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
        console.error(error.response.data);
      });
  });
  
  // export const getCasesInfoAllAsync: any = createAsyncThunk('getCasesInfoAll', async (_, thunkAPI) => {
  //   thunkAPI.dispatch(setLoaderValue({isLoading: true}))
  //   return await CasesAgent.getAllCasesInfo(`?Page=1&Size=${MAX_REQUEST_SIZE_FOR.CASES}`)
  //     .then((response:Cases[]) => {
  //       thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
  //       return response
  //     })
  //     .catch((error: any) => {
  //       thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
  //       console.error(error.response.data);
  //     });
  // });

  
  export const casesSlice = createSlice({
    name: 'cases',
    initialState: { casesInfo: [], cases: [] },
    reducers: {},
  
    extraReducers: {
      // [getCasesInfoAllAsync.fulfilled]: (state, { payload }) => {
      //   state.casesInfo = payload;
      // },
      [getCasesInfoAsync.fulfilled]: (state, { payload }) => {
        state.cases = payload;
      }
    }
  });
  
  export default casesSlice;
  