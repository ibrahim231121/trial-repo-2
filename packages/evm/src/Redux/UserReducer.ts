import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { USER_INFO_GET_URL, USER_INFO_UPDATE_URL } from '../utils/Api/url'

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
export const updateUsersInfoAsync: any = createAsyncThunk(
    'updateUsersInfo',
    async (args: any) => {
        var body = [
            {
                "op": "replace",
                "path": args.columnToUpdate,
                "value": args.valueToUpdate
            }
        ]
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', 'TenantId': '1'
            },
            body: JSON.stringify(body)
        };
        const resp = await fetch(USER_INFO_UPDATE_URL + `?userId=` + args.userId, requestOptions);
        if (resp.ok) {
            args.dispatch(getUsersInfoAsync());
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