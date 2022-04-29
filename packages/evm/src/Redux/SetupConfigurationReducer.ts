import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SAVE_CONTAINER_MAPPINGS_URL } from "../utils/Api/url";


export const getAllCategories: any = createAsyncThunk(
    'getCategories',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };
        const resp = await fetch(SAVE_CONTAINER_MAPPINGS_URL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState: { categoryInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCategories.fulfilled, (state: any, { payload }) => {
            state.categoryInfo = payload;
        })
    }
});

export default categoriesSlice;