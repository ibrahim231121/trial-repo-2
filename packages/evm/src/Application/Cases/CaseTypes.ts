export type TCaseFormType = {
    RecId: number;
    CaseId: string;  //*
    CMT_CAD_RecId: number;
    CADCsv: string[];
    RMSId: string;
    State: AutoCompleteOptionType; //*
    Status: AutoCompleteOptionType; //*
    CreationType?: AutoCompleteOptionType; //*
    ClosedType?: AutoCompleteOptionType;
    DescriptionPlainText:string;
    DescriptionJson: string;
    CaseLead: AutoCompleteOptionType;
};

export interface AutoCompleteOptionType {
    label?: string;
    id: number;
}
export type Case = {
    RecId:number;
    Title: string;  //*
    CMT_CAD_RecId: number;
    CADCsv: string;
    RMSId: string;
    State: number; //*
    StatusId: number; //*
    CreationType: number; //*
    ClosedType: number;
    Description:{
        Formatted:  string,
        PlainText: string
    }
    CreatedBy:number;
    UpdatedBy:number;
    UserId: number;
    CaseAssets?: TCaseAsset[];
};

export type TCaseDetail = {
    id: string;
    title: string;
    cadId: number;
    cadCsv: string;
    rmsId: string;
    state: number;
    stateName: string;
    status: number;
    statusName: string;
    creationType: number;
    closedType: number;
    description:{
        formatted:  string,
        plainText: string
    }
    createdBy:number;
    updatedBy:number;
    userId: number;
    caseAssets: TCaseAsset[];
    caseAudits: TCaseAudit[];
    caseDeleteRequests: any[];
    caseSharings: any[];
    caseTimeline: TCaseTimeline[];
    caseClosed: TCaseClose[]
};

export type TCaseAsset = {
    id: string;
    caseId: number;
    assetId: number;
    assetName: string;
    assetType: number;
    evidenceId: number;
    notes: string;
    sequenceNumber: string;
    fileId: number;
    fileName: string,
    fileType: string,
    accessCode?: string
}

export type TCaseTimeline = {
    recId: number;
    text: string;
    thumbnail: string;
    timeStamp: string;
    type: number;
    sequenceNumber: string | null;
    assetType: number;
    detailId: number;
    isEdit: boolean;
    isHighlight: boolean;
    fileId: number;
    fileName: string;
    fileType: string;
    accessCode: string;
    userName?: string;
    updatedOn?: string;
    evidenceId?: number;
    assetName?: string;
}

export type TCaseAudit = {
    id: string;
    caseId: number;
    text: string,
    type: number;
    userId: number;
    history: TCaseHistory
}

export type TCaseNote = {
    id: string;
    caseId: number;
    text: string;
    isHighlight: boolean;
}

export type TCaseHistory = {
    createdOn: string;
    modifiedOn: string | null;
    version: string;
}

export type TCaseTemplate = {
    id: string;
    caseSummary: string;
    prosecutor: string;
    leadOfficer: string;
    createdOn: string;
    state: string;
    status: string;
};
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

export type TCaseEditUserDetail = {
    createdOn: string,
    updatedOn: string,
    createdById: number,
    createdByName: string,
    closedByName: string
}

export type TCaseHighlight = {
    id?: string;
    caseId: number;
    text: string;
    thumbnail: string;
    type: number;
    sequenceNumber: string | null;
    timeStamp: string;
    assetType: number;
}

export type renderCheckMultiselect = {
    value: string;
    id: string;
}

export type TCaseClosedReason = {
    id : number;
    name : string;
}

export type TCaseClose = {
    id : number;
    caseId : number;
    caseClosedReasonId : AutoCompleteOptionType;
    closingType : string;
    closingAction : string;
    closingRequestDate : string;
    remarks : string;
    status : string;
}

export type CaseSearchEvidenceData = {
    searchBy: CASE_SEARCH_BY,
    cadId: AutoCompleteOptionType,
    users: SearchByUser[],
    startDate: string,
    endDate: string,
}

export type SearchByUser = {
    id: number;
    label: string;
    userName: string;
    selectedAssets: any[]
}

export enum CASE_STATE  {
    Open = 1,
    Closed = 2,
    Deleted = 3
}

export enum CASE_CREATION_TYPE  {
    Manual = 1,
    Automatic = 2,
    RMS = 3
}

export enum CASE_CLOSED_TYPE  {
    Null = 0,
    ClosedWithRE = 1,
    ClosedWithED = 2,
    ClosedWithEAMD = 3
}

export enum CASE_TIMELINE_TYPE {
    Asset = 1,
    Notes = 2,
    Sharing = 3,
    Status = 4
}

export enum CASE_AUDIT_TYPE {
    Asset = 1,
    CAD = 2,
    Share = 3,
    Notes = 4,
    Others = 5,
    StatusUpdate = 6
}

export enum CASE_ASSET_TYPE {
    Video = 1,
    Audio = 2,
    Image = 3,
    Doc = 4,
    Certificate = 5,
    Executable = 6,
    Others = 7,
    AudioOnly = 8,
}

export enum CASE_VIEW_TYPE {
    ViewOnly = 1,
    Contribute = 2
}

export const enum CASE_SEARCH_BY {
    cadId = "1",
    userAndDate = "2"
}

export enum CASE_ACTION_MENU_PARENT_COMPONENT {
    CaseLister,
    CaseDetail,
    CaseTimeline
}

export enum CASE_CLOSE_STATUS  {
    Pending = 1,
    Approved = 2,
    Reject = 3
}

export enum CASE_CLOSE_TYPE  {
    Null = 0,
    CloseAndReleaseAssets = 1,
    CloseAndExpireAssets = 2
}

export enum CASE_CLOSE_ACTION  {
    Null = 0,
    Immediate = 1,
    Future = 2
}