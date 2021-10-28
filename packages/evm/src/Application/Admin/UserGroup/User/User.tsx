
import React, { useEffect } from "react";
import { CRXDataTable, CRXColumn } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../components/DateDisplayComponent/TextDisplay";
import { DateTimeComponent } from "../../../../components/DateTimeComponent";
import { useDispatch, useSelector } from "react-redux";
import { getUsersInfoAsync } from "../../../../Redux/UserReducer";
import { RootState } from "../../../../Redux/rootReducer";
import {
    SearchObject,
    ValueString,
    HeadCellProps,
    onResizeRow,
    Order,
    onTextCompare,
    onDateCompare,
    onSetSingleHeadCellVisibility,
    onSetSearchDataValue,
    onClearAll,
    onSaveHeadCellData,
    onSetHeadCellVisibility
} from "../../../../utils/globalDataTableFunctions";
import TextSearch from "../../../../components/SearchComponents/TextSearch";
import dateDisplayFormat from "../../../../components/DateDisplayComponent/DateDisplayFormat";
import { CRXButton } from "@cb/shared";
import UserActionMenu from "./UserActionMenu"
import { dateOptionsTypes } from './../../../../../src/utils/constant';
import multitextDisplay from "../../../../components/DateDisplayComponent/MultiTextDisplay";
import MultSelectiDropDown from "../../../../components/SearchComponents/MultSelectiDropDown";

type User = {
    id: number;
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    status: string,
    lastLogin: string,
    groups: string[]
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

const User: React.FC = () => {
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getUsersInfoAsync());

        let headCellsArray = onSetHeadCellVisibility(headCells);
        setHeadCells(headCellsArray);
        onSaveHeadCellData(headCells, "userDataTable");
    }, []);

    const users: any = useSelector((state: RootState) => state.userReducer.usersInfo);
    const [rows, setRows] = React.useState<User[]>([]);
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<User[]>([]);
    const [reformattedRows, setReformattedRows] = React.useState<User[]>();
    const [selectedActionRow, setSelectedActionRow] = React.useState<User>();

    const setData = () => {
        let userRows: User[] = [];
        if (users && users.length > 0) {
            userRows = users.map((user: any) => {
                return {
                    id: user.recId,
                    userName: user.userName,
                    firstName: user.fName,
                    lastName: user.lName,
                    lastLogin: user.lastLogin,
                    groups: user.userGroups != null ? user.userGroups.split(',').map((x: string) => {
                        return x.trim();
                    }) : [],
                    email: user.email,
                    status: user.status
                }
            })
        }
        setRows(userRows)
        setReformattedRows(userRows);
    }

    React.useEffect(() => {
        setData();
    }, [users]);

    const searchText = (
        rowsParam: User[],
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
        rowsParam: User[],
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
                    startDate: reformattedRows !== undefined ? reformattedRows[0].lastLogin : "",
                    endDate: reformattedRows !== undefined ? reformattedRows[reformattedRows.length - 1].lastLogin : "",
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
            label: `${t("Username")}`,
            id: "userName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "100",
            maxWidth: "100",
            visible: true,
        },
        {
            label: `${t("First Name")}`,
            id: "firstName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "100",
            maxWidth: "100",
            visible: true,
        },
        {
            label: `${t("Last Name")}`,
            id: "lastName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "100",
            maxWidth: "100",
            visible: true,
        },
        {
            label: `${t("Email")}`,
            id: "email",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "100",
            maxWidth: "100",
            visible: true,
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
            visible: true,
        },
        {
            label: `${t("Last Login")}`,
            id: "lastLogin",
            align: "center",
            dataComponent: dateDisplayFormat,
            sort: true,
            minWidth: "120",
            searchFilter: true,
            searchComponent: searchDate,
            visible: true,
        },
        // {
        //     label: `${t("Groups")}`,
        //     id: "groups",
        //     align: "left",
        //     dataComponent: (e: string) => textDisplay(e, ""),
        //     sort: true,
        //     searchFilter: true,
        //     searchComponent: searchText,
        //     minWidth: "100",
        //     maxWidth: "100",
        //     visible: true,
        // }
        {
            label: `${t("Groups")}`,
            id: "groups",
            align: "left",
            dataComponent: (e: string[]) => multitextDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: (rowData: User[], columns: HeadCellProps[], colIdx: number) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, true),
            minWidth: "135",
        },
    ]);
    const searchAndNonSearchMultiDropDown = (
        rowsParam: User[],
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
            let dataRows: User[] = reformattedRows;
            searchData.forEach((el: SearchObject) => {
                if (el.columnName === "userName" || el.columnName === "firstName" || el.columnName === "lastName" || el.columnName === "email" || el.columnName === "groups" || el.columnName === "status")
                    dataRows = onTextCompare(dataRows, headCells, el);
                if (el.columnName === "lastLogin")
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
            <CRXButton id={"createUser"}>
                Create User
            </CRXButton>
            {rows && (
                <CRXDataTable
                    id="userDataTable"
                    actionComponent={<UserActionMenu row={selectedActionRow} selectedItems={selectedItems} />}
                    getRowOnActionClick={(val: User) =>
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
                    className="ManageAssetDataTable crxTableHeight bucketDataTable"
                    onClearAll={clearAll}
                    getSelectedItems={(v: User[]) => setSelectedItems(v)}
                    onResizeRow={resizeRow}
                    onHeadCellChange={onSetHeadCells}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    dragVisibility={false}
                    showCheckBoxes={true}
                    showActionCol={true}
                    showActionSearchHeaderCell={false}
                    showCountText={false}
                    showCustomizeIcon={true}
                    showTotalSelectedText={false}
                />
            )
            }
        </div>
    )
}

export default User
