import { CRXDataTable,CRXColumn } from "@cb/shared";
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
import React, { useEffect } from "react";
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
import { GetLicensePlateData } from "../../../Redux/AlprLicensePlateReducer";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { dateOptionsTypes } from "../../../utils/constant";
import moment from "moment";

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
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("Name");
    const [selectedItems, setSelectedItems] = React.useState<LicensePlateTemplate[]>([]);
    const [reformattedRows, setReformattedRows] = React.useState<any>();
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const [page, setPage] = React.useState<number>(0);
    const [selectedActionRow, setSelectedActionRow] = React.useState<LicensePlateTemplate[]>([]);
    const LicensePlateList: any = useSelector((state: RootState) => state.alprLicensePlateReducer.LicensePlateList);
    const history = useHistory();
    const dispatch=useDispatch();

    const CreateLicensePlateForm = () => {
        history.push(urlList.filter((item: any) => item.name === urlNames.LicensePlateDetail)[0].url);
        RemoveSidePanelClass()
    }
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
    const dateDisplayFormat = (dateTime: string) => {

        if (dateTime === null || dateTime == "")
          return '';
      
        const localDateTime = moment(dateTime)
          .local()
          .format("YYYY / MM / DD HH:mm:ss");
        return localDateTime
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
    const searchText = (rowsParam: LicensePlateTemplate[], headCell: HeadCellProps[], colIdx: number) => {
        const onChange = (valuesObject: ValueString[]) => {
            headCells[colIdx].headerArray = valuesObject;
            onSelection(valuesObject, colIdx);
        }
        return (
            <TextSearch headCells={headCell} colIdx={colIdx} onChange={onChange} />
        );
    };

    const searchDate = (
        rowsParam: [],
        headCells: HeadCellProps[],
        colIdx: number
      ) => {
        debugger;
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
                reformattedRows !== undefined ? reformattedRows.rows[0].lastLogin : "",
              endDate:
                reformattedRows !== undefined
                  ? reformattedRows.rows[reformattedRows.length - 1].lastLogin
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
            id: "LicensePlate",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "190",
            attributeName: "LicensePlate",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("List")}`,
            id: "List",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "sourceName",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("Date_of_Interest")}`,
            id: "DateOfInterest",
            align: "center",
            // dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            dataComponent: dateDisplayFormat,
            sort: true,
            searchFilter: true,
            //   searchComponent: (rowParam: LicensePlateTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
            searchComponent: searchDate,
            minWidth: "180",
            attributeName: "DateOfInterest",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("Agency")}`,
            id: "Agency",
            align: "right",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "220",
            attributeName: "Agency",
            attributeType: "number",
            attributeOperator: "contains"
        },
        {
            label: `${t("NCIC")}`,
            id: "NCICNumber",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "NCICNumber",
            attributeType: "String",
            attributeOperator: "contains"
        },
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
        },
        {
            label: `${t("Make")}`,
            id: "VehicleMake",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "150",
            attributeName: "VehicleMake",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Model")}`,
            id: "Model",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "VehicleModel",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Year")}`,
            id: "VehicleYear",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "VehicleYear",
            attributeType: "Number",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("First_Name")}`,
            id: "FirstName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "FirstName",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Last_Name")}`,
            id: "LastName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "LastName",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Alias")}`,
            id: "Alias",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "Alias",
            attributeType: "String",
            attributeOperator: "contains"
        }
    ]);
    
    useEffect(()=>
    {
        dispatch(GetLicensePlateData());
    },[])

    useEffect(()=>{
        setRows(LicensePlateList);
    },[LicensePlateList])
    return (
        // <ClickAwayListener onClickAway={handleBlur}>

        //   <div className="crxManageUsers switchLeftComponents manageUsersIndex" onKeyDown={handleKeyDown}>
        <div className="crxManageUsers switchLeftComponents manageUsersIndex" >
            <CRXToaster />
            {rows && (
                <CRXDataTable
                    id="CategoriesTemplateDataTable"
                    actionComponent={

                        <LicensePlateMenu
                            row={selectedActionRow}
                            selectedItems={selectedItems}
                            gridData={rows}
                        />

                    }
                    toolBarButton={
                        <>
                            <Restricted moduleId={0}>
                                <CRXButton
                                    id={"createLicensePlate"}
                                    className="primary CategoriesBtn"
                                    onClick={CreateLicensePlateForm}
                                >
                                    {t("Create License Plate")}
                                </CRXButton>
                            </Restricted>
                        </>
                    }
                    showTotalSelectedText={false}
                    showToolbar={true}
                    showCountText={false}
                    columnVisibilityBar={true}
                    showCustomizeIcon={true}
                    getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
                    dataRows={rows}
                    headCells={headCells}
                    orderParam={order}
                    orderByParam={orderBy}
                    dragVisibility={false}
                    showCheckBoxesCol={true}
                    showActionCol={true}
                    searchHeader={true}
                    allowDragableToList={false}
                    showActionSearchHeaderCell={false}
                    className="crxTableHeight crxTableDataUi LicensePlateTableTemplate"
                    // onClearAll={clearAll}
                    getSelectedItems={(v: LicensePlateTemplate[]) => setSelectedItems(v)}
                    onResizeRow={resizeRowCaptureTemp}
                    onHeadCellChange={onSetHeadCells}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={(pages: any) => setPage(pages)}
                    setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
                    totalRecords={rows?.length}
                    // setSortOrder={(sort: any) => sortingOrder(sort)}

                    //Please dont miss this block.
                    offsetY={119}
                    stickyToolbar={130}
                    searchHeaderPosition={224}
                    dragableHeaderPosition={188}
                    //End here

                    showExpandViewOption={true}
                    initialRows={rows}
                />
            )}

        </div>
        // {/* </ClickAwayListener> */ }

    );
}


export default LicensePlate;