import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { TEMPLATE_CONFIGURATION_GET_URL } from '../utils/Api/url'


export const getConfigurationInfoAsync: any = createAsyncThunk(
    'GetAllConfiguration',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '13' },
        };
        const resp = await fetch(TEMPLATE_CONFIGURATION_GET_URL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);

export const templateSlice = createSlice({
    name: 'template',
    initialState: { templateInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getConfigurationInfoAsync.fulfilled, (state: any, { payload }) => {
            state.templateInfo = payload;
        })
    }
});

export default templateSlice;