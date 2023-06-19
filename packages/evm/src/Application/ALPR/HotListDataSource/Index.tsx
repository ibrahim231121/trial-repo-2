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
import { ConnectionTypeDropDown, GetAlprDataSourceList, SourceTypeDropDown } from "../../../Redux/AlprDataSourceReducer";


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
  const alprDataSource: any = useSelector((state: RootState) => state.alprDataSourceReducer.DataSource);
  const SourceOptions =
    [{
      id: 1,
      label: "Manual"
    },
    {
      id: 2,
      label: "CSV"
    },
    {
      id: 3,
      label: "XML"
    }
    ];
  const ConnectionTypeOptions =
    [{
      id: 'FTP',
      label: "FTP"
    },
    {
      id: 'Local',
      label: "Local"
    },
    {
      id: 'UNC',
      label: "UNC"
    }
    ];
  const [paging, setPaging] = React.useState<boolean>();
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)
  const [clearFlag, setClearFlag] = React.useState<number>(0);
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
    dispatch(ConnectionTypeDropDown());
    dispatch(SourceTypeDropDown());
  }, [])


  useEffect(() => {
    let alprDataSourceCopy: HotListDataSourceTemplate[] = [];
    if (alprDataSource && alprDataSource.data !== undefined && alprDataSource.data !== null && alprDataSource.data.length > 0) {
      alprDataSourceCopy = alprDataSource.data.map((data: any) => {
        return {
          sysSerial: data.sysSerial,
          name: data.name,
          sourceName: data.sourceName,
          userId: data.userId,
          password: data.password,
          confirmPassword: data.confirmPassword,
          // connectionType: ConnectionTypeOptions.find((x: any) => x.id === data.ConnectionType)?.label === undefined ? '' : ConnectionTypeOptions.find((x: any) => x.id === data.ConnectionType)?.label,
          connectionType: data.connectionType,
          schedulePeriod: data.schedulePeriod,
          locationPath: data.locationPath,
          port: data.port,
          lastRun: data.lastRun,
          status: data.status,
          statusDescription: data.statusDescription,
          // sourceTypeId: SourceOptions.find((x: any) => x.id === data.sourceTypeId)?.label === undefined ? 'No Source' : SourceOptions.find((x: any) => x.id === data.sourceTypeId)?.label
          sourceTypeName: data.sourceTypeName,
        }
      });
      setRows(alprDataSourceCopy)
    } else {
      setRows([])
    }
  }, [alprDataSource])

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage, gridSort: { field: 'name', dir: 'asc' } });
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
    setClearFlag(colIdx);
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
    let dropDownOption: any = []
    let checkboxFlag: boolean = false;
    if (colIdx === 3) {
      SourceOptions.map((x: any) => {
        dropDownOption.push({ id: x.id, value: x.label });
      });
    }
    else if (colIdx === 5) {
      ConnectionTypeOptions.map((x: any) => {
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
      id: "sysSerial",
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
      id: "name",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
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
      attributeName: "SourceTypeName",
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

  const CreateDataSourceForm = () => {
    history.push(urlList.filter((item: any) => item.name === urlNames.DataSourceTab)[0].url);
    RemoveSidePanelClass()
  }


  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Name");

  const getFilteredDataSourceData = () => {
    let searchDataClear = searchData;
    if (clearFlag === 3 || clearFlag === 5) {
      searchDataClear = searchDataClear.filter((e) => e.columnName.toLocaleLowerCase() !== headCells[clearFlag].id.toString().toLocaleLowerCase());
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
    pageiGrid.page = 0
    pageiGrid.size = rowsPerPage
    setClearFlag(0);
    if (page !== 0) {
      setPage(0)
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
    setOrder(sort.order)
    setOrderBy(sort.orderBy)
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

      <div className="switchLeftComponents manageUsersIndex" onKeyDown={handleKeyDown}>
        <CRXToaster />
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
                    className="primary DataSourceBtn"
                    onClick={CreateDataSourceForm}
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
            orderParam={order}
            orderByParam={orderBy}
            dragVisibility={false}
            showCheckBoxesCol={true}
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showActionSearchHeaderCell={false}
            className="crxTableHeight crxTableDataUi"
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
