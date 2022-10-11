// export type assetRow = {
//     id: number;
//     assetId: number;
//     assetName: string;
//     assetType: string;
//     unit: string;
//     categories: string[];
//     devices: string;
//     station: string;
//     recordedBy: string[];
//     recordingStarted: Date;
//     status: string;
//     asset: asset[];
// };

export type AssetLockUnLockErrorType = {
    isError: boolean;
    errorMessage: string;
};

export enum ActionMenuPlacement {
    AssetLister = 1,
    AssetBucket = 2,
    DetailedAssets = 3
}

export type AssetBucket = {
    id: number;
    assetId: number;
    assetName: string;
    recordingStarted: string;
    categories: string[];
}