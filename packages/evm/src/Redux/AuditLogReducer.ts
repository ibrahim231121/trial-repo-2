import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { AuditLogAgent } from '../utils/Api/ApiAgent';
import { AuditLog } from '../utils/Api/models/AuditLogModels';

const cookies = new Cookies();
export const getUnitAuditLogsAsync: any = createAsyncThunk(
    'getUnitAuditLogs',
    async (args: any) => {
        let url = '/AuditLogs?Service=3&Result=1&UnitId='+args.unitId
        return await AuditLogAgent.getUnitAuditLogs(url).then((response:AuditLog[]) => response);
    }
);


export const auditLogSlice = createSlice({
    name: 'auditlog',
    initialState: { unitAuditLogs: []},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUnitAuditLogsAsync.fulfilled, (state: any, { payload }) => {
            state.unitAuditLogs = payload;
        })
    }
});

export default auditLogSlice;