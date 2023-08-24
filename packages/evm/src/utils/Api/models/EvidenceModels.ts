import { CMTEntityRecord } from './CommonModels';

export interface Field {
    id: number;
    key: string;
    value: string;
    dataType: string;
}
export interface FormData {
    formId: number;
    record: CMTEntityRecord;
    fields: Field[];
}
export interface AssetAction { 
    masterId: number,
    assetId: number,
    evidenceId: number,
    actionType: string,
    assetName?: string,
    assetType?: any,
    fileType?: any,
    expireOn?: Date,
    holduntil?: Date,
    isRestricted?: boolean,
}
export interface EvidenceAssetAction {
    evidenceId: number,
    assetId: number,
    masterassetId?: number,
    action: string,
    masterAssetName?: string,
    assetName?: string,
}
export interface EvidenceRetention {
    evidenceId: number,
    holdUntil: Date,
}
export interface AssetsLinking {
    evidenceId: number,
    assetId: number,
    masterassetId?: number,
    action: string,
    evidenceRetentionList: EvidenceRetention[],
    masterAssetName?: string,
    assetName?: string,

}
export interface Category {
    id: number;
    name: string;
    formData: FormData[];
    assignedOn: Date;
    record?: CMTEntityRecord;
    dataRetentionPolicy?: CMTEntityRecord;
}

export interface Recording {
    started: Date;
    ended: Date;
    timeOffset: number;
}
export interface RecordingBuffer {
    pre: number;
    post: number;
}
export interface Bookmark {
    id: number;
    assetId: number;
    bookmarkTime: Date;
    position: number;
    description: string;
    madeBy: string;
    version: string;
    user: CMTEntityRecord;
    userInfo?: CMTEntityRecord;
}
export interface Note {
    id: number;
    assetId: number;
    noteTime: Date;
    position: number;
    description: string;
    madeBy: string;
    version: string;
    user: CMTEntityRecord;
    userInfo?: CMTEntityRecord;
}
export interface File {
    id: number;
    assetId: number;
    filesId: number;
    name: string;
    type: string;
    extension: string;
    url: string;
    size: number;
    duration: number;
    recording: Recording;
    sequence: number;
    checksum: any;
    accessCode?: string;
}
export interface Assets {
    master: Asset;
    children: Asset[];
}
export interface Asset {
    id: number;
    name: string;
    typeOfAsset: string;
    status: string;
    state: string;
    unitId: number;
    unit?: CMTEntityRecord;
    isRestrictedView: boolean;
    duration: number;
    recording: Recording;
    buffering: RecordingBuffer;
    audioDevice?: string;
    camera?: string;
    isOverlaid: boolean;
    recordedByCSV?: string;
    bookMarks: Bookmark[];
    notes: Note[];
    files: File[];
    owners: CMTEntityRecord[] | number[];
    lock: Lock;
    version?: string;
    createdOn?: Date;
    modifiedOn?: Date;
    redactionStatus?: number
}

export interface Lock {
    groupRecId?: Array<number>;
}

export interface Role {
    id: number;
    hierarchy: number;
}

export interface TimelinesSync {
    assetId: number;
    timeOffset: number;
}
export interface AssetViewReason {
    id: number;
    assetId: number;
    userId: number;
    viewedTime: Date;
    ipAddress: string;
    viewReason: string;
}
export interface AddOwner {
    evidenceId: number;
    assetId: number;
    owners: number[];
}
export interface ExtendRetention {
    evidenceId: number;
    extendedDays: number | null;
    holdUntil: number;
}

export interface PermissionModel {
    isOneTimeViewable: boolean;
    isDownloadable: boolean;
    isAvailable: boolean;
    isViewable: boolean;
    isMetadataOnly: boolean;
}

export interface SharedModel {
    expiryDuration: number;
    by: number;
    on: Date;
    status: string;
    type: string;
}

export interface RevokedModel {
    by: number;
    on?: Date;
}
export interface AssetSharingModel {
    //assetGroup: AssetShareLink[];
    assetId: number;
    masterId: number;
    evidenceId: number;
    assetName?: string,
    assetType?: any,
    fileType?: any,

    tenantId: number;
    message: string;
    email: string;
    permissons: PermissionModel;
    shared: SharedModel;
    revoked: RevokedModel;
    version: string;
    sharingReason: string;
}
export interface Form {
    fields: Field[];
}
export interface categoriesModel {
    categoryName: string;
    form: Field[];

}
export interface SharedAssetLister {
    assetId: number;
    downloadLink: string[];
    assetName: string;
    unitName: string;
    checksum: string[];
    capturedDate: Date;
    duration: number;
    categories: string;
    fields: string;
    evidenceAsset?: any;
    //categories: categoriesModel[];

}
export interface AssetShareLink {
    assetId: number;
    masterId: number;
    evidenceId: number;
    assetName?: string;
    assetType?: any;
    fileType?: any;
}
export interface EvidenceChildSharingModel {
    masterId: number;
    assetId: number[];

}

export interface Evidence {
    id: number;
    categories: Category[];
    securityDescriptors: securityDescriptorType[];
    assets: Assets;
    holdUntil?: Date;
    expireOn: Date;
    stationId: CMTEntityRecord;
    retentionPolicyId: CMTEntityRecord;
    computerAidedDispatch: string;
    tag: string;
    version: string;
    createdOn: string;
    modifiedOn?: Date;
    masterAssetRecId?: number;
    relatedAssets: RelatedAssets[] | null;
}

export interface EvdenceCategoryAssignment {
    unAssignCategories: Category[];
    assignedCategories: Category[];
    updateCategories: Category[];
    evidenceId : number;
}

export interface EvidenceCategory {
    evidenceId: number;
    categories: Array<Category>;
    categorizedBy: number;
}

export type securityDescriptorType = {
    groupId: number;
    permission: PersmissionModel;
};

export enum AssetRestriction {
    Lock = 'Lock',
    UnLock = 'UnLock'
}

export enum PersmissionModel {
    View = 1,
    Share = 2,
    Update = 3,
    Exclusive = 4
}

export enum MetadataFileType {
    XML = 1,
    PDF = 2,
    CSV = 3
}

export interface AssetLogType {
    evidenceId : number
    assetId : number
    assetLog : AssetLog
}
export interface EvidenceAssetNotes {
    evidenceId : number
    assetId : number 
    notes : string
}
export interface PublicAssetLog {
    evidenceId : number
    assetId : number 
    tenantId : number 
    email : string 
    notes : string
}
export interface MultiAssetLog {
    evidenceAssetNotes : EvidenceAssetNotes[]
    assetLog : AssetLog 
}
export interface AssetLog {
    action : string
    notes : string
    auditTableNamesEnum? : number
}

export type RelatedAssets = {
    asset: Asset;
    evidenceId : number;
    relationType : string;
    rankScore : number;
}

export enum AuditTableNames  {
    AssetLock = 0,
    EvidenceAsset = 1,
    AssetOwner = 2,
    AssetSharing = 3,
    AssetSharingLog = 4,
    AssetViewReason = 5,
    AssetBookmark = 6,
    AssetFile = 7,
    AssetNotes = 8,
    EvidenceCategory = 9
}