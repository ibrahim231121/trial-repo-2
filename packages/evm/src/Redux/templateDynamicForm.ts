import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { DeviceType } from '../utils/Api/models/UnitModels';

export const getDeviceTypesAsync: any = createAsyncThunk(
    'getDeviceTypesAsync',
    async () => {
        return UnitsAndDevicesAgent.getAllDeviceTypes()
        .then((response:DeviceType[]) => response)
        .catch((error: any) => {
            console.error(error.response.data);
        });
    }
);

export const unitTemplateSlice = createSlice({
    name: 'unitTemplateForm',
    initialState: { deviceTypes: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDeviceTypesAsync.fulfilled, (state: any, { payload }) => {
            state.deviceTypes = payload;
        })
    }
});



export default unitTemplateSlice;