import React, { useEffect } from "react";
//import {  } from "@cb/shared";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import "./assetDetailTemplate.scss";
import ActionMenu, { AssetBucket } from "../AssetLister/ActionMenu";
import Restricted from "../../../ApplicationPermission/Restricted";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { addAssetToBucketActionCreator } from "../../../Redux/AssetActionReducer";
import FormContainer from "../AssetLister/Category/FormContainer";
import useGetFetch from "../../../utils/Api/useGetFetch";
import { EVIDENCE_SERVICE_URL } from "../../../utils/Api/url";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { makeStyles } from "@material-ui/core/styles";
import AssetNameTooltip from "../AssetLister/AssetDataTable/AssetNameTooltip";
import { AssetThumbnail } from "../AssetLister/AssetDataTable/AssetThumbnail"
import { Link } from "react-router-dom";
import moment from "moment";
import VideoPlayerBase from "../../../components/MediaPlayer/VideoPlayerBase";
import {
  CRXMultiSelectBoxLight,
  CrxAccordion,CRXTabs, CrxTabPanel,
  CRXAlert,
  CRXModalDialog,
  CRXButton,
  CRXRows,
  CRXColumn,
  CRXConfirmDialog,
} from "@cb/shared";
import { hexToRgb } from "@material-ui/core";
import { RestorePageSharp } from "@material-ui/icons";
import { string } from "yup/lib/locale";
import { useHistory } from "react-router";
const AssetDetailsTemplate = (props: any) => {
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
  const historyState = props.location.state;
  const history = useHistory();
  let evidenceId: number = historyState.evidenceId;
  let assetId: string = historyState.assetId;
  let assetName: string = historyState.assetName;
  const [expanded, isExpaned] = React.useState("panel1");

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

  type EvidenceReformated = {
    id: number;
    categories: string[];

    assetId: string;
    assetName: string;
    assetType: string;
    recordingStarted: string;
  };

  let evidenceObj: EvidenceReformated = {
    id: evidenceId,
    categories: [],

    assetId: assetId,
    assetName: "",
    assetType: "",
    recordingStarted: "",
  };

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
  const dispatch = useDispatch();
  let addToAssetBucketDisabled: boolean = false;
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );

  const [value, setValue] = React.useState(0);
  const [evidence, setEvidence] =
    React.useState<EvidenceReformated>(evidenceObj);
  const [selectedItems, setSelectedItems] = React.useState<any>([]);
  const [videoPlayerData, setVideoPlayerData] = React.useState<assetdata[]>([]);
  const [isCategoryEmpty, setIsCategoryEmpty] = React.useState<boolean>(true);
  const [assetInfo, setAssetData] = React.useState<AssetReformated>(assetObj);
  const [openForm, setOpenForm] = React.useState(false);
  const [openMap, setOpenMap] = React.useState(false);
  const [gpsJson, setGpsJson] = React.useState<any>();
  const [apiKey, setApiKey] = React.useState<string>("");
  const handleChange = () => {
    setOpenForm(true);
  };

  const [getResponse, res] = useGetFetch<any>(
    EVIDENCE_SERVICE_URL + "/Evidences/" + evidenceId + "/Assets/" + assetId,
    {
      "Content-Type": "application/json",
      TenantId: "1",
    }
  );
  const [getEvidenceCategoriesResponse, evidenceCategoriesResponse] =
    useGetFetch<any>(
      EVIDENCE_SERVICE_URL + "/Evidences/" + evidenceId + "/Categories",
      {
        "Content-Type": "application/json",
        TenantId: "1",
      }
    );
  const [assetData, getAssetData] = useGetFetch<any>(
    EVIDENCE_SERVICE_URL + "/Evidences/" + evidenceId,
    {
      "Content-Type": "application/json",
      TenantId: "1",
    }
  );
  useEffect(() => {
    getResponse();
    assetData();
    getEvidenceCategoriesResponse();
    dispatch(enterPathActionCreator({ val: "Asset Detail: " + assetName }));
    setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : "");  //put this in env.dev REACT_APP_GOOGLE_MAPS_API_KEY = AIzaSyAA1XYqnjsDHcdXGNHPaUgOLn85kFaq6es
    setGpsJson(tempgpsjson);
  }, []);

  useEffect(() => {
    if(gpsJson && gpsJson.length>0){
      setOpenMap(true);
    }
  }, [gpsJson]);

  function tabHandleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  useEffect(() => {
    
    if (res !== undefined) {
      setEvidence({
        ...evidence,
        assetName: res.name,
        assetType: res.typeOfAsset,
      });
    }
  }, [res]);

  useEffect(() => {
    if (evidenceCategoriesResponse !== undefined) {
      var categories: string[] = [];
      evidenceCategoriesResponse.map((x: any) =>
        x.formData.map((y: any) =>
          y.fields.map((z: any) => {
            categories.push(z.value);
          })
        )
      );

      if (categories?.length > 0) {
        setIsCategoryEmpty(false);
      } else {
        setIsCategoryEmpty(true);
      }

      setEvidence({ ...evidence, categories: categories });
     
    }
  }, [evidenceCategoriesResponse]);

  useEffect(() => {
    
    if (getAssetData !== undefined) {
      var categories: string[] = [];
      getAssetData.categories.map((x: any) =>
        x.formData.map((y: any) =>
          y.fields.map((z: any) => {
            categories.push(z.key);
          })
        )
      );
     
      var owners : any[] = getAssetData.assets.master.owners.map((x:any) => x.cmtFieldValue);

      var unit: number[] = [];
      unit.push(getAssetData.assets.master.unitId);

      var checksum: number[] = [];
      getAssetData.assets.master.files.map((x: any) => {
        checksum.push(x.checksum.checksum);
      });

      var duration: number[] = [];
      duration.push(getAssetData.assets.master.duration);

      var size: number[] = [];
      getAssetData.assets.master.files.map((x: any) => {
        size.push(x.size);
      });


      var categoriesForm: string[] = [];
      getAssetData.categories.map((x: any) => {
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
 
  function extract(row: any) {
    let rowdetail: assetdata[] = [];
    let rowdetail1: assetdata[] = [];

    console.log(row);
    console.log(row.assets);

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
    rowdetail1 = row.assets.children.map((template: any, i: number) => {
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

  const tabs = [
    { label: "Information", index: 0 },
    { label: "Map", index: 1 },
    { label: "GROUPED AND RELATED ASSETS", index: 2 },
  ];
  const refresh=()=>{ 
    window.location.reload(); 
}
const newRound=(x:any, y: any)=>{
   history.push('/assetdetail', {  evidenceId: evidenceId,
    assetId: x,
    assetName: y, })
   history.go(0)
}
  const addToAssetBucket = () => {
    //if undefined it means header is clicked
    if (evidence !== undefined && evidence !== null) {
      const find = selectedItems.findIndex(
        (selected: any) => selected.id === evidence.id
      );
      const data = find === -1 ? evidence : selectedItems;
      dispatch(addAssetToBucketActionCreator(data));
    } else {
      dispatch(addAssetToBucketActionCreator(selectedItems));
    }
  };

  return (
    <div style={{ marginTop: "120px" }}>
      <p style={{ marginLeft: 50 }}>
        <h5>Captured Date : {assetInfo.capturedDate}</h5>
        <h5>Categories : {assetInfo.categoriesForm}</h5>
      </p>

      <div className="CRXAssetDetail">
        <FormContainer
          setOpenForm={() => setOpenForm(false)}
          openForm={openForm}
          rowData={evidence}
          isCategoryEmpty={isCategoryEmpty}
          setIsCategoryEmpty={() => setIsCategoryEmpty(true)}
        />

        <Menu
          align="start"
          viewScroll="initial"
          direction="bottom"
          position="auto"
          arrow
          menuButton={
            <MenuButton>
              <i className="fas fa-ellipsis-h"></i>
            </MenuButton>
          }
        >
          <MenuItem>
            <Restricted moduleId={0}>
              <div
                className="crx-meu-content groupingMenu crx-spac"
                onClick={addToAssetBucket}
              >
                <div className="crx-menu-icon"></div>
                <div
                  className={
                    addToAssetBucketDisabled === false
                      ? "crx-menu-list"
                      : "crx-menu-list disabledItem"
                  }
                >
                  Add to asset bucket
                </div>
              </div>
            </Restricted>
          </MenuItem>
          {isCategoryEmpty === false ? (
            <MenuItem>
              <Restricted moduleId={3}>
                <div className="crx-meu-content" onClick={handleChange}>
                  <div className="crx-menu-icon">
                    <i className="far fa-clipboard-list fa-md"></i>
                  </div>
                  <div className="crx-menu-list">Edit Category and Form</div>
                </div>
              </Restricted>
            </MenuItem>
          ) : (
            <MenuItem>
              <Restricted moduleId={2}>
                <div className="crx-meu-content" onClick={handleChange}>
                  <div className="crx-menu-icon">
                    <i className="far fa-clipboard-list fa-md"></i>
                  </div>
                  <div className="crx-menu-list">Categorize</div>
                </div>
              </Restricted>
            </MenuItem>
          )}
        </Menu>

        {/* <CBXLink  children = "Exit"   onClick={() => history.goBack()} /> */}
      </div>
      <div></div>

      <CRXRows
        container
        spacing={0}
        style={{ marginTop: "50px", marginRight: "0px" }}
      >
        <CRXColumn item xs={12}>
          {/* <div
            style={{
              marginLeft: "80px",
              marginRight: "80px",
              backgroundColor: "black",
              height: "70vh",
              color: "white",
              textAlign: "center",
            }}
          > */}
          {videoPlayerData.length > 0 && <VideoPlayerBase data={videoPlayerData} evidenceId={evidenceId} gpsJson={gpsJson} openMap={openMap} apiKey={apiKey} />}
          {/* </div> */}
        </CRXColumn>
        <CRXColumn item xs={4} className="topColumn">
          <div className="tabCreateTemplate">
            <CRXTabs value={value} onChange={tabHandleChange} tabitems={tabs} />
            <div className="tctContent">
              <CrxTabPanel value={value} index={0}>
                <div className="tctown">
                  <h1>Owners :</h1> <span>{assetInfo.owners.join(',')}</span>
                </div>
                <div className="tctown">
                  <h1>Unit :</h1> <span>{assetInfo.unit}</span>
                </div>
                <div className="tctown">
                  <h1>CheckSum :</h1> <span>{assetInfo.checksum}</span>{" "}
                </div>
                <div className="tctown">
                  <h1>Video Duration :</h1> <span>{assetInfo.duration}</span>{" "}
                </div>
                <div className="tctown">
                  <h1>Size : </h1> <span>{assetInfo.size} MB</span>
                </div>
                <div className="tctown">
                  <h1>Retention :</h1>
                  <span>{assetInfo.retention}</span>{" "}
                </div>
                <div className="tctown">
                  <h1>Categories :</h1> <span>{assetInfo.categories}</span>
                </div>
              </CrxTabPanel>
              <CrxTabPanel value={value} index={1}>
                <div>Map</div>
              </CrxTabPanel>

              <CrxTabPanel value={value} index={2}>
                
              <CrxAccordion
                  title="GROUPED ASSETS"
                  id="accorIdx1"
                  className="crx-accordion"
                  ariaControls="Content1"
                  name="panel1"
                  isExpanedChange={isExpaned}
                  expanded={expanded === "panel1"}
                >
                  <div className="stationDetailOne">
                    <div className="stationColumnSet">
               
                    {/* {getAssetData !== undefined ? getAssetData.assets.children.length : null} */}
                    
                    <table>
              <tbody>
          
                {(getAssetData !== undefined)
                  ? getAssetData.assets.children.map((asset: any, index: number) => {
                  
                      var lastChar = asset.name.substr(asset.name.length - 4);
                      return (
                        <>
                          <tr key={index}>
                         
                            <td>
                              <AssetThumbnail
                                assetType={asset.typeOfAsset}
                                className={"CRXPopupTableImage  CRXPopupTableImageUi"}
                                onClick = {()=>newRound(asset.id, asset.name)}
                              />
                            </td>
                            <td>
                              <Link
                                 className="linkColor"
                                  onClick = {refresh}
                                  to={{
                                pathname: "/assetdetail",
                                state: {
                                  evidenceId: evidenceId,
                                  assetId: asset.id,
                                  assetName: asset.name,
                                },
                                }}>
                               
                                <div id="middletruncate" data-truncate={lastChar}>
                                  <p>{asset.name}</p>
                                </div>

                              {/* <div>{asset.name}</div> */}
                              
                              
                              </Link>

                                <div className="timeLineLister">
                                {asset.camera !== undefined &&
                              asset.camera !== null &&
                              asset.camera !== "" ? (
                                <div>
                                  <label className="CRXPopupDetailFontSize">
                                    {asset.camera}
                                  </label>
                                </div>
                              ) : (
                                <div>
                                  <label className="CRXPopupDetailFontSize">
                                    {asset.typeOfAsset}
                                  </label>
                                </div>
                              )}
                              <label className="CRXPopupDetailFontSize">
                                {dateDisplayFormat(asset.recording.started)}
                              </label>
                                </div>
                           
                            </td>
                           
                          </tr>
                          
                        </>
                      );
                    })
                  : null}
              </tbody>
            </table>
          
                    </div>
         
                  </div>
                </CrxAccordion>
              </CrxTabPanel>
            </div>
          </div>
        </CRXColumn>
      </CRXRows>
    </div>
  );
};

export default AssetDetailsTemplate;
