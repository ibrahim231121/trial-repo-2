export type CaseFormType = {
   
    Title: string;  //*
    CMT_CAD_RecId: number;
    CADCsv: string;
    RMSId: string;
    State?: AutoCompleteOptionType; //*
    Status?: AutoCompleteOptionType; //*
    CreationType?: AutoCompleteOptionType; //*
    ClosedType?: AutoCompleteOptionType;
    DescriptionPlainText:string;
    DescriptionJson: string;
   
};

export interface AutoCompleteOptionType {
    label?: string;
    id?: number;
}
export interface Case {
    RecId:number;
    Title: string;  //*
    CMT_CAD_RecId: number;
    CADCsv: string;
    RMSId: string;
    State: number; //*
    Status: number; //*
    CreationType: number; //*
    ClosedType: number;
    DescriptionPlainText:string;
    DescriptionJson: string;
   
};

export type CaseTemplate = {
    id: string;
    caseSummary: string;
    prosecutor: string;
    leadOfficer: string;
    createdOn: string;
    state: string;
    status: string;
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
