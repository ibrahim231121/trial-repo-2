import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATION_INFO_GET_URL, CountryStateApiUrl } from '../utils/Api/url';

export const getStationsInfoAsync: any = createAsyncThunk('getStationsInfo', async () => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', TenantId: '1' }
  };
  const resp = await fetch(STATION_INFO_GET_URL, requestOptions);
  if (resp.ok) {
    const response = await resp.json();
    return response;
  }
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

export const stationsSlice = createSlice({
  name: 'station',
  initialState: { stationInfo: [], countryStates: [] },
  reducers: {},

  extraReducers: {
    [getStationsInfoAsync.fulfilled]: (state, { payload }) => {
      state.stationInfo = payload;
    },
    [getCountryStateAsync.fulfilled]: (state, { payload }) => {
      state.countryStates = payload;
    }
  }
});

export default stationsSlice;
