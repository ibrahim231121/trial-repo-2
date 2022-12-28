import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const groupedSelectedAssets = createSlice({
  name: "groupedSelectedAssets",
  initialState: { groupedSelectedAssets: []},
  reducers: {

    get: (state: any) => {
        let local_groupedSelectedAssets = localStorage.getItem("groupedSelectedAssets");
        if (local_groupedSelectedAssets !== null) {
            state.groupedSelectedAssets = JSON.parse(local_groupedSelectedAssets);
        }
    },

    add: (state: any, action: PayloadAction<any>) => {
      const { payload } = action;
      if(state.groupedSelectedAssets.length>0)
      {
        //  state.groupedSelectedAssets.map((x:any)=>{
        //   payload.map((y:any)=>{
        //     if(x.assetId==y.assetId){
        //       x.isChecked=y.isChecked
        //     }
        //   })
        // })
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
     
      //state.groupedSelectedAssets = [];
      //if (!Array.isArray(payload)) {
        // console.log("payload ", payload)
        // state.groupedSelectedAssets.push(payload);
      //} 
      //work for local storage.
      //console.log("groupedSelectedAssets ", state.groupedSelectedAssets)
      localStorage.setItem("groupedSelectedAssets", JSON.stringify(state.groupedSelectedAssets));
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
        localStorage.setItem("groupedSelectedAssets", JSON.stringify(state.groupedSelectedAssets));
    },

    clearAll: (state: any, action: PayloadAction<any>) => {
        state.groupedSelectedAssets = [];
        localStorage.setItem("groupedSelectedAssets", JSON.stringify(state.groupedSelectedAssets));
    },

  },
});

export default groupedSelectedAssets;

export const {
  add: addGroupedSelectedAssets,
  remove: removeGroupedSelectedAssets,
  clearAll: clearAllGroupedSelectedAssets,
  get: getGroupedSelectedAssets,
} = groupedSelectedAssets.actions;
