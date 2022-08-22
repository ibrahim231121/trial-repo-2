import { CMTEntityRecord } from "./CommonModels"

export interface Field {
    id: number,
    key: string,
    value: string,
    dataType: string,
}
export interface FormData {
    formId: number,
    record: CMTEntityRecord,
    fields: Field[],
}
export interface Category {
    id: number,
    formData: FormData[],
    assignedOn: Date,
    record?: CMTEntityRecord,
    DataRetentionPolicy?: CMTEntityRecord,
    name: string,
}


export interface Recording {
    started: Date
    ended: Date
    timeOffset: number
}
export interface RecordingBuffer {
    pre: number
    post: number
}
export interface Bookmark {
    id: number
    assetId: number
    bookmarkTime: Date
    position: number
    description: string
    madeBy: string
    version: string
}
export interface Note {
    id: number
    assetId: number
    noteTime: Date
    position: number
    description: string
    madeBy: string
    version: string
    userId: CMTEntityRecord
}
export interface File {
    id: number
    assetId: number
    filesId: number
    name: string
    type: string
    extension: string
    url: string
    size: number
    duration: number
    recording: Recording
    sequence: number
    checksum: any
}
export interface Assets {
    master: Asset,
    children: Asset[]
}
export interface Asset {
    id: number
    name: string
    typeOfAsset: string
    status: string
    state: string
    unitId: number
    unit?: CMTEntityRecord
    isRestrictedView: boolean
    duration: number
    recording: Recording
    buffering: RecordingBuffer
    audioDevice?: string
    camera?: string
    isOverlaid: boolean
    recordedByCSV?: string
    bookMarks: Bookmark[]
    notes: Note[]
    files: File[]
    owners: CMTEntityRecord[] | number[]
    lock: Lock
}

export interface Lock {
    roles: Role[]
}

export interface Role {
    id: number
    hierarchy: number
}

export interface TimelinesSync {
    assetId: number
    timeOffset: number
}
export interface AssetViewReason {
    id: number
    assetId: number
    userId: number
    viewedTime: Date
    ipAddress: string
    viewReason: string
}
export interface AddOwner {
    evidenceId: number,
    assetId: number,
    owners: number[]
}
export interface ExtendRetention {
    id: number,
    extendedDays: number
}

export interface PermissionModel {
    isOneTimeViewable: boolean,
    isDownloadable: boolean,
    isAvailable: boolean,
    isViewable: boolean,
    isMetadataOnly: boolean
  }

  export interface SharedModel {
    expiryDuration: number,
    by: number,
    on: Date,
    status: string,
    type: string
  }

  export interface RevokedModel {
    by: number,
    on?: Date,
  }
export interface AssetSharingModel {
    message: string,
    email: string,
    permissons: PermissionModel,
    shared: SharedModel,
    revoked: RevokedModel,
    version: string
}
// export interface SubmitAnalysisModel {
//     isAudioSource: boolean,
//     audioSource: string,
//     videoAnalysis: boolean,
//     audioAnalysis: boolean,
//     note: string,
// }
export interface SubmitAnalysisModel {
    project:Project,
    job:Job
}
export interface Project {
    projectName: string,
    type: number,
    notes: string,
    assetId: number,
    assetName: string,
    assetUrl: string,
    assetFileSize: number,
    assetDuration: number,
    recordedBy: string,
    fileType: string,
    submitBy: number,

}
export interface Job {
    type: number,
    priority: number,
    progress: number,
    

}
export interface Evidence {
    id: number
    categories: Category[]
    assets: Assets
    stationId: CMTEntityRecord
    retentionPolicyId: CMTEntityRecord
    retainUntil: Date
    createdOn: Date
    extendedRetainUntil: Date
}

export interface EvdenceCategoryAssignment
{
    unAssignCategories : Category[]
    assignedCategories : Category[]
    updateCategories : Category[]
    retentionId? : number[] | null
    holdUntill? : string
}
