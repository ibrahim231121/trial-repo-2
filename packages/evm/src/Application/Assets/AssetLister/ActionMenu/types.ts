export type AssetLockUnLockErrorType = {
    isError: boolean;
    errorMessage: string;
};

export enum ActionMenuPlacement {
    AssetLister = 1,
    AssetBucket = 2,
    DetailedAssets = 3,
    AssetDetail = 4
}

export type AssetBucket = {
    id: number;
    assetId: number;
    assetName: string;
    recordingStarted: string;
    categories: string[];
}

export interface LockUnlockAsset {
    evidenceId: number;
    assetId: number;
    groupRecIdList: (number | null)[];
    operation: string;
}
