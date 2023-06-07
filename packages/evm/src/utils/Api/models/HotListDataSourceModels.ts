export type HotListDataSourceTemplate = {
  id: number;
  name: string;
  sourceName: string;
  sourceTypeId: number;
  userId: string;
  password: string;
  confirmPassword: string;
  connectionType: number;
  schedulePeriod: number;
  locationPath: string;
  port: string;
  lastRun: string;
  status: string;
  statusDesc: string;
}