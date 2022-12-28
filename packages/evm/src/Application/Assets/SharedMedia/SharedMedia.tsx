import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { EVIDENCE_SERVICE_URL } from "../../../utils/Api/url";
import { EvidenceAgent, FileAgent } from "../../../utils/Api/ApiAgent";
import { Asset, Category, Evidence, AssetSharingModel } from "../../../utils/Api/models/EvidenceModels";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import DateTime from "../../../GlobalComponents/DateTime/DateTime";
import moment from "moment";
import VideoPlayerBase from "../../../components/MediaPlayer/VideoPlayerBase";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { AssetRetentionFormat } from "../../../GlobalFunctions/AssetRetentionFormat";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { CRXTooltip,CRXButton } from "@cb/shared";
import { BlobServiceClient } from "@azure/storage-blob";




const SharedMedia = () => {
  let tempgpsjson: any = [
    {
      "LAT": "24.813632",
      "LON": "67.027721",
      "LOGTIME": "1652857260"
    },
    {
      "LAT": "24.814917",
      "LON": "67.028923",
      "LOGTIME": "1652857262"
    },
    {
      "LAT": "24.818851",
      "LON": "67.032187",
      "LOGTIME": "1652857264"
    },
    {
      "LAT": "24.823019",
      "LON": "67.034721",
      "LOGTIME": "1652857266"
    },
    {
      "LAT": "24.827381",
      "LON": "67.034574",
      "LOGTIME": "1652857268"
    },
    {
      "LAT": "24.832951",
      "LON": "67.033673",
      "LOGTIME": "1652857270"
    },
    {
      "LAT": "24.839260",
      "LON": "67.032900",
      "LOGTIME": "1652857272"
    }
  ]
  type AssetReformated = {
    categories: any[];
    owners: string[];
    unit: number[];
    capturedDate: string;
    checksum: number[];
    duration: string;
    size: string;
    retention: string;
    categoriesForm: string[];
    id?: number;
    assetName?: string;
    typeOfAsset: string;
    status: string;
    camera: string;
  };
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
  type assetdata = {
    name: string
    files: any;
    assetduration: number;
    assetbuffering: any;
    recording: any;
    bookmarks: [];
    id: number;
    unitId: number;
    typeOfAsset: string;
    notes: any;
    camera: string;
    status: string;
  }
  const [LinkStatus, setlinkStatus] = React.useState<string>("Validating...")
  const [downloadLink, setDownloadLink] = React.useState<string[]>([]);

  const [getAssetData, setGetAssetData] = React.useState<Evidence>();
  const [evidenceCategoriesResponse, setEvidenceCategoriesResponse] = React.useState<Category[]>([]);
  const [apiKey, setApiKey] = React.useState<string>("");
  const [gpsJson, setGpsJson] = React.useState<any>();
  const [assetInfo, setAssetData] = React.useState<AssetReformated>(assetObj);
  const [videoPlayerData, setVideoPlayerData] = React.useState<assetdata[]>([]);
  const [evidenceId, setEvidenceId] = React.useState<number>(0);
  const [openMap, setOpenMap] = React.useState(false);
  const [fileData, setFileData] = React.useState<any[]>([]);
  const [isdownloadable, setIsdownloadable] = React.useState<boolean>(false);
  const [gpsFileData, setGpsFileData] = React.useState<any[]>([]);
  const [detailContent, setDetailContent] = React.useState<boolean>(false);
  const [sensorsDataJson, setSensorsDataJson] = React.useState<any>();

  const { t } = useTranslation<string>();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('E');
  console.log('URL: ', window.location.href);
  console.log('E: ', token);

  useEffect(() => {
    DecryptLink();
  }, []);


  useEffect(() => {
    if (gpsFileData && gpsFileData.length > 0) {
      const blobSasUrl = gpsFileData[0].downloadUri;
      const containerWithFile = blobSasUrl.substring(blobSasUrl.indexOf('.net') + 5, blobSasUrl.indexOf('?'));
      const sasurl = blobSasUrl.replace(containerWithFile, '')
      const blobServiceClient = new BlobServiceClient(sasurl);

      const fc = containerWithFile.replaceAll('%2F', '/');
      const containerName = fc.replace(fc.substring(fc.lastIndexOf('/')), '');//get container name only
      const containerClient = blobServiceClient.getContainerClient(containerName);

      const fileName = fc.substring(fc.lastIndexOf('/') + 1);
      const blobClient = containerClient.getBlobClient(fileName);
      gpsAndOverlayData(blobClient);
    }
  }, [gpsFileData]);

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

    // [Browsers only] A helper method used to convert a browser Blob into string.
    async function blobToString(blob: any) {
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

  function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  const milliSecondsToTimeFormat = (date: Date) => {
    let numberFormatting = padTo2Digits(date.getUTCHours()) + ":" + padTo2Digits(date.getUTCMinutes()) + ":" + padTo2Digits(date.getUTCSeconds());
    let hourFormatting = date.getUTCHours() > 0 ? date.getUTCHours() : undefined
    let minuteFormatting = date.getUTCMinutes() > 0 ? date.getUTCMinutes() : undefined
    let secondFormatting = date.getUTCSeconds() > 0 ? date.getUTCSeconds() : undefined
    let nameFormatting = (hourFormatting ? hourFormatting + " Hours " : "") + (minuteFormatting ? minuteFormatting + " Minutes " : "") + (secondFormatting ? secondFormatting + " Seconds " : "")
    return numberFormatting + " (" + nameFormatting + ")";
  }


  const gotoSeeMoreView = (e: any, targetId: any) => {
    detailContent == false ? setDetailContent(true) : setDetailContent(false);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  const assetDisplay = (videoPlayerData: any, evidenceId: any, gpsJson: any, sensorsDataJson: any, openMap: any, apiKey: any) => {
    let availableAssets = videoPlayerData.filter((x: any) => x.status == "Available");
    if (availableAssets.length > 0) {
      let videos = availableAssets.filter((x: any) => x.typeOfAsset == "Video");

      switch (videoPlayerData[0]?.typeOfAsset) {
        case 'Video':
          return videos.length > 0 ? <VideoPlayerBase data={videos} evidenceId={evidenceId} gpsJson={gpsJson} sensorsDataJson={sensorsDataJson} openMap={openMap} apiKey={apiKey} /> :
            <>
              <div className="_player_video_uploading">
                <div className="layout_inner_container">
                  {assetInfo.id && <div className="text_container_video">Evidence is not available, Uploading is in progress!</div>}
                  <div className="_empty_arrow_seeMore">
                    {detailContent == false ?
                      <button id="seeMoreButton" className="_empty_content_see_mot_btn seeMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "detail_view")} data-target="#detail_view">
                        <CRXTooltip iconName="fas fa-chevron-down" placement="bottom" arrow={false} title="see more" />
                      </button>
                      :
                      <button id="lessMoreButton" data-target="#root" className="_empty_content_see_mot_btn lessMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "root")}>
                        <CRXTooltip iconName="fas fa-chevron-up" placement="bottom" arrow={false} title="see less" />
                      </button>
                    }
                  </div>
                </div>
              </div>
            </>
        case 'Image':
          return <img src={availableAssets[0]?.files[0]?.downloadUri}></img>
        default:
          return <></>;
      }
    }
    else {
      return <>
        <div className="_player_video_uploading">
          <div className="layout_inner_container">
            {assetInfo.id && <div className="text_container_video">Evidence is not available, Uploading is in progress!</div>}
            <div className="_empty_arrow_seeMore">
              {detailContent == false ?
                <button id="seeMoreButton" className="_empty_content_see_mot_btn seeMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "detail_view")} data-target="#detail_view">
                  <CRXTooltip iconName="fas fa-chevron-down" placement="bottom" arrow={false} title="see more" />
                </button>
                :
                <button id="lessMoreButton" data-target="#root" className="_empty_content_see_mot_btn lessMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "root")}>
                  <CRXTooltip iconName="fas fa-chevron-up" placement="bottom" arrow={false} title="see less" />
                </button>
              }
            </div>
          </div>
        </div>
      </>
    }
  }
  const downloadVideos = () => {    

    downloadLink.forEach(async element => {
      window.open(element);
      
    });
  }

  const DecryptLink = async () => {
    let downloadUrlList:string[] = [];
    let dataList:assetdata[] = [];
    const cookies = new Cookies();
    const url = EVIDENCE_SERVICE_URL + '/OpenSharedMedia?E=' + `${token}`
    const res = await fetch(url, {
      method: 'Get',
      headers: { 'Content-Type': 'application/json'},
    });
    let response = await res.json();
    if (response != null && response != "Asset not found") {
      //setGetAssetData(response[0]);
      //setEvidenceCategoriesResponse(response.categories)
      setEvidenceId(response.evidenceId);
      setIsdownloadable(response[0].permissons.isDownloadable);
      var expiry_date = moment(response[0].shared.on).add(response[0].shared.expiryDuration, 'hours');
      let now = moment();
      if (now.isBefore(expiry_date)) {
        setlinkStatus("Link is authorized")
        setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : "");  //put this in env.dev REACT_APP_GOOGLE_MAPS_API_KEY = AIzaSyAA1XYqnjsDHcdXGNHPaUgOLn85kFaq6es
        setGpsJson(tempgpsjson);
        response[0].assetGroup.forEach((element:any) => {
          const buffering = "";//row.assets.master.buffering;
          const camera = "";//row.assets.master.camera;
          let recording = element.files[0].recording;//row.assets.master.recording;
          const bookmarks = element.files[0]?.bookmarks ?? [];//row.assets.master.bookMarks ?? [];
          const notes = element.files[0]?.notes ?? []; //row.assets.master.notes ?? [];
          const id = element.assetId;//row.assets.master.id;
          const unitId = 1;//row.assets.master.unitId;
          const typeOfAsset = element.files[0].type;//row.assets.master.typeOfAsset;
          const name = element.files[0].name;//row.assets.master.name;
          const status = "Available";//row.assets.master.files[0]?.filesId > 0 ? "Available" : "";
          let duration = element.files[0].duration;
          let fileDataList:any[]=[];
          var tempfileData:any = {
            filename: element.files[0].name, //template.name,
            fileurl: element.files[0].url,//template.url,
            fileduration: duration,
            downloadUri: element.downloadFile[element.files[0].filesId],
          }
          fileDataList.push(tempfileData);
          downloadUrlList.push(element.downloadFile[element.files[0].filesId]);

          setFileData([...fileData, {
            filename: element.files[0].name, //template.name,
            fileurl: element.files[0].url,//template.url,
            fileduration: duration,
            downloadUri: element.downloadFile[element.files[0].filesId],
          }]);


          let myData: assetdata = 
          { 
            id: element.assetId, 
            files: fileDataList,//fileData, 
            assetduration: duration, 
            assetbuffering: buffering, 
            recording: recording, 
            bookmarks: bookmarks, //
            unitId: unitId, 
            typeOfAsset: typeOfAsset, 
            name: name, 
            notes: notes, 
            camera: camera, 
            status: status 
          }
          dataList.push(myData);
          
        });
        setVideoPlayerData(dataList);
        setDownloadLink(downloadUrlList);
      }
      else {
        setlinkStatus("The Link is not valid");

      }
    }
    else {
      setlinkStatus("The Link is not valid");

    }
  }


  return (
    <div className="crxManageUsers switchLeftComponents manageUsersIndex">
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "28px", fontWeight: "900" }}>Shared Media</span><br></br>
        <span style={{ fontSize: "16px", fontWeight: "400" }}>{LinkStatus}</span>
      </div>
      {isdownloadable ? (
        <div>
          <CRXButton className="RetentionPoliciesBtn" onClick={() => { downloadVideos() }}>
                  {t("Download_Assets")}
                </CRXButton>
        </div>
      ) : null}


      {assetDisplay(videoPlayerData, evidenceId, gpsJson, sensorsDataJson, openMap, apiKey)}


      {videoPlayerData.length > 0 && videoPlayerData[0]?.typeOfAsset === "Video" && <VideoPlayerBase data={videoPlayerData} evidenceId={evidenceId} gpsJson={gpsJson} openMap={openMap} apiKey={apiKey} />}
      <div className='categoryTitle'>

      </div>

    </div>
  );
};

export default SharedMedia;
