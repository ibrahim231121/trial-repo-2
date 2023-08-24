import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { AuditLogAgent } from '../utils/Api/ApiAgent';
import { AuditLog } from '../utils/Api/models/AuditLogModels';
import { setLoaderValue } from './loaderSlice'; 
const cookies = new Cookies();

export const getUnitAuditLogsAsync: any = createAsyncThunk(
    'getUnitAuditLogs',
    async (args: any, thunkAPI) => {
        let headers = [
                {   
                    key : 'GridFilter', 
                    value : JSON.stringify(args.pageiGrid.gridFilter)
                },
                {
                    key: 'GridSort', 
                    value : JSON.stringify(args.pageiGrid.gridSort)
                }]
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
         let url = `/AuditLogs?Service=3&Result=1&UnitId=${args.unitId}&AuditType=${args.auditType}&Page=${args.pageiGrid.page + 1}&Size=${args.pageiGrid.size}`
          return await AuditLogAgent.getUnitAuditLogs(url, headers).then((response: any) => response)
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



export const getUnitDiagnosticLogsAsync: any = createAsyncThunk(
    'getUnitDiagnosticLogs',
    async (args: any, thunkAPI) => {
        let headers = [
                {   
                    key : 'GridFilter', 
                    value : JSON.stringify(args.pageiGrid.gridFilter)
                },
                {
                    key: 'GridSort', 
                    value : JSON.stringify(args.pageiGrid.gridSort)
                }]
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
         let url = `/AuditLogs?Service=3&Result=1&UnitId=${args.unitId}&AuditType=Diagnostic&Page=${args.pageiGrid.page + 1}&Size=${args.pageiGrid.size}`
          return await AuditLogAgent.getUnitAuditLogs(url, headers).then((response: any) => response)
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

export const auditLogSlice = createSlice({
    name: 'auditlog',
    initialState: { unitAuditLogs: [], unitAuditLogsCount: 0, unitDiagnosticLogs: [], unitDiagnosticLogsCount: 0 },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUnitAuditLogsAsync.fulfilled, (state: any, { payload, headers }) => {
            state.unitAuditLogs = payload.data;
            state.unitAuditLogsCount = payload.totalCount;

        }).addCase(getUnitDiagnosticLogsAsync.fulfilled, (state: any, { payload, headers }) => {
            state.unitDiagnosticLogs = payload.data;
            state.unitDiagnosticLogsCount = payload.totalCount;

        })
    }
});

export default auditLogSlice;