import React, { useEffect, useRef, useState } from "react";
import { CRXDataTable, CRXColumn, CRXToaster, CRXGlobalSelectFilter } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { useDispatch, useSelector } from "react-redux";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
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
  GridFilter
} from "../../../GlobalFunctions/globalDataTableFunctions";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { CRXButton } from "@cb/shared";
import UserActionMenu from "./UserActionMenu";
import { dateOptionsTypes } from "../../../utils/constant";
import multitextDisplay from "../../../GlobalComponents/Display/MultiTextDisplay";
import MultSelectiDropDown from "../../../GlobalComponents/DataTableSearch/MultSelectiDropDown";
import { CRXModalDialog } from "@cb/shared";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import moment from "moment";
import Restricted from "../../../ApplicationPermission/Restricted";
import "./userIndex.scss";

type User = {
  id: string;
  userName: string;
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
  label?: string,
  id?: string,

}

let gridFilter: GridFilter = {
  logic: "and",
  filters: []
}

// type PageiGrid = {
//   gridFilter: GridFilter,
//   page: number,
//   size: number
// }

const User: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  // const [page, setPage] = React.useState<number>(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  // const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
  //     gridFilter: {
  //       logic: "and",
  //       filters: []
  //     },
  //     page: page,
  //     size: rowsPerPage
  // })
  
  
  
  React.useEffect(() => {
    dispatch(getUsersInfoAsync(gridFilter));

    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "userDataTable");
  }, []);

  const users: any = useSelector(
    (state: RootState) => state.userReducer.usersInfo
  );
  const [rows, setRows] = React.useState<User[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<User[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<User[]>();
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [selectedActionRow, setSelectedActionRow] = React.useState<User>();

  const setData = () => {
    let userRows: User[] = [];
    if (users && users.length > 0) {
      userRows = users.map((user: any) => {
        return {
          id: user.recId,
          userName: user.userName,
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
    setReformattedRows(userRows);
  };

  React.useEffect(() => {
    setData();
  }, [users]);

  const getFilteredUserData = () => {

    searchData.forEach((item:any, index:number) => {
        let x: GridFilter = {
          operator: item.value.length > 1 ? "between" : "contains",
          field: item.columnName.charAt(0).toUpperCase() + item.columnName.slice(1),
          value: item.value.length > 1 ? item.value.join('@') : item.value[0]
        }
        gridFilter.filters?.push(x)
    })

    dispatch(getUsersInfoAsync(gridFilter));

    // gridFilter = {
    //   filters: [
    //     // {
    //     //   operator: "contains",
    //     //   field: "assets.master.camera",
    //     //   value: "YourCam"
    //     // },
    //     {
    //       operator: "contains",
    //       field: "UserName",
    //       value: "faisal"
    //     },
    //     // {
    //     //   operator: "contains",
    //     //   field: "fName",
    //     //   value: "Faisal"
    //     // },
    //     {
    //         operator: "between",
    //         field: "LastLogin",
    //         //value: "2022-06-01T00:00:00+05:00"
    //         value: "2022-05-01T00:00:00+05:00@2022-06-30T23:59:00+05:00"
    //     }
    //   ]
    // }

    // console.log("grifFilter ", gridFilter)

    // const requestOptions = {
    //   method: 'Post',
    //   headers: { 'Content-Type': 'application/json', 'TenantId': '1'},
    //   body: JSON.stringify(gridFilter),
    // };
    // const resp = fetch("http://127.0.0.1:8085/Users/filter?Size=100&Page=1",requestOptions);
    // //const resp = fetch("http://127.0.0.1:8080/Evidences/filter?Size=100&Page=1",requestOptions);
    // if (resp) {
    //   const response = resp
    //   console.log("Resp", response)
    //   return response;
    // }
  }

  // useEffect(() => {
  //   console.log("Row per Page ")
  //   setPageiGrid({...pageiGrid, size:rowsPerPage}); 
  // },[rowsPerPage])

  // useEffect(() => {
  //   console.log("page ")
  //   setPageiGrid({...pageiGrid, page:page}); 
  // },[page])

  // useEffect(() => {
  //   console.log("pageiGrid ", pageiGrid)
  // },[pageiGrid])

  const searchText = (
    rowsParam: User[],
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
          prevArr.filter(
            (e) => e.columnName !== headCells[colIdx].id.toString()
          )
        );
      }
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
            reformattedRows !== undefined ? reformattedRows[0].lastLogin : "",
          endDate:
            reformattedRows !== undefined
              ? reformattedRows[reformattedRows.length - 1].lastLogin
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
  const multiSelectCheckbox = (rowParam: User[],headCells: HeadCellProps[], colIdx: number, initialRows:User[]) => {

    if(colIdx === 5) {
      
       
        let statuslist: any = [];

        if (initialRows !== undefined) {
          if (initialRows.length > 0) {
            initialRows.map((x: User) => {
              statuslist.push(x.status);
            });
          }
        }
       
        statuslist = statuslist.filter(findUniqueValue);
        let status: any = [{ label: t("No_Status") }];
        statuslist.map((x: string) => {
          status.push({ label: x });
        });
        const settingValues = (headCell: HeadCellProps) => {
          let val: any = [];
          if (headCell.headerArray !== undefined)
            val = headCell.headerArray
              .filter((v) => v.value !== "")
              .map((x) => x.value);
          else val = [];
          return val;
        };

    return (
        <div>
            <CRXGlobalSelectFilter
            id="multiSelect"
            multiple={true}
            value={settingValues(headCells[colIdx])}
            onChange={(
              e: React.SyntheticEvent,
              option: renderCheckMultiselect[]
            ) => {
              return changeMultiselect(e, option, colIdx);
            }}
            options={status}
            CheckBox={true}
            checkSign={false}
            open={open}
            theme="dark"
            clearSelectedItems={(
              e: React.SyntheticEvent,
              options: renderCheckMultiselect[]
            ) => deleteSelectedItems(e, options)}
            getOptionLabel={(option: renderCheckMultiselect) =>
              option.label ? option.label : " "
            }
            getOptionSelected={(
              option: renderCheckMultiselect,
              label: renderCheckMultiselect
            ) => option.label === label.label}
            onOpen={(e: React.SyntheticEvent) => {
              return openHandler(e);
            }}
            noOptionsText={t("No_Status")}
          />
        </div>
    )
    }

}
const changeMultiselect = (
  e: React.SyntheticEvent,
  val: renderCheckMultiselect[],
  colIdx: number
) => {
  let value: any[] = val.map((x) => {
    let item = {
      value: x.label,
    };
    return item;
  });
  onSelection(value, colIdx);
  headCells[colIdx].headerArray = value;
};
const deleteSelectedItems = (
  e: React.SyntheticEvent,
  options: renderCheckMultiselect[]
) => {
  setSearchData([]);
  let headCellReset = onClearAll(headCells);
  setHeadCells(headCellReset);
};
const openHandler = (_: React.SyntheticEvent) => {
 
  //setOpen(true)
};

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
    },
    {
      label: `${t("User_Name")}`,
      id: "userName",
      align: "left",
      // width: "174",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "150",
      maxWidth: "174",
      visible: true,
    },
    {
      label: `${t("First_Name")}`,
      id: "fName",
      align: "left",
      //width: "156",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "130",
      maxWidth: "150",
      visible: true,
    },
    {
      label: `${t("Last_Name")}`,
      id: "lName",
      align: "left",
      //width: "156",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "130",
      maxWidth: "150",
      visible: true,
    },
    {
      label: `${t("Email")}`,
      id: "email",
      align: "left",
      
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "200",
      maxWidth: "263",
      visible: true,
    },
    {
      label: `${t("Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowParam: User[], columns: HeadCellProps[], colIdx: number, initialRow: User[]) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
      
      minWidth: "112",
      maxWidth: "120",
      visible: true,
    },
    {
      label: `${t("Last_Login")}`,
      id: "lastLogin",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      minWidth: "130",
      maxWidth: "161",
      searchFilter: true,
      searchComponent: searchDate,
      visible: true,
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
      dataComponent: (e: string[]) => multitextDisplay(e, "elipcestext"),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: User[],
        columns: HeadCellProps[],
        colIdx: number
      ) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, true),
      minWidth: "430",
      maxWidth : "430"
     
    },
  ]);
  const searchAndNonSearchMultiDropDown = (
    
    rowsParam: User[],
    headCells: HeadCellProps[],
    colIdx: number,
    isSearchable: boolean
  ) => {
    const onSetSearchData = () => {
      setSearchData((prevArr) =>
        prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
      );
    };
    const onSetHeaderArray = (v: ValueString[]) => {
      headCells[colIdx].headerArray = v;
    };

    const multiselectProps = {
      marginLeft: "4px",
      paddingRight: "7px",
      marginRight: "7px",
      paddingLeft: "7px",
    };
    const parentStye = {
      width: "281px",
      margin: "0px 0px 0px 4px",
    };

    const listwidth = {
      width: "279px",
      marginTop: "-4px",
    };
    return (
      <MultSelectiDropDown
        headCells={headCells}
        colIdx={colIdx}
        reformattedRows={
          reformattedRows !== undefined ? reformattedRows : rowsParam
        }
        // reformattedRows={reformattedRows}
        isSearchable={isSearchable}
        onMultiSelectChange={onSelection}
        onSetSearchData={onSetSearchData}
        onSetHeaderArray={onSetHeaderArray}
        checkedStyle={multiselectProps}
        parentStye={parentStye}
        widthNoOption={listwidth}
      />
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
  useEffect(() => {
    //dataArrayBuilder();
  }, [searchData]);

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
      let dataRows: User[] = reformattedRows;
      searchData.forEach((el: SearchObject) => {
        if (
          el.columnName === "userName" ||
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
              reformattedRows
                .filter((i) => i.status.length === 0)
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
    gridFilter.filters = []
    dispatch(getUsersInfoAsync(gridFilter));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  const toasterRef = useRef<typeof CRXToaster>(null);

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
    dispatch(getUsersInfoAsync(gridFilter));
  };

  const history = useHistory();

  const CreateUserForm = () => {
    history.push(urlList.filter((item:any) => item.name === urlNames.createUser)[0].url);
  }

  return (
    <div className="crxManageUsers switchLeftComponents manageUsersIndex">
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
              <CRXButton
                id={"createUser"}
                className="primary manageUserBtn" 
                onClick={CreateUserForm}
              >
                  {t("Create_User")}
              </CRXButton>
              <CRXButton className="secondary manageUserBtn mr_L_10" onClick={() => getFilteredUserData()}> {t("Filter")} </CRXButton>
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
          className="ManageUsersDataTable"
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
          showActionSearchHeaderCell={false}
          showCountText={false}
          showCustomizeIcon={true}
          showTotalSelectedText={false}
          offsetY={209}
          showHeaderCheckAll={true}
          // page={page}
          // rowsPerPage={rowsPerPage}
          // setPage= {(e:any) => setPage(e)}
          // setRowsPerPage= {(e:any) => setRowsPerPage(e)}
        />
      )}
    </div>
  );
};

export default User;
