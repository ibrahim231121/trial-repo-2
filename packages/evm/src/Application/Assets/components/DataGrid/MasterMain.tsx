import React, { useEffect, useState, useRef } from "react";
import {
  CRXDataTable,
  Order,
  HeadCellProps,
  TextField,
  CRXSelectBox,
  CRXMultiSelect,
  CRXPaper,
  CRXHeading,
  CRXColumn,
  CRXRows,
} from "@cb/shared";
import { DateTimeComponent } from "../../../../components/DateTimeComponent";
import moment from "moment";
import "./ManageAssetGrid.scss";
import thumbImg from "../../../../Assets/Images/thumb.png";
import { useTranslation } from "react-i18next";
import {
  dateOptions,
  dateOptionsTypes,
  basicDateDefaultValue,
  approachingDateDefaultValue,
} from "../../../../utils/constant";
import ActionMenu from "../ActionMenu";
import DetailedAssetPopup from "./DetailedAssetPopup";
import dateDisplayFormat from "../../../../components/DateDisplayComponent/DateDisplayFormat";
import AssetThumbnail from "./AssetThumbnail"
import textDisplay from "../../../../components/DateDisplayComponent/TextDisplay";
import multitextDisplay from "../../../../components/DateDisplayComponent/MultiTextDisplay";

type Order = "asc" | "desc";

type SearchObject = {
  columnName: string;
  colIdx: number;
  value: any;
};

type DateTimeProps = {
  startDate: string;
  endDate: string;
  value: string;
  displayText: string;
  colIdx: number;
};

type DateTimeObject = {
  startDate: string;
  endDate: string;
  value: string;
  displayText: string;
};

interface HeadCellProps {
  id: any;
  label: string;
  align: string;
  sort?: boolean;
  visible?: boolean;
  minWidth: string;
  maxWidth?: string;
  dataComponent?: any;
  searchFilter?: boolean;
  searchComponent?: any; // (Dropdown / Multiselect / Input / Custom Component)
  keyCol?: boolean; // This is a Key column. Do not assign it to maximum 1 column
  headerText?: string;
  headerArray?: [];
  headerObject?: any;
  detailedDataComponentId?: string;
  detailedDataComponent?: any;
}

type Asset = {
  assetId: string;
  assetName: string;
  camera: string;
  assetType: string;
  recordingStarted: string;
};

const thumbTemplate = (rowData: string) => {
  return (
    <AssetThumbnail
    rowData={rowData}
    fontSize="61pt"
    />
  );
};
//-----------------
const assetNameTemplate = (rowData: string, assets: Asset[]) => {
  return (
    <>
      {textDisplay(rowData, "linkColor")}
      <DetailedAssetPopup asset={assets} />
    </>
  );
};

const MasterMain: React.FC<any> = (props) => {
  let reformattedRows: any[] = [];
  console.log(props.rows)
  props.rows.map((row: any, i: number) => {
    let obj: any = {};
    obj["id"] = row["id"];
    obj["assetId"] = row.masterAsset["assetId"];
    obj["assetName"] = row.masterAsset["assetName"];
    obj["assetType"] = row.masterAsset["assetType"];
    obj["unit"] = row.masterAsset["unit"];
    obj["description"] = row["description"];
    obj["categories"] = row["categories"];
    obj["devices"] = row["devices"];
    obj["station"] = row["station"];
    obj["recordedBy"] = row.masterAsset["recordedBy"];
    obj["recordingStarted"] = row.masterAsset["recordingStarted"];
    obj["status"] = row.masterAsset["status"];
    obj["asset"] = row["asset"].filter(
      (x: any) => x.assetId !== row.masterAssetId
    );

    reformattedRows.push(obj);
  });

  const { t } = useTranslation<string>();
  const [rows, setRows] = React.useState<any[]>(reformattedRows);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<any>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<{}>();

  const [showDateCompact, setShowDateCompact] = React.useState(props.showDateCompact);

  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    startDate: "",
    endDate: "",
    value: "",
    displayText: "",
    colIdx: 0,
  });

  const searchText = (
    rowsParam: any[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    function handleChange(e: any) {
      selectChange(e, colIdx);
      headCells[colIdx].headerText = e.target.value;
    }

    return (
      <TextField
        value={
          headCells[colIdx].headerText === undefined
            ? (headCells[colIdx].headerText = "")
            : headCells[colIdx].headerText
        }
        id={"CRX_" + colIdx.toString()}
        onChange={(e: any) => handleChange(e)}
      />
    );
  };

  const searchDate = (
    rowsParam: any[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    let reset: boolean = false;

    let dateTimeObject: DateTimeProps = {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
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
        startDate: props.dateTimeDetail.startDate,
        endDate: props.dateTimeDetail.endDate,
        value: props.dateTimeDetail.value,
        displayText: props.dateTimeDetail.displayText,
        colIdx: 0,
      };
    } else {
      dateTimeObject = {
        startDate: headCells[colIdx].headerObject.startDate,
        endDate: headCells[colIdx].headerObject.endDate,
        value: headCells[colIdx].headerObject.value,
        displayText: headCells[colIdx].headerObject.displayText,
        colIdx: 0,
      };
    }

    function onSelection(dateTime: DateTimeObject) {
      dateTimeObject = {
        startDate: dateTime.startDate,
        endDate: dateTime.endDate,
        colIdx: colIdx,
        value: dateTime.value,
        displayText: dateTime.displayText,
      };

      setDateTime(dateTimeObject);
      headCells[colIdx].headerObject = dateTimeObject;
    }

    return (
      <CRXColumn item xs={11}>
        <DateTimeComponent
          showCompact={showDateCompact}
          reset={reset}
          dateTimeDetail={dateTimeObject}
          getDateTimeDropDown={(dateTime: DateTimeObject) => {
            onSelection(dateTime);
          }}
          dateOptionType={props.dateOptionType}
        />
      </CRXColumn>
    );
  };

  const searchDropDown = (
    rowsParam: any[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    let options = reformattedRows.map((row: any, _: any) => {
      let option: any = {};
      let x = headCells[colIdx].id;
      option["value"] = row[headCells[colIdx].id];
      return option;
    });

    // For those properties which contains an array
    if (
      headCells[colIdx].id.toString() === "categories" ||
      headCells[colIdx].id.toString() === "recordedBy"
    ) {
      let moreOptions: any = [];
      reformattedRows.map((row: any, _: any) => {
        let x = headCells[colIdx].id;
        row[x].forEach((element: any) => {
          let moreOption: any = {};
          moreOption["value"] = element;
          moreOptions.push(moreOption);
        });
      });
      options = moreOptions;
    }
    //------------------

    let unique: any = options.map((x: any) => x);

    if (options.length > 0) {
      unique = [];
      unique[0] = options[0];

      for (var i = 0; i < options.length; i++) {
        if (!unique.some((item: any) => item.value === options[i].value)) {
          let value: any = {};
          value["value"] = options[i].value;
          unique.push(value);
        }
      }
    }

    function handleChange(e: any, colIdx: number) {
      selectChange(e, colIdx);
      headCells[colIdx].headerText = e.target.value;
    }

    return (
      <div className="filterSelect">
        <CRXSelectBox
          className="selectFilter"
          popover="dropdownPaper"
          options={unique}
          id={colIdx.toString()}
          onChange={(e: any) => handleChange(e, colIdx)}
          onClick={(e: any) => console.log(e)}
          value={
            headCells[colIdx].headerText === undefined
              ? (headCells[colIdx].headerText = "")
              : headCells[colIdx].headerText
          }
        />
      </div>
    );
  };

  const MultiDropDown = (
    rowsParam: any[],
    headCells: HeadCellProps[],
    colIdx: number,
    isSearchable: boolean
  ) => {
    const [filterValue, setFilterValue] = React.useState<any>([]);
    const [openState, setOpenState] = React.useState<boolean>(true);
    const [buttonState, setButtonState] = React.useState<boolean>(false);

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
      reformattedRows.map((row: any, _: any) => {
        let x = headCells[colIdx].id;
        row[x].forEach((element: any) => {
          let moreOption: any = {};
          moreOption["value"] = element;
          moreOptions.push(moreOption);
        });
      });
      options = moreOptions;
    }
    //------------------

    let unique: any = options.map((x: any) => x);

    if (options.length > 0) {
      unique = [];
      unique[0] = options[0];

      for (var i = 0; i < options.length; i++) {
        if (!unique.some((item: any) => item.value === options[i].value)) {
          let value: any = {};
          value["value"] = options[i].value;
          unique.push(value);
        }
      }
    }

    function handleChange(e: any, colIdx: number, v: any) {
      setFilterValue((val: []) => [...v]);
      selectMultiChange(e, colIdx, v);
      headCells[colIdx].headerArray = v;
    }
    function GetClassName() {
      return openState ? "" : "hide";
    }
    function GetButtonClass() {
      return buttonState ? "" : "hide";
    }
    function OnCloseEffect(e: any, r: any) {
      if (filterValue.length > 0) {
        setButtonState(true);
        setOpenState(false);
      } else {
        setButtonState(false);
        setOpenState(true);
      }
    }
    function ClearFilter() {
      setOpenState(true);
      setButtonState(false);
      setFilterValue([]);
      headCells[colIdx].headerArray = [];
    }

    useEffect(() => {
      ClearFilter();
    }, [headCells]);

    useEffect(() => {
      if (filterValue.length === 0) {
        setSearchData((prevArr) =>
          prevArr.filter(
            (e) => e.columnName !== headCells[colIdx].id.toString()
          )
        );
      }
    }, [filterValue]);

    return (
      <div className="">
        <CRXRows container spacing={2}>
          <CRXColumn item xs={6}>
            <CRXPaper
              variant="outlined"
              elevation={1}
              square={true}
              className={"centerPosition"}
            >
              <CRXHeading variant="h6" align="left">
                {" "}
              </CRXHeading>
              <div className={GetButtonClass()}>
                <button
                  className="fas fa-filter"
                  onClick={(e) => setOpenState((state) => !state)}
                ></button>
                <button
                  className="fas fa-times"
                  onClick={(e) => ClearFilter()}
                ></button>
              </div>

              <CRXMultiSelect
                className={GetClassName()}
                onClose={(e: any, r: any) => {
                  return OnCloseEffect(e, r);
                }}
                // name={"AssetType"}
                multiple={true}
                CheckBox={true}
                options={unique}
                value={
                  headCells[colIdx].headerArray === undefined
                    ? (headCells[colIdx].headerArray = [])
                    : headCells[colIdx].headerArray
                }
                autoComplete={false}
                useRef={openState && buttonState}
                isSearchable={isSearchable}
                onChange={(event: any, newValue: any) => {
                  return handleChange(event, colIdx, newValue);
                }}
              />
            </CRXPaper>
          </CRXColumn>
        </CRXRows>
      </div>
    );
  };

  const SearchMultiDropDown = (
    rowsParam: any[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    return MultiDropDown(rowsParam, headCells, colIdx, true);
  };

  const NonSearchMultiDropDown = (
    rowsParam: any[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    return MultiDropDown(rowsParam, headCells, colIdx, false);
  };

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: `${t("ID")}`,
      id: "id",
      align: "right",
      dataComponent: (e: any) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      keyCol: true,
      visible: false,
      minWidth: "120",
    },
    {
      label: `${t("AssetThumbnail")}`,
      id: "assetType",
      align: "left",
      dataComponent: thumbTemplate,
      minWidth: "155",
      maxWidth: "171",
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
      detailedDataComponent: DetailedAssetPopup,
    },
    {
      label: `${t("AssetType")}`,
      id: "assetType",
      align: "left",
      dataComponent: (e: any) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: SearchMultiDropDown,
      minWidth: "200",
      visible: false,
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: any) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "200",
    },
    {
      label: `${t("Categories")}`,
      id: "categories",
      align: "left",
      dataComponent: (e: any) => multitextDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: SearchMultiDropDown,
      minWidth: "150",
    },
    {
      label: `${t("Device")}`,
      id: "devices",
      align: "left",
      dataComponent: (e: any) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: NonSearchMultiDropDown,
      minWidth: "100",
      visible: false,
    },
    {
      label: `${t("Station")}`,
      id: "station",
      align: "left",
      dataComponent: (e: any) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: NonSearchMultiDropDown,
      minWidth: "120",
      visible: false,
    },
    {
      label: `${t("Username")}`,
      id: "recordedBy",
      align: "left",
      dataComponent: (e: any) => multitextDisplay(e, "linkColor"),
      sort: true,
      searchFilter: true,
      searchComponent: SearchMultiDropDown,
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
      dataComponent: (e: any) => textDisplay(e, ""),
      sort: true,
      minWidth: "110",
      searchFilter: true,
      searchComponent: NonSearchMultiDropDown,
    },
  ]);

  const selectMultiChange = (e: any, colIdx: number, v: []) => {
    if (v.length === 0) {
      setSearchData((prevArr) =>
        prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
      );
    } else {
      for (var i = 0; i < v.length; i++) {
        let newItem = {
          columnName: headCells[colIdx].id.toString(),
          colIdx,
          value: v.map((x, i) => {
            return x["value"];
          }),
        };
        setSearchData((prevArr) =>
          prevArr.filter(
            (e) => e.columnName !== headCells[colIdx].id.toString()
          )
        );
        setSearchData((prevArr) => [...prevArr, newItem]);
      }
    }
  };

  const selectChange = (e: any, colIdx: number) => {
    if (e.target.value !== "" && e.target.value !== undefined) {
      let newItem = {
        columnName: headCells[colIdx].id.toString(),
        colIdx,
        value: e.target.value,
      };
      setSearchData((prevArr) =>
        prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
      );
      setSearchData((prevArr) => [...prevArr, newItem]);
    } else
      setSearchData((prevArr) =>
        prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
      );
  };

  useEffect(() => {
    if (
      dateTime.startDate !== "" &&
      dateTime.startDate !== undefined &&
      dateTime.startDate != null &&
      dateTime.endDate !== "" &&
      dateTime.endDate !== undefined &&
      dateTime.endDate != null
    ) {
      let newItem = {
        columnName: headCells[dateTime.colIdx].id.toString(),
        colIdx: dateTime.colIdx,
        value: [dateTime.startDate, dateTime.endDate],
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
  }, [dateTime]);

  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);

  useEffect(() => {
    setRows(reformattedRows);
  }, []);

  const dataArrayBuilder = () => {
    let dataRows: any = reformattedRows;
    searchData.forEach((el: SearchObject) => {
      if (el.columnName === "assetName")
        dataRows = dataRows.filter(function (x: any) {
          return (
            x[headCells[el.colIdx].id]
              .toLowerCase()
              .indexOf(el.value.toLowerCase()) !== -1
          );
        });
      //for multi select searchable dropdown
      if (
        ["assetType", "devices", "station", "status"].includes(el.columnName)
      ) {
        dataRows = dataRows.filter((x: any) => {
          return el.value.includes(x[headCells[el.colIdx].id]);
        });
      }
      if (["categories", "recordedBy"].includes(el.columnName)) {
        dataRows = dataRows.filter((x: any) => {
          return x[headCells[el.colIdx].id]
            .map((y: any) => el.value.includes(y))
            .includes(true);
        });
      }
      if (el.columnName === "description")
        dataRows = dataRows.filter(function (x: any) {
          return (
            x[headCells[el.colIdx].id]
              .toLowerCase()
              .indexOf(el.value.toLowerCase()) !== -1
          );
        });
      // if (el.columnName === "categories")
      //   dataRows = dataRows.filter(function (x: any) {
      //     return x[headCells[el.colIdx].id]
      //       .map((item: any) => item)
      //       .join(", ")
      //       .toLowerCase()
      //       .includes(el.value.toLowerCase());
      //   });
      // if (el.columnName === "devices")
      //   dataRows = dataRows.filter(
      //     (x: any) => x[headCells[el.colIdx].id] === el.value
      //   );
      // if (el.columnName === "station")
      //   dataRows = dataRows.filter(
      //     (x: any) => x[headCells[el.colIdx].id] === el.value
      //   );
      // if (el.columnName === "recordedBy")
      //   dataRows = dataRows.filter(function (x: any) {
      //     return x[headCells[el.colIdx].id]
      //       .map((item: any) => item)
      //       .join(", ")
      //       .toLowerCase()
      //       .includes(el.value.toLowerCase());
      //   });
      if (el.columnName === "expiryDate") {
        dataRows = dataRows.filter(
          (x: any) =>
            DateFormat(x[headCells[el.colIdx].id]) === DateFormat(el.value)
        );
      }
      if (el.columnName === "recordingStarted") {
        dataRows = dataRows.filter(
          (x: any) =>
            DateFormat(x[headCells[el.colIdx].id]) >= DateFormat(el.value[0]) &&
            DateFormat(x[headCells[el.colIdx].id]) <= DateFormat(el.value[1])
        );
      }
      // if (el.columnName === "status")
      //   dataRows = dataRows.filter(
      //     (x: any) => x[headCells[el.colIdx].id] === el.value
      //   );
    });
    setRows(dataRows);
  };

  function DateFormat(value: any) {
    const stillUtc = moment.utc(value).toDate();
    const localDate = moment(stillUtc).local().format("YYYY-MM-DD");
    return localDate;
  }

  const onClearAll = () => {
    setSearchData([]);
    let headCellReset = headCells.map((headCell, i) => {
      headCell.headerText = "";
      headCell.headerArray = [];
      return headCell;
    });
    setHeadCells(headCellReset);
  };

  const resizeRow = (e: any) => {
    const { colIdx, deltaX } = e;
    let value = headCells[colIdx].minWidth;

    let x = parseInt(value) + parseInt(deltaX);
    //headCells[colIdx].minWidth = x.toString()

    let headCellReset = headCells.map((headCell, i) => {
      if (i === colIdx) headCell.minWidth = x.toString();
      return headCell;
    });
    setHeadCells(headCellReset);
  };

  return (
    <>
      {rows && (
        <CRXDataTable
          actionComponent={
            <ActionMenu row={selectedActionRow} selectedItems={selectedItems} />
          }
          getSelectedItems={(v: any) => setSelectedItems(v)}
          getRowOnActionClick={(val:any)=>setSelectedActionRow(val)}
          showToolbar={true}
          dataRows={rows} 
          headCells={headCells}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          allowDragableToList={false}
          className="ManageAssetDataTable"
          onClearAll={onClearAll}
          onResizeRow={resizeRow}
        />
      )}
    </>
  );
};
export default MasterMain;
