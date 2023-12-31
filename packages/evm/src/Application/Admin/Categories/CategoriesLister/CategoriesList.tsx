import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import './categoriesList.scss'
import { RootState } from "../../../../Redux/rootReducer";
import { CRXButton, CRXDataTable } from "@cb/shared";
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
  GridFilter
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import { CRXToaster } from "@cb/shared";
import { getAllCategoriesFilter } from '../../../../Redux/Categories';
import { getAllRetentionPolicies, getAllUploadPolicies } from "../../../../Redux/RetentionPolicies";
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import { renderCheckMultiselect } from "../../../Assets/AssetLister/AssetDataTable/AssetDataTableModel";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CategoriesTemplateActionMenu from "./CategoriesTemplateActionMenu";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { urlList, urlNames } from "../../../../utils/urlList";
import { useHistory } from "react-router-dom";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { enterPathActionCreator } from "../../../../Redux/breadCrumbReducer";

type CategoriesTemplate = {
  id: number;
  name: string;
  retentionPolicyId: number;
  retentionPolicyName: string;
  uploadPolicyId: number;
  uploadPolicyName: string;
  audio: boolean;
  description: string;
  audioPrompt: string;
}

const CategoriesList: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const filterCategories: any = useSelector((state: RootState) => state.categoriesSlice.filterCategories);
  const retentionPoliciesList: any = useSelector((state: RootState) => state.retentionPoliciesSlice.getAllRetentionPolicies);
  const uploadPoliciesList: any = useSelector((state: RootState) => state.retentionPoliciesSlice.getAllUploadPolicies);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Name");
  const [rows, setRows] = React.useState<CategoriesTemplate[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<CategoriesTemplate[]>([]);
  const [selectedActionRow, setSelectedActionRow] = useState<CategoriesTemplate>();
  const { getModuleIds } = useContext(ApplicationPermissionContext);
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
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false);
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)
  const retentionMsgFormRef = useRef<typeof CRXToaster>(null);
  const isFirstRenderRef = useRef<boolean>(true);
  const [reformattedRows, setReformattedRows] = React.useState<any>([]);
  const [uploadPolicesOptions, setUploadPolicesOptions] = React.useState<any[]>([]);
  const [retentionPoliciesOptions, setRetentionPoliciesOptions] = React.useState<any[]>([]);

  useEffect(() => {
    if (paging)
      dispatch(getAllCategoriesFilter({
        pageiGrid: pageiGrid,
        search: "shallow"
      }));
    setPaging(false)
  }, [pageiGrid])


  useEffect(() => {
    dispatch(getAllRetentionPolicies());
    dispatch(getAllUploadPolicies());
    isFirstRenderRef.current = false;
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "CategoriesTemplateDataTable");
    dispatch(enterPathActionCreator({ val: "" }));
  }, []);

  useEffect(() => {
    setCategoriesData();
  }, [filterCategories?.data]);

  useEffect(() => {
    setData();
  }, [uploadPoliciesList, retentionPoliciesList]);

  useEffect(() => {
    if (searchData.length > 0) {
      setIsSearchable(true)
    }
    if (isSearchableOnChange)
      getFilteredCategoryData()
  }, [searchData]);

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage, gridSort: { field: orderBy, dir: order } });
    setPaging(true);
  }, [page, rowsPerPage]);

  const CreateCategories = () => {
    history.push(urlList.filter((item: any) => item.name === urlNames.createCategory)[0].url);
  }

  const setCategoriesData = () => {
    let CategoriesTemplateRows: CategoriesTemplate[] = [];
    if (filterCategories?.data && filterCategories?.data.length > 0) {
      CategoriesTemplateRows = filterCategories?.data.map((template: any) => {
        return {
          id: template.id,
          name: template.name,
          retentionPolicyId: template.policies.retentionPolicyId,
          retentionPolicyName: template.policies.retentionPolicyName,
          uploadPolicyId: template.policies.uploadPolicyId,
          uploadPolicyName: template.policies.uploadPolicyName,
          Audio: template.audioPrompt,
          hasAudio: template.hasAudio,
          description: template.description,
        }
      })
    }
    setRows(CategoriesTemplateRows);
    setReformattedRows({ ...reformattedRows, rows: CategoriesTemplateRows, uploadPolicies: uploadPolicesOptions, retentionPolcies: retentionPoliciesOptions });
  }

  const setUploadPolicies = () => {
    let uploadPoliciesRows: any[] = [];
    if (uploadPoliciesList?.data && uploadPoliciesList?.data.length > 0) {
      uploadPoliciesRows = uploadPoliciesList?.data?.map((template: any) => {
        return {
          id: template.id,
          name: template.name,
        }
      })
    }
    setUploadPolicesOptions(uploadPoliciesRows);
  }

  const setRetentionPolicies = () => {
    let retentionPoliciesRows: any[] = [];
    if (retentionPoliciesList?.data && retentionPoliciesList?.data.length > 0) {
      retentionPoliciesRows = retentionPoliciesList?.data?.map((template: any) => {
        return {
          id: template.id,
          name: template.name,
        }
      })
    }
    setRetentionPoliciesOptions(retentionPoliciesRows);
  }

  const setData = () => {
    setRetentionPolicies();
    setUploadPolicies();
    setCategoriesData();
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
    rowsParam: CategoriesTemplate[],
    headCell: HeadCellProps[],
    colIdx: number
  ) => {
    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    }
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={onChange} />
    );
  };

  const changeMultiselect = (
    val: renderCheckMultiselect[],
    colIdx: number
  ) => {
    onSelection(val, colIdx);
    headCells[colIdx].headerArray = val;
  };

  const searchAndNonSearchMultiDropDown = (
    rowsParam: CategoriesTemplate[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any,
    isSearchable: boolean
  ) => {
    if (colIdx === 3 && initialRows && initialRows.retentionPolcies && initialRows.retentionPolcies.length > 0) {
      let options: any = [];
      initialRows.retentionPolcies.map((x: any) => {
        options.push({ id: x.id, value: x.name });
      });
      options = options?.length > 0 ? options?.sort((a: any, b: any) => a.value > b.value ? 1 : -1,) : [];

      return (
        <CBXMultiCheckBoxDataFilter
          width={100}
          percentage={true}
          option={options}
          value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
          onChange={(value: any) => changeMultiselect(value, colIdx)}
          onSelectedClear={() => clearAll()}
          isCheckBox={true}
          multiple={true}
          isduplicate={true}
          selectAllLabel="All"
        />
      );
    }
    else if (colIdx === 4 && initialRows && initialRows.uploadPolicies && initialRows.uploadPolicies.length > 0) {
      let options: any = [];
      initialRows.uploadPolicies.map((x: any) => {
        options.push({ id: x.id, value: x.name });
      });
      options = options?.length > 0 ? options?.sort((a: any, b: any) => a.value > b.value ? 1 : -1,) : [];

      return (
        <CBXMultiCheckBoxDataFilter
          width={100}
          percentage={true}
          option={options}
          value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
          onChange={(value: any) => changeMultiselect(value, colIdx)}
          onSelectedClear={() => clearAll()}
          isCheckBox={true}
          multiple={true}
          isduplicate={true}
          selectAllLabel="All"
        />
      );
    }
  };

  const editCategolries = (categoryId: number) => {
    const CRXActiveBreadcrumb : any = document.querySelector(".CRXActiveBreadcrumb");
    CRXActiveBreadcrumb && (CRXActiveBreadcrumb.style.display = "block")
    const path = `${urlList.filter((item: any) => item.name === urlNames.categoryEdit)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + categoryId, t("Edit_Category"));
  };

  const NonField = () => {

  }

  const CategoryNameText = (e: string, id: number) => {
    if (getModuleIds().includes(54)) {
      return <div style={{ cursor: "pointer", color: "var(--color-c34400)" }} onClick={(e) => editCategolries(id)} className={"dataTableText txtStyle"}>{e}</div>
    } else {
      return <div className={"dataTableText txtStyle"}>{e}</div>
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
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: "80",
    },
    {
      label: `${t("Category_Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string, id: number) => CategoryNameText(e, id),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "390",
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
      minWidth: "529",
      attributeName: "Description",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Evidence_Retention_Policy")}`,
      id: "retentionPolicyName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: CategoriesTemplate[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, false),
      minWidth: "260",
      attributeName: "RetentionPolicyName",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Upload_Policy")}`,
      id: "uploadPolicyName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: CategoriesTemplate[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, false),
      minWidth: "260",
      attributeName: "UploadPolicyName", 
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Audio")}`,
      id: "hasAudio",
      align: "left",
      dataComponent: (e: boolean) => SpeakerIcon(e),
      sort: false,
      searchFilter: true,
      searchComponent: NonField,
      minWidth: "265",
    },
  ]);

  const SpeakerIcon = (e: any) => {
    return e ? <i className="fa-solid fa-volume"></i> : <></>
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllCategoriesFilter({
      pageiGrid: pageiGrid,
      search: "shallow"
    }));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

  const getFilteredCategoryData = () => {
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
    else
      dispatch(getAllCategoriesFilter({
        pageiGrid: pageiGrid,
        search: "shallow"
      }));

    setIsSearchable(false)
    setIsSearchableOnChange(false)
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      getFilteredCategoryData()
    }
  }

  const handleBlur = () => {
    if (isSearchable) {
      getFilteredCategoryData()
    }
  }

  const sortingOrder = (sort: any) => {
    setPageiGrid({ ...pageiGrid, gridSort: { field: sort.orderBy, dir: sort.order } })
    setOrder(sort.order)
    setOrderBy(sort.orderBy)
    setPaging(true)
  }

useEffect(() => {
  if(selectedItems.length > 0)
    setSelectedActionRow(undefined)
},[selectedItems])

  return (
   
    <ClickAwayListener onClickAway={handleBlur}>
      <div className="ExpandViewOverlay" onKeyDown={handleKeyDown}>
        <CRXToaster ref={retentionMsgFormRef} />
        {
          rows && (
            <CRXDataTable
              id="CategoriesTemplateDataTable"
              actionComponent={
                <CategoriesTemplateActionMenu
                  row={selectedActionRow}
                  selectedItems={selectedItems}
                />
              }
              toolBarButton={
                <>
                  <Restricted moduleId={56}>
                    <CRXButton color="primary" className="primary CategoriesBtn" onClick={CreateCategories}>
                      {t("Create_Category")}
                    </CRXButton>
                  </Restricted>
                </>
              }
              showTotalSelectedText={false}
              showToolbar={true}
              showCountText={false}
              columnVisibilityBar={true}
              showCustomizeIcon={false}
              getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
              dataRows={rows}
              headCells={headCells}
              orderParam={order}
              orderByParam={orderBy}
              dragVisibility={false}
              showCheckBoxesCol={false}
              showActionCol={true}
              searchHeader={true}
              allowDragableToList={false}
              showActionSearchHeaderCell={false}
              className="crxTableHeight crxTableDataUi CategoriesTableTemplate CategoriesTable_UI TableWithOutCheck"
              onClearAll={clearAll}
              getSelectedItems={(v: CategoriesTemplate[]) => setSelectedItems(v)}
              onResizeRow={resizeRowConfigTemp}
              onHeadCellChange={onSetHeadCells}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              page={page}
              rowsPerPage={rowsPerPage}
              setPage={(pages: any) => setPage(pages)}
              setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
              totalRecords={filterCategories?.totalCount}
              setSortOrder={(sort: any) => sortingOrder(sort)}
              //Please dont miss this block.
              offsetY={119}
              stickyToolbar={130}
              searchHeaderPosition={223}
              dragableHeaderPosition={188}
              overlay={true}
              //End here
              showExpandViewOption={true}
              initialRows={reformattedRows}
            />
          )
        }
      </div>
    </ClickAwayListener>
  );
};

export default CategoriesList;
