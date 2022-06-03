import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { DEVICETYPE_GET_URL, TEMPLATE_CONFIGURATION_GET_URL, TEMPLATE_CONFIGURATION_LOG_GET_URL } from '../utils/Api/url'
import { TEMPLATE_CONFIGURATION_DELETE_URL } from '../utils/Api/url'
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export const getConfigurationInfoAsync: any = createAsyncThunk(
    'GetAllConfiguration',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1',  'Authorization': `Bearer ${cookies.get('access_token')}` },
        };

        const resp = await fetch(TEMPLATE_CONFIGURATION_GET_URL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);

export const getTemplateConfigurationLogsAsync: any = createAsyncThunk(
    'GetTemplateConfigurationLogs',
    async (args: any) => {
        console.log(args)
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };

        const resp = await fetch(TEMPLATE_CONFIGURATION_LOG_GET_URL+ args , requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);



export const getDeviceTypeInfoAsync: any = createAsyncThunk(
    'GetAllDeviceConfiguration',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };

        const resp = await fetch(DEVICETYPE_GET_URL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);


export const deletetemplate: any = createAsyncThunk(
    'Delete',
    async (args: any) => {
        const requestOptions = {
            method: 'Delete',
            headers: {
                'Content-Type': 'application/json', 'TenantId': '1',  'Authorization': `Bearer ${cookies.get('access_token')}`
            },
        };
        const resp = await fetch(TEMPLATE_CONFIGURATION_DELETE_URL + args.id, requestOptions);
        if (resp.ok) {
            window.location.reload();
            //return true;
            // args.dispatch(getUsersInfoAsync());
        }
    }
);

export const templateSlice = createSlice({
    name: 'template',
    initialState: { templateInfo: [], deviceType: [], configTemplateLogs: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getConfigurationInfoAsync.fulfilled, (state: any, { payload }) => {
            state.templateInfo = payload;
        })
            .addCase(getDeviceTypeInfoAsync.fulfilled, (state: any, { payload }) => {
                state.deviceType = payload;
            }). addCase(getTemplateConfigurationLogsAsync.fulfilled, (state: any, { payload }) => {
                state.configTemplateLogs = payload;
            })
    }
});

export default templateSlice;