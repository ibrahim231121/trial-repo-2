export interface SensorsAndTriggers {
    event : event,
    deletedParamValuesIds : number[],
}

export interface event {
    id : any,
    action : any,
    unitId : number,
    description : string,
    switchParameters : any[],
    paramValues : any
}

export interface switchParameters {
      Key: string,
      value : any
}

export interface deviceParams {
    id : number,
    deviceIndex : string,
    deviceId : number,
    paramName : number,
    interfaceButton : number,
}

export interface matchType {
    id : number,
    name : string,
}

export interface DeleteAllSensorsAndTriggers {
    eventIds : number[]
}