import { createSlice, createAsyncThunk,PayloadAction } from '@reduxjs/toolkit'



interface CounterState {
    value: number
  }

const initialState: CounterState = {
    value: 3480 ,
  }

const timerSlice = createSlice({
  name: "timerSlice",
  initialState,
  reducers: {
    add: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
      state.value = action.payload
    
    }
  },
});

export default timerSlice;
export const { add: timerActionCreator} = timerSlice.actions;