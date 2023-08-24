import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SetupConfigurationAgent } from "../utils/Api/ApiAgent";


export const getTenantSettingsKeyValuesAsync = createAsyncThunk(
    'getTenantSettingsKeyValues',
    async () => {
        return await SetupConfigurationAgent.getTenantSetting('/TenantSettings/KeyValues')
    }
)

const tenantSettingsSlice = createSlice({
    name: 'TenantSettings/KeyValues',
    initialState: { keyValues: {} },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getTenantSettingsKeyValuesAsync.fulfilled, (state, { payload }) => {
            if(payload != null) {
                state.keyValues = payload;
            } 
        })
    }
})

export default tenantSettingsSlice;
