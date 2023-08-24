export type TrackingAndSharing = {
    id: string,
    referenceId: string,
    referenceTitle: string,
    sharedType: string,
    recipientChannelValue: string,
    sharedBy: string,
    createdOn: string,
    status: string,
    timeRemaining: string,
    requestType: string,
};
export type DateTimeProps = {
    dateTimeObj: DateTimeObject;
    colIdx: number;
};
export type DateTimeObject = {
    startDate: string;
    endDate: string;
    value: string;
    displayText: string;
};

export type KeyValueMatch = {
    id: number;
    name: string;
}


