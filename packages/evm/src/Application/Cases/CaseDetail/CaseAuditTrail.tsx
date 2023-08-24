
import React, { FC, useState, useEffect, useRef,useCallback,useImperativeHandle } from "react";
import {CRXButton,CRXColumn} from "@cb/shared";
import {
    SearchObject,
    ValueString,
    HeadCellProps,
    onResizeRow,
    Order,
    onSetSingleHeadCellVisibility,
    onSetSearchDataValue,
    onClearAll,
    onSaveHeadCellData,
    onSetHeadCellVisibility,
    GridFilter,
    PageiGrid
  } from '../../../GlobalFunctions/globalDataTableFunctions';
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import TextSearch from '../../../GlobalComponents/DataTableSearch/TextSearch';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { TCaseAudit } from "../../../utils/Api/models/CaseAuditModels";
import { getAllFilteredCaseAudit } from "../../../Redux/CaseAuditReducer";
import { DateTimeProps,DateTimeObject, CASE_AUDIT_TYPE, TCaseDetail } from "../CaseTypes";
import { CRXDataTable } from "@cb/shared";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { dateOptionsTypes } from "../../../utils/constant";
import { EvidenceAgent } from '../../../utils/Api/ApiAgent';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import moment from "moment";
import './CaseAuditTrail.scss';
import { DownloadAuditTrail } from "../utils/AuditTrailPdfDownload";
import { CASE_STATE } from '../CaseTypes';
import { convertDateTimeToLocalInString, getFormattedDateTime } from "../utils/globalFunctions";

type CaseAuditTrailPropTypes = {
    caseId: number,
    showToastMsg: (obj: any) => void,
    caseDetailOriginalRef : TCaseDetail | null,
  }


const CaseAuditTrail: FC<CaseAuditTrailPropTypes> = (props) => {
    const {caseId,showToastMsg,caseDetailOriginalRef} = props;
    const { t } = useTranslation<string>();
    const [searchData, setSearchData] = useState<SearchObject[]>([]);
    const [isSearchable,setIsSearchable] = useState<boolean>(false)
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage,setRowsPerPage] = useState<number>(10);
    const [paging, setPaging] = useState<boolean>();
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<string>('history.createdOn');
    const caseAudit: any = useSelector((state: RootState) => state.caseAuditSlice.getAllFilteredCaseAudit)
    const [rows, setRows] = useState<any[]>([]);
    const assetDataRef = useRef<any[]>([]);
    const [reformattedRows, setReformattedRows] = useState<any>();
    const [selectedItems, setSelectedItems] = useState<TCaseAudit[]>([]);
    const [selectedActionRow, setSelectedActionRow] = useState<TCaseAudit>();
    const dispatch = useDispatch();
    const tenantSettingsKeyValues: any = useSelector((state: RootState) => state.tenantSettingsReducer.keyValues);
    const [pageiGrid, setPageiGrid] = useState<any>({
      gridFilter: {
        logic: "and",
        filters: []
      },
      page: page,
      size: rowsPerPage,
      gridSort: {
        field: orderBy,
        dir: order
      },
      caseId: caseId
    });
    const [dateTime, setDateTime] = useState<DateTimeProps>({
      dateTimeObj: {
        startDate: '',
        endDate: '',
        value:'',
        displayText: ''
      },
      colIdx: 0
    })
    const searchText = (rowsParam: TCaseAudit[],headCells: HeadCellProps[], colIdx: number) => {
      const onChange = (valuesObject: ValueString[]) => {
        headCells[colIdx].headerArray = valuesObject;
        onSelection(valuesObject, colIdx);
      };
      const onSelection = (v: ValueString[], colIdx: number) => {
        if (v.length > 0) {
          for (var i = 0; i < v.length; i++) {
            let searchDataValue = onSetSearchDataValue(v, headCells, colIdx);
            setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
            setSearchData((prevArr) => [...prevArr, searchDataValue]);
          }
        } else {
          setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
        }
      };
      return <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />;
    };
    const searchDate = (
      rowsParam: [],
      headCells: HeadCellProps[],
      colIdx: number
    ) => {
      let reset: boolean = false;
      let dateTimeObject: DateTimeProps = {
        dateTimeObj: {
          startDate : "",
          endDate: "",
          value: "",
          displayText: ""
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
            startDate: reformattedRows !== undefined ? reformattedRows.rows[0].captured : "",
            endDate: reformattedRows !== undefined ? reformattedRows.rows[reformattedRows.length - 1].captured : "",
            value: "custom",
            displayText: t("custom_range"),
          },
          colIdx: 0
        };
      } else {
        dateTimeObject = {
          dateTimeObj: {
            ...headCells[colIdx].headerObject
          },
          colIdx: 0,
        };
      }
      function onSelection(dateTime: DateTimeObject) {
        dateTimeObject = {
          dateTimeObj: {
            ...dateTime
          },
          colIdx: colIdx,
        };
        setDateTime(dateTimeObject);
        headCells[colIdx].headerObject = dateTimeObject.dateTimeObj;
      }
      return (
        <CRXColumn item xs = {11}>
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
      )
    }
    const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
      {
        label: t('Seq.No'),
        id: 'seqNo',
        align: 'left',
        dataComponent: (e: string) => textDisplay(e, ''),
        sort: true,
        searchFilter: false,
        searchComponent: searchText,
        minWidth: '80',
      },
      {
        label: t('Captured'),
        id: 'captured',
        align: 'left',
        dataComponent: (e: string) => textDisplay(e, ''),
        sort: true,
        searchFilter: true,
        visible: true,
        searchComponent: searchDate,
        minWidth: '200',
        attributeName: "History.CreatedOn",
        attributeType: "DateTime",
        attributeOperator: "between"
      },
      {
        label: t('Username'),
        id: 'username',
        align: 'left',
        dataComponent: (e: string) => textDisplay(e, ''),
        sort: true,
        searchFilter: true,
        searchComponent: searchText,
        minWidth: '200',
        attributeName: "UserName",
        attributeType: "String",
        attributeOperator: "contains"
      },
      {
        label: t('Activity'),
        id: 'text',
        align: 'left',
        dataComponent: (e: string) => textDisplay(e, ''),
        sort: true,
        searchFilter: true,
        searchComponent: searchText,
        minWidth: '200',
        attributeName: "Text",
        attributeType: "String",
        attributeOperator: "contains"
      },
    ]);
    useEffect(() =>{
      let headCellsArray = onSetHeadCellVisibility(headCells);
      setHeadCells(headCellsArray);
      onSaveHeadCellData(headCells, 'caseAuditDataTable');
    },[])
    useEffect(() => {
      setCaseAuditData();
    },[caseAudit.data]);
    useEffect(() => {
      if(searchData.length > 0) {
        setIsSearchable(true)
      }
    },[searchData])
    useEffect(() => {
      if (paging)
        dispatch(getAllFilteredCaseAudit(pageiGrid));
        setPaging(false)
    },[pageiGrid])
    useEffect (() => {
      if(dateTime.colIdx !== 0) {
        if(dateTime.dateTimeObj.startDate && dateTime.dateTimeObj.endDate) {
          let newItem = {
            columnName: headCells[dateTime.colIdx].id.toString(),
            colIdx: dateTime.colIdx,
            value: [dateTime.dateTimeObj.startDate,dateTime.dateTimeObj.endDate]
          };
          setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[dateTime.colIdx].id.toString()));
          setSearchData((prevArr) => [...prevArr, newItem]);
        } else {
          setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[dateTime.colIdx].id.toString()));
        }
      }
    },[dateTime])
    useEffect (() => {
      setPageiGrid({...pageiGrid, page: page, size: rowsPerPage,gridSort:{field: orderBy, dir: order}});
      setPaging(true);
    },[page, rowsPerPage])
    const getFilteredCaseAuditData = () => {
      pageiGrid.gridFilter.filters = []
      searchData.filter((x) => x.value[0] !== '').forEach((item: any,index:number) => {
        let x: GridFilter = {
          operator: headCells[item.colIdx].attributeOperator,
          field: headCells[item.colIdx].attributeName,
          value: item.value.length > 1 ? item.value.join('@') : item.value[0],
          fieldType: headCells[item.colIdx].attributeType,
        }
        pageiGrid.gridFilter.filters?.push(x)
      })
      pageiGrid.page = 0
      pageiGrid.size = rowsPerPage
      if (page !== 0)
        setPage(0)
      else 
        dispatch(getAllFilteredCaseAudit(pageiGrid));
        setIsSearchable(false);
    }
    const setCaseAuditData = () => {
      let caseAuditRows: TCaseAudit[] = [];
      if (caseAudit.data !=null && caseAudit.data && caseAudit.data.length > 0) {
        caseAuditRows = caseAudit.data.map((res: any) => {
          return {
            seqNo : String(res.seqNo + 1),
            captured : getFormattedDateTime(res.history.createdOn, tenantSettingsKeyValues ?? null),
            username : res.userName,
            text : res.type === CASE_AUDIT_TYPE.StatusUpdate ? convertDateTimeToLocalInString(res.text, tenantSettingsKeyValues ?? null) : res.text,
          };
        });
      }
      setRows(caseAuditRows);
      setReformattedRows({...reformattedRows,
      rows : caseAuditRows, caseAuditStatus : caseAudit})
    }
    const clearAll = () => {
      pageiGrid.gridFilter.filters = [];
      dispatch(getAllFilteredCaseAudit(pageiGrid));
      setSearchData([]);
      let headCellReset = onClearAll(headCells);
      setHeadCells(headCellReset);
    }
    const resizeRowCase = (e: {colIdx: number; deltaX: number}) => {
      let headCellReset = onResizeRow(e, headCells);
      setHeadCells(headCellReset);
    }
    const onSetHeadCells = (e: HeadCellProps[]) => {
      let headCellArray = onSetSingleHeadCellVisibility(headCells, e);
      setHeadCells(headCellArray);
    }
    const handleKeyDown = (event: any) => {
      if(event.key === 'Enter') {
        getFilteredCaseAuditData()
      }
    }
    const handlerBlur =()=> {
      if(isSearchable)
        getFilteredCaseAuditData();
    }
    const sortingOrder = (sort: any) => {
      setPageiGrid({...pageiGrid, gridSort:{field: sort.orderBy, dir: sort.order}})
      setOrder(sort.order)
      setOrderBy(sort.orderBy)
      setPaging(true)
    }

    const getAssetsTrail = useCallback(async () => {
      if(caseDetailOriginalRef != null && caseDetailOriginalRef.caseAssets && caseDetailOriginalRef.caseAssets.length > 0 ) {
           const customArray: { evidenceId: number, assetIds: number[] }[] = [];
           caseDetailOriginalRef.caseAssets.forEach(obj => {
            const existingData = customArray.find(x => x.evidenceId === obj.evidenceId);
            if(existingData != null) {  
              existingData.assetIds.push(obj.assetId);
            } 
            else {
              customArray.push({ evidenceId: obj.evidenceId, assetIds: [obj.assetId] })
            }
          })
          let headers = [{ key: "EvidenceAssetIdsModel", value : JSON.stringify(customArray) }];
          let url = `/Evidences/${customArray[0].evidenceId}/Assets/0/AssetTrail`
          dispatch(setLoaderValue({isLoading: true}));
          await EvidenceAgent.getMultipleAssetsTrail(url,headers).then((response) => {
            dispatch(setLoaderValue({isLoading: false}));
            if (response != null && response != undefined)
            {
              let auditList = Object.entries(response).map((x) => {
                return {
                    assetName : x[0],
                    auditData : x[1]
                  }
              })
              assetDataRef.current = auditList;
            }
          }).catch((e:any) => {
            dispatch(setLoaderValue({isLoading: false}));
            showToastMsg({ message: e.response.data != null ? e.response.data : t('Something_went_wrong'), variant: "error" });
            console.error(e);
          });
        }
  }, []) 

  const OnAuditTrailDownload = async ()  => {
    if(!(caseDetailOriginalRef?.state == CASE_STATE.Closed)) {
      assetDataRef.current.length === 0 && await getAssetsTrail()
    }
    DownloadAuditTrail(caseDetailOriginalRef,caseDetailOriginalRef?.caseAudits,assetDataRef?.current, tenantSettingsKeyValues);
  }
  return (
    <ClickAwayListener onClickAway={handlerBlur}>
        <div className="caseAudit-main" onKeyDown={handleKeyDown} onBlur={handlerBlur}>
            <div className="caseAuditBtn">
                  <CRXButton color="primary"  variant="contained" onClick ={() => {OnAuditTrailDownload()}}> <i className="far fa-download"></i>  Export </CRXButton>
            </div>
              {rows && (
                <CRXDataTable
                  id='caseAuditTable'
                getRowOnActionClick={(val: TCaseAudit) => setSelectedActionRow(val)}
                showToolbar={false}
                dataRows={rows}
                headCells={headCells}
                orderParam={order}
                orderByParam={orderBy}
                searchHeader={true}
                columnVisibilityBar={false}
                allowDragableToList={false}
                className='ManageAssetDataTable crxCaseAuditDataTable'
                onClearAll={clearAll}
                getSelectedItems={(v: TCaseAudit[]) => setSelectedItems(v)}
                onResizeRow={resizeRowCase}
                onHeadCellChange={onSetHeadCells}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                showActionSearchHeaderCell={false}
                dragVisibility={false}
                showCheckBoxesCol={false}
                showActionCol={false}
                showHeaderCheckAll={false}
                showCountText={false}
                showCustomizeIcon={false}
                showTotalSelectedText={false}
                page={page}
                rowsPerPage={rowsPerPage}
                initialRows={reformattedRows}
                setPage={(page: any) => setPage(page)}
                setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                totalRecords={caseAudit.totalCount}
                setSortOrder={(sort:any) => sortingOrder(sort)}
                //Please dont miss this block.
                offsetY={-5}
                topSpaceDrag = {5}
                searchHeaderPosition={100}
                dragableHeaderPosition={50}
                stickyToolbar={133}
                />
              )}
          </div>
    </ClickAwayListener>
    )
  }


export default CaseAuditTrail;