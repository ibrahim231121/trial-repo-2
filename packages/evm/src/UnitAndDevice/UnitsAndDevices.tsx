import React, { useEffect } from "react";
import { CRXDataTable, CRXColumn } from "@cb/shared";
import { useTranslation } from "react-i18next";
import useGetFetch from '../utils/Api/useGetFetch';
import { useDispatch, useSelector } from "react-redux";
import { DateTimeComponent } from "../components/DateTimeComponent";
import { getGroupAsync, getGroupUserCountAsync } from "../Redux/GroupReducer";
import { dateOptionsTypes } from '../utils/constant';
import { RootState } from "../Redux/rootReducer";
import textDisplay from "../components/DateDisplayComponent/TextDisplay";
import anchorDisplay from "../components/DateDisplayComponent/AnchorDisplay";
import { useHistory } from "react-router-dom";
import './index.scss'
import { getUnitInfoAsync } from "../Redux/UnitReducer";
import dateDisplayFormat from "../components/DateDisplayComponent/DateDisplayFormat";
import multitextDisplay from "../components/DateDisplayComponent/MultiTextDisplay";
import MultSelectiDropDown from "../components/SearchComponents/MultSelectiDropDown";
import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onTextCompare,
  onMultiToMultiCompare,
  onDateCompare,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  onClearAll,
  onSaveHeadCellData,
  onSetHeadCellVisibility
} from "../utils/globalDataTableFunctions";
import UnitAndDevicesActionMenu from "./UnitAndDevicesActionMenu";
import TextSearch from "../components/SearchComponents/TextSearch";
import { CRXButton } from "@cb/shared";
import { logOutUser } from "../Login/API/auth";
import { CBXLink } from "@cb/shared";

type Unit = {
  id: number;
  unitId: string,
  description: string,
  station: string,
  assignedTo: string[],
  lastCheckedIn: string,
  status: string
}

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


const UnitAndDevices: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
 // let history = useHistory();

  React.useEffect(() => {
    dispatch(getUnitInfoAsync()); // getunitInfo 

   let headCellsArray = onSetHeadCellVisibility(headCells);
   setHeadCells(headCellsArray);
   onSaveHeadCellData(headCells, "Units & Devices");  // will check this

  }, []);

  

  const units: any = useSelector((state: RootState) => state.unitReducer.unitInfo);
 // const groupUsersCount: any = useSelector((state: RootState) => state.groupReducer.groupUserCounts);
  const [rows, setRows] = React.useState<Unit[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Unit[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<Unit[]>();
  const [selectedActionRow, setSelectedActionRow] = React.useState<GroupUser>();

  const setData = () => {
    let unitRows: Unit[] = [];
        if (units && units.length > 0) {
          unitRows = units.map((unit: any, i:number) => {
                return {
                    id: unit.recId,
                    unitId: unit.unitId,
                    description: unit.description,
                    station: unit.station,
                    assignedTo: unit.assignedTo,
                  //   assignedTo: unit.assignedTo != null ? unit.assignedTo.split(',').map((x: string) => {
                  //     return x.trim();
                  // }) : [],
                    lastCheckedIn: unit.lastCheckedIn,
                    status: unit.status
                }
            })
        }
        setRows(unitRows)
        setReformattedRows(unitRows);

  }

  React.useEffect(() => {
    setData();
  }, [units]);


  const searchText = (
    rowsParam: Unit[],
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
      rowsParam: Unit[],
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
                  startDate: reformattedRows !== undefined ? reformattedRows[0].lastCheckedIn : "",
                  endDate: reformattedRows !== undefined ? reformattedRows[reformattedRows.length - 1].lastCheckedIn : "",
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
      minWidth: "80",
      maxWidth: "100",
    },
    {
      label: `${t("UnitId")}`,
      id: "unitId",
      align: "left",
      dataComponent: (e: string) => anchorDisplay(e, "linkColor"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
    }, 
   
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
    },
    {
      label: `${t("Station")}`,
      id: "station",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
    },
    {
      label: `${t("Assigned To")}`,
      id: "assignedTo",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, ""),
      sort: true,
      searchFilter: true,
    //  searchComponent: searchText,
       searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, true),
           
      minWidth: "100",
      maxWidth: "100",
    },
    {
      label: `${t("Last Checked In")}`,
      id: "lastCheckedIn",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: "140"
    },
    {
      label: `${t("Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
    }
  ]);


  const searchAndNonSearchMultiDropDown = (
    rowsParam: Unit[],
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
            reformattedRows={reformattedRows !== undefined ? reformattedRows : rowsParam}
            // reformattedRows={reformattedRows}
            isSearchable={isSearchable}
            onMultiSelectChange={onSelection}
            onSetSearchData={onSetSearchData}
            onSetHeaderArray={onSetHeaderArray}
        />
    );
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

const dataArrayBuilder = () => {
    if (reformattedRows !== undefined) {
        let dataRows: Unit[] = reformattedRows;
        searchData.forEach((el: SearchObject) => {
          if (el.columnName === "description" || el.columnName === "station" || el.columnName === "unitId" || el.columnName === "status" || el.columnName === "assignedTo" )
                dataRows = onTextCompare(dataRows, headCells, el);
            if (el.columnName === "lastCheckedIn")
                dataRows = onDateCompare(dataRows, headCells, el);

        }
        );
        setRows(dataRows);
    }
};

const resizeRow = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
};

const clearAll = () => {
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
};

const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
};


  return (
 
  
    <div style={{ marginLeft: "6%", marginTop: "10%" }}>
        
      {
        
        rows && (
        <CRXDataTable
          id="Units & Devices"
          actionComponent={<UnitAndDevicesActionMenu />}
          getRowOnActionClick={(val: GroupUser) =>
            setSelectedActionRow(val)
          }

          showToolbar={true}
          showCountText={false}
          columnVisibilityBar={true}


          dragVisibility={true}
          showCheckBoxesCol={true}
          showActionCol={true}


          headCells={headCells}
          dataRows={rows}


          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}


          allowDragableToList={true}

          showActionSearchHeaderCell={true}
          showCustomizeIcon={true}
          //---required Props
          className="ManageAssetDataTable crxTableHeight bucketDataTable"
          onClearAll={clearAll}
          getSelectedItems={(v: Unit[]) => setSelectedItems(v)}
          onResizeRow={resizeRow}
          onHeadCellChange={onSetHeadCells}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          />
          )
        }
      
    </div>
 
  )
}

export default UnitAndDevices
