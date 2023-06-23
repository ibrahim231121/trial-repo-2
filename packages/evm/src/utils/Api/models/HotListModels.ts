export type HotListTemplate={
    id:number;
    name:string;
    nameWithId:string,
    description:string;
    sourceId: number;
    sourceName:string;
    stationId:number;
    rulesExpression:string;
    alertPriority:number;
    color:string;
    audio:string;
    lastTimeStamp: [];
    createdOn: string;
    lastUpdatedOn: string;
  }

  export type HotListdataTemplateAudio = {
    name: string;
    files: HotListFileData[];
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
export type HotListFileData = {
  filename: string,
  fileurl: string,
  fileduration: number,
  downloadUri: string,
  typeOfAsset: string
};
