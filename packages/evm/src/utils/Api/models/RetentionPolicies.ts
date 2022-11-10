export interface RetentionPolicies {
    retention : retention,
    deletedParamValuesIds : number[],
}

export interface retention {
    id : any,
    name : string,
    description : string,
    detail:detail
}

export interface detail {
    type:number,
    limit:limit,
    isDeleted:boolean,
    space:number
}

export interface limit{
    isInfinite :boolean,
    hours:number,
    gracePeriodInHours:number
}


export interface DeleteAllRetentionPolicies {
    retentionIds : number[]
}