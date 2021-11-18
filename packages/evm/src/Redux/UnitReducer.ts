import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UNIT_INFO_GET_URL } from '../utils/Api/url'

export const getUnitInfoAsync: any = createAsyncThunk(
    'getUnitInfo',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '13' },
        };
        const resp = await fetch(UNIT_INFO_GET_URL, requestOptions);
        if (resp.ok) {
            debugger;
            const response = await resp.json();
            return response;
        }
    }
);

export const unitSlice = createSlice({
    name: 'unit',
    initialState: { unitInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUnitInfoAsync.fulfilled, (state: any, { payload }) => {
            state.unitInfo = payload;
        })
    }
});

export default unitSlice;