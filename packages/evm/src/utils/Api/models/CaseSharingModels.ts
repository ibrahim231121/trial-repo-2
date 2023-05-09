export type CaseSharing = {
    id: number;
    caseId: string;
    requestTrackId: number;
    userId: number;
    startTime:  string;
    endTime: string;
    status: number;
    type: number;
    allowAssetsViewing: boolean;
    allowAssetsPlaying: boolean;
    allowAssetsDownload: boolean; 
    contribute: boolean;
    isHighlight: boolean;
}