import { createSlice, createAsyncThunk,PayloadAction } from '@reduxjs/toolkit'



interface NavigationState {
    value: any
  }

const initialState: NavigationState = {
    value: "Assets",
  }

const NavigationStateSlice = createSlice({
  name: "NavigationStateSlice",
  initialState,
  reducers: {
    navigationUpdate: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
      state.value = action.payload
    }
  },
});

export default NavigationStateSlice;
export const { navigationUpdate: navigationUpdate} = NavigationStateSlice.actions;