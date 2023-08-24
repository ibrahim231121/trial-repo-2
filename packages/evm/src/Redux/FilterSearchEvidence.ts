import { createSlice, createAsyncThunk,PayloadAction, current } from '@reduxjs/toolkit'

interface RelatedSearchAsset {
    RelatedEvidenceObject: []
}

const initialState: RelatedSearchAsset = {
    RelatedEvidenceObject: []
} 


const FilteredSearchEvidenceSlice = createSlice({
  name: "FilteredSearchEvidenceSlice",
  initialState,
  reducers: {
    addEvidenceObject: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
       const evidenceObject = state.RelatedEvidenceObject &&  state.RelatedEvidenceObject.find((x: any) => Object.keys(x)[0] == Object.keys(action.payload)[0])
       
    if(!evidenceObject)
      state.RelatedEvidenceObject = [...state.RelatedEvidenceObject,action.payload]
    
    },
    getEvidenceSearchObject: (state: any) => {
        return {
          ...state,
        }
      },
    clearEvidenceSearchObject : () => {
      return initialState
    }

  },
});







export default FilteredSearchEvidenceSlice;
export const { addEvidenceObject: addEvidenceObject,getEvidenceSearchObject,clearEvidenceSearchObject} = FilteredSearchEvidenceSlice.actions;
