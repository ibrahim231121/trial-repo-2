export interface AuditLog {
    isSuccess: boolean,
    service: string,
    event: any,
    message: string,
    data: any,
    createdOn: any,
    logTime: any,
    location: Location,
    stationId: number,
    auditType: string,
    user: User,
    unit: Unit
}
export interface Location
{
    machine: string,
    ip: string,
    userAgent: string,
}
export interface Unit
{
    unitId: number,
    unitName: string,
}
export interface User
{
    userId: number,
    userName: string,
}