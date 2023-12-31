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
import { GetAllHotListData } from "../../../Redux/AlprHotListReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { ClickAwayListener } from "@material-ui/core";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { renderCheckMultiselect } from "../../Assets/AssetLister/AssetDataTable/AssetDataTableModel";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { GetAlprDataSourceList } from "../../../Redux/AlprDataSourceReducer";
import { HotListTemplate } from "../../../utils/Api/models/HotListModels";
import AnchorDisplay from "../../../utils/AnchorDisplay";
import { getToken } from "../../../Login/API/auth";
import jwt_decode from "jwt-decode";
import NumberSearch from "../../../GlobalComponents/DataTableSearch/NumberSearch";
import { AlprGlobalConstants, gridAlignment, nullValidationHandling } from "../AlprGlobal";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";

const HotList = () => {
  const classes = useStyles();
  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = React.useState<number>(AlprGlobalConstants.DEFAULT_GRID_PAGE_SIZE);
  const [page, setPage] = React.useState<number>(AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<HotListTemplate[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<HotListTemplate[]>([]);

  const [, setSateUpdate] = React.useState<boolean>();

  const paging = React.useRef<boolean>(false);
  const isSearchable = React.useRef<boolean>(false);
  const isSearchableOnChange = React.useRef<boolean>(false);
  const [rows, setRows] = React.useState<HotListTemplate[]>();
  const [reformattedRows, setReformattedRows] = React.useState<any>();

  const [order, setOrder] = React.useState<any>({
    order: 'asc',
    orderBy: 'Name'
  });


  const hotListData: any = useSelector((state: RootState) => state.hotListReducer.HotList);
  const hotListDatasourceData: any = useSelector((state: RootState)=> state.alprDataSourceReducer.dataSource);

  const SOURCE_COLID:number = 3;

  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage,
    gridSort:{
      field: order.orderBy,
       dir: order.order
      }
  });

  useEffect(() => {
    dispatch(GetAllHotListData(pageiGrid));

    var sourcesPageiGrid = {
      gridFilter: {
        logic: "and",
        filters: []
      },
      page: AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE,
      size: AlprGlobalConstants.DROPDOWN_PAGE_SIZE
    }

    dispatch(GetAlprDataSourceList(sourcesPageiGrid))
    dispatch(enterPathActionCreator({ val: `` }));
  }, [])

  useEffect(() => {
    if(hotListData && hotListData.data){
      let hotListDataTemp = hotListData.data.map((item: any) => {
      return {
        id: item.recId,
        nameWithId: item.name + "_" + item.recId,
        Name: item.name,
        description: item.description,
        sourceName: item.sourceName,
        rulesExpression: item.rulesExpression,
        color: item.color,
        alertPriority: item.alertPriority,
        audio: item.audio
      }
    });
    setRows(hotListDataTemp);
    setReformattedRows({...reformattedRows, rowsDataItems: hotListDataTemp});
    }
    
  }, [hotListData.data])
  useEffect(()=>{
    if(hotListDatasourceData && hotListDatasourceData.data){
      let sources: any = [];
      hotListDatasourceData.data.map((x: any) => {
        sources.push({ id: x.sysSerial, value: x.sourceName });
        });

        setReformattedRows({...reformattedRows, sources: sources});
    }
    
  },[hotListDatasourceData.data]);
  
  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage });
    paging.current = true;
    setSateUpdate(prevState => !prevState)
  }, [page, rowsPerPage]);

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, gridSort:{ field: order.orderBy, dir: order.order } });
    paging.current = true;
    setSateUpdate(prevState => !prevState)
  }, [order]);

  useEffect(() => {
    if (paging.current) {
      dispatch(GetAllHotListData(pageiGrid));
    }
    paging.current = false;
    setSateUpdate(prevState => !prevState)
  }, [pageiGrid])


  useEffect(() => {
    if (searchData.length > 0) {
      isSearchable.current = true
      setSateUpdate(prevState=>!prevState)
    }
    if (isSearchableOnChange.current)
      getFilteredHotListData()
  }, [searchData]);

  const userIdPreset = () =>{
    var token = getToken();
    if (token) {
        var accessTokenDecode: any = jwt_decode(token);
        return accessTokenDecode.LoginId
    }
    else
     return ""
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

  const searchNumber = (
    rowsParam: HotListTemplate[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    };

    return (
      <NumberSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
    );
  };
  
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
    return audioValue !== null && audioValue !== "" ? <div><VolumeUpIcon /> </div> : <div></div>
  }

  const colorDisplay = (colorValue: string) => {
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
    isSearchableOnChange.current=true;
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
    let headCellReset = onSelectedIndividualClear(headCells, colIdx);
    setHeadCells(headCellReset);

    setSateUpdate(prevState=>!prevState)
  }

  const changeMultiselect = (
    val: renderCheckMultiselect[],
    colIdx: number
  ) => {
    onSelection(val, colIdx);
    headCells[colIdx].headerArray = val;
    isSearchableOnChange.current=true;
    setSateUpdate(prevState=>!prevState);
  };

  const multiSelectCheckbox = (rowParam: HotListTemplate[], headCells: HeadCellProps[], colIdx: number, initialRows: any) => {
    if (colIdx === SOURCE_COLID && initialRows && initialRows.sources) {      

      return (
        <div>
          <CBXMultiCheckBoxDataFilter
            width={100}
            percentage={true}
            option={initialRows.sources}
            defaultValue={nullValidationHandling(headCells[colIdx].headerObject) ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
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
      align: gridAlignment("number"),
      dataComponent: () => null,
      sort: false,
      searchFilter: false,
      searchComponent: searchText,
      keyCol: true,
      visible: false,
      minWidth: "150",
    },
    {
      label: t("Name"),
      id: "nameWithId",
      align: gridAlignment("string"),
      dataComponent: (e: string) => AnchorDisplay(e, 'linkColor', urlList.filter((item: any) => item.name === urlNames.HotListDetail)[0].url),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "200",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains",
      visible: true
    },
    {
      label: t("Description"),
      id: "description",
      align: gridAlignment("string"),
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      attributeName: "Description",
      attributeType: "String",
      attributeOperator: "contains",
      visible: true
    },
    {
      label: t("Source_Name"),
      id: "sourceName",
      align: gridAlignment("string"),
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowParam: HotListTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
      minWidth: "230",
      attributeName: "SourceName",
      attributeType: "List",
      attributeOperator: "contains",
      visible: true
    },
    {
      label: t("Rule_Expression"),
      id: "rulesExpression",
      align: gridAlignment("string"),
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "230",
      attributeName: "RulesExpression",
      attributeType: "String",
      attributeOperator: "contains",
      visible: true
    },
    {
      label: t("Alert_Priority"),
      id: "alertPriority",
      align: gridAlignment("number"),
      dataComponent: (e: string) => textDisplay(e, "", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchNumber,
      minWidth: "130",
      attributeName: "AlertPriority",
      attributeType: "number",
      attributeOperator: "eq",
      visible: true
    },
    {
      label: t("Color"),
      id: "color",
      align: gridAlignment("icon"),
      dataComponent: (e: string) => colorDisplay(e),
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      minWidth: "150",
      attributeName: "Color",
      attributeType: "String",
      attributeOperator: "contains",
      visible: true
    },
    {
      label: t("Audio"),
      id: "audio",
      align: gridAlignment("icon"),
      dataComponent: (e: string) => audioIconDisplay(e),
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      minWidth: "150",
      attributeName: "Audio",
      attributeType: "String",
      attributeOperator: "contains",
      visible: true
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
        field: headCells[item.colIdx].attributeName,
        value: item.value.length > 1 ? item.value.join('@') : item.value[0],
        fieldType: headCells[item.colIdx].attributeType,
      }
      pageiGrid.gridFilter.filters?.push(x)
    })
    pageiGrid.page = AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE;
    pageiGrid.size = rowsPerPage;

    if (page !== 0) {
      setPage(0)
    }
    else {
      dispatch(GetAllHotListData(pageiGrid));
    }
    isSearchable.current = false
    isSearchableOnChange.current=false;
    setSateUpdate(prevState=>!prevState)
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    paging.current = true
    setPageiGrid(
      {
        ...pageiGrid,
        gridFilter:{
          ...pageiGrid.gridFilter,
          filters:[]
        }
      }
    )

    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const sortingOrder = (sort: any) => {
    setPageiGrid({ ...pageiGrid, gridSort: { field: sort.orderBy, dir: sort.order } })
    setOrder({ ...order, order: sort.order })
    setOrder({ ...order, orderBy: sort.orderBy })
    paging.current = true;
    setSateUpdate(prevState => !prevState)
  }

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

  const handleBlur = () => {
    if (isSearchable.current) {
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
      <div className="Alpr_Hotlist_switchLeftComponents" onKeyDown={handleKeyDown}>
        {rows && (
          <CRXDataTable
            id="HotListTemplateDataTable"
            actionComponent={
              <HotListActionMenu row={selectedActionRow} selectedItems={selectedItems} gridData={rows} pageiGrid={pageiGrid} />
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
            orderParam={order.order}
            orderByParam={order.orderBy}
            dragVisibility={false}
            showCheckBoxesCol={true}
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showActionSearchHeaderCell={false}
            className="crxTableHeight crxTableDataUi hotlistDataTable"
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
            totalRecords={hotListData.totalCount}
            setSortOrder={(sort: any) => setOrder(sort)}

            //Please dont miss this block.
            offsetY={119}
            stickyToolbar={130}
            searchHeaderPosition={224}
            dragableHeaderPosition={188}
            //End here

            showExpandViewOption={true}
            initialRows={reformattedRows}
          />
        )}

      </div>
    </ClickAwayListener>

  );
}


export default HotList;
