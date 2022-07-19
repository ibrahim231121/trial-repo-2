import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ConfigurationTemplates } from '../Application/Admin/Station/DefaultUnitTemplate/DefaultUnitTemplateModel';
import axios from 'axios';
import http from '../http-common';
import Cookies from 'universal-cookie';
import { UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { ConfigurationTemplate } from '../utils/Api/models/UnitModels';

export const getConfigurationTemplatesAsync: any = createAsyncThunk(
    'configurationTemplate/getConfigurationTemplatesAsync',
    async () => {
        const cookies = new Cookies();
        try {
            return await UnitsAndDevicesAgent.getAllTemplate().then((response:ConfigurationTemplate[]) => response);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(`${error.message} in configurationTemplatesReducerSlice Reducer`);
            }
        }
    }
);

export const configurationTemplatesReducerSlice = createSlice({
    name: 'Configuration Template',
    initialState: { configurationTemplates: {} },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getConfigurationTemplatesAsync.fulfilled, (state: any, { payload }) => {
            state.configurationTemplates = payload;
        });
    }
});

export default configurationTemplatesReducerSlice;
