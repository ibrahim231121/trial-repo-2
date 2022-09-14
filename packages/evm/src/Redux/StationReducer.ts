import { SetupConfigurationAgent } from './../utils/Api/ApiAgent';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CommonAgent, UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { Station } from '../utils/Api/models/StationModels';
import { MAX_REQUEST_SIZE_FOR} from '../utils/constant'
export const getStationsAsync: any = createAsyncThunk('getStationsInfo', async (pageiFilter?: any) => {
  
  return await UnitsAndDevicesAgent.getAllStations(`?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`,[{key: "InquireDepth", value:"shallow"}] )
    .then((response:Station[]) => response)
    .catch((error: any) => {
        console.error(error.response.data);
    });
});

export const getStationsInfoAllAsync: any = createAsyncThunk('getStationsInfoAll', async () => {
  return await UnitsAndDevicesAgent.getAllStationInfo(`?Page=1$Size=${MAX_REQUEST_SIZE_FOR.STATION}`)
    .then((response:Station[]) => response)
    .catch((error: any) => {
        console.error(error.response.data);
    });
});

export const getCountryRelatedStatesAsync: any = createAsyncThunk('getCountryStateAsync', async () => {
  return await CommonAgent.getCoutriesAlongWithStates()
    .then((response : any) => response)
    .catch((error: any) => {
        console.error(error.response.data);
    });
});

export const getRetentionStateAsync: any = createAsyncThunk('getRetentionStateAsync', async () => {
  return await SetupConfigurationAgent.getPoliciesAccordingToType('/Policies/DataRetention')
    .then((response : any) => response)
    .catch((error: any) => {
        console.error(error.response.data);
    });
});

export const getUploadStateAsync: any = createAsyncThunk('getUploadStateAsync', async () => {
  return await SetupConfigurationAgent.getPoliciesAccordingToType('/Policies/DataUpload')
  .then((response : any) => response)
  .catch((error: any) => {
      console.error(error.response.data);
  });
});

export const stationsSlice = createSlice({
  name: 'station',
  initialState: { stationInfo: [], countryStates: [], retentionState: [], uploadState: [], stations: [] },
  reducers: {},

  extraReducers: {
    [getStationsInfoAllAsync.fulfilled]: (state, { payload }) => {
      state.stationInfo = payload;
    },
    [getStationsAsync.fulfilled]: (state, { payload }) => {
      state.stations = payload;
    },

    [getCountryRelatedStatesAsync.fulfilled]: (state, { payload }) => {
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
