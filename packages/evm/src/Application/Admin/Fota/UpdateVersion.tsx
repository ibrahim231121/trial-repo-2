import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CRXButton, CRXDataTable, CRXToaster, CRXSelectBox } from "@cb/shared";
import { HeadCellProps, PageiGrid, SearchObject, ValueString, onClearAll, onResizeRow, onSaveHeadCellData, onSetHeadCellVisibility, onSetSearchDataValue, onSetSingleHeadCellVisibility, onTextCompare, Order, GridFilter } from "../../../GlobalFunctions/globalDataTableFunctions";
import { RootState } from "../../../Redux/rootReducer";
import { DeviceStatus, DeviceType, UpdateVersion, UpdateVersionDevice } from "../../../utils/Api/models/UnitModels";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { getAllUpdateVersionsPagedAsync } from "../../../Redux/UpdateVersionSlices";
import { ClickAwayListener } from "@material-ui/core";
import UpdateVersionsActionMenu from "./UpdateVersionActionMenu";
import Restricted from "../../../ApplicationPermission/Restricted";
import { useHistory } from "react-router-dom";
import { urlList, urlNames } from "../../../utils/urlList";
import './UpdateVersion.scss'
import { dateDisplayFormat } from "../../../GlobalFunctions/DateFormat";
import { CRXColumn } from "@cb/shared";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { dateOptionsTypes } from "../../../utils/constant";


type UpdateVersionsObj = {
  id: number;
  version: string;
  createdOn: string;
  modifiedOn: string;
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

const ORDER_BY = "asc" as Order;
const ORDER_BY_PARAM = "recordingStarted";

const UpdateVersions: React.FC = () => {
  const history = useHistory();
  const retentionMsgFormRef = useRef<typeof CRXToaster>(null);
  const { t } = useTranslation<string>();
  const [id, setId] = React.useState<number>(0);
  const [title, setTitle] = React.useState<string>("");
  const [rows, setRows] = React.useState<UpdateVersionsObj[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<UpdateVersionsObj[]>([]);
  const [selectedActionRow, setSelectedActionRow] = useState<UpdateVersionsObj[]>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [openModel, setOpenModel] = React.useState<boolean>(false);
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<string>("History.CreatedOn");
  const [selectedDeviceType, setSelectedDeviceType] = React.useState<DeviceType | undefined>({ id: 0, name: "" });
  const [openAddNewFileModal, setOpenAddNewFileModal] = React.useState<boolean>(false);

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
  });
  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });
  const dispatch = useDispatch();
  const isFirstRenderRef = useRef<boolean>(true);
  const [reformattedRows, setReformattedRows] = React.useState<UpdateVersionsObj[]>([]);
  const filterUpdateVersions: any = useSelector((state: RootState) => state.updateVersionsSlice.updateVersionsPaged);


  // File upload



  useEffect(() => {
    if (paging){
      dispatch(getAllUpdateVersionsPagedAsync(pageiGrid));
    }
    setPaging(false)
  }, [pageiGrid])

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage });
    setPaging(true)

  }, [page, rowsPerPage])

  useEffect(() => {
    setUpdateVersions();
    isFirstRenderRef.current = false;
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "CategoriesTemplateDataTable");
    dispatch(enterPathActionCreator({ val: "" }));
  }, []);

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

  const retentionFormMessages = (obj: any) => {
    retentionMsgFormRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  }
  // const onChange = (valuesObject: ValueString[], colIdx: number) => {
  //   headCells[colIdx].headerArray = valuesObject;
  //   onSelection(valuesObject, colIdx);
  // }

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
    rowsParam: UpdateVersionsObj[],
    headCell: HeadCellProps[],
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
    rowsParam: UpdateVersionsObj[],
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
          startDate: reformattedRows && reformattedRows.length>0 ? reformattedRows[0].createdOn : "",
          endDate: reformattedRows && reformattedRows.length>0 ? reformattedRows[reformattedRows.length - 1].createdOn : "",
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
      minWidth: "80"
    },
    {
      label: t("Is Canceled Status"),
      id: "isCanceledStatus",
      align: "right",
      dataComponent: (e: boolean) => textDisplay(e.toString(), "IsCanceledStatus_GrayOut "),
      sort: false,
      searchFilter: false,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: "80"
    },
    {
      label: `${t("Device Type")}`,
      id: "deviceType",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "150",
      attributeName: "DeviceType",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Version Number")}`,
      id: "version",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "193",
      attributeName: "Version",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Total Devices")}`,
      id: "totalDevices",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "TotalDevices_GrayOut "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "200",
      attributeName: "TotalDevices",
      attributeType: "Int",
      attributeOperator: "eq"
    },
    {
      label: `${t("Success")}`,
      id: "totalSuccess",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "TotalSuccess_GrayOut "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "150",
      attributeName: "TotalSuccess",
      attributeType: "Int",
      attributeOperator: "eq"
    },
    {
      label: `${t("Fail")}`,
      id: "totalFail",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "120",
      attributeName: "TotalFail",
      attributeType: "Int",
      attributeOperator: "eq"
    },
    {
      label: `${t("Pending")}`,
      id: "totalPending",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "120",
      attributeName: "TotalPending",
      attributeType: "Int",
      attributeOperator: "eq"
    },
    {
      label: `${t("Date Created")}`,
      id: "createdOn",
      align: "left",
      dataComponent: dateDisplayFormat,
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: "200",
      attributeName: "History.CreatedOn",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: `${t("Last Updated")}`,
      id: "updateOn",
      align: "left",
      dataComponent: (e: string) => (e && e.length > 0) ? dateDisplayFormat : textDisplay(e, " "),
      sort: false,
      searchFilter: false,
      searchComponent: searchText,
      minWidth: "200",
      attributeName: "History.UpdateOn",
      attributeType: "DateTime",
      attributeOperator: "between"
    }
  ]);

  const grayOutRow = () => {
    let rowCount = document.querySelectorAll(".TotalDevices_GrayOut  label")?.length;
    for(let i=0; i< rowCount; i++){
      let isExist = document.querySelectorAll(".TotalDevices_GrayOut  label")[i]?.textContent == document.querySelectorAll(".TotalSuccess_GrayOut  label")[i]?.textContent ? true : false
      if(isExist){
        document.querySelectorAll(".TotalSuccess_GrayOut  label")[i].parentElement?.parentElement?.parentElement?.setAttribute("style", `background:grey`)
      }
      let isCanceledStatusBoolString = document.querySelectorAll(".IsCanceledStatus_GrayOut  label")[i]?.textContent;
      if(isCanceledStatusBoolString && isCanceledStatusBoolString == "true"){
        document.querySelectorAll(".IsCanceledStatus_GrayOut  label")[i].parentElement?.parentElement?.parentElement?.setAttribute("style", `background:grey`)
      }
    }
  }
  

  const setUpdateVersions = () => {
    let UpdateVersionRows: UpdateVersionsObj[] = [];
    if (filterUpdateVersions?.data && filterUpdateVersions?.data.length > 0) {
      UpdateVersionRows = filterUpdateVersions?.data.map((updateVersion: UpdateVersion) => {
        return {
          id: updateVersion.id,
          name: updateVersion.name,
          deviceType: updateVersion.deviceType?.name,
          version: updateVersion.version,
          totalDevices: updateVersion.totalDevices,
          totalFail: updateVersion.totalFail,
          totalPending: updateVersion.totalPending,
          totalSuccess: updateVersion.totalSuccess,
          modifiedOn: updateVersion.history.modifiedOn,
          createdOn: updateVersion.history.createdOn,
          isCanceledStatus: updateVersion.updateVersionDevices.some((x:UpdateVersionDevice)=> x.deviceStatus == DeviceStatus[DeviceStatus.Canceled])
        }
      })
    }
    setRows(UpdateVersionRows);
    setReformattedRows(UpdateVersionRows);
  }

  React.useEffect(() => {
    setUpdateVersions();
    setTimeout(() => {grayOutRow()},300)
  }, [filterUpdateVersions?.data]);

  useEffect(() => {
    if (searchData.length > 0)
    {
      setIsSearchable(true)
    }
  }, [searchData]);

  const getSelectedItemsUpdate = () => {
    setSelectedItems([]);
  }

  const getSuccessUpdate = () => {
    setSuccess(true);
  }

  const UpdateVersionsAction = () => {
    dispatch(getAllUpdateVersionsPagedAsync(pageiGrid));
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllUpdateVersionsPagedAsync(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

  const onClickOpenModel = (modelOpen: boolean, id: number, title: string) => {
    setId(id);
    setTitle(title);
    setOpenModel(modelOpen);
  }

  const onMessageShow = (isSuccess: boolean, message: string) => {
    retentionFormMessages({
      message: message,
      variant: isSuccess ? 'success' : 'error',
      duration: 7000
    });
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      getFilteredUpdateVersionData();
      event.preventDefault();
    }
  }

  const handleBlur = () => {
    if (isSearchable){
      getFilteredUpdateVersionData();
    }
  }

  const getFilteredUpdateVersionData = () => {

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
      dispatch(getAllUpdateVersionsPagedAsync(pageiGrid));
    }
    setIsSearchable(false)
  }

  useEffect(() => {
    //dataArrayBuilder();
    if (searchData.length > 0)
    {
      setIsSearchable(true)
    }
  }, [searchData]);

  const ActionMenuReload = () => {
    dispatch(getAllUpdateVersionsPagedAsync(pageiGrid));
  }

  const sortingOrder = (sort: any) => {
    setPageiGrid({ ...pageiGrid, gridSort: { field: sort.orderBy, dir: sort.order } })
    setOrder(sort.order)
    setOrderBy(sort.orderBy)
    setPaging(true)
  }

  const onClickSchedule = () => {
    history.push(urlList.filter((item: any) => item.name === urlNames.filterUpdateVersion)[0].url);
  }


  return (
    <>
      <ClickAwayListener onClickAway={handleBlur}>
        <div className="manageCRXUpdateVersion" onKeyDown={handleKeyDown}>
          <CRXToaster ref={retentionMsgFormRef} />
          {
            rows && (
              <CRXDataTable
                id="CRXUpdateVersion"
                actionComponent={<UpdateVersionsActionMenu
                  row={selectedActionRow}
                  selectedItems={selectedItems}
                  getRowData={UpdateVersionsAction}
                  getSelectedData={getSelectedItemsUpdate}
                  getSuccess={getSuccessUpdate}
                  onClickOpenModel={onClickOpenModel}
                  onMessageShow={onMessageShow}
                  ActionMenuReload={ActionMenuReload}
                />}
                toolBarButton={
                  <>
                    <Restricted moduleId={9}>
                      <CRXButton
                        id={"createVersion"}
                        className="primary manageVersionBtn"
                        onClick={() => { onClickSchedule() }}
                      >
                        {t("Schedule Version Update")}
                      </CRXButton>
                    </Restricted>
                    {/* <CRXButton className="secondary manageUserBtn mr_L_10" onClick={() => getFilteredUserData()}> {t("Filter")} </CRXButton> */}
                  </>
                }
                getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
                dataRows={rows}
                headCells={headCells}
                orderParam={ORDER_BY}
                orderByParam={ORDER_BY_PARAM}
                showToolbar={true}
                showCountText={false}
                columnVisibilityBar={true}
                dragVisibility={false}
                showCheckBoxesCol={true}
                showActionCol={true}
                searchHeader={true}
                allowDragableToList={false}
                showTotalSelectedText={false}
                showActionSearchHeaderCell={true}
                showCustomizeIcon={true}
                className="crxTableHeight crxTableDataUi RetentionPoliciesTableTemplate RetentionPoliciesTable_UI"
                onClearAll={clearAll}
                getSelectedItems={(v: UpdateVersionsObj[]) => setSelectedItems(v)}
                onResizeRow={resizeRowConfigTemp}
                onHeadCellChange={onSetHeadCells}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                page={page}
                rowsPerPage={rowsPerPage}
                setPage={(pages: any) => setPage(pages)}
                setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
                totalRecords={filterUpdateVersions?.totalCount}
                setSortOrder={(sort: any) => sortingOrder(sort)}
                //Please dont miss this block.
                offsetY={119}
                stickyToolbar={117}
                searchHeaderPosition={229}
                dragableHeaderPosition={194}
                //End here
                overlay={true}
              />

            )
          }
        </div>
      </ClickAwayListener>


    </>
  );
};


export default UpdateVersions;
