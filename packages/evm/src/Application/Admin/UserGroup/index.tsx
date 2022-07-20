import React, { useContext, useEffect, useState } from "react";
import { CRXDataTable, CRXSelectBox } from "@cb/shared";
import { useTranslation } from "react-i18next";
import useGetFetch from '../../../utils/Api/useGetFetch';
import { useDispatch, useSelector } from "react-redux";
import { getGroupAsync, getGroupUserCountAsync } from "../../../Redux/GroupReducer";
import { RootState } from "../../../Redux/rootReducer";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import anchorDisplay from "../../../GlobalComponents/Display/AnchorDisplay";
import { useHistory } from "react-router-dom";
import './index.scss'
import { urlList, urlNames } from "../../../utils/urlList"
import Restricted from '../../../ApplicationPermission/Restricted'

import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onTextCompare,
  onMultiToMultiCompare,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  onClearAll
} from "../../../GlobalFunctions/globalDataTableFunctions";
import UserGroupActionMenu from "./UserGroupActionMenu";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import { CRXButton } from "@cb/shared";
import { CRXModalDialog } from "@cb/shared";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";

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
    dispatch(getGroupAsync());
    dispatch(getGroupUserCountAsync());
  }, []);



  const groups: any = useSelector((state: RootState) => state.groupReducer.groups);
  const groupUsersCount: any = useSelector((state: RootState) => state.groupReducer.groupUserCounts);
  const [rows, setRows] = React.useState<GroupUser[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<GroupUser[]>([]);

  const [reformattedRows, setReformattedRows] = React.useState<GroupUser[]>();
  const {
    getModuleIds
  } = useContext(ApplicationPermissionContext);


  const setData = () => {

    let groupRows: GroupUser[] = []
    if (groups && groups.length > 0) {
      groupRows = groups.map((group: any) => {
        const index = groupUsersCount && groupUsersCount.findIndex((c: any) => group.id == c.group)
        if (index !== -1) {
          let count = groupUsersCount && groupUsersCount[index].userCount
          count = count ? count : 0
          return { id: group.id, name: group.name + "_" + group.id, description: group.description, userCount: count }
        }
        else {
          return { id: group.id, name: group.name + "_" + group.id, description: group.description, userCount: 0 }
        }
      })

    }
    setRows(groupRows);
    setReformattedRows(groupRows);

  }

  React.useEffect(() => {
    setData();
  }, [groups, groupUsersCount]);

  const searchText = (
    rowsParam: GroupUser[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
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

    return (
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} className="userGroupSearchBox" />
    );
  };

  const [selectOptions, setSelectOption] = useState<any>([
    {id : "", value : ""}
  ])
  const onSelectInputChange = (e : any) => {
   
  }

  const simpleFilter = (data : any) => {
    
    const option = data.map((x : any, i:any) => {
        return {id: x.id, value : x.description}
    })
    return (
       <CRXSelectBox 
        id="descriptionOption"
        options={option}
        className="adVSelectBox"
        // value={selectedOpt ? selectedOpt.value : "Please Select"}
        onChange={(e: any) => onSelectInputChange(e)}
        defaultValue={t("Please_Select")}
       />
     
    )
  }

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
      maxWidth: "100",
    },
    {
      label: t("Group Name"),
      id: "name",
      align: "left",
      dataComponent: (e: string) => AnchorDisplay(e),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "250",
      maxWidth: "400",
    },
    {
      label: t("Description"),
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText, //(e : any ) => simpleFilter(e),
      minWidth: "300",
      maxWidth: "500",
    },
    {
      label: t("Total Users Assigned"),
      id: "userCount",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "250",
      maxWidth: "300",
    }
  ]);

  useEffect(() => {
    //setData();
    dataArrayBuilder();
  }, [searchData]);

  const dataArrayBuilder = () => {
    if (reformattedRows !== undefined) {
      let dataRows: GroupUser[] = reformattedRows;
      searchData.forEach((el: SearchObject) => {
        if (el.columnName === "name" || el.columnName === "description" || el.columnName === "userCount")
          dataRows = onTextCompare(dataRows, headCells, el);
      }
      );
      setRows(dataRows);
    }
  };

  const resizeRowGroupUser = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  return (
    <div className="managePermissionTable switchLeftComponents">
     
      {
        rows && (
          <CRXDataTable
            id="userGroupDataTable"
            actionComponent={<UserGroupActionMenu />}
            toolBarButton = {
              <Restricted moduleId={6}>
                <CRXButton className="managePermissionBtn" onClick={() => { history.push(urlList.filter((item:any) => item.name === urlNames.userGroupCreate)[0].url) }}>
                  {t("Create_Group")}
                </CRXButton>
              </Restricted>
            }
            showToolbar={true}
            dataRows={rows}
            headCells={headCells}
            orderParam={order}
            orderByParam={orderBy}
            searchHeader={true}
            columnVisibilityBar={true}
            className="crxTableHeight crxTableDataUi manageUserGroupsDataTable"
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
            offsetY={201}
   
          />
        )
      }
    </div>
  )
}

export default UserGroup
