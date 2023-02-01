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
import { CaseTemplate,DateTimeProps } from '../CaseTypes';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { getConfigurationTemplatesAsync } from '../../../Redux/ConfigurationTemplatesReducer';

const CasesList=()=>{
  const dispatch = useDispatch();
  const history = useHistory();
  const [rows, setRows] = React.useState<CaseTemplate[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [orderBy, setOrderBy] = React.useState<string>('Name');
  const [order, setOrder] = React.useState<Order>('asc');
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [selectedActionRow, setSelectedActionRow] = React.useState<CaseTemplate>();
  const [selectedItems, setSelectedItems] = React.useState<CaseTemplate[]>([]);
  const cases: any = useSelector((state: RootState) => state.caseReducer.cases);
  //const [cases, setCases] = React.useState<CaseTemplate[]>([]);
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [reformattedRows, setReformattedRows] = React.useState<CaseTemplate[]>();
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
    let caseRows: CaseTemplate[] = [];
    if (cases != null && cases.data && cases.data.length > 0) {
      caseRows = cases.data.map((obj: any) => {
        return {
          id: obj.id,
          caseSummary: obj.title,
          prosecutor: '',//obj.prosecutor,
          leadOfficer: obj.createdBy,
          createdOn:   moment(new Date(obj.history.createdOn)).local().format("YYYY / MM / DD HH:mm:ss"),//,new Date(obj.history.createdOn).toLocaleDateString("en-US"),
          state: obj.stateName,
          status: obj.statusName
        };
      });
    }
    setRows(caseRows);
    setReformattedRows(caseRows);
  };

  useEffect(() => {
    //dispatch(getCasesAsync(pageiGrid));
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, 'caseDataTable');
    dispatch(getConfigurationTemplatesAsync());
  }, []);

  useEffect(() => {
    //dataArrayBuilder();
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
      // setCases( [
      //       {
      //         id:'1',
      //         caseSummary:'caseSummary1',
      //         prosecutor:'prosecutor1',
      //         leadOfficer:'leadOfficer1',
      //         createdOn: 'createdOn1',
      //         state:'state1',
      //         status:'status1'
      //       },
      //       {
      //         id:'2',
      //         caseSummary:'caseSummary2',
      //         prosecutor:'prosecutor2',
      //         leadOfficer:'leadOfficer2',
      //         createdOn: 'createdOn2',
      //         state:'state2',
      //         status:'status2'
      //         }
      //       ])
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
  
  const searchText = (rowsParam: CaseTemplate[],headCells: HeadCellProps[], colIdx: number) => {
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
      label: t('Case_Summary'),
      id: 'caseSummary',
      align: 'left',      
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '200',
      attributeName: "CaseSummary",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Prosecutor'),
      id: 'prosecutor',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '200',
      attributeName: "Prosecutor",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Lead_Officer'),
      id: 'leadOfficer',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '200',
      attributeName: "LeadOfficer",
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
      attributeName: "CreatedOn",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('State'),
      id: 'state',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '150',
      attributeName: "State",
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
      attributeName: "Status",
      attributeType: "String",
      attributeOperator: "contains"
    }
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



  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className='crxManageCases crxCaseData  switchLeftComponents' onKeyDown={handleKeyDown}>
      <CRXToaster ref={toasterRef} />
      {rows && (
        <CRXDataTable
          id='caseDataTable'
          actionComponent={
            <CasesActionMenu
              row={selectedActionRow}
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
          getRowOnActionClick={(val: CaseTemplate) => setSelectedActionRow(val)}
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
          getSelectedItems={(v: CaseTemplate[]) => setSelectedItems(v)}
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
