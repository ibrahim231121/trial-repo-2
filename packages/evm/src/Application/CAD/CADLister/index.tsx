import React, { useEffect, useContext, useRef } from "react";
import { CRXDataTable, CRXColumn, CRXGlobalSelectFilter, CBXMultiSelectForDatatable, CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DateTimeComponent } from '../../../GlobalComponents/DateTime';
import { dateOptionsTypes } from '../../../utils/constant';
import { RootState } from "../../../Redux/rootReducer";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import moment from "moment";
import anchorDisplayUnit from "../../../GlobalComponents/Display/AnchorDisplayUnit";
import './index.scss'
import { getUnitInfoAsync, getAllUnitVersionKeyValuesAsync, getAllUnitStatusKeyValuesAsync, getAllUnitTemplateKeyValuesAsync, getAllUnitAssignmentKeyValuesAsync } from "../../../Redux/UnitReducer";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import textDisplayStatus from "../../../GlobalComponents/Display/textDisplayStatus";
import textDisplayStation from "../../../GlobalComponents/Display/textDisplayStation";
import multitextDisplayAssigned from "../../../GlobalComponents/Display/multitextDisplayAssigned";
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
} from "../../../GlobalFunctions/globalDataTableFunctions";
import UnitAndDevicesActionMenu from "./CADActionMenu";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";

import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import { subscribeGroupToSocket, unSubscribeGroupFromSocket } from "../../../utils/hub_config";
import { CADTemplate } from "../../../Application/CAD/CADTypes";


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



const CADList: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const tenMinutes: number = 10;
  const rowsRef = useRef<any>([]);
  const statusJson = useRef<any>();
  const intervalRef = useRef<any>();
  const CAD: any = useSelector((state: RootState) => state.cadReducer.CadInfo);
  //const units: any = useSelector((state: RootState) => state.unitReducer.unitInfo);
  const unitStatus: any = useSelector((state: RootState) => state.unitReducer.UnitStatusKeyValues);
  const unitTemplates: any = useSelector((state: RootState) => state.unitReducer.UnitTemplateKeyValues);
  const unitVersions: any = useSelector((state: RootState) => state.unitReducer.unitVersionKeyValues);
  const unitAssignments: any = useSelector((state: RootState) => state.unitReducer.UnitAssignmentKeyValues);
  const [rows, setRows] = React.useState<CADTemplate[]>([]);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<string>("LastCheckedIn");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Unit[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<any>();
  const [selectedActionRow, setSelectedActionRow] = React.useState<Unit>();
  const [open, setOpen] = React.useState<boolean>(false)
  const { getModuleIds } = useContext(ApplicationPermissionContext);

  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });

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

  React.useEffect(() => {
    subscribeGroupToSocket("UnitStatus");
    //dispatch(getUnitInfoAsync(pageiGrid)); // getunitInfo 
    singleEventListener("onWSMsgRecEvent", onMsgReceived);
    dispatch(getAllUnitStatusKeyValuesAsync());
    dispatch(getAllUnitAssignmentKeyValuesAsync());
    dispatch(getAllUnitVersionKeyValuesAsync());
    dispatch(getAllUnitTemplateKeyValuesAsync());
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "CAD");  // will check this
    document.getElementById("UDAssigned")?.parentElement?.classList.add("UDAssignedClass");

    intervalRef.current = setInterval(() => {
      getTheUnitStatusWithLogTimeInterval(rowsRef.current);
    }, 600000);

    return () => {
      singleEventListener("onWSMsgRecEvent");
      unSubscribeGroupFromSocket("UnitStatus");
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const demoRows = [
      {
        id: 1,
        cadID: '77-005986',
        caseID: '2023-35',
        createdDate: '2023/02/14 11:23:55',
        status: 'In Progress',
        description: 'Robber',
        locations: 'SSD Road, Park Lane 20',
        incidentType: 'Police',
        responders: 'James | Adam',
        closedDate: '2023/02/14 11:23:55'
      },
      {
        id: 2,
        cadID: '77-005987',
        caseID: '2023-36',
        createdDate: '2023/02/14 11:23:55',
        status: 'In Progress',
        description: 'Shop Lifter',
        locations: 'SSD Road, Park Lane 20',
        incidentType: 'Police',
        responders: 'James | Adam',
        closedDate: '2023/02/14 11:23:55'
      },
      {
        id: 3,
        cadID: '77-005988',
        caseID: '2023-37',
        createdDate: '2023/02/14 11:23:55',
        status: 'In Progress',
        description: 'Accident',
        locations: 'SSD Road, Park Lane 20',
        incidentType: 'Police',
        responders: 'James | Adam',
        closedDate: '2023/02/14 11:23:55'
      }
    ]

    setRows(demoRows)
  }, [])

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

  //   const setData = () => {

  //     let unitRows: Unit[] = [];

  //         if (units.data && units.data.length > 0) {
  //           unitRows = units.data.map((unit: any, i:number) => {
  //             let urlProps = {
  //               unitName : unit.unitId,
  //               unitId : unit.recId,
  //               stationId : unit.stationRecId,
  //               template : unit.template,
  //               deviceType: unit.deviceType
  //             }
  //             let objUnit={
  //               id: unit.recId,
  //               unitId: JSON.stringify(urlProps),
  //               description: unit.description,
  //               station: unit.station,
  //               serialNumber: unit.serialNumber,
  //               template: unit.template,
  //               deviceType: unit.deviceType,
  //               key: unit.key,
  //               version: unit.version,
  //               //assignedTo: unit.assignedTo,
  //               assignedToStr: unit.assignedToStr,
  //             //   assignedTo: unit.assignedTo != null ? unit.assignedTo.split(',').map((x: string) => {
  //             //     return x.trim();
  //             // }) : [],
  //               lastCheckedIn: unit.lastCheckedIn.includes("1900") ? "": unit.lastCheckedIn,
  //               status: unit.status,
  //               stationId: unit.stationRecId
  //             }
  //             return objUnit;
  //           })
  //         }
  //         rowsRef.current = unitRows;
  //         //setRows(unitRows)
  //         getTheUnitStatusWithLogTimeInterval(unitRows);
  //         setReformattedRows({...reformattedRows, 
  //             rows: unitRows, 
  //             unitStatus: unitStatus, 
  //             unitTemplates: unitTemplates, 
  //             unitVersions: unitVersions,
  //             unitAssignments: unitAssignments
  //         });

  //         //setReformattedRows(unitRows);
  //         singleEventListener("onWSMsgRecEvent", onMsgReceived);
  //   }

  const getTheUnitStatusWithLogTimeInterval = (objUnit: any) => {
    let currentTime = new Date();
    for (let index = 0; index < objUnit.length; index++) {
      let tenMinutesAddedInlastCheckedIn = moment(objUnit[index].lastCheckedIn).add(tenMinutes, 'm').toDate();
      if (tenMinutesAddedInlastCheckedIn < currentTime && objUnit[index].status != "Inactive") {
        objUnit[index].status = "Offline";
      }
    }
    setRows(objUnit);
  }

  function onMsgReceived(e: any) {
    if (e != null && e.data != null && e.data.body != null) {
      statusJson.current = JSON.parse(e.data.body.data);
      setRowForUnitStatus(statusJson.current);
    }
  };

  const setRowForUnitStatus = (statusJson: any) => {
    if (statusJson != null && statusJson != "undefined") {
      const index = rowsRef.current.findIndex((e: any) => e.id === statusJson.UnitId);
      const rowscopy = [...rowsRef.current];
      if (index !== -1) {
        rowscopy[index].status = statusJson.Data;
        rowscopy[index].lastCheckedIn = statusJson.LogTime;
        rowsRef.current = rowscopy;
        setRows(rowscopy);
      }
    }
  };

  React.useEffect(() => {
    //console.log("reformattedRows : ", reformattedRows)
  }, [reformattedRows]);

  // React.useEffect(() => {
  //   setData();
  //   dispatch(enterPathActionCreator({ val: ""}));
  // }, [units.data, unitStatus, unitTemplates, unitVersions, unitAssignments]);



  useEffect(() => {
    if (paging)
      dispatch(getUnitInfoAsync(pageiGrid));
    setPaging(false)
  }, [pageiGrid])

  const searchText = (
    rowsParam: CADTemplate[],
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

      let status: any = [{ id: 0, value: t("No_Status") }];
      initialRows.unitStatus.map((x: any) => {
        status.push({ id: x.id, value: x.name });
      });


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
            width={200}
            option={status}
            defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
            className="statusFilter"
          />
        </div>
      )
    }



    if (colIdx === 10 && initialRows && initialRows.unitTemplates) {

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
            defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
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
    if (getModuleIds().includes(14)) {
      return anchorDisplayUnit(e)
    }
    else {
      let lastid = e.lastIndexOf("_");
      let text = e.substring(0, lastid)
      return textDisplay(text, "")
    }
  }

  const getHyperlink = (data: any, splitter?: string) => {
    if (splitter) {
      let links = data.split(splitter)

      links.map((item: any, index: number) => {
        links[index] = <a href='' className='cadTableHyperLink cadParallelLink'>{item.trim()}</a>
      })

      return links
    } else {
      return <a href='' className='cadTableHyperLink'>{data}</a>
    }
  }

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: t('ID'),
      id: 'id',
      align: 'right',
      dataComponent: () => null,
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: '80',
      width: '80'
    },
    {
      label: t('Cad_Id'),
      id: 'cadID',
      align: 'left',
      dataComponent: (e: string) => getHyperlink(e),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '200',
      attributeName: "CadId",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Case_Id'),
      id: 'caseID',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '200',
      attributeName: "CaseId",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Created_Date'),
      id: 'createdDate',
      align: 'left',
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: '200',
      attributeName: "CreatedDate",
      dataComponent: dateDisplayFormat,
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: t('Status'),
      id: 'status',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '220',
      attributeName: "Status",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Description'),
      id: 'description',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '150',
      attributeName: "Descripiton",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Locations'),
      id: 'locations',
      align: 'left',
      dataComponent: (e: string) => getHyperlink(e, ','),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '150',
      attributeName: "Locations",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Incident_Type'),
      id: 'incidentType',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '150',
      attributeName: "IncidentType",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Responders'),
      id: 'responders',
      align: 'left',
      dataComponent: (e: string) => getHyperlink(e, '|'),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '150',
      attributeName: "Responders",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Closed_Date'),
      id: 'closedDate',
      align: 'left',
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: '200',
      attributeName: "ClosedDate",
      dataComponent: dateDisplayFormat,
      attributeType: "DateTime",
      attributeOperator: "between"
    }
  ]);

  const searchAndNonSearchMultiDropDown = (
    rowsParam: Unit[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any,
    isSearchable: boolean,
  ) => {

    if (colIdx === 7 && initialRows && initialRows.unitVersions && initialRows.unitVersions.length > 0) {

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
            width={250}
            option={status.filter((x: any) => x.value != null && x.value != "")}
            defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
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

    if (colIdx === 4 && initialRows && initialRows.unitAssignments) {//&& initialRows.unitAssignments.length > 0   

      let status: any = [{ id: 0, value: t("No_Assignments") }];
      initialRows.unitAssignments.map((x: any) => {
        status.push({ id: x.id, value: x.name });
      });

      return (
        <>
          <CBXMultiSelectForDatatable
            width={200}
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
          defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
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
    console.log("searchData", searchData)
    if (searchData.length > 0)
      setIsSearchable(true)
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
      //setRows(dataRows);
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
    console.log('In Filter Data')
    console.log(searchData)

    searchData.filter(x => x.value[0] !== '').forEach((item: any, index: number) => {
      let x: GridFilter = {
        operator: headCells[item.colIdx].attributeOperator,
        field: headCells[item.colIdx].attributeName,
        value: item.value.length > 1 ? item.value.join('@') : item.value[0],
        fieldType: headCells[item.colIdx].attributeType,
      }
      pageiGrid.gridFilter.filters?.push(x)
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
    }
  }

  const handleBlur = () => {
    if (isSearchable)
      getFilteredUnitData()
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
      <div className="searchComponents unitDeviceMainUii " onKeyDown={handleKeyDown}>
        {/* <p className="unitsStatusCounter">{rows.length} Units</p> */}
        {

          rows && (
            <CRXDataTable
              id={t("CAD")}
              actionComponent={<UnitAndDevicesActionMenu selectedItems={selectedItems} row={selectedActionRow} />}
              getRowOnActionClick={(val: Unit) =>
                setSelectedActionRow(val)
              }
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
              totalRecords={10}
              setSortOrder={(sort: any) => sortingOrder(sort)}
              //Please dont miss this block.
              offsetY={119}
              stickyToolbar={118}
              searchHeaderPosition={204}
              dragableHeaderPosition={168}
              showExpandViewOption={true}
            //End here
            />
          )
        }

      </div>
    </ClickAwayListener>
  )
}

export default CADList