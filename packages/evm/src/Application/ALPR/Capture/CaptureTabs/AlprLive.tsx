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
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import React from "react";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { HotListCaptureTemplate } from "../../../../utils/Api/models/HotlistCapture";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import { useTranslation } from "react-i18next";
import "./AlprLive.scss"




const AlprLive = () => {
    const [rows, setRows] = React.useState<HotListCaptureTemplate[]>([]);

    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const { t } = useTranslation<string>();
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("Name");
    const [selectedItems, setSelectedItems] = React.useState<HotListCaptureTemplate[]>([]);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const [page, setPage] = React.useState<number>(0);


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
    }

    const searchText = (rowsParam: HotListCaptureTemplate[], headCell: HeadCellProps[], colIdx: number) => {
        const onChange = (valuesObject: ValueString[]) => {
            headCells[colIdx].headerArray = valuesObject;
            onSelection(valuesObject, colIdx);
        }
        return (
            <TextSearch headCells={headCell} colIdx={colIdx} onChange={onChange} />
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
            searchComponent: searchText,
            keyCol: true,
            visible: false,
            minWidth: "150",
        },
        {
            label: `${t("Plate_Number")}`,
            id: "PlateNumber",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "150",
            attributeName: "PlateNumber",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("Captured_At")}`,
            id: "Captured",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "150",
            attributeName: "Captured",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("Notification")}`,
            id: "Notification",
            align: "center",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            //   searchComponent: (rowParam: HotListCaptureTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
            searchComponent: searchText,
            minWidth: "150",
            attributeName: "Notification",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("Notes")}`,
            id: "Notes",
            align: "right",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "150",
            attributeName: "Notes",
            attributeType: "number",
            attributeOperator: "contains"
        },
    ]);

    return (
        <div style={{display: 'flex'}}>
            <div className='ALprLiveImageSrc'>
            {/* <img src="C://Users//hdc//Pictures//logo.png" alt="not found"/> */}
            </div>
            <div className="ALprLiveDataTable">
                {/* // <ClickAwayListener onClickAway={handleBlur}>
        // <div className="userDataTableParent  groupPermissionInnerPage" onKeyDown={handleKeyDown}> */}
                <div className="liveDataTableParent liveInnerPage" style={{ width: "860px" }}>
                    {rows && (
                        <CRXDataTable
                            id="group-userDataTable"
                            actionComponent={() => { }}
                            getRowOnActionClick={() => { }}
                            showToolbar={false}
                            dataRows={rows}
                            initialRows={rows}
                            headCells={headCells}
                            orderParam={order}
                            orderByParam={orderBy}
                            searchHeader={true}
                            columnVisibilityBar={false}
                            allowDragableToList={true}
                            className="liveDataTable usersGroupDataTable"
                            // onClearAll={clearAll}
                            getSelectedItems={() => { }}
                            onResizeRow={resizeRowCaptureTemp}
                            onHeadCellChange={onSetHeadCells}
                            setSelectedItems={setSelectedItems}
                            selectedItems={null}
                            dragVisibility={false}
                            showCheckBoxesCol={false}
                            showActionCol={false}
                            showActionSearchHeaderCell={false}
                            showCountText={false}
                            showCustomizeIcon={false}
                            showTotalSelectedText={false}
                            lightMode={false}
                            //Please dont miss this block.
                            offsetY={129}
                            stickyToolbar={0}
                            //End here
                            page={page}
                            rowsPerPage={rowsPerPage}
                            setPage={(page: any) => setPage(page)}
                            setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                            totalRecords={rows.length}
                        // setSortOrder={(sort: any) => sortingOrder(sort)}
                        />
                    )
                    }
                </div>
                {/* // </ClickAwayListener > */}
            </div>
        </div>
    )
}


export default AlprLive;