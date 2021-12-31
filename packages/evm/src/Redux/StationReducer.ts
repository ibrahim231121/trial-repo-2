import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { STATION_INFO_GET_URL} from '../utils/Api/url'

export const getStationsInfoAsync: any = createAsyncThunk(
    'getStationsInfo',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };
        const resp = await fetch(STATION_INFO_GET_URL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);

export const stationsSlice = createSlice({
    name: 'station',
    initialState: { stationInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStationsInfoAsync.fulfilled, (state: any, { payload }) => {
            state.stationInfo = payload;
        })
    }
});

export default stationsSlice;