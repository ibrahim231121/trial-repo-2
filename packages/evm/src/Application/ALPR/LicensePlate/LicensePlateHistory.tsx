import { CRXDataTable } from "@cb/shared";
import { ClickAwayListener } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import React from "react";
import { useTranslation } from "react-i18next";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import { ValueString ,HeadCellProps, Order, onResizeRow, onSetSingleHeadCellVisibility, onSetSearchDataValue, SearchObject, GridFilter, onClearAll} from "../../../GlobalFunctions/globalDataTableFunctions";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { DateTimeComponent, DateTimeObject } from "../../../GlobalComponents/DateTime";
import { CRXColumn } from "@cb/shared";
import { basicDateDefaultValue, dateOptionsTypes } from "../../../utils/constant";
import { AlprPlateHistoryInfo } from "../../../utils/Api/models/AlprPlateHistoryInfo";
import { CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { getAllPlateHistoryInfos } from "../../../Redux/AlprPlateHistoryReducer";
import { GetAlprPlateHistoryPayload } from "../ALPRTypes";
import { boolean } from "yup";
import moment from "moment";
import { getToken } from "../../../Login/API/auth";
import jwt_decode from "jwt-decode";
import { GetAllHotListData } from "../../../Redux/AlprHotListReducer";
import "./LicensePlateHistory.scss"
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import numberplate from "../../../Assets/Images/numberplate.jpg";
import emptyThumbnail from "../../../Assets/Images/thumbb.png"
import NumberSearch from "../../../GlobalComponents/DataTableSearch/NumberSearch";

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

type DateTimeProps = {
    dateTimeObj: DateTimeObject;
    colIdx: number;
  };

const LicensePlateHistory = () => {
    const {id} = useParams<{id:string}>();
    const { t } = useTranslation<string>();

    const firstTimeRef = useRef<boolean>(true)
    const isSearchable = React.useRef<boolean>(false);
    const isSearchableOnChange = React.useRef<boolean>(false);
    
    const dispatch = useDispatch();
    
    const [rows, setRows] = useState<AlprPlateHistoryInfo[]>();
    const [reformattedRows, setReformattedRows] = React.useState<any>({statesData:states});
    const [selectedItems, setSelectedItems] = React.useState<AlprPlateHistoryInfo[]>([]);
    const [order, setOrder] = React.useState<any>({
      order: 'desc',
      orderBy: 'CapturedAt'
    });
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
    const [page, setPage] = React.useState<number>(0);
    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const [getAlprPlateHistoryPayload, setAlprPlateHistoryPayloadState] = React.useState<GetAlprPlateHistoryPayload>({
      pageiGrid:{
          gridFilter: {
              logic: "and",
              filters: []
          },
          page: 0,
          size: 25,
          gridSort:{
              field: order.orderBy,
              dir: order.order
              }
      },
      numberPlateId: Number(id)
    })

    const plateHistoryInfos:any = useSelector((state: RootState) => state.alprPlateHistoryReducer.platHistoryInfos);
    const hotListData: any = useSelector((state: RootState) => state.hotListReducer.HotList);
    const usersData: any = useSelector((state: RootState) => state.userReducer.usersInfo);

    const HOTLIST_COLID:number = 2;
    const STATES_COLID:number = 7;

    useEffect(() => {
      if(!firstTimeRef.current){
        let numberPlate = ""
        if(plateHistoryInfos.data && plateHistoryInfos.data.length > 0){
          numberPlate = plateHistoryInfos.data[0]["numberPlate"]
        }
        
        dispatch(enterPathActionCreator({ val: "License Plate History" + (numberPlate.length > 0 ? `: ${numberPlate}`: "") }));
        
        if(usersData && usersData.data && usersData.data.length > 0){
          let rowItems = plateHistoryInfos.data.map((rowItem:any)=>{
            const user = usersData.data.filter((user:any)=>user.recId == rowItem.userId);
            const userName = user.length > 0 ? user[0].fName + " " + user[0].lName : rowItem.userId
  
            return {
                ...rowItem,
                userId: userName
            }
          });
  
          setRows(rowItems);
        }
        else{
          setRows(plateHistoryInfos.data)
        }
        
        setReformattedRows({...reformattedRows, rowsDataItems:plateHistoryInfos.data})
      }      
    },[plateHistoryInfos.data])

    useEffect(()=>{
      if(!firstTimeRef.current){
        setAlprPlateHistoryPayloadState({
          ...getAlprPlateHistoryPayload,
          pageiGrid:{
              ...getAlprPlateHistoryPayload.pageiGrid,
              page: page,
              size:rowsPerPage
            }
        })
      }      
    }, [page, rowsPerPage])
      
    useEffect(()=>{
      if(!firstTimeRef.current){
        setAlprPlateHistoryPayloadState({
            ...getAlprPlateHistoryPayload,
            pageiGrid:{
                ...getAlprPlateHistoryPayload.pageiGrid,
                gridSort: {
                    field: order.orderBy,
                    dir: order.order
                }
            }
        })
      }
    },[order]);

    useEffect(() => {
      if (searchData.length > 0) {
        isSearchable.current = true
      }
      if (isSearchableOnChange.current)
        getPlateHistoryFilteredData()
    }, [searchData]);

    useEffect(()=>{
      setReformattedRows({...reformattedRows, hotlistData:hotListData.data})
    },[hotListData.data])

    useEffect(()=>{
      if(rows && rows.length > 0){
        let rowItems = rows.map((rowItem:any)=>{
          const user = usersData.data.filter((user:any)=>user.recId == rowItem.userId);
          const userName = user.length > 0 ? user[0].fName + " " + user[0].lName : rowItem.userId

          return {
              ...rowItem,
              userId: userName
          }
        });

        setRows(rowItems);
      }
      setReformattedRows({...reformattedRows, users:usersData.data});
    },[usersData.data])

    //keep this useEffect on last.
    useEffect(()=>{
      dispatch(getAllPlateHistoryInfos(getAlprPlateHistoryPayload));
      firstTimeRef.current = false;
    },[getAlprPlateHistoryPayload])
    
    useEffect(()=>{
      var pageiGrid = {
        gridFilter: {
          logic: "and",
          filters: []
        },
        page: 0,
        size: 1000
      }
      dispatch(GetAllHotListData(pageiGrid))
      dispatch(getUsersInfoAsync(pageiGrid))

      return () => {
        dispatch(enterPathActionCreator({ val: "" }));
      }
    },[])    

    const getPlateHistoryFilteredData =()=>{
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

      setAlprPlateHistoryPayloadState({
          ...getAlprPlateHistoryPayload,
          pageiGrid:{
              ...getAlprPlateHistoryPayload.pageiGrid,
              page: 0,
              gridFilter:{
                  ...getAlprPlateHistoryPayload.pageiGrid.gridFilter,
                  filters:filters
              }
          }
      })

      isSearchable.current = false;
      isSearchableOnChange.current = false;
  }

  const clearAll = () => {
    setAlprPlateHistoryPayloadState({
        ...getAlprPlateHistoryPayload,
        pageiGrid:{
            ...getAlprPlateHistoryPayload.pageiGrid,
            page: 0,
            gridFilter:{
                ...getAlprPlateHistoryPayload.pageiGrid.gridFilter,
                filters:[]
            }
        }
    })
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const userIdPreset = () =>{
    var token = getToken();
    if (token) {
        var accessTokenDecode: any = jwt_decode(token);
        return accessTokenDecode.LoginId
    }
    else
     return ""
  }
  
    const handleBlur = () => {
        if (isSearchable.current) {
          getPlateHistoryFilteredData()
        }
      }

      const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
          getPlateHistoryFilteredData()
        }
      }

      const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
        let headCellReset = onResizeRow(e, headCells);
        setHeadCells(headCellReset);
      };

      const onSetHeadCells = (e: HeadCellProps[]) => {
        let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
        setHeadCells(headCellsArray);
    
      };

      const onSelection = (v: ValueString[], colIdx: number) => {
        if (v.length > 0) {
          for (let i = 0; i < v.length; i++) {
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
      }

      const onDateSelection = (dateTime:DateTimeObject, colIdx: number)=>{
        if (
          dateTime.startDate !== "" &&
          dateTime.startDate !== undefined &&
          dateTime.startDate != null &&
          dateTime.endDate !== "" &&
          dateTime.endDate !== undefined &&
          dateTime.endDate != null
      ) {
          let newItem = {
              columnName: headCells[colIdx].id.toString(),
              colIdx: colIdx,
              value: [dateTime.startDate, dateTime.endDate],
          };
          setSearchData((prevArr) =>
              prevArr.filter(
                  (e) => e.columnName !== headCells[colIdx].id.toString()
              )
          );
          setSearchData((prevArr) => [...prevArr, newItem]);
      } else
          setSearchData((prevArr) =>
              prevArr.filter(
                  (e) => e.columnName !== headCells[colIdx].id.toString()
              )
          );
      }

      const searchDate = (
        rowsParam: AlprPlateHistoryInfo[],
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
          const minCapturedDate = reformattedRows && reformattedRows.rowsDataItems ? reformattedRows.rowsDataItems.reduce((item1:AlprPlateHistoryInfo, item2:AlprPlateHistoryInfo) => {
            return (Date.parse(item1.capturedAt)) < (Date.parse(item2.capturedAt)) ? item1 : item2;
          }).capturedAt : "";

          const maxCapturedDate = reformattedRows && reformattedRows.rowsDataItems ? reformattedRows.rowsDataItems.reduce((item1:AlprPlateHistoryInfo, item2:AlprPlateHistoryInfo) => {
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
          <CRXColumn item xs={11}>
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
                  isSearchableOnChange.current = true;
                  onDateSelection(dateTime, colIdx);
                  headCells[colIdx].headerObject = dateTime;
              }}
              dateOptionType={dateOptionsTypes.basicoptions}
            />
          </CRXColumn>
        );
      };

      const searchAndNonSearchMultiDropDown = (
        rowsParam: AlprPlateHistoryInfo[],
        headCells: HeadCellProps[],
        colIdx: number,
        initialRows: any,
        isSearchable: boolean
      ) => {
    
        if(colIdx === HOTLIST_COLID && initialRows && initialRows.hotlistData && initialRows.hotlistData.length > 0){
            let hotlists: {id: number, value: string }[] = [];
            initialRows.hotlistData.map((x: any) => {
                hotlists.push({id : x.sysSerial, value: x.name });
            });
    
            return (
                <CBXMultiCheckBoxDataFilter 
                width = {100} 
                option={hotlists} 
                //defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
                value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
                onChange={(value : any) => {   
                  isSearchableOnChange.current = true;
                  onSelection(value.map((hotlist: { id: any; value:any })=>{return {id: hotlist.id, value: hotlist.value}}), colIdx);
                  headCells[colIdx].headerArray = value;
                }}
                onSelectedClear = {() =>  console.log("clear")}
                isCheckBox={true}
                multiple={true}
                isduplicate={true}
                selectAllLabel="All"
                percentage={true}
              />);
        }    
        else if(colIdx === STATES_COLID && initialRows && initialRows.statesData && initialRows.statesData.length > 0){
          let statesList: {id: number, value: string }[] = [];
          initialRows.statesData.map((x: any) => {
              statesList.push({id : x.id, value: x.label });
          });
  
          return (
              <CBXMultiCheckBoxDataFilter 
              width = {100} 
              option={statesList} 
              //defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
              value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
              onChange={(value : any) => {   
                isSearchableOnChange.current = true;
                onSelection(value.map((state: { id: any; value:any })=>{return {id: state.id, value: state.value}}), colIdx);
                headCells[colIdx].headerArray = value;
              }}
              onSelectedClear = {() =>  console.log("clear")}
              isCheckBox={true}
              multiple={true}
              isduplicate={true}
              selectAllLabel="All"
              percentage={true}
            />);
      }   
      };

      const searchNumber = (
        rowsParam: AlprPlateHistoryInfo[],
        headCells: HeadCellProps[],
        colIdx: number
      ) => {
    
        const onChange = (valuesObject: ValueString[]) => {
          headCells[colIdx].headerArray = valuesObject;
          onSelection(valuesObject, colIdx);
        };
    
        return (
          <NumberSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
        );
      };
      
      const searchText = (rowsParam: AlprPlateHistoryInfo[], headCell: HeadCellProps[], colIdx: number) => {
        const onChange = (valuesObject: ValueString[]) => {
            headCells[colIdx].headerArray = valuesObject;
            onSelection(valuesObject, colIdx);
        }
        return (
            <TextSearch headCells={headCell} colIdx={colIdx} onChange={onChange} />
        );
      };

      const thumbnailDisplay = (e:string, plateHistory:any)=>{
        
        return (<div className="plateThumbnail">
          <img src={numberplate}></img>
          {/* <img src={emptyThumbnail}></img> */}
        </div>);
      }

      const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
        {
            label: t("ID"),
            id: "id",
            align: "right",
            dataComponent: () => null,
            sort: false,
            searchFilter: false,
            searchComponent: searchText,
            keyCol: true,
            visible: false,
            minWidth: "150",
        },
        {
            label: `${t("Plate_Thumbnail")}`,
            id: "id",
            align: "left",
            dataComponent: (e: string, plateHistory:any) => thumbnailDisplay(e, plateHistory),
            minWidth: "121",
            visible: true,
        },
        {
            label: `${t("Hotlist")}`,
            id: "hotlistName",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchAndNonSearchMultiDropDown,
            minWidth: "180",
            attributeName: "HotlistName",
            attributeType: "List",
            attributeOperator: "contains",
            visible: true,
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
            attributeOperator: "between",
            visible: true,
        },
        {
          label: `${t("Unit")}`,
          id: "unit",
          align: "left",
          dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
          sort: true,
          searchFilter: true,
          //   searchComponent: (rowParam: HotListCaptureTemplate[], columns: HeadCellProps[], colIdx: number, initialRow: any) => multiSelectCheckbox(rowParam, columns, colIdx, initialRow),
          searchComponent: searchText,
          minWidth: "180",
          attributeName: "Unit",
          attributeType: "String",
          attributeOperator: "contains",
          visible: false
      },
      {
          label: `${t("User")}`,
          id: "userId",
          align: "left",
          dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
          sort: false,
          searchFilter: true,
          searchComponent: searchAndNonSearchMultiDropDown,
          minWidth: "180",
          attributeName: "UserId",
          attributeType: "number",
          attributeOperator: "eq",
          visible: false
      },
        {
            label: `${t("Confidence")}`,
            id: "confidence",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchNumber,
            minWidth: "150",
            attributeName: "Confidence",
            attributeType: "int",
            attributeOperator: "eq",
            visible: true,
        },
        {
            label: `${t("State")}`,
            id: "state",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchAndNonSearchMultiDropDown,
            minWidth: "180",
            attributeName: "State",
            attributeType: "List",
            attributeOperator: "contains",
            visible: true,
        }
        ,
        {
            label: `${t("Latitude")}`,
            id: "latitude",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchNumber,
            minWidth: "180",
            attributeName: "Latitude",
            attributeType: "double",
            attributeOperator: "eq",
            visible: true,
        }
        ,
        {
            label: `${t("Longitude")}`,
            id: "longitude",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchNumber,
            minWidth: "180",
            attributeName: "Longitude",
            attributeType: "double",
            attributeOperator: "eq",
            visible: true,
        }
        ,
        {
            label: `${t("Ticket_No")}`,
            id: "ticketNumber",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchNumber,
            minWidth: "180",
            attributeName: "TicketNumber",
            attributeType: "double",
            attributeOperator: "eq",
            visible: true,
        },
        {
            label: `${t("Make")}`,
            id: "vehicleMake",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "150",
            attributeName: "vehicleMake",
            attributeType: "String",
            attributeOperator: "contains",
            visible: true,
        }
        ,
        {
            label: `${t("Model")}`,
            id: "vehicleModel",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "vehicleModel",
            attributeType: "String",
            attributeOperator: "contains",
            visible: true,
        }
        ,
        {
            label: `${t("Year")}`,
            id: "vehicleYear",
            align: "left",
            dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText", "top"),
            sort: true,
            searchFilter: true,
            searchComponent: searchText,
            minWidth: "180",
            attributeName: "vehicleYear",
            attributeType: "Number",
            attributeOperator: "contains",
            visible: true,
        }
    ]);

  return (
    <ClickAwayListener onClickAway={handleBlur}>
        <div className="switchLeftComponents" onKeyDown={handleKeyDown}>
            {rows && (
            <CRXDataTable
                id="LicensePlateHistoryDataTable"
                actionComponent={()=>{}}
                toolBarButton={()=>{}}
                showTotalSelectedText={false}
                showToolbar={true}
                showCountText={false}
                columnVisibilityBar={true}
                showCustomizeIcon={true}
                getRowOnActionClick={(val: any) => {}}
                dataRows={rows}
                headCells={headCells}
                orderParam={order.order}
                orderByParam={order.orderBy}
                dragVisibility={false}
                showCheckBoxesCol={false}
                showActionCol={false}
                searchHeader={true}
                allowDragableToList={false}
                showActionSearchHeaderCell={false}
                className="crxTableHeight crxTableDataUi licensePlateHistoryDataTable"
                onClearAll={clearAll}
                getSelectedItems={(v: any[]) => setSelectedItems(v)}
                onResizeRow={resizeRowConfigTemp}
                onHeadCellChange={onSetHeadCells}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                page={page}
                rowsPerPage={rowsPerPage}
                setPage={(pages: any) => setPage(pages)}
                setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
                totalRecords={plateHistoryInfos.totalCount}
                setSortOrder={(sort: any) => setOrder(sort)}

                //Please dont miss this block.
                offsetY={119}
                stickyToolbar={130}
                searchHeaderPosition={224}
                dragableHeaderPosition={188}
                //End here
                presetPerUser = {userIdPreset()}
                showExpandViewOption={true}
                initialRows={reformattedRows}
            />
            )}
        </div>
    </ClickAwayListener>
    // <div className="switchLeftComponents">LicensePlateHistory {id}</div>
  )
}

export default LicensePlateHistory