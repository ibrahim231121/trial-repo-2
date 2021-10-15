import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { USER_INFO_GET_URL } from '../utils/Api/url'

export const getUsersInfoAsync: any = createAsyncThunk(
    'getUsersInfo',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };
        const resp = await fetch(USER_INFO_GET_URL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState: { usersInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUsersInfoAsync.fulfilled, (state: any, { payload }) => {
            state.usersInfo = payload;
        })
    }
});

export default userSlice;