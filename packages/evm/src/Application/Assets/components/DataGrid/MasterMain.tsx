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
import DateTimeComponent from "../../../../components/DateTimeComponent";
import moment from "moment";
import "./ManageAssetGrid.scss";
import thumbImg from "../../../../Assets/Images/thumb.png";
import { useTranslation } from "react-i18next";
import { basicDateOptions } from "../../../../utils/constant";
import ActionMenu from "../ActionMenu";
import DetailedAssetPopup from "./DetailedAssetPopup";
import dateDisplayFormat from "../../../../components/DateDisplayComponent/DateDisplayFormat";

type Order = "asc" | "desc";

type SearchObject = {
  columnName: string;
  colIdx: number;
  value: any;
};

type DateTimeProps = {
  startDate: string;
  endDate: string;
  colIdx: number;
};

interface HeadCellProps {
  //disablePadding: boolean;
  id: any;
  //value: any;
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
  detailedDataComponentId?: string;
  detailedDataComponent?: any;
}

type Asset = {
  assetId: string;
  assetName: string;
  camera: string;
  assetType: string;
  recordingStarted: string;
}

const thumbTemplate = (rowData: any) => {
  return (
    <>
      <div className="assetThumb">
        <i className="tumbPlayIcon icon-play3"></i>
        <img src={thumbImg} alt="Asset Thumb" />
      </div>
    </>
  );
};

const textTemplate = (text: string) => {
  return <div className="filterOption">{text}</div>;
};

//-----------------
const assetNameTemplate = (rowData: string, assets: Asset[]) => {
  return (
    <>
      <div className="alignLeft linkColor">
        {rowData}
      </div>
      <DetailedAssetPopup asset={assets} />
    </>
  );
};

const assetTypeTemplate = (rowData: any) => {
  return (
    <>
      <div className="alignLeft">{rowData}</div>
    </>
  );
};
const assetUnitTemplate = (rowData: any) => {
  return (
    <>
      <div className="alignLeft">{rowData}</div>
    </>
  );
};
const assetCategoryTemplate = (rowData: any) => {
  return (
    <>
      <div className="alignLeft">
        {rowData.map((item: any) => item).join(", ")}
      </div>
    </>
  );
};
const assetRecordedByTemplate = (rowData: any[]) => {
  return (
    <>
      <div className="alignLeft linkColor">
        {rowData.map((item: any) => item).join(", ")}
      </div>
    </>
  );
};
const assetHolduntillTemplate = (rowData: any) => {
  return dateDisplayFormat(rowData);
};
const assetStatusTemplate = (rowData: any) => {
  return (
    <>
      <div className="alignLeft">{rowData}</div>
    </>
  );
};
//-----------------

const MasterMain: React.FC<any> = (props) => {
  let reformattedRows: any[] = [];

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

  let requiredDateOptions = basicDateOptions.map((x, i) => {
    if (x.value === "custom") return x;
    if (
      DateFormat(x.startDate()) >=
      DateFormat(props.dateTimeDropDown.startDate) &&
      DateFormat(x.endDate()) <= DateFormat(props.dateTimeDropDown.endDate) &&
      x.value != "custom"
    )
      return x;
  });
  requiredDateOptions = requiredDateOptions.filter((x) => x != undefined);

  const { t } = useTranslation<string>();
  const [rows, setRows] = React.useState<any[]>(reformattedRows);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<any>([]);
  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    startDate: "",
    endDate: "",
    colIdx: 0,
  });

  const SearchText = (
    rowsParam: any[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    function handleChange(e: any, colIdx: number) {
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
        onChange={(e: any) => handleChange(e, colIdx)}
      />
    );
  };

  const searchDate = (
    rowsParam: any[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    let reset: boolean = false;

    if (
      headCells[colIdx].headerText === "filled" ||
      headCells[colIdx].headerText === undefined
    )
      reset = false;
    else reset = true;

    function startDatehandleChange(val: any, colIdx: number) {
      setDateTime((state: DateTimeProps) => ({
        ...state,
        ["startDate"]: val,
        ["colIdx"]: colIdx,
      }));
      headCells[colIdx].headerText = "filled";
    }

    function endDatehandleChange(val: any) {
      setDateTime((state: DateTimeProps) => ({ ...state, ["endDate"]: val }));
      headCells[colIdx].headerText = "filled";
    }

    return (
      <CRXColumn item xs={11}>
        <DateTimeComponent
          getStartDate={(val: any) => startDatehandleChange(val, colIdx)}
          getEndDate={(val: any) => endDatehandleChange(val)}
          minDate={moment(props.dateTimeDropDown.startDate)
            .local()
            .format("YYYY-MM-DDTHH:MM")}
          maxDate={moment(props.dateTimeDropDown.endDate)
            .local()
            .format("YYYY-MM-DDTHH:MM")}
          //showChildDropDown={true}
          dateOptions={requiredDateOptions}
          defaultValue={props.dateTimeDropDown.selectedDateOptionValue}
          reset={reset}
          getSelectedDateOptionValue={(v: string) => { }}
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

    function handleChange(e: any, colIdx: number, v: any) {
      setFilterValue((val: []) => [...v]);
      selectMultiChange(e, colIdx, v);
      headCells[colIdx].headerText = e.target.value;
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
    }

    useEffect(() => {
      if (filterValue.length == 0) {
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
                value={filterValue}
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
      dataComponent: textTemplate,
      sort: true,
      searchFilter: true,
      searchComponent: SearchText,
      keyCol: true,
      visible: false,
      minWidth: "120",
    },
    {
      label: `${t("AssetThumbnail")}`,
      id: "assetId",
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
      searchComponent: SearchText,
      minWidth: "180",
      detailedDataComponentId: "asset",
      detailedDataComponent: DetailedAssetPopup,
    },
    {
      label: `${t("AssetType")}`,
      id: "assetType",
      align: "left",
      dataComponent: assetTypeTemplate,
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
      dataComponent: assetUnitTemplate,
      sort: true,
      searchFilter: true,
      searchComponent: SearchText,
      minWidth: "200",
    },
    {
      label: `${t("Categories")}`,
      id: "categories",
      align: "left",
      dataComponent: assetCategoryTemplate,
      sort: true,
      searchFilter: true,
      searchComponent: SearchMultiDropDown,
      minWidth: "150",
    },
    {
      label: `${t("Device")}`,
      id: "devices",
      align: "left",
      dataComponent: textTemplate,
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
      dataComponent: textTemplate,
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
      dataComponent: assetRecordedByTemplate,
      sort: true,
      searchFilter: true,
      searchComponent: SearchMultiDropDown,
      minWidth: "135",
    },
    {
      label: `${t("Captured")}`,
      id: "recordingStarted",
      align: "center",
      dataComponent: assetHolduntillTemplate,
      sort: true,
      minWidth: "120",
      searchFilter: true,
      searchComponent: searchDate,
    },
    {
      label: `${t("FileStatus")}`,
      id: "status",
      align: "left",
      dataComponent: assetStatusTemplate,
      sort: true,
      minWidth: "110",
      searchFilter: true,
      searchComponent: NonSearchMultiDropDown,
    },
  ]);

  const selectMultiChange = (e: any, colIdx: number, v: []) => {
    if (v.length == 0) {
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

  function onClearAll() {
    
    setSearchData([]);
    let headCellReset = headCells.map((headCell, i) => {
      headCell.headerText = "";
      return headCell;
    });
    setHeadCells(headCellReset);
  };

  return (
    <>
      {rows && (
        <CRXDataTable
          actionComponent={
            <ActionMenu isSelected={selectedItems.length > 0 ? true : false} />
          }
          dataRows={rows}
          headCells={headCells}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          allowDragableToList={false}
          className="ManageAssetDataTable"
          onClearAll={onClearAll}
          getSelectedItems={(v: any) => setSelectedItems(v)}
          
        />
      )}
    </>
  );
};
export default MasterMain;
