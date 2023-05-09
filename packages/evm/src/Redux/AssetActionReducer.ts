import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    ObjectToUpdateAssetBucket,
    ObjectToUpdateAssetBucketCategoryField
} from '../Application/Assets/AssetLister/ActionMenu/types';
import { AssetRestriction } from '../utils/Api/models/EvidenceModels';
import _ from 'lodash';

const assetBucketSlice = createSlice({
    name: 'assetBucket',
    initialState: { assetBucketData: [], isDuplicateFound: false },
    reducers: {
        loadFromLocalStorage: (state: any) => {
            let local_assetBucket = localStorage.getItem('assetBucket');
            if (local_assetBucket !== null) {
                state.assetBucketData = JSON.parse(local_assetBucket);
            }
        },
        add: (state: any, action: PayloadAction<any>) => {
            const { payload } = action;
            // if(payload.isMetaData && payload.isMetaData==true){
            //   const find = state.assetBucketData.findIndex((val: any) => val.assetId === payload.assetId)
            //   if (find === -1) {
            //     state.assetBucketData.push(payload)
            //   }
            // }
            // else {
            if (!Array.isArray(payload)) {
                const find = state.assetBucketData.findIndex((val: any) => val.assetId === payload.assetId);
                if (find === -1) {
                    state.assetBucketData.push(payload);
                }
            } else {
                const find = payload.filter(
                    (p: any) => !state.assetBucketData.find((s: any) => p.assetId === s.assetId)
                );
                if (payload.length > find.length) {
                    state.isDuplicateFound = true;
                }
                state.assetBucketData.push(...find);
            }
            //}
            //work for local storage.
            localStorage.setItem('isBucket', 'True');
            localStorage.setItem('assetBucket', JSON.stringify(state.assetBucketData));
        },
        remove: (state: any, action: PayloadAction<any>) => {
            const { payload } = action;
            if (!Array.isArray(payload)) {
                const find = state.assetBucketData.findIndex((val: any) => val.id === payload.id);
                if (find != -1) {
                    state.assetBucketData.splice(find, 1);
                }
            } else {
                const ids = payload.map((p) => {
                    return p.id;
                });
                const newState = state.assetBucketData.filter((s: any) => !ids.includes(s.id));
                state.assetBucketData.splice(0, state.assetBucketData.length);
                state.assetBucketData.push(...newState);
            }
            //work for local storage.
            localStorage.setItem('assetBucket', JSON.stringify(state.assetBucketData));
        },
        updateDuplicateFound: (state: any) => {
            state.isDuplicateFound = false;
        },
        updateAssetBucketLockField: (state: any, action: PayloadAction<ObjectToUpdateAssetBucket>) => {
            const { payload } = action;
            try {
                const lockedPerformedAssetIds: Array<number> = [];
                for (const obj of payload.requestBody) {
                    const evidence = payload.assetBucketData.find((val: any) => val.assetId == obj.assetId);
                    if (evidence) {
                        let clonedEvidence: any = _.cloneDeep(evidence);
                        const isMaster = payload.requestBody.some((i) => i.assetId === evidence.evidence.masterAssetId);
                        if (isMaster && !lockedPerformedAssetIds.includes(obj.assetId)) {
                            const assets = _.cloneDeep(evidence.evidence.asset).map((o: any) => {
                                if (payload.requestBody[0].operation === AssetRestriction.Lock)
                                    o.lock = { groupRecId: payload.requestBody[0].groupRecIdList };
                                else o.lock = null;
                                return o;
                            });
                            lockedPerformedAssetIds.push(...assets.map((x: any) => x.assetId));
                            clonedEvidence.lock = assets.find((a: any) => a.assetId === clonedEvidence.assetId).lock;
                            clonedEvidence.evidence.asset = assets;
                            //Updating State.
                            for (const assetId of lockedPerformedAssetIds) {
                                const find = state.assetBucketData.findIndex((val: any) => val.assetId === assetId);
                                if (find != -1) {
                                    const requiredAsset = assets.find((x: any) => x.assetId === assetId);
                                    let clonedAsset = _.cloneDeep(requiredAsset)
                                    clonedAsset.evidence = clonedEvidence.evidence;
                                    state.assetBucketData[find] = clonedAsset;
                                }
                            }
                        } else {
                            if (!lockedPerformedAssetIds.includes(obj.assetId)) {
                                const assets = _.cloneDeep(evidence.evidence.asset).map((o: any) => {
                                    if (o.assetId == obj.assetId) {
                                        if (payload.requestBody[0].operation === AssetRestriction.Lock)
                                            o.lock = { groupRecId: payload.requestBody[0].groupRecIdList };
                                        else o.lock = null;
                                        return o;
                                    }
                                    return o;
                                });
                                clonedEvidence.lock = assets.find((a: any) => a.assetId === clonedEvidence.assetId).lock;
                                clonedEvidence.evidence.asset = assets;
                                //Updating State.
                                const find = state.assetBucketData.findIndex((val: any) => val.assetId === obj.assetId);
                                if (find != -1) state.assetBucketData[find] = clonedEvidence;
                                else state.assetBucketData.push(clonedEvidence);
                            }
                        }
                    }
                }
                localStorage.removeItem('assetBucket');
                localStorage.setItem('assetBucket', JSON.stringify(state.assetBucketData));
            } catch (error: any) {
                console.error('error', error);
            }
        },
        updateAssetBucketCategoryField: (state: any, action: PayloadAction<ObjectToUpdateAssetBucketCategoryField>) => {
            const { payload } = action;
            try {
                const uniqueEvidences = payload.requestBody.filter(
                    (value, index, self) => index === self.findIndex((t) => t.evidenceId === value.evidenceId)
                );
                for (const o of uniqueEvidences) {
                    const assets = payload.assetBucketData.filter((asset: any) => asset.evidence.id == o.evidenceId);
                    for (const asset of assets) {
                        let clonedEvidence = _.cloneDeep(asset);
                        clonedEvidence.categories = o.categories;
                        clonedEvidence.evidence.categories = o.categories;
                        //Updating State.
                        const find = state.assetBucketData.findIndex((s: any) => s.assetId === asset.assetId);
                        if (find != -1) 
                            state.assetBucketData[find] = clonedEvidence;
                        else 
                            state.assetBucketData.push(clonedEvidence);
                    }
                }
                localStorage.removeItem('assetBucket');
                localStorage.setItem('assetBucket', JSON.stringify(state.assetBucketData));
            } catch (error: any) {
                console.error('error', error);
            }
        }
    }
});

export default assetBucketSlice;
export const {
    add: addAssetToBucketActionCreator,
    remove: removeAssetFromBucketActionCreator,
    updateDuplicateFound: updateDuplicateFound,
    loadFromLocalStorage: loadFromLocalStorage,
    updateAssetBucketLockField: updateAssetLockField,
    updateAssetBucketCategoryField
} = assetBucketSlice.actions;
