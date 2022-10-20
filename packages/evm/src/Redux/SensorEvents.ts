import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import {SENSOR_AND_TRIGGERS_GET_ALL_EVENTS_DATA,SENSOR_AND_TRIGGERS_GET_ALL} from '../../../evm/src/utils/Api/url';

export const getAllSensorsFilterEvents: any = createAsyncThunk(
    'getAllFilterEvents',
    async (pageiFilter?: any) => {
        let headers = [{key : 'GridFilter', value : JSON.stringify(pageiFilter.gridFilter)}]
        return await SetupConfigurationAgent.getAllFiltersSensorsAndTriggersEvents(`?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
        .then((response:any) => response)
        .catch((error: any) => {
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

export const getAllEvents: any = createAsyncThunk(
    'getAllEvents',
    async () => {
         return SetupConfigurationAgent.getAll(SENSOR_AND_TRIGGERS_GET_ALL)
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
        }).addCase(getAllSensorsFilterEvents.fulfilled, (state: any, {payload}) => {
            state.filterSensorEvents = payload;
        }).addCase(getAllEvents.fulfilled, (state: any, {payload}) => {
            state.getAll = payload;
        })
    }
});
export default sensorEventsSlice;