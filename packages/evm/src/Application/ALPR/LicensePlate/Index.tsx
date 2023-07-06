import { CRXDataTable, CRXColumn } from "@cb/shared";
import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onSetSearchDataValue,
  RemoveSidePanelClass,
  PageiGrid,
  GridFilter,
  onResizeRow,
  Order,
  onClearAll,
  onSetSingleHeadCellVisibility,
} from "../../../GlobalFunctions/globalDataTableFunctions";
import React, { useEffect, useRef } from "react";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { LicensePlateTemplate } from "../../../../src/utils/Api/models/HotListLicensePlate";
import { useTranslation } from "react-i18next";
import "./LicensePlate.scss"
import { CRXMultiSelectBoxLight } from "@cb/shared";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import LicensePlateMenu from "./LiscensePlateActionMenu";
import { CRXToaster } from "@cb/shared";
import Restricted from "../../../ApplicationPermission/Restricted";
import { CRXButton } from "@cb/shared";
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { ClearLicensePlateProperty, DeleteLicensePlateData, GetLicensePlateData } from "../../../Redux/AlprLicensePlateReducer";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { basicDateDefaultValue, dateOptionsTypes } from "../../../utils/constant";
import moment from "moment";
import { ClickAwayListener } from "@material-ui/core";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { states } from "../GlobalDropdown";
import AnchorDisplay from "../../../utils/AnchorDisplay";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { renderCheckMultiselect } from "../../Assets/AssetLister/AssetDataTable/AssetDataTableModel";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";

type DateTimeObject = {
  startDate: string;
  endDate: string;
  value: string;
  displayText: string;
};

type DateTimeProps = {
  dateTimeObj: DateTimeObject;
  colIdx: number;
};

const LicensePlate = () => {
  const [rows, setRows] = React.useState<LicensePlateTemplate[]>([]);

  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const { t } = useTranslation<string>();
  const [sortDir, setSortDir] = React.useState<Order>("asc");
  const [orderField, setOrderField] = React.useState<string>("licensePlate");
  const [selectedItems, setSelectedItems] = React.useState<LicensePlateTemplate[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<any>();
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(0);
  const [selectedActionRow, setSelectedActionRow] = React.useState<LicensePlateTemplate[]>([]);
  const LicensePlateList: any = useSelector((state: RootState) => state.alprLicensePlateReducer.LicensePlateList);
  const history = useHistory();
  const dispatch = useDispatch();
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage,
    gridSort: {
      field: orderField,
      dir: sortDir
    }
  });

  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [paging, setPaging] = React.useState<boolean>();
  const [apiFlag, setapiFlag] = React.useState<boolean>(false);
  const alertMessageRef = useRef<typeof CRXToaster>(null);
  const LicensePlateToasterData: any = useSelector((state: RootState) => state.alprLicensePlateReducer.LicensePlateToasterData);


  useEffect(() => {
    dispatch(GetLicensePlateData(pageiGrid));
    dispatch(enterPathActionCreator({ val: '' }));
  }, [])

  useEffect(() => {
    if ((LicensePlateToasterData?.statusCode == "200")) {
      onMessageShow(true, t("License_Plate_Deleted_Successfully"));
      dispatch(ClearLicensePlateProperty('LicensePlateToasterData'));
      dispatch(GetLicensePlateData(pageiGrid));
    }
    else if (LicensePlateToasterData?.statusCode == "201" || LicensePlateToasterData?.statusCode == "204") {
      onMessageShow(true, t("License_Plate_Saved_Successfully"));
      dispatch(ClearLicensePlateProperty('LicensePlateToasterData'));
      // setShowAlert(true);
    }
    else if(LicensePlateToasterData?.statusCode == "500")
    {
      onMessageShow(false, LicensePlateToasterData.message);
      dispatch(ClearLicensePlateProperty('LicensePlateToasterData'));
    }
  }, [LicensePlateToasterData]);

  useEffect(() => {
    if (searchData.length > 0) {
      setIsSearchable(true)
    }
    if (isSearchableOnChange)
      getFilteredLicensePlateData()
  }, [searchData]);

  useEffect(() => {
    if (LicensePlateList?.data) {
      let LicensePlateListCopy: LicensePlateTemplate[] = LicensePlateList.data;
      LicensePlateListCopy.map((data: any) => {
        return {
          licensePlate: data.licensePlate,
          dateOfInterest: data.dateOfInterest,
          licenseType: data.licenseType,
          licenseYear: data.vehicleYear,
          agencyId: data.agencyId,
          stateId: data.stateId,
          firstName: data.firstName,
          lastName: data.lastName,
          alias: data.alia,
          vehicleYear: data.vehicleYear,
          vehicleMake: data.vehicleMake,
          vehicleModel: data.vehicleModel,
          vehicleColor: data.vehicleColor,
          vehicleStyle: data.vehicleStyle,
          notes: data.notes,
          ncicNumber: data.ncicNumber,
          importSerialId: data.importSerialId,
          violationInfo: data.violationInfo,
          recId: data.recId,
          insertType: data.insertType,
          createdOn: data.createdOn,
          lastUpdatedOn: data.lastUpdatedOn,
          status: data.status,
          hotList: data.hotList,
          stateName: states.find(x => x.id == data.stateId)?.label == undefined ? "Unknown" : states.find((x: any) => x.id === data.stateId)?.label
        }
      });
      setRows(LicensePlateListCopy);
      setReformattedRows({ ...reformattedRows, rowsDataItems: LicensePlateList.data });

    }

  }, [LicensePlateList])

  useEffect(() => {
    if (paging) {
      dispatch(GetLicensePlateData(pageiGrid));
    }
    setPaging(false)
  }, [pageiGrid])

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage, gridSort: { field: orderField, dir: sortDir } });
    setPaging(true)
  }, [page, rowsPerPage])

  const CreateLicensePlateForm = () => {
    history.push(urlList.filter((item: any) => item.name === urlNames.LicensePlateDetailCreate)[0].url);
    RemoveSidePanelClass()
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

  const resizeRowCaptureTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

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
  };

  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false);

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
  const searchText = (rowsParam: LicensePlateTemplate[], headCell: HeadCellProps[], colIdx: number) => {
    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    }
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={onChange} />
    );
  };

  const [selectedDateTimeRangeForFilter, setSelectedDateTimeRangeStateForFilter] = React.useState<DateTimeObject>({
    startDate: moment().startOf("day").subtract(10000, "days").set("second", 0).format(),
    endDate: moment().endOf("day").set("second", 0).format(),
    value: basicDateDefaultValue,
    displayText: basicDateDefaultValue
  });

  const searchDate = (
    rowsParam: LicensePlateTemplate[],
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
          startDate:
            reformattedRows !== undefined ? reformattedRows.rows[0].dateOfInterest : "",
          endDate:
            reformattedRows !== undefined
              ? reformattedRows.rows[reformattedRows.length - 1].dateOfInterest
              : "",
          value: "custom",
          displayText: t("custom_range"),
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

  const editLicensePlate = (recId: number) => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.LicensePlateDetailEdit)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + recId, t("Edit_License_Plate"));
  };

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: t("ID"),
      id: "recId",
      align: "left",
      dataComponent: () => null,
      sort: false,
      searchFilter: false,
      searchComponent: searchText,
      keyCol: true,
      visible: false,
      minWidth: "150",
    },
    {
      label: t("Plate"),
      id: "licensePlate",
      align: "left",
      dataComponent: (e: string, id: number) => {
        return <div style={{ cursor: "pointer", color: "var(--color-c34400)" }} onClick={(e) => editLicensePlate(id)} className={"dataTableText txtStyle"}>{e}</div>
      },
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "200",
      attributeName: "licensePlate",
      attributeType: "String",
      attributeOperator: "contains",
      visible: true
    },
    {
      label: `${t("List")}`,
      id: "hotList",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "hotList",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Date_of_Interest")}`,
      id: "dateOfInterest",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: "180",
      attributeName: "dateOfInterest",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: `${t("Agency")}`,
      id: "agencyId",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "220",
      attributeName: "agencyId",
      attributeType: "number",
      attributeOperator: "contains"
    },
    {
      label: `${t("NCIC")}`,
      id: "ncicNumber",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "ncicNumber",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("State")}`,
      id: "stateName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowParam: LicensePlateTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
      minWidth: "180",
      attributeName: "stateName",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Make")}`,
      id: "vehicleMake",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "150",
      attributeName: "vehicleMake",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Model")}`,
      id: "vehicleModel",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "vehicleModel",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Year")}`,
      id: "vehicleYear",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "vehicleYear",
      attributeType: "Number",
      attributeOperator: "contains"
    },
    {
      label: `${t("First_Name")}`,
      id: "firstName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "firstName",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Last_Name")}`,
      id: "lastName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "lastName",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Alias")}`,
      id: "alias",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "alias",
      attributeType: "String",
      attributeOperator: "contains"
    }
  ]);

  const changeMultiselect = (
    val: renderCheckMultiselect[],
    colIdx: number
  ) => {
    onSelection(val, colIdx);
    headCells[colIdx].headerArray = val;
    setIsSearchableOnChange(true)
  };

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
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName.toLocaleLowerCase() !== headCells[colIdx].id.toString().toLocaleLowerCase()));
    let headCellReset = onSelectedIndividualClear(headCells, colIdx);
    setHeadCells(headCellReset);
  }

  const multiSelectCheckbox = (rowParam: LicensePlateTemplate[], headCells: HeadCellProps[], colIdx: number, initialRows: any) => {
    let dropDownOption: any = []
    let checkboxFlag: boolean = false;

    if (colIdx === 6) {
      states.map((x: any) => {
        dropDownOption.push({ id: x.id, value: x.label });
      });
    }
    return (
      <div>
        <CBXMultiCheckBoxDataFilter
          width={100}
          percentage={true}
          option={dropDownOption}
          defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
          onChange={(value: any) => changeMultiselect(value, colIdx)}
          onSelectedClear={() => onSelectedClear(colIdx)}
          isCheckBox={true}
          multiple={true}
          selectAllLabel="All"
        />
      </div>
    )

  }

  const getFilteredLicensePlateData = () => {
    pageiGrid.gridFilter.filters = []
    searchData.filter(x => x.value[0] !== '').forEach((item: any, index: number) => {
      let x: GridFilter = {
        operator: headCells[item.colIdx].attributeOperator,
        field: headCells[item.colIdx].id,
        value: item.value.length > 1 ? item.value.join('@') : item.value[0],
        fieldType: headCells[item.colIdx].attributeType,
      }
      pageiGrid.gridFilter.filters?.push(x)
    })
    pageiGrid.page = 0
    pageiGrid.size = rowsPerPage

    if (page !== 0) {
      setPage(0)
    }
    else {
      dispatch(GetLicensePlateData(pageiGrid));
    }
    setIsSearchable(false)
    setIsSearchableOnChange(false)
  }

  const handleBlur = () => {
    if (isSearchable) {
      getFilteredLicensePlateData()
    }
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      getFilteredLicensePlateData()
    }
  }

  const sortingOrder = (sort: any) => {
    if (!apiFlag) {
      setapiFlag(true)
    } else {
      setPageiGrid({ ...pageiGrid, gridSort: { field: sort.orderField, dir: sort.sortDir } })
      setSortDir(sort.sortDir)
      setOrderField(sort.orderField)
      setPaging(true)
    }
  }

  const LicensePlateFormMessages = (obj: any) => {
    alertMessageRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  }
  const onMessageShow = (isSuccess: boolean, message: string) => {
    LicensePlateFormMessages({
      message: message,
      variant: isSuccess ? 'success' : 'error',
      duration: 5000
    });
    if (isSuccess) {
      let notificationMessage: NotificationMessage = {
        title: t("License_Plate"),
        message: message,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }

  const onDelete = (recId: number) => {
    dispatch(DeleteLicensePlateData(recId))

  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
      <div className="switchLeftComponents " onKeyDown={handleKeyDown}>

        <CRXToaster ref={alertMessageRef} />
        {rows && (
          <CRXDataTable
            id="LicensePlateTemplateDataTable"
            actionComponent={

              <LicensePlateMenu
                row={selectedActionRow}
                selectedItems={selectedItems}
                gridData={rows}
                onDelete={onDelete}
              />

            }
            toolBarButton={
              <>
                <Restricted moduleId={0}>
                  <CRXButton
                    id={"createLicensePlate"}
                    className="primary LicensePlateBtn"
                    onClick={CreateLicensePlateForm}
                  >
                    {t("Create_License_Plate")}
                  </CRXButton>
                </Restricted>
              </>
            }
            showTotalSelectedText={false}
            showToolbar={true}
            initialRows={reformattedRows}
            showCountText={false}
            columnVisibilityBar={true}
            showCustomizeIcon={true}
            getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
            dataRows={rows}
            headCells={headCells}
            orderParam={sortDir}
            orderFieldParam={orderField}
            dragVisibility={false}
            showCheckBoxesCol={true}
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showActionSearchHeaderCell={false}
            className="crxTableHeight crxTableDataUi"
            getSelectedItems={(v: LicensePlateTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowCaptureTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage={(pages: any) => setPage(pages)}
            setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
            totalRecords={LicensePlateList?.totalCount == undefined ? 0 : LicensePlateList?.totalCount}
            setSortOrder={(sort: any) => sortingOrder(sort)}

            //Please dont miss this block.
            offsetY={119}
            stickyToolbar={130}
            searchHeaderPosition={224}
            dragableHeaderPosition={188}
            //End here

            showExpandViewOption={true}
          />
        )}

      </div>
    </ClickAwayListener>

  );
}

export { LicensePlate };