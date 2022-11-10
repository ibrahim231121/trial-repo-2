import { type } from "os"


export type RetentionPoliciesDetailErrorModel = {
    error: boolean,
    errorMsg: string
}


export type RetentionPoliciesModel = {   
    id:number,
    type:string,
    name:string,
    description: string,
    detail:DetailExpand,
    history:HistoryExpand 
}
export type DetailExpand = {  
    type:string,
    limit:LimitExpand,
    isDeleted:boolean,
    space:number
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
