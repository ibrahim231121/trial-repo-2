import { GeoLocation, History } from "./CommonModels"

export interface Unit {
    id: number,
    name: string,
    description: string,
    stationId: number,
    triggerGroup: string,
    license: License,
    devices: Device[],
    checkIns: CheckIn[],
    configurationTemplates: ConfigurationTemplate,
    history: History,
    primaryDeviceIdentifier: string,
    key: string
}

export interface License {
    key: string,
    status: string,
    hash: string,
    lastUpdatedOn: Date
}

export interface Device {
    id: number,
    identifier: string,
    type: number,
    publicKey: PublicKey,
    version: DeviceCurrentSoftwareVersion,
    isPrimaryDevice: boolean,
    history: History,
    IsCaptureDevice?: boolean
}

export interface PublicKey {
    value: string,
    format: string
}

export interface DeviceCurrentSoftwareVersion {
    current: SoftwareVersion,
    target: SoftwareVersion
}

export interface SoftwareVersion {
    id: number,
    major: number,
    minor: number,
    build: number,
    revision: number,
    customVersion: number,
    history: History
}

export interface CheckIn {
    id: number,
    time: Time,
    status: string,
    position: GeoLocation,
    timezoneInfo: string,
    history: History
}

export interface Time {
    current: Date,
    target: Date
}

export interface ConfigurationTemplate {
    id: number,
    name: string,
    typeOfDevice: DeviceType,
    stationId: number,
    history?: History,
    fields: ConfigurationField[],
    operationType?: number
}

export interface DeviceType {
    id: number,
    name?: string,
    description?: string,
    category?: string,
    history?: History,
    isLogicalDevice?: boolean,
    schema?: string,
    typeCategory?: string
}

export interface ConfigurationField {
    id: number,
    key: string,
    value: string,
    valueType: string
    Sequence: number,
    group: string,
    history: History
}

export interface UnitTemplateConfigurationInfo {
    id: number,
    name: string
}

export interface GetPrimaryDeviceInfo {
    name: string,
    description: string,
    triggerGroup: string,
    serialNumber: string,
    version: string,
    station: string,
    status: string,
    deviceType: string,
    assignedTo: string,
    assests: string,
    uploading: string,
    configTemplateId: string
}

export interface UnitTemp {
    name: string,
    description: string,
    triggerGroup: string,
    unitConfigurationTemplate: string,
    stationId: string
}

export interface DefaultConfigurationTemplate {
    templateName: string,
    templateData: TemplateData[]
}

export interface TemplateData {
    key: string,
    value: string,
    fieldType: string,
    configGroup: string,
    sequence: number
}

export interface DeviceConfigurationTemplate {
    recId: number,
    name: string,
    type: string,
    indicator: string,
    deviceTypeCategory: string
}

export interface ConfigurationTemplateLogs {
    recId: number,
    user: string,
    updatedData: string,
    logTime: Date
}

export interface UnitInfo {
    recId: number,
    unitId: string,
    description: string,
    template: string,
    serialNumber: string,
    version: string,
    station: string,
    stationRecId: string,
    assignedTo: string[],
    lastCheckedIn?: Date,
    Status: string
}

export interface QueuedAssets 
{
    filename:string;
    status:string;
}

export interface DefaultUnitTemplate {
    stationId: number,
    stationPolicyId: number,
    templateId: number,
    deviceTypeId: number,
    operationType: number
}

