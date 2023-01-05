
export type CategoriesDetailErrorModel = {
    error: boolean,
    errorMsg: string
}


export type CategoriesModel = {   
    id:number,
    name:string,
    description:string,
    evidenceRetentionPolicy:EvidenceRetentionPolicy,
    uploadPolicy : UploadPolicy,
    Audio : string
}
export type EvidenceRetentionPolicy = {  
    id:number,
    name : string
}

export type UploadPolicy = {  
    id:number,
    name : string
}

export type HistoryExpand = {  
    version:string    
}

export type LimitExpand =
{   
    isInfinite:boolean,
    hours:number,
    gracePeriodInHours: number 
}

export type FormFieldsTemplate = {
    id: number;
    name: string;
    displayName : string;
    controlType : string;
    width : number;
  }