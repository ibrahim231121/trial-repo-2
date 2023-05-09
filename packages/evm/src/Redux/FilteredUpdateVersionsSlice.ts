import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setLoaderValue } from './loaderSlice';
import { UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { UpdateVersion } from '../utils/Api/models/UnitModels';


export const getAllFilteredUpdateVersionsPagedAsync: any = createAsyncThunk(
  'getAllFilteredUpdateVersionsPaged',
  async (obj: any, thunkAPI) => {
    thunkAPI.dispatch(setLoaderValue({isLoading: true}))
    let headers = [{key : 'GridFilter', value : JSON.stringify(obj.pageiFilter.gridFilter)}]
    return await UnitsAndDevicesAgent.getFilteredDeviceByStation(`/Stations/${obj.primaryDeviceFilter.stationId}/Devices/Types/${obj.primaryDeviceFilter.deviceTypeId}?Page=${obj.pageiFilter.page+1}&Size=${obj.pageiFilter.size}`, headers)
      .then((response:any) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
        return response;
      })
      .catch((error: any) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
        console.error(error.response.data);
      });
  }
);


export const FilteredUpdateVersionsSlice = createSlice({
  name: 'filteredUpdateVersions',
  initialState: { filteredUpdateVersionsPaged: []},
  reducers: {},
  extraReducers: {
    [getAllFilteredUpdateVersionsPagedAsync.fulfilled]: (state, { payload }) => {
      state.filteredUpdateVersionsPaged = payload;
    }
  }
});

export default FilteredUpdateVersionsSlice;
