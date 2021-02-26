import {createSlice } from '@reduxjs/toolkit';

 const counterSliceTwo = createSlice({
    name: 'counterTwo',
    initialState: 5,
    reducers: {
      inc: (state) => state + 1,
      dec: (state) => state - 1 ,
    },
  })


  export default counterSliceTwo
  export const {inc,dec }= counterSliceTwo.actions
