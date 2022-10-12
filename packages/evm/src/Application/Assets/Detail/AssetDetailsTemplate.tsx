import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import "./assetDetailTemplate.scss";
import Restricted from "../../../ApplicationPermission/Restricted";
import { DateTimeComponent } from '../../../GlobalComponents/DateTime';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { addAssetToBucketActionCreator } from "../../../Redux/AssetActionReducer";
import FormContainer from "../AssetLister/Category/FormContainer";
import { dateOptionsTypes } from '../../../utils/constant';
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
import "./AssetDetailTabsMenu.scss";
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
  CRXTooltip,
  CBXLink
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
  PageiGrid
} from "../../../GlobalFunctions/globalDataTableFunctions";
import { AssetBucket, AssetLockUnLockErrorType } from "../AssetLister/ActionMenu/types";
import { getAssetTrailInfoAsync } from "../../../Redux/AssetDetailsReducer";
import { getAssetSearchInfoAsync } from "../../../Redux/AssetSearchReducer";
import { Grid } from "@material-ui/core";
import { SearchType } from "../utils/constants";
import { BlobServiceClient } from "@azure/storage-blob";
import { AssetRetentionFormat } from "../../../GlobalFunctions/AssetRetentionFormat";
import { setLoaderValue } from "../../../Redux/loaderSlice";

const AssetDetailsTemplate = (props: any) => {
  
  const historyState = props.location.state;
  const history = useHistory();
  let evidenceId: number = historyState.evidenceId;
  let assetId: string = historyState.assetId;
  let assetName: string = historyState.assetName;
  const [expanded, isExpaned] = React.useState<string | boolean>("panel1");
  const [detailContent, setDetailContent] = useState<boolean>(false);
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
    sequenceNumber: string;
    captured: any;
    username: string;
    activity: string
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
    size: string;
    retention: string;
    categoriesForm: string[];
    id?: number;
    typeOfAsset: string;
    status: string;
    captured: string;
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
    captured: "",
    camera: ""
  };
  const dispatch = useDispatch();
  let addToAssetBucketDisabled: boolean = false;
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );

  const [value, setValue] = React.useState(0);
  const [fileData, setFileData] = React.useState<any[]>([]);
  const [gpsFileData, setGpsFileData] = React.useState<any[]>([]);
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
  const [sensorsDataJson, setSensorsDataJson] = React.useState<any>();
  const [apiKey, setApiKey] = React.useState<string>("");
  const [getAssetData, setGetAssetData] = React.useState<Evidence>();
  const [evidenceCategoriesResponse, setEvidenceCategoriesResponse] = React.useState<Category[]>([]);
  const [res, setRes] = React.useState<Asset>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string>('');
  const [error, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [order] = React.useState<Order>("asc");
  const { t } = useTranslation<string>();
  const [orderBy] = React.useState<string>("name");
  const [open, setOpen] = React.useState<boolean>(false);
  const [rows, setRows] = React.useState<AuditTrail[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<AuditTrail>();
  const [selectedItems, setSelectedItems] = React.useState<AuditTrail[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<AuditTrail[]>();
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage
  });
  const [assetLockUnLockError, setAssetLockUnLockError] = React.useState<AssetLockUnLockErrorType>({
    isError: false,
    errorMessage: ''
  });
  const handleChange = () => {
    setOpenForm(true);
  };
  const AssetTrail: any = useSelector(
    (state: RootState) => state.assetDetailReducer.assetTrailInfo
  );

  useEffect(() => {
    dispatch(setLoaderValue({isLoading: true}))
    EvidenceAgent.getEvidence(evidenceId).then((response: Evidence) => {
      setGetAssetData(response);
      setEvidenceCategoriesResponse(response.categories)
    }).catch(() => {
      dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
    });
    const getAssetUrl = "/Evidences/" + evidenceId + "/Assets/" + assetId;
    EvidenceAgent.getAsset(getAssetUrl).then((response: Asset) => setRes(response));
    dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + assetName }));
    dispatch(getAssetTrailInfoAsync({ evidenceId: evidenceId, assetId: assetId }));
    setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : "");  //put this in env.dev REACT_APP_GOOGLE_MAPS_API_KEY = AIzaSyAA1XYqnjsDHcdXGNHPaUgOLn85kFaq6es
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, []);

  useEffect(() => {
    if(gpsFileData && gpsFileData.length>0){
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

  const gpsAndOverlayData = async (blobClient : any) => {
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded : any = await blobToString(await downloadBlockBlobResponse.blobBody);
    if(downloaded){
      let downloadedData = downloaded.replace(/'/g, '"')
      let gpsdata = JSON.parse(downloadedData).GPS;
      let sensorsData = JSON.parse(downloadedData).Sensors;
      debugger;
      gpsdata.forEach((x:any)=>
        {
          x.logTime = getUnixTimewithZeroinMillisecond(new Date(x.logTime).getTime());
        }
      );
      sensorsData.forEach((x:any)=>
        {
          x.logTime = getUnixTimewithZeroinMillisecond(new Date(x.logTime).getTime());
        }
      );
      let distinctgpsdata = gpsdata.filter((value : any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
        t.logTime === value.logTime
      )));
      let distinctsensorsData = sensorsData.filter((value : any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
        t.logTime === value.logTime
      )));

      if(gpsdata.length>0){setGpsJson(distinctgpsdata);}
      if(sensorsData.length>0){setSensorsDataJson(distinctsensorsData)}
      console.log("Downloaded blob content", gpsdata);
    }
  
    // [Browsers only] A helper method used to convert a browser Blob into string.
    async function blobToString(blob: any) {
      const fileReader = new FileReader();
      return new Promise((resolve, reject) => {
        fileReader.onloadend = (ev) => {
          if(ev){
            resolve(ev.target?.result);
          }
        };
        fileReader.onerror = reject;
        fileReader.readAsText(blob);
      });
    }
  }

  const getUnixTimewithZeroinMillisecond = (time: number) => {
    let firsthalf = time.toString().substring(0,10);
    let last3digits = time.toString().substring(10);
    if(Number(last3digits)>0){
      let Nlast3digits = "000";
      return Number(firsthalf+Nlast3digits);
    }
    return time;
  }


  useEffect(() => {
    setRows(AssetTrail)
  }, [AssetTrail]);


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
    if(getAssetData){
      getMasterAssetFile(getAssetData?.assets.master.files)
      getChildAssetFile(getAssetData?.assets.children)
    }
  }, [getAssetData]);

  const retentionSpanText = (holdUntil?: Date, expireOn?: Date) => {
    if(holdUntil)
    {
      return AssetRetentionFormat(holdUntil);
    }
    else if(expireOn)
    {
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

  useEffect(() => {
    let masterasset = getAssetData?.assets.master.files.filter((x:any)=> x.type == "Video");
    if(getAssetData && fileData.length == masterasset?.length && getAssetData?.assets.children.length == childFileData.length)
    { // temp condition
        dispatch(setLoaderValue({isLoading: false, message: "" }))
        var categories: string[] = [];
        getAssetData.categories.forEach((x: any) =>
          x.formData.forEach((y: any) =>
            y.fields.forEach((z: any) => {
              categories.push(z.key);
            })
          )
        );

        var owners: any[] = getAssetData.assets.master.owners.map((x: any) => (x.record.find((y: any) => y.key == "UserName")?.value) ?? "");

        var unit: number[] = [];
        unit.push(getAssetData.assets.master.unitId);

        var checksum: number[] = [];
        getAssetData.assets.master.files.forEach((x: any) => {
          checksum.push(x.checksum.checksum);
        });


        let size = getAssetData.assets.master.files.reduce((a, b) => a + b.size, 0)


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
          duration: milliSecondsToTimeFormat(new Date(getAssetData.assets.master.duration)),
          size: formatBytes(size* 1024 * 1024, 2),
          retention: retentionSpanText(getAssetData.holdUntil, getAssetData.expireOn) ?? "",
          categories: categories,
          categoriesForm: categoriesForm,
          id: getAssetData?.assets?.master?.id,
          typeOfAsset: getAssetData?.assets?.master?.typeOfAsset,
          status: getAssetData?.assets?.master?.status,
          captured: moment(getAssetData?.assets?.master?.recording?.started).format(
            "YYYY / MM / DD HH:mm:ss"
          ),
          camera: getAssetData?.assets?.master?.camera ?? ""
        });
        const data = extract(getAssetData);
        setVideoPlayerData(data);
    }
  },[getAssetData, fileData, childFileData]);

  function getMasterAssetFile(dt: any) {
    dt?.map((template: any, i: number) => {
      FileAgent.getDownloadFileUrl(template.filesId).then((response: string) => response).then((response: any) => {
        if(template.type == "GPS"){
          setGpsFileData([...gpsFileData, {
            filename: template.name,
            fileurl: template.url,
            type: template.type,
            downloadUri: response
          }])
        }
        else if(template.type == "Video"){
          setFileData([...fileData, {
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            downloadUri: response
          }])
        }
      }).catch(e => {
        setFileData([...fileData, {
          filename: template.name,
          fileurl: template.url,
          fileduration: template.duration,
          downloadUri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }])
      });
    })
  }
  function getChildAssetFile(dt: any) {
    let fileDownloadUrls : any = [];  
    dt?.map((ut: any, i: number) => {
      ut?.files.map((template: any, j: number) => {
        FileAgent.getDownloadFileUrl(template.filesId).then((response: string) => response).then((response: any) => {
          if(template.type == "Video"){
            fileDownloadUrls.push({
              filename: template.name,
              fileurl: template.url,
              fileduration: template.duration,
              downloadUri: response
            })
            setChildFileData([...fileDownloadUrls])
          }
        }).catch(e => {
          fileDownloadUrls.push({
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            downloadUri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          })
          setChildFileData([...fileDownloadUrls])
        })
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
        camera: template.camera
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
    { label: t("Asset_Metadata_Info"), index: 0 },
    { label: t("GROUPED_AND_RELATED_ASSETS"), index: 1 },
    { label: t("Audit_Trail"), index: 2 },
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
      id: "recId",
      align: "right",
      searchComponent: searchText,
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      minWidth: '211',
      maxWidth: '211'
    },
    {
      label: `${t("Captured")}`,
      id: "performedOn",
      align: "right",
      dataComponent: dateDisplayFormat,
      //  dataComponent: (e: string) => textDisplay(e, " "),
      searchFilter: true,
      searchComponent: searchDate,
      sort: false,
      minWidth: '313',
      maxWidth: '313'
    },
    {
      label: `${t("Username")}`,
      id: "userName",
      align: "right",
      searchFilter: true,
      searchComponent: searchText,
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      minWidth: '314',
      maxWidth: '314'
    },
    {
      label: `${t("Activity")}`,
      id: "notes",
      align: "right",
      searchFilter: true,
      searchComponent: searchText,
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      minWidth: '415',
      maxWidth: '415'
    },
    // {
    //   label: `${t("Action")}`,
    //   id: "action",
    //   align: "right",
    //   searchFilter: true,
    //   searchComponent: searchText,
    //   dataComponent: (e: string) => textDisplay(e, " "),
    //   sort: true
    // }
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
      userRecId: parseInt(localStorage.getItem('User Id') ?? "0"),
      operation: "Lock"
    });
    const _body = JSON.stringify(_requestBody);
    EvidenceAgent.LockOrUnLockAsset(_body).then(() => {
      setSuccessMessage(t('The_asset_are_locked'));
      setSuccess(true);
      setTimeout(() => {
        dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
        setOpenRestrictAccessDialogue(false);
        setSuccess(false);
      }, 2000);
    })
      .catch((error) => {
        let errorMessage = '';
        const err = error as AxiosError;
        if (err.request.status === 409) {
          errorMessage = t('The_asset_is_already_locked');
        } else {
          errorMessage = t('We_re_sorry_The_asset_cant_be_locked_Please_retry_or_contact_your_Systems_Administrator');
        }
        setAssetLockUnLockError({
          errorMessage: errorMessage,
          isError: true
        });
      });
  }

  const RestrictAccessClickHandler = () => setOpenRestrictAccessDialogue(true);


  const gotoSeeMoreView = (e: any, targetId: any) => {
    detailContent == false ? setDetailContent(true) : setDetailContent(false);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  return (
    <div id="_asset_detail_view_idx" className="_asset_detail_view switchLeftComponents">
      <div id="videoPlayer_with_category_view" className="CRXAssetDetail">
        {/* <div className="asset_date_categories">
          <span><strong>{t("Captured Date")}</strong> : {assetInfo.capturedDate}</span>
          <span><strong>{t("Categories")}</strong> : {assetInfo.categoriesForm}</span>
        </div> */} {/** maria told me the its not showing here its should be come in meta data see panel */}
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
        <CBXLink  children = "Exit"   onClick={() => history.goBack()} />
      </div>
      {success && <CRXAlert message={successMessage} alertType='toast' open={true} />}
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
        isError={assetLockUnLockError.isError}
        errorMessage={assetLockUnLockError.errorMessage}
      />

      
      
          {videoPlayerData.length > 0 && videoPlayerData[0]?.typeOfAsset === "Video" && <VideoPlayerBase data={videoPlayerData} evidenceId={evidenceId} gpsJson={gpsJson} sensorsDataJson={sensorsDataJson} openMap={openMap} apiKey={apiKey} />}
          {/* </div> */}
          {detailContent && <div className="topBorderForDetail"></div>}

       
          <div className="asset_detail_tabs" id="detail_view" ref={detail_view}>
            
            <CRXTabs value={value} onChange={tabHandleChange} tabitems={tabs} />
            <div className="list_data_main">
              <CrxTabPanel value={value} index={0}>
                
           
              <div className="list_data">
                <Grid container spacing={2}>
                    <Grid item xs={4} className="list_head list_head_dark " >
                        <h1>{t("CheckSum")}:</h1>
                    </Grid>
                    <Grid item xs={8} className="list_para">
                        <span>{assetInfo.checksum}</span>
                    </Grid>


                    <Grid item xs={4} className="list_head">
                        <h1>{t("Asset Id")}:</h1> 
                    </Grid>
                    <Grid item xs={8} className="list_para">
                        <span>{assetInfo.id}</span>
                    </Grid>


                    <Grid item xs={4} className="list_head">
                        <h1>{t("Asset Type")}:</h1>
                    </Grid>
                    <Grid item xs={8} className="list_para">
                        <span>{assetInfo.typeOfAsset}</span>
                    </Grid>


                    <Grid item xs={4} className="list_head">
                    <h1>{t("Asset Status")}:</h1> 
                        
                    </Grid>
                    <Grid item xs={8} className="list_para">
                        <span>{assetInfo.status}</span>
                    </Grid>


                    <Grid item xs={4} className="list_head">
                      <h1>{t("Username")}:</h1>
                    </Grid>
                    <Grid item xs={8} className="list_para">
                        <span>{assetInfo.owners.join(', ')}</span>
                    </Grid>


                    <Grid item xs={4} className="list_head">
                        <h1>{t("Categories")}:</h1> 
                    </Grid>
                    <Grid item xs={8} className="list_para">
                        <span>{assetInfo.categories}</span>
                    </Grid>


                    <Grid item xs={4} className="list_head">
                      <h1>{t("Camera Name")}:</h1> 
                    </Grid>
                    <Grid item xs={8} className="list_para">
                          <span>{assetInfo.camera}</span>
                    </Grid>


                    <Grid item xs={4} className="list_head">
                      <h1>{t("Captured")}:</h1> 
                    </Grid>
                    <Grid item xs={8} className="list_para">
                          <span>{assetInfo.captured}</span>
                    </Grid>


                    <Grid item xs={4} className="list_head">
                      <h1>{t("Duration")}:</h1> 
                    </Grid>
                    <Grid item xs={8} className="list_para">
                          <span>{assetInfo.duration}</span>
                    </Grid>



                    <Grid item xs={4} className="list_head">
                          <h1>{t("Size")}:</h1> 
                    </Grid>
                    <Grid item xs={8} className="list_para">
                        <span>{assetInfo.size}</span>
                    </Grid>


                    <Grid item xs={4} className="list_head">
                          <h1>{t("Retention")}:</h1>
                    </Grid>
                    <Grid item xs={8} className="list_para">
                        <span>{assetInfo?.retention}</span>
                    </Grid>

                </Grid>
              </div>
              
              </CrxTabPanel>

              <CrxTabPanel value={value} index={1}>

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

              <CrxTabPanel value={value} index={2}>
                <div className="asset_detail_tab_third">
                  {rows && (
                    <CRXDataTable
                      id="Audit Trail"
                      getRowOnActionClick={(val: AuditTrail) =>
                        setSelectedActionRow(val)
                      }
                      toolBarButton={
                        <CRXButton className="asset_export_button">
                          <i className="far fa-download"></i>
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
                      offsetY={0}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      setPage={(page: any) => setPage(page)}
                      setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                      totalRecords={500}
                    />
                  )}
                </div>

              </CrxTabPanel>


            </div>
          </div>
        
    </div>
  );
};

export default AssetDetailsTemplate;
