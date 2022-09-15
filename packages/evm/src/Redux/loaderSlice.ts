import { createSlice, createAsyncThunk,PayloadAction } from '@reduxjs/toolkit'
import { setTextRange } from 'typescript';



interface Loader {
    loadingValue: number
    message: string | undefined
    error: boolean | undefined
}

const initialState: Loader = {
  loadingValue: 0,
  message: undefined,
  error: false
}

const loaderSlice = createSlice({
  name: "loaderSlice",
  initialState,
  reducers: {
    setLoaderValue: (state: any, action: PayloadAction<any>) => {
      const {payload} = action;
      if(payload.isLoading){
        state.loadingValue = state.loadingValue + 1;
      }
      else{
        state.loadingValue = state.loadingValue - 1;
        state.message = payload.message;
        state.error = payload.error;
      }
    },
    getLoaderValue: (state: any) => {
      return state;
    }
  }
});

export default loaderSlice;
export const { setLoaderValue: setLoaderValue, getLoaderValue: getLoaderValue} = loaderSlice.actions;