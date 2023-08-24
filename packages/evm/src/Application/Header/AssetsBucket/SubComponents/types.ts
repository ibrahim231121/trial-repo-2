export interface AddMetadataFormProps {
    uploadInfo: any;
    onClose: any;
    uploadFile: any;
    uploadAssetBucket: any;
    activeScreen: number;
    setAddEvidence: any;
    setEvidenceId: any;
    setActiveScreen: (param: number) => void;
    setIsformUpdated: (param: boolean) => void;
}

export type NameAndValue = {
    id: string;
    value: string;
};

export type MasterNameAndValue = {
    id: string;
    value: string;
};

export type MasterAssetBucket = {
    id: string;
    value: string;
};

export type UserNameAndValue = {
    userid: string;
    loginId: string;
};

export type StationIdandLabel = {
    id: string;
    label: string;
}

export type CategoryNameAndValue = {
    categoryId: string;
    categoryName: string;
    categoryForm: string[];
    categoryRetentionId: number;
};

export interface addMetadata {
    station: object;
    owner: string[];
    category: string[];
    masterAsset: any;
}

export type masterAsset = {
    id: number;
    name: string;
    typeOfAsset: string;
    status: string;
    state: string;
    unitId: number;
    isRestrictedView: boolean;
    duration: number;
    recording: {
        started: string;
        ended: string;
    };
    buffering: {
        pre: number;
        post: number;
    };
    owners: any;
    audioDevice: string;
    camera: string;
    isOverlaid: boolean;
    recordedByCSV: string;
    bookMarks: any;
    notes: any;
    files: any;
    lock: any;
};

export type masterAssetFile = {
    id: number;
    assetId: number;
    filesId: number;
    accessCode: string;
    name: string;
    type: string;
    extension: string;
    url: string;
    size: number;
    duration: number;
    recording: {
        started: string;
        ended: string;
    };
    sequence: number;
    checksum: null;
    version: string;
};

export type masterAssetStation = {
    CMTFieldValue: number;
};

export type retentionPolicyId = {
    CMTFieldValue: number;
};
