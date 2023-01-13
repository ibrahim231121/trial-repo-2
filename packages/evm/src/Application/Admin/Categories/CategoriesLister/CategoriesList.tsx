import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import './categoriesList.scss'
import { RootState } from "../../../../Redux/rootReducer";
import { CRXButton, CRXDataTable, CBXMultiSelectForDatatable } from "@cb/shared";
import { enterPathActionCreator } from '../../../../Redux/breadCrumbReducer';
import CategoriesDetail from "../CategoriesDetail/CategoriesDetail";
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
  onTextCompare
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import { CRXToaster } from "@cb/shared";
import { getAllCategoriesFilter } from '../../../../Redux/Categories';
import Restricted from "../../../../ApplicationPermission/Restricted";
import { getAllCategoryForms } from "../../../../Redux/CategoryForms";
import { getAllRetentionPolicies, getAllUploadPolicies } from "../../../../Redux/RetentionPolicies";
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import { renderCheckMultiselect } from "../../../Assets/AssetLister/AssetDataTable/AssetDataTableModel";

type CategoriesTemplate = {
  id: number;
  name: string;
  retentionPolicyId: number;
  retentionPolicyName: string;
  uploadPolicyId: number;
  uploadPolicyName: string;
  audio: string;
  description: string;
}

const ORDER_BY = "asc" as Order;
const ORDER_BY_PARAM = "recordingStarted";

const CategoriesList: React.FC = () => {
  const retentionMsgFormRef = useRef<typeof CRXToaster>(null);
  const { t } = useTranslation<string>();
  const [id, setId] = React.useState<number>(0);
  const [title, setTitle] = React.useState<string>("");
  const [rows, setRows] = React.useState<CategoriesTemplate[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<CategoriesTemplate[]>([]);
  const [selectedActionRow, setSelectedActionRow] = useState<CategoriesTemplate[]>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const { getModuleIds, moduleIds } = useContext(ApplicationPermissionContext);
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
  const [reformattedRows, setReformattedRows] = React.useState<CategoriesTemplate[]>([]);
  const filterCategories: any = useSelector((state: RootState) => state.categoriesSlice.filterCategories);

  useEffect(() => {
    if (paging)
      setCategoriesData()
    setPaging(false)
  }, [pageiGrid])

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage });
    setPaging(true)
  }, [page, rowsPerPage])

  useEffect(() => {
    setCategoriesData();
    isFirstRenderRef.current = false;
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "CategoriesTemplateDataTable");
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
    rowsParam: CategoriesTemplate[],
    headCell: HeadCellProps[],
    colIdx: number
  ) => {
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={(valueObject) => onChange(valueObject, colIdx)} />
    );
  };

  const openEditForm = (categoryId : number) => {
    if (getModuleIds().includes(54)) {
      onClickOpenModel(true, Number(categoryId), t("Edit_Category"))
    }
  }

  const changeMultiselect = (
    e: React.SyntheticEvent,
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
    if (initialRows) {
      let options = rowsParam.map((row: any, _: any) => {
        let option: any = {};
        option["value"] = row[headCells[colIdx].id];
        return option;
      });

      options = options?.length > 0 ? options.sort((a, b) => (a.value > b.value) ? 1 : -1): options;
      
      // For those properties which contains an array
      if (
        headCells[colIdx].id.toString() === "categories" ||
        headCells[colIdx].id.toString() === "recordedBy"
      ) {
        let moreOptions: any = [];

        reformattedRows.forEach((row: any, _: any) => {
          let x = headCells[colIdx].id;
          row[x]?.forEach((element: any) => {
            let moreOption: any = {};
            moreOption["value"] = element;
            moreOptions.push(moreOption);
          });
        });

        
        options = moreOptions;
      }
      

      return (
        <CBXMultiSelectForDatatable
          width={220}
          option={options}
          value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
          onChange={(e: any, value: any) => changeMultiselect(e, value, colIdx)}
          onSelectedClear={() => clearAll()}
          isCheckBox={false}
          isduplicate={true}
        />
      );
    }
  };

  const NonField = () =>{
    
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
      width: "",
      maxWidth: "100",
    },
    {
      label: `${t("Category_Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string, id: number) => {
        return <div style={{ cursor: "pointer" }} onClick={(e) => openEditForm(id)} className={"dataTableText "}>{e}</div>
      },
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      width: "500",
      maxWidth: "600"
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      maxWidth: "600"
    },
    {
      label: `${t("Evidence_Retention_Policy")}`,
      id: "retentionPolicyName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: (
        rowData: CategoriesTemplate[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, reformattedRows, false),
      minWidth: "400",
      maxWidth: "400"
    },
    {
      label: `${t("Upload_Policy")}`,
      id: "uploadPolicyName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: (
        rowData: CategoriesTemplate[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, reformattedRows, false),
      minWidth: "400",
      maxWidth: "400"
    },
    {
      label: `${t("Audio")}`,
      id: "audio",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: NonField,
      minWidth: "400",
      maxWidth: "500"
    },

  ]);

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
          Audio: "",
          description: template.description,
        }
      })
    }

    setRows(CategoriesTemplateRows);
    setReformattedRows(CategoriesTemplateRows)
  }

  const dataArrayBuilder = () => {
    let dataRows: CategoriesTemplate[] = reformattedRows;
    searchData.forEach((el: SearchObject) => {
      dataRows = onTextCompare(dataRows, headCells, el);
    });
    setRows(dataRows);
  };

  React.useEffect(() => {
    setCategoriesData();
  }, [filterCategories?.data]);

  React.useEffect(() => {
    dispatch(getAllCategoriesFilter(pageiGrid));
    dispatch(getAllRetentionPolicies());
    dispatch(getAllUploadPolicies());
    dispatch(getAllCategoryForms());
  }, [])

  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllCategoriesFilter(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

  const onClickOpenModel = (modelOpen: boolean, id: number, title: string) => {
    setId(id);
    setTitle(title);
    setOpenModel(modelOpen);
  }

  const updateOpenModel = (modelOpen: boolean) => {
    setOpenModel(modelOpen);
    dispatch(getAllCategoriesFilter(pageiGrid))
  }

  return (
    <div className="switchLeftComponents">
      <CRXToaster ref={retentionMsgFormRef} />
      {
        rows && (
          <CRXDataTable
            id="CategoriesTemplateDataTable"
            toolBarButton={
              <>
                <Restricted moduleId={56}>

                  <CRXButton className="CategoriesBtn" onClick={() => { onClickOpenModel(true, 0, t("Create_Category")) }}>
                    {t("Create_Category")}
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
            orderParam={ORDER_BY}
            orderByParam={ORDER_BY_PARAM}
            dragVisibility={false}
            showCheckBoxesCol={false}
            showActionCol={false}
            searchHeader={true}
            allowDragableToList={false}
            showActionSearchHeaderCell={true}
            className="crxTableHeight crxTableDataUi CategoriesTableTemplate CategoriesTable_UI"
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
             //Please dont miss this block.
            offsetY={-27}
            topSpaceDrag = {5}
            searchHeaderPosition={222}
            dragableHeaderPosition={187}
            stickyToolbar={133}
            //End here
          />

        )
      }
      {
        openModel &&
        (<CategoriesDetail id={id} title={title} pageiGrid={pageiGrid} openModel={updateOpenModel} />)
      }
    </div>
  );
};

export default CategoriesList;
