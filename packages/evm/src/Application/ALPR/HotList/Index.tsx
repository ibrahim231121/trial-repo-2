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
import HotListActionMenu from "./HotListActionMenu";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useStyles } from "./HotListCss";
import './Index.scss'
import { GetHotListData } from "../../../Redux/AlprHotListReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { ClickAwayListener } from "@material-ui/core";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { renderCheckMultiselect } from "../../Assets/AssetLister/AssetDataTable/AssetDataTableModel";

type HotListTemplate = {
  id: number,
  Name: string,
  description: string,
  sourceName: string,
  ruleExpressions: string,
  alertPriority: number,
  color: string,
  audio: string
}

const HotList = () => {
  const classes = useStyles();
  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(0);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<HotListTemplate[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<HotListTemplate[]>([]);
  const SourceOptions = (
    [{
      id: 1,
      label: "Source 1"
    },
    {
      id: 2,
      label: "Source 2"
    }]);
  const [rows, setRows] = React.useState<HotListTemplate[]>();
  
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage,
  });
  const hotListData: any = useSelector((state: RootState) => state.hotListReducer.HotList);
  const [paging, setPaging] = React.useState<boolean>();
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Name");
 
  useEffect(() => {
    dispatch(GetHotListData());
  }, [])

  useEffect(() => {
    let hotListDataTemp = hotListData.map((item: any) => {
      return {
        id: item.id,
        Name: item.Name,
        description: item.description,
        sourceName: SourceOptions.find((x: any) => x.id === item.sourceName)?.label === undefined ? 'No Source' : SourceOptions.find((x: any) => x.id === item.sourceName)?.label,
        ruleExpressions: item.ruleExpressions,
        color: item.color,
        alertPriority: item.alertPriority,
        audio: item.audio
      }
    })
    setRows(hotListDataTemp)
  }, [hotListData])

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


  useEffect(() => {
    if (searchData.length > 0) {
      setIsSearchable(true)
    }
    if (isSearchableOnChange)
      getFilteredHotListData()
  }, [searchData]);

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

  const searchText = (rowsParam: HotListTemplate[], headCell: HeadCellProps[], colIdx: number) => {
    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    }
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={onChange} />
    );
  };

  const audioIconDisplay = (audioValue: string) => {
    return audioValue !== null && audioValue !== "" ? <div><VolumeUpIcon/> </div> : <div></div>
  }

  const createTheme = (colorValue: string) => {
    return <div className={classes.colorPalette} style={{ background: colorValue }} />
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

  const multiSelectCheckbox = (rowParam: HotListTemplate[], headCells: HeadCellProps[], colIdx: number, initialRows: any) => {
    if (colIdx === 3) {
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
      minWidth: "200",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      attributeName: "Description",
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
      searchComponent: (rowParam: HotListTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
      minWidth: "230",
      attributeName: "sourceName",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Rule_Expression")}`,
      id: "ruleExpression",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "230",
      attributeName: "ruleExpression",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Alert_Priority")}`,
      id: "alertPriority",
      align: "center",
      dataComponent: (e: string) => textDisplay(e, "", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "130",
      attributeName: "alertPriority",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Color")}`,
      id: "color",
      align: "center",
      // dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      dataComponent: (e: string) => createTheme(e),
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      minWidth: "150",
      attributeName: "color",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Audio")}`,
      id: "audio",
      align: "center",
      // dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      dataComponent: (e: string) => audioIconDisplay(e),
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      minWidth: "150",
      attributeName: "audio",
      attributeType: "String",
      attributeOperator: "contains"
    },
  ]);

  const CreateHotListForm = () => {
    history.push(urlList.filter((item: any) => item.name === urlNames.HotListDetail)[0].url);
    RemoveSidePanelClass()
  }

  const getFilteredHotListData = () => {
    pageiGrid.gridFilter.filters = []
    searchData.filter(x => x.value[0] !== '').forEach((item: any, index: number) => {
      let x: GridFilter = {
        operator: headCells[item.colIdx].attributeOperator,
        field: headCells[item.colIdx].id,
        value: item.value.length > 1 ? item.value.join('@') : item.value[0],
        fieldType: headCells[item.colIdx].attributeType,
      }
      pageiGrid.gridFilter.filters?.push(x)
    })
    pageiGrid.page = 0
    pageiGrid.size = rowsPerPage

    if (page !== 0) {
      setPage(0)
    }
    else {
      dispatch(GetHotListData(pageiGrid));
    }
    setIsSearchable(false)
    setIsSearchableOnChange(false)
  }

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

  const handleBlur = () => {
    if (isSearchable) {
      getFilteredHotListData()
    }
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      getFilteredHotListData()
    }
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
      <div className="switchLeftComponents" onKeyDown={handleKeyDown}>
        <CRXToaster />
        {rows && (
          <CRXDataTable
            id="HotListTemplateDataTable"
            actionComponent={
              <HotListActionMenu  row={selectedActionRow} selectedItems={selectedItems} gridData={rows}/>
            }
            toolBarButton={
              <>
                <Restricted moduleId={0}>
                  <CRXButton id={"createHotList"} className="primary CategoriesBtn" onClick={CreateHotListForm} >
                    {t("Create_Hot_List")}
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
            className="crxTableHeight crxTableDataUi CategoriesTableTemplate"
            onClearAll={clearAll}
            getSelectedItems={(v: HotListTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowConfigTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage={(pages: any) => setPage(pages)}
            setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
            totalRecords={rows?.length}
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


export default HotList;
