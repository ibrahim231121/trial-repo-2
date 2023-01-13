import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const groupedSelectedAssetsActions = createSlice({
  name: "groupedSelectedAssetsActions",
  initialState: { groupedSelectedAssetsActions: []},
  reducers: {

    add: (state: any, action: PayloadAction<any>) => {
      const { payload } = action;
      if(state.groupedSelectedAssetsActions.length>0)
      {
        
            payload.map((y:any)=>{
            var a=  state.groupedSelectedAssetsActions.find((x:any)=>x.assetId==y.assetId);
            if(a!=null && a!=undefined){
              a.isChecked=y.isChecked
            }
            else{
              state.groupedSelectedAssetsActions.push(y);
            }
          })
        
      }
      else{
        state.groupedSelectedAssetsActions.push(...payload);
      }
      
    },
    clearAdd: (state: any, action: PayloadAction<any>) => {
      state.groupedSelectedAssetsActions = [];
      const { payload } = action;
      if(state.groupedSelectedAssetsActions.length>0)
      {
        
            payload.map((y:any)=>{
            var a=  state.groupedSelectedAssetsActions.find((x:any)=>x.assetId==y.assetId);
            if(a!=null && a!=undefined){
              a.isChecked=y.isChecked
            }
            else{
              state.groupedSelectedAssetsActions.push(y);
            }
          })
        
      }
      else{
        state.groupedSelectedAssetsActions.push(...payload);
      }
     
    },

    clearAll: (state:any) => {
        state.groupedSelectedAssetsActions = [];
    },

  },
});

export default groupedSelectedAssetsActions;

export const {
  add: addGroupedSelectedAssetsActions,
  clearAdd:clearAddGroupedSelectedAssetsActions,
  clearAll: clearAllGroupedSelectedAssetsActions,
} = groupedSelectedAssetsActions.actions;
