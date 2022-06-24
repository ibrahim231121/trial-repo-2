export interface History {
    createdOn: Date;
    updateOn?: any;
    rowVersion: string;
}

export interface TypeOfDevice {
    id: number;
    name: string;
    description: string;
    category?: any;
    history: History;
}

export interface ConfigurationTemplates {
    id: number;
    name: string;
    typeOfDevice: TypeOfDevice;
    stationId: number;
    history: History;
    fields: any[];
    operationType: number;
}

export type StationInfo = {
    id: number;
    name: string;
};

export type DropdownComponentProps = {
    deviceTypeId: number;
    selectBoxValue: any[];
    stationId: number;
    configurationTemplatesFromStore: any[];
    setSelectBoxValueIntoParent: (param: any) => void;
};