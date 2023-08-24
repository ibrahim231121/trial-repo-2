import { createSlice, createAsyncThunk,PayloadAction, current } from '@reduxjs/toolkit'



interface RelatedAsset {
    RelatedAsset: [],
    

  }

const initialState: RelatedAsset = {
    RelatedAsset: [] ,

  } 


const FilteredRelatedAssetSlice = createSlice({
  name: "FilteredRelatedAssetSlice",
  initialState,
  reducers: {
    add: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
      state.RelatedAsset = [...state.RelatedAsset,action.payload]
      console.log("state",current(state))
    
    },
    getRelatedAsset: (state: any) => {
        return {
          ...state,
        }
      },
    resetRelatedAsset : () => {
      return initialState
    }

  },
});

export default FilteredRelatedAssetSlice;
export const { add: RelatedAssetsCreator, getRelatedAsset, resetRelatedAsset} = FilteredRelatedAssetSlice.actions;