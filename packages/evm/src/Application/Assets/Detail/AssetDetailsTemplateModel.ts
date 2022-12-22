export type DateTimeProps = {
    dateTimeObj: DateTimeObject;
    colIdx: number;
};
export type DateTimeObject = {
    startDate: string;
    endDate: string;
    value: string;
    displayText: string;
};
export type assetdata = {
    name: string;
    files: any;
    assetduration: number;
    assetbuffering: any;
    recording: any;
    bookmarks: [];
    id: number;
    unitId: number;
    typeOfAsset: string;
    notes: any;
    camera: string;
    status: string;
};
export type AuditTrail = {
    sequenceNumber: string;
    captured: any;
    username: string;
    activity: string;
};

export type EvidenceReformated = {
    id: number;
    categories: string[];
    assetId: string;
    assetName: string;
    assetType: string;
    recordingStarted: string;
};

export type AssetReformated = {
    categories: any[];
    owners: string[];
    unit: number[];
    capturedDate: string;
    checksum: number[];
    duration: string;
    size: string;
    retention: string;
    categoriesForm: string[];
    id?: number;
    assetName?: string;
    typeOfAsset: string;
    status: string;
    camera: string;
};
