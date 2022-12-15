import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import CategoriesTemplateActionMenu from './CategoriesTemplateActionMenu';
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import './categoriesList.scss'
import { RootState } from "../../../../Redux/rootReducer";
import { CRXButton, CRXDataTable} from "@cb/shared";
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
import { CRXToaster} from "@cb/shared";
import { getAllCategoriesFilter } from '../../../../Redux/Categories';
import Restricted from "../../../../ApplicationPermission/Restricted";
import { getAllCategoryForms } from "../../../../Redux/CategoryForms";
import { getAllRetentionPolicies, getAllUploadPolicies } from "../../../../Redux/RetentionPolicies";

type CategoriesTemplate = {
  id: number;
  name: string;
  retentionPolicyId: number;
  retentionPolicyName: string;
  uploadPolicyId: number;
  uploadPolicyName: string;
  audio: string;
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
    rowsParam: CategoriesTemplate[],
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
      label: `${t("Category_Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      width: "500",
      maxWidth: "600"
    },
    {
      label: `${t("Evidence_Retention_Policy")}`,
      id: "retentionPolicyName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      width: "400",
      maxWidth: "100"
    },
    {
      label: `${t("Upload_Policy")}`,
      id: "uploadPolicyName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      width: "400",
      maxWidth: "100"
    },
    {
      label: `${t("Audio")}`,
      id: "audio",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      width: "478",
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
          Audio: ""
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

  const getSelectedItemsUpdate = () => {
    setSelectedItems([]);
  }

  const getSuccessUpdate = () => {
    setSuccess(true);
  }

  const CategoriesAction = () => {
    dispatch(getAllCategoriesFilter(pageiGrid));
  }

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

  const onMessageShow = (isSuccess: boolean, message: string) => {
    retentionFormMessages({
      message: message,
      variant: isSuccess ? 'success' : 'error',
      duration: 7000
    });
  }

  return (
    <div className="CrxCategoriesTable switchLeftComponents">
      <CRXToaster ref={retentionMsgFormRef} />
      {
        rows && (
          <CRXDataTable
            id="CategoriesTemplateDataTable"
            actionComponent={<CategoriesTemplateActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              getRowData={CategoriesAction}
              getSelectedData={getSelectedItemsUpdate}
              getSuccess={getSuccessUpdate}
              onClickOpenModel={onClickOpenModel}
              onMessageShow={onMessageShow}
            />}
            toolBarButton={
              <>
                <Restricted moduleId={0}>

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
            showActionCol={true}
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
            offsetY={20}
            dragableHeaderPosition={207}
            topSpaceDrag={5}
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
