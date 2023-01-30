import React from 'react'
import { CRXDataTable, CRXMenu } from "@cb/shared";
import dateDisplayFormat from "../../../../GlobalFunctions/DateFormat";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { getTemplateConfigurationLogsAsync } from "../../../../Redux/TemplateConfiguration";
import { RootState } from "../../../../Redux/rootReducer";
import { enterPathActionCreator } from '../../../../Redux/breadCrumbReducer';
import {
    SearchObject,
    ValueString,
    HeadCellProps,
    onResizeRow,
    Order,
    onTextCompare,
    onMultiToMultiCompare,
    onSetSingleHeadCellVisibility,
    onSetSearchDataValue,
    onClearAll,
    onSetHeadCellVisibility,
    onSaveHeadCellData,
    PageiGrid
  } from "../../../../GlobalFunctions/globalDataTableFunctions";
import { useTranslation } from "react-i18next";  
import { useDispatch, useSelector } from "react-redux";
import { urlList, urlNames } from '../../../../utils/urlList';

type ConfigTemplateLogs = {
    id: number;
    updateddata: string;
    logTime: string;
    user:string;
  };

const ViewConfigurationTemplateLog= (props: any) => {
    const { t } = useTranslation<string>();
    const [rows, setRows] = React.useState<ConfigTemplateLogs[]>([]);
    const [selectedActionRow, setSelectedActionRow] =
    React.useState<ConfigTemplateLogs>();
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
    const [dataOfConfigTemplateLogs, setConfigTemplateLogs] = React.useState<any>([]);
    const [open, setOpen] = React.useState<boolean>(false)
    const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
    const configTemplateLogs: any = useSelector((state: RootState) => state.templateSlice.configTemplateLogs);
    const [selectedItems, setSelectedItems] = React.useState<ConfigTemplateLogs[]>(
        []
      );
    const dispatch = useDispatch();
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
     // const history = useHistory();
      console.log(props)
      let historyState = props.location.state;


    React.useEffect(() => {
       // dispatch(getConfigurationInfoAsync());
        //dispatch(getDeviceTypeInfoAsync());
        
        dispatch(enterPathActionCreator({ val: t("Change_Log") + historyState.name}));
        dispatch(getTemplateConfigurationLogsAsync(historyState.id)); 
        let headCellsArray = onSetHeadCellVisibility(headCells);
        setHeadCells(headCellsArray);
        onSaveHeadCellData(headCells, "unitConfigTemplateLogsDataTable"); // will check this
        
    return () => {
        dispatch(enterPathActionCreator({ val: "" }));
      }

      }, []);


      React.useEffect(() => {
        setData();
      //  dispatch(enterPathActionCreator({ val: ""}));
      }, [configTemplateLogs]);

      React.useEffect(() => {
        if(paging){
          dispatch(enterPathActionCreator({ val: t("Change_Log") + historyState.name}));
          dispatch(getTemplateConfigurationLogsAsync(historyState.id)); 
        }
        setPaging(false)
      },[pageiGrid])

      const setData = () => {
 
        let ConfigTemplateLogsRows: ConfigTemplateLogs[] = [];
            if (configTemplateLogs && configTemplateLogs.length > 0) {
                ConfigTemplateLogsRows = configTemplateLogs.map((log: any, i:number) => {
                     return {
                        id: log.recId,
                        updateddata: log.updatedData,
                        logTime: log.logTime,
                        user:log.user
                     }
                })
            }
            setRows(ConfigTemplateLogsRows)
         //   setReformattedRows(unitRows); // will do this later
    
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
          label: t("Log_Time"),
          id: "logTime",
          align: "center",
          dataComponent: dateDisplayFormat,
          sort: true,
          searchFilter: true,
          searchComponent: () => null,
          minWidth: "190"
        },
        {
          label: t("User"),
          id: "user",
          align: "left",
          dataComponent: (f: string) =>  textDisplay(f, ""),
          sort: true,
          searchFilter: true,
          searchComponent: () => null,
          minWidth: "90",
          width: "",
          maxWidth: "95"
        },
        {
          label: t("Changes"),
          id: "updateddata",
          align: "left",
          dataComponent: (a: string) =>  textDisplay(a, ""),
          sort: true,
          searchFilter: true,
          searchComponent: () => null,
          minWidth: "88",
          width: "",
          maxWidth: "90"
        },
     
         
    ]);

    const resizeRow = (e: { colIdx: number; deltaX: number }) => {
        let headCellReset = onResizeRow(e, headCells);
        setHeadCells(headCellReset);
      };
      
  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };

    const clearAll = () => {
        const clearButton:any = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
        clearButton && clearButton.click()
        setOpen(false)
          setSearchData([]);
          let headCellReset = onClearAll(headCells);
          setHeadCells(headCellReset);
      };

      React.useEffect(() => {
        setPageiGrid({...pageiGrid, page:page, size:rowsPerPage}); 
        setPaging(true)
        
      },[page, rowsPerPage])

  return (
    <div className="CrxConfigTemplate switchLeftComponents">
     
      {
        rows && (
          <CRXDataTable
            id="unitConfigTemplateLogsDataTable"
            toolBarButton={
             
              <div className="Button">
                            <Link to={{ pathname: urlList.filter((item: any) => item.name === urlNames.urladminUnitConfigurationTemplate)[0].url }}>   
                              <div>X</div>
                            </Link>
                  </div>
              }
            getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
            dataRows={rows}
            headCells={headCells}
            orderParam={order}
            orderByParam={orderBy}
            showToolbar={true}
            showCountText={false}
            columnVisibilityBar={true}
            dragVisibility={false}
            showCheckBoxesCol={false}
            showActionCol={false}
            searchHeader={true}
            allowDragableToList={false}
            showTotalSelectedText={false}
            showActionSearchHeaderCell={true}
            showCustomizeIcon={false}
            className="crxTableHeight crxTableDataUi configTemplate"
            onClearAll={clearAll}
            getSelectedItems={(v: ConfigTemplateLogs[]) => setSelectedItems(v)}
            onResizeRow={resizeRow}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage= {(page:any) => setPage(page)}
            setRowsPerPage= {(rowsPerPage:any) => setRowsPerPage(rowsPerPage)}
            totalRecords={500}
             //Please dont miss this block.
             offsetY={-22}
             searchHeaderPosition={228}
             dragableHeaderPosition={193}
             topSpaceDrag = {10}
             //End here
          />
        )
      }
    </div>
  );
}

export default ViewConfigurationTemplateLog
