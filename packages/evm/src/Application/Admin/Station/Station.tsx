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
import { getStationsAsync } from '../../../Redux/StationReducer';
import StationActionMenu from './StationActionMenu';
import AnchorDisplay from '../../../utils/AnchorDisplay';
import { urlList, urlNames } from '../../../utils/urlList';
import { useHistory } from 'react-router-dom';
import './station.scss';
import './responsive.scss';
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { getConfigurationTemplatesAsync } from '../../../Redux/ConfigurationTemplatesReducer';
import { StationType, DateTimeProps } from './StationTypes';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const Station: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
  const stations: any = useSelector((state: RootState) => state.stationReducer.stations);
  const [rows, setRows] = React.useState<StationType[]>([]);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('Name');
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<StationType[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<StationType[]>();
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [selectedActionRow, setSelectedActionRow] = React.useState<StationType>();
  const history = useHistory();
  const { getModuleIds, moduleIds } = useContext(ApplicationPermissionContext);
  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: '',
      endDate: '',
      value: '',
      displayText: ''
    },
    colIdx: 0
  });
  const toasterRef = useRef<typeof CRXToaster>(null);
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
  });
  const setData = () => {
    let stationRows: StationType[] = [];
    if (stations.data && stations.data.length > 0) {
      stationRows = stations.data.map((station: any) => {
        return {
          id: station.id,
          name: station.name + '_' + station.id,
          address: station.address.street,
          phone: station.address.phone,
        };
      });
    }
    setRows(stationRows);
    setReformattedRows(stationRows);
  };

  useEffect(() => {
    //dispatch(getStationsAsync(pageiGrid));
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, 'stationDataTable');
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
  }, [stations.data]);

  useEffect(() => {
    if (paging)
      dispatch(getStationsAsync(pageiGrid));
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

  const sortingOrder = (sort: any) => {
    setPageiGrid({...pageiGrid, gridSort:{field: sort.orderBy, dir:sort.order}})
    setPaging(true)
  }

  const searchText = (rowsParam: StationType[], headCells: HeadCellProps[], colIdx: number) => {
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
      label: t('Station'),
      id: 'name',
      align: 'left',
      // dataComponent: (e: string) => StationAnchorDisplay(e, "anchorStyle"),
      dataComponent: (e: string) => getModuleIds().includes(19) ? AnchorDisplay(e, 'linkColor', urlList.filter((item: any) => item.name === urlNames.adminStationEdit)[0].url) : textDisplay(e, ''),
      //AnchorDisplay(e, 'linkColor', urlList.filter((item: any) => item.name === urlNames.adminStationEdit)[0].url),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '350',
      width:"350",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Address'),
      id: 'address',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '650',
      attributeName: "Address.Street",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t('Phone_Number'),
      id: 'phone',
      align: 'left',
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: '330',
      attributeName: "Address.Phone",
      attributeType: "String",
      attributeOperator: "contains"
    }
  ]);

  const resizeRowStation = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getStationsAsync(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

  const handleClickOpen = () => {
    // setOpen(true);
    const path = `${urlList.filter((item: any) => item.name === urlNames.adminStationCreate)[0].url}`;
    history.push(path);
  };

  const unitClickOpen = () => {
    // setOpen(true);
    const path = `${urlList.filter((item: any) => item.name === urlNames.defaultUnitTemplate)[0].url}`;
    history.push(path);
  };

  const showToastMsg = (obj: any) => {
    toasterRef.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration
    });
    if (obj.message !== undefined && obj.message !== "") {
      let notificationMessage: NotificationMessage = {
        title: t("Station"),
        message: obj.message,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
    dispatch(getStationsAsync(pageiGrid));
  };

  const getFilteredStationData = () => {

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
        dispatch(getStationsAsync(pageiGrid));

      setIsSearchable(false)
  }

  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      getFilteredStationData()
    }
  }
  const handleBlur = () => {
    if(isSearchable)
      getFilteredStationData()
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className='crxManageUsers crxStationDataUser  switchLeftComponents' onKeyDown={handleKeyDown}>
      <CRXToaster ref={toasterRef} />
      {rows && (
        <CRXDataTable
          id='stationDataTable'
          actionComponent={
            <StationActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              showToastMsg={(obj: any) => showToastMsg(obj)}
            />
          }
          toolBarButton={
            <>
              <CRXButton id={'createUser'} className='primary manageUserBtn' onClick={handleClickOpen}>
                {t('Create_Station')}
              </CRXButton>

              {/* <CRXButton className='secondary unitTemplateBtn' onClick={unitClickOpen}>
                {t('Manage_Default_Unit_Templates')}
              </CRXButton> */}
              {/* <CRXButton className="secondary manageUserBtn mr_L_10" onClick={() => getFilteredUserData()}> {t("Filter")} </CRXButton> */}
            </>
          }
          getRowOnActionClick={(val: StationType) => setSelectedActionRow(val)}
          showToolbar={true}
          dataRows={rows}
          headCells={headCells}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          allowDragableToList={false}
          className='ManageAssetDataTable crxStationDataTable'
          onClearAll={clearAll}
          getSelectedItems={(v: StationType[]) => setSelectedItems(v)}
          onResizeRow={resizeRowStation}
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
          totalRecords={stations.totalCount}
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
        className='createUser CrxCreateUser'
        style={{ minWidth: '680px' }}
        maxWidth='xl'
        title={t('Create Station')}
        modelOpen={open}
        onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
        closeWithConfirm={closeWithConfirm}></CRXModalDialog>
    </div>
    </ClickAwayListener>
  );
};

export default Station;
