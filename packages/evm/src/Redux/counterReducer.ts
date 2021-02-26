import {createSlice, PayloadAction } from '@reduxjs/toolkit';

const counterSlice = createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {
      increment: (state,action: PayloadAction<{val:number}>) => state + action.payload.val,
      decrement: (state) => state - 1 ,
    },
  })

export default counterSlice
export const {increment:incrementActionCreator, decrement :decrementActionCreator }=counterSlice.actions



