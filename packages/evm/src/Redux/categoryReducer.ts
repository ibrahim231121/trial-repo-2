import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Category } from '../Application/Admin/UserGroup/Group/GroupTabs/TypeConstant/types';
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import { SETUP_CONFIGURATION_SERVICE_URL } from '../utils/Api/url';

export const getCategoryAsync: any = createAsyncThunk(
    'category/getCategoriesAsync',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };
        const URL = `${SETUP_CONFIGURATION_SERVICE_URL}/Categories?Page=1&Size=100`;
        return await SetupConfigurationAgent.getCategories(URL).then((response:Category[]) => response);
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