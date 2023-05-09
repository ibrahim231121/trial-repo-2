import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const groupedSelectedAssets = createSlice({
  name: "groupedSelectedAssets",
  initialState: { groupedSelectedAssets: []},
  reducers: {

    add: (state: any, action: PayloadAction<any>) => {
      const { payload } = action;
      if(state.groupedSelectedAssets.length>0)
      {
            payload.map((y:any)=>{
            var a=  state.groupedSelectedAssets.find((x:any)=>x.assetId==y.assetId);
            if(a!=null && a!=undefined){
              a.isChecked=y.isChecked
            }
            else{
              state.groupedSelectedAssets.push(y);
            }
          })
        
      }
      else{
        state.groupedSelectedAssets.push(...payload);
      }
    },
    clearAdd: (state: any, action: PayloadAction<any>) => {
      state.groupedSelectedAssets = [];
      const { payload } = action;
      if(state.groupedSelectedAssets.length>0)
      {
            payload.map((y:any)=>{
            var a=  state.groupedSelectedAssets.find((x:any)=>x.assetId==y.assetId);
            if(a!=null && a!=undefined){
              a.isChecked=y.isChecked
            }
            else{
              state.groupedSelectedAssets.push(y);
            }
          })
        
      }
      else{
        state.groupedSelectedAssets.push(...payload);
      }
    },

    remove: (state: any, action: PayloadAction<any>) => {
        const { payload } = action
        if (!Array.isArray(payload)) {
          const find = state.groupedSelectedAssets.findIndex((val: any) => val.message === payload.message)
          if (find != -1) {
            state.groupedSelectedAssets.splice(find, 1);
          }
        } else {
          const ids = payload.map(p => { return p.message });
          const newState = state.groupedSelectedAssets.filter((s: any) => !ids.includes(s.message));
          state.groupedSelectedAssets.splice(0, state.groupedSelectedAssets.length)
          state.groupedSelectedAssets.push(...newState);
        }
        //work for local storage.
    },

    // clearAll: (state: any, action: PayloadAction<any>) => {
    //     state.groupedSelectedAssets = [];
    // },
    clearAll: (state: any) => {
      state.groupedSelectedAssets = [];
  },

  },
});

export default groupedSelectedAssets;

export const {
  add: addGroupedSelectedAssets,
  clearAdd: clearAddGroupedSelectedAssets,
  remove: removeGroupedSelectedAssets,
  clearAll: clearAllGroupedSelectedAssets,
} = groupedSelectedAssets.actions;
