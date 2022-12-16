import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { CRXDataTable, CRXToaster, CRXIcon, CRXDataTableTextPopover, CBXMultiSelectForDatatable } from "@cb/shared";
import { DateTimeComponent } from "../../../../GlobalComponents/DateTime";
import {
  SearchObject,
  Order,
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
  GridFilter,
  PageiGrid
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import "./index.scss";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ActionMenu";
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";
import DetailedAssetPopup from "./DetailedAssetPopup";
import dateDisplayFormat from "../../../../GlobalFunctions/DateFormat";
import { AssetRetentionFormat } from "../../../../GlobalFunctions/AssetRetentionFormat";
import { AssetThumbnail } from "./AssetThumbnail";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import multitextDisplay from "../../../../GlobalComponents/Display/MultiTextDisplay";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import { Link } from "react-router-dom";
import moment from "moment";
import { NotificationMessage } from "../../../Header/CRXNotifications/notificationsTypes";
import { addNotificationMessages } from "../../../../Redux/notificationPanelMessages";
import { ActionMenuPlacement } from "../ActionMenu/types";
import { DateTimeObject, DateTimeProps, MasterMainProps } from "./AssetDataTableModel";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";

const thumbTemplate = (assetId: string, evidence: SearchModel.Evidence) => {
  let assetType = evidence.masterAsset.assetType;
  let fileType = evidence.masterAsset?.files &&  evidence.masterAsset?.files[0]?.type;

  return <AssetThumbnail assetType={assetType} fileType={fileType} fontSize="61pt" />;
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
  let assets = evidence.asset.filter(x => x.assetId != masterAsset.assetId);

  let dataLink = <>
    <Link
      className="linkColor"
      to={{
        pathname: "/assetdetail",
        state: {
          evidenceId: evidence.id,
          assetId: masterAsset.assetId,
          assetName: assetName,
          evidenceSearchObject: evidence
        },
      }}
    >
      <div className="assetName">{assetName}</div>
    </Link>

    <DetailedAssetPopup asset={assets} row={evidence} />
  </>
  return (<CRXDataTableTextPopover
    content={dataLink}
    id="dataAssets"
    isPopover={true}
    counts={assetName}
    title="Assets ID"
    minWidth="130"
    maxWidth="263"
  />
  );
};

interface renderCheckMultiselect {
  value: string,
  id: string,
}

const MasterMain: React.FC<MasterMainProps> = ({
  rowsData,
  dateOptionType,
  dateTimeDetail,
  showDateCompact,
  showAdvanceSearch,
}) => {
  const toasterRef = useRef<typeof CRXToaster>(null);
  const { t } = useTranslation<string>();
  let reformattedRows: SearchModel.Evidence[] = [];
  rowsData.forEach((row: SearchModel.Evidence, i: number) => {
    let evidence: any = {
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
      holdUntil: row.holdUntil,
      expireOn: row.expireOn
    };
    reformattedRows.push(evidence);
  });

  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "assetDataTable");
  }, []);

  const dispatch = useDispatch();
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [rows, setRows] = React.useState<SearchModel.Evidence[]>(reformattedRows);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
  // const [isOpen, setIsOpen] = React.useState<any>(undefined)
  const [selectedActionRow, setSelectedActionRow] = React.useState<SearchModel.Evidence>();
  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });

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
    {console.log("dateOptionType", dateOptionType)}
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
    e: React.SyntheticEvent,
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
        <CBXMultiSelectForDatatable
          width={220}
          option={options}
          value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
          onChange={(e: any, value: any) => changeMultiselect(e, value, colIdx)}
          onSelectedClear={() => clearAll()}
          isCheckBox={false}
          isduplicate={true}
        />
      );
    }
  };

  const retentionSpanText = (_: string, evidence: SearchModel.Evidence): JSX.Element => {
    let date: Date;
    if (evidence.holdUntil != null)
      date = moment(evidence.holdUntil).toDate();
    else
      date = moment(evidence.expireOn).toDate();

    if (moment(date).format('DD-MM-YYYY') == "31-12-9999") { //NOTE: Case in which the expiry date for asset is infinite.       
      return (
        <CRXIcon className=""><i className="fas fa-infinity"></i></CRXIcon>
      );
    }
    return (
      <div className="dataTableText ">
        {AssetRetentionFormat(date)}
      </div>
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
      dataComponent: (event: any, evidence: any) => thumbTemplate(event, evidence),
      minWidth: "150",
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
      minWidth: "263",
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
      visible: false,
    },
    {
      label: t("Description"),
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "dataTableEllipsesText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "338",
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
      minWidth: "250",
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
      label: t("User_Name"),
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
      id: "expireOn",
      align: "left",
      dataComponent: retentionSpanText,
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      minWidth: "230",
      detailedDataComponentId: "evidence",
      visible: true
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

  const dataArrayBuilder = () => {
    let dataRows: SearchModel.Evidence[] = reformattedRows;
    searchData.forEach((el: SearchObject) => {
      if (el.columnName === "assetName" || el.columnName === "description")
        dataRows = onTextCompare(dataRows, headCells, el);
      if (["assetType", "devices", "station", "status", "unit"].includes(el.columnName))
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
              showToastMsg={(obj: any) => showToastMsg(obj)}
              portal={true}
              actionMenuPlacement={ActionMenuPlacement.AssetLister}
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
          className="ManageAssetDataTable"
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
          offsetY={showAdvanceSearch == false ? 140 : 650}
          searchHeaderPosition={showAdvanceSearch == false ? 221 : 889}
          dragableHeaderPosition={showAdvanceSearch == false ? 178 : 889}
          topSpaceDrag = {showAdvanceSearch == false ? 183 : 689}
          //End here
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={(page: any) => setPage(page)}
          setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
          totalRecords={rows.length}
          selfPaging={true}
        />

      )}
    </>
  );
};
export default MasterMain;
