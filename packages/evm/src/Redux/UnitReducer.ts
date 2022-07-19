import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { UnitInfo } from '../utils/Api/models/UnitModels';

export const getUnitInfoAsync: any = createAsyncThunk(
    'getUnitInfo',
    async () => {
        return await UnitsAndDevicesAgent.getUnitInfo().then((response:UnitInfo[]) => response);
    }
);

export const unitSlice = createSlice({
    name: 'unit',
    initialState: { unitInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUnitInfoAsync.fulfilled, (state: any, { payload }) => {
            state.unitInfo = payload;
        })
    }
});

export default unitSlice;