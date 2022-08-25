import React, { useEffect ,useRef } from "react";
import { useDispatch } from "react-redux";
import {CRXDataTable, CRXToaster,CRXIcon,CRXDataTableTextPopover } from "@cb/shared";
import { DateTimeComponent } from "../../../../GlobalComponents/DateTime";
import {
  SearchObject,
  Order,
  Asset,
  ValueString,
  HeadCellProps,
  onResizeRow,
  onClearAll,
  onTextCompare,
  onMultipleCompare,
  onMultiToMultiCompare,
  onDateCompare,
  onSetHeadCellVisibility,
  onSaveHeadCellData,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  GridFilter
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import "./index.scss";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ActionMenu";
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";
import DetailedAssetPopup from "./DetailedAssetPopup";
import dateDisplayFormat from "../../../../GlobalFunctions/DateFormat";
import { AssetRetentionFormat, CalculateHoldUntill } from "../../../../GlobalFunctions/AssetRetentionFormat";
import { AssetThumbnail } from "./AssetThumbnail";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import multitextDisplay from "../../../../GlobalComponents/Display/MultiTextDisplay";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import MultSelectiDropDown from "../../../../GlobalComponents/DataTableSearch/MultSelectiDropDown";
import { Link } from "react-router-dom";
import moment from "moment";
import { NotificationMessage } from "../../../Header/CRXNotifications/notificationsTypes";
import { addNotificationMessages } from "../../../../Redux/notificationPanelMessages";

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

type MasterAsset = {
  assetId: string;
  assetName: string;
  assetType: string;
  unit: string;
  owners: string[];
  recordingStarted: string;
  status: string;
};

type Evidence = {
  id: number;
  masterAssetId: string;
  description: string;
  categories: string[];
  devices: string;
  station: string;
  asset: Asset[];
  masterAsset: MasterAsset;
  holdUntill: string;
  extendedHoldUntil?: string;
};

type EvidenceReformated = {
  id: number;
  evidence: Evidence;
  assetId: string;
  assetName: string;
  assetType: string;
  description: string;
  categories: string[];
  devices: string;
  station: string;
  unit: string;
  recordedBy: string[];
  recordingStarted: string;
  status: string;
  holdUntill: string;
  extendedHoldUntil?: string;
};

type Props = {
  rowsData: Evidence[];
  dateOptionType: string;
  dateTimeDetail: DateTimeObject;
  showDateCompact: boolean;
};

//-----------------

const thumbTemplate = (assetType: string) => {
  return <AssetThumbnail assetType={assetType} fontSize="61pt" />;
};

const assetNameTemplate = (assetName: string, evidence: Evidence) => {
  let masterAsset = evidence.masterAsset;
  let assets = evidence.asset;
  const dataLink = <>
              <Link
              className="linkColor"
                to={{
                  pathname: "/assetdetail",
                  state: {
                    evidenceId: evidence.id,
                    assetId: masterAsset.assetId,
                    assetName: assetName,
                  },
                }}
              >
                <div className="assetName">{"#" + assetName}</div>
              </Link>
              
              <DetailedAssetPopup asset={assets} row={evidence}/>
            </>
  return (
    CRXDataTableTextPopover({
      content : dataLink,
      id : "dataAssets",
      isPopover : true,
      counts : assetName,
      title:"Assets ID",
      minWidth: "130",
      maxWidth: "263",
    })
  );
};

const MasterMain: React.FC<Props> = ({
  rowsData,
  dateOptionType,
  dateTimeDetail,
  showDateCompact,
}) => {
  let reformattedRows: EvidenceReformated[] = [];
  rowsData.forEach((row: Evidence, i: number) => {
    let evidence: EvidenceReformated = {
      id: row.id,
      assetId: row.masterAsset.assetId,
      assetName: row.masterAsset.assetName,
      assetType: row.masterAsset.assetType,
      unit: row.masterAsset.unit,
      description: row.description,
      categories: row.categories,
      devices: row.devices,
      station: row.station,
      recordedBy: row.masterAsset.owners === null ? [] : row.masterAsset.owners,
      recordingStarted: row.masterAsset.recordingStarted,
      status: row.masterAsset.status,
      evidence: row,
      holdUntill: row.holdUntill,
      extendedHoldUntil: row.extendedHoldUntil
    };
    reformattedRows.push(evidence);
  });

  const { t } = useTranslation<string>();
  const [rows, setRows] = React.useState<EvidenceReformated[]>(reformattedRows);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState<any>(undefined)
  const [selectedActionRow, setSelectedActionRow] =
    React.useState<EvidenceReformated>();
    const dispatch = useDispatch();
  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });

  const searchText = (
    _: EvidenceReformated[],
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

  const searchDate = (
    _: EvidenceReformated[],
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

  const searchAndNonSearchMultiDropDown = (
    rowsParam: EvidenceReformated[],
    headCells: HeadCellProps[],
    colIdx: number,
    isSearchable: boolean
  ) => {
    const onSetSearchData = () => {
      setSearchData((prevArr) =>
        prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
      );
    };

    const onSetHeaderArray = (v: ValueString[]) => {
      headCells[colIdx].headerArray = v;
    };

    const assetListerNoOptions = {
      width: "100%",
      marginLeft: "-1px",
      whiteSpace: "nowrap",
      overFlow: "hidden",
      textOverflow: "ellipsis",
      marginRight: "auto",
      paddingLeft: "7px",
      paddingRight: "7px",
      fontSize: "14px",
      top: "-5px",
      marginTop: "4px"
    };

    const PaddLeftNoOptions = {
      marginLeft: "4px",
      paddingRight: "7px",
      marginRight: "7px",
      paddingLeft: "7px",
    };

    return (
      <MultSelectiDropDown
        headCells={headCells}
        colIdx={colIdx}
        reformattedRows={reformattedRows}
        isSearchable={isSearchable}
        onMultiSelectChange={onSelection}
        onSetSearchData={onSetSearchData}
        onSetHeaderArray={onSetHeaderArray}
        widthNoOption={assetListerNoOptions}
        checkedStyle={PaddLeftNoOptions}
      />
    );
  };


  const retentionSpanText = (_: string, evidence: Evidence): JSX.Element => {
    if (evidence.extendedHoldUntil != null) {
      if (moment(evidence.extendedHoldUntil).format('DD-MM-YYYY') == "31-12-9999") {
        //display just a infinity icon
        return (
          <CRXIcon className=""><i className="fas fa-infinity"></i></CRXIcon>
        );
      }
      //show a horizontal arrow beneath the retention span number.
      return (
        <p>
          {AssetRetentionFormat(_)}
          <br />
          <CRXIcon className=""><i className="fas fa-angle-right "></i></CRXIcon>
        </p>
      );
    }
    return (
      <p>{AssetRetentionFormat(_)}</p>
    );
  }
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
      dataComponent: thumbTemplate,
      minWidth: "130",
      maxWidth: "150",
      width: ""
    },
    {
      label: `${t("Asset_ID")}`,
      id: "assetName",
      align: "left",
      dataComponent: (e : any, d:any) => assetNameTemplate(e, d),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "130",
      maxWidth: "263",
      detailedDataComponentId: "evidence",
      isPopover: true,
      attributeName: "Assets.Master.AssetName",
      attributeType: "String"
    },
    {
      label: `${t("Category")}`,
      id: "categories",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: EvidenceReformated[],
        columns: HeadCellProps[],
        colIdx: number
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, true),
      minWidth: "230",
      maxWidth: "250",
      visible: false,
      attributeName: "Categories.Record",
      attributeType: "CMTEntityRecordList"
    },
    {
      label: t("Description"),
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "dataTableEllipsesText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "210",
      maxWidth: "338",
      attributeName: "Description",
      attributeType: "String"
    },
    {
      label: t("Retention_Span"),
      id: "holdUntill",
      align: "left",
      dataComponent: retentionSpanText,
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      minWidth: "210",
      maxWidth: "230",
      detailedDataComponentId: "evidence",
      visible: true
    },
    {
      label: t("Captured"),
      id: "recordingStarted",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      minWidth: "230",
      maxWidth: "250",
      searchFilter: true,
      searchComponent: searchDate,
      attributeName: "Assets.Master.Recording.Started",
      attributeType: "DateTime"
    },
    {
      label: `${t("Asset_Type")}`,
      id: "assetType",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: EvidenceReformated[],
        columns: HeadCellProps[],
        colIdx: number
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, true),
      minWidth: "230",
      maxWidth: "250",
      visible: false,
      attributeName: "Assets.Master.TypeOfAsset",
      attributeType: "List"
    },
    {
      label: t("Device"),
      id: "unit",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: EvidenceReformated[],
        columns: HeadCellProps[],
        colIdx: number
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, false),
      minWidth: "230",
      maxWidth: "250",
      visible: false,
      attributeName: "Assets.Master.Unit",
      attributeType: "CMTEntityRecord"
    },
    {
      label: t("Station"),
      id: "station",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: EvidenceReformated[],
        columns: HeadCellProps[],
        colIdx: number
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, false),
      minWidth: "230",
      maxWidth: "250",
      visible: false,
      attributeName: 'StationName',
      attributeType: "CMTEntityRecord"
    },
    {
      label: t("User_Name"),
      id: "recordedBy",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, "linkColor"),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: EvidenceReformated[],
        columns: HeadCellProps[],
        colIdx: number
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, true),
      minWidth: "210",
      maxWidth: "230",
      attributeName: "Assets.Master.Owners",
      attributeType: "List"
    },
    {
      label: `${t("File_Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      minWidth: "230",
      maxWidth: "250",
      searchFilter: true,
      searchComponent: (
        rowData: EvidenceReformated[],
        columns: HeadCellProps[],
        colIdx: number
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, false),
      attributeName: "MasterAsset.Status",
      attributeType: "List"
    },
  ]);

  // Remane required
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

  useEffect(() => {
    //dataArrayBuilder();
  }, [searchData]);

  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "assetDataTable");
  }, []);

  const dataArrayBuilder = () => {
    let dataRows: EvidenceReformated[] = reformattedRows;
    searchData.forEach((el: SearchObject) => {
      if (el.columnName === "assetName" || el.columnName === "description")
        dataRows = onTextCompare(dataRows, headCells, el);
      if (["assetType", "devices", "station", "status"].includes(el.columnName))
        dataRows = onMultipleCompare(dataRows, headCells, el);
      if (["categories", "recordedBy"].includes(el.columnName))
        dataRows = onMultiToMultiCompare(dataRows, headCells, el);
      if (el.columnName === "recordingStarted") {
        dataRows = onDateCompare(dataRows, headCells, el);
      }
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
  const toasterRef = useRef<typeof CRXToaster>(null);

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

  const getFilteredEvidenceData = () => {
    
    let gridFilter: GridFilter = {
      logic: "and",
      filters: []
    }

    searchData.forEach((item:any, index:number) => {
        let x: GridFilter = {
          operator: item.value.length > 1 ? "between" : "contains",
          //field: item.columnName.charAt(0).toUpperCase() + item.columnName.slice(1),
          field: headCells[item.colIdx].attributeName,
          value: item.value.length > 1 ? item.value.join('@') : item.value[0],
          fieldType: headCells[item.colIdx].attributeType,
        }
        gridFilter.filters?.push(x)
    })

    dispatch(getAssetSearchInfoAsync(gridFilter));

    // gridFilter = {
    //   filters: [
    //     // {
    //     //   operator: "contains",
    //     //   field: "assets.master.camera",
    //     //   value: "YourCam"
    //     // },
    //     {
    //       operator: "contains",
    //       field: "UserName",
    //       value: "faisal"
    //     },
    //     // {
    //     //   operator: "contains",
    //     //   field: "fName",
    //     //   value: "Faisal"
    //     // },
    //     {
    //         operator: "between",
    //         field: "LastLogin",
    //         //value: "2022-06-01T00:00:00+05:00"
    //         value: "2022-05-01T00:00:00+05:00@2022-06-30T23:59:00+05:00"
    //     }
    //   ]
    // }

    // console.log("grifFilter ", gridFilter)

    // const requestOptions = {
    //   method: 'Post',
    //   headers: { 'Content-Type': 'application/json', 'TenantId': '1'},
    //   body: JSON.stringify(gridFilter),
    // };
    // const resp = fetch("http://127.0.0.1:8085/Users/filter?Size=100&Page=1",requestOptions);
    // //const resp = fetch("http://127.0.0.1:8080/Evidences/filter?Size=100&Page=1",requestOptions);
    // if (resp) {
    //   const response = resp
    //   console.log("Resp", response)
    //   return response;
    // }
  }
  
  return (
    <>
      <CRXToaster ref={toasterRef} />
      
      
      {rows && (
        <CRXDataTable
          id="assetDataTable"
          actionComponent={
            <ActionMenu row={selectedActionRow} selectedItems={selectedItems} showToastMsg={(obj: any) => showToastMsg(obj)}  setIsOpen={setIsOpen} IsOpen= {isOpen} portal={true} />
          }
          
          getRowOnActionClick={(val: EvidenceReformated) => setSelectedActionRow(val)}
          showToolbar={true}
          dataRows={rows}
          headCells={headCells}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          className="ManageAssetDataTable"
          onClearAll={clearAll}
          getSelectedItems={(v: string[]) => setSelectedItems(v)}
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
          offsetY={179}
        />
      )}
    </>
  );
};
export default MasterMain;
