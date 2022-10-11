import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import {SENSOR_AND_TRIGGERS_GET_ALL_EVENTS_DATA} from '../../src/utils/Api/url';
// export const getAllSensorsEvents: any = createAsyncThunk(
//     'getEvents',
//     async (pageiFilter?: any) => {
//         let headers = [{key : 'GridFilter', value : JSON.stringify(pageiFilter.gridFilter)}]
//         return await SetupConfigurationAgent.getAllSensorsAndTriggersEvents(`/GetAllEvents?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
//             .then((response: any) => response)
//     }
// );

// export const getAllSensorsEvents: any = createAsyncThunk(
//     'getEvents',
//     async () => {
//         return SetupConfigurationAgent.getAllSensorsAndTriggersEvents(SENSOR_AND_TRIGGERS_GET_ALL_EVENTS_DATA +`?Page=1&Size=100`)
//         .then((response:any[]) => response)
//         .catch((error: any) => {
//             console.error(error.response.data);
//         });
//     }
// );


export const getAllSensorsEvents: any = createAsyncThunk(
    'getEvents',
    async (pageiFilter?: any) => {
        let headers = [{key : 'GridFilter', value : JSON.stringify(pageiFilter.gridFilter)}]
        return await SetupConfigurationAgent.getAllSensorsAndTriggersEvents(`?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
        .then((response:any) => response)
        .catch((error: any) => {
            console.error(error.response.data);
        });
    }
);

export const sensorEventsSlice = createSlice({ 
    name: 'sensorEventsForm',
    initialState: { sensorEvents: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllSensorsEvents.fulfilled, (state: any, { payload }) => {
            state.sensorEvents = payload;
        })
    }
});
export default sensorEventsSlice;