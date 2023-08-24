export type isBucket = {
    isOpenBucket: boolean;
    isGuestUser?: boolean;
};

export interface UploadInfo {
    uploadValue: number;
    uploadText: string;
    uploadFileSize: string;
    error: boolean;
    removed?: boolean;
}
export interface FileUploadInfo {
    uploadInfo: UploadInfo;
    fileName: string;
    accessCode: string;
    fileId: string;
    isPause: boolean;
    isCompleted: boolean;
    state: string;
}
