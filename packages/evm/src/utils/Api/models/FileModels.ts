import { History } from "@material-ui/icons";
import { number, string } from "yup";

export interface Lock {
    groupRecId? : Array<number>;
}
export interface Size {
    total: number,
    remaining: number
}
export interface Upload {
    uri: string,
    expiryDate: Date
}
export interface Download {
    uri: string,
    expiryDate: Date
}
export interface Uploader {
    type: string
    by: number
}
export interface History {
    uploadStartedOn: Date,
    uploadCompletedOn: Date,
    deletedOn: Date,
    uploader: number,
    createdOn: Date,
    modifiedOn: Date,
    version: string
}
export interface File{
    id: number,
    name: string,
    size: Size,
    state: string,
    type: string,
    hash: string,
    hashAlgorithm: string,
    stationId: number,
    storageType: string,
    upload: Upload,
    download: Download,
    url: string,
    history: History,
    position: number,
    accessCode:string
}