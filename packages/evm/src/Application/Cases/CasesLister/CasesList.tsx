import React, { useEffect, useRef, useContext } from 'react';
import { CRXDataTable, CRXToaster } from '@cb/shared';
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
import CasesActionMenu from './CasesActionMenu';
import AnchorDisplay from '../../../utils/AnchorDisplay';
import { urlList, urlNames } from '../../../utils/urlList';
import { useHistory } from 'react-router-dom';
import './casesList.scss';
// import './responsive.scss';
import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { TCaseTemplate, DateTimeProps } from '../CaseTypes';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import anchorDisplay from '../../../utils/AnchorDisplay';

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
  //const [cases, setCases] = React.useState<CaseTemplate[]>([]);
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [reformattedRows, setReformattedRows] = React.useState<TCaseTemplate[]>();
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
          createdOn:   moment(new Date(obj.history.createdOn)).local().format("YYYY / MM / DD HH:mm:ss"),//,new Date(obj.history.createdOn).toLocaleDateString("en-US"),
          state: obj.stateName,
          status: obj.statusName,
          updatedOn: obj.history.modifiedOn != null ? moment(new Date(obj.history.modifiedOn)).local().format("YYYY / MM / DD HH:mm:ss") : '',
          userId: obj.userId,
        };
      });
    }
    setRows(caseRows);
    setReformattedRows(caseRows);
  };

  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, 'caseDataTable');
  }, []);

  useEffect(() => {
    console.log("searchData", searchData)
    if(searchData.length > 0)
      setIsSearchable(true)
  }, [searchData]);

  useEffect(() => {
    setData();
  }, [cases]);

  useEffect(() => {
    if (paging)
    {    
      dispatch(getCasesInfoAsync(pageiGrid));
      
    }
    setPaging(false)
  }, [pageiGrid]);

  useEffect(() => {
    if (dateTime.colIdx !== 0) {
      if (
        dateTime.dateTimeObj.startDate !== '' &&
        dateTime.dateTimeObj.startDate !== undefined &&
        dateTime.dateTimeObj.startDate != null &&
        dateTime.dateTimeObj.endDate !== '' &&
        dateTime.dateTimeObj.endDate !== undefined &&
        dateTime.dateTimeObj.endDate != null
      ) {
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
  
  const searchText = (rowsParam: TCaseTemplate[],headCells: HeadCellProps[], colIdx: number) => {
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
  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      getFilteredCaseData()
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
      
      dataComponent: (e: string) => AnchorDisplay(e),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '200',
      attributeName: "Title",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Case_Summary'),
      id: 'caseSummary',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
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
      searchComponent: searchText,
      minWidth: '150',
      attributeName: "StatusName",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Created_On'),
      id: 'createdOn',
      align: 'left',
      
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '220',
      attributeName: "History.CreatedOn",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Updated_On'),
      id: 'updatedOn',
      align: 'left',
          
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '150',
      attributeName: "History.ModifiedOn",
      attributeType: "String",
      attributeOperator: "contains"
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

  const AnchorDisplay = (e: string) => {
    // if(getModuleIds().includes(0)) {
    return anchorDisplay(e, "linkColor", urlList.filter((item:any) => item.name === urlNames.editCase)[0].url)
    // }
    // else{
    // let lastid = e.lastIndexOf("_");
    // let text =  e.substring(0,lastid)
    // return textDisplay(text,"")
    // }
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className='crxManageCases crxCaseData  switchLeftComponents' onKeyDown={handleKeyDown} 
        onBlur={handleBlur}>
      <CRXToaster ref={toasterRef} />
      {rows && (
        <CRXDataTable
          id='caseDataTable'
          actionComponent={
            <CasesActionMenu
              row={selectedActionRow}
              hasEditMenu={true}
              showToastMsg={(obj: any) => showToastMsg(obj)}
            />
          }
          toolBarButton={
            <>
              <CRXButton id={'createCase'} className='primary manageCaseBtn' onClick={handleClickOpen}>
                {t('Create_Case')}
              </CRXButton>
            </>
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
          setPage={(page: any) => setPage(page)}
          setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
          // totalRecords={cases.totalCount}
          totalRecords={10}
          setSortOrder={(sort:any) => sortingOrder(sort)}
          //Please dont miss this block.
          offsetY={-27}
          topSpaceDrag = {5}
          searchHeaderPosition={221}
          dragableHeaderPosition={186}
          stickyToolbar={133}
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
