import React, { useEffect } from "react";
import { CRXDataTable } from "@cb/shared";
import { useTranslation } from "react-i18next";
import useGetFetch from '../utils/Api/useGetFetch';
import { useDispatch, useSelector } from "react-redux";
import { getGroupAsync, getGroupUserCountAsync } from "../Redux/GroupReducer";
import { RootState } from "../Redux/rootReducer";
import textDisplay from "../components/DateDisplayComponent/TextDisplay";
import anchorDisplay from "../components/DateDisplayComponent/AnchorDisplay";
import { useHistory } from "react-router-dom";
import './index.scss'


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
} from "../utils/globalDataTableFunctions";
import UnitAndDevicesActionMenu from "./UnitAndDevicesActionMenu";
import TextSearch from "../components/SearchComponents/TextSearch";
import { CRXButton } from "@cb/shared";
import { logOutUser } from "../Login/API/auth";

type GroupUser = {
  id: number;
  name: string;
  description: string;
  userCount: number
}

const UnitAndDevices: React.FC = () => {
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

  const setData = () => {

    let groupRows: GroupUser[] = [

      {id:1, name:"Getac", description:"Getac", userCount:3},

      {id:2, name:"Getac", description:"Getac", userCount:1},

      {id:3, name:"Getac", description:"Getac", userCount:0},

      {id:4, name:"Getac", description:"Getac", userCount:9},

      {id:5, name:"Getac", description:"Getac", userCount:5},

    ]

 
    setRows(groupRows);
    setReformattedRows(groupRows);

  }

  React.useEffect(() => {
    setData();
  }, [groupUsersCount]);

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
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
      );
    };


  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: `${t("ID")}`,
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
      label: `${t("Getac")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string) => anchorDisplay(e, "anchorStyle"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
    },
    {
      label: `${t("Getac")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
    },
    {
      label: `${t("Getac")}`,
      id: "userCount",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
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

  const resizeRow = (e: { colIdx: number; deltaX: number }) => {
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
 
  
    <div style={{ marginLeft: "6%", marginTop: "10%" }}>
        
      {
        
        rows && (
        <CRXDataTable
          id="Units & Devices"
          actionComponent={<UnitAndDevicesActionMenu />}


          showToolbar={true}
          showCountText={true}
          columnVisibilityBar={true}


          dragVisibility={true}
          showCheckBoxesCol={true}
          showActionCol={true}


          headCells={headCells}
          dataRows={rows}


          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}


          allowDragableToList={true}

          showActionSearchHeaderCell={true}
          showCustomizeIcon={true}
          //---required Props
          className="ManageAssetDataTable crxTableHeight bucketDataTable"
          //onClearAll={clearAll}
          getSelectedItems={(v: GroupUser[]) => setSelectedItems(v)}
          onResizeRow={resizeRow}
          onHeadCellChange={onSetHeadCells}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          />
          )
        }
      
    </div>
 
  )
}

export default UnitAndDevices
