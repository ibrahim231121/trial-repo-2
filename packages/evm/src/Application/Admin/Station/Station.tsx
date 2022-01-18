
import React, { useEffect, useRef } from "react";
import { CRXDataTable, CRXColumn, CRXToaster } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
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
} from "../../../GlobalFunctions/globalDataTableFunctions";

import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import { CRXButton } from "@cb/shared";
import { dateOptionsTypes } from './../../../../src/utils/constant';

import MultSelectiDropDown from "../../../GlobalComponents/DataTableSearch/MultSelectiDropDown";
import { CRXModalDialog } from "@cb/shared";
import { userInfo } from "os";
import { getStationsInfoAsync } from "../../../Redux/StationReducer";
import StationActionMenu from "./StationActionMenu";
import AnchorDisplay from "../../../utils/AnchorDisplay";
import { urlList, urlNames } from "../../../utils/urlList";

type Station = {
    id: string;
    name: string,
    address: string,
    city: string,
    state: string,
    zip: string,
    country: string
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

const Station: React.FC = () => {
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getStationsInfoAsync());

        let headCellsArray = onSetHeadCellVisibility(headCells);
        setHeadCells(headCellsArray);
        onSaveHeadCellData(headCells, "userDataTable");
    }, []);

    const stations: any = useSelector((state: RootState) => state.stationReducer.stationInfo);
    const [rows, setRows] = React.useState<Station[]>([]);
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<Station[]>([]);
    const [reformattedRows, setReformattedRows] = React.useState<Station[]>();
    const [open, setOpen] = React.useState(false);
    const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
    const [selectedActionRow, setSelectedActionRow] = React.useState<Station>();
    const setData = () => {
        let stationRows: Station[] = [];

        if (stations && stations.length > 0) {
            console.log("running")
            stationRows = stations.map((station: any) => {
                return {
                    id: station.id,
                    name: station.name + "_" + station.id,
                    // address: station.address,
                    city: station.address.city,
                    state: station.address.state,
                    zip: station.address.zip,
                    country: station.address.country
                }
            })
        }
        setRows(stationRows)
        setReformattedRows(stationRows);
        console.log("userRows", stationRows);
    }

    React.useEffect(() => {
        setData();
    }, [stations]);

    const searchText = (
        rowsParam: Station[],
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
        rowsParam: Station[],
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
            label: `${t("Station")}`,
            id: "name",
            align: "left",
            // dataComponent: (e: string) => StationAnchorDisplay(e, "anchorStyle"),
            dataComponent: (e: string) => AnchorDisplay(e, "anchorStyle", urlList.filter((item: any) => item.name === urlNames.adminStationId)[0].url),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "100",
            maxWidth: "100",
        },
        {
            label: `${t("Address")}`,
            id: "address",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "100",
            maxWidth: "100",
        },
        {
            label: `${t("City")}`,
            id: "city",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "100",
            maxWidth: "100",
        },
        {
            label: `${t("State")}`,
            id: "state",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "100",
            maxWidth: "100",
        },
        {
            label: `${t("Zip Code")}`,
            id: "zip",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "100",
            maxWidth: "100",
        },
        {
            label: `${t("Country")}`,
            id: "country",
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
        rowsParam: Station[],
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
            let dataRows: Station[] = reformattedRows;
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

    const toasterRef = useRef<typeof CRXToaster>(null)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const showToastMsg = (obj: any) => {
        toasterRef.current.showToaster({
            message: obj.message, variant: obj.variant, duration: obj.duration
        });
    }

    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        setOpen(false);
        dispatch(getStationsInfoAsync());
    };

    return (
        <div className="crxManageUsers">
            <CRXToaster ref={toasterRef} />
            <CRXButton id={"createUser"} className="primary manageUserBtn" onClick={handleClickOpen}>Create Station
            </CRXButton>
            <CRXModalDialog
                className="createUser CrxCreateUser"
                style={{ minWidth: "680px" }}
                maxWidth="xl"
                title="Create Station"
                modelOpen={open}
                onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
                closeWithConfirm={closeWithConfirm}
            >

            </CRXModalDialog>



            {rows && (
                <CRXDataTable
                    id="userDataTable"
                    actionComponent={<StationActionMenu row={selectedActionRow} selectedItems={selectedItems} showToastMsg={(obj: any) => showToastMsg(obj)} />}
                    getRowOnActionClick={(val: Station) =>
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
                    className="ManageAssetDataTable"
                    onClearAll={clearAll}
                    getSelectedItems={(v: Station[]) => setSelectedItems(v)}
                    onResizeRow={resizeRow}
                    onHeadCellChange={onSetHeadCells}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    dragVisibility={false}
                    showCheckBoxesCol={true}
                    showActionCol={true}
                    showActionSearchHeaderCell={false}
                    showCountText={false}
                    showCustomizeIcon={false}
                    showTotalSelectedText={false}
                />
            )
            }
        </div>
    )
}

export default Station;
