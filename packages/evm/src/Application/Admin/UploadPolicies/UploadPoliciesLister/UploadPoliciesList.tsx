import React, { useEffect, useRef, useState, useContext } from "react";
import { CRXDataTable } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import UploadPoliciesTemplateActionMenu from './UploadPoliciesTemplateActionMenu';
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import './uploadPoliciesList.scss'
import anchorDisplay from '../../../../utils/AnchorDisplay';
import { urlList, urlNames } from "../../../../utils/urlList"
import { useHistory } from "react-router-dom";
import { RootState } from "../../../../Redux/rootReducer";
import { CRXButton } from "@cb/shared";
import { enterPathActionCreator } from '../../../../Redux/breadCrumbReducer';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onSetSingleHeadCellVisibility,
  onClearAll,
  onSetHeadCellVisibility,
  onSaveHeadCellData,
  PageiGrid,
  SearchObject,
  GridFilter,
  onSetSearchDataValue
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import {CRXAlert,CRXToaster} from "@cb/shared";
import {getAllUploadPoliciesInfoAsync} from '../../../../Redux/UploadPolicies';
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import Restricted from "../../../../ApplicationPermission/Restricted";


type UploadPoliciesTemplate = {
  id: number;
  description: string;
}

const UploadPoliciesList: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  let history = useHistory();
  const reformattedRowsRef = useRef<UploadPoliciesTemplate[]>();
  const [rows, setRows] = React.useState<UploadPoliciesTemplate[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Name");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<UploadPoliciesTemplate[]>([]);
  const [selectedActionRow, setSelectedActionRow] = useState<UploadPoliciesTemplate[]>();
  const [reformattedRows, setReformattedRows] = React.useState<any>();
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
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const uploadMsgFormRef = useRef<typeof CRXToaster>(null);
  
  const filterUploadPolicies: any = useSelector((state: RootState) => state.uploadPoliciesSlice.filterUploadPolicies);
  const { getModuleIds } = useContext(ApplicationPermissionContext);

  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "uploadPoliciesTemplateDataTable");
  }, []);

  const setUploadPoliciesData = () => {
    let uploadPoliciesTemplateRows: UploadPoliciesTemplate[] = []
    if (filterUploadPolicies?.data && filterUploadPolicies?.data.length > 0) {
      uploadPoliciesTemplateRows = filterUploadPolicies?.data.map((template: any) => {
        return { 
            id: template.id, 
            name: template.name, 
            description: template.description, 
        }
      })
    }
    
    setRows(uploadPoliciesTemplateRows);
    setReformattedRows({...reformattedRows, rows: uploadPoliciesTemplateRows});
    reformattedRowsRef.current = uploadPoliciesTemplateRows;
  }

  React.useEffect(() => {
    setUploadPoliciesData();
  }, [filterUploadPolicies?.data]);

  useEffect(() => {
    if(paging)
      dispatch(getAllUploadPoliciesInfoAsync(pageiGrid));
    setPaging(false)
  },[pageiGrid])


  useEffect(() => {
    document
      .querySelector(".footerDRP")
      ?.closest(".MuiMenu-paper")
      ?.classList.add("MuiMenu_Modal_Ui");
  });

  const searchText = (
    rowsParam: UploadPoliciesTemplate[],
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

  const UploadFormMessages = (obj: any) => {
    uploadMsgFormRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
      className: "policy"
    });
  }

  const onMessageShow = (isSuccess: boolean, message: string) => {
    UploadFormMessages({
      message: message,
      variant: isSuccess ? 'success' : 'error',
      duration: 5000,
      className: "policy"
    });
  }
  const openEditForm = (rowId: number) => {
    let urlPathName = urlList.filter((item: any) => item.name === urlNames.uploadPoliciesEdit)[0].url;
    history.push(
      urlPathName.substring(0, urlPathName.lastIndexOf("/")) + "/" + rowId
    );
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
      label: `${t("Upload_Policy_Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string, id: number) => {
        var selectedRow = reformattedRowsRef.current?.find((x: any) => x.name == e);
        if (getModuleIds().includes(63)) {
          return <Restricted moduleId={63}>
            <div className="linkColor" onClick={
              (e) => openEditForm(selectedRow?.id ?? 0)}>{e}</div>
          </Restricted>
        }
        else 
        {
          return textDisplay(e, "")
        }
      },
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "800",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "788",
      attributeName: "Description",
	  detailedDataComponentId: "name",      attributeType: "String",
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

  const UploadPolicyAction = () => {
    dispatch(getAllUploadPoliciesInfoAsync(pageiGrid));
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllUploadPoliciesInfoAsync(pageiGrid));  
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  const getFilteredUploadPoliciesData = () => {
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

    console.log("PageiGrid : ", pageiGrid)

    if(page !== 0)
      setPage(0)
    else
      dispatch(getAllUploadPoliciesInfoAsync(pageiGrid));
    
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
      getFilteredUploadPoliciesData()
    }
  }
  const handleBlur = () => {
    if(isSearchable) {     
      getFilteredUploadPoliciesData()
    }
  }

  return (
    
    <ClickAwayListener onClickAway={handleBlur}>
    <div className="CrxUploadPoliciesTable switchLeftComponents UploadPoliceMainPage" onKeyDown={handleKeyDown}>
      <CRXToaster ref={uploadMsgFormRef} />
      {
        rows && (
          <CRXDataTable
            id="uploadPoliciesTemplateDataTable"
            actionComponent={<UploadPoliciesTemplateActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              getRowData={UploadPolicyAction}
              getSelectedData={getSelectedItemsUpdate}
              onMessageShow={onMessageShow}
            />}
            toolBarButton={
              <>
                <Restricted moduleId={62}>
                  <CRXButton className="primary UploadPoliciesBtn" onClick={() => { history.push(urlList.filter((item: any) => item.name === urlNames.uploadPoliciesCreate)[0].url) }}>
                    {t("Create_Upload_Policy")}
                  </CRXButton>
                </Restricted>

              </>
            }
            getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
            dataRows={rows}
            initialRows={reformattedRows}
            headCells={headCells}
            orderParam={order}
            orderByParam={orderBy}
            showToolbar={true}
            showCountText={false}
            columnVisibilityBar={false}
            dragVisibility={false}
            showCheckBoxesCol={true}
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showTotalSelectedText={false}
            showActionSearchHeaderCell={true}
            showCustomizeIcon={false}
            className="crxTableHeight crxTableDataUi UploadPoliciesTableTemplate UploadPoliciesTable_UI"
            onClearAll={clearAll}
            getSelectedItems={(v: UploadPoliciesTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowConfigTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            //Please dont miss this block.
            offsetY={119}
            stickyToolbar={135}
            searchHeaderPosition={222}
            dragableHeaderPosition={188}
            //End here
            page={page}
            rowsPerPage={rowsPerPage}
            setPage={(pages: any) => setPage(pages)}
            setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
            totalRecords={filterUploadPolicies?.totalCount}
            setSortOrder={(sort:any) => sortingOrder(sort)}
            showExpandViewOption={true}
          />
        )
      }
    </div>
    </ClickAwayListener>
  );
};

export default UploadPoliciesList;
