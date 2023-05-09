import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CRXButton, CRXDataTable, CRXToaster, CRXSelectBox } from "@cb/shared";
import { HeadCellProps, PageiGrid, SearchObject, ValueString, onClearAll, onResizeRow, onSaveHeadCellData, onSetHeadCellVisibility, onSetSearchDataValue, onSetSingleHeadCellVisibility, onTextCompare, Order } from "../../../GlobalFunctions/globalDataTableFunctions";
import { RootState } from "../../../Redux/rootReducer";
import { Device, DeviceType, FilterUpdateVersion, UpdateVersion } from "../../../utils/Api/models/UnitModels";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { getAllUpdateVersionsPagedAsync } from "../../../Redux/UpdateVersionSlices";
import { ClickAwayListener } from "@material-ui/core";
import Restricted from "../../../ApplicationPermission/Restricted";
import { getAllFilteredUpdateVersionsPagedAsync } from "../../../Redux/FilteredUpdateVersionsSlice";
import { UpdateDeviceVersion } from "./CreateUpdateVersion";



const ORDER_BY = "asc" as Order;
const ORDER_BY_PARAM = "recordingStarted";

type historyProps = {
  primaryDeviceFilter: any;
  selectedItems: FilterUpdateVersion[],
  setSelectedItems : any,
  formData: UpdateDeviceVersion | undefined
};

const FilterUpdateVersionDataGrid: React.FC<historyProps> = ({primaryDeviceFilter,selectedItems,setSelectedItems,formData}) => {

  const retentionMsgFormRef = useRef<typeof CRXToaster>(null);
  const { t } = useTranslation<string>();
  const [title, setTitle] = React.useState<string>("");

  const [rows, setRows] = React.useState<FilterUpdateVersion[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [openModel, setOpenModel] = React.useState<boolean>(false);

  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage
  })
  const dispatch = useDispatch();
  const isFirstRenderRef = useRef<boolean>(true);
  const [reformattedRows, setReformattedRows] = React.useState<FilterUpdateVersion[]>([]);
  const filterUpdateVersions: any = useSelector((state: RootState) => state.filteredUpdateVersionsSlice.filteredUpdateVersionsPaged);


  // File upload



  useEffect(() => {
    if (paging)
      setUpdateVersions()
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

  const retentionFormMessages = (obj: any) => {
    retentionMsgFormRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  }
  const onChange = (valuesObject: ValueString[], colIdx: number) => {
    headCells[colIdx].headerArray = valuesObject;
    onSelection(valuesObject, colIdx);
  }

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
    rowsParam: FilterUpdateVersion[],
    headCell: HeadCellProps[],
    colIdx: number
  ) => {
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={(valueObject) => onChange(valueObject, colIdx)} />
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
      minWidth: "80",
      width: "",
      maxWidth: "100",
    },
    {
      label: `${t("Unit Id")}`,
      id: "unitName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Version Number")}`,
      id: "version",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Serial Number")}`,
      id: "serialNumber",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Station")}`,
      id: "station",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Last Checked In")}`,
      id: "lastCheckedIn",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Target Version")}`,
      id: "targetVersion",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Log Output")}`,
      id: "logOutput",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    }
  ]);

  const setUpdateVersions = () => {
    let UpdateVersionRows: FilterUpdateVersion[] = [];
    if (filterUpdateVersions?.data && filterUpdateVersions?.data.length > 0) {
      UpdateVersionRows = filterUpdateVersions?.data.map((x: FilterUpdateVersion) => {
        return {
          id: x.id,
          version: x.version,
          unitId: x.unitId,
          unitName: x.unitName,
          serialNumber: x.serialNumber,
          station: x.station,
          stationId: x.stationId,
          lastCheckedIn: x.lastCheckedIn,
          status: x.status,
          targetVersion: x.targetVersion,
          logOutput: x.logOutput
        }
      })
      if(formData)
      {
        let selectedDevices = UpdateVersionRows.filter(x => formData.devicesId?.includes(x.id ?? 0));
        setSelectedItems(selectedDevices)
      }
    }
    setRows(UpdateVersionRows);
    setReformattedRows(UpdateVersionRows)
  }

  const dataArrayBuilder = () => {
    let dataRows: FilterUpdateVersion[] = reformattedRows;
    searchData.forEach((el: SearchObject) => {
      dataRows = onTextCompare(dataRows, headCells, el);
    });
    setRows(dataRows);
  };

  React.useEffect(() => {
    setUpdateVersions();
  }, [filterUpdateVersions?.data]);

  React.useEffect(() => {
    if(primaryDeviceFilter.stationId >0 && primaryDeviceFilter.deviceTypeId >0){
      let obj ={
          pageiFilter: pageiGrid,
          primaryDeviceFilter: primaryDeviceFilter
      }
      setSelectedItems([]);
      dispatch(getAllFilteredUpdateVersionsPagedAsync(obj));
    }
    else{
      setRows([]);
      setReformattedRows([]);
      setSelectedItems([]);;
    }
  }, [primaryDeviceFilter])

  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);

  const getSelectedItemsUpdate = () => {
    setSelectedItems([]);
  }

  const getSuccessUpdate = () => {
    setSuccess(true);
  }

  const UpdateVersionsAction = () => {
    let obj ={
      pageiFilter: pageiGrid,
      primaryDeviceFilter: primaryDeviceFilter
    }
    dispatch(getAllFilteredUpdateVersionsPagedAsync(obj));
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    let obj ={
      pageiFilter: pageiGrid,
      primaryDeviceFilter: primaryDeviceFilter
    }
    dispatch(getAllFilteredUpdateVersionsPagedAsync(obj));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

  const handleKeyDown = (event: any) => {
    // if (event.key === 'Enter') {
    //   getFilteredCategoryData()
    // }
  }

  const handleBlur = () => {
    // if(isSearchable) {     
    //   getFilteredCategoryData()
    // }
  }


  return (
    <>
      <ClickAwayListener onClickAway={handleBlur}>
        <div  onKeyDown={handleKeyDown}>
          <CRXToaster ref={retentionMsgFormRef} />
          {
            rows && (
              <CRXDataTable
                id="CRXUpdateVersion"
                toolBarButton={
                  <>
                  
                  </>
                }
                dataRows={rows}
                headCells={headCells}
                orderParam={ORDER_BY}
                orderByParam={ORDER_BY_PARAM}
                showToolbar={true}
                showCountText={false}
                columnVisibilityBar={true}
                dragVisibility={false}
                showCheckBoxesCol={true}
                showActionCol={false}
                searchHeader={true}
                allowDragableToList={false}
                showTotalSelectedText={false}
                showActionSearchHeaderCell={true}
                showCustomizeIcon={true}
                className="crxTableHeight crxTableDataUi RetentionPoliciesTableTemplate RetentionPoliciesTable_UI"
                onClearAll={clearAll}
                getSelectedItems={(v: FilterUpdateVersion[]) => setSelectedItems(v)}
                onResizeRow={resizeRowConfigTemp}
                onHeadCellChange={onSetHeadCells}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                page={page}
                rowsPerPage={rowsPerPage}
                setPage={(pages: any) => setPage(pages)}
                setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
                totalRecords={filterUpdateVersions?.totalCount}
                //Please dont miss this block.
                offsetY={62}
                headerPositionInit={210}
                topSpaceDrag={98}
                
              //End here
              />

            )
          }
        </div>
      </ClickAwayListener>


    </>
  );
};

export default FilterUpdateVersionDataGrid;
