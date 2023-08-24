import React, { useEffect, useRef, useContext } from 'react';
import { CRXDataTable, CRXToaster,CRXColumn,CBXMultiCheckBoxDataFilter} from '@cb/shared';
import { useTranslation } from 'react-i18next';
import textDisplay from '../../../GlobalComponents/Display/TextDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/rootReducer';
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
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import TextSearch from '../../../GlobalComponents/DataTableSearch/TextSearch';
import { CRXButton } from '@cb/shared';
import { CRXModalDialog } from '@cb/shared';
import { getCasesInfoAsync } from '../../../Redux/CasesReducer';
import { getCaseStatusInfo } from '../../../Redux/CaseStatusReducer';
import CasesActionMenu from './CasesActionMenu';
import AnchorDisplay from '../../../utils/AnchorDisplay';
import { urlList, urlNames } from '../../../utils/urlList';
import { useHistory } from 'react-router-dom';
import './casesList.scss';
// import './responsive.scss';
import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { TCaseTemplate, DateTimeProps,DateTimeObject,renderCheckMultiselect, CASE_ACTION_MENU_PARENT_COMPONENT, CASE_VIEW_TYPE, CASE_STATE } from '../CaseTypes';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import anchorDisplay from '../../../utils/AnchorDisplay';
import { getCaseIdOpenedForEvidence, getFormattedDateTime } from '../utils/globalFunctions';
import { dateOptionsTypes } from "../../../utils/constant";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import Restricted from "../../../ApplicationPermission/Restricted";
import { getTenantSettingsKeyValuesAsync } from '../../../Redux/TenantSettingsReducer';

const CasesList=()=>{
  
 // const { getModuleIds} = useContext(ApplicationPermissionContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const [rows, setRows] = React.useState<TCaseTemplate[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [orderBy, setOrderBy] = React.useState<string>('LastUpdatedOn');
  const [order, setOrder] = React.useState<Order>('desc');
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [selectedActionRow, setSelectedActionRow] = React.useState<TCaseTemplate>();
  const [selectedItems, setSelectedItems] = React.useState<TCaseTemplate[]>([]);
  const cases: any = useSelector((state: RootState) => state.caseReducer.cases);
  const caseStatus: any = useSelector((state: RootState) => state.caseStatusSlice.caseStatus);
  const tenantSettingsKeyValues: any = useSelector((state: RootState) => state.tenantSettingsReducer.keyValues);
  //const [cases, setCases] = React.useState<CaseTemplate[]>([]);
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [reformattedRows, setReformattedRows] = React.useState<any>();
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)
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
  });
  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: '',
      endDate: '',
      value: '',
      displayText: ''
    },
    colIdx: 0
  });


  const searchDate = (
    rowsParam: TCaseTemplate[],
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
            reformattedRows !== undefined ? reformattedRows.rows[0].createdOn : "",
          endDate:
            reformattedRows !== undefined
              ? reformattedRows.rows[reformattedRows.length - 1].createdOn
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
  const { t } = useTranslation<string>();
  const setData = () => {
    let caseRows: TCaseTemplate[] = [];
    if (cases != null && cases.data && cases.data.length > 0) {
      caseRows = cases.data.map((obj: any) => {
        return {
          id: obj.id,
          caseId: obj.title + "_" + obj.id,
          caseSummary: obj.description != null? obj.description.plainText:'',          
          caseLead: obj.userName,                  
          createdOn: getFormattedDateTime(obj.history.createdOn, tenantSettingsKeyValues ?? null), 
          state: obj.stateName,
          status: obj.statusName,
          updatedOn: obj.history.modifiedOn != null ? getFormattedDateTime(obj.history.modifiedOn, tenantSettingsKeyValues ?? null) : '',
          userId: obj.userId,
          caseViewType : obj.caseViewType,
          caseTitle : obj.title,
          stateId: obj.state,
          caseClosed: obj.caseClosed,
          userName : obj.userName,
          cadId : obj.cadId,
          statusName : obj.statusName,
          caseClosedId: obj.caseClosed[0]?.id,
          caseClosedStatus: obj.caseClosedStatus,
          caseClosedReasonName : obj.caseClosedReasonName,
          closedByName : obj.closedByName,
          caseActionMenuDisabled: obj.caseViewType === CASE_VIEW_TYPE.ViewOnly && obj.state !== CASE_STATE.Closed
        };
      });
    }
    setRows(caseRows);
    setReformattedRows({...reformattedRows,
      rows: caseRows,
      caseStatus: caseStatus,
    })
  };

  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, 'caseDataTable');
    dispatch(getCaseStatusInfo());
    dispatch(getTenantSettingsKeyValuesAsync())
  }, []);

  useEffect(() => {
    if(searchData.length > 0)
      setIsSearchable(true)
    if(isSearchableOnChange)
      getFilteredCaseData()
  }, [searchData]);

  useEffect(() => {
    setData();
  }, [cases]);

  useEffect(() => {
    if (paging)
    {    
      getCaseData();
    }
    setPaging(false)
  }, [pageiGrid]);

  useEffect(() => {
    if (dateTime.colIdx !== 0) {
      if (dateTime.dateTimeObj.startDate && dateTime.dateTimeObj.endDate) {
        let newItem = {
          columnName: headCells[dateTime.colIdx].id.toString(),
          colIdx: dateTime.colIdx,
          value: [dateTime.dateTimeObj.startDate, dateTime.dateTimeObj.endDate]
        };
        setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[dateTime.colIdx].id.toString()));
        setSearchData((prevArr) => [...prevArr, newItem]);
      } else
        setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[dateTime.colIdx].id.toString()));
    }
  }, [dateTime]);

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage, gridSort:{field: orderBy, dir: order} });
    setPaging(true);
  }, [page, rowsPerPage])

  const getCaseData = () => {
    dispatch(getCasesInfoAsync(pageiGrid));
  }

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
  
  const searchText = (rowsParam: TCaseTemplate[],headCells: HeadCellProps[], colIdx: number) => {
    const onChange = (valuesObject: ValueString[]) => {
    let toRemovedWhiteSpacesFromValuesObject = valuesObject;      
      
    if(headCells[colIdx].id === "caseId"){
      toRemovedWhiteSpacesFromValuesObject = valuesObject.map(object => ({ value: object.value.trim() }));  
    }
    headCells[colIdx].headerArray = valuesObject;
     onSelection(toRemovedWhiteSpacesFromValuesObject, colIdx);
    };
    return <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />;
  };
  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      getFilteredCaseData()
    }
  }

  const changeMultiStatusSelect = ( val: renderCheckMultiselect[], colIdx:number) => {
    onSelection(val, colIdx);
    headCells[colIdx].headerArray = val;
    setIsSearchableOnChange(true);
  }


  const onSelectIndividualClear = (headCells : HeadCellProps[], colIdx: number) => {
    let headCellReset = headCells.map((headCell: HeadCellProps,index:number) => {
      if(colIdx === index)
        headCell.headerArray = [{value: ""}];
      return headCell;
    });
    return headCellReset;
  }

  const onSelectedClear = (colIdx : number) => {
    setIsSearchableOnChange(true);
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
    let headCellReset = onSelectIndividualClear(headCells,colIdx);
    setHeadCells(headCellReset);
  }

  const multiSelectStatusCheckbox = (rowParam: TCaseTemplate[],headCells: HeadCellProps[], colIdx: number, initialRows:any) => {
    if (colIdx === 4 && initialRows && initialRows.caseStatus && initialRows.caseStatus.length > 0)
    {
      let caseClosedStatusOption: any = {};
      let caseStatusOption: any = [];
      initialRows.caseStatus.map((x:any) => {
        if(x.name === "Closed")
        {
          caseClosedStatusOption = x;
        }
        else
        {
          caseStatusOption.push({id: Number(x.id), value:x.name});
        }
      });
      caseStatusOption.push({id: Number(1001), value:'Pending Close'});
      caseStatusOption.push({id: Number(1002), value:'Close Requested'}); 
      
      if(caseClosedStatusOption != null && caseClosedStatusOption != undefined )
      {
        caseStatusOption.push({id: Number(caseClosedStatusOption.id), value:caseClosedStatusOption.name}); 
      }
     
      return (
        <div>
          <CBXMultiCheckBoxDataFilter
            width = {97}
            percentage={true}
            option ={caseStatusOption}
            value ={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []}
            onChange={(e:any) => changeMultiStatusSelect(e,colIdx)}
            onSelectedClear = {() => onSelectedClear(colIdx)}
            isCheckBox={false}
            isduplicate={true}
            multiple={false}
          />
        </div>
      )
    } 
  }

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: t('ID'),
      id: 'id',
      align: 'right',
      dataComponent: () => null,
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: '80',
      width: '80'
    },
    {
      label: t('Case_ID'),
      id: 'caseId',
      align: 'left',           
      dataComponent: (e: string,caseClosedStatus: string) => AnchorDisplay(e,caseClosedStatus),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      
      detailedDataComponentId: "caseClosedStatus",
      minWidth: '200',
      attributeName: "Title",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Case_Summary'),
      id: 'caseSummary',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, '',undefined,'truncate'),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '200',
      attributeName: "Description.PlainText",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Case_Lead'),
      id: 'caseLead',
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
      label: t('Status'),
      id: 'status',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rows: TCaseTemplate[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRows: any
      ) => multiSelectStatusCheckbox(rows, columns, colIdx, initialRows),
      minWidth: '150',
      attributeName: "StrStatusId",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: t('Created_On'),
      id: 'createdOn',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: '220',
      attributeName: "History.CreatedOn",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: t('Updated_On'),
      id: 'updatedOn',
      align: 'left',
          
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: '150',
      attributeName: "History.ModifiedOn",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: t('CaseActionMenuDisabled'),
      id: 'caseActionMenuDisabled',
      align: 'left',
      dataComponent: () => null,
      sort: false,
      searchFilter: false,
      searchComponent: () => null,
      isDisabledActionFunction: {key: true, value: "true", Message: t("View_Only._No_Actions_Allowed")},
      keyCol: true,
      visible: false,
      minWidth: '80',
      width: '80'
    },
  ]);
  const getFilteredCaseData = () => {

    pageiGrid.gridFilter.filters = []
    searchData.filter(x => x.value[0] !== '').forEach((item: any, index: number) => {
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

    if (page !== 0)
      setPage(0)
    else
      dispatch(getCasesInfoAsync(pageiGrid));

    setIsSearchable(false)
}
  const handleBlur = () => {
    if(isSearchable)
      getFilteredCaseData()
  }
  const showToastMsg = (obj: any) => {
    toasterRef.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration
    });
    if (obj.message !== undefined && obj.message !== "") {
      let notificationMessage: NotificationMessage = {
        title: t("Case"),
        message: obj.message,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  };
  const handleClickOpen = () => {
    // setOpen(true);
    const path = `${urlList.filter((item: any) => item.name === urlNames.createCase)[0].url}`;
    history.push(path);
  };
  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getCasesInfoAsync(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };
  const resizeRowCase = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };
  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  const sortingOrder = (sort: any) => {
    setPageiGrid({...pageiGrid, gridSort:{field: sort.orderBy, dir:sort.order}})
    setPaging(true)
  }
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
    dispatch(getCasesInfoAsync(pageiGrid));
  };

  const AnchorDisplay = (e: string,caseClosedStatus:string) => {
      
    // if(getModuleIds().includes(0)) {
    return (
      <>
        { anchorDisplay(e, "linkColor", urlList.filter((item:any) => item.name === urlNames.editCase)[0].url) }
        { getCaseContent(e,caseClosedStatus) }
      </>
    )
    // }
    // else{
    // let lastid = e.lastIndexOf("_");
    // let text =  e.substring(0,lastid)
    // return textDisplay(text,"")
    // }
  }

  const getCaseContent = (caseId: string,caseClosedStatus:string) => {
    
      const value = getCaseIdOpenedForEvidence();
      if(value != null && parseInt(value.id) > 0 && caseId.includes(value.id)) {
        const idx = caseId.lastIndexOf("_");
        const id = caseId.substring(idx + 1, caseId.length);
        if(id === value.id) {
          return <div className='caseOpenedForEvidenceIdentifier'>{t("Case_opened_for_evidence")}</div>
        }
      }
    return null;
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className='crxManageCases crxCaseData' onKeyDown={handleKeyDown} 
        onBlur={handleBlur}>
      <CRXToaster ref={toasterRef} />
      {rows && (
        <CRXDataTable
          id='caseDataTable'
          actionComponent={
            <CasesActionMenu
              row={selectedActionRow}
              hasEditMenu={true}
              selectedItems={selectedItems}
              showToastMsg={(obj: any) => showToastMsg(obj)}
              callBack ={getCaseData}
              parentComponent={CASE_ACTION_MENU_PARENT_COMPONENT.CaseLister}
            />
          }
          toolBarButton={
            <Restricted moduleId={79}>
              <CRXButton id={'createCase'} className='primary manageCaseBtn' onClick={handleClickOpen}>
                {t('Create_Case')}
              </CRXButton>
            </Restricted>
          }
          getRowOnActionClick={(val: TCaseTemplate) => setSelectedActionRow(val)}
          showToolbar={true}
          dataRows={rows}
          headCells={headCells}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          allowDragableToList={false}
          className='ManageAssetDataTable crxCaseDataTable'
          onClearAll={clearAll}
          getSelectedItems={(v: TCaseTemplate[]) => setSelectedItems(v)}
          onResizeRow={resizeRowCase}
          onHeadCellChange={onSetHeadCells}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          showActionSearchHeaderCell={false}
          dragVisibility={false}
          showCheckBoxesCol={false}
          showActionCol={true}
          showHeaderCheckAll={false}
          showCountText={false}
          showCustomizeIcon={false}
          showTotalSelectedText={false}
          page={page}
          rowsPerPage={rowsPerPage}
          initialRows={reformattedRows}
          setPage={(page: any) => setPage(page)}
          setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
          totalRecords={cases?.totalCount}
          setSortOrder={(sort:any) => sortingOrder(sort)}
          //Please dont miss this block.
          offsetY={-27}
          topSpaceDrag = {5}
          searchHeaderPosition={221}
          dragableHeaderPosition={186}
          stickyToolbar={130}
          overlay={true}
          //End here
        />
      )}
      
       <CRXModalDialog
        className='createCase CrxCreateCase'
        style={{ minWidth: '680px' }}
        maxWidth='xl'
        title={t('Create Case')}
        modelOpen={open}
        onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
        closeWithConfirm={closeWithConfirm}></CRXModalDialog>
    </div>
    </ClickAwayListener>
  );
}
  

export default CasesList;
