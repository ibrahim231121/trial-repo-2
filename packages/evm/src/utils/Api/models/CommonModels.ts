export interface CMTEntityRecord {
    id: string
    cmtFieldName: string
    cmtFieldValue: number
    record: Record[]
}
export interface Record {
    key: string
    value: string
}
