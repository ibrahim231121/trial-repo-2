import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { FileAgent, UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { ConfigurationTemplate } from '../utils/Api/models/UnitModels';
import { GPSAndSensors, GpsSensorData } from '../utils/Api/models/GpsModel';
import { BlobServiceClient } from '@azure/storage-blob';
import parseNmea from '../Application/Assets/utils/GpsParse';

export const addGPSAndSensorsAsync: any = createAsyncThunk(
    'GPSAndSensors/getGPSAndSensorsAsync',
    async (arg: any, {getState}) => {
        const state : any = getState(); 
        let allFiles : any[] = arg.files;
        let assetId : number = arg.assetId;
        let stateGpsSensorData : GpsSensorData[] = JSON.parse(JSON.stringify(state.GPSAndSensorsReducerSlice.GpsSensorData));

        let stateGpsSensorDataFilesIds = stateGpsSensorData.map(a => a.filesId);
        let files = allFiles.filter((x:GpsSensorData)=> !stateGpsSensorDataFilesIds.includes(x.filesId));
        if(files.length > 0){
            let temp = await getPromiseData(files);
            return {
                dataArray : temp,
                assetId: arg.assetId,
                addNew : true
            }
        }
        else{
            let currentAsset = stateGpsSensorData.filter((x:GpsSensorData)=> x.assetId == assetId);
            return {
                dataArray : currentAsset,
                assetId: arg.assetId,
                addNew : false
            }
        }
    }
);

export const GPSAndSensorsReducerSlice = createSlice({
    name: 'GPSAndSensors',
    initialState: { 
        isMapPresent : false,
        assetGpsSensorData : [] as GpsSensorData[],
        GpsSensorData : [] as GpsSensorData[]
    },
    reducers: {
        remove: (state: any) => {
            state.isMapPresent = false;
            state.assetGpsSensorData = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addGPSAndSensorsAsync.fulfilled, (state: any, { payload }) => {
            let stateGpsSensorData : GpsSensorData[] = JSON.parse(JSON.stringify(state.GpsSensorData));
            if(payload.addNew){
                payload?.dataArray?.forEach((x:GpsSensorData) => stateGpsSensorData.push(x))
                state.GpsSensorData = stateGpsSensorData;
                let assetGpsSensorData = stateGpsSensorData.filter((x:GpsSensorData)=> x.assetId == payload.assetId);
                if(assetGpsSensorData.length>0){
                    state.isMapPresent = true;
                    state.assetGpsSensorData = assetGpsSensorData;
                }
            }
            else if(!payload.addNew){
                if(payload.dataArray.length>0){
                    state.isMapPresent = true;
                    state.assetGpsSensorData = payload.dataArray
                }
            }
        });
    }
});

const getPromiseData = async (allFilesSorted: any[]) => {
    const promises: any = [];
    let listGPSAndSensors : GpsSensorData[] = [];
    allFilesSorted?.forEach((fileData: any) => {
        promises.push(
            new Promise((resolve, reject) => {
                collectGpsData(fileData,resolve);
            })
        ); 
    })
    await Promise.all(promises).then((messages) => {
        listGPSAndSensors = gpsSensorParser(messages.filter(x=> {if(x){return x}}));
    }).catch((e) => {
        console.log("error fetch gps", e)
    });
    return listGPSAndSensors;
};

const collectGpsData = (fileData: any, resolve: any) => {
    let url:any  = `/Files/download/${fileData.filesId}/${fileData.accessCode}`
    FileAgent.getDownloadFileUrl(url).then((response: string) => response).then(async (response: any) => {
        let dataPromise = downloadFileFromBlob(response);
        dataPromise.then((data:any)=>
        {
            if(data){
                return {assetId: fileData.assetId, filesId: fileData.filesId, sequence: fileData.sequence, recording: fileData.recording, downloadedData: data, preBuffering: fileData.preBuffering};
            }
        }
        ).then((data:any)=>
        {
            resolve(data)
        }
        );
    });
};

const downloadFileFromBlob = async (downloadUri: any) => {
    const blobSasUrl = downloadUri;
    const containerWithFile = blobSasUrl.substring(blobSasUrl.indexOf('.net') + 5, blobSasUrl.indexOf('?'));
    const sasurl = blobSasUrl.replace(containerWithFile, '')
    const blobServiceClient = new BlobServiceClient(sasurl);

    const fc = containerWithFile.replaceAll('%2F', '/');
    const containerName = fc.replace(fc.substring(fc.lastIndexOf('/')), '');//get container name only
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const fileName = fc.substring(fc.lastIndexOf('/') + 1);
    const blobClient = containerClient.getBlobClient(fileName);
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded: any = await blobToString(await downloadBlockBlobResponse.blobBody);
    if (downloaded) {
        let downloadedData = downloaded.replace(/'/g, '"');
        return downloadedData;
    }
}

const blobToString = async (blob: any) => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onloadend = (ev) => {
        if (ev) {
            resolve(ev.target?.result);
        }
        };
        fileReader.onerror = reject;
        fileReader.readAsText(blob);
    });
}

const getUnixTimewithZeroinMillisecond = (time: number) => {
    let firsthalf = time.toString().substring(0, 10);
    let last3digits = time.toString().substring(10);
    if (Number(last3digits) > 0) {
        let Nlast3digits = "000";
        return Number(firsthalf + Nlast3digits);
    }
    return time;
}

const gpsSensorParser = (listObj: any) : GpsSensorData[] => {
    let listGPSAndSensors : GpsSensorData[] = [];
    for (let index = 0; index < listObj.length; index++) {
      let tempGPSAndSensors: GPSAndSensors = {
        GPS : [],
        Sensors : [],
        IsNmeaParser : false
      }
      let obj = listObj[index];
      let firstLine : string = obj.downloadedData.split('\n').shift();
      let isBodyWorn = firstLine.includes('$');
      if(isBodyWorn){
        tempGPSAndSensors = {
          GPS : parseNmea(obj.downloadedData,new Date(obj.recording.started),obj.preBuffering),
          Sensors : [],
          IsNmeaParser : true
        }
      }
      else{
        let GPSAndSensorsParse = JSON.parse(obj.downloadedData);
        tempGPSAndSensors = {
          GPS : GPSAndSensorsParse.GPS,
          Sensors : GPSAndSensorsParse.Sensors,
          IsNmeaParser : false
        }
      }

      let gpsdata = tempGPSAndSensors.GPS;
      let sensorsData = tempGPSAndSensors.Sensors;

      gpsdata.forEach((x: any) => {
        x.logTime = getUnixTimewithZeroinMillisecond(new Date(x.logTime).getTime());
      });

      sensorsData.forEach((x: any) => {
        x.logTime = getUnixTimewithZeroinMillisecond(new Date(x.logTime).getTime());
      });

      gpsdata = gpsdata.filter((x:any) => !(x.lat == 0 && x.lon == 0) && x.error > 0);

      let distinctgpsdata = gpsdata.filter((value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
          t.logTime === value.logTime
        )));

      let distinctsensorsData = sensorsData.filter((value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
        t.logTime === value.logTime
      )));

      listGPSAndSensors.push({assetId: obj.assetId, filesId: obj.filesId, sequence: obj.sequence, recording: obj.recording, gps: distinctgpsdata, sensors: distinctsensorsData, isNmeaParser: tempGPSAndSensors.IsNmeaParser});
    }
    return listGPSAndSensors;
}

export default GPSAndSensorsReducerSlice;
export const { remove: removeGPSAndSensorsAction} = GPSAndSensorsReducerSlice.actions;
