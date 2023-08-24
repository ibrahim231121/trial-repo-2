import React, {useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import CategoryFormsTemplateActionMenu from './CategoryFormsTemplateActionMenu';
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import './categoryFormsList.scss'
import { RootState } from "../../../../Redux/rootReducer";
import { CRXButton, CRXDataTable, CRXToaster } from "@cb/shared";
import { enterPathActionCreator } from '../../../../Redux/breadCrumbReducer';
import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  onClearAll,
  onSetHeadCellVisibility,
  onSaveHeadCellData,
  PageiGrid,
  GridFilter,
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { urlList, urlNames } from "../../../../utils/urlList";
import { useHistory } from "react-router-dom";
import { getAllCategyFormsFilter } from "../../../../Redux/CategoryForms";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";

type CategoryFormsTemplate = {
  id: number;
  name: string;
  description: string;
}

const CategoryFormsList: React.FC = () => {
  const { getModuleIds} = useContext(ApplicationPermissionContext);
  const retentionMsgFormRef = useRef<typeof CRXToaster>(null);
  const { t } = useTranslation<string>();
  const [rows, setRows] = React.useState<CategoryFormsTemplate[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<CategoryFormsTemplate[]>([]);
  const [selectedActionRow, setSelectedActionRow] = useState<CategoryFormsTemplate[]>();
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const history = useHistory();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Name");
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false);
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
  const dispatch = useDispatch();
  const isFirstRenderRef = useRef<boolean>(true);
  const [reformattedRows, setReformattedRows] = React.useState<CategoryFormsTemplate[]>([]);
  const filterCategoryForms: any = useSelector((state: RootState) => state.CategoryFormSlice.filterCategoryForms);

  useEffect(() => {
    if (paging)
      dispatch(getAllCategyFormsFilter(pageiGrid));
    setPaging(false)
  }, [pageiGrid])

  useEffect(() => {
    setPageiGrid({...pageiGrid, page:page, size:rowsPerPage, gridSort:{field: orderBy, dir: order}});  
    setPaging(true);
  },[page, rowsPerPage])

  useEffect(() => {
    setCategoryForms();
    isFirstRenderRef.current = false;
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "CategoryFormTemplateDataTable");
    dispatch(enterPathActionCreator({ val: "" }));
  }, []);
  
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
    rowsParam: CategoryFormsTemplate[],
    headCell: HeadCellProps[],
    colIdx: number
  ) => {
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={(valueObject) => onChange(valueObject, colIdx)} />
    );
  };

  const editCategoryForm = (categoryFormId : number) => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.categoryFormsEdit)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + categoryFormId);
  };

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: t("ID"),
      id: "id",
      align: "right",
      dataComponent: () => null,
      sort: true,
      searchFilter: false,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: "80",
      width: "100",
      maxWidth: "150",
    },
    {
      label: `${t("Category_Form_Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string, id: number) => {
        return  getModuleIds().includes(74) ? <div style={{ cursor: "pointer", color: "var(--color-c34400)" }} onClick={(e) => editCategoryForm(id)} className={"dataTableText txtStyle"}>{e} </div>: <div >{e}</div>
      },
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "666",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "665",
      attributeName: "Description",
      attributeType: "String",
      attributeOperator: "contains"
    }
  ]);

  const setCategoryForms = () => {
    let CategoryFormTemplateRows: CategoryFormsTemplate[] = [];

    if (filterCategoryForms?.data && filterCategoryForms?.data.length > 0) {
      CategoryFormTemplateRows = filterCategoryForms?.data.map((template: any) => {
        return {
          id: template.id,
          name: template.name,
          description: template.description
        }
      })
    }

    setRows(CategoryFormTemplateRows);
    setReformattedRows(CategoryFormTemplateRows)
  }

  React.useEffect(() => {
    setCategoryForms();
  }, [filterCategoryForms?.data]);

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllCategyFormsFilter(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

  const handleClickOpen = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.categoryFormsCreate)[0].url}`;
    history.push(path);
  };

  useEffect(() => {
    setPageiGrid({...pageiGrid, page:page, size:rowsPerPage, gridSort:{field: orderBy, dir: order}});  
    setPaging(true);
  },[page, rowsPerPage])

  const getFilteredCategoryFormsData = () => {
    pageiGrid.gridFilter.filters = []
    searchData.filter(x => x.value[0] !== '').forEach((item:any, index:number) => {
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
   
    if(page !== 0)
      setPage(0)
    else
      dispatch(getAllCategyFormsFilter(pageiGrid));
    
    setIsSearchable(false)
}
  
  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      getFilteredCategoryFormsData();
    }
  }
  
  const handleBlur = () => {
    if(isSearchable) {     
      getFilteredCategoryFormsData();
    }
  }
  
  const sortingOrder = (sort: any) => {
    setPageiGrid({...pageiGrid, gridSort:{field: sort.orderBy, dir:sort.order}})
    setOrder(sort.order)
    setOrderBy(sort.orderBy)
    setPaging(true)
  }

  useEffect(() => {
    if(searchData.length > 0){
      setIsSearchable(true)
    }
  }, [searchData]);

  useEffect(() => {
    if(selectedItems.length > 0)
      setSelectedActionRow(undefined)
  },[selectedItems])

  const updateSelectedItems = () => {
    getFilteredCategoryFormsData();
    setSelectedItems([]);
    
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className="category_tab_parent" onKeyDown={handleKeyDown}>
      <CRXToaster ref={retentionMsgFormRef} />
      {
        rows && (
          <CRXDataTable
            id="CategoryFormTemplateDataTable"
            actionComponent={<CategoryFormsTemplateActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              //pageiGrid={pageiGrid}
              toasterRef={retentionMsgFormRef}
              updateSelectedItems={updateSelectedItems}
            />}
            toolBarButton={
              <>
                <Restricted moduleId={73}>

                  <CRXButton color="primary" className="primary CategoriesBtn" onClick={handleClickOpen}>
                    {t("Create_Category_Forms")}
                  </CRXButton>
                </Restricted>
              </>
            }
            showTotalSelectedText={false}
            showToolbar={true}
            showCountText={false}
            columnVisibilityBar={false}
            showCustomizeIcon={false}
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
            showActionSearchHeaderCell={true}
            className="crxTableHeight categoryTab_datatable"
            onClearAll={clearAll}
            getSelectedItems={(v: CategoryFormsTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowConfigTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage={(pages: any) => setPage(pages)}
            setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
            totalRecords={filterCategoryForms?.totalCount}
            setSortOrder={(sort:any) => sortingOrder(sort)}
          />

        )
      }
    </div>
    </ClickAwayListener>
  );
};

export default CategoryFormsList;
