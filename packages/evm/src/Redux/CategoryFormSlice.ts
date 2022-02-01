import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const CategoryFormSlice = createSlice({
    name: 'editCategory',
    initialState: [],
    reducers: {
        addToState: (state: any, action: PayloadAction<any>) => action.payload
    }
});

export const { addToState: AddToEditFormStateCreator } = CategoryFormSlice.actions;
export default CategoryFormSlice;