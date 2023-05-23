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
import "./AlprCapture.scss"
import { CRXMultiSelectBoxLight } from "@cb/shared";
import { DateTimeComponent } from "../../../../GlobalComponents/DateTime";




const AlprCapture = () => {
    const [rows, setRows] = React.useState<HotListCaptureTemplate[]>([]);

    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const { t } = useTranslation<string>();
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("Name");
    const [selectedItems, setSelectedItems] = React.useState<HotListCaptureTemplate[]>([]);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const [page, setPage] = React.useState<number>(0);

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
      let dateTimeObject: DateTimeProps = {
        dateTimeObj: {
          startDate: "",
          endDate: "",
          value: "",
          displayText: "",
        },
        colIdx: 0,
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
            label: `${t("Plate")}`,
            id: "Plate",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "190",
            attributeName: "Name",
            attributeType: "Plate",
            attributeOperator: "contains"
        },
        {
            label: `${t("Description")}`,
            id: "Description",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "Description",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("Hot_List")}`,
            id: "HotList",
            align: "center",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            //   searchComponent: (rowParam: HotListCaptureTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "HotList",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("Captured")}`,
            id: "Captured",
            align: "right",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "220",
            attributeName: "Captured",
            attributeType: "number",
            attributeOperator: "contains"
        },
        {
            label: `${t("Unit")}`,
            id: "Unit",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            //   searchComponent: (rowParam: HotListCaptureTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "Unit",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("User")}`,
            id: "User",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "User",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("Confidence")}`,
            id: "Confidence",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "150",
            attributeName: "Confidence",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("State")}`,
            id: "State",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "State",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Notes")}`,
            id: "Notes",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "Notes",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Ticket_No")}`,
            id: "TicketNo",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "TicketNo",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Latitude")}`,
            id: "Latitude",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "Latitude",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Longitude")}`,
            id: "Longitude",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "Longitude",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Life_Span")}`,
            id: "LifeSpan",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "LifeSpan",
            attributeType: "String",
            attributeOperator: "contains"
        }
    ]);

    return (
        // <ClickAwayListener onClickAway={handleBlur}>
        // <div className="userDataTableParent  groupPermissionInnerPage" onKeyDown={handleKeyDown}>
        <div className="captureDataTableParent captureInnerPage" >
            <div className="ui">
                <div className="ui">
                    <label>Users:</label>
                    <CRXMultiSelectBoxLight

                        className="dropDownWidth"
                        label=""
                        // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                        multiple={false}
                        CheckBox={true}
                        options={null}
                        required={false}
                        isSearchable={true}
                        // value={values.sourceName === 0 ? "" : { id: values.sourceName, label: SourceOptions.find((x: any) => x.id === values.sourceName)?.label }}

                        onChange={(
                            e: React.SyntheticEvent,
                            value: any
                        ) => {
                            // setFieldValue("sourceName", value === null ? -1 : Number.parseInt(value?.id))
                        }
                        }
                        onOpen={(e: any) => {
                        }}
                    />
                </div>
                <div className="ui">
                    <label>{t('Hot_List')}:</label>
                    <CRXMultiSelectBoxLight

                        className="dropDownWidth"
                        label=""
                        // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                        multiple={false}
                        CheckBox={true}
                        options={null}
                        required={false}
                        isSearchable={true}
                        // value={values.sourceName === 0 ? "" : { id: values.sourceName, label: SourceOptions.find((x: any) => x.id === values.sourceName)?.label }}

                        onChange={(
                            e: React.SyntheticEvent,
                            value: any
                        ) => {
                            // setFieldValue("sourceName", value === null ? -1 : Number.parseInt(value?.id))
                        }
                        }
                        onOpen={(e: any) => {
                        }}
                    />
                </div>
                <div className="ui">
                    <label>{t('Custom_Range')}:</label>
                    <DateTimeComponent
                        showCompact={false}
                        reset={false}
                        dateTimeDetail={dateTimeObject.dateTimeObj}
                        getDateTimeDropDown={(dateTime: DateTimeObject) => {
                            // onSelection(dateTime);
                        }}
                        dateOptionType={''}
                    />
                </div>
            </div>
            {rows && (
                <CRXDataTable
                    id="CaptureDataTable"
                    actionComponent={() => { }}
                    getRowOnActionClick={() => { }}
                    showToolbar={true}
                    dataRows={rows}
                    initialRows={rows}
                    headCells={headCells}
                    orderParam={order}
                    orderByParam={orderBy}
                    searchHeader={true}
                    columnVisibilityBar={true}
                    allowDragableToList={true}
                    className="captureDataTable usersGroupDataTable"
                    // onClearAll={clearAll}
                    getSelectedItems={(v: HotListCaptureTemplate[]) => setSelectedItems(v)}
                    onResizeRow={resizeRowCaptureTemp}
                    onHeadCellChange={onSetHeadCells}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    dragVisibility={false}
                    showCheckBoxesCol={true}
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
        // </ClickAwayListener >
    )
}


export default AlprCapture;