import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ALPRDataSource } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';

const Datasource = "HotListDataSource";

export const GetAlprDataSourceList: any = createAsyncThunk(
  'GetAlprDataSourceList',
  async (pageiFilter: any, thunkAPI) => {
    thunkAPI.dispatch(setLoaderValue({ isLoading: true }))
    const url = Datasource + `?Page=${pageiFilter.page + 1}&Size=${pageiFilter.size}`
    let headers = [
      {
        key: 'GridFilter',
        value: JSON.stringify(pageiFilter.gridFilter)
      },
      {
        key: 'GridSort',
        value: JSON.stringify(pageiFilter.gridSort)
      }]
    return await ALPRDataSource.getAllDataSourceInfoAsync(url, headers)
      .then((response: any) => {
        thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "" }))
        return response
      }).catch((error: any) => {
        thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
        console.error(error.response.data);
      });
  }
);

export const GetAlprDataSourceById: any = createAsyncThunk(
  'GetAlprDataSourceById',
  async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setLoaderValue({ isLoading: true }))
    const url = Datasource + `/${id}`
    return await ALPRDataSource.getDataSourceData(url)
      .then((response: any) => {
        thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "" }))
        return response;
      }).catch((error: any) => {
        thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
        console.error(error.response.data);
      });
  }
);

export const AlprDataSourceSlice = createSlice({

  name: 'AlprDataSource',
  initialState: { DataSource: [], SourceMapping: [], DataSourceDataById: {} },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(GetAlprDataSourceList.fulfilled, (state: any, { payload }) => {
      state.DataSource = payload;
    })
      .addCase(GetAlprDataSourceById.fulfilled, (state: any, { payload }) => {
        state.DataSourceDataById = payload;
      })
      .addCase(GetAlprDataSourceById.fulfilled, (state: any, { payload }) => {
        state.DataSourceDataById = payload;
      })
  }
});

export default AlprDataSourceSlice;