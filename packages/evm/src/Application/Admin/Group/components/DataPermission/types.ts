type PermissionLevel = {
    value: number,
    label: string
}

type PermissionType = {
    value: number;
    label: string;
}

export type Station = {
    value:number,
    label:string
}

export type StationResponse = {
    id:string,
    name:string
}

export type Category = {
    id:number,
    name:string
}

export type PermissionData = {
    id:number,
    type: PermissionType,
    permissionLevel: PermissionValue
    permissionValue: PermissionLevel,
}

export type PermissionValue = {
    value:number,
    label:string
}

