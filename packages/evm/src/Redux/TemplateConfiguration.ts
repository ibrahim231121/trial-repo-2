import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { ConfigurationTemplateLogs, DeviceConfigurationTemplate, DeviceType } from '../utils/Api/models/UnitModels';
import { BASE_URL_UNIT_SERVICES} from '../utils/Api/url'
import { setLoaderValue } from './loaderSlice';

const cookies = new Cookies();
export const getConfigurationInfoAsync: any = createAsyncThunk(
    'GetAllConfiguration',
    async (pageiFilter: any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
        let headers = [{key : 'GridFilter', value : JSON.stringify(pageiFilter.gridFilter)}]
        return await UnitsAndDevicesAgent.getAllDeviceConfigurationTemplate(`/ConfigurationTemplates/filterUnitDeviceTemplate?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
            .then((response:any) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
                return response
            })
            .catch((error: any) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
                console.error(error.response.data);
              });
    }
);

export const getTemplateConfigurationLogsAsync: any = createAsyncThunk(
    'GetTemplateConfigurationLogs',
    async (args: any) => {
        console.log(args)
        return await UnitsAndDevicesAgent.getTemplateConfigurationLogs(args).then((response:ConfigurationTemplateLogs[]) => response);
    }
);

export const getAllConfigurationValuesAsync: any = createAsyncThunk(
    'GetAllConfigurationValues',
    async () => {
        const url = BASE_URL_UNIT_SERVICES + `/GetAllConfigurationTemplatesMappingValues`
        return await UnitsAndDevicesAgent.getAllConfigurationValues(`/ConfigurationTemplates/GetAllConfigurationTemplatesMappingValues`)
            .then((response:any) => response);
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
    initialState: { templateInfo: [], deviceType: [], configTemplateLogs: [], configTemplateValues: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getConfigurationInfoAsync.fulfilled, (state: any, { payload }) => {
            state.templateInfo = payload;
        }).addCase(getDeviceTypeInfoAsync.fulfilled, (state: any, { payload }) => {
            state.deviceType = payload;
        }).addCase(getTemplateConfigurationLogsAsync.fulfilled, (state: any, { payload }) => {
            state.configTemplateLogs = payload;
        }).addCase(getAllConfigurationValuesAsync.fulfilled, (state: any, { payload }) => {
            state.configTemplateValues = payload;
        })
    }
});

export default templateSlice;