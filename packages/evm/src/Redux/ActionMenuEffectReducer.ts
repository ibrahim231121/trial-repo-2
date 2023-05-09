import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface ActionMenuEffectState {
    RestrictEffect: number;
    //SomeOtherOperationCounter
}

const initialState = { RestrictEffect: 0 } as ActionMenuEffectState;
export const ActionMenuEffectSlice = createSlice({
    name: 'assetBucketEffects',
    initialState,
    reducers: {
        ActionMenuRestrictActionOccured(state) {
            state.RestrictEffect++;
        },
        //SomeOtherOperationReducer
    }
});

export const { ActionMenuRestrictActionOccured } = ActionMenuEffectSlice.actions;
export default ActionMenuEffectSlice;
