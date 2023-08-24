import { CRXDataTable,CBXMultiSelectForDatatable, CRXToaster, CRXTooltip, CBXMultiCheckBoxDataFilter, CRXTruncation,CRXButton } from "@cb/shared";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next"; 
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import { DateTimeComponent } from "../../../../GlobalComponents/DateTime";
import multitextDisplay from "../../../../GlobalComponents/Display/MultiTextDisplay";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { AssetRetentionFormat } from "../../../../GlobalFunctions/AssetRetentionFormat";
import { assetDurationFormat, assetSizeFormat } from "../../../../GlobalFunctions/AssetSizeFormat";
import {dateDisplayFormat} from "../../../../GlobalFunctions/DateFormat";
import {
  AssetState,
  AssetStatus,
  HeadCellProps, onClearAll, onDateCompare, onMultipleCompare,  onTextMultiCompare,
  onMultiToMultiCompare, onResizeRow, onSaveHeadCellData, onSetHeadCellVisibility, onSetSearchDataValue, onSetSingleHeadCellVisibility, onTextCompare, Order, SearchObject, ValueString
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import { addNotificationMessages } from "../../../../Redux/notificationPanelMessages";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import { NotificationMessage } from "../../../Header/CRXNotifications/notificationsTypes";
import ActionMenu from "../ActionMenu";
import { ActionMenuPlacement } from "../ActionMenu/types";
import { AssetDetailRouteStateType, DateTimeObject, DateTimeProps, MasterMainProps, renderCheckMultiselect } from "./AssetDataTableModel";
import { AssetThumbnail } from "./AssetThumbnail";
import DetailedAssetPopup from "./DetailedAssetPopup";
import "./index.scss";
import { RootState } from "../../../../Redux/rootReducer";
import { urlList, urlNames } from "../../../../utils/urlList";
import { checkIndefiniteDate } from "./Utility";
import { getToken } from "./../../../../Login/API/auth";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import { CasesAgent } from "../../../../utils/Api/ApiAgent";
import { setLoaderValue } from "../../../../Redux/loaderSlice";
import { CRXModalDialog } from '@cb/shared';

const thumbTemplate = (assetId: string, evidence: SearchModel.Evidence) => {
  let {assetType, assetName} = evidence.masterAsset;
  let fileType = evidence.masterAsset?.files &&  evidence.masterAsset?.files[0]?.type;
  let accessCode = evidence.masterAsset?.files &&  evidence.masterAsset?.files[0]?.accessCode;
  return <AssetThumbnail assetName={assetName} assetType={assetType} fileType={fileType} accessCode={accessCode} fontSize="61pt" evidence={evidence} isAssetLister={true}/>
};

const assetTypeText = (classes: string,evidence: SearchModel.Evidence) => {
  let assetType = evidence.masterAsset.assetType;
  let fileType = evidence.masterAsset?.files &&  evidence.masterAsset?.files[0]?.type;
  if (assetType != undefined || assetType != null) {
    if (fileType != undefined || fileType != null) {
      return <div className={"dataTableText " + classes}>{fileType}</div>;
    }
    else 
    {
      return <div className={"dataTableText " + classes}>{assetType}</div>;
    }
  }
  else
  {
    return <div className={"dataTableText " + classes}></div>;
  }
};

const assetNameTemplate = (assetName: string, evidence: SearchModel.Evidence) => {
  let masterAsset = evidence.masterAsset;
  
  let dataLink = 
  <>
    <Link
      className="linkColor"
      to={{
        pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
        state: {
          evidenceId: evidence.id,
          assetId: masterAsset.assetId,
          assetName: assetName,
          evidenceSearchObject: evidence
        } as AssetDetailRouteStateType,
      }}
    >
      <div className="assetName">
      <CRXTruncation placement="top" content={assetName} />
      </div>
    </Link>
    <DetailedAssetPopup asset={evidence.asset} row={evidence} relatedAssets={evidence.relatedAssets} />
  </>
  return dataLink;
    
};

const MasterMain: React.FC<MasterMainProps> = ({
  rowsData,
  dateOptionType,
  dateTimeDetail,
  showDateCompact,
  advanceSearchText,
  searchResultText,
  showSearchPanel
}) => {
  const toasterRef = useRef<typeof CRXToaster>(null);
  const { t } = useTranslation<string>();
  let reformattedRows: SearchModel.Evidence[] = [];

  const retentionSpanText = (_: string, evidence: SearchModel.Evidence): JSX.Element => {
    let date: Date;
    if (evidence.holdUntil != null)
      date = moment(evidence.holdUntil).toDate();
    else
      date = moment(evidence.expireOn).toDate();
    
    if (checkIndefiniteDate(date, evidence.evidenceRelations?.length > 0)) { //NOTE: Case in which the expiry date for asset is infinite.       
      return (
        <div className="dataTableText">
          <div className="CRXLockTextIcon">
            {t("Indefinite")}
          </div>
          <div className="CRXLockIcon">
            <CRXTooltip arrow={false} disablePortal={true} iconName="fas fa-infinity" title="Indefinite" placement="top" className="CRXLock" />
          </div>
        </div>
      );
    }
    return (
      <div className="dataTableText ">
        {AssetRetentionFormat(date, evidence.evidenceRelations?.length > 0)}
        {
          evidence.holdUntil != null && !checkIndefiniteDate(moment(evidence.holdUntil).toDate(), evidence.evidenceRelations?.length > 0) ? <div className="arrow_up_icon_position"><i className="fas fa-arrow-up"></i></div> : ""
        }
      </div>
    );
  }

  rowsData.forEach((row: SearchModel.Evidence, i: number) => {
    const checkStatus = () => {
      
      if(row.masterAsset.state == AssetState.Deleted || row.masterAsset.state == AssetState.Trash){
        return "Expired"
      }
      else if(row.masterAsset.status == AssetStatus.MetadataOnly){
        return "Metadata Only"
      }
      else if(row.masterAsset.status == AssetStatus.RequestUpload){
        return "Upload Requested"
      }
      else{
        return row.masterAsset.status
      }
    }

    let evidence: any = {
      id: row.id,
      assetId: row.masterAsset.assetId,
      assetName: row.masterAsset.assetName,
      assetType: row.masterAsset.assetType,
      unit: row.masterAsset.unit,
      description: row.description,
      categories: row.categories,
      categorizedBy : row.categorizedBy,
      devices: row.devices,
      station: row.station,
      recordedBy: row?.masterAsset?.owners === null ? [] : row?.masterAsset?.owners?.map(x => x.split('@')[0]),
      recordingStarted: row.masterAsset.recordingStarted,
      status: checkStatus(),
      evidence: row,
      holdUntil: row.holdUntil,
      expireOn: row.expireOn,
      duration: row.masterAsset.duration,
      size: row.masterAsset.size,
      retentionSpanText: retentionSpanText("", row).props.children,
      caseTitle: row.evidenceRelations?.map(x => x.valueDisplayName)
    };
    reformattedRows.push(evidence);
  });

  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "assetDataTable");
  }, []);

  const userIdPreset = () =>{
    var token = getToken();
    if (token) {
        var accessTokenDecode: any = jwt_decode(token);
        return accessTokenDecode.LoginId
    }
    else
     return ""
  }

  let history = useHistory();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [rows, setRows] = React.useState<SearchModel.Evidence[]>(reformattedRows);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<SearchModel.Evidence>();
  const [groupedSelectedAsset, setGroupedSelectedAsset] = React.useState<SearchModel.Evidence[]>([]);
  const [userId, setUserId] = React.useState<string>(userIdPreset());
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const caseModelCaseTitleRef = useRef<any | null>(null);

  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });
  const groupedSelectedAssetsActions: any = useSelector(
    (state: RootState) => state.groupedSelectedAssetsActionsReducer.groupedSelectedAssetsActions
  );
  useEffect(() => {
    var tempRows:SearchModel.Evidence[] = [];
    if (groupedSelectedAsset != undefined && groupedSelectedAsset.length > 0) {
      let groupedMasterIds = groupedSelectedAsset?.map((x: any) => x.evidence.masterAsset.assetId);
      rows.map((r: any) => {
        let tempRow = r;
        if (groupedMasterIds?.includes(tempRow.evidence.masterAsset.assetId)) {
          tempRow.onlyforlinkedasset = groupedSelectedAssetsActions[0].actionType.toString();
        }
        else {
          tempRow.onlyforlinkedasset = "";
        }
        tempRows.push(tempRow);
      });
      setRows(tempRows);
    }
    
    
  }, [groupedSelectedAsset]);
  useEffect(() => {
    let tempSelectedAssets: any = [];
    if(groupedSelectedAssetsActions.length > 0)
    {
    groupedSelectedAssetsActions.forEach((el: any) => {
      let x: any = rows.find((x: any) => x.assetId == el.masterId);
      tempSelectedAssets.push(x);
    });
    setGroupedSelectedAsset(tempSelectedAssets);
    }
    
   
  }, [groupedSelectedAssetsActions])
  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);

  useEffect(() => {
    if (dateTime.colIdx !== 0) {
      if (
        dateTime.dateTimeObj.startDate !== "" &&
        dateTime.dateTimeObj.startDate !== undefined &&
        dateTime.dateTimeObj.startDate != null &&
        dateTime.dateTimeObj.endDate !== "" &&
        dateTime.dateTimeObj.endDate !== undefined &&
        dateTime.dateTimeObj.endDate != null
      ) {
        let newItem = {
          columnName: headCells[dateTime.colIdx].id.toString(),
          colIdx: dateTime.colIdx,
          value: [dateTime.dateTimeObj.startDate, dateTime.dateTimeObj.endDate],
        };
        setSearchData((prevArr) =>
          prevArr.filter(
            (e) => e.columnName !== headCells[dateTime.colIdx].id.toString()
          )
        );
        setSearchData((prevArr) => [...prevArr, newItem]);
      } else
        setSearchData((prevArr) =>
          prevArr.filter(
            (e) => e.columnName !== headCells[dateTime.colIdx].id.toString()
          )
        );
    }
  }, [dateTime]);

  const searchText = (
    _: SearchModel.Evidence[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    };

    return (
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
    );
  };

  const getTheDistinctEvidenceRelations = (evidenceRelations: SearchModel.EvidenceRelations[] )=>{
    const distinctEvidenceRelations : SearchModel.EvidenceRelations[] = [];

    evidenceRelations.forEach(e=>{
     if(distinctEvidenceRelations.find(x=>x.valueRecId === e.valueRecId) == null)
       {distinctEvidenceRelations.push(e)};
   });

   return distinctEvidenceRelations;
 }
 const caseTitleTemplate =(a: string, evidence: SearchModel.Evidence)  => {
   let evidenceRelations = evidence.evidenceRelations;
   if(evidenceRelations!= null){
     const distinctEvidenceRelations = getTheDistinctEvidenceRelations(evidenceRelations);
     let dataLink = distinctEvidenceRelations.map(e=>{
       return (
         <div className="caseTitleContainer">
         <Link
           className="linkColor"
           onClick={() => CheckCaseExpired(e)}
           to={
             '#'
           }
         >
          {e.valueDisplayName}
         </Link>
       </div>
       )
     })
     return dataLink;
   }
 };

  const CheckCaseExpired = async (e:any) => {
    const  {valueRecId,valueDisplayName} = e;
    caseModelCaseTitleRef.current = valueDisplayName;
      dispatch(setLoaderValue({isLoading: true}));
      await CasesAgent.getCase(`/Case/CaseAccessValidation/${valueRecId}`)
      .then((isValid: any) => {
        if(isValid) {
          setOpen(true);
        } else {
          let urlPathName = urlList.filter((item: any) => item.name === urlNames.editCase)[0].url;
          history.push(
            urlPathName.substring(0, urlPathName.lastIndexOf("/")) + "/" + valueRecId
          );
        }
        dispatch(setLoaderValue({isLoading: false}));
      })
      .catch((err: any) => {     
        dispatch(setLoaderValue({isLoading: false}));      
        showToastMsg({ message: t(`Something_went_wrong`), variant: 'error', duration: 7000 });
        console.error(err)
      });
    }



  const searchDate = (
    _: SearchModel.Evidence[],
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
          startDate: dateTimeDetail.startDate,
          endDate: dateTimeDetail.endDate,
          value: dateTimeDetail.value,
          displayText: dateTimeDetail.displayText,
        },
        colIdx: 0,
      };
    } else {
      dateTimeObject = {
        dateTimeObj: {
          ...headCells[colIdx].headerObject,
        },
        colIdx: 0,
      };
    }

    function onSelection(dateTime: DateTimeObject) {
      dateTimeObject = {
        dateTimeObj: {
          ...dateTime,
        },
        colIdx: colIdx,
      };

      setDateTime(dateTimeObject);
      headCells[colIdx].headerObject = dateTimeObject.dateTimeObj;
    }

    return (
      <DateTimeComponent
        showCompact={showDateCompact}
        reset={reset}
        dateTimeDetail={dateTimeObject.dateTimeObj}
        getDateTimeDropDown={(dateTime: DateTimeObject) => {
          onSelection(dateTime);
        }}
        dateOptionType={dateOptionType}
      />
    );
  };

  const changeMultiselect = (
    val: renderCheckMultiselect[],
    colIdx: number
  ) => {
    onSelection(val, colIdx);
    headCells[colIdx].headerArray = val;
  };

  const searchAndNonSearchMultiDropDown = (
    rowsParam: SearchModel.Evidence[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any,
    isSearchable: boolean
  ) => {

    if (initialRows) {
      let options = reformattedRows.map((row: any, _: any) => {
        let option: any = {};
        option["value"] = row[headCells[colIdx].id];
        return option;
      });
      // For those properties which contains an array
      if (
        headCells[colIdx].id.toString() === "categories" ||
        headCells[colIdx].id.toString() === "recordedBy"
      ) {
        let moreOptions: any = [];
        reformattedRows.forEach((row: any, _: any) => {
          let x = headCells[colIdx].id;
          row[x]?.forEach((element: any) => {
            let moreOption: any = {};
            moreOption["value"] = element;
            moreOptions.push(moreOption);
          });
        });
        options = moreOptions;
      }

      return (
        <div className="assetDataTableMultiSelect" data-qa={"col-multiSelect-" + colIdx}>
          {["categories", "unit", "station","recordedBy"].includes(headCells[colIdx].id.toString())  ?
            <CBXMultiSelectForDatatable
              width={100}
              percentage={true}
              option={options}
              value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
              onChange={(e: any, value: any) => changeMultiselect(value, colIdx)}
              onSelectedClear={() => clearAll()}
              isCheckBox={false}
              isduplicate={true}
            /> :
            <CBXMultiCheckBoxDataFilter 
              width = {100} 
              percentage={true}
              option={options} 
              value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []} 
              onChange={(value : any) => changeMultiselect(value, colIdx)}
              onSelectedClear = {() => clearAll()}
              isCheckBox={true}
              multiple={true}
              isduplicate={true}
              selectAllLabel="All"
            />
          }
        </div>
      );
    }
  };

  const searchAndNonSearchMultiDropDownForRetention = (
    rowsParam: SearchModel.Evidence[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any,
    isSearchable: boolean
  ) => {

    if (initialRows) {

      let options: any[] = [
        { value: t("Available") },
        { value: t("Expired") }
      ];

      return (
      
        // <CBXMultiSelectForDatatable
        //   width={220}
        //   option={options}
        //   value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
        //   onChange={(e: any, value: any) => changeMultiselect(e, value, colIdx)}
        //   onSelectedClear={() => clearAll()}
        //   isCheckBox={true}
        //   isduplicate={true}
        // />
        <div className="assetDataTableMultiSelect" data-qa={"col-multiSelect-" + colIdx}>
        <CBXMultiCheckBoxDataFilter 
          width = {100} 
          percentage={true}
          option={options} 
          value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
          onChange={(value : any) => changeMultiselect(value, colIdx)}
          onSelectedClear = {() => clearAll()}
          isCheckBox={true}
          multiple={true}
          isduplicate={true}
          selectAllLabel="All"
        />
        </div>
      );
    }
  };

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: t("ID"),
      id: "id",
      align: "right",
      dataComponent: () => null,
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      width: "",
      minWidth: "250",

    },
    {
      label: `${t("Asset_Thumbnail")}`,
      id: "assetId",
      align: "left",
      dataComponent: (event: any, evidence: any) => thumbTemplate(event, evidence),
      minWidth: "121",
      detailedDataComponentId: "evidence",
    },
    {
      label: `${t("Asset_ID")}`,
      id: "assetName",
      align: "left",
      dataComponent: (e: any, d: any) => assetNameTemplate(e, d),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "281",
      detailedDataComponentId: "evidence",
      isPopover: true,
    },
    {
      label: `${t("Case_ID")}`,
      id: "caseTitle",
      align: "left",
      dataComponent: (e: any, d: any)=> caseTitleTemplate(e, d),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "281",
      detailedDataComponentId: "evidence",
     isPopover: true,
    },
    {
      label: `${t("Category")}`,
      id: "categories",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: SearchModel.Evidence[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, true),
      minWidth: "250",
      visible: true,
    },
    {
      label: t("Description"),
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "dataTableEllipsesText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "390",
    },
    {
      label: t("Captured"),
      id: "recordingStarted",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      minWidth: "230",
      searchFilter: true,
      searchComponent: searchDate,
    },
    {
      label: `${t("Asset_Type")}`,
      id: "assetType",
      align: "left",
      dataComponent: (e: any, evidence: any) => assetTypeText("", evidence),//,(evidence: any) => assetTypeText(evidence, ""),//textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      detailedDataComponentId: "evidence",
      searchComponent: (
        rowData: SearchModel.Evidence[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, true),
      minWidth: "255",
      visible: false,
    },
    {
      label: t("Device"),
      id: "unit",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: SearchModel.Evidence[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, false),
      minWidth: "250",
      visible: false,
    },
    {
      label: t("Station"),
      id: "station",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: SearchModel.Evidence[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, false),
      minWidth: "250",
      visible: false,
    },
    {
      label: t("User"),
      id: "recordedBy",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, "linkColor"),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: SearchModel.Evidence[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, true),
      minWidth: "230",
    },
    {
      label: `${t("File_Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      minWidth: "250",
      searchFilter: true,
      searchComponent: (
        rowData: SearchModel.Evidence[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, false),
    },
    {
      label: t("Retention_Span"),
      id: "retentionSpanText",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: SearchModel.Evidence[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDownForRetention(rowData, columns, colIdx, initialRow, false),
      minWidth: "230",
      detailedDataComponentId: "evidence",
      visible: true
    },
    {
      label: t("Asset_Duration"),
      id: "duration",
      align: "left",
      dataComponent: assetDurationFormat,
      sort: true,
      searchFilter: false,
      //searchComponent: () => null,
      minWidth: "200",
      visible: false,
    },
    {
      label: t("Asset_Size"),
      id: "size",
      align: "left",
      dataComponent: assetSizeFormat,
      sort: true,
      searchFilter: false,
      //searchComponent: () => null,
      minWidth: "200",
      visible: false,
    },
  ]);

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

  const onRetentionCompare = (
    dataRows: any[],
    headCells: HeadCellProps[],
    el: SearchObject
  ) => {

    dataRows = dataRows.filter((x: any) => {
      return el.value.includes((x[headCells[el.colIdx].id][0] !== "Expired" &&
        x[headCells[el.colIdx].id][0] !== "" &&
        x[headCells[el.colIdx].id][0] !== null &&
        x[headCells[el.colIdx].id].length >= 2) 
        ?  "Available"
        : x[headCells[el.colIdx].id][0]);
    });

    return dataRows;
  };

  const dataArrayBuilder = () => {
    let dataRows: SearchModel.Evidence[] = reformattedRows;
    searchData.forEach((el: SearchObject) => {
      if (el.columnName === "assetName" || el.columnName === "description")
        dataRows = onTextCompare(dataRows, headCells, el);
      if (["assetType", "devices", "station", "status", "unit"].includes(el.columnName))
        dataRows = onMultipleCompare(dataRows, headCells, el);
      if (["retentionSpanText"].includes(el.columnName))
        dataRows = onRetentionCompare(dataRows, headCells, el);
      if (["categories", "recordedBy"].includes(el.columnName))
        dataRows = onMultiToMultiCompare(dataRows, headCells, el);
      if (el.columnName === "recordingStarted") {
        dataRows = onDateCompare(dataRows, headCells, el);
      }
      if (el.columnName === "caseTitle") 
        dataRows = onTextMultiCompare(dataRows, headCells, el);
    });
    
    setRows(dataRows);
    
  };

  const clearAll = () => {
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const resizeRowAssetsDataTable = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  const showToastMsg = (obj: any) => {
    toasterRef.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
    if (obj.message !== undefined && obj.message !== "") {
      let notificationMessage: NotificationMessage = {
        title: t("Asset_Lister"),
        message: obj.message,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  };

  return (
    <>

      <CRXToaster ref={toasterRef} />
      {rows && (
        <CRXDataTable
          id="assetDataTable"
          actionComponent={
            <ActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              showToastMsg={(obj: any) => showToastMsg(obj)}
              portal={true}
              actionMenuPlacement={ActionMenuPlacement.AssetLister}
              actionViewScroll={"initial"}
            />
          }
          getRowOnActionClick={(val: SearchModel.Evidence) => setSelectedActionRow(val)}
          showToolbar={true}
          dataRows={rows}
          headCells={headCells}
          initialRows={reformattedRows}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          className="ManageAssetDataTable ManageAssetDataTable_Ui MainAssetGridPage_Ui"
          onClearAll={clearAll}
          getSelectedItems={(v: any[]) => setSelectedItems(v)}
          onResizeRow={resizeRowAssetsDataTable}
          onHeadCellChange={onSetHeadCells}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          showActionSearchHeaderCell={true}
          dragVisibility={true}
          showCheckBoxesCol={true}
          showActionCol={true}
          showHeaderCheckAll={false}
          showTotalSelectedText={false}
          //Kindly add this block for sticky header Please dont miss it.
          offsetY={1}
          stickyToolbar={112}
          searchHeaderPosition={203}
          dragableHeaderPosition={168}
          //End here
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={(page: any) => setPage(page)}
          setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
          totalRecords={rows.length}
          selfPaging={true}
          viewName="assetListerView"
          showExpandViewOption={true}
          showSearchPanel={showSearchPanel}
          searchResultText={searchResultText}
          advanceSearchText={advanceSearchText}
		      presetPerUser={userId}
          selfSorting={true}
          
        />

      )}

      <CRXModalDialog
        className='CrxCaseModel'
        style={{ minWidth: '680px' }}
        maxWidth='xl'
        modelOpen={open}
        onClose={() => setOpen(false)}
        closeWithConfirm={closeWithConfirm}>
              <div className="assetsCasePermission">
                  <div className="assetsCasePermissionExistsIcon">
                      <i className="fas fa-exclamation-circle" />
                  </div>
                  <div className="assetsCasePermissionText">{ t("You_don't_have_access_to_this_case") + ' ' +caseModelCaseTitleRef.current }</div>
                  <div className="assetsCasePermissionModalFooter">
                      <CRXButton
                          className="assetsCasePermissionOkButton secondary"
                          color="secondary"
                          variant="outlined"
                          onClick = {() => setOpen(false)}
                      >
                          {t("OK")}
                      </CRXButton>
                  </div>
              </div>
      </CRXModalDialog>
    </>
  );
};

export default MasterMain;