export interface CMTEntityRecord {
    iD: string
    cMTFieldName: string
    cMTFieldValue: number
    record: Record[]
}
export interface Record {
    key: string
    value: string
}
