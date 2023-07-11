import React, { useContext, useEffect, useRef } from "react";
import {
  CRXDataTable,
  CRXToaster,
  CRXButton,
} from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";
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
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import Restricted from "../../../ApplicationPermission/Restricted";
import DataSourceActionMenu from "../HotListDataSource/DataSourceActionMenu";
import "./Index.scss";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { ClickAwayListener } from "@material-ui/core";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { renderCheckMultiselect } from "../../Assets/AssetLister/AssetDataTable/AssetDataTableModel";
import { HotListDataSourceTemplate } from "../../../utils/Api/models/HotListDataSourceModels";
import {  GetAlprDataSourceList } from "../../../Redux/AlprDataSourceReducer";
import {SourceTypeDropDown,ConnectionTypeDropDown} from '../GlobalDropdown'
import { alprToasterMessages } from "../AlprGlobal";
import AnchorDisplay from "../../../utils/AnchorDisplay";

const HotListDataSource = () => {
  const initalPagination:number=25;
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(initalPagination);
  const [page, setPage] = React.useState<number>(0);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<HotListDataSourceTemplate[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<HotListDataSourceTemplate[]>([]);
  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();
  
  const [rows, setRows] = React.useState<HotListDataSourceTemplate[]>([]);
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage,
  });
  const alprDataSource: any = useSelector((state: RootState) => state.alprDataSourceReducer.dataSource);
  const [paging, setPaging] = React.useState<boolean>();
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)
  const [clearDropDownFilterByIndex, setClearDropDownFilterByIndex] = React.useState<number>(0);
  const [orderDir, setOrderDir] = React.useState<Order>("asc");
  const [orderByField, setOrderByField] = React.useState<string>("Name");

  const dataSourceListerMsgFormRef = useRef<typeof CRXToaster>(null);

  const TOASTER_ERROR_MSG=t('Something_went_wrong.Please_again_later');
  const TOASTER_DURATION=7000;
  const SOURCETYPE_DROPDOWN_COLINDX=3;
  const CONNECTIONTYPE_DROPDOWN_COLINDX=5;

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

  useEffect(() => {
    dispatch(GetAlprDataSourceList(pageiGrid));
  }, [])

  useEffect(() => {
    let alprDataSourceCopy: HotListDataSourceTemplate[] = [];
    if (alprDataSource && alprDataSource.data !== undefined && alprDataSource.data !== null && alprDataSource.data.length > 0) {
      alprDataSourceCopy = alprDataSource.data.map((data: any) => {
        return {
          recId: data.recId,
          nameWithId: data.name + '_' +data.recId,
          name: data.name,
          sourceName: data.sourceName,
          userId: data.userId,
          password: data.password,
          confirmPassword: data.confirmPassword,
          connectionType: data.connectionType,
          schedulePeriod: data.schedulePeriod,
          locationPath: data.locationPath,
          port: data.port,
          lastRun: data.lastRun,
          status: data.status,
          statusDescription: data.statusDescription,
          sourceTypeName: data?.sourceType.sourceTypeName,
        }
      });
      setRows(alprDataSourceCopy)
    } else if(alprDataSource===undefined)
    {
      alprToasterMessages({
        message: TOASTER_ERROR_MSG,
        variant: 'error',
        duration: TOASTER_DURATION
      },dataSourceListerMsgFormRef);
      setRows([])
    }else{setRows([])}
  }, [alprDataSource])

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage, gridSort: { field: orderByField, dir: orderDir } });
    setPaging(true)

  }, [page, rowsPerPage]);

  useEffect(() => {
    if (paging) {
      dispatch(GetAlprDataSourceList(pageiGrid));
    }
    setPaging(false)
  }, [pageiGrid])


  const searchText = (rowsParam: HotListDataSourceTemplate[], headCell: HeadCellProps[], colIdx: number) => {
    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    }
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={onChange} />
    );
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
    setClearDropDownFilterByIndex(colIdx);
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName.toLocaleLowerCase() !== headCells[colIdx].id.toString().toLocaleLowerCase()));
    let headCellReset = onSelectedIndividualClear(headCells, colIdx);
    setHeadCells(headCellReset);
  }


  const changeMultiselect = (
    val: renderCheckMultiselect[],
    colIdx: number
  ) => {
    onSelection(val, colIdx);
    headCells[colIdx].headerArray = val;
    setIsSearchableOnChange(true)
  };
  const multiSelectCheckbox = (rowParam: HotListDataSourceTemplate[], headCells: HeadCellProps[], colIdx: number, initialRows: any) => {
    let dropDownOption: any = [];
    if (colIdx === SOURCETYPE_DROPDOWN_COLINDX) {
      SourceTypeDropDown.map((x: any) => {
        dropDownOption.push({ id: x.id, value: x.label });
      });
    }
    else if (colIdx === CONNECTIONTYPE_DROPDOWN_COLINDX) {
      ConnectionTypeDropDown.map((x: any) => {
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
  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: t("ID"),
      id: "recId",
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
      label: `${t("Name")}`,
      id: "nameWithId",
      align: "left",
      dataComponent: (e: string) => AnchorDisplay(e, 'linkColor', urlList.filter((item: any) => item.name === urlNames.editDataSourceTab)[0].url),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "190",
      attributeName: "name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Source_Name")}`,
      id: "sourceName",
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
      label: `${t("Source_Type")}`,
      id: "sourceTypeName",
      align: "center",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowParam: HotListDataSourceTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
      minWidth: "180",
      attributeName: "sourceTypeName",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Schedule_Period_(In_Hrs)")}`,
      id: "schedulePeriod",
      align: "right",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "220",
      attributeName: "schedulePeriod",
      attributeType: "number",
      attributeOperator: "contains"
    },
    {
      label: `${t("Connection_Type")}`,
      id: "connectionType",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowParam: HotListDataSourceTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
      minWidth: "180",
      attributeName: "connectionType",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Last_Run")}`,
      id: "lastRun",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "lastRun",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "150",
      attributeName: "status",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Status_Description")}`,
      id: "statusDesc",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "statusDesc",
      attributeType: "String",
      attributeOperator: "contains"
    }
  ]);

  const createDataSourceForm = () => {
    history.push(urlList.filter((item: any) => item.name === urlNames.createDataSourceTab)[0].url);
    RemoveSidePanelClass()
  }



  const getFilteredDataSourceData = () => {
    let searchDataClear = searchData;
    const SETINITIAL_PAGE=0;
    
    if (clearDropDownFilterByIndex === SOURCETYPE_DROPDOWN_COLINDX || clearDropDownFilterByIndex === CONNECTIONTYPE_DROPDOWN_COLINDX) {
      searchDataClear = searchDataClear.filter((e) => e.columnName.toLocaleLowerCase() !== headCells[clearDropDownFilterByIndex].id.toString().toLocaleLowerCase());
      setSearchData(searchDataClear);
    }
    pageiGrid.gridFilter.filters = []

    searchDataClear.filter(x => x.value[0] !== '').forEach((item: any, index: number) => {
      let x: GridFilter = {
        operator: headCells[item.colIdx].attributeOperator,
        field: headCells[item.colIdx].attributeName,
        value: item.value.length > 1 ? item.value.join('@') : item.value[0],
        fieldType: headCells[item.colIdx].attributeType,
      }
      pageiGrid.gridFilter.filters?.push(x)
    })
    pageiGrid.page = SETINITIAL_PAGE
    pageiGrid.size = rowsPerPage
    setClearDropDownFilterByIndex(SETINITIAL_PAGE);
    if (page !== SETINITIAL_PAGE) {
      setPage(SETINITIAL_PAGE)
    }
    else {
      dispatch(GetAlprDataSourceList(pageiGrid));
    }
    setIsSearchable(false)
    setIsSearchableOnChange(false)
  }
  const handleBlur = () => {
    if (isSearchable) {
      getFilteredDataSourceData()
    }
  }
  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };
  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(GetAlprDataSourceList(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };
  const sortingOrder = (sort: any) => {
    setPageiGrid({ ...pageiGrid, gridSort: { field: sort.orderBy, dir: sort.order } })
    setOrderDir(sort.order)
    setOrderByField(sort.orderBy)
    setPaging(true)
  }

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };
  useEffect(() => {
    if (searchData.length > 0) {
      setIsSearchable(true)
    }
    if (isSearchableOnChange) {

      getFilteredDataSourceData()
    }
  }, [searchData]);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      getFilteredDataSourceData()
    }
  }
  return (
    <ClickAwayListener onClickAway={handleBlur}>

      <div className="Alpr_DataSource_SwitchLeftComponents Alpr_DataSource_Index" onKeyDown={handleKeyDown}>
        <CRXToaster ref={dataSourceListerMsgFormRef}/>
        {rows && (
          <CRXDataTable
            id="DataSourceTemplateDataTable"
            actionComponent={

              <DataSourceActionMenu
                row={selectedActionRow}
                selectedItems={selectedItems}
                gridData={rows}
              />

            }
            toolBarButton={
              <>
                <Restricted moduleId={0}>
                  <CRXButton
                    id={"createHotListDataSource"}
                    className="primary Alpr_DataSource_Btn"
                    onClick={createDataSourceForm}
                  >
                    {t("Create_Data_Source")}
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
            orderParam={orderDir}
            orderByParam={orderByField}
            dragVisibility={false}
            showCheckBoxesCol={true}
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showActionSearchHeaderCell={false}
            className="crxTableHeight"
            onClearAll={clearAll}
            getSelectedItems={(v: HotListDataSourceTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowConfigTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage={(pages: any) => setPage(pages)}
            setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
            totalRecords={alprDataSource?.totalCount === undefined || alprDataSource?.totalCount == null ? 0 : alprDataSource?.totalCount}
            setSortOrder={(sort: any) => sortingOrder(sort)}

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
    </ClickAwayListener>

  );
}
export default HotListDataSource;