export interface Policy {
    id: number,
    type: string,
    name: string,
    description: string,
    detail: DataRetentionPolicyDetail,
    history: History
}

export interface DataRetentionPolicyDetail {
    id: number,
    type: string,
    name: string,
    limit: Limit
    isDeleted: boolean,
    stationId?: number
}

export interface Limit {
    isInfinite: boolean,
    hours?: number,
    gracePeriodInHours?: number
}