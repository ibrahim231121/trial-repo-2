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
    assetType: string;
    recordingStarted: string;
    categories: string[];
    evidence : any;
  }

export interface LockUnlockAsset {
    evidenceId: number;
    assetId: number;
    groupRecIdList: (number | null)[];
    operation: string;
}

export interface ObjectToUpdateAssetBucket {
    requestBody : Array<LockUnlockAsset>;
    assetBucketData : AssetBucket[];
}

export interface AssetCategoryObject {
    evidenceId: number;
    categories: Array<string>;
}

export interface ObjectToUpdateAssetBucketCategoryField {
    requestBody : Array<AssetCategoryObject>;
    assetBucketData : AssetBucket[];
}

export type Props = {
    row: any;
    selectedItems?: any;
    setSelectedItems?: (obj: any) => void;
    isPrimaryOptionOpen?: boolean;
    asset?: any;
    portal?: boolean;
    showToastMsg?: (obj: any) => void;
    setIsPrimaryOptionOpen?: (obj: boolean) => void;
    actionMenuPlacement: ActionMenuPlacement;
    className?: string;
    actionViewScroll?: any;
    setIsAddedToBucket?: any;
    isRelatedAsset?: boolean;
};

export type AssetLink = {
    masterId: number;
    assetId: number;
    evidenceId: number;
    assetName?: string;
    assetType?: any;
    fileType?: any;
    expireOn?: any;
    holduntil?: any;
};

export type MasterAssetEvidence = {
    masterId: number;
    evidenceId: number;
    assetName?: string;
    assetType?: any;
    fileType?: any;
    expireOn?: any;
    holduntil?: any;
};