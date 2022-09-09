import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Category } from '../Application/Admin/UserGroup/Group/GroupTabs/TypeConstant/types';
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import { CATEGORY_INFO_GET_URL } from '../utils/Api/url';

export const getCategoryAsync: any = createAsyncThunk(
    'category/getCategoriesAsync',
    async () => {
        return await SetupConfigurationAgent.getCategories(CATEGORY_INFO_GET_URL).then((response:Category[]) => response);
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