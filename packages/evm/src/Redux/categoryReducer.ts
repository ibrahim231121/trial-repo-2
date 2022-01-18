import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SETUP_CONFIGURATION_SERVICE_URL } from '../utils/Api/url';

export const getCategoryAsync: any = createAsyncThunk(
    'category/getCategoriesAsync',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };
        const URL = `${SETUP_CONFIGURATION_SERVICE_URL}/Categories?Page=1&Size=100`;
       
        const resp = await fetch(URL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);

export const categorySlice = createSlice({
    name: 'category',
    initialState: { category: {} },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCategoryAsync.fulfilled, (state: any, { payload }) => {
            state.category = payload;
        })
    }
});

export default categorySlice;