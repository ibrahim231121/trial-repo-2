import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import "./assetDetailTemplate.scss";
import { AssetBucket } from "../AssetLister/ActionMenu";
import Restricted from "../../../ApplicationPermission/Restricted";
import {DateTimeComponent } from '../../../GlobalComponents/DateTime';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { addAssetToBucketActionCreator } from "../../../Redux/AssetActionReducer";
import FormContainer from "../AssetLister/Category/FormContainer";
import { dateOptionsTypes } from '../../../utils/constant';
import { EVIDENCE_PATCH_LOCK_UNLOCK_URL, EVIDENCE_SERVICE_URL } from "../../../utils/Api/url";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { useTranslation } from "react-i18next";
import { AssetThumbnail } from "../AssetLister/AssetDataTable/AssetThumbnail"
import { Link } from "react-router-dom";
import moment from "moment";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import VideoPlayerBase from "../../../components/MediaPlayer/VideoPlayerBase";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { useHistory } from "react-router";
import RestrictAccessDialogue from "./../AssetLister/RestrictAccessDialogue";
import { EvidenceAgent, FileAgent } from "../../../utils/Api/ApiAgent";
import { Asset, Category, Evidence } from "../../../utils/Api/models/EvidenceModels";
import http from "../../../http-common";
import { AxiosError } from "axios";
import {
  CRXMultiSelectBoxLight,
  CrxAccordion, CRXTabs, CrxTabPanel,
  CRXAlert,
  CRXModalDialog,
  CRXButton,
  CRXRows,
  CRXColumn,
  CRXDataTable,
  CRXConfirmDialog,
} from "@cb/shared";

import {
  HeadCellProps,
  onResizeRow,
  Order,
  ValueString,
  onSetSearchDataValue,
  SearchObject,
  onSetSingleHeadCellVisibility,
  onClearAll,
} from "../../../GlobalFunctions/globalDataTableFunctions";

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
  const [expanded, isExpaned] = React.useState<string | boolean>("panel1");
  const [detailContent , setDetailContent] = useState<boolean>(false);
  const detail_view = React.useRef(null);
  
  type DateTimeProps = {
    dateTimeObj: DateTimeObject;
    colIdx: number;
  };
  type DateTimeObject = {
    startDate: string;
    endDate: string;
    value: string;
    displayText: string;
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
  type AuditTrail = {
    sequenceNumber:string;
    captured:any;
    username:string;
    activity:string
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
  const [fileData, setFileData] = React.useState<any[]>([]);
  const [childFileData, setChildFileData] = React.useState<any[]>([]);

  const [evidence, setEvidence] = React.useState<EvidenceReformated>(evidenceObj);
  //const [selectedItems, setSelectedItems] = React.useState<any>([]);
  const [videoPlayerData, setVideoPlayerData] = React.useState<assetdata[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [isCategoryEmpty, setIsCategoryEmpty] = React.useState<boolean>(true);
  const [assetInfo, setAssetData] = React.useState<AssetReformated>(assetObj);
  const [openForm, setOpenForm] = React.useState(false);
  const [openRestrictAccessDialogue, setOpenRestrictAccessDialogue] = React.useState(false);
  const [openMap, setOpenMap] = React.useState(false);
  const [gpsJson, setGpsJson] = React.useState<any>();
  const [apiKey, setApiKey] = React.useState<string>("");
  const [getAssetData, setGetAssetData] = React.useState<Evidence>();
  const [evidenceCategoriesResponse, setEvidenceCategoriesResponse] = React.useState<Category[]>([]);
  const [res, setRes] = React.useState<Asset>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [order] = React.useState<Order>("asc");
  const { t } = useTranslation<string>();
  const [orderBy] = React.useState<string>("name");
  const [open, setOpen] = React.useState<boolean>(false);
  const [rows, setRows] = React.useState<AuditTrail[]>([]);
  const [selectedActionRow, setSelectedActionRow] =React.useState<AuditTrail>();
  const [selectedItems, setSelectedItems] = React.useState<AuditTrail[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<AuditTrail[]>();
  const handleChange = () => {
    setOpenForm(true);
  };

  useEffect(() => {
    EvidenceAgent.getEvidence(evidenceId).then((response: Evidence) => {
      setGetAssetData(response);
      setEvidenceCategoriesResponse(response.categories)
    });
    const getAssetUrl = "/Evidences/" + evidenceId + "/Assets/" + assetId;
    EvidenceAgent.getAsset(getAssetUrl).then((response: Asset) => setRes(response));

    dispatch(enterPathActionCreator({ val: t("Asset_Detail:_") + assetName }));
    setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : "");  //put this in env.dev REACT_APP_GOOGLE_MAPS_API_KEY = AIzaSyAA1XYqnjsDHcdXGNHPaUgOLn85kFaq6es
    setGpsJson(tempgpsjson);
  }, []);

  useEffect(() => {
    if (gpsJson && gpsJson.length > 0) {
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
      evidenceCategoriesResponse.forEach((x: any) =>
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
   
  if(fileData.length == getAssetData?.assets.master.files.length)
  { // temp condition
    if ((getAssetData !== undefined) && getAssetData?.assets.children.length == childFileData.length) {
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
  }
  else{
    getMasterAssetFile(getAssetData?.assets.master.files)
    getChildAssetFile(getAssetData?.assets.children)
  }
  }, [getAssetData, fileData,childFileData]);

  function getMasterAssetFile(dt : any)
  {
    dt?.map((template: any, i: number) => {
      FileAgent.getDownloadFileUrl(template.id).then((response: string) => response).then((response: any) => {
      setFileData([...fileData, {
        filename: template.name,
        fileurl: template.url,
        fileduration: template.duration,
        downloadUri: response
      }])
      });
    })
  }
  function getChildAssetFile(dt : any)
  {
  
    dt?.map((ut: any, i: number) => {
      ut?.files.map((template: any, j: number )=>
      {
        FileAgent.getDownloadFileUrl(template.id).then((response: string) => response).then((response: any) => {
          setChildFileData([...childFileData, {
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            downloadUri: response
          }])
          });

      })
     
    })
  }

  const searchText = (
    rowsParam: AuditTrail[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    };

    const onSelection = (v: ValueString[], colIdx: number) => {
   
      if (v.length > 0) {
        for (var i = 0; i < v.length; i++) {
          let searchDataValue = onSetSearchDataValue(v, headCells, colIdx);
          setSearchData((prevArr) =>
            prevArr.filter(
              (e) => e.columnName !== headCells[colIdx].id.toString()
            )
          );
          setSearchData((prevArr) => [...prevArr, searchDataValue]);
         
        }
      } else {
        setSearchData((prevArr) =>
          prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
        );
      }
    };
  

    return (
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
      );
    };

    const [dateTime, setDateTime] = React.useState<DateTimeProps>({
      dateTimeObj: {
          startDate: "",
          endDate: "",
          value: "",
          displayText: "",
      },
      colIdx: 0,
  });

    const searchDate = (
      rowsParam: AuditTrail[],
      headCells: HeadCellProps[],
      colIdx: number
  ) => {
      let reset: boolean = false;

      let dateTimeObject: DateTimeProps = {
          dateTimeObj: {
              startDate: "",
              endDate: "",
              value: "",
              displayText: "",
          },
          colIdx: 0,
      };

      if (
          headCells[colIdx].headerObject !== null ||
          headCells[colIdx].headerObject === undefined
      )
          reset = false;
      else reset = true;

      if (
          headCells[colIdx].headerObject === undefined ||
          headCells[colIdx].headerObject === null
      ) {
          dateTimeObject = {
              dateTimeObj: {
                  startDate: reformattedRows !== undefined ? reformattedRows[0].captured : "",
                  endDate: reformattedRows !== undefined ? reformattedRows[reformattedRows.length - 1].captured : "",
                  value: "custom",
                  displayText: "custom range",
              },
              colIdx: 0,
          };
      } else {
          dateTimeObject = {
              dateTimeObj: {
                  ...headCells[colIdx].headerObject
              },
              colIdx: 0,
          };
      }

      function onSelection(dateTime: DateTimeObject) {
          dateTimeObject = {
              dateTimeObj: {
                  ...dateTime
              },
              colIdx: colIdx,
          };
          setDateTime(dateTimeObject);
          headCells[colIdx].headerObject = dateTimeObject.dateTimeObj;
      }

      return (
          <CRXColumn item xs={11}>
              <DateTimeComponent
                  showCompact={false}
                  reset={reset}
                  dateTimeDetail={dateTimeObject.dateTimeObj}
                  getDateTimeDropDown={(dateTime: DateTimeObject) => {
                      onSelection(dateTime);
                  }}
                  dateOptionType={dateOptionsTypes.basicoptions}
              />
          </CRXColumn>
      );

  };

 
  function extract(row: any) {
    let rowdetail: assetdata[] = [];
    let rowdetail1: assetdata[] = [];
    const masterduration = row.assets.master.duration;
    const buffering = row.assets.master.buffering;
    const camera = row.assets.master.camera;
    const file = fileData;
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
        files: childFileData,
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
  // function  extractfile(file: any) {
  //   let Filedata: any[] = [];
     
  //   var a = file.map((template: any, i: number) => {
  //     return FileAgent.getDownloadFileUrl(template.id).then((response: string) => response).then((response: any) => {
      
  //       Filedata.push({
  //         filename: template.name,
  //         fileurl: template.url,
  //         fileduration: template.duration,
  //         downloadUri: response
  //       })
  //       return response
  //     });
  //   })
  //   var b = a[0].then((response:any) => response)
  //   return b;
  // }

  const tabs = [
    { label: t("Information"), index: 0 },
    { label: t("Map"), index: 1 },
    { label: t("GROUPED_AND_RELATED_ASSETS"), index: 2 },
    { label: "AUDIT TRAIL", index: 3 },
  ];
  const refresh = () => {
    window.location.reload();
  }
  const newRound = (x: any, y: any) => {
    history.push('/assetdetail', {
      evidenceId: evidenceId,
      assetId: x,
      assetName: y,
    })
    history.go(0)
  }
const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
  
  {
    label: `${t("Seq No")}`,
    id: "sequenceNumber",
    align: "right",
    dataComponent: (e: string) => textDisplay(e, " "),
    sort: true,
  },
  {
    label: `${t("Captured")}`,
    id: "captured",
    align: "right",
    dataComponent: dateDisplayFormat,
  //  dataComponent: (e: string) => textDisplay(e, " "),
    searchFilter: true,
    searchComponent: searchDate,
    sort: false,
  },
  {
    label: `${t("Username")}`,
    id: "username",
    align: "right",
    searchFilter: true,
    searchComponent: searchText,
    dataComponent: (e: string) => textDisplay(e, " "),
    sort: true
  },
  {
    label: `${t("Activity")}`,
    id: "activity",
    align: "right",
    searchFilter: true,
    searchComponent: searchText,
    dataComponent: (e: string) => textDisplay(e, " "),
    sort: true
  }
]);
const clearAll = () => {
  const clearButton: any = document.getElementsByClassName(
    "MuiAutocomplete-clearIndicator"
  )[0];
  clearButton && clearButton.click();
  setOpen(false);
  // setSearchData([]);
  let headCellReset = onClearAll(headCells);
  setHeadCells(headCellReset);
};
const resizeRowUnitDetail = (e: { colIdx: number; deltaX: number }) => {
  let headCellReset = onResizeRow(e, headCells);
  setHeadCells(headCellReset);
};
const onSetHeadCells = (e: HeadCellProps[]) => {
  let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
  setHeadCells(headCellsArray);
};
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

  const confirmCallBackForRestrictModal = () => {
    const _requestBody = [];
    _requestBody.push({
      evidenceId: getAssetData?.id,
      assetId: getAssetData?.assets?.master?.id,
      userRecId: localStorage.getItem('User Id'),
      operation: "Lock"
    });
    const _body = JSON.stringify(_requestBody);
    const _url = `${EVIDENCE_PATCH_LOCK_UNLOCK_URL}`;
    http.patch(_url, _body).then((response) => {
      if (response.status === 204) {
        setSuccess(true);
        setTimeout(() => {
          setOpenRestrictAccessDialogue(false);
          setSuccess(false);
        }, 3000);
      }
    })
      .catch((error) => {
        const err = error as AxiosError;
        if (err.request.status === 409) {
          setErrorMessage("The asset is already locked.");
        } else {
          setErrorMessage("We 're sorry. The asset can't be locked. Please retry or  contact your Systems Administrator");
        }
        setError(true);
      });
  }

  const RestrictAccessClickHandler = () => setOpenRestrictAccessDialogue(true);

 
  const gotoSeeMoreView = (e : any, targetId:any) => {
    detailContent == false ? setDetailContent(true) : setDetailContent(false);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  return (
    <div id="_asset_detail_view_idx" className="_asset_detail_view switchLeftComponents">
      <div id="videoPlayer_with_category_view" className="CRXAssetDetail">
      <div className="asset_date_categories">
        <span><strong>{t("Captured Date")}</strong> : {assetInfo.capturedDate}</span>
        <span><strong>{t("Categories")}</strong> : {assetInfo.categoriesForm}</span>
      </div>
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
                  {t("Add_to_asset_bucket")}
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
                  <div className="crx-menu-list">{t("Edit_Category_and_Form")}</div>
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
                  <div className="crx-menu-list">{t("Categorize")}</div>
                </div>
              </Restricted>
            </MenuItem>
          )}
          <MenuItem>
            <Restricted moduleId={0}>
              <div className="crx-meu-content crx-spac" onClick={RestrictAccessClickHandler}>
                <div className="crx-menu-icon">
                  <i className="far fa-user-lock fa-md"></i>
                </div>
                <div className="crx-menu-list">{t("Restrict_access")}</div>
              </div>
            </Restricted>
          </MenuItem>
        </Menu>

        {/* <CBXLink  children = "Exit"   onClick={() => history.goBack()} /> */}
      </div>
      {success && <CRXAlert message='Success: The assets are locked.' alertType='toast' open={true} />}
      {error && (
        <CRXAlert
          message={errorMessage}
          type='error'
          alertType='inline'
          open={true}
        />
      )}

      <RestrictAccessDialogue
        openOrCloseModal={openRestrictAccessDialogue}
        setOpenOrCloseModal={(e) => setOpenRestrictAccessDialogue(e)}
        onConfirmBtnHandler={confirmCallBackForRestrictModal}
      />

      <CRXRows
        container
        spacing={0}
       
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
          {videoPlayerData.length > 0 && videoPlayerData[0]?.typeOfAsset === "Video" && <VideoPlayerBase data={videoPlayerData} evidenceId={evidenceId} gpsJson={gpsJson} openMap={openMap} apiKey={apiKey} />}
          {/* </div> */}
          {detailContent && <div className="topBorderForDetail"></div>}
          <div className="touchPoint_bar">
            {detailContent == false ? 
            <button  id="seeMoreButton" className="_angle_down_up_icon_btn seeMoreButton" onClick={(e:any) => gotoSeeMoreView(e, "detail_view")} data-target="#detail_view">
              <i className="fas fa-angle-down"></i>
            </button>
            :
            <button id="lessMoreButton"  data-target="#v_asset_detail_view_idx" className="_angle_down_up_icon_btn lessMoreButton" onClick={(e:any) => gotoSeeMoreView(e, "_asset_detail_view_idx")}>
              <i className="fas fa-angle-up"></i>
            </button>
            }
          </div>
          
        </CRXColumn>
        <CRXColumn item xs={12} className="topColumn">
          <div className="tabCreateTemplate crxTabsPermission" id="detail_view" ref={detail_view}>
            <CRXTabs value={value} onChange={tabHandleChange} tabitems={tabs} />
            <div className="tctContent">
              <CrxTabPanel value={value} index={0}>
                <div className="tctown">
                  <h1>{t("Owners")} :</h1> <span>{assetInfo.owners.join(',')}</span>
                </div>
                <div className="tctown">
                  <h1>{t("Unit")} :</h1> <span>{assetInfo.unit}</span>
                </div>
                <div className="tctown">
                  <h1>{t("CheckSum")} :</h1> <span>{assetInfo.checksum}</span>{" "}
                </div>
                <div className="tctown">
                  <h1>{t("Video_Duration")} :</h1> <span>{assetInfo.duration}</span>{" "}
                </div>
                <div className="tctown">
                  <h1>{t("Size")} : </h1> <span>{assetInfo.size} MB</span>
                </div>
                <div className="tctown">
                  <h1>{t("Retention")} :</h1>
                  <span>{assetInfo?.retention}</span>{" "}
                </div>
                <div className="tctown">
                  <h1>{t("Categories")} :</h1> <span>{assetInfo.categories}</span>
                </div>
              </CrxTabPanel>
              <CrxTabPanel value={value} index={1}>
                <div>{t("Map")}</div>
              </CrxTabPanel>

              <CrxTabPanel value={value} index={2}>

                <CrxAccordion
                  title={t("Grouped_Assets")}
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
                                        onClick={() => newRound(asset.id, asset.name)}
                                      />
                                    </td>
                                    <td>
                                      <Link
                                        className="linkColor"
                                        onClick={refresh}
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
                                          {asset.recording && dateDisplayFormat(asset.recording.started)}
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

              <CrxTabPanel value={value} index={3}>
            <div className="">
              {rows && (
                <CRXDataTable
                  id="Audit Trail"
                  getRowOnActionClick={(val: AuditTrail) =>
                    setSelectedActionRow(val)
                  }
                  toolBarButton = {
           
                      <CRXButton  >
                        Export
                      </CRXButton>
                  
                  }
                  showToolbar={true}
                  showCountText={false}
                  columnVisibilityBar={true}
                  showHeaderCheckAll={false}
                  initialRows={reformattedRows}
                  dragVisibility={false}
                  showCheckBoxesCol={false}
                  showActionCol={false}
                  headCells={headCells}
                  dataRows={rows}
                  orderParam={order}
                  orderByParam={orderBy}
                  searchHeader={true}
                  allowDragableToList={true}
                  showTotalSelectedText={false}
                  showActionSearchHeaderCell={true}
                  showCustomizeIcon={false}


                  className=""
                  onClearAll={clearAll}
                  getSelectedItems={(v: AuditTrail[]) => setSelectedItems(v)}
                  onResizeRow={resizeRowUnitDetail}
                  onHeadCellChange={onSetHeadCells}
                  setSelectedItems={setSelectedItems}
                  selectedItems={selectedItems}
                  offsetY={190}
                />
              )}
            </div>
 
          </CrxTabPanel>


            </div>
          </div>
        </CRXColumn>
      </CRXRows>
    </div>
  );
};

export default AssetDetailsTemplate;
