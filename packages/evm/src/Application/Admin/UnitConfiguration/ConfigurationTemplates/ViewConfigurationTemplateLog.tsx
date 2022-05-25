import React from 'react'
import { CRXDataTable, CRXMenu } from "@cb/shared";
import dateDisplayFormat from "../../../../GlobalFunctions/DateFormat";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { useHistory } from "react-router";
import { BASE_URL_UNIT_SERVICE } from '../../../../utils/Api/url'
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
  } from "../../../../GlobalFunctions/globalDataTableFunctions";
import { useTranslation } from "react-i18next";  
import { useDispatch, useSelector } from "react-redux";

type ConfigTemplateLogs = {
    id: number;
    field: string;
    value: string;
    logTime: string;
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
     // const history = useHistory();
      console.log(props)
      let historyState = props.location.state;


    React.useEffect(() => {
       // dispatch(getConfigurationInfoAsync());
        //dispatch(getDeviceTypeInfoAsync());
        
        dispatch(enterPathActionCreator({ val: "Change Log: " + historyState.name}));
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

      const setData = () => {
 
        let ConfigTemplateLogsRows: ConfigTemplateLogs[] = [];
     
            if (configTemplateLogs && configTemplateLogs.length > 0) {
                ConfigTemplateLogsRows = configTemplateLogs.map((log: any, i:number) => {
                     return {
                        id: log.recId,
                        field: log.field,
                        value: log.value,
                        logTime: log.logTime,
                     }
                })
            }
            setRows(ConfigTemplateLogsRows)
         //   setReformattedRows(unitRows); // will do this later
    
      }


      const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
        {
          label: `${t("ID")}`,
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
            label: `${t("Field")}`,
            id: "field",
            align: "left",
            dataComponent: (e: string) =>  textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: () => null,
            minWidth: "100",
            width: "",
            maxWidth: "100"
          },
          {
            label: `${t("Value")}`,
            id: "value",
            align: "left",
            dataComponent: (e: string) =>  textDisplay(e, ""),
            sort: true,
            searchFilter: true,
            searchComponent: () => null,
            minWidth: "100",
            width: "",
            maxWidth: "100"
          },
          {
            label: `${t("Log Time")}`,
            id: "logTime",
            align: "center",
            dataComponent: dateDisplayFormat,
            sort: true,
            searchFilter: true,
            searchComponent: () => null,
            minWidth: "190"
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

  return (
    <div className="CrxConfigTemplate switchLeftComponents">
     
      {
        rows && (
          <CRXDataTable
            id="unitConfigTemplateLogsDataTable"
                   
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
            showCustomizeIcon={true}
            className="crxTableHeight crxTableDataUi configTemplate"
            onClearAll={clearAll}
            getSelectedItems={(v: ConfigTemplateLogs[]) => setSelectedItems(v)}
            onResizeRow={resizeRow}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            offsetY={192}
          />
        )
      }
    </div>
  );
}

export default ViewConfigurationTemplateLog
