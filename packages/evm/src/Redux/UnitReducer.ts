import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { UnitsAndDevicesAgent , EvidenceAgent} from '../utils/Api/ApiAgent';
import { QueuedAssets, UnitInfo } from '../utils/Api/models/UnitModels';
import { Paginated, Headers } from '../utils/Api/models/CommonModels';
import { BASE_URL_UNIT_SERVICES} from '../utils/Api/url'
import { setLoaderValue } from './loaderSlice'; 

export const getUnitInfoAsync: any = createAsyncThunk(
    'getUnitInfo',
    async (pageiFilter: any, thunkAPI) => {
        let headers = [{key : 'GridFilter', value : JSON.stringify(pageiFilter.gridFilter)}]
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
        return await UnitsAndDevicesAgent.getUnitInfo(`/Stations/0/Units/filterUnit?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
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


export const getQueuedAssetInfoAsync: any = createAsyncThunk(
    'getQueuedAssetInfo',
    async (args: any) => {
        return await EvidenceAgent.getQueuedAssets(args.unitId).then((response:QueuedAssets[]) => response);

    }
);

export const getAllUnitVersionKeyValuesAsync: any = createAsyncThunk(
    'getAllUnitVersionKeyValues',
    async () => {
            return await UnitsAndDevicesAgent
            .getAllUnitVersionKeyValues(`/Stations/0/Units/GetAllUnitVersionKeyValues`)
            .then((response) => {       
                return response
        })

});

export const getAllUnitTemplateKeyValuesAsync: any = createAsyncThunk(
    'getAllUnitTemplateKeyValues',
    async () => {
            return await UnitsAndDevicesAgent
            .getAllUnitTemplateKeyValues(`/Stations/0/Units/GetAllUnitTemplateKeyValues`)
            .then((response) => {        
                return response
        })

});

export const getAllUnitAssignmentKeyValuesAsync: any = createAsyncThunk(
    'getAllUnitAssignmentKeyValues',
    async () => {
            return await UnitsAndDevicesAgent
            .getAllUnitAssignmentKeyValues(`/Stations/0/Units/GetAllUnitAssignmentKeyValues`)
            .then((response) => {        
                return response
        })

});

export const getAllUnitStatusKeyValuesAsync: any = createAsyncThunk(
    'getAllUnitStatusKeyValues',
    async () => {
            return await UnitsAndDevicesAgent
            .getAllUnitStatusKeyValues(`/Stations/0/Units/GetAllUnitStatusKeyValues`)
            .then((response) => {       
                return response
        })

});


export const unitSlice = createSlice({
    name: 'unit',
    initialState: { unitInfo: [], queuedAssets: [], unitVersionKeyValues: [], UnitStatusKeyValues: [], UnitTemplateKeyValues: [], UnitAssignmentKeyValues: []},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUnitInfoAsync.fulfilled, (state: any, { payload }) => {
            state.unitInfo = payload;
        }).addCase(getQueuedAssetInfoAsync.fulfilled, (state: any, { payload })=>{
            state.queuedAssets = payload;
        }).addCase(getAllUnitVersionKeyValuesAsync.fulfilled, (state: any, { payload })=>{
            state.unitVersionKeyValues = payload;
        }).addCase(getAllUnitStatusKeyValuesAsync.fulfilled, (state: any, { payload })=>{
            state.UnitStatusKeyValues = payload;
        }).addCase(getAllUnitTemplateKeyValuesAsync.fulfilled, (state: any, { payload })=>{
            state.UnitTemplateKeyValues = payload;
        }).addCase(getAllUnitAssignmentKeyValuesAsync.fulfilled, (state: any, { payload })=>{
            state.UnitAssignmentKeyValues = payload;
        })
    }
});

export default unitSlice;