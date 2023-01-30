import React, { FC, useEffect, useState } from "react";
import { CRXModalDialog, CRXButton, CRXConfirmDialog, CRXAlert, CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { useTranslation } from "react-i18next";
import './fieldLister.scss';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/rootReducer";
import { getAllFormFieldsFilter } from "../../../../Redux/FormFields";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { GridFilter, HeadCellProps, onClearAll, onResizeRow, onSetSearchDataValue, onSetSingleHeadCellVisibility, Order, PageiGrid, SearchObject, ValueString } from "../../../../GlobalFunctions/globalDataTableFunctions";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import User from "../../User";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import { CRXDataTable } from "@cb/shared";
import { FormFieldsTemplate } from "../TypeConstant/types";
import { controlTypes } from "../TypeConstant/constants";

type FieldListerModel = {
  categoryFormId: number;
  title: string;
  pageiGrids: PageiGrid;
  selectedFields: FormFieldsTemplate[];
  setSelectedFields: React.Dispatch<React.SetStateAction<FormFieldsTemplate[]>>;
  openModel: React.Dispatch<React.SetStateAction<any>>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

interface renderCheckMultiselect {
  value: string,
  id: string,
}

const FieldLister: FC<FieldListerModel> = ({ categoryFormId, title, pageiGrids, selectedFields, setSelectedFields, openModel, setFieldValue }) => {
  const [disable, setDisable] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState<boolean>(false)
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("UserName");
  const [selectedItems, setSelectedItems] = React.useState<FormFieldsTemplate[]>([]);
  const [rows, setRows] = React.useState<FormFieldsTemplate[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<any>([]);
  const [id, setId] = useState<number>(categoryFormId);
  const filterFormFields: any = useSelector((state: RootState) => state.FormFieldsSlice.filterFormFields);
  const formFieldsList: any = useSelector((state: RootState) => state.FormFieldsSlice.getAllFormFields);
  const [openModal, setOpenModal] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<boolean>(false);
  const [responseError, setResponseError] = React.useState<string>('');
  const { t } = useTranslation<string>();
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
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
  const setFormFields = () => {
    let FormFieldsTemplateRows: any[] = [];
    if (filterFormFields?.data?.length > 0) {
      FormFieldsTemplateRows = filterFormFields?.data?.map((template: any) => {
        return {
          id: template?.id,
          name: template?.name,
          displayName: template?.display?.caption,
          controlType: controlTypes?.find((x:any) => x.value ==template?.type)?.displayText,
        }
      })
    }
    setRows(FormFieldsTemplateRows);
    setReformattedRows({...reformattedRows, rows: FormFieldsTemplateRows, controlTypeList: controlTypes});
  }

  useEffect(() => {
    if (paging) {
      dispatch(getAllFormFieldsFilter(pageiGrid));
    }
    setPaging(false)
  }, [pageiGrid])

useEffect(() => {
  setPageiGrid({...pageiGrid, page:page, size:rowsPerPage, gridSort:{field: orderBy, dir: order}});  
  setPaging(true);
},[page, rowsPerPage])

  const onSave = async () => {
    let selectedFields : FormFieldsTemplate[] = [];
    selectedFields = selectedItems?.map((template: any) => {
      return {
        id: template?.id,
        name: template?.name,
        displayName: template?.displayName,
        controlType: controlTypes?.find((x:any) => x.value ==template?.controlType || x.displayText == template?.controlType)?.displayText ?? "",
        width : 0,
      }
    });
    setSelectedFields(selectedFields);
    setFieldValue("fields", selectedItems.map((x: any) => { return x.id }));
    handleClose();
  }

  const closeDialog = () => {
    handleClose();
    setDisable(true);
  };


  const handleClose = () => {
    setOpenModal(false);
    openModel(false);
  };

  React.useEffect(() => {
    setFormFields();

  }, [filterFormFields?.data]);

  React.useEffect(() => {
    let selectedFieldIdsList = selectedItems.map((x: any) => { return x.id });
    let actualselectedFieldIdsList = selectedFields.map((x: any) => { return x.id });
    if (JSON.stringify(selectedFieldIdsList.sort()) !== JSON.stringify(actualselectedFieldIdsList.sort())) {
      setDisable(false);
    }
    else {
      setDisable(true);
    }
  }, [selectedItems]);

  React.useEffect(() => {
    setOpenModal(true);
  }, []);

  const setData = () => {
    let filterRows = filterFormFields?.data;
    let getAllFilterRows = formFieldsList?.data;
    if (filterRows && getAllFilterRows) {
      let actualselectedFieldIdsList = selectedFields.map((x: any) => { return x.id });
      let selectedUsers = getAllFilterRows.filter((x: any) => {
        if (actualselectedFieldIdsList.indexOf(x.id) > -1)
          return x;
      });
      let selectedItemsList: FormFieldsTemplate[] = selectedUsers?.map((template: any) => {
        return {
          id: template.id,
          name: template.name,
          displayName: template?.display?.caption,
          controlType: template?.type,
          width: template?.display?.width
        }
      })
      let selectedArray = [...selectedItems, ...selectedItemsList];
      selectedArray = selectedArray.filter((ele, ind) => ind === selectedArray.findIndex(elem => elem.id === ele.id));
      setSelectedItems(selectedArray);
    }
  }

  React.useEffect(() => {
    setData();
  }, [formFieldsList?.data, filterFormFields?.data]);

  const onSelection = (v: ValueString[], colIdx: number) => {
    if (v.length > 0) {
      for (var i = 0; i < v.length; i++) {
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
        prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
      );
    }
  };

  useEffect(() => {
    if(searchData.length > 0){
      setIsSearchable(true)
    }
  }, [searchData]);

  const searchText = (
    rowsParam: User[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    };

    return (
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
    );
  };

  const searchAndNonSearchMultiDropDown = (
    rowsParam: FormFieldsTemplate[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any,
    isSearchable: boolean
  ) => {
    
    if(colIdx === 3 && initialRows && initialRows.controlTypeList && initialRows.controlTypeList.length > 0) { 
      let options: any = [];
      initialRows.controlTypeList.map((x: any) => {
        options.push({id : x.id, value: x.displayText });
      });
      

      return (
        <CBXMultiCheckBoxDataFilter 
            width = {245} 
            option={options} 
            defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(value : any) => changeMultiselect(value, colIdx)}
            onSelectedClear = {() => clearAll()}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
          />
      );
    }
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
      width: "100",
      maxWidth: "150",
    },
    {
      label: `${t("Field_Display_Name")}`,
      id: "displayName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      width: "370",
      maxWidth: "400",
      attributeName: "DisplayName",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Field_Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      width: "400",
      maxWidth: "400",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Control_Type")}`,
      id: "controlType",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: true,
      searchComponent: (
        rowData: FormFieldsTemplate[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, false),
      minWidth: "300",
      width: "150",
      maxWidth: "800",
      attributeName: "ControlType",
      attributeType: "List",
      attributeOperator: "contains"
    }
  ]);

  const changeMultiselect = (val: renderCheckMultiselect[], colIdx: number) => {
    onSelection(val, colIdx)
    headCells[colIdx].headerArray = val;
  }

  const getFilteredFieldData = () => {
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
      dispatch(getAllFormFieldsFilter(pageiGrid));

    setIsSearchable(false)
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      getFilteredFieldData();
    }
  }
  const handleBlur = () => {
    if (isSearchable)
    getFilteredFieldData();
  }

  const clearAll = () => {
    const clearButton: any = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
    clearButton && clearButton.click()
    setOpen(false)
    pageiGrid.gridFilter.filters = []
    dispatch(getAllFormFieldsFilter(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };
  const resizeRowUserTab = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  const sortingOrder = (sort: any) => {
    setPageiGrid({ ...pageiGrid, gridSort: { field: sort.orderBy, dir: sort.order } })
    setPaging(true)
  }

  return (
    <>
      <div className="categories">
        <CRXModalDialog
          maxWidth="gl"
          title={title}
          className={'CRXModal ___CRXCreateRetentionPolicy__ ___CRXEditRetentionPolicy__ ___CRXCreateRetentionPolicyFieldLister__ '}
          modelOpen={openModal}
          onClose={closeDialog}
          defaultButton={false}
          showSticky={false}
          closeWithConfirm={closeWithConfirm}
        >
          {success && (
            <CRXAlert
              message={t("Success_You_have_saved_the_Retention_Policy")}
              alertType="toast"
              open={true}
            />
          )}
          {error && (
            <CRXAlert
              className=""
              message={responseError}
              type="error"
              alertType="inline"
              open={true}
            />
          )}

          <ClickAwayListener onClickAway={handleBlur}>
            <div className="userDataTableParent " onKeyDown={handleKeyDown}>
              {rows && (
                <CRXDataTable
                  id="group-userDataTable"
                  actionComponent={() => { }}
                  getRowOnActionClick={() => { }}
                  showToolbar={true}
                  dataRows={rows}
                  initialRows={reformattedRows}
                  headCells={headCells}
                  orderParam={order}
                  orderByParam={orderBy}
                  searchHeader={true}
                  columnVisibilityBar={true}
                  allowDragableToList={false}
                  className="ManageAssetDataTable usersGroupDataTable"
                  onClearAll={clearAll}
                  getSelectedItems={(v: FormFieldsTemplate[]) => setSelectedItems(v)}
                  onResizeRow={resizeRowUserTab}
                  onHeadCellChange={onSetHeadCells}
                  setSelectedItems={setSelectedItems}
                  selectedItems={selectedItems}
                  dragVisibility={false}
                  showCheckBoxes={true}
                  showActionCol={false}
                  showActionSearchHeaderCell={false}
                  showCountText={false}
                  showCustomizeIcon={false}
                  showTotalSelectedText={true}
                  lightMode={false}
                  offsetY={44}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setPage={(page: any) => setPage(page)}
                  setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                  totalRecords={filterFormFields?.totalCount}
                  setSortOrder={(sort: any) => sortingOrder(sort)}
                  
                />
              )
              }
            </div>
          </ClickAwayListener>

          <div className="tab-bottom-buttons retention-type-btns">
            <div className="save-cancel-button-box">
              <CRXButton
                variant="contained"
                className="groupInfoTabButtons"
                onClick={() => onSave()}
                disabled={disable}
              >
                {t("Save")}
              </CRXButton>
              <CRXButton
                className="groupInfoTabButtons secondary"
                color="secondary"
                variant="outlined"
                onClick={handleClose}
              >
                {t("Cancel")}
              </CRXButton>
            </div>

          </div>
        </CRXModalDialog>
        <CRXConfirmDialog
          setIsOpen={() => setIsOpen(false)}
          onConfirm={handleClose}
          isOpen={isOpen}
          className="CategoriesConfirm"
          primary={t("Yes_close")}
          secondary={t("No,_do_not_close")}
          text="retention policy form"
        >
          <div className="confirmMessage">
            {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
            <strong>{t("retention_policy_Form")}</strong>. {t("If_you_close_the_form")},
            {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
            <div className="confirmMessageBottom">
              {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
            </div>
          </div>
        </CRXConfirmDialog>

      </div>

    </>
  )
}

export default FieldLister;
