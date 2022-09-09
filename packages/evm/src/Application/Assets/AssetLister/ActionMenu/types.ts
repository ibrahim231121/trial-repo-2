import { PersmissionModel } from "./AssetListerEnum";
export type assetRow = {
    id: number;
    assetId: number;
    assetName: string;
    assetType: string;
    unit: string;
    categories: string[];
    devices: string;
    station: string;
    recordedBy: string[];
    recordingStarted: Date;
    status: string;
    asset: asset[];
}
export type asset = {
    assetId: number;
    assetName: string;
    unit: string;
    status: string;
    state: string;
    assetType: string;
    isRestrictedView: boolean;
    expiryDate: Date;
    holdUntillDate: Date;
    thumbnailUri: string;
    recordedBy: string[];
    camera: string;
    audioDevice: string;
    recordingStarted: Date;
    recordingEnded: Date;
    preBuffer: number;
    postBuffer: number;
    duration: number;
    isOverlaid: boolean;
    segmentCount: number;
}

export type securityDescriptorType = {
    groupId: number;
    permission: PersmissionModel;
  }


  export type AssetLockUnLockErrorType = {
    isError: boolean,
    errorMessage: string
  }