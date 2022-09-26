import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { GROUP_GET_BY_ID_URL, GROUP_USER_COUNT_GET_URL } from '../utils/Api/url'
import { GroupUserCount } from '../utils/Api/models/UsersAndIdentitiesModel';
import { UsersAndIdentitiesServiceAgent } from '../utils/Api/ApiAgent';
const cookies = new Cookies();

export const getGroupAsync: any = createAsyncThunk(
    'getGroups',
    async (pageiFilter?: any) => {
        let headers = [{key : 'GridFilter', value : JSON.stringify(pageiFilter.gridFilter)}]
        return await UsersAndIdentitiesServiceAgent.getGroups(`/filterUserGroup?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
            .then((response: any) => response)
        
        // const url = GROUP_GET_BY_ID_URL + `/filterUserGroup?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`
        // const requestOptions = {
        //     method: 'GET',
        //     headers: { 'Content-Type': 'application/json', 'TenantId': '1',  'Authorization': `Bearer ${cookies.get('access_token')}`,
        //                'GridFilter': JSON.stringify(pageiFilter.gridFilter)
        //              },
        // };
        // const resp = await fetch(url, requestOptions);
        // if (resp.ok) {
        //     const response = await resp.json();
        //     console.log("response Screen 2: ",response)
        //     //let groups = {data: response, count: count}
        //     return response;
        // }
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