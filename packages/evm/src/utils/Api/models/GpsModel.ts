export interface GPS
{
    logTime : number;
    lat : number;
    lon : number;
    alt : number;
    speed : number;
    spAcc : number;
    error : number;
}
export interface Sensors
{
    logTime : number;
    value : string;
}
export interface GPSAndSensors
{
    GPS : GPS[];
    Sensors : Sensors[];
    IsNmeaParser : boolean
}
export interface GpsSensorData {
    assetId: number, 
    filesId: number, 
    sequence: number, 
    recording: string, 
    gps: GPS[], 
    sensors: Sensors[], 
    isNmeaParser: boolean
}