
import React, { useEffect } from "react";
import { CRXDataTable, CRXColumn, CRXGlobalSelectFilter } from "@cb/shared";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useTranslation } from "react-i18next";
import textDisplay from "../../GlobalComponents/Display/TextDisplay";
import { dateDisplayFormat } from "../../GlobalFunctions/DateFormat";
import { useDispatch, useSelector } from "react-redux";
import { dateOptionsTypes } from '../../utils/constant';
import { DateTimeComponent } from '../../GlobalComponents/DateTime';
import { RootState } from "../../Redux/rootReducer";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
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
    GridFilter,
    PageiGrid
} from "../../GlobalFunctions/globalDataTableFunctions";
import TextSearch from "../../GlobalComponents/DataTableSearch/TextSearch";
import { CRXButton } from "@cb/shared";
import { AuditLog } from "../../utils/Api/models/AuditLogModels";
import { getUnitAuditLogsAsync, getUnitDiagnosticLogsAsync } from "../../Redux/AuditLogReducer";
import { AuditLogAgent } from "../../utils/Api/ApiAgent";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

type UnitEvents = {
    users: string,
    event: string,
    description: string,
    logTime: string,
    details: string,
    version: string,
    ip: string
}
type infoProps = {
    id: Number
}
interface renderCheckMultiselect {
    value: string,
    id: string,
  
  }
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
const UnitDeviceDiagnosticLogs: React.FC<infoProps> = ({ id }) => {
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();

    const unitEventsData: any = useSelector((state: RootState) => state.auditLogSlice.unitDiagnosticLogs);
    const unitEventsTotal: any = useSelector((state: RootState) => state.auditLogSlice.unitDiagnosticLogsCount);

    const [rows, setRows] = React.useState<UnitEvents[]>([]);
    const [order, setOrder] = React.useState<Order>("desc");
    const [orderBy, setOrderBy] = React.useState<string>("logTime");
    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<UnitEvents[]>([]);
    const [reformattedRows, setReformattedRows] = React.useState<UnitEvents[]>([]);
    const [open, setOpen] = React.useState<boolean>(false)
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
    const [paging, setPaging] = React.useState<boolean>();
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
    const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
    const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)

    const exportDiagnostics = () => {
      let headers = [
        {
          key: 'GridFilter',
          value: JSON.stringify(pageiGrid.gridFilter)
        },
        {
          key: 'GridSort',
          value: JSON.stringify(pageiGrid.gridSort)
        }]
      let url = `/AuditLogs?Service=3&Result=1&UnitId=${id}&AuditType=${"Diagnostic"}&Page=${1}&Size=${5000}`
      AuditLogAgent.getUnitAuditLogs(url, headers).then((response: any) => {
        ExportToExcel(response?.data, "Diagnostics")
      })
    };

    const ExportToExcel = (apiData: any, fileName: any) => {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      let formattedData = apiData.map((x: any) => {
        return {
          EventTime: new Date(x.logTime),
          Details: x.message
        }
      })
      const ws = XLSX.utils.json_to_sheet(formattedData);
      ws.A1.v = "Event Time";
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    };


    React.useEffect(() => {
        let headCellsArray = onSetHeadCellVisibility(headCells);
        setHeadCells(headCellsArray);
        onSaveHeadCellData(headCells, "unitdevice-auditlog");
    }, []);
    useEffect(() => {
          if (paging) {
              dispatch(getUnitDiagnosticLogsAsync({ unitId: id, auditType: "Diagnostic", pageiGrid: pageiGrid }));
          }
          setPaging(false)
      }, [pageiGrid])
    React.useEffect(() => {
        setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage, gridSort: { field: orderBy, dir: order } });
        setPaging(true)

    }, [page, rowsPerPage])
    const sortingOrder = (sort: any) => {
        setPageiGrid({ ...pageiGrid, gridSort: { field: orderBy, dir: sort.order } })
        setOrder(sort.order)
        setOrderBy(orderBy)
        setPaging(true)
    }
   
    const getUnitDeviceEvents = () => {
        let unitEventRows: UnitEvents[] = [];
        if (unitEventsData && unitEventsData.length > 0) {
            unitEventRows = unitEventsData.map((x: any) => {
                return {
                    id: x.id,
                    logTime: x.logTime,
                    message: x.message,     
                }
            })
        }
        return unitEventRows
    }
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
        
    const handleKeyDown = (event: any) => { 
        if (event.key === 'Enter') {
            getFilteredDiagnosticLogs()
            event.preventDefault();
        }
      }
      const getFilteredDiagnosticLogs = () => {
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
          dispatch(getUnitDiagnosticLogsAsync({ unitId: id, auditType: "Diagnostic", pageiGrid: pageiGrid }));
        }
        setIsSearchable(false)
        setIsSearchableOnChange(false)
      }
    const setData = () => {
        let eventData = getUnitDeviceEvents()
        setRows(eventData)
        setReformattedRows(eventData);
    }

    useEffect(() => {
        if (searchData.length > 0)
          setIsSearchable(true)
        if (isSearchableOnChange)
          getFilteredDiagnosticLogs()
      }, [searchData]);
    
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
    const searchDate = (
        rowsParam: UnitEvents[],
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
        //change heree add colx id
        if (
          headCells[colIdx].headerObject === undefined ||
          headCells[colIdx].headerObject === null
        ) {
          dateTimeObject = {
            dateTimeObj: {
              startDate:( reformattedRows !== undefined && reformattedRows.length > 0) ? reformattedRows[0].logTime : "",
              endDate: (reformattedRows !== undefined && reformattedRows.length > 0) ? reformattedRows[reformattedRows.length - 1].logTime : "",
              value: "last 7 days",
              displayText: t("last 7 days"),
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
          <CRXColumn item xs={12}>
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
            sort: true,
            searchFilter: true,
            searchComponent: () => null,
            keyCol: true,
            visible: false,
            minWidth: "80",
            maxWidth: "80",
        },
        {
            label: t("Event Time"),
            id: "logTime",
            align: "left",
            dataComponent: dateDisplayFormat,
            sort: true,
            searchFilter: true,
            searchComponent: searchDate,
            minWidth: "200",
            visible: true,
            attributeName: "logTime",
            attributeType: "DateTime",
            attributeOperator: "between"
        },
        {
            label: t("Details"),
            id: "message",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: false,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "1550",
            visible: true,
            attributeName: "message",
            attributeType: "String",
            attributeOperator: "contains"
        }
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
    const handleBlur = () => {
         if (isSearchable)
           getFilteredDiagnosticLogs()
      }
    const clearAll = () => {
        const clearButton: any = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
        clearButton && clearButton.click()
        setOpen(false)
        pageiGrid.gridFilter.filters = []
        dispatch(getUnitDiagnosticLogsAsync({ unitId: id, auditType: "Diagnostic", pageiGrid: pageiGrid }));
        setSearchData([]);
        let headCellReset = onClearAll(headCells);
        setHeadCells(headCellReset);
    };

    const onSetHeadCells = (e: HeadCellProps[]) => {
        let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
        setHeadCells(headCellsArray);
    };

    return (
      <>
      <div className="eventsDownloadbtn">           
                  <Menu
                    align="start"
                    viewScroll="close"
                    direction="bottom"
                    position="auto"
                    portal={true}
                    className="create-template-menu eventsDownloadDropDown"
                    arrow={false}
                    menuButton={<MenuButton><i className="far fa-download"></i> {t("Export")}</MenuButton>}
                  >
                    <MenuItem 
                      className="rc-menu__item"
                      >
                        <a onClick={() => exportDiagnostics()}>Download as .xls</a>
                    </MenuItem>
                  </Menu>
          </div>
            
      {/* <button onClick={() => exportDiagnostics()}>download</button> */}
        <ClickAwayListener onClickAway={handleBlur}>
        <div className="unit_detail_tab_events  _unit_detail_device_diagnostic_ " onKeyDown={handleKeyDown}>
            {/* <div className="indicates-label">Table auto refreshes every 10 seconds</div> */}
            {rows && (
                <CRXDataTable
                    id="unitdevice-auditlog"
                    actionComponent={() => { }}
                    getRowOnActionClick={() => { }}
                    toolBarButton={

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
                    className="unit_detail_tab_events_data_table "
                    onClearAll={clearAll}
                    getSelectedItems={(v: UnitEvents[]) => setSelectedItems(v)}
                    onResizeRow={resizeRowUserTab}
                    onHeadCellChange={onSetHeadCells}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={(page: any) => setPage(page)}
                    setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                    totalRecords={unitEventsTotal}
                    showCheckBoxesCol={false}
                    setSortOrder={(sort: any) => sortingOrder(sort)}
                    dragVisibility={false}
                    showCheckBoxes={false}
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
        </ClickAwayListener>
      </>
    )
}

export default UnitDeviceDiagnosticLogs
