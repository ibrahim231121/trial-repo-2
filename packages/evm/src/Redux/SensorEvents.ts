import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import {SENSOR_AND_TRIGGERS_GET_ALL_EVENTS_DATA,SENSOR_AND_TRIGGERS_GET_ALL_DATA} from '../../../evm/src/utils/Api/url';
import { setLoaderValue } from './loaderSlice';

export const getAllSensorsEventsInfoAsync: any = createAsyncThunk(
    'getAllFilterEvents',
    async (pageiFilter: any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
        const url = `?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`
        let headers = [
            {   
                key : 'GridFilter', 
                value : JSON.stringify(pageiFilter.gridFilter)
            },
            {
                key: 'GridSort', 
                value : JSON.stringify(pageiFilter.gridSort)
            }]
        return await SetupConfigurationAgent.getAllFiltersSensorsAndTriggersEvents(url, headers)
        .then((response) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
            return response
        })
        .catch((error: any) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
            console.error(error.response.data);
        });
    }
);

export const getAllSensorsEvents: any = createAsyncThunk(
        'getEvents',
        async () => {
             return SetupConfigurationAgent.getAllSensorsAndTriggersEvents(SENSOR_AND_TRIGGERS_GET_ALL_EVENTS_DATA +`?Page=1&Size=100`)
             .then((response:any) => response)
             .catch((error: any) => {
                 console.error(error.response.data);
        });
    }
);

export const getAllData: any = createAsyncThunk(
    'getAllData',
    async () => {
         return SetupConfigurationAgent.getAll(SENSOR_AND_TRIGGERS_GET_ALL_DATA)
         .then((response:any) => response)
         .catch((error: any) => {
             console.error(error.response.data);
    });
}
);

export const sensorEventsSlice = createSlice({ 
    name: 'sensorEventsForm',
    initialState: { sensorEvents: [], filterSensorEvents: [], getAll: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllSensorsEvents.fulfilled, (state: any, { payload }) => {
            state.sensorEvents = payload;
        }).addCase(getAllSensorsEventsInfoAsync.fulfilled, (state: any, {payload}) => {
            state.filterSensorEvents = payload;
        }).addCase(getAllData.fulfilled, (state: any, {payload}) => {
            state.getAll = payload;
        })
    }
});
export default sensorEventsSlice;