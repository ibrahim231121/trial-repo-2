import { CRXDataTable } from "@cb/shared";
import {
    SearchObject,
    ValueString,
    HeadCellProps,
    onSetSearchDataValue,
    RemoveSidePanelClass,
    PageiGrid,
    GridFilter,
    onResizeRow,
    Order,
    onClearAll,
    onSetSingleHeadCellVisibility,
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import React, { useEffect } from "react";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { AlprCapturePlateInfo } from "../../../../utils/Api/models/AlprCapturePlateInfo";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import { useTranslation } from "react-i18next";
import "./AlprCapture.scss"
import { CRXMultiSelectBoxLight } from "@cb/shared";
import { DateTimeComponent } from "../../../../GlobalComponents/DateTime";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../../Redux/UserReducer";
import { getAllAlprCapturePlatesInfo } from "../../../../Redux/AlprCapturePlateReducer";
import moment from "moment";
import { basicDateDefaultValue, dateOptionsTypes } from "../../../../utils/constant";
import { GetAlprCapturePayload } from "../../ALPRTypes";
import dateDisplayFormat from "../../../../GlobalFunctions/DateFormat";
import { CRXColumn } from "@cb/shared";
import multitextDisplay from "../../../../GlobalComponents/Display/MultiTextDisplay";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { CBXMultiSelectForDatatable } from "@cb/shared";
import { ClickAwayListener } from "@material-ui/core";
import { GetAllHotListData } from "../../../../Redux/AlprHotListReducer";

const states = [
    {id: 1,label:"TX"},  
    {id: 2,label:"NY"},  
    {id: 3,label:"CA"},  
    {id: 4,label:"FL"},  
    {id: 5,label:"AL"},  
    {id: 6,label:"AK"},  
    {id: 7,label:"AZ"},  
    {id: 8,label:"AR"},  
    {id: 9,label:"CO"},  
    {id: 10,label:"CT"},  
    {id: 12,label:"DE"},  
    {id: 13,label:"GA"},  
    {id: 14,label:"HI"},  
    {id: 15,label:"ID"},  
    {id: 16,label:"IL"},  
    {id: 17,label:"IN"},  
    {id: 18,label:"IA"},  
    {id: 19,label:"KS"},  
    {id: 20,label:"KY"},  
    {id: 21,label:"LA"},  
    {id: 22,label:"ME"},  
    {id: 23,label:"MD"},  
    {id: 24,label:"MA"},  
    {id: 25,label:"MI"},  
    {id: 26,label:"MN"},  
    {id: 27,label:"MS"},  
    {id: 28,label:"MO"},  
    {id: 29,label:"MT"},  
    {id: 30,label:"NE"},  
    {id: 31,label:"NV"},  
    {id: 32,label:"NH"},  
    {id: 33,label:"NJ"},  
    {id: 34,label:"NM"},  
    {id: 35,label:"NC"},  
    {id: 36,label:"ND"},  
    {id: 37,label:"OH"},  
    {id: 38,label:"OK"},  
    {id: 39,label:"OR"},  
    {id: 40,label:"PA"},  
    {id: 41,label:"RI"},  
    {id: 42,label:"SC"},  
    {id: 43,label:"SD"},  
    {id: 44,label:"TN"},  
    {id: 45,label:"UT"},  
    {id: 46,label:"VT"},  
    {id: 47,label:"VA"},  
    {id: 48,label:"WA"},  
    {id: 49,label:"WV"},  
    {id: 50,label:"WI"},  
    {id: 51,label:"WY"}
  
  ]

const AlprCapture = () => {
    const [capturedPlatesRows, setCapturedPlatesRowsState] = React.useState<AlprCapturePlateInfo[]>([]);
    const [reformattedRows, setReformattedRows] = React.useState<any>();
    const dispatch = useDispatch();
    const userInfos:any = useSelector((state:RootState) => state.userReducer.usersInfo)
    const hotListInfos:any = useSelector((state:RootState) => state.hotListReducer.HotList)
    const capturedPlates:any = useSelector((state:RootState)=> state.alprCapturePlateReducer.capturePlateInfos)
    const [usersData, setUsersDataState] = React.useState<any[]>([]);
    const [hotListData, setHotListDataState] = React.useState<any[]>([]);
    const [usersFilterData, setUsersFilterDataState] = React.useState<any[]>([]);
    const [selectedUser, setSelectedUserState] = React.useState<any>({});
    const [selectedHotList, setSelectedHotListState] = React.useState<any>({});
    const [selectedDateTimeRange, setSelectedDateTimeRangeState] = React.useState<DateTimeObject>({
        startDate: moment().startOf("day").subtract(10000, "days").set("second", 0).format(),
        endDate: moment().endOf("day").set("second", 0).format(),
        value: basicDateDefaultValue,
        displayText: basicDateDefaultValue
      });

    const [selectedDateTimeRangeForFilter, setSelectedDateTimeRangeStateForFilter] = React.useState<DateTimeObject>({
        startDate: moment().startOf("day").subtract(10000, "days").set("second", 0).format(),
        endDate: moment().endOf("day").set("second", 0).format(),
        value: basicDateDefaultValue,
        displayText: basicDateDefaultValue
    });

    const userDataLoadedRef = React.useRef<boolean>(false);
    const hotListDataLoadedRef = React.useRef<boolean>(false);
    const isSearchable = React.useRef<boolean>(false);
    const isSearchableOnChange = React.useRef<boolean>(false);

    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const { t } = useTranslation<string>();
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("NumberPlate");
    const [selectedItems, setSelectedItems] = React.useState<AlprCapturePlateInfo[]>([]);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
    const [page, setPage] = React.useState<number>(0);
    const [getAlprCapturePayload, setAlprCapturePayloadState] = React.useState<GetAlprCapturePayload>({
        pageiGrid:{
            gridFilter: {
                logic: "and",
                filters: []
            },
            page: 0,
            size: 25,
            gridSort:{
                field: orderBy,
                 dir:order
                }
        },
        userId:selectedUser.id,
        startDate: moment(selectedDateTimeRange.startDate).toISOString(),
        endDate: moment(selectedDateTimeRange.endDate).toISOString(),
        hotListId:0
      })
    
    const USER_COLID:number = 6;
    const HOTLIST_COLID:number = 3;
    const STATES_COLID:number = 8;
    const CONFIDENCE_COLID:number = 7;
    const TICKET_NUMBER_COLID:number = 10;
    const LATITUDE_COLID:number = 11;
    const LONGITUDE_COLID:number = 12;


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
      let dateTimeObject: DateTimeProps = {
        dateTimeObj: {
          startDate: "",
          endDate: "",
          value: "",
          displayText: "",
        },
        colIdx: 0,
      };
  
    const onSetHeadCells = (e: HeadCellProps[]) => {
        let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
        setHeadCells(headCellsArray);

    };
    const resizeRowCaptureTemp = (e: { colIdx: number; deltaX: number }) => {
        let headCellReset = onResizeRow(e, headCells);
        setHeadCells(headCellReset);
    };
    const onSelection = (v: ValueString[], colIdx: number) => {
        if (v.length > 0) {
            for (let i = 0; i < v.length; i++) {
                let searchDataValue = onSetSearchDataValue(v, headCells, colIdx);

                setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));              
                
                setSearchData((prevArr) => [...prevArr, searchDataValue]);
            }
        } else {
            setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
        }
    }

    const onSelectedIndividualClear = (headCells: HeadCellProps[], colIdx: number) => {
        let headCellReset = headCells.map((headCell: HeadCellProps, index: number) => {
          if (colIdx === index)
            headCell.headerArray = [{ value: "" }];
          return headCell;
        });
        return headCellReset;
      };
    
      const onSelectedClear = (colIdx: number) => {
        isSearchableOnChange.current=true;
        setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
        let headCellReset = onSelectedIndividualClear(headCells, colIdx);
        setHeadCells(headCellReset);
      }

      const clearAll = () => {
        setAlprCapturePayloadState({
            ...getAlprCapturePayload,
            pageiGrid:{
                ...getAlprCapturePayload.pageiGrid,
                gridFilter:{
                    ...getAlprCapturePayload.pageiGrid.gridFilter,
                    filters:[]
                }
            }
        })
        setSearchData([]);
        let headCellReset = onClearAll(headCells);
        setHeadCells(headCellReset);
      };

    
  const searchDate = (
    rowsParam: AlprCapturePlateInfo[],
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
        const minCapturedDate = reformattedRows && reformattedRows.rowsDataItems ? reformattedRows.rowsDataItems.reduce((item1:AlprCapturePlateInfo, item2:AlprCapturePlateInfo) => {
            return (Date.parse(item1.capturedAt)) < (Date.parse(item2.capturedAt)) ? item1 : item2;
          }).capturedAt : "";

          const maxCapturedDate = reformattedRows && reformattedRows.rowsDataItems ? reformattedRows.rowsDataItems.reduce((item1:AlprCapturePlateInfo, item2:AlprCapturePlateInfo) => {
            return (Date.parse(item1.capturedAt)) > (Date.parse(item2.capturedAt)) ? item1 : item2;
          }).capturedAt : "";

      dateTimeObject = {
        dateTimeObj: {
          startDate: minCapturedDate,
          endDate:maxCapturedDate,
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

    return (
      <CRXColumn item xs={11} >
        <DateTimeComponent
          showCompact={false}
          reset={reset}
          dateTimeDetail={dateTimeObject.dateTimeObj}
          getDateTimeDropDown={(dateTime: DateTimeObject) => {
            dateTimeObject = {
                dateTimeObj: {
                  ...dateTime,
                },
                colIdx: colIdx,
              };
              setSelectedDateTimeRangeStateForFilter(dateTime);
              headCells[colIdx].headerObject = dateTime;
          }}
          dateOptionType={dateOptionsTypes.basicoptions}
        />
      </CRXColumn>
    );
  };

  const searchAndNonSearchMultiDropDown = (
    rowsParam: AlprCapturePlateInfo[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any,
    isSearchable: boolean
  ) => {

    if(colIdx === USER_COLID && initialRows && initialRows.usersData && initialRows.usersData.length > 0){
        let users: {id: number, value: string }[] = [];
        initialRows.usersData.map((x: any) => {
            let userRows = initialRows.rowsDataItems.filter((row: { user: any; })=>row.user == x.id);
            
            if(userRows && userRows.length > 0)
                users.push({id : x.id, value: x.label });
        });

        return (
            <CBXMultiCheckBoxDataFilter 
            width = {100} 
            option={users} 
            //defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
            onChange={(value : any) => { 
                isSearchableOnChange.current = true;               
                onSelection(value.map((user: { id: any; })=>{return {id: user.id, value: user.id}}), colIdx);
                headCells[colIdx].headerArray = value;
            }}
            onSelectedClear = {() =>  onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
            percentage={true}
          />);
    }
       
    if(colIdx === HOTLIST_COLID && initialRows && initialRows.hotListData && initialRows.hotListData.length > 0){
        let hotlists: {id: number, value: string }[] = [];
        initialRows.hotListData.map((x: any) => {
            if(x.id != 0)
                hotlists.push({id : x.id, value: x.label });
        });

        return (            
            <CBXMultiCheckBoxDataFilter 
            width = {100} 
            option={hotlists} 
            //defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
            onChange={(value : any) => {     
                if(!isSearchableOnChange.current){
                    isSearchableOnChange.current = true;          
                    onSelection(value.map((hotlist: { id: any; value:any})=>{return {id: hotlist.id, value: hotlist.value}}), colIdx);
                    headCells[colIdx].headerArray = value;
                } 
            }}
            onSelectedClear = {(value : any) => { 
                onSelectedClear(colIdx);
            }}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
            percentage={true}
          />);
    } 

    if(colIdx === STATES_COLID && initialRows && initialRows.states && initialRows.states.length > 0){
        let statesList: {id: number, value: string }[] = [];
        initialRows.states.map((x: any) => {
            statesList.push({id : x.id, value: x.label });
        });

        return (            
            <CBXMultiCheckBoxDataFilter 
            width = {100} 
            option={statesList} 
            //defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
            onChange={(value : any) => {     
                if(!isSearchableOnChange.current){
                    isSearchableOnChange.current = true;          
                    onSelection(value.map((state: { id: any; value:any})=>{return {id: state.id, value: state.value}}), colIdx);
                    headCells[colIdx].headerArray = value;
                } 
            }}
            onSelectedClear = {(value : any) => { 
                onSelectedClear(colIdx);
            }}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
            percentage={true}
          />);
    } 
  };

    const searchText = (rowsParam: AlprCapturePlateInfo[], headCell: HeadCellProps[], colIdx: number) => {
        const onChange = (valuesObject: ValueString[]) => {
            let filter = false;

            if((colIdx == CONFIDENCE_COLID || colIdx == TICKET_NUMBER_COLID || colIdx == LATITUDE_COLID || colIdx == LONGITUDE_COLID) &&
                valuesObject && valuesObject.length > 0){
                if(!isNaN(Number(valuesObject[0].value))){
                    filter = true;
                }
            }else{
                filter = true;
            }
            
            if(filter){
                headCells[colIdx].headerArray = valuesObject;
                onSelection(valuesObject, colIdx);
            }
        }
        return (
            <TextSearch headCells={headCell} colIdx={colIdx} onChange={onChange} />
        );
    };

    const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
        {
            label: t("ID"),
            id: "capturedPlateId",
            align: "right",
            dataComponent: () => null,
            sort: false,
            searchFilter: false,
            searchComponent: searchText,
            keyCol: true,
            visible: false,
            minWidth: "150",
            attributeName: "capturedPlateId",
            attributeType: "number"
        },
        {
            label: `${t("Plate")}`,
            id: "numberPlate",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "190",
            attributeName: "numberPlate",
            attributeType: "string",
            attributeOperator: "contains"
        },
        {
            label: `${t("Description")}`,
            id: "description",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "description",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("Hot_List")}`,
            id: "hotlistName",
            align: "center",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            //   searchComponent: (rowParam: HotListCaptureTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
            searchComponent: searchAndNonSearchMultiDropDown,
            minWidth: "180",
            attributeName: "HotlistName",
            attributeType: "List",
            attributeOperator: "contains"
        },
        {
            label: `${t("Captured")}`,
            id: "capturedAt",
            align: "left",
            dataComponent: dateDisplayFormat,
            sort: true,
            searchFilter: true,
            searchComponent: searchDate,
            minWidth: "220",
            attributeName: "CapturedAt",
            attributeType: "DateTime",
            attributeOperator: "between"
        },
        {
            label: `${t("Unit")}`,
            id: "unitId",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            //   searchComponent: (rowParam: HotListCaptureTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "unitId",
            attributeType: "String",
            attributeOperator: "contains"
        },
        {
            label: `${t("User")}`,
            id: "user",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: false,
            searchFilter: true,
            searchComponent: searchAndNonSearchMultiDropDown,
            minWidth: "180",
            attributeName: "UserId",
            attributeType: "List",
            attributeOperator: "contains"
        },
        {
            label: `${t("Confidence")}`,
            id: "confidence",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "150",
            attributeName: "Confidence",
            attributeType: "int",
            attributeOperator: "eq"
        }
        ,
        {
            label: `${t("State")}`,
            id: "stateName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchAndNonSearchMultiDropDown,
            minWidth: "180",
            attributeName: "StateName",
            attributeType: "List",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Notes")}`,
            id: "notes",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "notes",
            attributeType: "String",
            attributeOperator: "contains"
        }
        ,
        {
            label: `${t("Ticket_No")}`,
            id: "ticketNumber",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "TicketNumber",
            attributeType: "double",
            attributeOperator: "eq"
        }
        ,
        {
            label: `${t("Latitude")}`,
            id: "latitude",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "Latitude",
            attributeType: "double",
            attributeOperator: "eq"
        }
        ,
        {
            label: `${t("Longitude")}`,
            id: "longitude",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "Longitude",
            attributeType: "double",
            attributeOperator: "eq"
        }
        ,
        {
            label: `${t("Life_Span")}`,
            id: "lifeSpan",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: false,
            searchFilter: false,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "lifeSpan",
            attributeType: "String",
            attributeOperator: "contains"
        }
    ]);
   
    useEffect(()=>{
        let pageiGrid:PageiGrid = {
            gridFilter: {
                logic: "and",
                filters: []
            },
            page: 0,
            size: 1000,
        }
        dispatch(getUsersInfoAsync(pageiGrid))
    },[]);

    useEffect(()=>{
        let pageiGrid:PageiGrid = {
            gridFilter: {
                logic: "and",
                filters: []
            },
            page: 0,
            size: 1000,
            gridSort:{
                field: "name",
                 dir: "asc"
                }
        }
        dispatch(GetAllHotListData(pageiGrid))
    },[]);

    const setUserData=()=>{
        if(userInfos && userInfos.data){
            let usersDataSource = userInfos.data.map((user:any)=>{
                return {
                    label: user.fName + " " + user.lName,
                    id: user.recId,
                    inputValue:user.fName + " " + user.lName
                }
            });
            
            usersDataSource = [{
                id: 0,
                label: "All"
            }, ...usersDataSource]

            setUsersDataState(usersDataSource);
            userDataLoadedRef.current =true;

            setUsersFilterDataState(userInfos.data.map((user:any)=>{
                return {
                    value: user.fName + " " + user.lName,
                    id: user.recId
                }
            }));

            setSelectedUserState(usersDataSource[0]);
        }        
    }

    const setHotListData=()=>{
        if(hotListInfos && hotListInfos.data){
            let hotListDataSource = hotListInfos.data.map((hotList:any)=>{
                return {
                    label: hotList.name,
                    id: hotList.recId,
                    inputValue:hotList.name
                }
            });
            
            hotListDataSource = [{
                id: 0,
                label: "All"
            }, ...hotListDataSource]

            setHotListDataState(hotListDataSource);
            
            hotListDataLoadedRef.current = true;
            /* setUsersFilterDataState(userInfos.data.map((user:any)=>{
                return {
                    value: user.fName + " " + user.lName,
                    id: user.recId
                }
            })); */

            setSelectedHotListState(hotListDataSource[0]);
        }        
    }

    const setCapturedPlatesRows = () => {
        if(capturedPlates && capturedPlates.data){
            let capturedPlatesRowItems = capturedPlates.data.map((capturedPlate:any)=>{
                const user = userInfos.data.filter((user:any)=>user.recId == capturedPlate.user);
                const userName = user.length > 0 ? user[0].fName + " " + user[0].lName : capturedPlate.user

                return {
                    ...capturedPlate,
                    user: userName,
                    /* capturedAt: moment(capturedPlate.capturedAt).toLocaleString() */
                }
            });

            setCapturedPlatesRowsState(capturedPlatesRowItems);
            setReformattedRows({...reformattedRows, rowsDataItems: capturedPlates.data, usersData: usersData, hotListData: hotListData, states:states});
        }
    }

    const handleKeyDown = (event:any) => {
        if (event.key === 'Enter') {
            getCapturedPlateFilteredData()
        }
      }
      
      const handleBlur = () => {
        if(isSearchable.current) {     
            getCapturedPlateFilteredData()
        }
      }

    const getCapturedPlateFilteredData =()=>{
        const filters:GridFilter[] = []

        searchData.filter(x => x.value[0] !== '').forEach((item:any, index:number) => {
            let x: GridFilter = {
              operator: headCells[item.colIdx].attributeOperator,
              field: headCells[item.colIdx].attributeName,
              value: item.value.length > 1 ? item.value.join('@') : item.value[0],
              fieldType: headCells[item.colIdx].attributeType,
            }
            filters.push(x)
        })

        setAlprCapturePayloadState({
            ...getAlprCapturePayload,
            pageiGrid:{
                ...getAlprCapturePayload.pageiGrid,
                gridFilter:{
                    ...getAlprCapturePayload.pageiGrid.gridFilter,
                    filters:filters
                }
            }
        })

        isSearchable.current = false;
    }

    useEffect(()=>{
        setUserData();
    },[userInfos?.data]);

    useEffect(()=>{
        setHotListData();
    },[hotListInfos?.data]);

    useEffect(()=>{        
        if(userDataLoadedRef.current && hotListDataLoadedRef.current){
            setAlprCapturePayloadState({
                ...getAlprCapturePayload,
                userId: selectedUser.id,
                hotListId:selectedHotList.id
            })
        }
    },[selectedUser, selectedHotList]);
    
    useEffect(()=>{
        
        setAlprCapturePayloadState({
            ...getAlprCapturePayload,
            startDate:moment(selectedDateTimeRange.startDate).toISOString(),
            endDate: moment(selectedDateTimeRange.endDate).toISOString()
        })
    },[selectedDateTimeRange]);

    useEffect(()=>{
        
        setAlprCapturePayloadState({
            ...getAlprCapturePayload,
            startDate:moment(selectedDateTimeRangeForFilter.startDate).toISOString(),
            endDate: moment(selectedDateTimeRangeForFilter.endDate).toISOString()
        })
    },[selectedDateTimeRangeForFilter]);

    useEffect(()=>{
        if(typeof getAlprCapturePayload.userId != "undefined")
        {
            dispatch(getAllAlprCapturePlatesInfo(getAlprCapturePayload))
        }
    },[getAlprCapturePayload])

    useEffect(()=>{
        setCapturedPlatesRows();
    },[capturedPlates])

    useEffect(()=>{
        setAlprCapturePayloadState({
            ...getAlprCapturePayload,
            pageiGrid:{
                ...getAlprCapturePayload.pageiGrid,
                page: page,
                size:rowsPerPage
            }
        })
    }, [page, rowsPerPage])
    
    useEffect(()=>{
        setAlprCapturePayloadState({
            ...getAlprCapturePayload,
            pageiGrid:{
                ...getAlprCapturePayload.pageiGrid,
                gridSort: {
                    field: orderBy,
                    dir: order
                }
            }
        })
    },[order, orderBy]);

    useEffect(()=>{
        if(searchData && searchData.length > 0){
            isSearchable.current = true;
        }

        if(isSearchableOnChange.current){
            isSearchableOnChange.current = false; 
            getCapturedPlateFilteredData();
        }

    },[searchData])

    return (
        <ClickAwayListener onClickAway={handleBlur}>
        {/* <div className="userDataTableParent  groupPermissionInnerPage" onKeyDown={handleKeyDown}> */}
        <div className="captureDataTableParent captureInnerPage" onKeyDown={handleKeyDown}>
            <div className="ui">
                <div className="ui">
                    <label>Users:</label>
                    <CRXMultiSelectBoxLight

                        className="dropDownWidth"
                        label=""
                        // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                        multiple={false}
                        CheckBox={false}
                        options={usersData}
                        required={false}
                        isSearchable={true}
                        value = {selectedUser}
                        // value={values.sourceName === 0 ? "" : { id: values.sourceName, label: SourceOptions.find((x: any) => x.id === values.sourceName)?.label }}

                        onChange={(
                            e: React.SyntheticEvent,
                            value: any
                        ) => {
                            // setFieldValue("sourceName", value === null ? -1 : Number.parseInt(value?.id))
                            if(value)
                                setSelectedUserState(value);
                        }
                        }
                        onOpen={(e: any) => {
                        }}
                    />
                </div>
                <div className="ui">
                    <label>{t('Hot_List')}:</label>
                    <CRXMultiSelectBoxLight

                        className="dropDownWidth"
                        label=""
                        // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                        multiple={false}
                        CheckBox={true}
                        options={hotListData}
                        required={false}
                        isSearchable={true}
                        value={selectedHotList}

                        onChange={(
                            e: React.SyntheticEvent,
                            value: any
                        ) => {
                            if(value)
                                setSelectedHotListState(value);
                        }
                        }
                        onOpen={(e: any) => {
                        }}
                    />
                </div>
                <div className="ui">
                    <label>{t('Custom_Range')}:</label>
                    <DateTimeComponent
                        showCompact={false}
                        reset={false}
                        dateTimeDetail={selectedDateTimeRange}
                        getDateTimeDropDown={(dateTime: DateTimeObject) => {
                            setSelectedDateTimeRangeState(dateTime);
                            setSelectedDateTimeRangeStateForFilter(dateTime);
                        }}
                        dateOptionType={dateOptionsTypes.basicoptions}
                    />
                </div>
            </div>
            {capturedPlatesRows && (
                <CRXDataTable
                    id="CaptureDataTable"
                    actionComponent={() => { }}
                    getRowOnActionClick={() => { }}
                    showToolbar={true}
                    dataRows={capturedPlatesRows}
                    initialRows={reformattedRows}
                    headCells={headCells}
                    orderParam={order}
                    orderByParam={orderBy}
                    searchHeader={true}
                    columnVisibilityBar={true}
                    allowDragableToList={true}
                    className="captureDataTable usersGroupDataTable"
                    onClearAll={clearAll}
                    getSelectedItems={(v: AlprCapturePlateInfo[]) => setSelectedItems(v)}
                    onResizeRow={resizeRowCaptureTemp}
                    onHeadCellChange={onSetHeadCells}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    dragVisibility={false}
                    showCheckBoxesCol={true}
                    showActionCol={false}
                    showActionSearchHeaderCell={false}
                    showCountText={false}
                    showCustomizeIcon={false}
                    showTotalSelectedText={false}
                    lightMode={false}
                    //Please dont miss this block.
                    offsetY={129}
                    stickyToolbar={0}
                    //End here
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={(page: any) => setPage(page)}
                    setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                    totalRecords={capturedPlates.totalCount}
                    setSortOrder={(sort: any) => {
                        setOrder(sort.order)
                        setOrderBy(sort.orderBy)
                    }}
                />
            )
            }
        </div>
        </ClickAwayListener >
    )
}


export default AlprCapture;