import React, { useEffect,useRef,useState, useContext} from "react";
import { CRXDataTable } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { Menu, MenuButton } from "@szhsin/react-menu";
import { useDispatch, useSelector } from "react-redux";
import {SetupConfigurationAgent} from '../../../../utils/Api/ApiAgent';
import SensorsAndTriggersTemplateActionMenu from './SensorsAndTriggersTemplateActionMenu';
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import './sensorsAndTriggersList.scss'
import anchorDisplay from '../../../../utils/AnchorDisplay';
import { urlList, urlNames } from "../../../../utils/urlList"
import { useHistory } from "react-router-dom";
import { RootState } from "../../../../Redux/rootReducer";
import { CRXButton } from "@cb/shared";

import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onTextCompare,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  onClearAll,
  onSetHeadCellVisibility,
  onSaveHeadCellData,
  PageiGrid,
  GridFilter
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import {CRXAlert} from "@cb/shared";
import {getAllSensorsEvents} from '../../../../Redux/SensorEvents';


type SensorAndTriggersTemplate = {
  id : number;
  description: string;
}

const ORDER_BY = "asc" as Order;
const ORDER_BY_PARAM = "recordingStarted";

const SensorsAndTriggersList: React.FC = () => {
  const { t } = useTranslation<string>();

  const [rows, setRows] = React.useState<SensorAndTriggersTemplate[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<SensorAndTriggersTemplate[]>([]);
  const [selectedActionRow,setSelectedActionRow] = useState<SensorAndTriggersTemplate[]>();
  const [success, setSuccess] = React.useState<boolean>(false);
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
  const dispatch = useDispatch();
  let history = useHistory();

  const isFirstRenderRef = useRef<boolean>(true);
  const reformattedRowsRef = useRef<SensorAndTriggersTemplate[]>();
  const sensorsEvents: any = useSelector((state: RootState) => state.sensorEventsSlice.sensorEvents);

  useEffect(() => {
    if(!isFirstRenderRef.current) {
    // dataArrayBuilder();
    }
  }, [searchData]);

  useEffect(() => {
    if(paging)
      setSensorsEventsData()
    setPaging(false)
  },[pageiGrid])

  useEffect(() => {
    setPageiGrid({...pageiGrid, page:page, size:rowsPerPage}); 
    setPaging(true)
    
  },[page, rowsPerPage])

  useEffect(() => {
    setSensorsEventsData();
    isFirstRenderRef.current = false;
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "sensorsAndTriggersTemplateDataTable"); // will check this
}, []);


    const onChange = (valuesObject: ValueString[], colIdx: number) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    }

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

    const searchText = (
      rowsParam: SensorAndTriggersTemplate[],
      headCell: HeadCellProps[],
      colIdx: number
    ) => {
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={(valueObject) => onChange(valueObject,colIdx)} />
    );
  };

  const AnchorDisplay = (e: string) => {
    if(e) {
    return anchorDisplay(e, "linkColor", urlList.filter((item:any) => item.name === urlNames.sensorsAndTriggersEdit)[0].url)
    }
    else{
    let lastid = e.lastIndexOf("_");
    let text =  e.substring(0,lastid)
    return textDisplay(text,"")
    }
  }

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
      width: "",
      maxWidth: "100",
    },
    {
      label: `${t("Name")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => AnchorDisplay(e),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "300",
      width: "2094",
      maxWidth: "300",
      detailedDataComponentId: "device",
    },
  ]);

  const setSensorsEventsData = () => {
    let sensorAndTriggersTemplateRows: SensorAndTriggersTemplate[] = []
    if (sensorsEvents && sensorsEvents.length > 0) {
      sensorAndTriggersTemplateRows = sensorsEvents.map((template: any) => {
        return { 
            id: template.id, 
            description: template.description + "_" + template.id, 
        }
      })
    }
    setRows(sensorAndTriggersTemplateRows);
    reformattedRowsRef.current = sensorAndTriggersTemplateRows;
  }


  React.useEffect(() => {
    setSensorsEventsData();
  }, [sensorsEvents]);

  React.useEffect (() => {
    dispatch(getAllSensorsEvents(pageiGrid));
  },[])

  const getSelectedItemsUpdate = () => {
    setSelectedItems([]);
  }

  const getSuccessUpdate = () => {
    setSuccess(true);
  }

  const dataArrayBuilder = () => {
    if (reformattedRowsRef.current !== undefined) {
      let dataRows: SensorAndTriggersTemplate[] = reformattedRowsRef.current;
      searchData.forEach((el: SearchObject) => {
        if (
          el.columnName === "description"
        )
          dataRows = onTextCompare(dataRows, headCells, el);
      });
      setRows(dataRows);
    }
  };

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllSensorsEvents(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const getFilteredSensorsEventsData = () => {
    pageiGrid.gridFilter.filters = []
    searchData.filter(x => x.value[0] !== '').forEach((item:any, index:number) => {
        let x: GridFilter = {
          operator: headCells[item.colIdx].attributeOperator,
          field: headCells[item.colIdx].attributeName,
          value: item.value.length > 1 ? item.value.join('@') : item.value[0],
          fieldType: headCells[item.colIdx].attributeType,
        }
        pageiGrid.gridFilter.filters?.push(x)
        pageiGrid.page = 0
        pageiGrid.size = rowsPerPage
    })
    
    if(page !== 0)
      setPage(0)
    else{
      dispatch(getAllSensorsEvents(pageiGrid));
    }
  }


  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };
  return (
    <div className="CrxSensorsAndTriggersTable switchLeftComponents">
              {success && (
                  <CRXAlert
                    message={t("Success_You_have_deleted_the_Sensors_And_Triggers")}
                    alertType="toast"
                    open={true}
                  />
              )}
          {
        rows && (
          <CRXDataTable
            id="sensorsAndTriggersTemplateDataTable"
            actionComponent={<SensorsAndTriggersTemplateActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              getRowData={setSensorsEventsData}
              getSelectedData= {getSelectedItemsUpdate}
              getSuccess = {getSuccessUpdate}
            />}
            toolBarButton = {
              <>
              {/* <Restricted moduleId={6}> */}
                <CRXButton className="managePermissionBtn" onClick={() => { history.push(urlList.filter((item:any) => item.name === urlNames.sensorsAndTriggersCreate)[0].url) }}>
                  {t("Create_Sensor_&_Trigger")}
                </CRXButton>
              {/* </Restricted> */}
              <CRXButton className="secondary manageUserBtn userGroupfilterButton mr_L_10" onClick={() => getFilteredSensorsEventsData()}> {t("Filter")} </CRXButton>
              </>
            }
            getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
            dataRows={rows}
            headCells={headCells}
            orderParam={ORDER_BY}
            orderByParam={ORDER_BY_PARAM}
            showToolbar={true}
            showCountText={false}
            columnVisibilityBar={true}
            dragVisibility={false}
            showCheckBoxesCol={true}
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showTotalSelectedText={false}
            showActionSearchHeaderCell={true}
            showCustomizeIcon={true}
            className="crxTableHeight crxTableDataUi SensorsAndTriggersTableTemplate"
            onClearAll={clearAll}
            getSelectedItems={(v: SensorAndTriggersTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowConfigTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            offsetY={206}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage= {(pages:any) => setPage(pages)}
            setRowsPerPage= {(setRowsPages:any) => setRowsPerPage(setRowsPages)}
            totalRecords={500}
          />
        )
      }
    </div>
  );
};

export default SensorsAndTriggersList;
