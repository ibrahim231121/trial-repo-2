import React from "react";
import { getQueuedAssetInfoAsync } from "../../Redux/UnitReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { CRXDataTable,CRXProgressBar } from "@cb/shared";
import { useInterval } from 'usehooks-ts'
import {
    HeadCellProps,
    onResizeRow,
    Order,
    onSetSingleHeadCellVisibility,
    onClearAll,
    onSetHeadCellVisibility,onSaveHeadCellData
  } from "../../GlobalFunctions/globalDataTableFunctions";
import textDisplay from "../../GlobalComponents/Display/TextDisplay";
import { useTranslation } from "react-i18next";
import { QueuedAssets } from "../../utils/Api/models/UnitModels";

type infoProps = {
  unitId: any;
}
const QueuedAsstsDataTable :React.FC<infoProps> =  ({unitId})=>{
    const queuedAssets: any = useSelector((state: RootState) => state.unitReducer.queuedAssets);
    const { t } = useTranslation<string>();
    const [reformattedRows, setReformattedRows] = React.useState<QueuedAssets[]>();
    const [selectedActionRow, setSelectedActionRow] =React.useState<QueuedAssets>();
    const [order] = React.useState<Order>("asc");
    const [orderBy] = React.useState<string>("name");
    const [open, setOpen] = React.useState<boolean>(false);
    const [rows, setRows] = React.useState<QueuedAssets[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<QueuedAssets[]>([]);
    const dispatch = useDispatch();
 
  useInterval(
    () => {
      dispatch(getQueuedAssetInfoAsync({unitId: unitId}));
      let headCellsArray = onSetHeadCellVisibility(headCells);
      setHeadCells(headCellsArray);
      onSaveHeadCellData(headCells, "Queued_Assets");  
    },
    // Speed in milliseconds or null to stop it
   10000,
  );


    const setData = () => {
       let asset: QueuedAssets[] = [];
      
          if (queuedAssets && queuedAssets.length > 0) {
            asset = queuedAssets.map((dt: any, i:number) => {
                  return {
                    filename: dt.fileName,
                    status:  dt.status
                    
                  }
              })
          }
          setRows(asset)
          setReformattedRows(asset);
  
    }
  
    React.useEffect(() => {
      setData();
    }, [queuedAssets]);
  
    const resizeQueuedAssets = (e: { colIdx: number; deltaX: number }) => {
        let headCellReset = onResizeRow(e, headCells);
        setHeadCells(headCellReset);
      };

    const clearAll = () => {
        const clearButton: any = document.getElementsByClassName(
          "MuiAutocomplete-clearIndicator"
        )[0];
        clearButton && clearButton.click();
        setOpen(false);
        let headCellReset = onClearAll(headCells);
        setHeadCells(headCellReset);
      };

      const onSetHeadCells = (e: HeadCellProps[]) => {
        let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
        setHeadCells(headCellsArray);
      };


      const projectStatusProgress = (e:any) => {
      
        return (            
            <>
            <CRXProgressBar
            id="raw"
            loadingText='File'
            value={e}
            error={false}
            width={280}
           
            maxDataSize={true}
          />
          </>
           
        );
      };

      
    const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
       
        {
          label: `${t("File_Name")}`,
          id: "filename",
          align: "right",
          dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
          sort: true,
          minWidth: "120",
          maxWidth: "325",
          visible: true,
        },
        {
          label: `${t("Status")}`,
          id: "status",
          align: "left",
          dataComponent:  (e: any) => projectStatusProgress(e),
          sort: false, 
          minWidth: "200",
          maxWidth: "325",
          visible: true,
        }
      
      ]);

    return (
      <div className="userDataTableParent ">
      {rows && (
          <CRXDataTable 
              id="group-userDataTable"
              actionComponent={() => { }}
              getRowOnActionClick={() => { }}
              showToolbar={true}
              dataRows={rows}
              initialRows={reformattedRows}
              headCells={headCells}
              orderParam={order}
              orderByParam={orderBy}
              searchHeader={true}
              columnVisibilityBar={true}
              allowDragableToList={false}
              className="ManageAssetDataTable usersGroupDataTable"
              onClearAll={clearAll}
              getSelectedItems={(v: QueuedAssets[]) => setSelectedItems(v)}
              onResizeRow={resizeQueuedAssets}
              onHeadCellChange={onSetHeadCells}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              dragVisibility={false}
              showCheckBoxes={false}
              showActionCol={false}
              showActionSearchHeaderCell={false}
              showCountText={false}
              showCustomizeIcon={false}
              showTotalSelectedText={false}
              lightMode={false}
              offsetY={45}
          />
      )
      }

      </div>
    )
}

export default QueuedAsstsDataTable

