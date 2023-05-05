export type CADTemplate = {
    id: number;
    cadID: string;
    caseID: string;
    createdDate: string;
    status: string;
    description: string;
    locations: string;
    incidentType: string;
    responders: string;
    closedDate: string;
}

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