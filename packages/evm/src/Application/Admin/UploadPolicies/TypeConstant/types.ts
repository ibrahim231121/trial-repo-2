export type SelectBoxType = {
    value: number,
    displayText: string
}

export type SelectConnectionLevel = {    
    value: number;
    label: string;
}

export type UploadPolicyDetailErrorModel = {
    error: boolean,
    errorMsg: string
}

export type UploadPolicyDetailValidationModel = {
    name: string,
    description: string,    
}



export type UploadPolicyDetailModel = {
    id: number,
    assetType: SelectBoxType,
    uploadType: SelectBoxType,    
    metadataUploadConnection: SelectConnectionLevel[],
    assetUploadPriority: SelectBoxType,
    assetUploadConnection: SelectConnectionLevel[]
}

export type UploadPolicyDropdownModel = {
    assetTypeList: SelectBoxType[],
    uploadTypeList: SelectBoxType[],
    metadataUploadConnectionList: SelectConnectionLevel[],
    assetUploadPriorityList: SelectBoxType[],
    assetUploadConnectionList: SelectConnectionLevel[],    
}

export type SelectBoxTypeExpand = {
    data: SelectBoxType,
    id: number
}

export type StringExpand = {
    data: string,
    id: number
}

export type BooleanExpand = {
    data: boolean,
    id: number
}