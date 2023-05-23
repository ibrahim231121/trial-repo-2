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
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useStyles } from "../HotList/HotListCss";

import { GetHotListData } from "../../../Redux/AlprHotListReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { ClickAwayListener } from "@material-ui/core";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { renderCheckMultiselect } from "../../Assets/AssetLister/AssetDataTable/AssetDataTableModel";
import { HotListDataSourceTemplate } from "../../../utils/Api/models/HotListDataSourceModels";
import { ConnectionTypeDropDown, GetAlprDataSourceList, SourceTypeDropDown } from "../../../Redux/AlprDataSourceReducer";


const HotListDataSource = () => {
  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(0);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<HotListDataSourceTemplate[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<HotListDataSourceTemplate[]>([]);
  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();

  const [rows, setRows] = React.useState<HotListDataSourceTemplate[]>();
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage,
  });
  const alprDataSource: any = useSelector((state: RootState) => state.alprDataSourceReducer.DataSource);
  const SourceOptions: any = useSelector((state: RootState) => state.alprDataSourceReducer.SourceType);
  const ConnectionTypeOptions: any = useSelector((state: RootState) => state.alprDataSourceReducer.ConnectionType);
  const [paging, setPaging] = React.useState<boolean>();
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)

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
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
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
    if (colIdx === 3 || colIdx === 5) {
      let status: any = [{ id: 0, value: t("No Source") }];
      SourceOptions.map((x: any) => {
        status.push({ id: x.id, value: x.label });
      });

      return (
        <div>
          <CBXMultiCheckBoxDataFilter
            width={100}
            percentage={true}
            option={status}
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

  }
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
      label: `${t("Name")}`,
      id: "Name",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "190",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Source_Name")}`,
      id: "SourceName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "SourceName",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Source_Type")}`,
      id: "SourceType",
      align: "center",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowParam: HotListDataSourceTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
      minWidth: "180",
      attributeName: "SourceType",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Schedule_Period_(In_Hrs)")}`,
      id: "SchedulePeriod",
      align: "right",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "220",
      attributeName: "SchedulePeriod",
      attributeType: "number",
      attributeOperator: "contains"
    },
    {
      label: `${t("Connection_Type")}`,
      id: "ConnectionType",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowParam: HotListDataSourceTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
      minWidth: "180",
      attributeName: "ConnectionType",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Last_Run")}`,
      id: "LastRun",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "LastRun",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Status")}`,
      id: "Status",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "150",
      attributeName: "Status",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Status_Description")}`,
      id: "StatusDescription",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "180",
      attributeName: "StatusDescription",
      attributeType: "String",
      attributeOperator: "contains"
    }
  ]);

  const CreateDataSourceForm = () => {
    history.push(urlList.filter((item: any) => item.name === urlNames.DataSourceTab)[0].url);
    RemoveSidePanelClass()
  }
  useEffect(() => {
    debugger;
    dispatch(GetAlprDataSourceList());
    dispatch(ConnectionTypeDropDown());
    dispatch(SourceTypeDropDown());
  }, [])

  useEffect(() => {
    debugger;
    let alprDataSourceCopy: HotListDataSourceTemplate[] = [];
    alprDataSourceCopy = alprDataSource.map((data: any) => {
      return {
        id: data.id,
        Name: data.Name,
        SourceName: data.SourceName,
        UserId: data.UserId,
        Password: data.Password,
        ConfirmPassword: data.ConfirmPassword,
        ConnectionType: ConnectionTypeOptions.find((x: any) => x.id === data.ConnectionType)?.label === undefined ? '' : ConnectionTypeOptions.find((x: any) => x.id === data.ConnectionType)?.label,
        SchedulePeriod: data.SchedulePeriod,
        LocationPath: data.LocationPath,
        Port: data.Port,
        LastRun: data.LastRun,
        Status: data.Status,
        StatusDescription: data.StatusDescription,
        SourceType: SourceOptions.find((x: any) => x.id === data.SourceType)?.label === undefined ? 'No Source' : SourceOptions.find((x: any) => x.id === data.SourceType)?.label
      }
    });
    setRows(alprDataSourceCopy)
  }, [alprDataSource,SourceOptions,ConnectionTypeOptions])

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage, gridSort: { field: 'name', dir: 'name' } });
    setPaging(true)

  }, [page, rowsPerPage]);
  useEffect(() => {
    if (paging) {
      dispatch(GetHotListData(pageiGrid));
    }
    setPaging(false)
  }, [pageiGrid])


  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Name");

  //   const getFilteredHotListData = () => {
  //     pageiGrid.gridFilter.filters = []
  //     searchData.filter(x => x.value[0] !== '').forEach((item: any, index: number) => {
  //       let x: GridFilter = {
  //         operator: headCells[item.colIdx].attributeOperator,
  //         //field: item.columnName.charAt(0).toUpperCase() + item.columnName.slice(1),
  //         field: headCells[item.colIdx].id,
  //         value: item.value.length > 1 ? item.value.join('@') : item.value[0],
  //         fieldType: headCells[item.colIdx].attributeType,
  //       }
  //       pageiGrid.gridFilter.filters?.push(x)
  //     })
  //     pageiGrid.page = 0
  //     pageiGrid.size = rowsPerPage

  //     if (page !== 0) {
  //       setPage(0)
  //     }
  //     else {
  //       dispatch(GetHotListData(pageiGrid));
  //     }
  //     setIsSearchable(false)
  //     setIsSearchableOnChange(false)
  //   }
  //   const handleBlur = () => {
  //     debugger;
  //     if (isSearchable) {
  //       getFilteredHotListData()
  //     }
  //   }
  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };
  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    // dispatch(getAllCategoriesFilter(pageiGrid));
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
    // if (isSearchableOnChange)
    //   getFilteredHotListData()
  }, [searchData]);

  const handleKeyDown = (event: any) => {
    debugger;
    if (event.key === 'Enter') {
      //   getFilteredHotListData()
    }
  }
  return (
    // <ClickAwayListener >

    <div className="crxManageUsers switchLeftComponents manageUsersIndex" onKeyDown={handleKeyDown}>
      <CRXToaster />
      {rows && (
        <CRXDataTable
          id="CategoriesTemplateDataTable"
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
                  id={"createHotList"}
                  className="primary CategoriesBtn"
                  onClick={CreateDataSourceForm}
                >
                  {t("Create Data Source")}
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
          // onClearAll={clearAll}
          getSelectedItems={(v: HotListDataSourceTemplate[]) => setSelectedItems(v)}
          onResizeRow={resizeRowConfigTemp}
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
    // </ClickAwayListener>

  );
}


export default HotListDataSource;
