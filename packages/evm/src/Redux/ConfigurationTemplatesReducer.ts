import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TEMPLATE_CONFIGURATION_DETAIL_GET_URL } from '../utils/Api/url';
import { ConfigurationTemplates } from '../Application/Admin/Station/DefaultUnitTemplate/DefaultUnitTemplateModel';
import axios from 'axios';
import http from '../http-common';
import Cookies from 'universal-cookie';

export const getConfigurationTemplatesAsync: any = createAsyncThunk(
    'configurationTemplate/getConfigurationTemplatesAsync',
    async () => {
        const cookies = new Cookies();
        try {
            const options = {
                headers: {
                    'Authorization': `Bearer ${cookies.get('access_token')}`
                }
            };
            const resp = await http.get<ConfigurationTemplates[]>(TEMPLATE_CONFIGURATION_DETAIL_GET_URL, options);
            if (resp.status == 200) {
                return await resp.data;
            }
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
