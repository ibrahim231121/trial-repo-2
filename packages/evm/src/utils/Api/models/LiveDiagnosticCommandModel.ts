export interface LiveDiagnosticCommandModel {
    ClientGuidId?: string;
    ConversationID?: string;
    MessageType?: string;
    MessageOrigin?: string;
    From: string;
    CommandInvokerGuid?: string;
    To: string;
    TimestampOrigin?: number;
    TimestampHub?: number;
    StationId: string;
    UnitId: string;
    ConversationCompletedAt?: string;
    MessageCreatedAt?: string;
    Timeout?: number;
    Body: string;
    Data?: string;
}

export interface CommandTypeRequest {
    CommandType: string;
    CommandID: number;
    Params?: CommandParams;
}

export interface CommandTypeResponse {
    success: true;
    CommandType: string;
    CommandID: number;
    Description: string;
}

export interface CommandParams {
    Duration?: number;
    Mode?: string;
    guid?: string;
    LogTypes?: string;
}

export interface MQTTStatusModal {
    unitId: number;
    stationId: number;
    topic: string;
    status: string;
    message: string;
    topicType: string;
    dateTime: string;
}

export enum MQTTUnitStatus {
    SYNCED = 100,
    SYNCING = 50,
    FAILED = 0
}
