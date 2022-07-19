import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CountryStateApiUrl, DATA_RETENTION_POLICIES_GET_ALL, DATA_UPLOAD_POLICIES_GET_ALL } from '../utils/Api/url';
import Cookies from 'universal-cookie';
import { UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { Station } from '../utils/Api/models/StationModels';

const cookies = new Cookies();

export const getStationsInfoAsync: any = createAsyncThunk('getStationsInfo', async () => {
  return await UnitsAndDevicesAgent.getAllStations(`?Size=100&Page=1`)
    .then((response:Station[]) => response)
    .catch((error: any) => {
        console.error(error.response.data);
    });
});

export const getStationsInfoAllAsync: any = createAsyncThunk('getStationsInfoAll', async () => {
  return await UnitsAndDevicesAgent.getAllStationInfo("")
    .then((response:Station[]) => response)
    .catch((error: any) => {
        console.error(error.response.data);
    });
});

export const getCountryStateAsync: any = createAsyncThunk('getCountryStateAsync', async () => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  const resp = await fetch(CountryStateApiUrl, requestOptions);
  if (resp.ok) {
    const response = await resp.json();
    return response.data;
  }
});

export const getRetentionStateAsync: any = createAsyncThunk('getRetentionStateAsync', async () => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', TenantId: '1' }
  };
  const resp = await fetch(DATA_RETENTION_POLICIES_GET_ALL, requestOptions);
  if (resp.ok) {
    const response = await resp.json();
    return response;
  }
  
});

export const getUploadStateAsync: any = createAsyncThunk('getUploadStateAsync', async () => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', TenantId: '1' }
  };
  const resp = await fetch(DATA_UPLOAD_POLICIES_GET_ALL, requestOptions);
  if (resp.ok) {
    const response = await resp.json();
    return response;
  }
  
});


export const stationsSlice = createSlice({
  name: 'station',
  initialState: { stationInfo: [], countryStates: [], retentionState: [], uploadState: [] },
  reducers: {},

  extraReducers: {
    [getStationsInfoAllAsync.fulfilled]: (state, { payload }) => {
      state.stationInfo = payload;
    },
    [getStationsInfoAsync.fulfilled]: (state, { payload }) => {
      state.stationInfo = payload;
    },

    [getCountryStateAsync.fulfilled]: (state, { payload }) => {
      state.countryStates = payload;
    },
    [getRetentionStateAsync.fulfilled]: (state, { payload }) => {
      state.retentionState = payload;
    },
    [getUploadStateAsync.fulfilled]: (state, { payload }) => {
      state.uploadState = payload;
    }
  }
});

export default stationsSlice;
