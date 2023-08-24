import React, { useEffect, useContext, useRef } from "react";
import { CRXDataTable, CRXColumn, CBXMultiSelectForDatatable, CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DateTimeComponent } from '../GlobalComponents/DateTime';
import { dateOptionsTypes } from '../utils/constant';
import { RootState } from "../Redux/rootReducer";
import textDisplay from "../GlobalComponents/Display/TextDisplay";
import moment from "moment";
import anchorDisplayUnit from "../GlobalComponents/Display/AnchorDisplayUnit";
import './index.scss'
import { getUnitInfoAsync, getAllUnitVersionKeyValuesAsync, getAllUnitStatusKeyValuesAsync, getAllUnitTemplateKeyValuesAsync, getAllUnitAssignmentKeyValuesAsync } from "../Redux/UnitReducer";
import { dateDisplayFormat } from "../GlobalFunctions/DateFormat";
import textDisplayStatus from "../GlobalComponents/Display/textDisplayStatus";
import textDisplayStation from "../GlobalComponents/Display/textDisplayStation";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onTextCompare,
  onMultipleCompare,
  onDateCompare,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  onClearAll,
  onSaveHeadCellData,
  onSetHeadCellVisibility,
  GridFilter,
  PageiGrid
} from "../GlobalFunctions/globalDataTableFunctions";
import UnitAndDevicesActionMenu from "./UnitAndDevicesActionMenu";
import TextSearch from "../GlobalComponents/DataTableSearch/TextSearch";

import { enterPathActionCreator } from "../Redux/breadCrumbReducer";
import ApplicationPermissionContext from "../ApplicationPermission/ApplicationPermissionContext";
import { subscribeGroupToSocket, unSubscribeGroupFromSocket } from "../utils/hub_config";
import { getToken } from "./../Login/API/auth";
import { TokenType } from "./../types";
import jwt_decode from "jwt-decode";
import { CRXToaster } from "@cb/shared";
import { getDeviceTypesAsync } from "../Redux/templateDynamicForm";
declare const window: any;
window.IsStatusExists=false;

type Unit = {
  id: number;
  unitId: string,
  description: string,
  serialNumber: string,
  template: string,
  deviceType: string;
  version: string,
  key: string,
  station: string,
  //assignedTo: string[],
  assignedToStr: string,
  lastCheckedIn: string,
  status: string,
  stationId: number,

}
interface renderCheckMultiselect {
  value: string,
  id: string,

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
  const toasterRef = useRef<typeof CRXToaster>(null);
  const userIdPreset = () => {
    var token = getToken();
    if (token) {
      var accessTokenDecode: any = jwt_decode(token);
      return accessTokenDecode.LoginId
    }
    else
      return ""
  }
  const tenMinutes: number = 10;
  const rowsRef = useRef<any>([]);
  const statusJson = useRef<any>();
  const intervalRef = useRef<any>();
  const units: any = useSelector((state: RootState) => state.unitReducer.unitInfo);
  const unitStatus: any = useSelector((state: RootState) => state.unitReducer.UnitStatusKeyValues);
  const unitTemplates: any = useSelector((state: RootState) => state.unitReducer.UnitTemplateKeyValues);
  const unitVersions: any = useSelector((state: RootState) => state.unitReducer.unitVersionKeyValues);
  const deviceTypes: any = useSelector((state: RootState) => state.unitTemplateSlice.deviceTypes);
  const [rows, setRows] = React.useState<Unit[]>([]);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<string>("LastCheckedIn");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Unit[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<any>();
  const [selectedActionRow, setSelectedActionRow] = React.useState<Unit>();
  const [open, setOpen] = React.useState<boolean>(false)
  const { getModuleIds } = useContext(ApplicationPermissionContext);

  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: [],
    },
    page: page,
    size: rowsPerPage,
    gridSort: {
      field: orderBy,
      dir: order
    }

  })
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)
  const [userId, setUserId] = React.useState<string>(userIdPreset());

  React.useEffect(() => {
    subscribeGroupToSocket("UnitStatus");
    singleEventListener("onWSMsgRecEvent", onMsgReceived);
    dispatch(getAllUnitStatusKeyValuesAsync());
    dispatch(getAllUnitAssignmentKeyValuesAsync());
    dispatch(getAllUnitVersionKeyValuesAsync());
    dispatch(getAllUnitTemplateKeyValuesAsync());
    dispatch(getDeviceTypesAsync());
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "Units & Devices");  // will check this
    document.getElementById("UDAssigned")?.parentElement?.classList.add("UDAssignedClass");

    intervalRef.current = setInterval(() => {
      getTheUnitStatusWithLogTimeInterval(rowsRef.current);
    }, 180000);

    return () => {
      singleEventListener("onWSMsgRecEvent");
      unSubscribeGroupFromSocket("UnitStatus");
      clearInterval(intervalRef.current);
    };
  }, []);

  const singleEventListener = (function (element: any) {
    var eventListenerHandlers: any = {};
    return function (eventName: string, func?: any) {
      eventListenerHandlers.hasOwnProperty(eventName) && element.removeEventListener(eventName, eventListenerHandlers[eventName]);
      if (func) {
        eventListenerHandlers[eventName] = func;
        element.addEventListener(eventName, func);
      }
      else {
        delete eventListenerHandlers[eventName];
      }
    }
  })(window);

  const setData = () => {

    let unitRows: Unit[] = [];

    if (units.data && units.data.length > 0) {
      unitRows = units.data.map((unit: any, i: number) => {
        let urlProps = {
          unitName: unit.unitId,
          unitId: unit.recId,
          stationId: unit.stationRecId,
          template: unit.template,
          deviceType: unit.deviceType,
          deviceTypeName: unit.deviceTypeName

        }
        let objUnit = {
          id: unit.recId,
          unitId: JSON.stringify(urlProps),
          description: unit.description,
          station: unit.station,
          serialNumber: unit.serialNumber,
          template: unit.template,
          deviceType: unit.deviceType,
          deviceTypeId: unit.deviceTypeId,
          deviceTypeName: unit.deviceTypeName,
          key: unit.key,
          version: unit.version,
          assignedToStr: unit.assignedToStr,
          lastCheckedIn: unit.lastCheckedIn,
          status: unit.status,
          stationId: unit.stationRecId
        }
        return objUnit;
      })
    }
    rowsRef.current = unitRows;
    setRows(unitRows)
    getTheUnitStatusWithLogTimeInterval(unitRows);
    setReformattedRows({
      ...reformattedRows,
      rows: unitRows,
      unitStatus: unitStatus,
      unitTemplates: unitTemplates,
      unitVersions: unitVersions,
      deviceTypes: deviceTypes,
   //   unitAssignments: unitAssignments
    });
  }
  const getTheUnitStatusWithLogTimeInterval = (objUnit: any) => {
    let currentTime = new Date();
    for (let index = 0; index < objUnit.length; index++) {
      let tenMinutesAddedInlastCheckedIn = moment(objUnit[index].lastCheckedIn).add(tenMinutes, 'm').toDate();
      if (tenMinutesAddedInlastCheckedIn < currentTime && objUnit[index].status != "Inactive" && objUnit[index].status != "Unregistered") {
        objUnit[index].status = "Offline";
      }
    }

    setRows(objUnit);
  }

  function onMsgReceived(e: any) {
    if (e != null && e.data != null && e.data.body != null) {
      statusJson.current = JSON.parse(e.data.body.data);
      statusJson.current.Data = UpdateDescription(statusJson.current.Data)
      setRowForUnitStatus(statusJson.current);
    }
  };

  const UpdateDescription = (status: string) => {
    switch (status) {
      case "Offline":
        return "Offline"
      case "Live":
        return "Live Streaming"
      case "Recording":
        return "Recording"
      case "Online":
        return "Online"
      case "OnlineWithGETAC":
        return "Online with GETAC"
      case "UnitBeingDiagnosed":
        return "Live Diagnosis"
      case "Unregistered":
        return "Unregistered"
      default:
        return "";
    }
  }
  const setRowForUnitStatus = (statusJson: any) => {
    if (statusJson != null && statusJson != "undefined") {
      const index = rowsRef.current.findIndex((e: any) => e.id === statusJson.UnitId);
      let rowscopy= [...rowsRef.current];
      if (index !== -1 && !window.IsStatusExists) {
          rowscopy[index].status = statusJson.Data;
          rowscopy[index].lastCheckedIn = statusJson.LogTime;
          rowsRef.current = rowscopy;
          setRows(rowscopy);     
      }
    }
  };

  React.useEffect(() => {
    setData();
    dispatch(enterPathActionCreator({ val: "" }));
  }, [units.data, unitStatus, unitTemplates, unitVersions, deviceTypes]);

  useEffect(() => {
    if (paging)
      dispatch(getUnitInfoAsync(pageiGrid));
    setPaging(false)
  }, [pageiGrid])

  const searchText = (
    rowsParam: Unit[],
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
          startDate: reformattedRows !== undefined ? reformattedRows.rows[0].lastCheckedIn : "",
          endDate: reformattedRows !== undefined ? reformattedRows.rows[reformattedRows.rows.length - 1].lastCheckedIn : "",
          value: "custom",
          displayText: t("custom_range"),
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
  function findUniqueValue(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  const multiSelectCheckbox = (rowParam: Unit[], headCells: HeadCellProps[], colIdx: number, initialRows: any) => {

    if (colIdx === 2 && initialRows && initialRows.unitStatus && initialRows.unitStatus.length > 0) {

      let status: any = [];
      let DisplayOrder = ["Offline", "Live", "Recording", "Online", "OnlineWithGETAC", "UnitBeingDiagnosed", "Unregistered"]
      DisplayOrder.forEach((y: any) => {

        var _status = initialRows.unitStatus.find((x: any) => { return x.name == y })
        status.push({ id: _status.id, value: _status.name, name: _status.description });
      })



      return (
        <div>
          {/* <CBXMultiSelectForDatatable 
          width = {200} 
          option={status} 
          value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
          onChange={(e: any, value : any) => changeMultiselect(e, value, colIdx)}
          onSelectedClear = {() => onSelectedClear(colIdx)}
          isCheckBox={true}
          isduplicate={true}
        /> */}
          <CBXMultiCheckBoxDataFilter
            percentage={true}
            width={100}
            option={status}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={false}
            multiple={false}
            isduplicate={true}
            className="statusFilter"
          />
        </div>
      )
    }



    if (colIdx === 11 && initialRows && initialRows.unitTemplates) {

      let template: any = [{ id: 0, value: t("No_Templates") }];
      initialRows.unitTemplates.map((x: any) => {
        var duplicate = template.find((a: any) => a.id === x.id);
        if (!duplicate)
          template.push({ id: x.id, value: x.name });
      });
      return (
        <div>
          {/* <CBXMultiSelectForDatatable 
          width = {200} 
          option={template} 
          value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
          onChange={(e: any, value : any) => changeMultiselect(e, value, colIdx)}
          onSelectedClear = {() => onSelectedClear(colIdx)}
          isCheckBox={true}
          isduplicate={true}
        /> */}
          <CBXMultiCheckBoxDataFilter
            width={200}
            option={template}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
          />
        </div>
      )
    }

  }


  const changeMultiselect = (val: renderCheckMultiselect[], colIdx: number) => {
    onSelection(val, colIdx)
    headCells[colIdx].headerArray = val;
    setIsSearchableOnChange(true)
  }

  const onSelectedIndividualClear = (headCells: HeadCellProps[], colIdx: number) => {
    let headCellReset = headCells.map((headCell: HeadCellProps, index: number) => {
      if (colIdx === index)
        headCell.headerArray = [{ value: "" }];
      return headCell;
    });
    return headCellReset;
  };

  const onSelectedClear = (colIdx: number) => {
    setIsSearchableOnChange(true)
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
    let headCellReset = onSelectedIndividualClear(headCells, colIdx);
    setHeadCells(headCellReset);
  }

  const AnchorDisplay = (e: string) => {
    debugger;
    if (getModuleIds().includes(14)) {
      return anchorDisplayUnit(e)
    }
    else {
      let urlProps = JSON.parse(e);
      let unit_Name = urlProps?.unitName;
      return textDisplay(unit_Name ?? "", "")
    }
  }

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
      label: `${t("Unit_ID")}`,
      id: "unitId",
      align: "left",
      dataComponent: (e: string) => AnchorDisplay(e),// textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "230",
      attributeName: "UnitId",
      attributeType: "String",
      attributeOperator: "contains"

    },
    {
      label: `${t("Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplayStatus(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number, initialRows: Unit[]) =>
        multiSelectCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "200",
      attributeName: "Status",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Device Type")}`,
      id: "deviceTypeName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number, initialRow: any) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, true),
      minWidth: "200",
      attributeName: "DeviceTypeName",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "200",
      attributeName: "Description",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Assigned_To")}`,
      id: "assignedToStr",
      align: "left",
      //dataComponent: (e: string[]) => multitextDisplayAssigned(e, "data_table_fixedWidth_wrapText"),
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "250",
      attributeName: "AssignedTo",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Serial_Number")}`,
      id: "serialNumber",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "140",
      attributeName: "SerialNumber",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Key")}`,
      id: "key",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "216",
      attributeName: "Key",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Version")}`,
      id: "version",
      align: "center",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      // searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number, initialRows:Unit[]) =>
      // multiSelectVersionCheckbox(rowData, columns, colIdx, initialRows),  
      searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number, initialRow: any) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, true),
      minWidth: "230",
      maxWidth: "120",
      attributeName: "Version",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Station")}`,
      id: "station",
      align: "left",
      dataComponent: (e: string) => textDisplayStation(e, "linkColor"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "153",
      attributeName: "Station",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Last_Checked_In")}`,
      id: "lastCheckedIn",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: "174",
      maxWidth: "174",
      attributeName: "LastCheckedIn",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: `${t("Template")}`,
      id: "template",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number, initialRows: Unit[]) =>
        multiSelectCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "120",
      attributeName: "Template",
      attributeType: "List",
      attributeOperator: "contains"

    },
  ]);

  const searchAndNonSearchMultiDropDown = (
    rowsParam: Unit[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any,
    isSearchable: boolean,
  ) => {

    if (colIdx === 8 && initialRows && initialRows.unitVersions && initialRows.unitVersions.length > 0) {

      let status: any = [{ id: 0, value: t("No_Versions") }];
      initialRows.unitVersions.map((x: any) => {
        status.push({ id: x.id, value: x.name });
      });

      return (
        <>
          {/* <CBXMultiSelectForDatatable 
          width = {250} 
          option={status.filter((x: any) =>x.value != null && x.value != "")} 
          value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
          onChange={(e: any, value : any) => changeMultiselect(e, value, colIdx)}
          onSelectedClear = {() => onSelectedClear(colIdx)}
          isCheckBox={true}
          isduplicate={true}
        /> */}
          <CBXMultiCheckBoxDataFilter
            width={100}
            percentage={true}
            option={status.filter((x: any) => x.value != null && x.value != "")}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
          />
        </>
      );
    }

    if (colIdx === 5 && initialRows) {//&& initialRows.unitAssignments.length > 0   

      let status: any = [{ id: 0, value: t("No_Assignments") }];
      status.push({ id: 1, value: "Users" });
      status.push({ id: 2, value: "Groups" });

      return (
        <>
          <CBXMultiSelectForDatatable
            width={100}
            percentage={true}
            option={status}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(e: any, value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={true}
            isduplicate={true}
          />
          {/* <CBXMultiCheckBoxDataFilter 
          width = {200} 
          option={status} 
          value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
          onChange={(value : any) => changeMultiselect(value, colIdx)}
          onSelectedClear = {() => onSelectedClear(colIdx)}
          isCheckBox={true}
          multiple={true}
          isduplicate={true}
          selectAllLabel="All"
        /> */}
        </>
      );
    }


    if (colIdx === 3 && initialRows && initialRows.deviceTypes && initialRows.deviceTypes.length > 0) {//&& initialRows.unitAssignments.length > 0   
      let deviceTypeList = initialRows.deviceTypes.map((x: any) => {
        return { id: x.id, value: x.name };
      });

      return (
        <>
          <CBXMultiSelectForDatatable
            width={100}
            percentage={true}
            option={deviceTypeList}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(e: any, value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={true}
            isduplicate={true}
          />
        </>
      );
    }
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
    //dataArrayBuilder();
    if (searchData.length > 0)
    {
      setIsSearchable(true)
      
      let isStatus : boolean[] = []
      isStatus = searchData.map(x => {
        if(x.columnName == "status")
          return true
        else
          return false
      })
      let isStatusExistsTemp = isStatus.filter(x => x == true)[0]
     window.IsStatusExists=isStatusExistsTemp;
    }
    if (isSearchableOnChange)
      getFilteredUnitData()
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
    if (reformattedRows.rows !== undefined) {

      let dataRows: Unit[] = reformattedRows.rows;
      searchData.forEach((el: SearchObject) => {
        if (el.columnName === "description" || el.columnName === "station" || el.columnName === "unitId" || el.columnName === "assignedToStr" || el.columnName === "serialNumber" || el.columnName === "key")
          dataRows = onTextCompare(dataRows, headCells, el);
        if (el.columnName === "lastCheckedIn")
          dataRows = onDateCompare(dataRows, headCells, el);
        if (el.columnName === "status") {
          dataRows = onMultipleCompare(dataRows, headCells, el);
          if (el.value.includes("No Status")) {
            reformattedRows.rows.filter((i: any) => i.status.length === 0).map((x: Unit) => {
              dataRows.push(x)
            })

          }
        }
        if (el.columnName === "version") {
          dataRows = onMultipleCompare(dataRows, headCells, el);
          if (el.value.includes("No Version")) {
            reformattedRows.rows.filter((i: any) => i.version.length === 0).map((x: Unit) => {
              dataRows.push(x)
            })

          }
        }

        if (el.columnName === "template") {
          dataRows = onMultipleCompare(dataRows, headCells, el);
          if (el.value.includes("No Template")) {
            reformattedRows.rows.filter((i: any) => i.template.length === 0).map((x: Unit) => {
              dataRows.push(x)
            })

          }
        }



      }
      );
      rowsRef.current = dataRows;
      
      setRows(dataRows);
    }
  };

  const resizeRowUnitDevice = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    const clearButton: any = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
    clearButton && clearButton.click()
    setOpen(false)
    pageiGrid.gridFilter.filters = []
    dispatch(getUnitInfoAsync(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  useEffect(() => {
    var headAssigned = document.getElementById("UDAssigned");
    headAssigned?.parentElement?.classList.add("UDAssignedClass");
  })

  const getFilteredUnitData = () => {

    pageiGrid.gridFilter.filters = []

    searchData.filter(x => x.value[0] !== '').forEach((item: any, index: number) => {
      let x: GridFilter = {
        operator: headCells[item.colIdx].attributeOperator,
        field: headCells[item.colIdx].attributeName,
        value: item.value.length > 1 ? item.value.join('@') : item.value[0],
        fieldType: headCells[item.colIdx].attributeType,
      }
      pageiGrid.gridFilter.filters?.push(x)
    })

    pageiGrid.gridFilter.filters.forEach((x)=> {
      
      if(x.field == "AssignedTo" &&  x.value)
      {
        x.value = x.value.replace("Users","U");
        x.value = x.value.replace("Groups","G");
      }
      
    })
    
    pageiGrid.page = 0
    pageiGrid.size = rowsPerPage

    if (page !== 0)
      setPage(0)
    else {
      dispatch(getUnitInfoAsync(pageiGrid));
    }
    setIsSearchable(false)
    setIsSearchableOnChange(false)
  }

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage, gridSort: { field: orderBy, dir: order } });
    setPaging(true)
  }, [page, rowsPerPage])

  const sortingOrder = (sort: any) => {
    setPageiGrid({ ...pageiGrid, gridSort: { field: sort.orderBy, dir: sort.order } })
    setOrder(sort.order)
    setOrderBy(sort.orderBy)
    setPaging(true)
  }


  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      getFilteredUnitData()
      event.preventDefault();
    }
  }

  const handleBlur = () => {
    if (isSearchable)
      getFilteredUnitData()
  }
  const showToastMsg = (obj: any) => {
    toasterRef.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  };
  return (
    <>
    <CRXToaster ref={toasterRef} />
      <ClickAwayListener onClickAway={handleBlur}>
        <div className="unitDeviceMainUii " onKeyDown={handleKeyDown}>
          {/* <p className="unitsStatusCounter">{rows.length} Units</p> */}
          {rows && (
            <CRXDataTable
              id="Units_&_Devices"
              actionComponent={<UnitAndDevicesActionMenu selectedItems={selectedItems} row={selectedActionRow} showToastMsg={(obj: any) => showToastMsg(obj)} />}
              getRowOnActionClick={(val: Unit) => setSelectedActionRow(val)}
              // toolBarButton={
              //   <CRXButton className="secondary manageUserBtn mr_L_10" onClick={() => getFilteredUnitData()}> {t("Filter")} </CRXButton>
              // }
              showToolbar={true}
              showCountText={true}
              columnVisibilityBar={true}
              showHeaderCheckAll={true}
              initialRows={reformattedRows}
              dragVisibility={false}
              showCheckBoxesCol={true}
              showActionCol={true}
              headCells={headCells}
              dataRows={rows}
              orderParam={order}
              orderByParam={orderBy}
              searchHeader={true}
              allowDragableToList={true}
              showTotalSelectedText={false}
              showActionSearchHeaderCell={true}
              showCustomizeIcon={true}
              //---required Props
              className="unitAndDeviceTable"
              onClearAll={clearAll}
              getSelectedItems={(v: Unit[]) => setSelectedItems(v)}
              onResizeRow={resizeRowUnitDevice}
              onHeadCellChange={onSetHeadCells}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              page={page}
              rowsPerPage={rowsPerPage}
              setPage={(page: any) => setPage(page)}
              setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
              totalRecords={units.totalCount}
              setSortOrder={(sort: any) => sortingOrder(sort)}
              //Please dont miss this block.
              offsetY={118}
              stickyToolbar={129}
              searchHeaderPosition={219}
              dragableHeaderPosition={184}
              showExpandViewOption={true}
              overlay={true}
              //End here
              presetPerUser={userId} />
          )}

        </div>
      </ClickAwayListener>
      </>
  )
}

export default UnitAndDevices
