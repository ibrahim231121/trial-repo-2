
import React, { useEffect } from "react";
import { CRXDataTable, CRXColumn, CRXGlobalSelectFilter } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../GlobalComponents/Display/TextDisplay";
import dateDisplayFormat from "../../GlobalFunctions/DateFormat";
import { useDispatch, useSelector } from "react-redux";
import { dateOptionsTypes } from '../../utils/constant';
import {DateTimeComponent } from '../../GlobalComponents/DateTime';
import { getUnitAuditLogsAsync } from "../../Redux/AuditLogReducer";
import { RootState } from "../../Redux/rootReducer";
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
    onSetHeadCellVisibility,
    onMultiToMultiCompare,
    GridFilter
} from "../../GlobalFunctions/globalDataTableFunctions";
import TextSearch from "../../GlobalComponents/DataTableSearch/TextSearch";
import { CRXButton } from "@cb/shared";

type UnitEvents = {
    users: string,
    event: string,
    description: string,
    eventTime: string,
    details: string,
    version: string,
    ip: string
}
type infoProps = {
    id: Number
}
const UnitDeviceDiagnosticLogs: React.FC<infoProps> = ({id}) => {
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();

    const unitEventsData: any = useSelector((state: RootState) => state.auditLogSlice.unitAuditLogs); 
    

    const [rows, setRows] = React.useState<UnitEvents[]>([]);
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<UnitEvents[]>([]);
    const [reformattedRows, setReformattedRows] = React.useState<UnitEvents[]>([]);
    const [open, setOpen] = React.useState<boolean>(false)

    React.useEffect(() => {
       // dispatch(getUnitAuditLogsAsync({unitId: id}));    
        let headCellsArray = onSetHeadCellVisibility(headCells);
        setHeadCells(headCellsArray);
        onSaveHeadCellData(headCells, "unitdevice-auditlog");
    }, []);

    const getUnitDeviceEvents = () => {
        let unitEventRows: UnitEvents[] = [];
        if (unitEventsData && unitEventsData.length > 0) {
            unitEventRows = unitEventsData.map((x: any) => {
                return {
                    
                    users: x.user?.userName,
                    event: x.event,
                    description: x.message,
                    eventTime: x.logTime,
                    details: x.data,
                    version: "Not Available",
                    ip: x.location.ip         
                }
            })
        }
        return unitEventRows
    }

    const setData = () => {
        let eventData = getUnitDeviceEvents()
        setRows(eventData)
        setReformattedRows(eventData);
    }

    React.useEffect(() => { 
        setData()
    }, [unitEventsData]);

    const searchText = (
        rowsParam: UnitEvents[],
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
 
  
   
    const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
        // {
        //     label: t("ID"),
        //     id: "id",
        //     align: "right",
        //     dataComponent: () => null,
        //     sort: true,
        //     searchFilter: true,
        //     searchComponent: () => null,
        //     keyCol: true,
        //     visible: false,
        //     minWidth: "80",
        //     maxWidth: "80",
        // },
        {
            label: t("Category"),
            id: "category",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            visible: true,
        },
        {
            label: t("Serial Number"),
            id: "serialNumber",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            visible: true,
        },
        {
            label: t("Station"),
            id: "station",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            visible: true,
        },
        {
            label: t("Assigned To"),
            id: "assignedTo",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            visible: true,
        },
        {
            label: t("Event Time"),
            id: "eventTime",
            align: "left",
            dataComponent: dateDisplayFormat,
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            visible: true,
        },
        {
            label: t("Details"),
            id: "details",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            visible: true,
        },
        {
            label: t("Version"),
            id: "version",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            visible: true,
        },
    ]);

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

   
    const resizeRowUserTab = (e: { colIdx: number; deltaX: number }) => {
        let headCellReset = onResizeRow(e, headCells);
        setHeadCells(headCellReset);
    };

    const clearAll = () => {
        const clearButton:any = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
        clearButton && clearButton.click()
        setOpen(false)
        setSearchData([]);
        let headCellReset = onClearAll(headCells);
        setHeadCells(headCellReset);
    };

    const onSetHeadCells = (e: HeadCellProps[]) => {
        let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
        setHeadCells(headCellsArray);
    };

    return (
        <div className="userDataTableParent ">
            {rows && (
                <CRXDataTable 
                    id="unitdevice-auditlog"
                    actionComponent={() => { }}
                    getRowOnActionClick={() => { }}
                    toolBarButton = {
           
                        <CRXButton  >
                          Export
                        </CRXButton>
                    
                    }
                    showToolbar={true}
                    dataRows={rows}
                    initialRows={reformattedRows}
                    headCells={headCells}
                    orderParam={order}
                    orderByParam={orderBy}
                    searchHeader={true}
                    columnVisibilityBar={true}
                    allowDragableToList={false}
                    className="ManageAssetDataTable usersGroupDataTable unitDeviceTabDataTable"
                    onClearAll={clearAll}
                    getSelectedItems={(v: UnitEvents[]) => setSelectedItems(v)}
                    onResizeRow={resizeRowUserTab}
                    onHeadCellChange={onSetHeadCells}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    dragVisibility={false}
                    showCheckBoxes={true}
                    showActionCol={false}
                    showActionSearchHeaderCell={false}
                    showCountText={false}
                    showCustomizeIcon={false}
                    showTotalSelectedText={false}
                    lightMode={false}
                    offsetY={45}
                />
            )
            }
        </div>
    )
}

export default UnitDeviceDiagnosticLogs
