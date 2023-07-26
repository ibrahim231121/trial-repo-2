import { CRXColumn, CBXMultiCheckBoxDataFilter, CRXDataTable } from '@cb/shared';
import { ClickAwayListener } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import NumberSearch from '../../../../GlobalComponents/DataTableSearch/NumberSearch';
import TextSearch from '../../../../GlobalComponents/DataTableSearch/TextSearch';
import { DateTimeComponent } from '../../../../GlobalComponents/DateTime';
import textDisplay from '../../../../GlobalComponents/Display/TextDisplay';
import dateDisplayFormat from '../../../../GlobalFunctions/DateFormat';
import {ValueString, SearchObject, GridFilter, onClearAll, onResizeRow, onSetSingleHeadCellVisibility, onSetSearchDataValue, HeadCellProps } from '../../../../GlobalFunctions/globalDataTableFunctions';
import { getToken } from '../../../../Login/API/auth';
import { GetAllHotListData } from '../../../../Redux/AlprHotListReducer';
import { getAllPlateHistoryInfos } from '../../../../Redux/AlprPlateHistoryReducer';
import { getUsersInfoAsync } from '../../../../Redux/UserReducer';
import { enterPathActionCreator } from '../../../../Redux/breadCrumbReducer';
import { RootState } from '../../../../Redux/rootReducer';
import { AlprPlateHistoryInfo } from '../../../../utils/Api/models/AlprPlateHistoryInfo';
import { dateOptionsTypes } from '../../../../utils/constant';
import { DateTimeObject } from '../../../Cases/CaseTypes';
import { GetAlprPlateHistoryPayload } from '../../ALPRTypes';
import defaultNumberPlateImage from "../../../../Assets/Images/numberPlate.jpg";
import emptyThumbnail from "../../../../Assets/Images/thumbb.png";
import jwt_decode from "jwt-decode";
import "./LicensePlateHistoryLister.scss"
import { type } from 'os';
import { states } from '../../GlobalDropdown';
import { AlprGlobalConstants, gridAlignment, nullValidationHandling } from '../../AlprGlobal';
  
  type LicensePlateHistoryListerProp ={
    setLicensePlateHistoryData: (data:AlprPlateHistoryInfo[]) => void;
  }

  type DateTimeProps = {
      dateTimeObj: DateTimeObject;
      colIdx: number;
    };
    
const LicensePlateHistoryLister = ({setLicensePlateHistoryData}:LicensePlateHistoryListerProp) => {
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
      order: 'asc',
      orderBy: 'CapturedAt'
    });
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(AlprGlobalConstants.DEFAULT_GRID_PAGE_SIZE);
    const [page, setPage] = React.useState<number>(0);
    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const [getAlprPlateHistoryPayload, setAlprPlateHistoryPayloadState] = React.useState<GetAlprPlateHistoryPayload>({
      pageiGrid:{
          gridFilter: {
              logic: "and",
              filters: []
          },
          page: AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE,
          size: AlprGlobalConstants.DEFAULT_GRID_PAGE_SIZE,
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
        
        setLicensePlateHistoryData(plateHistoryInfos.data);

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
        page: AlprGlobalConstants.DEFAULT_GRID_INITIAL_PAGE,
        size: AlprGlobalConstants.DROPDOWN_PAGE_SIZE
      }
      dispatch(GetAllHotListData(pageiGrid))
      dispatch(getUsersInfoAsync(pageiGrid))
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
        if (nullValidationHandling(dateTime.startDate) && nullValidationHandling(dateTime.endDate)) {
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
                value={nullValidationHandling(headCells[colIdx].headerArray) ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
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
              value={nullValidationHandling(headCells[colIdx].headerArray) ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
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
          <img src={defaultNumberPlateImage}></img>
          {/* <img src={emptyThumbnail}></img> */}
        </div>);
      }

      const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
        {
            label: t("ID"),
            id: "id",
            align: gridAlignment("string"),
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
            align: gridAlignment("string"),
            dataComponent: (e: string, plateHistory:any) => thumbnailDisplay(e, plateHistory),
            minWidth: "121",
            visible: true,
        },
        {
            label: `${t("Hotlist")}`,
            id: "hotlistName",
            align: gridAlignment("string"),
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
            align: gridAlignment("DateTime"),
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
          align: gridAlignment("string"),
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
          align: gridAlignment("number"),
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
            align:gridAlignment("number"),
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
            align: gridAlignment("List"),
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
            align: gridAlignment("double"),
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
            align: gridAlignment("double"),
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
            align:  gridAlignment("double"),
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
            align:  gridAlignment("String"),
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
            align:gridAlignment("String"),
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
            align: gridAlignment("Number"),
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
        <div className='alprLicensePlateHistoryDataTableParent' onKeyDown={handleKeyDown}>
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
                lightMode={false}
                //Please dont miss this block.
                offsetY={119}
                stickyToolbar={0}
                //End here
                presetPerUser = {userIdPreset()}
                showExpandViewOption={false}
                initialRows={reformattedRows}
            />
            )}
        </div>
    </ClickAwayListener>
    // <div className="switchLeftComponents">LicensePlateHistory {id}</div>
  )
}

export default LicensePlateHistoryLister