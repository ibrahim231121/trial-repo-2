export type TCaseSharing = {
    id: string;
    caseId:number;
    caseTitle : string;
    requestTrackId:number | null;
    userId: number;
    startTime: string | null;
    endTime: string | null;
    status: number;
    type: number;
    allowAssetsViewing: boolean;
    allowAssetsPlaying: boolean;
    allowAssetsDownloading: boolean;
    contribute: boolean;
    isHighlight: boolean;
    endTimeInfinite: boolean;
    caseInternalSharingPermission: TCaseInternalSharingPermission;
}

export type TCaseInternalSharingPermission = {
    id: string;
    caseSharingId: number;
    userId : AutoCompleteOptionType[] | null | number;
    groupId : AutoCompleteOptionType[] | null | number;
}

export interface AutoCompleteOptionType {
    label?: string;
    id: number;
}

export enum ESharingType {
    Internal = 1,
    DistrictAttorney = 2,
    Request = 3
}

export enum ESharingStatus {
    Available = 1,
    Expired = 2
}