export type HotListDataSourceMappingTemplate = {
  licensePlate: string;
  dateOfInterest: string;
  licenseType: string;
  agencyId: string;
  stateId: string;
  firstName: string;
  lastName: string;
  alias: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleStyle: string;
  notes: string;
  ncicNumber: string;
  importSerialId: string;
  violationInfo: string;
}

export type HotListDataSourceTemplate = {
  recId: number;
  sourceTypeId: number;
  name: string;
  sourceName: string;
  sourceTypeName: string;
  userId: string;
  password: string;
  confirmPassword: string;
  connectionType: string;
  schedulePeriod: string;
  locationPath: string;
  port: string;
  lastRun: string;
  status: string;
  statusDesc: string;
  sourceType:{recId:number,sourceTypeName:string | undefined};
}