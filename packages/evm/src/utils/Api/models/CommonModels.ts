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
