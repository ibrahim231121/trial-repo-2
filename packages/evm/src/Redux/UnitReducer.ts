import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { UNIT_INFO_GET_URL } from '../utils/Api/url'

export const getUnitInfoAsync: any = createAsyncThunk(
    'getUnitInfo',
    async () => {
        const cookies = new Cookies();
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1',  'Authorization': `Bearer ${cookies.get('access_token')}` },
        };
        console.log('requestOptions', requestOptions.headers.Authorization);
        const resp = await fetch(UNIT_INFO_GET_URL, requestOptions);
        if (resp.ok) {
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