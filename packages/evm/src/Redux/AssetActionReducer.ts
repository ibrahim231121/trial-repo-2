import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    ObjectToUpdateAssetBucket,
    ObjectToUpdateAssetBucketCategoryField
} from '../Application/Assets/AssetLister/ActionMenu/types';
import { AssetRestriction } from '../utils/Api/models/EvidenceModels';
import _ from 'lodash';
import { BlockLockedAssets } from '../Application/Assets/utils/constants';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import { IDecoded } from '../Login/API/auth';

const assetBucketSlice = createSlice({
    name: 'assetBucket',
    initialState: { assetBucketData: [], isDuplicateFound: false },
    reducers: {
        loadFromLocalStorage: (state: any) => {
            const cookies = new Cookies();
            const accessToken = cookies.get('access_token');
            let decoded: IDecoded | undefined = undefined;
            if (accessToken) {
                decoded = jwt_decode(cookies.get("access_token"));
            }
            let userId = localStorage.getItem('User Id');
            let local_assetBucket = localStorage.getItem('assetBucket_' + userId);
            if (local_assetBucket !== null) {
                /**
                 *! Locked child asset only be rendered if user has 'Permission' or asset is owned by user as 'Search Type' is 'ViewOwnAssets'.
                 */
                const _assets = JSON.parse(local_assetBucket);
                state.assetBucketData = BlockLockedAssets(decoded, '', _assets, 'AssetActionReducer');
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
                const find = state.assetBucketData.findIndex((val: any) => val.assetId === +payload.assetId);
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
            let userId = localStorage.getItem('User Id');
            localStorage.setItem('assetBucket_' + userId, JSON.stringify(state.assetBucketData));
        },
        remove: (state: any, action: PayloadAction<any>) => {
            const { payload } = action;
            if (!Array.isArray(payload)) {
                if(payload.id == undefined && payload.assetId)
                {
                    state.assetBucketData = state.assetBucketData.filter((val: any) => val.assetId !== +payload.assetId)
                }
                else
                {
                    const find = state.assetBucketData.findIndex((val: any) => val.id ?? val.evidenceId === payload.id);
                    if (find != -1) {
                        state.assetBucketData.splice(find, 1);
                    }
                }
            } else {
                const ids = payload.map((p) => {
                    return +p.assetId;
                });
                const newState = state.assetBucketData.filter((s: any) => !ids.includes(+s.assetId));
                state.assetBucketData.splice(0, state.assetBucketData.length);
                state.assetBucketData.push(...newState);
            }
            //work for local storage.
            let userId = localStorage.getItem('User Id');
            localStorage.setItem('assetBucket_' + userId, JSON.stringify(state.assetBucketData));
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
                    let clonedEvidence: any = _.cloneDeep(evidence);
                    const isMaster = payload.requestBody.some((i) => i.assetId === evidence?.evidence.masterAssetId);
                    if (isMaster && !lockedPerformedAssetIds.includes(obj.assetId)) {
                        //NOTE: Put lock property on assets lies in evidence object.
                        const assets = _.cloneDeep(evidence?.evidence.asset).map((o: any) => {
                            o.lock =
                                payload.requestBody[0].operation === AssetRestriction.Lock
                                    ? { groupRecId: payload.requestBody[0].groupRecIdList }
                                    : null;
                            return o;
                        });

                        //NOTE: Putting Id into array, to check for any child asset.
                        lockedPerformedAssetIds.push(...assets.map((x: any) => x.assetId));
                        clonedEvidence.lock = assets.find((a: any) => a.assetId === clonedEvidence.assetId).lock;
                        clonedEvidence.evidence.asset = assets;
                        //Updating State.
                        for (const assetId of lockedPerformedAssetIds) {
                            //NOTE: Check for asset in bucket.
                            const find = state.assetBucketData.findIndex((bucket: any) => bucket.assetId === assetId);
                            //NOTE: Find asset, that is present in current evidence object.
                            const requiredAsset = assets.find((x: any) => x.assetId === assetId);
                            if (find != -1 && requiredAsset) {
                                let clonedAsset = _.cloneDeep(requiredAsset);
                                clonedAsset.evidence = clonedEvidence.evidence;
                                state.assetBucketData[find] = clonedAsset;
                            }
                        }
                    } else {
                        if (!lockedPerformedAssetIds.includes(obj.assetId)) {
                            const assets = _.cloneDeep(evidence?.evidence.asset).map((o: any) => {
                                if (o.assetId == obj.assetId) {
                                    o.lock =
                                        payload.requestBody[0].operation === AssetRestriction.Lock
                                            ? { groupRecId: payload.requestBody[0].groupRecIdList }
                                            : null;
                                    return o;
                                }
                                return o;
                            });
                            clonedEvidence.lock = assets.find((a: any) => a.assetId === clonedEvidence.assetId).lock;
                            clonedEvidence.evidence.asset = assets;
                            //Updating State.
                            const find = state.assetBucketData.findIndex(
                                (bucket: any) => bucket.assetId === obj.assetId
                            );
                            if (find != -1) state.assetBucketData[find] = clonedEvidence;
                            else state.assetBucketData.push(clonedEvidence);
                        }
                    }
                }
                let userId = localStorage.getItem('User Id');
                localStorage.removeItem('assetBucket_' + userId);
                localStorage.setItem('assetBucket_' + userId, JSON.stringify(state.assetBucketData));
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
                        if (find != -1) state.assetBucketData[find] = clonedEvidence;
                        else state.assetBucketData.push(clonedEvidence);
                    }
                }
                let userId = localStorage.getItem('User Id');
                localStorage.removeItem('assetBucket_' + userId);
                localStorage.setItem('assetBucket_' + userId, JSON.stringify(state.assetBucketData));
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
