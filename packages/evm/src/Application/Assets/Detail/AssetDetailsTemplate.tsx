import {
  CBXLink, CrxAccordion, CRXAlert, CRXColumn,
  CRXDataTable, CrxTabPanel, CRXTabs, CRXToaster, CRXTooltip
} from "@cb/shared";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import VideoPlayerBase from "../../../components/MediaPlayer/VideoPlayerBase";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import { DateTimeComponent } from '../../../GlobalComponents/DateTime';
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { RootState } from "../../../Redux/rootReducer";
import { EvidenceAgent, FileAgent } from "../../../utils/Api/ApiAgent";
import { Asset, Category, Evidence } from "../../../utils/Api/models/EvidenceModels";
import { dateOptionsTypes } from '../../../utils/constant';
import { AssetThumbnail } from "../AssetLister/AssetDataTable/AssetThumbnail";
import "./AssetDetailTabsMenu.scss";
import "./assetDetailTemplate.scss";

import { BlobServiceClient } from "@azure/storage-blob";
import { CRXCheckBox } from "@cb/shared";
import { Grid } from "@material-ui/core";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssetRetentionFormat } from "../../../GlobalFunctions/AssetRetentionFormat";
import {
  HeadCellProps, onClearAll, onResizeRow, onSetSearchDataValue, onSetSingleHeadCellVisibility, Order, PageiGrid, SearchObject, ValueString
} from "../../../GlobalFunctions/globalDataTableFunctions";
import { getAssetTrailInfoAsync } from "../../../Redux/AssetDetailsReducer";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { urlList, urlNames } from "../../../utils/urlList";
import ActionMenu, { downloadExeFileByFileResponse } from "../AssetLister/ActionMenu";
import { ActionMenuPlacement, AssetBucket, AssetLockUnLockErrorType } from "../AssetLister/ActionMenu/types";
import { assetdata, AssetReformated, AuditTrail, DateTimeObject, DateTimeProps, EvidenceReformated } from "./AssetDetailsTemplateModel";
import { AssetDetailRouteStateType } from "../AssetLister/AssetDataTable/AssetDataTableModel";
import { SearchModel } from "../../../utils/Api/models/SearchModel";
import { ReFormatPropsForActionMenu } from "../AssetLister/AssetDataTable/Utility";
import PDFViewer from "../../../components/MediaPlayer/PdfViewer/PDFViewer";
import { BlockLockedAssets } from "../utils/constants";
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';

const AssetDetailsTemplate = () => {
  const { state } = useLocation<AssetDetailRouteStateType>();
  const history = useHistory();
  const evidenceId: number = state.evidenceId;
  const assetId: string = state.assetId.toString();
  const assetName: string = state.assetName;
  const evidenceSearchObject: SearchModel.Evidence = state.evidenceSearchObject;

  const [expanded, isExpaned] = React.useState<string | boolean>("panel1");
  const [detailContent, setDetailContent] = useState<boolean>(false);
  const detail_view = React.useRef(null);

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

  let evidenceObj: EvidenceReformated = {
    id: evidenceId,
    categories: [],
    assetId: assetId,
    assetName: '',
    assetType: '',
    recordingStarted: ''
  };

  const dispatch = useDispatch();
  const cookies = new Cookies();
  const decoded: any = jwt_decode(cookies.get("access_token"));
  const [value, setValue] = React.useState(0);
  const [fileData, setFileData] = React.useState<any[]>([]);
  const [pdfMasterData, setPdfMasterData] = React.useState<any[]>([]);
  const [pdfChildData, setPdfChildData] = React.useState<any[]>([]);
  const [gpsFileData, setGpsFileData] = React.useState<any[]>([]);
  const [childFileData, setChildFileData] = React.useState<any[]>([]);
  const targetRef = React.useRef<typeof CRXToaster>(null);
  const [evidence, setEvidence] = React.useState<EvidenceReformated>(evidenceObj);
  //const [selectedItems, setSelectedItems] = React.useState<any>([]);
  const [videoPlayerData, setVideoPlayerData] = React.useState<assetdata[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [assetInfo, setAssetData] = React.useState<AssetReformated>(assetObj);
  const [openMap, setOpenMap] = React.useState<boolean>(false);
  const [gpsJson, setGpsJson] = React.useState<any>();
  const [sensorsDataJson, setSensorsDataJson] = React.useState<any>();
  const [apiKey, setApiKey] = React.useState<string>("");
  const [getAssetData, setGetAssetData] = React.useState<Evidence>();
  const [assetsList, setAssetList] = React.useState<Asset[]>([]);
  const [evidenceCategoriesResponse, setEvidenceCategoriesResponse] = React.useState<Category[]>([]);
  const [res, setRes] = React.useState<Asset>();
  const [GroupedFilesId, setGroupedFilesId] = React.useState<any[]>([]);
  const [fileState, setFileState] = React.useState<string>("");
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
  const [uploadedOn, setUploadedOn] = React.useState<string>("");
  const [isChecked, setIsChecked] = React.useState<boolean>();
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true);
  const tabs = [
    { label: t("Asset_Metadata_Info"), index: 0 },
    { label: t("GROUPED_AND_RELATED_ASSETS"), index: 1 },
    { label: t("Audit_Trail"), index: 2 },
  ];

  const AssetTrail: any = useSelector(
    (state: RootState) => state.assetDetailReducer.assetTrailInfo
  );

  const assetBucketBasketIsOpen: any = useSelector(
    (state: RootState) => state.assetBucketBasketSlice.isOpen
  );

  useEffect(() => {
    dispatch(setLoaderValue({ isLoading: true }))
    EvidenceAgent.getEvidence(evidenceId).then((response: Evidence) => {
      let assetListTemp: Asset[] = [response.assets.master];
      assetListTemp = [...assetListTemp, ...response.assets.children];
      /**
       *! Locked child asset only be rendered if user has 'Permission' or asset is owned by user as 'Search Type' is 'ViewOwnAssets'.
        */
      const assets = BlockLockedAssets(decoded, '', assetListTemp, "AssetDetailsTemplate");
      setAssetList(assets);
      setGetAssetData(response);
      setEvidenceCategoriesResponse(response.categories)
    }).catch(() => {
      dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
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
    if (gpsFileData && gpsFileData.length > 0) {
      const blobClient = getBlobClients(gpsFileData[0].downloadUri);
      gpsAndOverlayData(blobClient);
    }
  }, [gpsFileData]);

  useEffect(() => {
    setRows(AssetTrail)
  }, [AssetTrail]);

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
      let categories: string[] = [];
      evidenceCategoriesResponse.forEach((x: any) =>
        x.formData.map((y: any) =>
          y.fields.map((z: any) => {
            categories.push(z.value);
          })
        )
      );
      setEvidence({ ...evidence, categories: categories });
    }
  }, [evidenceCategoriesResponse]);

  useEffect(() => {
    if (getAssetData) {
      getMasterAssetFile(getAssetData?.assets.master.files.filter(x => x.filesId > 0))
      getChildAssetFile(getAssetData?.assets.children.filter(x => x?.files[0]?.filesId > 0))
    }
  }, [getAssetData]);

  useEffect(() => {
    let masterasset = getAssetData?.assets.master.files;
    if (getAssetData &&
      fileData.length == masterasset?.filter(x => ((x.type == res?.typeOfAsset) || (x.type == "Audio" && res?.typeOfAsset == "AudioOnly")) && x.filesId > 0).length &&
      getAssetData?.assets.children.filter(x => x?.files[0]?.filesId > 0 && ((x?.files[0]?.type == res?.typeOfAsset) || (x?.files[0]?.type == "Audio" && res?.typeOfAsset == "AudioOnly"))).length == childFileData.length) { // temp condition     
      dispatch(setLoaderValue({ isLoading: false, message: "" }))
      let categories: any[] = [];
      getAssetData.categories.forEach((x: any) => {
        let formDatas: any[] = [];
        x.formData.forEach((y: any) => {

          y.fields.map((z: any) => {
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

      let unit: number[] = [];
      unit.push(assetMetadata.unitId);

      let checksum: number[] = [];
      assetMetadata.files.forEach((x: any) => {
        checksum.push(x.checksum.checksum);
      });


      let size = assetMetadata.files.filter((x: any) => x.type != "GPS").reduce((a: any, b: any) => a + b.size, 0)


      let categoriesForm: string[] = [];
      getAssetData.categories.forEach((x: any) => {
        categoriesForm.push(x.record.cmtFieldName);
      });

      setAssetData({
        ...assetInfo,
        owners: owners,
        unit: unit,
        capturedDate: moment(getAssetData.createdOn).format(
          "MM / DD / YY @ HH: mm: ss"
        ),
        checksum: checksum,
        duration: milliSecondsToTimeFormat(new Date(assetMetadata.duration)),
        size: formatBytes(size, 2),
        retention: retentionSpanText(getAssetData.holdUntil, getAssetData.expireOn) ?? "",
        categories: categories,
        categoriesForm: categoriesForm,
        id: assetMetadata.id,
        assetName: assetMetadata.name,
        typeOfAsset: assetMetadata.typeOfAsset,
        status: assetMetadata.status,
        camera: assetMetadata.camera ?? ""
      });
      const data = extract(getAssetData);
      if (fileState != "Deleted") { // File state from Azure deleted - do not render video player - page crashes - ad hoc fix - need to show pop up 
        if (data[0]?.id != parseInt(assetId)) {
          let updatedData = data.filter(x => x.id == parseInt(assetId));
          updatedData = [...updatedData, ...data.filter(x => x.id != parseInt(assetId))]
          setVideoPlayerData(updatedData);
        }
        else {
          setVideoPlayerData(data);
        }
      }
    }
  }, [getAssetData, fileData, childFileData]);

  useEffect(() => {
    if (GroupedFilesId && GroupedFilesId.length > 0)
      setIsDisabled(false);
    else
      setIsDisabled(true)

  }, [isChecked, isDisabled]);

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

  const tabHandleChange = (event: any, newValue: number) => {
    setValue(newValue);
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

  const getMasterAssetFile = (dt: any) => {
    if (dt?.some((x: any) => x.type == "GPS")) {
      setOpenMap(true);
    }
    dt?.map((template: any, i: number) => {
      let responseResult: any = null;
      FileAgent.getFile(template.filesId).then((response) => {
        setFileState(response.state)
        if (template.type != "GPS") {
          let uploadCompletedOnFormatted = response.history.uploadCompletedOn ? moment(response.history.uploadCompletedOn).format("MM / DD / YY @ HH: mm: ss") : "";
          setUploadedOn(uploadCompletedOnFormatted)
        }
      });
      FileAgent.getDownloadFileUrl(template.filesId).then((response: string) => response).then((response: any) => {
        if (template.type == "GPS") {
          setGpsFileData([...gpsFileData, {
            filename: template.name,
            fileurl: template.url,
            type: template.type,
            downloadUri: response
          }])
        }
        else if ((template.type == res?.typeOfAsset) || (template.type == "Audio" && res?.typeOfAsset == "AudioOnly")) {
          setFileData([...fileData, {
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            downloadUri: response
          }])
        }
        else if (res?.typeOfAsset == "Doc" && template.type == "PDFDoc") {
          setPdfMasterData([...fileData, {
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            downloadUri: response
          }])
        }
      }).catch(e => {
        if (template.type != "GPS") {
          setFileData([...fileData, {
            filename: template.name,
            fileurl: template.url,
            fileduration: template.duration,
            downloadUri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          }])
        }
      });
    })
  }
  const getChildAssetFile = (dt: any) => {
    let fileDownloadUrls: any = [];
    let filePdfDownloadUrls: any = [];
    dt?.map((ut: any, i: number) => {
      ut?.files.map((template: any, j: number) => {
        FileAgent.getDownloadFileUrl(template.filesId).then((response: string) => response).then((response: any) => {
          if ((template.type == res?.typeOfAsset) || (template.type == "Audio" && res?.typeOfAsset == "AudioOnly")) {
            fileDownloadUrls.push({
              filename: template.name,
              fileurl: template.url,
              fileduration: template.duration,
              downloadUri: response
            })
            setChildFileData([...fileDownloadUrls])
          }
          else if (res?.typeOfAsset == "Doc" && template.type == "PDFDoc") {
            filePdfDownloadUrls.push({
              filename: template.name,
              fileurl: template.url,
              fileduration: template.duration,
              downloadUri: response
            })
            setPdfChildData([...filePdfDownloadUrls])
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
        for (let i = 0; i < v.length; i++) {
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


  const extract = (row: any) => {
    let rowdetail: assetdata[] = [];
    let rowdetail1: assetdata[] = [];
    const masterduration = row.assets.master.duration;
    const camera = row.assets.master.camera;
    const file = fileData;
    let recording = row.assets.master.recording;
    const bookmarks = row.assets.master.bookMarks ?? [];
    const notes = row.assets.master.notes ?? [];
    const id = row.assets.master.id;
    const unitId = row.assets.master.unitId;
    const typeOfAsset = row.assets.master.typeOfAsset;
    const name = row.assets.master.name;
    const status = row.assets.master.files[0]?.filesId > 0 ? "Available" : "";
    const buffering = row.assets.master.buffering;
    const bufferingpost = buffering ? buffering?.post : 0;
    const bufferingpre = buffering ? buffering?.pre : 0;
    recording = {
      ...recording,
      ended: new Date(new Date(recording.ended).getTime() + bufferingpost),
      started: new Date(new Date(recording.started).getTime() - bufferingpre),
    }
    let myData: assetdata = { id: id, files: file, assetduration: masterduration, assetbuffering: buffering, recording: recording, bookmarks: bookmarks, unitId: unitId, typeOfAsset: typeOfAsset, name: name, notes: notes, camera: camera, status: status }
    rowdetail.push(myData);
    rowdetail1 = row.assets.children.map((template: any, i: number) => {
      template.recording = {
        ...template.recording,
        ended: new Date(new Date(template.recording?.ended).getTime() + template.buffering?.post),
        started: new Date(new Date(template.recording?.started).getTime() - template.buffering?.pre),
      }

      return {
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
    })
    for (let x = 0; x < rowdetail1.length; x++) {
      rowdetail.push(rowdetail1[x])
    }
    return rowdetail
  }

  const refresh = () => {
    window.location.reload();
  }

  const newRound = (x: any, y: any) => {
    history.push(urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url, {
      evidenceId: evidenceId,
      assetId: x,
      assetName: y,
      evidenceSearchObject: evidenceSearchObject
    })
    history.go(0)
  }

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: `${t("Seq. No")}`,
      id: "seqNo",
      align: "right",
      searchComponent: searchText,
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      minWidth: '211',
      maxWidth: '300'
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
      maxWidth: '485'
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
      maxWidth: '485'
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
      maxWidth: '485'
    }
  ]);

  const clearAll = () => {
    const clearButton: any = document.getElementsByClassName(
      "MuiAutocomplete-clearIndicator"
    )[0];
    clearButton && clearButton.click();
    setOpen(false);
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
  }

  const gotoSeeMoreView = (e: any, targetId: any) => {
    detailContent == false ? setDetailContent(true) : setDetailContent(false);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  const assetSelectionHanlder = (e: any, filesId: any) => {
    setIsChecked(e.target.checked)
    if (e.target.checked) {
      setGroupedFilesId([...GroupedFilesId, {
        filesId
      }])
    }
    else {
      setGroupedFilesId(GroupedFilesId.filter((x: any) => x.filesId != filesId));
    }
  }

  const downloadAuditTrail = () => {
    if (rows && assetInfo) {
      const head = [[t('Seq No'), t('Captured'), t('Username'), t('Activity')]];
      let data: any[] = [];
      let arrS: any[] = [];
      rows.forEach((x: any) => {
        arrS.push(x.seqNo);
        arrS.push((new Date(x.performedOn)).toLocaleString());
        arrS.push(x.userName);
        arrS.push(x.notes);
        data.push(arrS);
        arrS = [];
      }
      );

      let CheckSum = assetInfo.checksum ? assetInfo.checksum.toString() : "";
      let assetId = assetInfo.id ? assetInfo.id.toString() : "";


      const doc = new jsPDF()
      doc.setFontSize(11)
      doc.setTextColor(100)
      let yaxis1 = 14;
      let yaxis2 = 70;
      let xaxis = 25;

      doc.text(t("CheckSum") + ":", yaxis1, xaxis)
      doc.text(CheckSum, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Asset Id") + ":", yaxis1, xaxis)
      doc.text(assetId, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Asset Type") + ":", yaxis1, xaxis)
      doc.text(assetInfo.typeOfAsset, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Asset Status") + ":", yaxis1, xaxis)
      doc.text(assetInfo.status, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Username") + ":", yaxis1, xaxis)
      doc.text(assetInfo.owners.join(", "), yaxis2, xaxis)
      xaxis += 5;

      let categoriesString = "";
      let tempxaxis = 0;
      assetInfo.categories.forEach((x: any, index: number) => {
        let formData = x.formDatas.map((y: any, index1: number) => {
          if (index1 > 0) {
            tempxaxis += 5
          }
          return y.key + ": " + y.value + "\n";
        })
        categoriesString += (x.name ? x.name : "") + ":    " + formData + "\n";
        if (index > 0) {
          tempxaxis += 5
        }
      }
      )
      doc.text(t("Categories") + ":", yaxis1, xaxis)
      doc.text(categoriesString, yaxis2, xaxis)
      xaxis += tempxaxis + 5;

      doc.text(t("Camera Name") + ":", yaxis1, xaxis)
      doc.text(assetInfo.camera, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Captured") + ":", yaxis1, xaxis)
      doc.text(assetInfo.capturedDate, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Uploaded") + ":", yaxis1, xaxis)
      doc.text(uploadedOn, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Duration") + ":", yaxis1, xaxis)
      doc.text(assetInfo.duration, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Size") + ":", yaxis1, xaxis)
      doc.text(assetInfo.size, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Retention") + ":", yaxis1, xaxis)
      doc.text(assetInfo?.retention, yaxis2, xaxis)
      xaxis += 5;

      autoTable(doc, {
        startY: xaxis,
        head: head,
        body: data,
        didDrawCell: (data: any) => {
          console.log(data.column.index)
        },
      })
      doc.save('ASSET ID_Audit_Trail.pdf');
    }
  }

  const DownloadFile = () => {

    if (GroupedFilesId !== null && GroupedFilesId !== undefined) {
      if (GroupedFilesId.length == 1) {
        console.log("1 download");
        console.log(GroupedFilesId);
        FileAgent.getDownloadFileUrl(GroupedFilesId[0].filesId)
          .then((response) => {
            downloadFileByURLResponse(response);
          })
          .catch(() => {
            targetRef.current.showToaster({ message: t("Unable_to_download_file"), variant: 'error', duration: 5000, clearButtton: true });
          });

      } else {
        console.log("multi download");
        let fileRequest = GroupedFilesId.map((x: any) => {
          return { fileRecId: x.filesId, accessCode: "access code" }
        });
        let multiExport = { fileRequest: fileRequest, operationType: 1 }
        console.log(fileRequest);
        targetRef.current.showToastMsg?.({
          message: t("files will be downloaded shortly"),
          variant: "success",
          duration: 5000,
        });
        FileAgent.getMultiDownloadFileUrl(multiExport)
          .then((response) => {

            downloadExeFileByFileResponse(response, "getacvideo-multidownloader");
            targetRef.current.showToastMsg?.({
              message: t("file downloaded successfully"),
              variant: "success",
              duration: 5000,
            });
          })
          .catch(() => {
            targetRef.current.showToastMsg?.({
              message: t("Unable_to_download_file"),
              variant: "error",
              duration: 5000,
            });
          });

      }

    }
  }


  const downloadFileByURLResponse = (url: string) => {
    const link = document.createElement("a");
    // Give url to link.
    link.href = url;
    //set download attribute to that link.
    link.setAttribute("download", ``);
    // Append to html link element page.
    document.body.appendChild(link);
    // start download.
    link.click();
    // Clean up and remove the link.
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  const assetDisplay = (videoPlayerData: any, evidenceId: any, gpsJson: any, sensorsDataJson: any, openMap: boolean, apiKey: any) => {
    let availableAssets = videoPlayerData.filter((x: any) => x.status == "Available");
    if (availableAssets.length > 0) {
      let videos = availableAssets.filter((x: any) => x.typeOfAsset == "Video" || x.typeOfAsset == "AudioOnly" || x.typeOfAsset == "Audio");

      switch (videoPlayerData[0]?.typeOfAsset) {
        case 'AudioOnly':
        case 'Video':
          return videos.length > 0 ? <VideoPlayerBase data={videos} evidenceId={evidenceId} gpsJson={gpsJson} sensorsDataJson={sensorsDataJson} openMap={openMap} apiKey={apiKey} guestView={false} /> :
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
        case 'Audio':
          return <audio controls={true} src={availableAssets[0]?.files[0]?.downloadUri}></audio>
        case 'Doc':
          return <>
            {(pdfMasterData.length > 0 || pdfChildData.length > 0) && <PDFViewer pdfMasterData={pdfMasterData} pdfChildData={pdfChildData} />}
          </>
        default:
          return <></>;
      }
    }
    else {
      return <>
        <div className="_player_video_uploading">
          <div className="layout_inner_container">
            {/* Please make error message dynamic */}
            {assetInfo.id && <div className="text_container_video">Evidence is not available!</div>}
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

  const actionBucketClass = assetBucketBasketIsOpen ? "actionBucketIndex" : "";
  return (
    <div id="_asset_detail_view_idx" className="_asset_detail_view switchLeftComponents">
      <CRXToaster ref={targetRef} />
      <div id="videoPlayer_with_category_view" className={`CRXAssetDetail ${actionBucketClass}`}>
        {/* <div className="asset_date_categories">
              <span><strong>{t("Captured Date")}</strong> : {assetInfo.capturedDate}</span>
              <span><strong>{t("Categories")}</strong> : {assetInfo.categoriesForm}</span>
            </div> */}
        {/** maria told me the its not showing here its should be come in meta data see panel */}
        <ActionMenu
          row={ReFormatPropsForActionMenu(evidenceSearchObject, Number(assetId))}
          actionMenuPlacement={ActionMenuPlacement.AssetDetail}
        />

        <CBXLink children="Exit" href={`${urlList.filter((item: any) => item.name === urlNames.assets)[0].url}`} />
      </div>

      {assetDisplay(videoPlayerData, evidenceId, gpsJson, sensorsDataJson, openMap, apiKey)}

      {detailContent
        && <div className="topBorderForDetail"></div>
      }

      <div className="asset_detail_tabs CRX_detail_tabs" id="detail_view" ref={detail_view}>

        <CRXTabs value={value} onChange={tabHandleChange} tabitems={tabs} />

        <div className="list_data_main CRX_accordion_main">
          <CrxTabPanel value={value} index={0}>

            <div className="list_data">
              <Grid container spacing={0}>
                <Grid item xs={4} className="list_para" >
                  <div className="asset_MDI_label">{t("Checksum")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data boldText asset_check_sum">{assetInfo.checksum}</div>
                  <p className="list_Copy_text" onClick={() => { navigator.clipboard.writeText(assetInfo.checksum.toString()) }}>Copy</p>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Asset ID")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{assetInfo.assetName}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Asset Type")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{assetInfo.typeOfAsset}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Asset Status")}</div>

                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{assetInfo.status}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Username")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{assetInfo.owners.join(',')}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Categories")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">
                    {
                      assetInfo.categories.map((x: any) =>
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={3}>
                              <span style={{ fontWeight: 700 }}>{x.name} :</span>
                            </Grid>
                            <Grid item xs={9}>
                              {x.formDatas.map((x: any) =>
                                <Grid item xs={9}>
                                  <span> {x.key + " : " + x.value} </span>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>

                        </>)
                    }
                  </div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Camera Name")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{assetInfo.camera}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Captured")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{assetInfo.capturedDate}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Uploaded")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{uploadedOn}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Duration")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{assetInfo.duration}</div>
                </Grid>



                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Size")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{assetInfo.size}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Retention")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{assetInfo?.retention}</div>
                </Grid>
              </Grid>
            </div>
          </CrxTabPanel>

          <CrxTabPanel value={value} index={1}>
            <div className="asset_export_button_group">
              <button className="iconButton_global" disabled={isDisabled} onClick={() => DownloadFile()}>
                <i className="far fa-download"></i>
                Download
              </button>
            </div>

            <CrxAccordion
              title={t("Grouped_Assets")}
              id="accorIdx1"
              className="crx-accordion"
              ariaControls="Content1"
              name="panel1"
              isExpanedChange={isExpaned}
              expanded={expanded === "panel1"}
            >
              <div className="asset_group_tabs_data">
                <div className="asset_group_tabs_data_row">
                  {assetsList.filter(x => x.id != parseInt(assetId)).map((asset: any, index: number) => {
                    let lastChar = asset.name.substr(asset.name.length - 4);
                    return (
                      <>
                        <div className="asset_group_tabs_data_col" key={index}>
                          <div className="_detail_checkBox_column">
                            <CRXCheckBox
                              checked={isChecked}
                              lightMode={true}
                              className='asse_detail_tab_checkBox '
                              onChange={(e: any) => assetSelectionHanlder(e, asset.files[0].filesId)}
                            />
                          </div>
                          <div className="_detail_thumb_column">
                            <AssetThumbnail
                              assetName={asset.assetName}
                              assetType={asset.typeOfAsset}
                              className={"CRXPopupTableImage  CRXPopupTableImageUi"}
                              onClick={() => newRound(asset.id, asset.name)}
                            />
                          </div>
                          <div className="_asset_detail_link_meta">
                            <Link
                              className="linkColor"
                              onClick={refresh}
                              to={{
                                pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
                                state: {
                                  evidenceId: evidenceId,
                                  assetId: asset.id,
                                  assetName: asset.name,
                                  evidenceSearchObject: evidenceSearchObject
                                } as AssetDetailRouteStateType,
                              }}>

                              <div id="middletruncate" data-truncate={lastChar}>
                                {asset.name}
                              </div>
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
                                <div className="_asset_video_type_detail">
                                  <label className="CRXPopupDetailFontSize">
                                    {asset.typeOfAsset}
                                  </label>
                                </div>
                              )}
                              <label className="CRXPopupDetailFontSize">
                                {asset.recording && dateDisplayFormat(asset.recording.started)}
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </CrxAccordion>
          </CrxTabPanel>

          <CrxTabPanel value={value} index={2}>
            <div className="asset_detail_AT_table">
              {rows && (
                <CRXDataTable
                  id="Audit Trail"
                  getRowOnActionClick={(val: AuditTrail) =>
                    setSelectedActionRow(val)
                  }
                  toolBarButton={
                    <div className="auditTrailButton">
                      <button className="iconButton_global" onClick={() => downloadAuditTrail()}>
                        <i className="far fa-download"></i>
                        Export
                      </button>
                    </div>
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
                  className="asset_detail_AT_dataTable"
                  onClearAll={clearAll}
                  getSelectedItems={(v: AuditTrail[]) => setSelectedItems(v)}
                  onResizeRow={resizeRowUnitDetail}
                  onHeadCellChange={onSetHeadCells}
                  setSelectedItems={setSelectedItems}
                  selectedItems={selectedItems}
                  offsetY={51}
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
