export interface UploadPolicies {
    uploadPolicy : uploadPolicy,
    deletedParamValuesIds : number[],
}

export interface uploadPolicy {
    id : any,
    name : string,
    description : string,
    type : string,
    history : any,
    dataUploadPolicyTypes : any
}
export interface uploadPolicyDetail {
    id : number,
    typeId : number,
    updateType : string,
    connectionId : number,
    assetPolicyId : number,
    assetConnectionId : number,
}

export interface matchType {
    id : number,
    name : string,
}

export interface DeleteAllUploadPolicies {
    policyIds : number[]
}