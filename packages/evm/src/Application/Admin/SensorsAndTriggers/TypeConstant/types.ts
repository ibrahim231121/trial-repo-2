export type SelectBoxType = {
    value: number,
    label: string
}
export type CameraSelectBoxType = {
    value: number,
    displayText: string
}

export type SensorAndTriggerDetailErrorModel = {
    error: boolean,
    errorMsg: string
}

export type SensorAndTriggerDetailValidationModel = {
    name: string,
    bookmark: string,
    action: string,
    icon: string,
    overlay: string,
    category: string,
    description: string,
    camera: string,
    emailAlert: string
}

export type SwitchParametersModel = {
    bookmark: SelectBoxTypeExpand,
    action: SelectBoxTypeExpand,
    icon: SelectBoxTypeExpand,
    overlay: StringExpand,
    category: SelectBoxTypeExpand,
    description: StringExpand,
    camera: CameraSelectBoxTypeExpand,
    emailAlert: BooleanExpand
}

export type SwitchParametersDropdownModel = {
    bookmarkList: SelectBoxType[],
    actionList: SelectBoxType[],
    iconList: SelectBoxType[],
    categoryList: SelectBoxType[],
    cameraList: SelectBoxType[]
}

export type DeviceParamsModel = {
    id: string,
    deviceId: number,
    deviceIndex: number,
    interfaceButton: number,
    paramName: string
}

export type DeviceParameterModel = {
    id: number,
    device: SelectBoxType,
    parameter: SelectBoxType,
    criteria: SelectBoxType,
    value: number
}

export type DeviceParameterDropdownModel = {
    deviceList: SelectBoxType[],
    deviceParamsList: DeviceParamsModel[],
    criteriaList: SelectBoxType[]
}

export type SelectBoxTypeExpand = {
    data: SelectBoxType,
    id: number
}
export type CameraSelectBoxTypeExpand = {
    data: SelectBoxType[],
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