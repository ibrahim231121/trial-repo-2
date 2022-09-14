import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { ConfigurationTemplateLogs, DeviceConfigurationTemplate, DeviceType } from '../utils/Api/models/UnitModels';

const cookies = new Cookies();
export const getConfigurationInfoAsync: any = createAsyncThunk(
    'GetAllConfiguration',
    async (pageiFilter?: any) => {
        return await UnitsAndDevicesAgent.getAllDeviceConfigurationTemplate(`/ConfigurationTemplates/AllConfiguration?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`).then((response:DeviceConfigurationTemplate[]) => response);
    }
);

export const getTemplateConfigurationLogsAsync: any = createAsyncThunk(
    'GetTemplateConfigurationLogs',
    async (args: any) => {
        console.log(args)
        return await UnitsAndDevicesAgent.getTemplateConfigurationLogs(args).then((response:ConfigurationTemplateLogs[]) => response);
    }
);



export const getDeviceTypeInfoAsync: any = createAsyncThunk(
    'GetAllDeviceConfiguration',
    async () => {
        return await UnitsAndDevicesAgent.getAllDeviceTypes().then((response:DeviceType[]) => response);
    }
);


export const deletetemplate: any = createAsyncThunk(
    'Delete',
    async (args: any) => {
        UnitsAndDevicesAgent.deleteConfigurationTemplate(args.id)
        .then(() => {
            window.location.reload();
        })
        .catch(function (error) {
            return error;
        });
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