import { createSlice, createAsyncThunk,PayloadAction } from '@reduxjs/toolkit'



interface LanguageState {
    value: string
  }

const initialState: LanguageState = {
    value: "en" ,
  }

const cultureSlice = createSlice({
  name: "cultureSlice",
  initialState,
  reducers: {
    add: (state: any, action: PayloadAction<any>) => {
      state.value = action.payload
    
    }
  },
});

export default cultureSlice;
export const { add: cultureActionCreator} = cultureSlice.actions;