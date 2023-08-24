import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CRXButton, CRXDataTable, CRXToaster, CRXSelectBox } from "@cb/shared";
import { HeadCellProps, PageiGrid, SearchObject, ValueString, onClearAll, onResizeRow, onSaveHeadCellData, onSetHeadCellVisibility, onSetSearchDataValue, onSetSingleHeadCellVisibility, onTextCompare, Order, GridFilter } from "../../../GlobalFunctions/globalDataTableFunctions";
import { RootState } from "../../../Redux/rootReducer";
import { Device, DeviceType, FilterUpdateVersion, UpdateVersion } from "../../../utils/Api/models/UnitModels";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { getAllUpdateVersionsPagedAsync } from "../../../Redux/UpdateVersionSlices";
import { ClickAwayListener } from "@material-ui/core";
import Restricted from "../../../ApplicationPermission/Restricted";
import { getAllFilteredUpdateVersionsPagedAsync } from "../../../Redux/FilteredUpdateVersionsSlice";
import { UpdateDeviceVersion } from "./CreateUpdateVersion";
import "./FilterUpdateVersion.scss";
import { dateDisplayFormat } from "../../../GlobalFunctions/DateFormat";
import { CRXColumn } from "@cb/shared";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { dateOptionsTypes } from "../../../utils/constant";
import textDisplayStatus from "../../../GlobalComponents/Display/textDisplayStatus";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { getAllUnitStatusKeyValuesAsync } from "../../../Redux/UnitReducer";
import moment from "moment";


type historyProps = {
  primaryDeviceFilter: any;
  selectedItems: FilterUpdateVersion[],
  setSelectedItems: any,
  formData: UpdateDeviceVersion | undefined
};
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
interface renderCheckMultiselect {
  value: string,
  id: string,
};

const FilterUpdateVersionDataGrid: React.FC<historyProps> = ({ primaryDeviceFilter, selectedItems, setSelectedItems, formData }) => {
  const tenMinutes: number = 10;
  const retentionMsgFormRef = useRef<typeof CRXToaster>(null);
  const { t } = useTranslation<string>();
  const [title, setTitle] = React.useState<string>("");

  const [rows, setRows] = React.useState<FilterUpdateVersion[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [openModel, setOpenModel] = React.useState<boolean>(false);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<string>("LastCheckedIn");
  const unitStatus: any = useSelector((state: RootState) => state.unitReducer.UnitStatusKeyValues);

  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage,
    gridSort: {
      field: orderBy,
      dir: order
    }
  })
  const dispatch = useDispatch();
  const isFirstRenderRef = useRef<boolean>(true);
  const [reformattedRows, setReformattedRows] = React.useState<any>();
  const filterUpdateVersions: any = useSelector((state: RootState) => state.filteredUpdateVersionsSlice.filteredUpdateVersionsPaged);
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)
  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });
  const [logsUpdated, setLogsUpdated] = React.useState<boolean>(false);


  // File upload



  useEffect(() => {
    if (paging && primaryDeviceFilter.deviceTypeId > 0 && primaryDeviceFilter.stationId > 0) {
      let obj = {
        pageiFilter: pageiGrid,
        primaryDeviceFilter: primaryDeviceFilter
      }
      setSelectedItems([]);
      dispatch(getAllFilteredUpdateVersionsPagedAsync(obj));
      setUpdateVersions()
    }
    else {
      setPaging(false)
    }
  }, [pageiGrid])

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage });
    setPaging(true)

  }, [page, rowsPerPage])

  useEffect(() => {
    setUpdateVersions();
    dispatch(getAllUnitStatusKeyValuesAsync());
    isFirstRenderRef.current = false;
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "CategoriesTemplateDataTable");
    dispatch(enterPathActionCreator({ val: "" }));
  }, []);

  const retentionFormMessages = (obj: any) => {
    retentionMsgFormRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  }
  const onChange = (valuesObject: ValueString[], colIdx: number) => {
    headCells[colIdx].headerArray = valuesObject;
    onSelection(valuesObject, colIdx);
  }

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
        prevArr.filter(
          (e) => e.columnName !== headCells[colIdx].id.toString()
        )
      );
    }
  }

  const searchText = (
    rowsParam: FilterUpdateVersion[],
    headCell: HeadCellProps[],
    colIdx: number
  ) => {
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={(valueObject) => onChange(valueObject, colIdx)} />
    );
  };
  const searchDate = (
    rowsParam: FilterUpdateVersion[],
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

  const multiSelectCheckbox = (rowParam: FilterUpdateVersion[], headCells: HeadCellProps[], colIdx: number, initialRows: any) => {
    if (colIdx === 6 && initialRows && initialRows.unitStatus && initialRows.unitStatus.length > 0) {

      let status: any = [];
      let DisplayOrder = ["Offline", "Live", "Recording", "StandBy", "Online", "OnlineWithGETAC", "UnitBeingDiagnosed", "Unregistered"]
      DisplayOrder.forEach((y: any) => {

        var _status = initialRows.unitStatus.find((x: any) => { return x.name == y })
        status.push({ id: _status.id, value: _status.name, name: _status.description });
      })



      return (
        <div>
          <CBXMultiCheckBoxDataFilter
            width={200}
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

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: t("ID"),
      id: "id",
      align: "right",
      dataComponent: () => null,
      sort: false,
      searchFilter: false,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: "80",
      width: "",
      maxWidth: "100",
    },
    {
      label: `${t("UnitID")}`,
      id: "unitName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      width: "926",
      maxWidth: "800",
      attributeName: "UnitName",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Serial Number")}`,
      id: "serialNumber",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800",
      attributeName: "SerialNumber",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Station")}`,
      id: "station",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800",
      attributeName: "Station",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Current Version")}`,
      id: "version",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800",
      attributeName: "Version",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Target Version")}`,
      id: "targetVersion",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800",
      attributeName: "TargetVersion",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplayStatus(e, "data_table_fixedWidth_wrapText"),
      sort: false,
      searchFilter: false,
      searchComponent: (rowData: FilterUpdateVersion[], columns: HeadCellProps[], colIdx: number, initialRows: FilterUpdateVersion[]) =>
        multiSelectCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "200",
      attributeName: "Status",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Desciption")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplayStatus(e, "data_table_fixedWidth_wrapText"),
      sort: false,
      searchFilter: false,
      searchComponent: (rowData: FilterUpdateVersion[], columns: HeadCellProps[], colIdx: number, initialRows: FilterUpdateVersion[]) =>
        multiSelectCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "200",
      attributeName: "Description",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Last_Checked_In")}`,
      id: "lastCheckedIn",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: false,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: "174",
      maxWidth: "174",
      attributeName: "LastCheckedIn",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: `${t("Last line of diagnostic log output")}`,
      id: "logOutput",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    }
  ]);

  const setUpdateVersions = () => {
    let UpdateVersionRows: FilterUpdateVersion[] = [];
    if (filterUpdateVersions?.data && filterUpdateVersions?.data.length > 0) {
      UpdateVersionRows = filterUpdateVersions?.data.map((x: FilterUpdateVersion) => {
        return {
          id: x.id,
          version: x.version,
          unitId: x.unitId,
          unitName: x.unitName,
          serialNumber: x.serialNumber,
          station: x.station,
          stationId: x.stationId,
          description: x.description,
          lastCheckedIn: x.lastCheckedIn,
          status: x.status,
          targetVersion: x.targetVersion,
          logOutput: x.logOutput
        }
      })
      if (formData) {
        let selectedDevices = UpdateVersionRows.filter(x => formData.updateVersionDevices?.map((x: any) => x.deviceId).includes(x.id ?? 0));
        setSelectedItems(selectedDevices)
      }
    }
    setRows(UpdateVersionRows);
    getTheUnitStatusWithLogTimeInterval(UpdateVersionRows);
    setReformattedRows({
      ...reformattedRows,
      rows: UpdateVersionRows,
      unitStatus: unitStatus,
    })
  }

  useEffect(() => {
    if((formData?.updateVersionDevices?.length ?? 0) > 0 && rows.length > 0 && (logsUpdated == false))
    {
      let temp = [...rows];
      formData?.updateVersionDevices?.forEach(y => {
        let updateTemp = temp.find(x => x.id == y.deviceId);
        if(updateTemp)
        {
          updateTemp.logOutput = y.logs
        }
      })
      setRows(temp);
      setLogsUpdated(true)
    }
  }, [rows, formData?.updateVersionDevices])
  
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
  // const dataArrayBuilder = () => {
  //   let dataRows: FilterUpdateVersion[] = reformattedRows;
  //   searchData.forEach((el: SearchObject) => {
  //     dataRows = onTextCompare(dataRows, headCells, el);
  //   });
  //   setRows(dataRows);
  // };

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

  React.useEffect(() => {
    setUpdateVersions();
  }, [filterUpdateVersions?.data]);

  React.useEffect(() => {
    if (primaryDeviceFilter.stationId > 0 && primaryDeviceFilter.deviceTypeId > 0) {
      let obj = {
        pageiFilter: pageiGrid,
        primaryDeviceFilter: primaryDeviceFilter
      }
      setSelectedItems([]);
      dispatch(getAllFilteredUpdateVersionsPagedAsync(obj));
    }
    else {
      setRows([]);
      setReformattedRows({});
      setSelectedItems([]);;
    }
  }, [primaryDeviceFilter])

  useEffect(() => {
    if (searchData.length > 0)
      setIsSearchable(true)
    if (isSearchableOnChange)
      getFilteredUnitData()
    // dataArrayBuilder();
  }, [searchData]);

  const getSelectedItemsUpdate = () => {
    setSelectedItems([]);
  }

  const getSuccessUpdate = () => {
    setSuccess(true);
  }

  const UpdateVersionsAction = () => {
    let obj = {
      pageiFilter: pageiGrid,
      primaryDeviceFilter: primaryDeviceFilter
    }
    dispatch(getAllFilteredUpdateVersionsPagedAsync(obj));
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    let obj = {
      pageiFilter: pageiGrid,
      primaryDeviceFilter: primaryDeviceFilter
    }
    dispatch(getAllFilteredUpdateVersionsPagedAsync(obj));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

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
    if (isSearchable) {
      getFilteredUnitData()
    }
  }

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
    pageiGrid.page = 0
    pageiGrid.size = rowsPerPage

    if (page !== 0)
      setPage(0)
    else {
      let obj = {
        pageiFilter: pageiGrid,
        primaryDeviceFilter: primaryDeviceFilter
      }
      dispatch(getAllFilteredUpdateVersionsPagedAsync(obj));
    }
    setIsSearchable(false)
    setIsSearchableOnChange(false)
  }


  return (
    <>
      <ClickAwayListener onClickAway={handleBlur}>
        <div onKeyDown={handleKeyDown}>
          <CRXToaster ref={retentionMsgFormRef} />
          {
            rows && (
              <div className="versionManageTable">
                <CRXDataTable
                  id="CRXUpdateVersion"
                  toolBarButton={
                    <>

                    </>
                  }
                  dataRows={rows}
                  headCells={headCells}
                  initialRows={reformattedRows}
                  orderParam={order}
                  orderByParam={orderBy}
                  showToolbar={false}
                  showCountText={false}
                  columnVisibilityBar={true}
                  dragVisibility={false}
                  showCheckBoxesCol={true}
                  showActionCol={false}
                  searchHeader={true}
                  allowDragableToList={false}
                  showTotalSelectedText={false}
                  showActionSearchHeaderCell={true}
                  showCustomizeIcon={true}
                  className="CRXDataTableCustom"
                  onClearAll={clearAll}
                  getSelectedItems={(v: FilterUpdateVersion[]) => setSelectedItems(v)}
                  onResizeRow={resizeRowConfigTemp}
                  onHeadCellChange={onSetHeadCells}
                  setSelectedItems={setSelectedItems}
                  selectedItems={selectedItems}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setPage={(pages: any) => setPage(pages)}
                  setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
                  totalRecords={filterUpdateVersions?.totalCount}
                  //Please dont miss this block.
                  offsetY={62}
                  headerPositionInit={210}
                  topSpaceDrag={98}

                //End here
                />
              </div>
            )
          }
        </div>
      </ClickAwayListener>


    </>
  );
};

export default FilterUpdateVersionDataGrid;
