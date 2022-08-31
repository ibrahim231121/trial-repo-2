
import React, { useEffect } from "react";
import { CRXDataTable, CRXColumn, CRXGlobalSelectFilter } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import { getUsersInfoAsync, getUsersIdsAsync } from "../../../../../Redux/UserReducer";
import { RootState } from "../../../../../Redux/rootReducer";
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
    PageiGrid
} from "../../../../../GlobalFunctions/globalDataTableFunctions";
import TextSearch from "../../../../../GlobalComponents/DataTableSearch/TextSearch";
import { CRXButton } from "@cb/shared";
import multitextDisplay from "../../../../../GlobalComponents/Display/MultiTextDisplay";
import MultSelectiDropDown from "../../../../../GlobalComponents/DataTableSearch/MultSelectiDropDown";

type User = {
    id: number;
    userName: string,
    firstName: string,
    lastName: string,
    groups: string[]
}
type infoProps = {
    ids: Number[],
    onChangeUserIds: any
}
interface renderCheckMultiselect {
    label?: string,
    id?: string,

}


const User: React.FC<infoProps> = ({ ids, onChangeUserIds }) => {
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();
    const users: any = useSelector((state: RootState) => state.userReducer.usersInfo);
    const userIds: any = useSelector((state: RootState) => state.userReducer.userIds);
    // const [idValue, setIdValue] = React.useState<Number[]>(ids);
    const [rows, setRows] = React.useState<User[]>([]);
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<User[]>([]);
    const [reformattedRows, setReformattedRows] = React.useState<User[]>([]);
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
        size: rowsPerPage
    })

    React.useEffect(() => {
        
        dispatch(getUsersInfoAsync(pageiGrid));
        dispatch(getUsersIdsAsync());
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
                    groups: user.userGroups != null ? user.userGroups.split(',').map((x: string) => {
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
        setReformattedRows(userRows);
    }

    React.useEffect(() => {
        if (rows.length > 0) 
            onChangeUserIds(selectedItems.map(x => x.id));
    }, [selectedItems]);

    React.useEffect(() => { 
        if(userIds.data && userIds.data.length > 0)
            setData()
    }, [users.data, userIds.data]);

    useEffect(() => {
        if(paging){
          dispatch(getUsersInfoAsync(pageiGrid));
          dispatch(getUsersIdsAsync());
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
    function findUniqueValue(value: any, index: any, self: any) {
        return self.indexOf(value) === index;
    }
    const multiSelectCheckbox = (rowParam: User[],headCells: HeadCellProps[], colIdx: number, initialRows:User[]) => {

        if(colIdx === 4) {
            
        let groupNames: any = [];

        if(initialRows.length > 0) {
            initialRows.map((x: User) => {
                groupNames.push(...x.groups);
            });
        }

        groupNames = groupNames.filter(findUniqueValue);
        let groups: any = [{ label: t("No_Groups")}];
        groupNames.map((x: string) => { groups.push({ label: x}) })
        
        const settingValues = (headCell: HeadCellProps) => {
            let val: any = []
            if(headCell.headerArray !== undefined) 
                val = headCell.headerArray.filter(v => v.value !== "").map(x => x.value)
            else 
                val = []
            return val
        }
    
        return (
            <div>
                
                <CRXGlobalSelectFilter
                    id="multiSelect"
                    multiple={true}
                    value={settingValues(headCells[colIdx])}
                    onChange={(e: React.SyntheticEvent, option: renderCheckMultiselect[]) => { return changeMultiselect(e, option, colIdx) }}
                    options={groups}
                    CheckBox={true}
                    checkSign={false}
                    open={open}
                    theme="dark"
                    clearSelectedItems={(e: React.SyntheticEvent, options: renderCheckMultiselect[]) => deleteSelectedItems(e, options)}
                    getOptionLabel={(option: renderCheckMultiselect) => option.label ? option.label : " "}
                    getOptionSelected={(option: renderCheckMultiselect, label: renderCheckMultiselect) => option.label === label.label}
                    onOpen={(e: React.SyntheticEvent) => { return openHandler(e) }}
                    noOptionsText={t("No_Groups")}
                />
            </div>
        )
        }

    }

    const changeMultiselect = (e: React.SyntheticEvent, val: renderCheckMultiselect[], colIdx: number) => {
        let value: any[] = val.map((x) => {
            let item = {
                value: x.label
            }
            return item
        })
        onSelection(value, colIdx)
        headCells[colIdx].headerArray = value;
    }
    const deleteSelectedItems = (e: React.SyntheticEvent, options: renderCheckMultiselect[]) => {
        setSearchData([]);
        let headCellReset = onClearAll(headCells);
        setHeadCells(headCellReset);
    }
    const openHandler = (_: React.SyntheticEvent) => {
        
        //setOpen(true)
    }
    //
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
            maxWidth: "80",
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
            maxWidth: "360",
            visible: true,
        },
        {
            label: t("First_Name"),
            id: "firstName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "200",
            maxWidth: "325",
            visible: true,
        },
        {
            label: t("Last_Name"),
            id: "lastName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "200",
            maxWidth: "450",
            visible: true,
        },
        {
            label: t("Groups"),
            id: "groups",
            align: "left",
            dataComponent: (e: string[]) => multitextDisplay(e, "data_table_fixedWidth_wrapText"),
            sort: true,
            searchFilter: true,
            searchComponent: (rowData: User[], columns: HeadCellProps[], colIdx: number, initialRows:User[]) => multiSelectCheckbox(rowData, columns, colIdx, initialRows),
            minWidth: "200",
            maxWidth: "400",
            visible: true,
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
        if(searchData.length > 0)
            dataArrayBuilder();
    }, [searchData]);

    const dataArrayBuilder = () => {
        if (reformattedRows !== undefined) {
            let dataRows: User[] = reformattedRows;
            searchData.forEach((el: SearchObject) => {
                if (el.columnName === "userName" || el.columnName === "firstName" || el.columnName === "lastName" || el.columnName === "email" || el.columnName === "status")
                    dataRows = onTextCompare(dataRows, headCells, el);
                if (el.columnName === "lastLogin")
                    dataRows = onDateCompare(dataRows, headCells, el);
                if (el.columnName === "groups") {
                    dataRows = onMultiToMultiCompare(dataRows, headCells, el);
                    if(el.value.includes("No Groups")) {
                        reformattedRows.filter(i => i.groups.length === 0).map((x:User) => {
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
        setSearchData([]);
        let headCellReset = onClearAll(headCells);
        setHeadCells(headCellReset);
    };

    const onSetHeadCells = (e: HeadCellProps[]) => {
        let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
        setHeadCells(headCellsArray);
    };

    useEffect(() => {
        setPageiGrid({...pageiGrid, page:page, size:rowsPerPage}); 
        setPaging(true)
    
    },[page, rowsPerPage])

    return (
        <div className="userDataTableParent ">
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
                    offsetY={45}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage= {(page:any) => setPage(page)}
                    setRowsPerPage= {(rowsPerPage:any) => setRowsPerPage(rowsPerPage)}
                    totalRecords={500}
                />
            )
            }
        </div>
    )
}

export default User
