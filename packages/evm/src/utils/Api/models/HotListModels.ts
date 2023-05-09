export type HotListTemplate={
  id:number;
    Name:string;
    description:string;
    sourceName:number;
    Tenant:number;
    ruleExpressions:string;
    alertPriority:number;
    color:string;
    audio:string;
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
