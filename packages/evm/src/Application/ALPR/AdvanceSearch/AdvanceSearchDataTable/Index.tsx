import { CRXDataTable } from "@cb/shared";
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
    onTextCompare,
    onMultipleCompare,
    onDateCompare,
    onMultiToMultiCompare,
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import { useState, useEffect, useRef } from "react";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { AlprCapturePlateInfo } from "../../../../utils/Api/models/AlprCapturePlateInfo";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import { useTranslation } from "react-i18next";
import { CRXMultiSelectBoxLight } from "@cb/shared";
import { DateTimeComponent, DateTimeObject } from "../../../../GlobalComponents/DateTime";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../../Redux/UserReducer";
import { getAllAlprCapturePlatesInfo } from "../../../../Redux/AlprCapturePlateReducer";
import moment from "moment";
import { basicDateDefaultValue, dateOptionsTypes } from "../../../../utils/constant";
import { GetAlprCapturePayload } from "../../ALPRTypes";
import dateDisplayFormat from "../../../../GlobalFunctions/DateFormat";
import { CRXColumn } from "@cb/shared";
import multitextDisplay from "../../../../GlobalComponents/Display/MultiTextDisplay";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { CBXMultiSelectForDatatable } from "@cb/shared";
import { ClickAwayListener } from "@material-ui/core";
import { GetAllHotListData } from "../../../../Redux/AlprHotListReducer";
import { getToken } from "../../../../Login/API/auth";
import jwt_decode from "jwt-decode";
import NumberSearch from "../../../../GlobalComponents/DataTableSearch/NumberSearch";
import { urlList, urlNames } from "../../../../utils/urlList";
import AnchorDisplay from "../../../../utils/AnchorDisplay";
import { states } from "../../GlobalDropdown";
import { AlprGlobalConstants, AlprGridDateDisplayFormat, convertToDateTimePicker, gridAlignment, nullValidationHandling } from "../../AlprGlobal";
import { AlprAdvanceSearchModel } from "../../../../utils/Api/models/AlprAdvanceSearch";
import './Index.scss'
import { enterPathActionCreator } from "../../../../Redux/breadCrumbReducer";
import { DateTimeProps } from "../../../Cases/CaseTypes";
import defaultNumberPlateImage from "../../../../Assets/Images/numberPlate.jpg";

export type AdvanceSearchListProps = {
    rowsData: any[];
    dateOptionType: string;
    dateTimeDetail: DateTimeObject;
    showAdvanceSearch?: boolean;
    advanceSearchText?: any;
    showSearchPanel?: any,
    searchResultText?: Object;
}
const AdvanceSearchLister: React.FC<AdvanceSearchListProps> = ({
    rowsData,
    dateOptionType,
    dateTimeDetail,
    showAdvanceSearch,
    advanceSearchText,
    searchResultText,
    showSearchPanel,
}) => {
    const USER_COLID: number = 4;
    const HOTLIST_COLID: number = 3;
    const STATES_COLID: number = 5;
    const START_DATE = new Date(1900, 1, 1).toDateString();
    const END_DATE = new Date().toDateString();

    const { t } = useTranslation<string>();
    const [searchData, setSearchData] = useState<SearchObject[]>([]);
    const isSearchable = useRef<any>();
    const [order, setOrderDir] = useState<Order>("asc");
    const [orderBy, setOrderByField] = useState<string>("NumberPlate");
    const [rowsPerPage, setRowsPerPage] = useState<number>(AlprGlobalConstants.DEFAULT_GRID_PAGE_SIZE);
    const [page, setPage] = useState<number>(AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [rows, setRows] = useState<AlprAdvanceSearchModel[]>([]);
    const [usersData, setUsersDataState] = useState<any[]>([]);
    const [hotListData, setHotListDataState] = useState<any[]>([]);
    const [usersFilterData, setUsersFilterDataState] = useState<any[]>([]);
    const [selectedUser, setSelectedUserState] = useState<any>({});
    const [selectedHotList, setSelectedHotListState] = useState<any>({});
    const [reformattedRows, setReformattedRows] = useState<any>();
    const [getAlprCapturePayload, setAlprCapturePayloadState] = useState<GetAlprCapturePayload>({
        pageiGrid: {
            gridFilter: {
                logic: "and",
                filters: []
            },
            page: AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE,
            size: AlprGlobalConstants.DEFAULT_GRID_PAGE_SIZE,
            gridSort: {
                field: orderBy,
                dir: order
            }
        },
        userId: selectedUser.id,
        startDate: moment(START_DATE).toISOString(),
        endDate: moment(END_DATE).toISOString(),
        hotListId: 0
    })
    const [dateTime, setDateTime] = useState<DateTimeProps>({
        dateTimeObj: {
          startDate: "",
          endDate: "",
          value: "",
          displayText: "",
        },
        colIdx: 0,
      });
    const dispatch = useDispatch();
    const hotListDataLoadedRef = useRef<boolean>(false);
    const isSearchableOnChange = useRef<boolean>(false);
    const userDataLoadedRef = useRef<boolean>(false);

    const userInfos: any = useSelector((state: RootState) => state.userReducer.usersInfo)
    const hotListInfos: any = useSelector((state: RootState) => state.hotListReducer.HotList)


    const searchText = (rowsParam: any[], headCell: HeadCellProps[], colIdx: number) => {
        const onChange = (valuesObject: ValueString[]) => {
            headCells[colIdx].headerArray = valuesObject;
            onSelection(valuesObject, colIdx);
        }
        return (
            <TextSearch headCells={headCell} colIdx={colIdx} onChange={onChange} />
        );
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
        isSearchableOnChange.current = true;
        setSearchData((prevArr) => prevArr.filter((e) => e.columnName.toLowerCase() !== headCells[colIdx].id.toString().toLowerCase()));
        let headCellReset = onSelectedIndividualClear(headCells, colIdx);
        setHeadCells(headCellReset);
    }
    const searchAndNonSearchMultiDropDown = (
        rowsParam: AlprCapturePlateInfo[],
        headCells: HeadCellProps[],
        colIdx: number,
        initialRows: any,
        isSearchable: boolean
    ) => {
        if (colIdx === USER_COLID && initialRows && initialRows.usersData && initialRows.usersData.length > 0) {
            let users: { id: number, value: string }[] = [];
            initialRows.usersData.map((x: any) => {
                let userRows = initialRows.rowsDataItems.filter((row: { user: any; }) => row.user == x.id);

                if (userRows && userRows.length > 0)
                    users.push({ id: x.id, value: x.label });
            });

            return (
                <CBXMultiCheckBoxDataFilter
                    width={100}
                    option={users}
                    value={nullValidationHandling(headCells[colIdx].headerArray) ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
                    onChange={(value: any) => {
                        isSearchableOnChange.current = true;
                        onSelection(value.map((user: { id: any; }) => { return { id: user.id, value: user.id } }), colIdx);
                        headCells[colIdx].headerArray = value;
                    }}
                    onSelectedClear={() => onSelectedClear(colIdx)}
                    isCheckBox={true}
                    multiple={true}
                    isduplicate={true}
                    selectAllLabel="All"
                    percentage={true}
                />);
        }

        if (colIdx === HOTLIST_COLID && initialRows && initialRows.hotListData && initialRows.hotListData.length > 0) {
            let hotlists: { id: number, value: string }[] = [];
            initialRows.hotListData.map((x: any) => {
                if (x.id != 0)
                    hotlists.push({ id: x.id, value: x.label });
            });

            return (
                <CBXMultiCheckBoxDataFilter
                    width={100}
                    option={hotlists}
                    value={nullValidationHandling(headCells[colIdx].headerArray) ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
                    onChange={(value: any) => {
                            isSearchableOnChange.current = true;
                            onSelection(value.map((hotlist: { id: any; value: any }) => { return { id: hotlist.id, value: hotlist.value } }), colIdx);
                            headCells[colIdx].headerArray = value;
                    }}
                    onSelectedClear={(value: any) => {
                        onSelectedClear(colIdx);
                    }}
                    isCheckBox={true}
                    multiple={true}
                    isduplicate={true}
                    selectAllLabel="All"
                    percentage={true}
                />);
        }

        if (colIdx === STATES_COLID && initialRows && initialRows.states && initialRows.states.length > 0) {
            let statesList: { id: number, value: string }[] = [];
            initialRows.states.map((x: any) => {
                statesList.push({ id: x.id, value: x.label });
            });

            return (
                <CBXMultiCheckBoxDataFilter
                    width={100}
                    option={statesList}
                    value={nullValidationHandling(headCells[colIdx].headerArray) ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
                    onChange={(value: any) => {
                            isSearchableOnChange.current = true;
                            onSelection(value.map((state: { id: any; value: any }) => { return { id: state.id, value: state.value } }), colIdx);
                            headCells[colIdx].headerArray = value;
                    }}
                    onSelectedClear={(value: any) => {
                        onSelectedClear(colIdx);
                    }}
                    isCheckBox={true}
                    multiple={true}
                    isduplicate={true}
                    selectAllLabel="All"
                    percentage={true}
                />);
        }
    };
    const [selectedDateTimeRangeForFilter, setSelectedDateTimeRangeStateForFilter] = useState<DateTimeObject>({
        startDate: START_DATE,
        endDate: END_DATE,
        value: basicDateDefaultValue,
        displayText: basicDateDefaultValue
    });

    const dataArrayBuilder = () => {
        let dataRows: any = reformattedRows?.rowsDataItems;
        searchData.forEach((el: SearchObject) => {
            if (el.columnName === "unitId" || el.columnName === "numberPlate" || el.columnName === "confidence" || el.columnName === "unitId" || el.columnName === "notes" || el.columnName === "ticketNumber")
                dataRows = onTextCompare(dataRows, headCells, el);
            if (["hotlistName", "user", "stateName"].includes(el.columnName)) {
                dataRows = onMultipleCompare(dataRows, headCells, el);
            }
            if (el.columnName === "capturedAt") {
                dataRows = onDateCompare(dataRows, headCells, el);
            }
        });

        setRows(dataRows);

    };
    
    const searchDate = (
        _data: any,
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
    
        return (
          <DateTimeComponent
            reset={reset}
            dateTimeDetail={dateTimeObject.dateTimeObj}
            getDateTimeDropDown={(dateTime: DateTimeObject) => {
              onSelection(dateTime);
            }}
            dateOptionType={dateOptionType}
          />
        );
      };
    
    const [headCells, setHeadCells] = useState<HeadCellProps[]>([
        {
            label: t("ID"),
            id: "recId",
            align: gridAlignment("number"),
            dataComponent: () => null,
            sort: false,
            searchFilter: false,
            searchComponent: searchText,
            keyCol: true,
            visible: false,
            minWidth: "150",
            attributeName: "capturedPlateId",
            attributeType: "number"
        },
        {
            label: t("Capture_Plate_Thumbnail"),
            id: "capturedPlate",
            align: "centre",
            dataComponent: () => thumbnailDisplay(),
            sort: true,
            searchFilter: false,
            searchComponent: searchText,
            keyCol: true,
            visible: true,
            minWidth: "180",
            attributeName: "capturedPlateId",
            attributeType: "string",
        },
        {
            label: `${t("Number_Plate")}`,
            id: "numberPlate",
            align: gridAlignment("string"),
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "190",
            attributeName: "NumberPlate",
            attributeType: "string",
            attributeOperator: "contains",
            visible: true
        },
        {
            label: `${t("Hot_List")}`,
            id: "hotlistName",
            align: gridAlignment("list"),
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchAndNonSearchMultiDropDown,
            minWidth: "180",
            attributeName: "HotlistName",
            attributeType: "List",
            attributeOperator: "contains",
            visible: true
        },
        {
            label: `${t("User")}`,
            id: "user",
            align: gridAlignment("string"),
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchAndNonSearchMultiDropDown,
            minWidth: "180",
            attributeName: "UserId",
            attributeType: "List",
            attributeOperator: "contains",
            visible: true
        },
        {
            label: `${t("State_Name")}`,
            id: "stateName",
            align: gridAlignment("string"),
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchAndNonSearchMultiDropDown,
            minWidth: "220",
            attributeName: "CapturedAt",
            attributeType: "DateTime",
            attributeOperator: "between",
            visible: true
        },
        {
            label: `${t("Unit")}`,
            id: "unitId",
            align: gridAlignment("string"),
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "UnitId",
            attributeType: "String",
            attributeOperator: "contains",
            visible: true
        },
        {
            label: `${t("Captured_At")}`,
            id: "capturedAt",
            align: gridAlignment("date"),
            dataComponent: AlprGridDateDisplayFormat,
            sort: true,
            searchFilter: true,
            searchComponent: searchDate,
            minWidth: "220",
            attributeName: "CapturedAt",
            attributeType: "DateTime",
            attributeOperator: "between",
            visible: true
        },


        {
            label: `${t("Confidence")}`,
            id: "confidence",
            align: gridAlignment("string"),
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            // searchComponent: searchNumber,
            searchComponent: searchText,
            minWidth: "150",
            attributeName: "Confidence",
            attributeType: "int",
            attributeOperator: "eq",
            visible: true
        },
        {
            label: `${t("Notes")}`,
            id: "notes",
            align: gridAlignment("string"),
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "notes",
            attributeType: "String",
            attributeOperator: "contains",
            visible: true
        }
        ,
        {
            label: `${t("Ticket_No")}`,
            id: "ticketNumber",
            align: gridAlignment("double"),
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            // searchComponent: searchNumber,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "TicketNumber",
            attributeType: "double",
            attributeOperator: "eq",
            visible: true
        },

    ]);


    useEffect(() => {
        let pageiGrid: PageiGrid = {
            gridFilter: {
                logic: "and",
                filters: []
            },
            page: AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE,
            size: AlprGlobalConstants.DROPDOWN_PAGE_SIZE,
        }
        dispatch(getUsersInfoAsync(pageiGrid))
        dispatch(enterPathActionCreator({ val: `` }));
    }, []);

    useEffect(() => {
        let pageiGrid: PageiGrid = {
            gridFilter: {
                logic: "and",
                filters: []
            },
            page: AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE,
            size: AlprGlobalConstants.DROPDOWN_PAGE_SIZE,
            gridSort: {
                field: "name",
                dir: "asc"
            }
        }
        dispatch(GetAllHotListData(pageiGrid))
    }, []);

    useEffect(() => {
        if (userDataLoadedRef.current && hotListDataLoadedRef.current) {
            setAlprCapturePayloadState({
                ...getAlprCapturePayload,
                userId: selectedUser.id,
                hotListId: selectedHotList.id
            })
        }
    }, [selectedUser, selectedHotList]);

    useEffect(() => {
        setUserData();
    }, [userInfos?.data]);

    useEffect(() => {
        if (dateTime.colIdx !== 0) {
          if (
           nullValidationHandling(dateTime.dateTimeObj.startDate) &&
            nullValidationHandling(dateTime.dateTimeObj.endDate)) 
            {
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
        setHotListData();
    }, [hotListInfos?.data]);

    useEffect(() => {
        dataArrayBuilder();
    }, [searchData]);

    useEffect(() => {
        let pageiGrid: PageiGrid = {
            gridFilter: {
                logic: "and",
                filters: []
            },
            page: AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE,
            size: AlprGlobalConstants.DROPDOWN_PAGE_SIZE,
        }
        dispatch(getUsersInfoAsync(pageiGrid))
    }, []);


    useEffect(() => {
        let pageiGrid: PageiGrid = {
            gridFilter: {
                logic: "and",
                filters: []
            },
            page: AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE,
            size: AlprGlobalConstants.DROPDOWN_PAGE_SIZE,
            gridSort: {
                field: "name",
                dir: "asc"
            }
        }
        dispatch(GetAllHotListData(pageiGrid))
    }, []);


    useEffect(() => {
        const alprDataSourceCopy = rowsData.map((data: any) => {
            return {

                recId: data?.recId,
                capturePlate: data?.capturePlate,
                numberPlate: data?.numberPlate,
                hotlistName: data?.hotlistName,
                capturedAt: nullValidationHandling(data?.capturedAt) ? data?.capturedAt : '',
                stateName: nullValidationHandling(data?.stateName) ? data?.stateName : 'Unkown',
                unitId: data?.unitId,
                user: data?.user,
                confidence: data?.confidence,
                ticketNumber: data?.ticketNumber,
                longitude: data?.longitude,
                latitude: data?.latitude,
                ncicNumber: data?.ncicNumber,
                dateOfInterest: data?.dateOfInterest,
                licenseYear: data?.licenseYear,
                licenseType: data?.licenseType,
                vehicleYear: data?.vehicleYear,
                vehicleMake: data?.vehicleMake,
                vehicleModel: data?.vehicleModel,
                insertType: data?.insertType,
                status: data?.status,
                note: data?.notes,
                firstName: data?.firstName,
                lastName: data?.lastName,
                violationInfo: data?.violationInfo,
            }
        });
        setRows(alprDataSourceCopy)
        setReformattedRows({ ...reformattedRows, rowsDataItems: alprDataSourceCopy, usersData: usersData, hotListData: hotListData, states: states });

    }, [rowsData])

    useEffect(() => {
        setAlprCapturePayloadState({
            ...getAlprCapturePayload,
            pageiGrid: {
                ...getAlprCapturePayload.pageiGrid,
                page: page,
                size: rowsPerPage
            }
        })
    }, [page, rowsPerPage])


    const setUserData = () => {
        if (userInfos && userInfos.data) {
            let usersDataSource = userInfos.data.map((user: any) => {
                return {
                    label: user.fName + " " + user.lName,
                    id: user.recId,
                    inputValue: user.fName + " " + user.lName
                }
            });

            usersDataSource = [{
                id: 0,
                label: "All"
            }, ...usersDataSource]

            setUsersDataState(usersDataSource);
            userDataLoadedRef.current = true;

            setUsersFilterDataState(userInfos.data.map((user: any) => {
                return {
                    value: user.fName + " " + user.lName,
                    id: user.recId
                }
            }));

            setSelectedUserState(usersDataSource[0]);
            setReformattedRows({ ...reformattedRows, usersData: usersDataSource })
        }
    }

    const setHotListData = () => {
        if (hotListInfos && hotListInfos.data) {
            let hotListDataSource = hotListInfos.data.map((hotList: any) => {
                return {
                    label: hotList.name,
                    id: hotList.recId,
                    inputValue: hotList.name
                }
            });

            hotListDataSource = [{
                id: 0,
                label: "All"
            }, ...hotListDataSource]

            setHotListDataState(hotListDataSource);

            hotListDataLoadedRef.current = true;
            setSelectedHotListState(hotListDataSource[0]);
            setReformattedRows({ ...reformattedRows, hotListData: hotListDataSource })
        }
    }

    const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
        let headCellReset = onResizeRow(e, headCells);
        setHeadCells(headCellReset);
    };

    const onSetHeadCells = (e: HeadCellProps[]) => {
        let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
        setHeadCells(headCellsArray);

    };

    const thumbnailDisplay = () => {
        return (<div className="plateThumbnail">
            <img src={defaultNumberPlateImage}></img>
            {/* dynamic data will be bind later */}
            {/* <img src={emptyThumbnail}></img> */}
        </div>);
    }
    const clearAll = () => {
        setSearchData([]);
        let headCellReset = onClearAll(headCells);
        setHeadCells(headCellReset);
      };
    return (
            <div className="Alpr_AdvanceSearch_SwitchLeftComponents Alpr_AdvanceSearch_Index">
                {rows && (
                    <CRXDataTable
                        id="Number Plates"
                        actionComponent={() => { }}
                        getRowOnActionClick={() => { }}
                        showToolbar={true}
                        dataRows={rows}
                        initialRows={reformattedRows}
                        headCells={headCells}
                        orderParam={order}
                        orderByParam={orderBy}
                        searchHeader={true}
                        columnVisibilityBar={true}
                        allowDragableToList={true}
                        className="crxTableHeight"
                        onClearAll={clearAll}
                        getSelectedItems={(v: AlprCapturePlateInfo[]) => setSelectedItems(v)}
                        onResizeRow={resizeRowConfigTemp}
                        onHeadCellChange={onSetHeadCells}
                        setSelectedItems={setSelectedItems}
                        selectedItems={selectedItems}
                        dragVisibility={false}
                        showCheckBoxesCol={false}
                        showActionCol={false}
                        showActionSearchHeaderCell={false}
                        showCustomizeIcon={true}
                        showTotalSelectedText={false}
                        lightMode={false}
                        //Please dont miss this block.
                        offsetY={119}
                        stickyToolbar={130}
                        searchHeaderPosition={221}
                        dragableHeaderPosition={186}
                        showExpandViewOption={true}
                        //End here
                        page={page}
                        rowsPerPage={rowsPerPage}
                        setPage={(page: any) => setPage(page)}
                        setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                        totalRecords={rowsData.length}
                        showSearchPanel={showSearchPanel}
                        viewName="numberPlateListerView"
                        advanceSearchText={advanceSearchText}
                        searchResultText={searchResultText}
                        selfPaging={true}
                        selfSorting={true}
                    />
                )
                }
            </div>
    )
}
export default AdvanceSearchLister;