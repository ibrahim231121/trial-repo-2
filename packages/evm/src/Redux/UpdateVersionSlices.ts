import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setLoaderValue } from './loaderSlice';
import { UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { UpdateVersion } from '../utils/Api/models/UnitModels';


export const getAllUpdateVersionsPagedAsync: any = createAsyncThunk(
  'getAllUpdateVersionsPaged',
  async (pageiFilter: any, thunkAPI) => {
    thunkAPI.dispatch(setLoaderValue({isLoading: true}))
    let headers = [
      {   
          key : 'GridFilter', 
          value : JSON.stringify(pageiFilter.gridFilter)
      },
      {
          key: 'GridSort', 
          value : JSON.stringify(pageiFilter.gridSort)
      }
    ];
    return await UnitsAndDevicesAgent.getFilteredUpdateVersions(`UpdateVersion?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
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

export const getAllUpdateVersionsAsync: any = createAsyncThunk(
  'getAllUpdateVersionsAsync',
  async (pageiFilter: any, thunkAPI) => {
    thunkAPI.dispatch(setLoaderValue({isLoading: true}))
    return await UnitsAndDevicesAgent.getUpdateVersions(`UpdateVersion`)
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


export const UpdateVersionsSlice = createSlice({
  name: 'updateVersions',
  initialState: { updateVersionsPaged: [], updateVersions: []},
  reducers: {
    addUpdateVersion: (state: any, action: PayloadAction<UpdateVersion>) => {
      const {payload} = action;
      state.updateVersionsPaged.data = [...state.updateVersionsPaged.data, payload];
      state.updateVersions = [...state.updateVersions, payload];
    },
    deleteAllUpdateVersion: (state: any, action: PayloadAction<number[]>) => {
      const {payload} = action;
      state.updateVersionsPaged.data = state.updateVersionsPaged.data.filter((x: UpdateVersion) => !payload.includes(x.id ?? 0));
      state.updateVersions = state.updateVersions.filter((x: UpdateVersion) => !payload.includes(x.id ?? 0));
    },
    updateUpdateVersion: (state: any, action: PayloadAction<UpdateVersion>) => {
      const {payload} = action;
      let tempUpdateVersionsPaged = [...state.updateVersionsPaged];
      let tempUpdateVersions = [...state.updateVersions];
      let updatePagedObj = tempUpdateVersionsPaged.find((x: UpdateVersion) => x.id == payload.id);
      let updateObj = tempUpdateVersions.find((x: UpdateVersion) => x.id == payload.id);
      updatePagedObj = payload;
      updateObj = payload;
      state.updateVersionsPaged = [...tempUpdateVersionsPaged];
      state.updateVersions = [...tempUpdateVersions];
    }
  },

  extraReducers: {
    [getAllUpdateVersionsPagedAsync.fulfilled]: (state, { payload }) => {
      state.updateVersionsPaged = payload;
    },
    [getAllUpdateVersionsAsync.fulfilled]: (state, { payload }) => {
      state.updateVersions = payload;
    }
  }
});

export default UpdateVersionsSlice;
export const { addUpdateVersion, updateUpdateVersion, deleteAllUpdateVersion} = UpdateVersionsSlice.actions;