import React, { useContext, useEffect, useState } from "react";
import { CRXDataTable, CRXSelectBox } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getGroupAsync } from "../../../Redux/GroupReducer";
import { RootState } from "../../../Redux/rootReducer";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import anchorDisplay from "../../../GlobalComponents/Display/AnchorDisplay";
import { useHistory } from "react-router-dom";
import './index.scss'
import { urlList, urlNames } from "../../../utils/urlList"
import Restricted from '../../../ApplicationPermission/Restricted'
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
  GridFilter,
  PageiGrid
} from "../../../GlobalFunctions/globalDataTableFunctions";
import UserGroupActionMenu from "./UserGroupActionMenu";
import NumberSearch from "../../../GlobalComponents/DataTableSearch/NumberSearch";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import { CRXButton } from "@cb/shared";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";

type GroupUser = {
  id: number;
  name: string;
  description: string;
  userCount: number
}

const UserGroup: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  let history = useHistory();

  React.useEffect(() => {
    dispatch(enterPathActionCreator({ val: "" }));
  }, []);



  const groups: any = useSelector((state: RootState) => state.groupReducer.groups);
  const [rows, setRows] = React.useState<GroupUser[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Name");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<GroupUser[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<GroupUser>();
  const [reformattedRows, setReformattedRows] = React.useState<GroupUser[]>();
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
  const {
    getModuleIds
  } = useContext(ApplicationPermissionContext);
  
  const setData = () => {
    let groupRows: GroupUser[] = []
    if (groups.data && groups.data.length > 0) {
      groupRows = groups.data.map((item: any) => {
        return { 
            id: item.id, 
            name: item.name + "_" + item.id, 
            description: item.description, 
            userCount: item.userCount
        }
        // const index = groups.count && groups.count.findIndex((c: any) => group.id == c.group)
        // if (index !== -1) {
        //   let count = groups.count && groups.count[index].userCount
        //   count = count ? count : 0
        //   return { id: group.id, name: group.name + "_" + group.id, description: group.description, userCount: count }
        // }
        // else {
        //   return { id: group.id, name: group.name + "_" + group.id, description: group.description, userCount: 0 }
        // }
      })

    }
    setRows(groupRows);
    setReformattedRows(groupRows);

  }

  React.useEffect(() => {
    setData();
  }, [groups?.data]);

  React.useEffect(() => {
    if(paging){
      dispatch(getGroupAsync(pageiGrid));
      //dispatch(getGroupUserCountAsync());
    }
    setPaging(false)
  },[pageiGrid])

  const searchText = (
    rowsParam: GroupUser[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    };

    return (
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} className="userGroupSearchBox" />
    );
  };

  const searchNumber = (
    rowsParam: GroupUser[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      if (valuesObject[0]?.value) {
        let value = valuesObject[0]?.value;
        if (parseInt(value) > 0) {
          if (valuesObject[0]?.value?.length > 6) {
            let val = value.substring(0, 6);
            valuesObject[0].value = val;
          }
        }
        else {
          valuesObject[0].value = '0';
        }
      }

      onSelection(valuesObject, colIdx);
    };

    return (
      <NumberSearch headCells={headCells} colIdx={colIdx} onChange={onChange} className="userGroupSearchBox" />
    );
  };

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

  const AnchorDisplay = (e: string) => {
    if(getModuleIds().includes(7)) {
    return anchorDisplay(e, "", urlList.filter((item:any) => item.name === urlNames.adminUserGroupId)[0].url)
    }
    else{
    let lastid = e.lastIndexOf("_");
    let text =  e.substring(0,lastid)
    return textDisplay(text,"")
    }
  }
  
  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: t("ID"),
      id: "id",
      align: "right",
      dataComponent: () => null,
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: "80",
      width: "80"
    },
    {
      label: t("Group Name"),
      id: "name",
      align: "left",
      dataComponent: (e: string) =>  AnchorDisplay(e),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t("Description"),
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText, //(e : any ) => simpleFilter(e),
      minWidth: "450",
      attributeName: "Description",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t("Total Users Assigned"),
      id: "userCount",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchNumber,
      minWidth: "300",
      attributeName: "UserCount",
      attributeType: "Int",
      attributeOperator: "eq"
    },
    {
      label: t("Ad Sync Usage"),
      id: "userCount",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchNumber,
      minWidth: "235",
      attributeName: "UserCount",
      attributeType: "Int",
      attributeOperator: "eq"
    },
    {
      label: t("Containers"),
      id: "userCount",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchNumber,
      minWidth: "420",
      attributeName: "UserCount",
      attributeType: "Int",
      attributeOperator: "eq"
    }
  ]);

  useEffect(() => {
    if(searchData.length > 0)
      setIsSearchable(true)
  }, [searchData]);

  const resizeRowGroupUser = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getGroupAsync(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  const getFilteredGroupData = () => {

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
      else{
        dispatch(getGroupAsync(pageiGrid));
        //dispatch(getGroupUserCountAsync());
      }
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
      getFilteredGroupData()
    }
  }

  const handleBlur = () => {
    if(isSearchable)
     getFilteredGroupData()
}

  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className="managePermissionTable ExpandViewOverlay" onKeyDown={handleKeyDown}>
     
      {
        rows && (
          <CRXDataTable
            id="userGroupDataTable"
            actionComponent={<UserGroupActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              />}
            toolBarButton = {
              <>
              <Restricted moduleId={6}>
                <CRXButton className="managePermissionBtn" color="primary" primary={true} onClick={() => { history.push(urlList.filter((item:any) => item.name === urlNames.userGroupCreate)[0].url) }}>
                  {t("Create_Group")}
                </CRXButton>
              </Restricted>
              {/* <CRXButton className="secondary manageUserBtn userGroupfilterButton mr_L_10" onClick={() => getFilteredGroupData()}> {t("Filter")} </CRXButton> */}
              </>
            }
            getRowOnActionClick={(val: GroupUser) => setSelectedActionRow(val)}
            showToolbar={true}
            dataRows={rows}
            headCells={headCells}
            orderParam={order}
            orderByParam={orderBy}
            searchHeader={true}
            columnVisibilityBar={true}
            className="crxTableHeight crxTableDataUi manageUserGroupsDataTable TableWithOutCheck"
            onClearAll={clearAll}
            getSelectedItems={(v: GroupUser[]) => setSelectedItems(v)}
            onResizeRow={resizeRowGroupUser}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            showActionSearchHeaderCell={false}
            showCountText={false}
            showCustomizeIcon={false}
            dragVisibility={false}
            showCheckBoxesCol={false}
            showActionCol={true}
            showTotalSelectedText={false}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage= {(page:any) => setPage(page)}
            setRowsPerPage= {(rowsPerPage:any) => setRowsPerPage(rowsPerPage)}
            totalRecords={groups ? groups.totalCount : 0}
            setSortOrder={(sort:any) => sortingOrder(sort)}
            //Please dont miss this block.
            offsetY={119}
            stickyToolbar={130}
            searchHeaderPosition={223}
            dragableHeaderPosition={188}
            showExpandViewOption={true}
            overlay={true}
            //End here
   
          />
        )
      }
    </div>
    </ClickAwayListener>
  )
}

export default UserGroup
