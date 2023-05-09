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
import ActionMenu from "../AssetLister/ActionMenu";
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

export type FileData = {
  filename: string,
  fileurl: string,
  fileduration: number,
  downloadUri: string,
  typeOfAsset: string
};

export const typeOfVideoAssetToInclude = ["Video"];
export const typeOfDocAssetToInclude = ["PDFDoc"];
export const typeOfOtherAssetToInclude = ["WordDoc", "Text", "ExcelDoc", "PowerPointDoc", "DLL", "Exe", "Msi", "bin", "BW2Certificate", "Zip", "GPS", "Unknown", "Others", "CSVDoc"];
export const typeOfImageAssetToInclude = ["Image"];
export const typeOfAudioAssetToInclude = ["Audio", "AudioOnly"];
const AssetDetailsTemplate = () => {
  const { state } = useLocation<AssetDetailRouteStateType>();
  const evidenceId: number = state.evidenceId;
  const [assetId, setAssetId] = React.useState<string>(state.assetId.toString());
  const assetName: string = state.assetName;
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
  const [openMap, setOpenMap] = React.useState<boolean>(false);
  const [uploadedOn, setUploadedOn] = React.useState<string>("");

  const [allDataRetrieved, setAllDataRetrieved] = React.useState<boolean>(false);

  const typeOfAssetToInclude = [...typeOfVideoAssetToInclude, ...typeOfOtherAssetToInclude, ...typeOfImageAssetToInclude, ...typeOfAudioAssetToInclude];
  const [masterFileData, setMasterFileData] = React.useState<FileData[]>([]);
  const [childFileData, setChildFileData] = React.useState<FileData[]>([]);
  const [gpsFileData, setGpsFileData] = React.useState<any[]>([]);
  const [evidence, setEvidence] = React.useState<Evidence>();
  const [currentAsset, setCurrentAsset] = React.useState<Asset>();
  const [formattedData, setFormattedData] = React.useState<assetdata[]>([]);
  const [metaData, setMetaData] = React.useState<AssetReformated>(assetObj);
  const [gpsJson, setGpsJson] = React.useState<any>();
  const [sensorsDataJson, setSensorsDataJson] = React.useState<any>();
  const [assetsList, setAssetList] = React.useState<Asset[]>([]);
  const [fileState, setFileState] = React.useState<string>("");
  const [masterAssetId, setMasterAssetId] = React.useState<number>(0);
  const [isPrimaryAsset, setIsPrimaryAsset] = React.useState<boolean>(false);
  const assetBucketBasketIsOpen: any = useSelector((state: RootState) => state.assetBucketBasketSlice.isOpen);
  const RestrictEffectOccured = useSelector((state: RootState) => state.ActionMenuEffectSlice.RestrictEffect);

  useEffect(() => {
    fetchEvidenceAgentApi();
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, [RestrictEffectOccured]);

  useEffect(() => {
    if (gpsFileData && gpsFileData.length > 0) {
      const blobClient = getBlobClients(gpsFileData[0].downloadUri);
      gpsAndOverlayData(blobClient);
    }
  }, [gpsFileData]);

  const getFormattedData = (row: any) => {
    let rowdetail: assetdata[] = [];
    let masterAsset = row.assets.master;

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
    if (recording) {
      recording = {
        ...recording,
        ended: new Date(new Date(recording.ended).getTime() + bufferingpost),
        started: new Date(new Date(recording.started).getTime() - bufferingpre),
      }
    }
    rowdetail.push({ id: id, files: file, assetduration: masterduration, assetbuffering: buffering, recording: recording, bookmarks: bookmarks, unitId: unitId, typeOfAsset: typeOfAsset, name: name, notes: notes, camera: camera, status: status });
    let children: assetdata[] = row.assets.children.map((template: any) => {
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
        status: template.files[0]?.filesId > 0 ? "Available" : ""
      }
      return temp;
    });
    rowdetail = [...rowdetail, ...children];
    return rowdetail
  }

  useEffect(() => {
    if (evidence) {
      let masterasset = evidence.assets.master.files.filter(x => x.filesId > 0 && typeOfAssetToInclude.includes(x.type));
      let childrenAssets = evidence.assets.children.map(x => x.files[0]).filter(x => x?.filesId > 0 && typeOfAssetToInclude.includes(x?.type));
      let allDataRetrieved = (masterasset.length == masterFileData.length) && (childrenAssets.length == childFileData.length);

      if (allDataRetrieved) {
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
        let owners: any[] = assetMetadata.owners.map((x: any) => (x.record.find((y: any) => y.key == "UserName")?.value) ?? "");
        let unit: number[] = [assetMetadata.unitId];
        let checksum: number[] = assetMetadata.files.map((x: any) => x.checksum.checksum);
        let size = assetMetadata.files.filter((x: any) => typeOfAssetToInclude.includes(x.type)).reduce((a: any, b: any) => a + b.size, 0)
        let categoriesForm: string[] = evidence.categories.map((x: any) => x.record.cmtFieldName);

        setMetaData({
          ...metaData,
          owners: owners,
          unit: unit,
          capturedDate: moment(evidence.createdOn).format(
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
          typeOfAsset: assetMetadata.typeOfAsset,
          status: assetMetadata.status,
          camera: assetMetadata.camera ?? ""
        });
        updatePrimaryAsset();
      }
    }
  }, [evidence, masterFileData, childFileData]);

  const updatePrimaryAsset = (assetIdTmp?: string) => {
    const data = getFormattedData(evidence);
    let assetIdNS = assetId;
    if (assetIdTmp) {
      assetIdNS = assetIdTmp;
      setAssetId(assetIdTmp);
      var assetObj = data.find(x => x.id == parseInt(assetIdTmp))
      dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + assetObj?.name }));
    }
    setIsPrimaryAsset(parseInt(assetIdNS) == masterAssetId)
    if (fileState != "Deleted") { // File state from Azure deleted - do not render video player - page crashes - ad hoc fix - need to show pop up 
      let updatedData = data.filter(x => x.id == parseInt(assetIdNS));
      if (assetIdTmp && (typeOfVideoAssetToInclude.includes(updatedData[0].typeOfAsset) || (updatedData[0].typeOfAsset == "AudioOnly" ? updatedData[0].files.some(y => typeOfAudioAssetToInclude.includes(y.typeOfAsset)) : false))) {
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
    if (evidence) {
      getMasterAssetFile(evidence?.assets.master.files.filter(x => x.filesId > 0))
      getChildAssetFile(evidence?.assets.children.filter(x => x?.files[0]?.filesId > 0))
    }
  }, [evidence]);

  const getMasterAssetFile = (dt: any) => {
    if (dt?.some((x: any) => x.type == "GPS")) {
      setOpenMap(true);
    }
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
        if (template.type == "GPS") {
          setGpsFileData((previousState : any[]) => {
            const isExist = previousState.find(x => x.filename === template.name);
            if (!isExist) {
              return [...previousState,
              {
                filename: template.name,
                fileurl: template.url,
                type: template.type,
                downloadUri: response
              }];
            }
            return [...previousState];
          });
        }
        else {
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
              }];
            }
            return [...previousState];
          });
        }
      });
    })
  }
  const getChildAssetFile = (dt: any) => {
    let fileDownloadUrls: any = [];
    
    dt?.map((ut: any) => {
      ut?.files.map((template: any) => {
        let url:any  = `/Files/download/${template.filesId}/${template.accessCode}`
        FileAgent.getDownloadFileUrl(url).then((response: string) => response).then((response: any) => {
          fileDownloadUrls.push({
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            typeOfAsset: template.type,
            downloadUri: response
          })
          setChildFileData([...fileDownloadUrls])
        })
      })
    })
  }



  const gpsAndOverlayData = async (blobClient: any) => {
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded: any = await blobToString(await downloadBlockBlobResponse.blobBody);
    if (downloaded) {
      let downloadedData = downloaded.replace(/'/g, '"')
      let gpsdata = JSON.parse(downloadedData).GPS;
      let sensorsData = JSON.parse(downloadedData).Sensors;
      gpsdata.forEach((x: any) => {
        x.logTime = getUnixTimewithZeroinMillisecond(new Date(x.logTime).getTime());
      }
      );
      sensorsData.forEach((x: any) => {
        x.logTime = getUnixTimewithZeroinMillisecond(new Date(x.logTime).getTime());
      }
      );
      let distinctgpsdata = gpsdata.filter((value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
          t.logTime === value.logTime
        )));
      let distinctsensorsData = sensorsData.filter((value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
          t.logTime === value.logTime
        )));

      if (gpsdata.length > 0) { setGpsJson(distinctgpsdata); }
      if (sensorsData.length > 0) { setSensorsDataJson(distinctsensorsData) }

    }
  }

  // [Browsers only] A helper method used to convert a browser Blob into string.
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

  const getBlobClients = (downloadUri: any) => {
    const blobSasUrl = downloadUri;
    const containerWithFile = blobSasUrl.substring(blobSasUrl.indexOf('.net') + 5, blobSasUrl.indexOf('?'));
    const sasurl = blobSasUrl.replace(containerWithFile, '')
    const blobServiceClient = new BlobServiceClient(sasurl);

    const fc = containerWithFile.replaceAll('%2F', '/');
    const containerName = fc.replace(fc.substring(fc.lastIndexOf('/')), '');//get container name only
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const fileName = fc.substring(fc.lastIndexOf('/') + 1);
    return containerClient.getBlobClient(fileName);
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

  const retentionSpanText = (holdUntil?: Date, expireOn?: Date) => {
    if (holdUntil) {
      return AssetRetentionFormat(holdUntil);
    }
    else if (expireOn) {
      return AssetRetentionFormat(expireOn);
    }
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
    dispatch(getAssetTrailInfoAsync({ evidenceId: evidenceId, assetId: assetId }));
    dispatch(setLoaderValue({ isLoading: true }))
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

  const actionBucketClass = assetBucketBasketIsOpen ? "actionBucketIndex" : "";
  return (
    <div id="_asset_detail_view_idx" className="_asset_detail_view switchLeftComponents">
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
        />

        <CBXLink children="Exit" href={`${urlList.filter((item: any) => item.name === urlNames.assetSearchResult)[0].url}`} />
      </div>

      {allDataRetrieved && <AssetsDisplayTabs metaData={metaData}
        typeOfVideoAssetToInclude={typeOfVideoAssetToInclude}
        typeOfAudioAssetToInclude={typeOfAudioAssetToInclude}
        typeOfImageAssetToInclude={typeOfImageAssetToInclude}
        typeOfDocAssetToInclude={typeOfDocAssetToInclude}
        typeOfOtherAssetToInclude={typeOfOtherAssetToInclude}
        detailContent={detailContent} setDetailContent={setDetailContent}
        formattedData={formattedData} evidenceId={evidenceId} gpsJson={gpsJson}
        sensorsDataJson={sensorsDataJson} openMap={openMap}
        updatePrimaryAsset={updatePrimaryAsset} isPrimaryAsset={isPrimaryAsset} assetId={assetId} />}

      {detailContent
        && <div className="topBorderForDetail"></div>
      }

      <AssetDetailTabs assetId={assetId} evidenceId={evidenceId} metaData={metaData} uploadedOn={uploadedOn} assetsList={assetsList} evidenceSearchObject={evidenceSearchObject} />

    </div>
  );
};

export default AssetDetailsTemplate;
