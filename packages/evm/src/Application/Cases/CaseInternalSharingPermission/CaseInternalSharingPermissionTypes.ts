export type TCaseSharing = {
    id: string;
    caseId:number;
    requestTrackId:number;
    userId: number;
    startTime: string;
    endTime: string;
    status: number;
    type: number;
    allowAssetsViewing: boolean;
    allowAssetsPlaying: boolean;
    allowAssetsDownloading: boolean;
    contribute: boolean;
    isHighlight: boolean;
    endTimeInfinite: boolean;
    caseInternalSharingPermission: TCaseInternalSharingPermission[];
}

export type TCaseInternalSharingPermission = {
    id: string;
    caseSharingId: number;
    userId : AutoCompleteOptionType[] | null;
    groupId : AutoCompleteOptionType[] | null;
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