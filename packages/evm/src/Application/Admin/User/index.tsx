import React, { useContext, useEffect, useRef } from "react";
import { CRXDataTable, 
  CRXColumn, 
  CRXToaster, 
  CRXButton, 
  CBXMultiCheckBoxDataFilter,
} from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { useDispatch, useSelector } from "react-redux";
import { getUsersInfoAsync, getUserStatusKeyValuesAsync, getAllUserGroupKeyValuesAsync } from "../../../Redux/UserReducer";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { RootState } from "../../../Redux/rootReducer";
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";
import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onTextCompare,
  onDateCompare,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  onClearAll,
  onSaveHeadCellData,
  onSetHeadCellVisibility,
  onMultipleCompare,
  GridFilter,
  PageiGrid,
  RemoveSidePanelClass,
} from "../../../GlobalFunctions/globalDataTableFunctions";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import {dateDisplayFormat} from "../../../GlobalFunctions/DateFormat";
import UserActionMenu from "./UserActionMenu";
import { dateOptionsTypes } from "../../../utils/constant";
import multitextDisplay from "../../../GlobalComponents/Display/MultiTextDisplay";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import moment from "moment";
import Restricted from "../../../ApplicationPermission/Restricted";
import "./userIndex.scss";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import anchorDisplay from '../../../utils/AnchorDisplay';
import { getToken } from "./../../../Login/API/auth";
import { TokenType } from "./../../../types";
import jwt_decode from "jwt-decode";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";

type User = {
  id: string;
  loginId: string;
  fName: string;
  lName: string;
  email: string;
  status: string;
  lastLogin: string;
  userGroups: string[];
  isADUser: boolean;
  showToastMsg?: (obj: any) => void;
};

type DateTimeProps = {
  dateTimeObj: DateTimeObject;
  colIdx: number;
};
type DateTimeObject = {
  startDate: string;
  endDate: string;
  value: string;
  displayText: string;
};

interface renderCheckMultiselect {
  value: string,
  id: string,

}

const User: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();

  const userIdPreset = () =>{
    var token = getToken();
    if (token) {
        var accessTokenDecode: any = jwt_decode(token);
        return accessTokenDecode.LoginId
    }
    else
     return ""
  }
  
  const users: any = useSelector(
    (state: RootState) => state.userReducer.usersInfo
  );
  const userStatus : any = useSelector(
    (state: RootState) => state.userReducer.userStatus
  );
  const userGroups : any = useSelector(
    (state: RootState) => state.userReducer.userGroups
  );
  const [rows, setRows] = React.useState<User[]>([]);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<string>("LastLogin");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<User[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [selectedActionRow, setSelectedActionRow] = React.useState<User>();
  const [paging, setPaging] = React.useState<boolean>();
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const { getModuleIds} = useContext(ApplicationPermissionContext);
  const [userId, setUserId] = React.useState<string>(userIdPreset());
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
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)

  React.useEffect(() => {

    dispatch(getUserStatusKeyValuesAsync());
    dispatch(getAllUserGroupKeyValuesAsync());
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "userDataTable");
    dispatch(enterPathActionCreator({ val: "" }));
  }, []);

  const setData = () => {
    let userRows: User[] = [];
    if (users.data && users.data.length > 0) {
      userRows = users.data.map((user: any) => {
        return {
          id: user.recId,
          loginId: user.loginId + "_" + user.recId,
          fName: user.fName,
          lName: user.lName,
          lastLogin: user.lastLogin,
          userGroups:
            user.userGroups != null
              ? user.userGroups.split(",").map((x: string) => {
                  return x.trim();
                })
              : [],
          email: user.email,
          isADUser : user.isADUser,
          status: user.status,
        };
      });
    }
    setRows(userRows);
    setReformattedRows({...reformattedRows, rows: userRows, userStatus: userStatus, userGroups: userGroups});
  };

  React.useEffect(() => {
    setData();
  }, [users, userStatus, userGroups]);

  useEffect(() => {
    if(paging){
      dispatch(getUsersInfoAsync(pageiGrid));
    }
    setPaging(false)
  },[pageiGrid])

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

  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });

  const searchDate = (
    rowsParam: User[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    let reset: boolean = false;

    let dateTimeObject: DateTimeProps = {
      dateTimeObj: {
        startDate: "",
        endDate: "",
        value: "",
        displayText: "",
      },
      colIdx: 0,
    };

    if (
      headCells[colIdx].headerObject !== null ||
      headCells[colIdx].headerObject === undefined
    )
      reset = false;
    else reset = true;

    if (
      headCells[colIdx].headerObject === undefined ||
      headCells[colIdx].headerObject === null
    ) {
      dateTimeObject = {
        dateTimeObj: {
          startDate:
            reformattedRows !== undefined ? reformattedRows.rows[0].lastLogin : "",
          endDate:
            reformattedRows !== undefined
              ? reformattedRows.rows[reformattedRows.length - 1].lastLogin
              : "",
          value: "custom",
          displayText: t("custom_range"),
        },
        colIdx: 0,
      };
    } else {
      dateTimeObject = {
        dateTimeObj: {
          ...headCells[colIdx].headerObject,
        },
        colIdx: 0,
      };
    }

    function onSelection(dateTime: DateTimeObject) {
      dateTimeObject = {
        dateTimeObj: {
          ...dateTime,
        },
        colIdx: colIdx,
      };
      setDateTime(dateTimeObject);
      headCells[colIdx].headerObject = dateTimeObject.dateTimeObj;
    }

    return (
      <CRXColumn item xs={11}>
        <DateTimeComponent
          showCompact={false}
          reset={reset}
          dateTimeDetail={dateTimeObject.dateTimeObj}
          getDateTimeDropDown={(dateTime: DateTimeObject) => {
            onSelection(dateTime);
          }}
          dateOptionType={dateOptionsTypes.basicoptions}
        />
      </CRXColumn>
    );
  };
  function findUniqueValue(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }
  const multiSelectCheckbox = (rowParam: User[],headCells: HeadCellProps[], colIdx: number, initialRows:any) => {
    
    if(colIdx === 5 && initialRows && initialRows.userStatus && initialRows.userStatus.length > 0) { 

      let status: any = [{id: 0, value: t("No_Status") }];
      initialRows.userStatus.map((x: any) => {
        status.push({id : x.id, value: x.name });
      });

      return (
        <div>
          {/* <CBXMultiSelectForDatatable 
            width = {150} 
            option={status} 
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
            onChange={(e: any, value : any) => changeMultiselect(e, value, colIdx)}
            onSelectedClear = {() => onSelectedClear(colIdx)}
            isCheckBox={true}
          /> */}
          <CBXMultiCheckBoxDataFilter 
            width = {100} 
            percentage={true}
            option={status} 
            //defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
            onChange={(value : any) => changeMultiselect(value, colIdx)}
            onSelectedClear = {() => onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            selectAllLabel="All"
          />
        </div>
      )
    } 

  }

  const onSelectedIndividualClear = (headCells: HeadCellProps[], colIdx: number) => {
    let headCellReset = headCells.map((headCell: HeadCellProps, index: number) => {
      if(colIdx === index)
        headCell.headerArray = [{ value: "" }];
      return headCell;
    });
    return headCellReset;
  };

  const onSelectedClear = (colIdx: number) => {
    setIsSearchableOnChange(true)
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
    let headCellReset = onSelectedIndividualClear(headCells,colIdx);
    setHeadCells(headCellReset);
  }

  const changeMultiselect = (
    val: renderCheckMultiselect[],
    colIdx: number
  ) => {
    onSelection(val, colIdx);
    headCells[colIdx].headerArray = val;
    setIsSearchableOnChange(true)
  };

  const AnchorDisplay = (e: string) => {
    if(getModuleIds().includes(10)) {
      return anchorDisplay(e, "linkColor", urlList.filter((item:any) => item.name === urlNames.editUser)[0].url)
    }
    else{
      let lastid = e.lastIndexOf("_");
      let text =  e.substring(0,lastid)
      return textDisplay(text,"")
    }
  }

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: `${t("ID")}`,
      id: "id",
      align: "right",
      maxWidth: "80",
      dataComponent: () => null,
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: "80",
      width:"80"
    },
    {
      label: `${t("LoginId")}`,
      id: "loginId",
      align: "left",
      dataComponent: (e: string) => AnchorDisplay(e),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "230",
      visible: true,
      attributeName: "LoginId",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("First_Name")}`,
      id: "fName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "200",
      visible: true,
      attributeName: "FName",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Last_Name")}`,
      id: "lName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "200",
      visible: true,
      attributeName: "LName",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Email")}`,
      id: "email",
      align: "left",
      
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "270",
      visible: true,
      attributeName: "Email",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowParam: User[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
      minWidth: "200",
      visible: true,
      attributeName: "Status",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Last_Login")}`,
      id: "lastLogin",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      minWidth: "270",
      searchFilter: true,
      searchComponent: searchDate,
      visible: true,
      attributeName: "LastLogin",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    // {
    //     label: `${t("Groups")}`,
    //     id: "groups",
    //     align: "left",
    //     dataComponent: (e: string) => textDisplay(e, ""),
    //     sort: true,
    //     searchFilter: true,
    //     searchComponent: searchText,
    //     minWidth: "100",
    //     maxWidth: "100",
    //     visible: true,
    // }
    {
      label: `${t("Groups")}`,
      id: "userGroups",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, "elipcestext", "left"),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: User[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRow: any
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, true),
      minWidth: "230",
      
      attributeName: "UserGroups",
      attributeType: "List",
      attributeOperator: "contains"
     
    },
  ]);

  const searchAndNonSearchMultiDropDown = (
    rowsParam: User[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any,
    isSearchable: boolean
  ) => {

    if(colIdx === 7 && initialRows && initialRows.userGroups && initialRows.userGroups.length > 0) {   

      let status: any = [{id: 0, value: t("No_Groups") }];
        initialRows.userGroups.map((x: any) => {
          status.push({id : x.id, value: x.name });
        });

      return (
        // <CBXMultiSelectForDatatable 
        //   width = {245} 
        //   option={status} 
        //   value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
        //   onChange={(e: any, value : any) => changeMultiselect(e, value, colIdx)}
        //   onSelectedClear = {() => onSelectedClear(colIdx)}
        //   isCheckBox={true}
        //   isduplicate={true}
        //   multiple={true}
        // />
        <CBXMultiCheckBoxDataFilter 
            width = {100} 
            option={status} 
            //defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
            onChange={(value : any) => changeMultiselect(value, colIdx)}
            onSelectedClear = {() => onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
            percentage={true}
          />
      );
    }
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

  useEffect(() => {
    if(searchData.length > 0){
      setIsSearchable(true)
    }
    if(isSearchableOnChange)
      getFilteredUserData()
  }, [searchData]);

  useEffect(() => {
    if(selectedItems.length > 0)
      setSelectedActionRow(undefined)
  },[selectedItems])

  useEffect(() => {
    if (dateTime.colIdx !== 0) {
      if (
        dateTime.dateTimeObj.startDate !== "" &&
        dateTime.dateTimeObj.startDate !== undefined &&
        dateTime.dateTimeObj.startDate != null &&
        dateTime.dateTimeObj.endDate !== "" &&
        dateTime.dateTimeObj.endDate !== undefined &&
        dateTime.dateTimeObj.endDate != null
      ) {
        let newItem = {
          columnName: headCells[dateTime.colIdx].id.toString(),
          colIdx: dateTime.colIdx,
          value: [dateTime.dateTimeObj.startDate, dateTime.dateTimeObj.endDate],
        };
        setSearchData((prevArr) =>
          prevArr.filter(
            (e) => e.columnName !== headCells[dateTime.colIdx].id.toString()
          )
        );
        setSearchData((prevArr) => [...prevArr, newItem]);
      } else
        setSearchData((prevArr) =>
          prevArr.filter(
            (e) => e.columnName !== headCells[dateTime.colIdx].id.toString()
          )
        );
    }
  }, [dateTime]);

  const dataArrayBuilder = () => {
    if (reformattedRows !== undefined) {
      let dataRows: User[] = reformattedRows.rows;
      searchData.forEach((el: SearchObject) => {
        if (
          el.columnName === "loginId" ||
          el.columnName === "fName" ||
          el.columnName === "lName" ||
          el.columnName === "email" ||
          el.columnName === "userGroups" 
        )
          dataRows = onTextCompare(dataRows, headCells, el);
        if (el.columnName === "lastLogin")
          dataRows = onDateCompare(dataRows, headCells, el);

        if (el.columnName === "status") {
            dataRows = onMultipleCompare(dataRows, headCells, el);
            if (el.value.includes("No Status")) {
              reformattedRows.rows
                .filter((i:any) => i.status.length === 0)
                .map((x: User) => {
                  dataRows.push(x);
                });
            }
          }
      });
      setRows(dataRows);
    }
  };

  const resizeRowUsers = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getUsersInfoAsync(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const showToastMsg = (obj: any) => {
    toasterRef.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });

    if (obj.message !== undefined && obj.message !== "") {
      let notificationMessage: NotificationMessage = {
        title: t("User"),
        message: obj.message,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
  };

  const history = useHistory();

  const CreateUserForm = () => {
    history.push(urlList.filter((item:any) => item.name === urlNames.createUser)[0].url);
    RemoveSidePanelClass()
  }

  const getFilteredUserData = () => {
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
        dispatch(getUsersInfoAsync(pageiGrid));
      
      setIsSearchable(false)
      setIsSearchableOnChange(false)
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
      getFilteredUserData()
    }
  }
  const handleBlur = () => {
    if(isSearchable) {     
      getFilteredUserData()
    }
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className="crxManageUsers manageUsersIndex ExpandViewOverlay" onKeyDown={handleKeyDown}> 
			<CRXToaster ref={toasterRef}/>
      {rows && (
        <CRXDataTable
          id="userDataTable"
          actionComponent={
            
            <UserActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              showToastMsg={(obj: any) => showToastMsg(obj)}
            />
           
          }
          toolBarButton={
            <>
            <Restricted moduleId={9}>
              <CRXButton
                id={"createUser"}
                className="primary manageUserBtn" 
                onClick={CreateUserForm}
              >
                  {t("Create_User")}
              </CRXButton>
              </Restricted>
              {/* <CRXButton className="secondary manageUserBtn mr_L_10" onClick={() => getFilteredUserData()}> {t("Filter")} </CRXButton> */}
            </>
          }
          getRowOnActionClick={(val: User) => setSelectedActionRow(val)}
          showToolbar={true}
          dataRows={rows}
          headCells={headCells}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          allowDragableToList={false}
          className="ManageUsersDataTable TableWithCheck"
          onClearAll={clearAll}
          getSelectedItems={(v: User[]) => setSelectedItems(v)}
          onResizeRow={resizeRowUsers}
          onHeadCellChange={onSetHeadCells}
          initialRows={reformattedRows}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          dragVisibility={false}
          showCheckBoxes={true}
          showActionCol={true}
          showActionSearchHeaderCell={true}
          showCountText={false}
          showCustomizeIcon={true}
          showTotalSelectedText={false}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage= {(page:any) => setPage(page)}
          setRowsPerPage= {(rowsPerPage:any) => setRowsPerPage(rowsPerPage)}
          totalRecords={users.totalCount}
          setSortOrder={(sort:any) => sortingOrder(sort)}
          //Please dont miss this block.
          offsetY={119}
          stickyToolbar={130}
          searchHeaderPosition={223}
          dragableHeaderPosition={188}
          overlay={true}
          //End here
          showExpandViewOption={true}
          presetPerUser={userId}
        />
      )}
      
    </div>
    </ClickAwayListener>
  );
};

export default User;
