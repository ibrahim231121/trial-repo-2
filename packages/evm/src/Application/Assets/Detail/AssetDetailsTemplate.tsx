import {
  CBXLink,
  CRXTooltip
} from "@cb/shared";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux"; 
import { useLocation } from "react-router";
import VideoPlayerBase from "../../../components/MediaPlayer/VideoPlayerBase";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { RootState } from "../../../Redux/rootReducer";
import { EvidenceAgent, FileAgent } from "../../../utils/Api/ApiAgent";
import { Asset, Evidence } from "../../../utils/Api/models/EvidenceModels";
import "./AssetDetailTabsMenu.scss";
import "./assetDetailTemplate.scss";
import { BlobServiceClient } from "@azure/storage-blob";
import { AssetRetentionFormat } from "../../../GlobalFunctions/AssetRetentionFormat";
import { getAssetTrailInfoAsync } from "../../../Redux/AssetDetailsReducer";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { urlList, urlNames } from "../../../utils/urlList";
import ActionMenu, { retentionSpanText } from "../AssetLister/ActionMenu";
import { ActionMenuPlacement } from "../AssetLister/ActionMenu/types";
import { assetdata, AssetReformated } from "./AssetDetailsTemplateModel";
import { AssetDetailRouteStateType, EvidenceObjectToPassInActionMenu } from "../AssetLister/AssetDataTable/AssetDataTableModel";
import { SearchModel } from "../../../utils/Api/models/SearchModel";
import { ReFormatPropsForActionMenu } from "../AssetLister/AssetDataTable/Utility";
import { BlockLockedAssets } from "../utils/constants";
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import AssetDetailTabs from "./AssetDetailTabs";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import { CRXToaster } from "@cb/shared";
import AssetsDisplayTabs from "./AssetsDisplayTabs";
import { useHistory } from "react-router-dom";
import { changePrimaryVideoSoftReload, setAssetDetailBottomTabs } from "../../../Redux/VideoPlayerSettingsReducer";
import { setIsPrimaryAsset } from "../../../Redux/AssetDetailPrimaryBreadcrumbReducer";
import { RelatedAssetsCreator } from "../../../Redux/FilteredRelatedAssetsReducer";
import {setAssetSeeMore} from "../../../Redux/AssetSeeMoreReducer";
import parseNmea from "../utils/GpsParse";
import { GPSAndSensors, GpsSensorData } from "../../../utils/Api/models/GpsModel";
import { addGPSAndSensorsAsync, removeGPSAndSensorsAction } from "../../../Redux/VideoPlayerGPSAndSensorsReducer";
import { getCategoryAsync } from "../../../Redux/categoryReducer";
import { Metadatainfo, setAssetIdMatadataInfo, setIsAssetDetailPage, setmetadatainfoValue } from "../../../Redux/MetaDataInfoDetailReducer";

export type FileData = {
  filename: string,
  fileurl: string,
  fileduration: number,
  downloadUri: string,
  typeOfAsset: string
};

export const typeOfVideoAssetToInclude = ["Video", "AudioOnly"];
export const typeOfDocAssetToInclude = ["PDFDoc", "WordDoc", "Text", "ExcelDoc", "PowerPointDoc", "CSVDoc"];
export const typeOfOtherAssetToInclude = ["DLL", "Exe", "Msi", "bin", "BW2Certificate", "Zip", "Unknown", "Others"];
export const typeOfImageAssetToInclude = ["Image"];
export const typeOfAudioAssetToInclude = ["Audio"];
const AssetDetailsTemplate = () => {
  const { state } = useLocation<AssetDetailRouteStateType>();
  const evidenceId: number = state.evidenceId;
  const [assetId, setAssetId] = React.useState<string>(state.assetId.toString());
  const [assetName, setAssetName] = React.useState<string>(state.assetName);
  const evidenceSearchObject: SearchModel.Evidence = state.evidenceSearchObject;
  let assetObj: AssetReformated = {
    categories: [],
    owners: [],
    unit: [],
    capturedDate: "",
    checksum: [],
    duration: "",
    size: "",
    retention: "",
    categoriesForm: [],
    typeOfAsset: "",
    status: "",
    camera: ""
  };
  const history = useHistory();
  const toasterRef = React.useRef<typeof CRXToaster>(null);
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const decoded: any = jwt_decode(cookies.get("access_token"));

  const [detailContent, setDetailContent] = useState<boolean>(false);
  const [uploadedOn, setUploadedOn] = React.useState<string>("");

  const [allDataRetrieved, setAllDataRetrieved] = React.useState<boolean>(false);

  const typeOfAssetToInclude = [...typeOfVideoAssetToInclude, ...typeOfDocAssetToInclude, ...typeOfImageAssetToInclude, ...typeOfAudioAssetToInclude, ...typeOfOtherAssetToInclude];
  const [masterFileData, setMasterFileData] = React.useState<FileData[]>([]);
  const [childFileData, setChildFileData] = React.useState<FileData[]>([]);
  const [relatedFileData, setRelatedFileData] = React.useState<FileData[]>([]);
  const [evidence, setEvidence] = React.useState<Evidence>();
  const [currentAsset, setCurrentAsset] = React.useState<Asset>();
  const [formattedData, setFormattedData] = React.useState<assetdata[]>([]);
  const [sensorsDataJson, setSensorsDataJson] = React.useState<any>();
  const [assetsList, setAssetList] = React.useState<Asset[]>([]);
  const [fileState, setFileState] = React.useState<string>("");
  const [masterAssetId, setMasterAssetId] = React.useState<number>(0);
  const assetBucketBasketIsOpen: any = useSelector((state: RootState) => state.assetBucketBasketSlice.isOpen);
  const RestrictEffectOccured = useSelector((state: RootState) => state.ActionMenuEffectSlice.RestrictEffect);
  const [relatedAssetArray, setRelatedAssetArray] = React.useState<any>([]);
  const [relatedAssetRetrived, setRelatedAssetRetrived] = React.useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = React.useState<boolean>(false);
  const [gpsSensorData, setGpsSensorData] = React.useState<any []>([]);
  const primaryVideoSoftReload = useSelector((state: RootState) => state.videoPlayerSettingsSlice.primaryVideoSoftReload);
  const  filteredRelatedAssets =  useSelector((state : RootState)  => state.filteredRelatedAssetsSlice)

  useEffect(() => {
    dispatch(setIsAssetDetailPage(true));
  }, []);
  
  useEffect(() => {
    fetchEvidenceAgentApi();
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, [RestrictEffectOccured]);

  useEffect(() => {
    dispatch(setAssetIdMatadataInfo(Number(assetId)))
    if (primaryVideoSoftReload.needReload) {
      dispatch(changePrimaryVideoSoftReload({
        primaryVideoSoftReload: {
          assetId: "0",
          assetName: "",
          needReload: false
        }
      }))
      fetchEvidenceAgentApi();
      return () => {
        dispatch(enterPathActionCreator({ val: "" }));
      }
    }
    dispatch(getAssetTrailInfoAsync({ evidenceId: evidenceId, assetId: assetId }));
  }, [assetId]);


  useEffect(() => {
    if (primaryVideoSoftReload.needReload) {
      setAssetId(primaryVideoSoftReload.assetId)
      setAssetName(primaryVideoSoftReload.assetName)
    }
  }, [primaryVideoSoftReload.needReload]);

  const getFormattedData = (row: any) => {
    let rowdetail: assetdata[] = [];
    let masterAsset = row.assets.master;
    const assetEvidenceId = row?.id;
    const id = masterAsset.id;
    const unitId = masterAsset.unitId;
    const typeOfAsset = masterAsset.typeOfAsset;
    const name = masterAsset.name;
    const status = masterAsset.files[0]?.filesId > 0 ? "Available" : "";
    const camera = masterAsset.camera;
    const file = masterFileData;

    const masterduration = masterAsset.duration;
    let recording = masterAsset.recording;
    const bookmarks = masterAsset.bookMarks ?? [];
    const notes = masterAsset.notes ?? [];
    const buffering = masterAsset.buffering;
    const bufferingpost = buffering ? buffering?.post : 0;
    const bufferingpre = buffering ? buffering?.pre : 0;
    let unitName = getUnitName(masterAsset);
    if (recording) {
      recording = {
        ...recording,
        ended: new Date(new Date(recording.ended).getTime() + bufferingpost),
        started: new Date(new Date(recording.started).getTime() - bufferingpre),
      }
    }
    rowdetail.push({ id: id, files: file, assetduration: masterduration, assetbuffering: buffering, recording: recording, bookmarks: bookmarks, unitId: unitId, typeOfAsset: typeOfAsset, name: name, notes: notes, camera: camera, status: status, evidenceId: assetEvidenceId, unitName: unitName });
    let children = getSubFormattedData(row.assets.children, childFileData, row?.id);
    rowdetail = [...rowdetail, ...children];
    // if(rowdetail.filter((x: any) => x.status == "Available").length >0){
    //   let stringifyRelatedAsset1 = JSON.parse(JSON.stringify(relatedAssetArray));
    //   stringifyRelatedAsset1?.forEach((x:any)=>
    //     {
    //       let relatedAssets1 = getSubFormattedData([x.asset], relatedFileData, x.evidenceId)
    //       rowdetail = [...rowdetail, ...relatedAssets1];
    //     }
    //   )
    // }
    return rowdetail
  }


  const getSubFormattedData = (assets: any[], childFileData: any[], assetEvidenceId?: number) => {
    let children: assetdata[] = assets.map((template: any) => {
      if (template.recording) {
        template.recording = {
          ...template.recording,
          ended: new Date(new Date(template.recording?.ended).getTime() + template.buffering?.post),
          started: new Date(new Date(template.recording?.started).getTime() - template.buffering?.pre),
        }
      }
      let temp: assetdata = {
        id: template.id,
        files: childFileData.filter((x: any) => template.name == x.filename),
        assetduration: template.duration,
        assetbuffering: template.buffering,
        recording: template.recording,
        bookmarks: template.bookMarks ?? [],
        unitId: template.unitId,
        typeOfAsset: template.typeOfAsset,
        name: template.name,
        notes: template.notes ?? [],
        camera: template.camera,
        status: template.files[0]?.filesId > 0 ? "Available" : "",
        evidenceId: assetEvidenceId,
        unitName: getUnitName(template)
      }
      return temp;
    })
    return children;
  }

  const getUnitName = (asset: any) => {
    let listOfKeyValue = asset?.unit?.record;
    let value = "";
    if (listOfKeyValue) { // get case
      if (listOfKeyValue && listOfKeyValue.length > 0) {
        listOfKeyValue.forEach((x: any) => {
          if (x.key == "Name") {
            value = x.value;
          }
        });
      }
    }
    return value;
  }

  useEffect(() => {
    if (evidence) {
      let masterasset = evidence.assets.master.files.filter(x => x.filesId > 0 && typeOfAssetToInclude.includes(x.type));
      let childrenAssets = evidence.assets.children.map(x => x.files[0]).filter(x => x?.filesId > 0 && typeOfAssetToInclude.includes(x?.type));
      let relatedAssets = relatedAssetArray?.map((x: any) => x.asset.files[0]).filter((x: any) => x?.filesId > 0 && typeOfAssetToInclude.includes(x?.type));
      let allDataRetrieved = (masterasset.length == masterFileData.length) && (childrenAssets.length == childFileData.length) && (relatedAssets?.length == relatedFileData.length);
      
      if (allDataRetrieved && relatedAssetRetrived) {
        setAllDataRetrieved(true);
        dispatch(setLoaderValue({ isLoading: false, message: "" }))
        let categories: any[] = [];
        evidence.categories.forEach((x: any) => {
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
        let assetMetadata: any = assetsList.find(x => x.id == parseInt(assetId));
        if(assetMetadata == undefined)
        {
          assetMetadata = relatedAssetArray?.find((x: any) => x.asset.id == assetId)?.asset
        }
        let owners: any[] = assetMetadata.owners ? assetMetadata.owners.map((x: any) => (x.record.find((y: any) => y.key == "UserName")?.value) ?? "") : [];
        let unit: number[] = [assetMetadata.unitId];
        let checksum: number[] = assetMetadata.files.map((x: any) => x.checksum.checksum);
        let size = assetMetadata.files.filter((x: any) => typeOfAssetToInclude.includes(x.type)).reduce((a: any, b: any) => a + b.size, 0)
        let categoriesForm: string[] = evidence.categories.map((x: any) => x.record.cmtFieldName);

        let tempMetadataInfo : Metadatainfo = {
          owners: owners,
          unit: unit,
          capturedDate: moment(assetMetadata.recording.started).format(
            "MM / DD / YY @ HH: mm: ss"
          ),
          checksum: checksum,
          duration: milliSecondsToTimeFormat(new Date(assetMetadata.duration)),
          size: formatBytes(size, 2),
          retention: retentionSpanText(evidence.holdUntil, evidence.expireOn) ?? "",
          categories: categories,
          categoriesForm: categoriesForm,
          id: assetMetadata.id,
          assetName: assetMetadata.name,
          typeOfAsset: assetMetadata.files[0]?.type,
          status: assetMetadata.status,
          camera: assetMetadata.camera ?? ""
        };
        dispatch(setmetadatainfoValue(tempMetadataInfo));
        updatePrimaryAsset();
      }
    }
  }, [evidence, masterFileData, childFileData, relatedFileData, relatedAssetRetrived]);

  useEffect(() => {
    return () => {
      removeOnPageLeave();
      removeCurrentGPS();
    }
  }, [])

  const removeOnPageLeave  = () => {
    dispatch(setIsPrimaryAsset({isPrimaryAsset: false}));
    dispatch(setIsAssetDetailPage(false));
  }
  const removeCurrentGPS = () => {
    dispatch(removeGPSAndSensorsAction());
  }
  const updatePrimaryAsset = (assetIdTmp?: string) => {
    const data = getFormattedData(evidence);
    let assetIdNS = assetId;
    if (assetIdTmp) {
      assetIdNS = assetIdTmp;
      setAssetId(assetIdTmp);
      var assetObj = data.find(x => x.id == parseInt(assetIdTmp))
      dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + assetObj?.name }));
    }
    dispatch(setIsPrimaryAsset({isPrimaryAsset: parseInt(assetIdNS) == masterAssetId}));
    if (fileState != "Deleted") { // File state from Azure deleted - do not render video player - page crashes - ad hoc fix - need to show pop up 
      let updatedData = data.filter(x => x.id == parseInt(assetIdNS));
      let videoAsset = (typeOfVideoAssetToInclude.includes(updatedData[0]?.typeOfAsset) || (updatedData[0]?.typeOfAsset == "AudioOnly" ? updatedData[0]?.files?.some(y => typeOfAudioAssetToInclude.includes(y.typeOfAsset)) : false));
      // let docAsset = typeOfDocAssetToInclude.includes(updatedData[0]?.files[0]?.typeOfAsset);
      if (assetIdTmp && (videoAsset /*|| docAsset*/)) {
        if (evidence) {
          const securityDescriptorsFromSearchResponse : any = evidenceSearchObject.securityDescriptors;
          evidence.securityDescriptors = securityDescriptorsFromSearchResponse;
        }
        history.push(urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url, {
          evidenceId: evidenceId,
          assetId: updatedData[0].id,
          assetName: updatedData[0].name,
          evidenceSearchObject: evidence
        })
        history.go(0);
      }
      if (data[0]?.id != parseInt(assetIdNS)) {
        updatedData = [...updatedData, ...data.filter(x => x.id != parseInt(assetIdNS))]
        setFormattedData(updatedData);
      }
      else {
        setFormattedData(data);
      }
    }
  }

  useEffect(() => {
    if (evidence && relatedAssetArray) {
      getMasterAssetFile(evidence?.assets.master.files.filter(x => x.filesId > 0 && x.type !== "GPS"))
      getChildAssetFile(evidence?.assets.children.filter(x => x?.files[0]?.filesId > 0))
      getRelatedAssetFile(relatedAssetArray.filter((x: any) => x?.asset.files[0]?.filesId > 0))
      
      //GPS WORK
      getGpsSensorData(evidence?.assets.master, evidence?.assets.children)
    }
  }, [evidence, relatedAssetArray]);

  const getMasterAssetFile = (dt: any) => {
    dt?.map((template: any) => {
      let url1:any  = `/Files/${template.filesId}/${template.accessCode}`
      FileAgent.getFile(url1).then((response) => {
        setFileState(response.state)
        if (template.type != "GPS") {
          let uploadCompletedOnFormatted = response.history.uploadCompletedOn ? moment(response.history.uploadCompletedOn).format("MM / DD / YY @ HH: mm: ss") : "";
          setUploadedOn(uploadCompletedOnFormatted)
        }
      });
      let url:any  = `/Files/download/${template.filesId}/${template.accessCode}`
      FileAgent.getDownloadFileUrl(url).then((response: string) => response).then((response: any) => {
        setMasterFileData((previousState: FileData[]) => {
          const isExist = previousState.find(x => x.filename === template.name);
          if (!isExist) {
            return [...previousState,
            {
              filename: template.name,
              fileurl: template.url,
              fileduration: template.duration,
              typeOfAsset: template.type,
              downloadUri: response,
              recording: template.recording,
            }];
          }
          return [...previousState];
        });
      }).catch(() => {
        setMasterFileData((previousState: FileData[]) => {
          const isExist = previousState.find(x => x.filename === template.name);
          if (!isExist) {
            return [...previousState,
            {
              filename: template.name,
              fileurl: template.url,
              fileduration: template.duration,
              typeOfAsset: template.type,
              downloadUri: "",
              recording: template.recording,
            }];
          }
          return [...previousState];
        });
      });
    })
  }
  const getChildAssetFile = (dt: any) => {
    let fileDownloadUrls: any = [];
    
    dt?.map((ut: Asset) => {
      ut?.files.filter((x: any)=> x.type !== "GPS").map((template: any) => {
        let url:any  = `/Files/download/${template.filesId}/${template.accessCode}`
        FileAgent.getDownloadFileUrl(url).then((response: string) => response).then((response: any) => {
          fileDownloadUrls.push({
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            typeOfAsset: template.type,
            downloadUri: response,
            recording: template.recording,
          })
          setChildFileData([...fileDownloadUrls])
        }).catch(() => {
          fileDownloadUrls.push({
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            typeOfAsset: template.type,
            downloadUri: "",
            recording: template.recording,
          })
          setChildFileData([...fileDownloadUrls])
        })
      })
    })
  }
  const getRelatedAssetFile = (dt: any) => {
    let fileDownloadUrls: any = [];
    dt?.map((ut: any) => {
      ut?.asset.files.filter((x: any)=> x.type !== "GPS").map((template: any) => {
        let url:any  = `/Files/download/${template.filesId}/${template.accessCode}`
        FileAgent.getDownloadFileUrl(url).then((response: string) => response).then((response: any) => {
          fileDownloadUrls.push({
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            typeOfAsset: template.type,
            downloadUri: response,
            recording: template.recording,
          })
          setRelatedFileData([...fileDownloadUrls])
        }).catch(() => {
          fileDownloadUrls.push({
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            typeOfAsset: template.type,
            downloadUri: "",
            recording: template.recording,
          })
          setRelatedFileData([...fileDownloadUrls])
        })
      })
    })
  }
  const getGpsSensorData = async (master: Asset, childern: Asset[]) => {
    let files : any[] = [];
    files = master.files.filter((x:any) => x.filesId > 0 && x.type == "GPS");
    if(files.length>0)
    {
      files[0].preBuffering = master.buffering.pre;
    }
    childern.forEach((child:Asset) =>
      {
        child.files.forEach((x:any) =>
          {
            if(x.filesId > 0 && x.type == "GPS"){
              x.preBuffering = child.buffering.pre;
              files.push(x);
            }
          }
        )
      }
    )
    let data = {
      files : files,
      assetId : assetId
    }
    dispatch(addGPSAndSensorsAsync(data));
  }

  const formatBytes = (bytes: number, decimals: number = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

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


  const fetchEvidenceAgentApi = () => {
    dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + assetName }));
    dispatch(setLoaderValue({ isLoading: true }))
   
    var rowId : any = state.evidenceId
    var filterRelatedAssetStore = filteredRelatedAssets.RelatedAsset.find((x: any) => Object.keys(x) == rowId);
    
    if (filterRelatedAssetStore) {
      var values: any = Object.values(filterRelatedAssetStore)[0]
      setRelatedAssetArray(values);
      setRelatedAssetRetrived(true)
    }
    else {
      EvidenceAgent.getRelatedAssets(evidenceId).then((resp) => {
        filterRelatedAssetData(resp, state.evidenceId);

      })
        .catch(() => {
         
        })
    }

    const filterRelatedAssetData = (resp: any, rowId: number) => {
      var ONE_HOUR = 60 * 60 * 1000;
      var currentDate: any = moment().utc();
      var RecordingEndedDate: any = moment(state.evidenceSearchObject.masterAsset.recordingEnded).toDate();
      if((currentDate - RecordingEndedDate) > ONE_HOUR ){
        
        dispatch(RelatedAssetsCreator({[`${rowId}`]: resp}));
        setRelatedAssetArray(resp);

      }
      else{
        setRelatedAssetArray(resp);
      }
      setRelatedAssetRetrived(true)
    }
 
    EvidenceAgent.getEvidence(evidenceId).then((response: Evidence) => {

      let assetListTemp: Asset[] = [response.assets.master];
      setMasterAssetId(response.assets.master.id);
      setIsPrimaryAsset(parseInt(assetId) == response.assets.master.id)
      assetListTemp = [...assetListTemp, ...response.assets.children];    
      /**
       *! Locked child asset only be rendered if user has 'Permission' or asset is owned by user as 'Search Type' is 'ViewOwnAssets'.
        */
      const assets = BlockLockedAssets(decoded, '', assetListTemp, "AssetDetailsTemplate");
      setAssetList(assets);
      setEvidence(response);
    }).catch(() => {
      dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
    });
    const getAssetUrl = "/Evidences/" + evidenceId + "/Assets/" + assetId;
    EvidenceAgent.getAsset(getAssetUrl).then((response: Asset) => setCurrentAsset(response));
  }

 


  const rowReformationMethodToPassInActionMenu = (): EvidenceObjectToPassInActionMenu => {
    const modifiedAssetArray: SearchModel.Asset[] = [];
    for (const i of assetsList) {
      const ownersArray: string[] = [];
      for (const owner of i.owners) {
        if (typeof owner !== "number") {
          ownersArray.push(owner.record.find(x => x.key === "UserName")?.value || "");
        }
      }
      const assetObj: SearchModel.Asset = {
        assetId: i.id,
        assetName: i.name,
        assetType: i.typeOfAsset,
        audioDevice: i.audioDevice!,
        camera: i.camera!,
        duration: i.duration,
        files: i.files,
        isOverlaid: i.isOverlaid,
        isRestrictedView: i.isRestrictedView,
        lock: i.lock,
        owners: ownersArray,
        postBuffer: i.buffering?.pre && 0,
        preBuffer: i.buffering?.pre && 0,
        recordedBy: [i.recordedByCSV || ""],
        recordingEnded: i.recording?.started.toString(),
        recordingStarted: i.recording?.ended && "",
        segmentCount: 1,
        size: 0,
        state: i.state,
        status: i.status,
        thumbnailUri: "",
        unit: ""
      };
      modifiedAssetArray.push(assetObj);
    }
    let objectToPass: any = { ...evidenceSearchObject };
    objectToPass.asset = [];
    objectToPass.asset = modifiedAssetArray;
    return ReFormatPropsForActionMenu(objectToPass, Number(assetId));
  }


  const showToastMsg = (obj: any) => {
    toasterRef.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
    if (obj.message !== undefined && obj.message !== "") {
      let notificationMessage: NotificationMessage = {
        title: t("Asset_Detail"),
        message: obj.message,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  };

  const seeMoreContainer : any = React.useRef(null);
  const [isAssetTabContainer , SetisAssetTabContainer] = useState<any>()

  const renderPlayerStyleSeeMore = (targetId : any, 
    _video_player_main_containers  : any,
     _video_player_screens  : any,
     _audio_player_screens  : any,
     _videoPlayerId  : any,
     _video_Multiview_Grid  : any) => {
    
    if(targetId === "detail_view" && isAudioActive == false  ) {
     
      isAssetTabContainer && (isAssetTabContainer.current.style.height = "calc(100vh - 240px)")
      seeMoreContainer && (seeMoreContainer.current.classList += " lessMoreDetailView_arrow")
      _video_player_main_containers && (_video_player_main_containers.style.background = "#fff")
      _videoPlayerId && (_videoPlayerId.style.background = "#000")
      _video_Multiview_Grid && (_video_Multiview_Grid.style.background = "#000")
      _video_player_screens && (_video_player_screens.classList.add("removeEXHeight"))
      _audio_player_screens && (_audio_player_screens.classList.add("removeEXHeight"))
      isAssetTabContainer && (isAssetTabContainer.current.classList.add("removeEXHeight"))
    }
    else if(targetId === "detail_view" && isAudioActive == true ) {
      seeMoreContainer && (seeMoreContainer.current.classList += " lessMoreDetailView_arrow")
      _audio_player_screens && (_audio_player_screens.classList.add("removeEXHeight"))
      _video_player_main_containers && (_video_player_main_containers.style.background = "#fff")
      _videoPlayerId && (_videoPlayerId.style.background = "#000")
      _video_Multiview_Grid && (_video_Multiview_Grid.style.background = "#000")
      _video_player_screens && (_video_player_screens.classList.add("removeEXHeight"))
      _video_player_screens && (_video_player_screens.classList.add("audioEnabled_seeLess"))
      isAssetTabContainer && (isAssetTabContainer.current.classList.add("removeEXHeight"))
    }
    else {
      
      isAssetTabContainer && (isAssetTabContainer.current.style.height = "calc(100vh - 150px)")
      seeMoreContainer && (seeMoreContainer.current.classList.remove("lessMoreDetailView_arrow"))
      _video_player_screens && (_video_player_screens.classList.remove("removeEXHeight"))
      _audio_player_screens && (_audio_player_screens.classList.remove("removeEXHeight"))
      _video_player_screens && (_video_player_screens.classList.remove("audioEnabled_seeLess"))
      _videoPlayerId && (_videoPlayerId.style.background = "#000")
      _video_Multiview_Grid && (_video_Multiview_Grid.style.background = "#000")
      isAssetTabContainer && (isAssetTabContainer.current.classList.remove("removeEXHeight"))
    }
  }
  const gotoSeeMoreView = (e: any, targetId: any) => {
    
    dispatch(setAssetSeeMore({ status: detailContent }));
    let detailContentTemp = detailContent == false ? true : false;
    setDetailContent(detailContentTemp);
    dispatch(setAssetDetailBottomTabs({assetDetailBottomTabs: detailContentTemp}))
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth'
    });

    const _video_player_main_containers : any = document.querySelector("._video_player_layout_main")
    const _video_player_screens: undefined | any = document.querySelector("#video-player-screens");
    const _audio_player_screens: undefined | any = document.querySelector("#audio-player-screens");
    const _videoPlayerId: undefined | any = document.querySelector("#crx_video_player");
    const _video_Multiview_Grid : undefined | any = document.querySelector("._Multiview_Grid")
    
    renderPlayerStyleSeeMore(targetId, 
      _video_player_main_containers,
       _video_player_screens,
       _audio_player_screens,
       _videoPlayerId,
       _video_Multiview_Grid
       )
  }

  const actionBucketClass = assetBucketBasketIsOpen ? "actionBucketIndex" : "";
  return (
    <div id="_asset_detail_view_idx" className="_asset_detail_view">
      <CRXToaster ref={toasterRef} />
      <div id="videoPlayer_with_category_view" className={`CRXAssetDetail ${actionBucketClass}`}>
        {/* <div className="asset_date_categories">
              <span><strong>{t("Captured Date")}</strong> : {metaData.capturedDate}</span>
              <span><strong>{t("Categories")}</strong> : {metaData.categoriesForm}</span>
            </div> */}
        {/** maria told me the its not showing here its should be come in meta data see panel */}
        <ActionMenu
          row={rowReformationMethodToPassInActionMenu()}
          actionMenuPlacement={ActionMenuPlacement.AssetDetail}
          showToastMsg={(obj: any) => showToastMsg(obj)}
          className="asset_detail_action_menu"
        />

        <CBXLink children="Exit" href={`${urlList.filter((item: any) => item.name === urlNames.assetSearchResult)[0].url}`} />
      </div>

      {allDataRetrieved && <AssetsDisplayTabs assetTabContainer={SetisAssetTabContainer}
        typeOfVideoAssetToInclude={typeOfVideoAssetToInclude}
        typeOfAudioAssetToInclude={typeOfAudioAssetToInclude}
        typeOfImageAssetToInclude={typeOfImageAssetToInclude}
        typeOfDocAssetToInclude={typeOfDocAssetToInclude}
        typeOfOtherAssetToInclude={typeOfOtherAssetToInclude}
        detailContent={detailContent} 
        setDetailContent={setDetailContent}
        setIsAudioActive={setIsAudioActive}
        formattedData={formattedData} evidenceId={evidenceId}
        sensorsDataJson={sensorsDataJson}
        updatePrimaryAsset={updatePrimaryAsset} assetId={assetId} 
        masterAssetId={masterAssetId} gpsSensorData={gpsSensorData}
        setAssetId={setAssetId}
        />}
      
      {detailContent
        && <div className="topBorderForDetail"></div>
      }
        
      <div ref={seeMoreContainer} className="_bottom_arrow_seeMore">
        {detailContent == false ?
              <button id="seeMoreButton" className="_angle_down_up_icon_btn seeMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "detail_view")} data-target="#detail_view">
                <CRXTooltip iconName="fas fa-chevron-down" placement="bottom" arrow={false} title="see more" />
              </button>
              :
              <button id="lessMoreButton" data-target="#root" className="_angle_down_up_icon_btn lessMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "root")}>
                <CRXTooltip iconName="fas fa-chevron-up" placement="bottom" arrow={false} title="see less" />
              </button>
            }
        </div>
     
            <AssetDetailTabs evidence={evidence} assetId={assetId} evidenceId={evidenceId} uploadedOn={uploadedOn} assetsList={assetsList} evidenceSearchObject={evidenceSearchObject} relatedAssets={relatedAssetArray} />


    </div>
  );
};

export default AssetDetailsTemplate;
