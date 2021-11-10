type PermissionLevel = {
    value: number,
    label: string
}

type PermissionType = {
    value: number;
    label: string;
}

export type Station = {
    id:number,
    name:string
}

export type Category = {
    id:number,
    name:string
}

export type PermissionData = {
    type: PermissionType,
    permissionLevel: PermissionValue
    permissionValue: PermissionLevel,
}

export type PermissionValue = {
    value:number,
    label:string
}

