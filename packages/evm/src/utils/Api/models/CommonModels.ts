export interface CMTEntityRecord {
    id: string
    cmtFieldName?: string
    cmtFieldValue: number
    record: Record[]
}
export interface Record {
    key: string
    value: string
}

export interface GeoLocation {
    latitude: number,
    longitude: number
}

export interface History {
    CreatedOn: string,
    ModifiedOn: string,
    Version: string
}

export interface Paginated<T> {
    data: T,
    totalCount:number
}
export interface Headers {
    key: string,
    value:string
}