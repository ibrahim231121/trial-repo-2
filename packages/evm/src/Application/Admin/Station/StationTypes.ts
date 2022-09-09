import { ConfigurationTemplate } from '../../../utils/Api/models/UnitModels';
export type StationFormType = {
    Name: string;
    StreetAddress?: string;
    Phone?: string;
    Passcode?: string;
    Location?: any;
    PolicyId?: number;
    RetentionPolicy?: AutoCompleteOptionType;
    UploadPolicy?: AutoCompleteOptionType;
    BlackboxRetentionPolicy?: AutoCompleteOptionType;
    SSId?: string;
    Password?: string;
    ConfigurationTemplate: ConfigurationTemplate[] | any[];
};

export interface AutoCompleteOptionType {
    label?: string;
    id?: string;
}

export interface IlatLong {
    lat: number;
    long: number;
}

export type StationType = {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
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
