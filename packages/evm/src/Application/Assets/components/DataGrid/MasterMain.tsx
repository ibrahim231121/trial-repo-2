import React, { useEffect } from "react";
import { CRXDataTable, CRXColumn } from "@cb/shared";
import { DateTimeComponent } from "../../../../components/DateTimeComponent";
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
} from "../../../../utils/globalDataTableFunctions";
import "./ManageAssetGrid.scss";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ActionMenu";
import DetailedAssetPopup from "./DetailedAssetPopup";
import dateDisplayFormat from "../../../../components/DateDisplayComponent/DateDisplayFormat";
import { AssetThumbnail } from "./AssetThumbnail";
import textDisplay from "../../../../components/DateDisplayComponent/TextDisplay";
import multitextDisplay from "../../../../components/DateDisplayComponent/MultiTextDisplay";
import TextSearch from "../../../../components/SearchComponents/TextSearch";
import MultSelectiDropDown from "../../../../components/SearchComponents/MultSelectiDropDown";

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
  recordedBy: string[];
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
};

type EvidenceReformated = {
  id: number;
  asset: Asset[];
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

const assetNameTemplate = (assetName: string, assets: Asset[]) => {
  return (
    <>
      {textDisplay(assetName, "linkColor")}
      <DetailedAssetPopup asset={assets} />
    </>
  );
};

const MasterMain: React.FC<Props> = ({
  rowsData,
  dateOptionType,
  dateTimeDetail,
  showDateCompact,
}) => {
  let reformattedRows: EvidenceReformated[] = [];

  rowsData.map((row: Evidence, i: number) => {
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
      recordedBy: row.masterAsset.recordedBy,
      recordingStarted: row.masterAsset.recordingStarted,
      status: row.masterAsset.status,
      asset: row.asset.filter((x: Asset) => x.assetId !== row.masterAssetId),
    };

    reformattedRows.push(evidence);
  });

  const { t } = useTranslation<string>();
  const [rows, setRows] = React.useState<EvidenceReformated[]>(reformattedRows);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<EvidenceReformated>();

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
          startDate: headCells[colIdx].headerObject.startDate,
          endDate: headCells[colIdx].headerObject.endDate,
          value: headCells[colIdx].headerObject.value,
          displayText: headCells[colIdx].headerObject.displayText,
        },
        colIdx: 0,
      };
    }

    function onSelection(dateTime: DateTimeObject) {
      dateTimeObject = {
        dateTimeObj: {
          startDate: dateTime.startDate,
          endDate: dateTime.endDate,
          value: dateTime.value,
          displayText: dateTime.displayText,
        },
        colIdx: colIdx,
      };

      setDateTime(dateTimeObject);
      headCells[colIdx].headerObject = dateTimeObject;
    }

    return (
      <CRXColumn item xs={11}>
        <DateTimeComponent
          showCompact={showDateCompact}
          reset={reset}
          dateTimeDetail={dateTimeObject.dateTimeObj}
          getDateTimeDropDown={(dateTime: DateTimeObject) => {
            onSelection(dateTime);
          }}
          dateOptionType={dateOptionType}
        />
      </CRXColumn>
    );
  };

  const searchAndNonSearchMultiDropDown = (
    rowsParam: EvidenceReformated[],
    headCells: HeadCellProps[],
    colIdx: number,
    isSearchable: boolean,
  ) => {
    const onSetSearchData = () => {
      setSearchData((prevArr) =>
        prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
      );
    };

    const onSetHeaderArray = (v: ValueString[]) => {
      headCells[colIdx].headerArray = v;
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
      />
    );
  };

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: `${t("ID")}`,
      id: "id",
      align: "right",
      dataComponent: () => null,
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: "120",
    },
    {
      label: `${t("AssetThumbnail")}`,
      id: "assetType",
      align: "left",
      dataComponent: thumbTemplate,
      minWidth: "122",
      maxWidth: "144",
    },
    {
      label: `${t("AssetID")}`,
      id: "assetName",
      align: "left",
      dataComponent: assetNameTemplate,
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      detailedDataComponentId: "asset",
    },
    {
      label: `${t("AssetType")}`,
      id: "assetType",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: EvidenceReformated[], columns: HeadCellProps[], colIdx: number) => searchAndNonSearchMultiDropDown(rowData,columns,colIdx,true),
      minWidth: "200",
      visible: false,
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "200",
    },
    {
      label: `${t("Categories")}`,
      id: "categories",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: EvidenceReformated[], columns: HeadCellProps[], colIdx: number) => searchAndNonSearchMultiDropDown(rowData,columns,colIdx,true),
      minWidth: "150",
    },
    {
      label: `${t("Device")}`,
      id: "devices",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: EvidenceReformated[], columns: HeadCellProps[], colIdx: number) => searchAndNonSearchMultiDropDown(rowData,columns,colIdx,false),
      minWidth: "100",
      visible: false,
    },
    {
      label: `${t("Station")}`,
      id: "station",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: EvidenceReformated[], columns: HeadCellProps[], colIdx: number) => searchAndNonSearchMultiDropDown(rowData,columns,colIdx,false),
      minWidth: "120",
      visible: false,
    },
    {
      label: `${t("Username")}`,
      id: "recordedBy",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, "linkColor"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: EvidenceReformated[], columns: HeadCellProps[], colIdx: number) => searchAndNonSearchMultiDropDown(rowData,columns,colIdx,true),
      minWidth: "135",
    },
    {
      label: `${t("Captured")}`,
      id: "recordingStarted",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      minWidth: "120",
      searchFilter: true,
      searchComponent: searchDate,
    },
    {
      label: `${t("FileStatus")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      minWidth: "110",
      searchFilter: true,
      searchComponent: (rowData: EvidenceReformated[], columns: HeadCellProps[], colIdx: number) => searchAndNonSearchMultiDropDown(rowData,columns,colIdx,false),
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
    dataArrayBuilder();
  }, [searchData]);

  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells);
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

  const resizeRow = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  return (
    <>
      {rows && (
        <CRXDataTable
          id="assetDataTable"
          actionComponent={
            <ActionMenu row={selectedActionRow} selectedItems={selectedItems} />
          }
          getRowOnActionClick={(val: EvidenceReformated) =>
            setSelectedActionRow(val)
          }
          showToolbar={true}
          dataRows={rows}
          headCells={headCells}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          allowDragableToList={false}
          className="ManageAssetDataTable"
          onClearAll={clearAll}
          getSelectedItems={(v: string[]) => setSelectedItems(v)}
          onResizeRow={resizeRow}
          onHeadCellChange={onSetHeadCells}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          dragVisibility={true}
          showCheckBoxesCol={true}
          showActionCol={true}
        />
      )}
    </>
  );
};
export default MasterMain;
