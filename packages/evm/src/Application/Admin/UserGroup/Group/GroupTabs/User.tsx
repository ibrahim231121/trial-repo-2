
import React, { useEffect } from "react";
import { CRXDataTable, CBXMultiSelectForDatatable } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import { getUsersInfoAsync, getUsersIdsAsync, getAllUserGroupKeyValuesAsync } from "../../../../../Redux/UserReducer";
import { RootState } from "../../../../../Redux/rootReducer";
import "./GroupPermissionUsers.scss";
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
    onMultiToMultiCompare,
    GridFilter,
    PageiGrid
} from "../../../../../GlobalFunctions/globalDataTableFunctions";
import TextSearch from "../../../../../GlobalComponents/DataTableSearch/TextSearch";
import { CRXButton } from "@cb/shared";
import multitextDisplay from "../../../../../GlobalComponents/Display/MultiTextDisplay";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

type User = {
    id: number;
    userName: string,
    firstName: string,
    lastName: string,
    userGroups: string[]
}
type infoProps = {
    ids: Number[],
    onChangeUserIds: any
}
interface renderCheckMultiselect {
    value: string,
    id: string,

}


const User: React.FC<infoProps> = ({ ids, onChangeUserIds }) => {
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();
    const users: any = useSelector((state: RootState) => state.userReducer.usersInfo);
    const userIds: any = useSelector((state: RootState) => state.userReducer.userIds);
    const userGroups : any = useSelector((state: RootState) => state.userReducer.userGroups);
    // const [idValue, setIdValue] = React.useState<Number[]>(ids);
    const [rows, setRows] = React.useState<User[]>([]);
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("UserName");
    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<User[]>([]);
    const [reformattedRows, setReformattedRows] = React.useState<any>([]);
    const [open, setOpen] = React.useState<boolean>(false)
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

    React.useEffect(() => {
        dispatch(getAllUserGroupKeyValuesAsync());
        let headCellsArray = onSetHeadCellVisibility(headCells);
        setHeadCells(headCellsArray);
        onSaveHeadCellData(headCells, "group-userDataTable");
    }, []);

    const getUserRows = (users: User[]) => {
        let userRows: User[] = [];
        if (users && users.length > 0) {
            userRows = users.map((user: any) => {
                return {
                    id: user.recId,
                    userName: user.userName,
                    firstName: user.fName,
                    lastName: user.lName,
                    userGroups: user.userGroups != null ? user.userGroups.split(',').map((x: string) => {
                        return x.trim();
                    }) : []
                }
            })
        }
        return userRows
    }

    const setData = () => {
        let userRows = getUserRows(users.data)
        let userIdsRows = getUserRows(userIds.data)

        let selectedUsers = userIdsRows.filter(x => {
            if (ids.indexOf(x.id) > -1)
                return x;
        });

        setSelectedItems(selectedUsers);
        setRows(userRows)
        //setReformattedRows(userRows);
        setReformattedRows({...reformattedRows, rows: userRows, userGroups: userGroups});
    }

    React.useEffect(() => {
        if (rows.length > 0) 
            onChangeUserIds(selectedItems.map(x => x.id));
    }, [selectedItems]);

    React.useEffect(() => { 
        if(userIds.data && userIds.data.length > 0)
            setData()
    }, [users.data, userIds.data, userGroups]);

    useEffect(() => {
        const overlay : any = document.getElementsByClassName("overlayPanel")
        if(paging){
          dispatch(getUsersInfoAsync(pageiGrid));
          dispatch(getUsersIdsAsync());
        }
        setPaging(false)
        overlay && (overlay[0].style.width = "28px")
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

    const multiSelectCheckbox = (rowParam: User[],headCells: HeadCellProps[], colIdx: number, initialRows:any) => {

        if(colIdx === 4 && initialRows && initialRows.userGroups && initialRows.userGroups.length > 0) {   

            let status: any = [{id: 0, value: t("No_Groups") }];
                initialRows.userGroups.map((x: any) => {
                status.push({id : x.id, value: x.name });
                });
        
            return (
                <CBXMultiSelectForDatatable 
                    width = {430} 
                    option={status} 
                    value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
                    onChange={(e: any, value : any) => changeMultiselect(e, value, colIdx)}
                    onSelectedClear = {() => onSelectedClear(colIdx)}
                    isCheckBox={true}
                    isduplicate={true}
                />
            );
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
        setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
        let headCellReset = onSelectedIndividualClear(headCells,colIdx);
        setHeadCells(headCellReset);
      }

    const changeMultiselect = (e: React.SyntheticEvent, val: renderCheckMultiselect[], colIdx: number) => {
        onSelection(val, colIdx)
        headCells[colIdx].headerArray = val;
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
            
        },
        {
            label: t("User_Name"),
            id: "userName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "230",
           
            visible: true,
            attributeName: "UserName",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: t("First_Name"),
            id: "firstName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "380",
            maxWidth: "381",
            visible: true,
            attributeName: "FName",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: t("Last_Name"),
            id: "lastName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "380",
            maxWidth: "381",
            visible: true,
            attributeName: "LName",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: t("Groups"),
            id: "userGroups",
            align: "left",
            dataComponent: (e: string[]) => multitextDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: (rowData: User[], columns: HeadCellProps[], colIdx: number, initialRows:any) => multiSelectCheckbox(rowData, columns, colIdx, initialRows),
            minWidth: "400",
            visible: true,
            attributeName: "UserGroups",
            attributeType: "List",
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
        //dataArrayBuilder();
        console.log("searchData", searchData)
        if(searchData.length > 0)
            setIsSearchable(true)
      }, [searchData]);

    const dataArrayBuilder = () => {
        if (reformattedRows !== undefined) {
            let dataRows: User[] = reformattedRows.rows;
            searchData.forEach((el: SearchObject) => {
                if (el.columnName === "userName" || el.columnName === "firstName" || el.columnName === "lastName" || el.columnName === "email" || el.columnName === "status")
                    dataRows = onTextCompare(dataRows, headCells, el);
                if (el.columnName === "lastLogin")
                    dataRows = onDateCompare(dataRows, headCells, el);
                if (el.columnName === "userGroups") {
                    dataRows = onMultiToMultiCompare(dataRows, headCells, el);
                    if(el.value.includes("No Groups")) {
                        reformattedRows.rows.filter((i:any) => i.userGroups.length === 0).map((x:User) => {
                            dataRows.push(x)
                        })
                        
                    }
                }

            });
            setRows(dataRows);
        }
    };

    const resizeRowUserTab = (e: { colIdx: number; deltaX: number }) => {
        let headCellReset = onResizeRow(e, headCells);
        setHeadCells(headCellReset);
    };

    const clearAll = () => {
        const clearButton:any = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
        clearButton && clearButton.click()
        setOpen(false)
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
    }

    useEffect(() => {
        setPageiGrid({...pageiGrid, page:page, size:rowsPerPage, gridSort:{field: orderBy, dir: order}}); 
        setPaging(true)
    
    },[page, rowsPerPage])

    const sortingOrder = (sort: any) => {
        setPageiGrid({...pageiGrid, gridSort:{field: sort.orderBy, dir:sort.order}})
        setPaging(true)
    }

    const handleKeyDown = (event:any) => {
        if (event.key === 'Enter') {
          getFilteredUserData()
        }
    }
    const handleBlur = () => {
        if(isSearchable)
            getFilteredUserData()
    }

    return (
        <ClickAwayListener onClickAway={handleBlur}>
        <div className="userDataTableParent  groupPermissionInnerPage" onKeyDown={handleKeyDown}>
            {rows && (
                    <CRXDataTable 
                        id="group-userDataTable"
                        actionComponent={() => { }}
                        // toolBarButton={
                        //     <CRXButton className="secondary manageUserBtn mr_L_10" onClick={() => getFilteredUserData()}> {t("Filter")} </CRXButton>
                        // }
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
                        className="ManageAssetDataTable usersGroupDataTable groupsAndPermissions"
                        onClearAll={clearAll}
                        getSelectedItems={(v: User[]) => setSelectedItems(v)}
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
                        //Please dont miss this block.
                        offsetY={-33}
                        topSpaceDrag = {-1}
                        searchHeaderPosition={102}
                        dragableHeaderPosition={67}
                        stickyToolbar={0}
                        //End here
                        page={page}
                        rowsPerPage={rowsPerPage}
                        setPage= {(page:any) => setPage(page)}
                        setRowsPerPage= {(rowsPerPage:any) => setRowsPerPage(rowsPerPage)}
                        totalRecords={users.totalCount}
                        setSortOrder={(sort:any) => sortingOrder(sort)}
                    />
                )   
            }
        </div>
        </ClickAwayListener>
    )
}

export default User
