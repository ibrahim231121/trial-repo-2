import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { EVIDENCE_SERVICE_URL } from "../../../utils/Api/url";
import { EvidenceAgent } from "../../../utils/Api/ApiAgent";
import { Asset, Category, Evidence } from "../../../utils/Api/models/EvidenceModels";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import DateTime from "../../../GlobalComponents/DateTime/DateTime";
import moment from "moment";
import VideoPlayerBase from "../../../components/MediaPlayer/VideoPlayerBase";




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
    categories: string[];
    owners: string[];
    unit: number[];
    capturedDate: string;
    checksum: number[];
    duration: string;
    size: number[];
    retention: string;
    categoriesForm: string[];
  };
  let assetObj: AssetReformated = {
    categories: [],
    owners: [],
    unit: [],
    capturedDate: "",
    checksum: [],
    duration: "",
    size: [],
    retention: "",
    categoriesForm: [],
  };
  type assetdata = {
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
  }
  const [LinkStatus, setlinkStatus] = React.useState<string>("Validating...")
  const [getAssetData, setGetAssetData] = React.useState<Evidence>();
  const [evidenceCategoriesResponse, setEvidenceCategoriesResponse] = React.useState<Category[]>([]);
  const [res, setRes] = React.useState<Asset>();
  const [apiKey, setApiKey] = React.useState<string>("");
  const [gpsJson, setGpsJson] = React.useState<any>();
  const [assetInfo, setAssetData] = React.useState<AssetReformated>(assetObj);
  const [videoPlayerData, setVideoPlayerData] = React.useState<assetdata[]>([]);
  const [evidenceId, setEvidenceId] = React.useState<number>(0);
  const [openMap, setOpenMap] = React.useState(false);



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
    if (getAssetData !== undefined) {
      var categories: string[] = [];
      getAssetData.categories.forEach((x: any) =>
        x.formData.forEach((y: any) =>
          y.fields.forEach((z: any) => {
            categories.push(z.key);
          })
        )
      );

      var owners: any[] = getAssetData.assets.master.owners.map((x: any) => x.cmtFieldValue);

      var unit: number[] = [];
      unit.push(getAssetData.assets.master.unitId);

      var checksum: number[] = [];
      getAssetData.assets.master.files.forEach((x: any) => {
        checksum.push(x.checksum.checksum);
      });

      var duration: number[] = [];
      duration.push(getAssetData.assets.master.duration);

      var size: number[] = [];
      getAssetData.assets.master.files.forEach((x: any) => {
        size.push(x.size);
      });


      var categoriesForm: string[] = [];
      getAssetData.categories.forEach((x: any) => {
        categoriesForm.push(x.record.cmtFieldName);
      });

      setAssetData({
        ...assetInfo,
        owners: owners,
        unit: unit,
        capturedDate: moment(getAssetData.createdOn).format(
          "YYYY / MM / DD HH:mm:ss"
        ),
        checksum: checksum,
        duration: moment
          .utc(getAssetData.assets.master.duration)
          .format("h:mm"),
        size: size,
        retention: moment(getAssetData.retainUntil).format(
          "YYYY / MM / DD HH:mm:ss"
        ),
        categories: categories,
        categoriesForm: categoriesForm,
      });
      const data = extract(getAssetData);
      setVideoPlayerData(data);
    }
  }, [getAssetData]);
  const GetAsset = (response : any) => {

    var asd = response;
    EvidenceAgent.getEvidence(response.evidenceId).then((response: Evidence) => {
      setGetAssetData(response);
      setEvidenceCategoriesResponse(response.categories)
      setEvidenceId(response.id);

    });
    const getAssetUrl = "/Evidences/" + response.evidenceId + "/Assets/" + response.assetId;
    EvidenceAgent.getAsset(getAssetUrl).then((response: Asset) => setRes(response));
  
     dispatch(enterPathActionCreator({ val: t("Asset_Detail:_") + "" })); //replace assetName with "" 
     setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : "");  //put this in env.dev REACT_APP_GOOGLE_MAPS_API_KEY = AIzaSyAA1XYqnjsDHcdXGNHPaUgOLn85kFaq6es
     setGpsJson(tempgpsjson);
  }
const DecryptLink = async () => {
  const url = EVIDENCE_SERVICE_URL + '/OpenSharedMedia?E=' + `${token}`

  const res = await fetch(url, {
    method: 'Get',
    headers: { 'Content-Type': 'application/json', TenantId: '1' },
  })
  let response = await res.json();
 
  if (response != null && response != "Asset not found") 
  {
    var expiry_date = moment(response.shared.on).add(response.shared.expiryDuration, 'hours');
    let now = moment();
    if(now.isBefore(expiry_date))
    {
    setlinkStatus("Link is authorized")
    GetAsset(response);
    }
    else{
      setlinkStatus("The Link is not valid");
  
    }
  }
  else{
    setlinkStatus("The Link is not valid");

  }
}
function extract(row: any) {
  let rowdetail: assetdata[] = [];
  let rowdetail1: assetdata[] = [];
  const masterduration = row.assets.master.duration;
  const buffering = row.assets.master.buffering;
  const camera = row.assets.master.camera;
  const file = extractfile(row.assets.master.files);
  const recording = row.assets.master.recording;
  const bookmarks = row.assets.master.bookMarks ?? [];
  const notes = row.assets.master.notes ?? [];
  const id = row.assets.master.id;
  const unitId = row.assets.master.unitId;
  const typeOfAsset = row.assets.master.typeOfAsset;
  let myData: assetdata = { id: id, files: file, assetduration: masterduration, assetbuffering: buffering, recording: recording, bookmarks: bookmarks, unitId: unitId, typeOfAsset: typeOfAsset, notes: notes, camera: camera }
  rowdetail.push(myData);
  rowdetail1 = row.assets.children.filter((x: any) => x.typeOfAsset == "Video").map((template: any, i: number) => {
    return {
      id: template.id,
      files: extractfile(template.files),
      assetduration: template.duration,
      assetbuffering: template.buffering,
      recording: template.recording,
      bookmarks: template.bookMarks ?? [],
      unitId: template.unitId,
      typeOfAsset: template.typeOfAsset,
      notes: template.notes ?? [],
      camera: camera
    }
  })
  for (let x = 0; x < rowdetail1.length; x++) {
    rowdetail.push(rowdetail1[x])
  }
  return rowdetail
}
function extractfile(file: any) {
  let Filedata: assetdata[] = [];
  Filedata = file.map((template: any, i: number) => {
    return {
      filename: template.name,
      fileurl: template.url,
      fileduration: template.duration,

    }
  })
  return Filedata;
}

    return (
        <div className="crxManageUsers switchLeftComponents manageUsersIndex">
      <div style={{textAlign:"center"}}>
      <span style={{fontSize:"28px",fontWeight:"900"}}>Shared Media</span><br></br>
      <span style={{fontSize:"16px",fontWeight:"400"}}>{LinkStatus}</span>
      </div>
      {videoPlayerData.length > 0 && videoPlayerData[0]?.typeOfAsset === "Video" && <VideoPlayerBase data={videoPlayerData} evidenceId={evidenceId} gpsJson={gpsJson} openMap={openMap} apiKey={apiKey} />}
      <div className='categoryTitle'>
      
      </div>
    
    </div>
  );
};

export default SharedMedia;
