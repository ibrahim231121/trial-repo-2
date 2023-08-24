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
import { getAllRequestTypeKeyValuesAsync, getAllSharedTypeKeyValuesAsync, getAllStatusKeyValuesAsync, getTrackingAndSharingInfoAsync } from '../../../Redux/TrackingAndSharingReducer';
import TrackingAndSharingActionMenu from './TrackingAndSharingActionMenu';
import AnchorDisplay from '../../../utils/AnchorDisplay';
import { urlList, urlNames } from '../../../utils/urlList';
import { useHistory } from 'react-router-dom';
import './TrackingAndSharingList.scss';
// import './responsive.scss';
import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { TrackingAndSharing, DateTimeProps, DateTimeObject } from '../TrackingAndSharingTypes';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { getConfigurationTemplatesAsync } from '../../../Redux/ConfigurationTemplatesReducer';
import { forEach, isPlainObject } from 'lodash';
import { CBXMultiCheckBoxDataFilter } from '@cb/shared';
import { renderCheckMultiselect } from '../../Cases/CaseTypes';
import { dateDisplayFormat } from '../../../GlobalFunctions/DateFormat';
import { CRXColumn, CRXTruncation } from '@cb/shared';
import { DateTimeComponent } from '../../../GlobalComponents/DateTime';
import { dateOptionsTypes } from '../../../utils/constant';

const TrackingAndSharingList=()=>{
  const dispatch = useDispatch();
  const history = useHistory();
  const [rows, setRows] = React.useState<TrackingAndSharing[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const [isSearchableOnChange, setIsSearchableOnChange] = React.useState<boolean>(false)
  const [orderBy, setOrderBy] = React.useState<string>('CreatedOn');
  const [order, setOrder] = React.useState<Order>('desc');
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [selectedActionRow, setSelectedActionRow] = React.useState<TrackingAndSharing>();
  const [selectedItems, setSelectedItems] = React.useState<TrackingAndSharing[]>([]);
  const trackingAndSharing: any = useSelector((state: RootState) => state.trackingAndSharingReducer.trackingAndSharing);
  const sharedType : any = useSelector(
    (state: RootState) => state.trackingAndSharingReducer.trackingAndSharingSharedType
  );
  const status : any = useSelector(
    (state: RootState) => state.trackingAndSharingReducer.trackingAndSharingStatus
  );
  const requestType : any = useSelector(
    (state: RootState) => state.trackingAndSharingReducer.trackingAndSharingRequestType
  );
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [reformattedRows, setReformattedRows] = React.useState<any>();
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
  const [multipleAssets, setMultipleAssets] = React.useState<String>("");
  const [modal, setModal] = React.useState<boolean>(false);
  const { t } = useTranslation<string>();
  const setData = () => {
    let trackingAndSharingRows: TrackingAndSharing[] = [];
    if (trackingAndSharing != null && trackingAndSharing.data && trackingAndSharing.data.length > 0) {
      trackingAndSharingRows = trackingAndSharing.data.map((obj: any) => {
        return {
            id: obj.id,
            referenceTitle: obj.referenceTitle,
            sharedType: obj.sharedType,
            recipientChannelValue: obj.recipientChannelValue,
            sharedBy: obj.sharedBy,
            createdOn:   moment(new Date(obj.createdOn)).local().format("YYYY / MM / DD HH:mm:ss"),
            status: obj.status,
            timeRemaining: obj.timeRemaining,
            requestType: obj.requestType,          
            
        };
      });
    }
    setRows(trackingAndSharingRows);
    setReformattedRows({...reformattedRows, rows: trackingAndSharingRows, sharedType: sharedType, status: status, requestType: requestType});
  };

  useEffect(() => {
    dispatch(getAllSharedTypeKeyValuesAsync());
    dispatch(getAllStatusKeyValuesAsync());
    dispatch(getAllRequestTypeKeyValuesAsync());
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, 'trackingDataTable');
    //dispatch(getConfigurationTemplatesAsync());
  }, []);

  useEffect(() => {
    if(searchData.length > 0)
      setIsSearchable(true)
    if (isSearchableOnChange)
      getFilteredTrackingData()
  }, [searchData]);

  useEffect(() => {
    setData();
  }, [trackingAndSharing, sharedType, status, requestType]);

  useEffect(() => {
    if (paging)
    {    
      dispatch(getTrackingAndSharingInfoAsync(pageiGrid));     
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

  const searchDate = (
    rowsParam: TrackingAndSharing[],
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
          startDate: reformattedRows !== undefined ? reformattedRows.rows[0].createdOn : "",
          endDate: reformattedRows !== undefined ? reformattedRows.rows[reformattedRows.rows.length - 1].createdOn : "",
          value: "custom",
          displayText: t("custom_range"),
        },
        colIdx: 0,
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
  
  const searchText = (rowsParam: TrackingAndSharing[],headCells: HeadCellProps[], colIdx: number) => {
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
      getFilteredTrackingData()
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
      label: t('Reference_Title'),
      id: 'referenceTitle',
      align: 'left',      
      dataComponent: (e: string) => ReferenceTitleDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '150',
      attributeName: "ReferenceTitle",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Shared_Type'),
      id: 'sharedType',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: TrackingAndSharing[], columns: HeadCellProps[], colIdx: number, initialRow: any) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, true),
      minWidth: '160',
      attributeName: "SharedType",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: t('Recipient'),
      id: 'recipientChannelValue',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '150',
      attributeName: "RecipientChannelValue",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Shared_By'),
      id: 'sharedBy',
      align: 'left',
      dataComponent: (e: string) => textDisplaySharedBy(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '120',
      attributeName: "SharedBy",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Shared_On'),
      id: 'createdOn',
      align: 'left',
      dataComponent: dateDisplayFormat,
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: '170',
      attributeName: "CreatedOn",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: t('Status'),
      id: 'status',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: TrackingAndSharing[], columns: HeadCellProps[], colIdx: number, initialRow: any) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, true),
      minWidth: '120',
      isDisabledActionFunction: {key: true, value: "Expired", Message: "Shared_expired._No_actions_allowed"},
      attributeName: "Status",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: t('Time_Remaining'),
      id: 'timeRemaining',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '180',
      attributeName: "TimeRemaining",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Request_Type'),
      id: 'requestType',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: TrackingAndSharing[], columns: HeadCellProps[], colIdx: number, initialRow: any) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, initialRow, true),
      minWidth: '180',
      attributeName: "RequestType",
      attributeType: "List",
      attributeOperator: "contains"
    },
  ]);

  const searchAndNonSearchMultiDropDown = (
    rowsParam: TrackingAndSharing[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any,
    isSearchable: boolean,
  ) => {

    if (colIdx === 2 && initialRows && initialRows.sharedType && initialRows.sharedType.length > 0) {
      
      let status: any = [];
      initialRows.sharedType.map((x: any) => {
        status.push({ id: x.id, value: x.name });
      });

      return (
        <>
          <CBXMultiCheckBoxDataFilter
            width={100}
            percentage={true}
            option={status.filter((x: any) => x.value != null && x.value != "")}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
          />
        </>
      );
    }
    if (colIdx === 6 && initialRows && initialRows.status && initialRows.status.length > 0) {
      
      let status: any = [];
      initialRows.status.map((x: any) => {
        status.push({ id: x.id, value: x.name });
      });

      return (
        <>
          <CBXMultiCheckBoxDataFilter
            width={100}
            percentage={true}
            option={status.filter((x: any) => x.value != null && x.value != "")}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
          />
        </>
      );
    }
    if (colIdx === 8 && initialRows && initialRows.requestType && initialRows.requestType.length > 0) {
      
      let status: any = [];
      initialRows.requestType.map((x: any) => {
        status.push({ id: x.id, value: x.name });
      });

      return (
        <>
          <CBXMultiCheckBoxDataFilter
            width={100}
            percentage={true}
            option={status.filter((x: any) => x.value != null && x.value != "")}
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
          />
        </>
      );
    }
  };

  const onSelectedIndividualClear = (headCells: HeadCellProps[], colIdx: number) => {
    let headCellReset = headCells.map((headCell: HeadCellProps, index: number) => {
      if (colIdx === index)
        headCell.headerArray = [{ value: "" }];
      return headCell;
    });
    return headCellReset;
  };

  const onSelectedClear = (colIdx: number) => {
    setIsSearchableOnChange(true)
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
    let headCellReset = onSelectedIndividualClear(headCells, colIdx);
    setHeadCells(headCellReset);
  }

  const changeMultiselect = (val: renderCheckMultiselect[], colIdx: number) => {
    onSelection(val, colIdx)
    headCells[colIdx].headerArray = val;
    setIsSearchableOnChange(true)
  }

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

  const getFilteredTrackingData = () => {
      
      pageiGrid.gridFilter.filters = []
      searchData.filter(x => x.value[0] !== '').forEach((item: any, index: number) => {
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

      console.log("page ", page)
      if (page !== 0)
        setPage(0)
      else
        dispatch(getTrackingAndSharingInfoAsync(pageiGrid));

      setIsSearchable(false)
      setIsSearchableOnChange(false)
}
  const handleBlur = () => {
    if(isSearchable)
      getFilteredTrackingData()
  }
  const showToastMsg = (obj: any) => {
    toasterRef.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration
    });
    if (obj.message !== undefined && obj.message !== "") {
      let notificationMessage: NotificationMessage = {
        title: t("Tracking_And_Sharing"),
        message: obj.message,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
    getFilteredTrackingData();
  };
  const handleClickOpen = () => {
    // setOpen(true);
    const path = `${urlList.filter((item: any) => item.name === urlNames.createTracking)[0].url}`;
    history.push(path);
  };
  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getTrackingAndSharingInfoAsync(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };
  const resizeRowTracking = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };
  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  const sortingOrder = (sort: any) => {
    setPageiGrid({...pageiGrid, gridSort:{field: sort.orderBy, dir:sort.order}})
    setOrder(sort.order)
    setOrderBy(sort.orderBy)
    setPaging(true)
  }
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
    dispatch(getTrackingAndSharingInfoAsync(pageiGrid));
  };

  const ReferenceTitleDisplay = (assetAll: string, classes: string | undefined) => {
    assetAll = assetAll.replaceAll(',','\n')
    let assets = assetAll.split('\n');

    if(assets.length > 3)
    {
      return <div>
        {assets.slice(0, 3).map((item: any) => <div>{item}</div>)}
        <div>
          <a className="linkColor" onClick={() => openModal(assets.map((item:any, i:number) => <div>{i+1 + ". " + item}</div>))}>
            <span style={{fontSize:"small"}}>see more</span>
          </a>  
        </div> 
      </div>
       
    }
    else 
      return assets.map((item:any) => <div>{item}</div>)
  }

  const textDisplaySharedBy = (text: string, classes: string | undefined, placement? : string , addclass ? : string) => {
    return <div className={"dataTableText " + classes}>
              <CRXTruncation placement={placement} addclass={addclass} content={text.split('@')[0]} maxWidth = {380}/>
            </div>;
  };

  const openModal = (assets:any) => {
    setModal(true)
    setMultipleAssets(assets)
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className='' onKeyDown={handleKeyDown}>
      <CRXToaster ref={toasterRef} />
      {rows && (
        <CRXDataTable
          id='trackingDataTable'
          actionComponent={
            <TrackingAndSharingActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              showToastMsg={(obj: any) => showToastMsg(obj)}
            />
          }
          // toolBarButton={
          //   <>
          //     <CRXButton id={'createTracking'} className='primary manageTrackingBtn' onClick={handleClickOpen}>
          //       {t('Add_Request')}
          //     </CRXButton>
          //   </>
          // }
          getRowOnActionClick={(val: TrackingAndSharing) => setSelectedActionRow(val)}
          showToolbar={true}
          dataRows={rows}
          headCells={headCells}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          dragVisibility={false}
          className='ManageAssetDataTable crxTrackingDataTable'
          onClearAll={clearAll}
          getSelectedItems={(v: TrackingAndSharing[]) => setSelectedItems(v)}
          onResizeRow={resizeRowTracking}
          onHeadCellChange={onSetHeadCells}
          initialRows={reformattedRows}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          showActionSearchHeaderCell={false}
          showCheckBoxesCol={true}
          showActionCol={true}
          showHeaderCheckAll={true}
          showCountText={false}
          showCustomizeIcon={true}
          showTotalSelectedText={false}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={(page: any) => setPage(page)}
          setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
          // totalRecords={trackingAndSharing.totalCount}
          totalRecords={trackingAndSharing.totalCount}
          setSortOrder={(sort:any) => sortingOrder(sort)}
          //Please dont miss this block.
          offsetY={119}
          stickyToolbar={130}
          searchHeaderPosition={223}
          dragableHeaderPosition={188}
          overlay={true}
          //End here
        />
      )}
      
      <CRXModalDialog
        className='createTracking CrxCreateTracking'
        style={{ minWidth: '680px' }}
        maxWidth='xl'
        title={"Items that are included in this Sharing request"}
        modelOpen={modal}
        onClose={(e: React.MouseEvent<HTMLElement>) => setModal(false)}
      >
        <br></br>
        <div>{multipleAssets}</div>
        <div className="modalFooter CRXFooter">
        <div className="cancelBtn">
          <CRXButton
            className="secondary"
            color="secondary"
            variant="outlined"
            onClick={() => setModal(false)}
          >
            {t("Close")}
          </CRXButton>
        </div>
          </div>

      </CRXModalDialog>
      <CRXModalDialog
        className='createTracking CrxCreateTracking'
        style={{ minWidth: '680px' }}
        maxWidth='xl'
        title={t('Add_Request')}
        modelOpen={open}
        onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
        closeWithConfirm={closeWithConfirm}>
        
      </CRXModalDialog>
    </div>
    </ClickAwayListener>
  );
}
  

export default TrackingAndSharingList;
