import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { GROUP_GET_URL, GROUP_USER_COUNT_GET_URL } from '../utils/Api/url'
import { GroupUserCount } from '../utils/Api/models/UsersAndIdentitiesModel';
import { UsersAndIdentitiesServiceAgent } from '../utils/Api/ApiAgent';
const cookies = new Cookies();

export const getGroupAsync: any = createAsyncThunk(
    'getGroups',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1',  'Authorization': `Bearer ${cookies.get('access_token')}`},
        };
        const resp = await fetch(GROUP_GET_URL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);
export const getGroupUserCountAsync: any = createAsyncThunk(
    'getGroupUserCounts',
    async () => {
    //     const requestOptions = {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json', 'TenantId': '1' , 'Authorization': `Bearer ${cookies.get('access_token')}`},
    //     };
    //     const resp = await fetch(GROUP_USER_COUNT_GET_URL, requestOptions);
    //     if (resp.ok) {
    //         const response = await resp.json();
    //         return response;
    //     }
    return await UsersAndIdentitiesServiceAgent.getUserGroupCount().then((response:GroupUserCount[]) => response)

    } 
);

export const groupSlice = createSlice({
    name: 'group',
    initialState: { groups: [], groupUserCounts: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getGroupAsync.fulfilled, (state: any, { payload }) => {
            state.groups = payload;
        }).addCase(getGroupUserCountAsync.fulfilled, (state: any, { payload }) => {
            state.groupUserCounts = payload;
        })
    }
});

export default groupSlice;