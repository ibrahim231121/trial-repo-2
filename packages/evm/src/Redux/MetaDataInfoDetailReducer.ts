import { createSlice, createAsyncThunk,PayloadAction } from '@reduxjs/toolkit';
import { EvidenceAgent } from '../utils/Api/ApiAgent';
import { Asset } from '../utils/Api/models/EvidenceModels';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import { BlockLockedAssets } from '../Application/Assets/utils/constants';
import { typeOfAudioAssetToInclude, typeOfDocAssetToInclude, typeOfImageAssetToInclude, typeOfOtherAssetToInclude, typeOfVideoAssetToInclude } from '../Application/Assets/Detail/AssetDetailsTemplate';
import moment from 'moment';
export interface Metadatainfo {
    owners: any[];
    unit: number[];
    checksum: number[];
    capturedDate: any;
    duration: string;
    size: string;
    retention: string;
    categories: any[];
    categoriesForm: string[];
    id: any;
    assetName: any;
    typeOfAsset: any;
    status: any;
    camera: any;
}
export const addMetaDataInfoAsync: any = createAsyncThunk(
  'getEvidence',
  async (arg: any) => {
    let evidenceId = arg;
      return EvidenceAgent.getEvidence(evidenceId)
            .then((response: any) => response)
            .catch((error: any) => {
                console.error(error.response.data);
            });
  }
);
export const metadatainfoDetailSlice = createSlice({
  name: 'metadatainfoDetailSlice',
  initialState: { 
      isAssetDetailPage : false,
      metadataInfoState: {} as Metadatainfo,
      currentAssetId : 0
  },
  reducers: {
          setAssetIdMatadataInfo: (state: any , action: any) => {
              if(action.payload){
                state.currentAssetId = action.payload;
              }
          },
          setIsAssetDetailPage: (state: any , action: any) => {
            state.isAssetDetailPage = action.payload;
          },
          setmetadatainfoValue: (state: any , action: PayloadAction<Metadatainfo>) => {
              if(action.payload){
                let temp : Metadatainfo = action.payload;
                state.metadataInfoState = temp
              }
          }
  },
  extraReducers: (builder) => {
    builder.addCase(addMetaDataInfoAsync.fulfilled, (state: any, { payload }) => {
      let response = payload;
      const cookies = new Cookies();
      const decoded: any = jwt_decode(cookies.get("access_token"));
      const typeOfAssetToInclude = [...typeOfVideoAssetToInclude, ...typeOfDocAssetToInclude, ...typeOfImageAssetToInclude, ...typeOfAudioAssetToInclude, ...typeOfOtherAssetToInclude];
      
      let assetListTemp: Asset[] = [response.assets.master];
      assetListTemp = [...assetListTemp, ...response.assets.children];    
      /**
       *! Locked child asset only be rendered if user has 'Permission' or asset is owned by user as 'Search Type' is 'ViewOwnAssets'.
        */
      const assets = BlockLockedAssets(decoded, '', assetListTemp, "AssetDetailsTemplate");
      let categories: any[] = [];
      response.categories.forEach((x: any) => {
        let formDatas: any[] = [];
        x.formData.forEach((y: any) => {
          y.fields.forEach((z: any) => {
            let formData = {
              key: z.key,
              value: z.value
            }
            formDatas.push(formData);
          })
        })
        categories.push({
          name: x.name,
          formDatas: formDatas
        })
      });
      let assetMetadata: any = assets.find((x:any) => x.id == parseInt(state.currentAssetId));
      let owners: any[] = assetMetadata.owners ? assetMetadata.owners.map((x: any) => (x.record.find((y: any) => y.key == "UserName")?.value) ?? "") : [];
      let unit: number[] = [assetMetadata.unitId];
      let checksum: number[] = assetMetadata.files.map((x: any) => x.checksum.checksum);
      let size = assetMetadata.files.filter((x: any) => typeOfAssetToInclude.includes(x.type)).reduce((a: any, b: any) => a + b.size, 0)
      let categoriesForm: string[] = response.categories.map((x: any) => x.record.cmtFieldName);
      let tempMetadataInfo : Metadatainfo = {
        owners: owners,
        unit: unit,
        capturedDate: moment(assetMetadata.recording.started).format(
          "MM / DD / YY @ HH: mm: ss"
        ),
        checksum: checksum,
        duration: milliSecondsToTimeFormat(new Date(assetMetadata.duration)),
        size: formatBytes(size, 2),
        retention: retentionSpanText(response.holdUntil, response.expireOn) ?? "",
        categories: categories,
        categoriesForm: categoriesForm,
        id: assetMetadata.id,
        assetName: assetMetadata.name,
        typeOfAsset: assetMetadata.files[0]?.type,
        status: assetMetadata.status,
        camera: assetMetadata.camera ?? ""
      };
      state.metadataInfoState = tempMetadataInfo;
    });
  }
});
export default metadatainfoDetailSlice;
export const { setmetadatainfoValue: setmetadatainfoValue, 
  setAssetIdMatadataInfo: setAssetIdMatadataInfo, 
  setIsAssetDetailPage: setIsAssetDetailPage} = metadatainfoDetailSlice.actions;
const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
}
const milliSecondsToTimeFormat = (date: Date) => {
  let numberFormatting = padTo2Digits(date.getUTCHours()) + ":" + padTo2Digits(date.getUTCMinutes()) + ":" + padTo2Digits(date.getUTCSeconds());
  let hourFormatting = date.getUTCHours() > 0 ? date.getUTCHours() : undefined
  let minuteFormatting = date.getUTCMinutes() > 0 ? date.getUTCMinutes() : undefined
  let secondFormatting = date.getUTCSeconds() > 0 ? date.getUTCSeconds() : undefined
  let nameFormatting = (hourFormatting ? hourFormatting + " Hours, " : "") + (minuteFormatting ? minuteFormatting + " Minutes, " : "") + (secondFormatting ? secondFormatting + " Seconds" : "")
  return numberFormatting + " (" + nameFormatting + ")";
}
const formatBytes = (bytes: number, decimals: number = 2) => {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
const AssetRetentionFormat = (dateTime: Date, isEvidenceRelations? : boolean) => {
  const dateTimeObj = moment(dateTime).local();
  if (dateTime === null) return 'Error retrieving login data';
  return CalculateRetentionSpan(dateTimeObj,isEvidenceRelations);
}
const CalculateRetentionSpan = (expiration: moment.Moment, isEvidenceRelations? : boolean): string => {
  const now = moment().local();
  if (now < expiration || isEvidenceRelations == true) {
      const differenceInString = RetentionDateTimeFormatter(now, expiration);
      return differenceInString;
  }
  return 'Expired';
}
const RetentionDateTimeFormatter = (now :  moment.Moment, expiration: moment.Moment) => {
  const difference = moment.duration(expiration.diff(now));
  const diffInDays = Math.floor(difference.asDays());
  const diffInHours = difference.asHours() - (diffInDays * 24);
  let differenceInString = "";
  let years, months, days: number;
  switch (true) {
      case (diffInDays > 365): //NOTE: Year Case.
          years = Math.floor(diffInDays / 365);
          months = Math.floor(diffInDays / 30.42);
          differenceInString = years + " Year(s) " + " " + (months > 0 ? months + " Month(s)" : "");
          break;
      case (diffInDays <= 365 && diffInDays > 31): //NOTE: Months Case.
          months = Math.floor(diffInDays / 30.42);
          days = Math.floor(diffInDays - (months * 30.42));
          differenceInString = months + " Month(s)" + " " + (days > 0 ? days + " Day(s)" : "");
          break;
      case (diffInDays <= 31 && diffInDays > 0): //NOTE: Days Case.
          differenceInString = diffInDays + " Day(s) " + " " + (diffInHours > 0 ? Math.ceil(diffInHours) + " Hour(s) " : "");
          break;
      case (diffInDays <= 0 && Math.floor(diffInHours) > 0): //NOTE: Hours Case, checking either difference in hours is greater than absolute 0.
          differenceInString = Math.ceil(diffInHours) + " Hour(s) ";
          break;
      default://NOTE: Minutes Case.
          differenceInString = " < 1 Hour ";
  }
  return differenceInString;
}
const retentionSpanText = (holdUntil?: Date, expireOn?: Date) => {//
  if (holdUntil) {
    return AssetRetentionFormat(holdUntil);
  }
  else if (expireOn) {
    return AssetRetentionFormat(expireOn);
  }
}