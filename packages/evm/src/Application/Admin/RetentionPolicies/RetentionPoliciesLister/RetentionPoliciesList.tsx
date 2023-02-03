import React, { useEffect, useRef, useState, useContext } from "react";
import { CRXDataTable } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import RetentionPoliciesTemplateActionMenu from './RetentionPoliciesTemplateActionMenu';
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import './retentionPoliciesList.scss'
import { Link, useHistory } from "react-router-dom";
import { RootState } from "../../../../Redux/rootReducer";
import { CRXButton, CRXIcon } from "@cb/shared";
import { enterPathActionCreator } from '../../../../Redux/breadCrumbReducer';
import RetentionPoliciesDetail from "../RetentionPoliciesDetail/RetentionPoliciesDetail";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
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
import {CRXToaster,CRXAlert} from "@cb/shared";
import {getAllRetentionPoliciesInfoAsync} from '../../../../Redux/RetentionPolicies';
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { number } from "yup/lib/locale";



type RetentionPoliciesTemplate = {
  id: number;
  name: string;
  retentionTimeOrSpace: string;
  softDeleteTime: string;
  description: string;
  isInfinite: boolean;
}

const RetentionPoliciesList: React.FC = () => {
 
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [id, setId] = React.useState<number>(0);
  const { getModuleIds} = useContext(ApplicationPermissionContext);
  const filterRetentionPolicies: any = useSelector((state: RootState) => state.retentionPoliciesSlice.filterRetentionPolicies);

  const [title, setTitle] = React.useState<string>("");
  const [rows, setRows] = React.useState<RetentionPoliciesTemplate[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Name");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<RetentionPoliciesTemplate[]>([]);
  const [selectedActionRow, setSelectedActionRow] = useState<RetentionPoliciesTemplate[]>();
  const [reformattedRows, setReformattedRows] = React.useState<any>();
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
    size: rowsPerPage,
    gridSort: {
      field: orderBy,
      dir: order
    }
  })
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const retentionMsgFormRef = useRef<typeof CRXToaster>(null);
  
  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "RetentionPoliciesTemplateDataTable");
  }, []);

  const setRetentionPoliciesData = () => {
    let RetentionPoliciesTemplateRows: RetentionPoliciesTemplate[] = []
    if (filterRetentionPolicies?.data && filterRetentionPolicies?.data.length > 0) {
      RetentionPoliciesTemplateRows = filterRetentionPolicies?.data.map((template: any) => {
        return { 
            id: template.id,
            name:template.name ,
            // retentionTimeOrSpace:  template.detail.limit.isInfinite == true? "" : template.detail.space > 0 ? template.detail.space + " GB" :  getTimeSpaceValue(template.detail.limit.hours) ,
            // softDeleteTime:  template.detail.space > 0 ? "" : getTimeSpaceValue(template.detail.limit.gracePeriodInHours) ,
            retentionTimeOrSpace: template.retentionTimeOrSpace,
            softDeleteTime: template.softDeleteTime,
            description: template.description , 
            isInfinite  : template.detail.limit.isInfinite          

        }
      })
    }

    setRows(RetentionPoliciesTemplateRows);
    setReformattedRows({...reformattedRows, rows: RetentionPoliciesTemplateRows});
  }
  
  React.useEffect(() => {
    console.log("abc ",filterRetentionPolicies?.data)
    setRetentionPoliciesData();
  }, [filterRetentionPolicies?.data]);
  
  useEffect(() => {
    if (paging)
      dispatch(getAllRetentionPoliciesInfoAsync(pageiGrid));
    setPaging(false)
  }, [pageiGrid])

  useEffect(() => {
    document
      .querySelector(".footerDRP")
      ?.closest(".MuiMenu-paper")
      ?.classList.add("MuiMenu_Modal_Ui");
  });

  const retentionFormMessages = (obj: any) => {
    retentionMsgFormRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
      className : "policy"
    });
  }

  const searchText = (
    rowsParam: RetentionPoliciesTemplate[],
    headCell: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    }

    return (
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
    );
  };

  const retentionInfiniteOrTimeSpace = (timeSpace: string): JSX.Element => {
    if (timeSpace == "") {
      return (
        <CRXIcon className=""><i className="fa-regular fa-infinity"></i></CRXIcon>
      );

    }
    else {
      return textDisplay(timeSpace, " ")
    }
  }
  const openEditForm = (rowId: number) => {
    //if (getModuleIds().includes(67)) {
    onClickOpenModel(true, Number(rowId), '')
    //}
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
      maxWidth: "400",
    },
    {
      label: `${t("Policy_Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string, id: number) => {
        if (getModuleIds().includes(63)) {
          return <Restricted moduleId={63}>
            <div style={{ cursor: "pointer", color: "var(--color-c34400)" }} onClick={(e) => openEditForm(id)} className={"dataTableText txtStyle"}>{e}</div>
          </Restricted>
        }
        else {
          return textDisplay(e, "")
        }
      },
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "332",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Retention_Time_Or_Space")}`,
      id: "retentionTimeOrSpace",
      align: "left",
      dataComponent:(e: string) => retentionInfiniteOrTimeSpace(e), 
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "400",
      attributeName: "RetentionTimeOrSpace",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Soft_Delete_Time")}`,
      id: "softDeleteTime",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "400",
      attributeName: "SoftDeleteTime",
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
      minWidth: "410",
      attributeName: "Description",
      attributeType: "String",
      attributeOperator: "contains"
    },

  ]);

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

  const getSelectedItemsUpdate = () => {
    setSelectedItems([]);
  }

  const getSuccessUpdate = () => {
    setSuccess(true);
  }

  const RetentionPoliciesAction = () => {
    dispatch(getAllRetentionPoliciesInfoAsync(pageiGrid));
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllRetentionPoliciesInfoAsync(pageiGrid));
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

  const getTimeSpaceValue = (hours: number) => {
    let days = parseInt(String(hours / 24));
    let remainingHours = hours - (days * 24);
    return days + "d " + remainingHours + "h ";
  }

  const updateOpenModel = (modelOpen: boolean) => {
    setOpenModel(modelOpen);
    dispatch(getAllRetentionPoliciesInfoAsync(pageiGrid))
  }

  const onMessageShow = (isSuccess: boolean, message: string) => {
    retentionFormMessages({
      message: message,
      variant: isSuccess ? 'success' : 'error',
      duration: 5000,
      className: "policy"
    });
  }

  const getFilteredRetentionPoliciesData = () => {
    pageiGrid.gridFilter.filters = []
    searchData.filter(x => x.value[0] !== '').forEach((item:any, index:number) => {
        let x: GridFilter = {
          operator: headCells[item.colIdx].attributeOperator,
          //field: item.columnName.charAt(0).toUpperCase() + item.columnName.slice(1),
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
      dispatch(getAllRetentionPoliciesInfoAsync(pageiGrid));
    
    setIsSearchable(false)
}

  useEffect(() => {
    setPageiGrid({...pageiGrid, page:page, size:rowsPerPage, gridSort:{field: orderBy, dir: order}}); 
    setPaging(true)
  },[page, rowsPerPage])

  const sortingOrder = (sort: any) => {
    setPageiGrid({...pageiGrid, gridSort:{field: sort.orderBy, dir:sort.order}})
    setOrder(sort.order)
    setOrderBy(sort.orderBy)
    setPaging(true)
  }

  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      getFilteredRetentionPoliciesData()
    }
  }
  const handleBlur = () => {
    if(isSearchable) {     
      getFilteredRetentionPoliciesData()
    }
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className="CrxRetentionPoliciesTable switchLeftComponents" onKeyDown={handleKeyDown}>
      <CRXToaster ref={retentionMsgFormRef} />
      {
        rows && (
          <CRXDataTable
            id="RetentionPoliciesTemplateDataTable"
            actionComponent={<RetentionPoliciesTemplateActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              getRowData={RetentionPoliciesAction}
              getSelectedData={getSelectedItemsUpdate}
              getSuccess={getSuccessUpdate}
              onClickOpenModel={onClickOpenModel}
              onMessageShow={onMessageShow}
            />}
            toolBarButton={
              <>
                <Restricted moduleId={62}>

                  <CRXButton className="RetentionPoliciesBtn" onClick={() => { onClickOpenModel(true, 0, "Create Retention Policy") }}>
                    {t("Create_Retention_Policies")}
                  </CRXButton>
                </Restricted>
              </>
            }
            getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
            dataRows={rows}
            headCells={headCells}
            orderParam={order}
            orderByParam={orderBy}
            showToolbar={true}
            showCountText={false}
            columnVisibilityBar={true}
            dragVisibility={false}
            showCheckBoxesCol={true}
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showTotalSelectedText={false}
            showActionSearchHeaderCell={true}
            showCustomizeIcon={true}
            className="crxTableHeight crxTableDataUi RetentionPoliciesTableTemplate RetentionPoliciesTable_UI"
            onClearAll={clearAll}
            getSelectedItems={(v: RetentionPoliciesTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowConfigTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage={(pages: any) => setPage(pages)}
            setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
            totalRecords={filterRetentionPolicies?.totalCount}
            setSortOrder={(sort:any) => sortingOrder(sort)}
            //Please dont miss this block.
            offsetY={119}
            stickyToolbar={137}
            searchHeaderPosition={241}
            dragableHeaderPosition={207}
          //End here
          />

        )
      }
      {
        openModel &&
        (<RetentionPoliciesDetail id={id} title={title} pageiGrid={pageiGrid} openModel={updateOpenModel} />)
      }
    </div>
    </ClickAwayListener>
  );
};

export default RetentionPoliciesList;
