import React from "react";
import { CRXDataTable,CRXProgressBar } from "@cb/shared";
import {
    HeadCellProps,
    onResizeRow,
    Order,
    onSetSingleHeadCellVisibility,
    onClearAll,
  } from "../../GlobalFunctions/globalDataTableFunctions";
import textDisplay from "../../GlobalComponents/Display/TextDisplay";
import { useTranslation } from "react-i18next";

type QueuedAssets = {
    filename:string;
    status:string;
  };

const rows = [
  {},{}]

const QueuedAsstsDataTable = ()=>{
    const { t } = useTranslation<string>();
    const [reformattedRows, setReformattedRows] = React.useState<QueuedAssets[]>();
    const [selectedActionRow, setSelectedActionRow] =React.useState<QueuedAssets>();
    const [order] = React.useState<Order>("asc");
    const [orderBy] = React.useState<string>("name");
    const [open, setOpen] = React.useState<boolean>(false);
    const [selectedItems, setSelectedItems] = React.useState<QueuedAssets[]>([]);

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
        // setSearchData([]);
        let headCellReset = onClearAll(headCells);
        setHeadCells(headCellReset);
      };

      const onSetHeadCells = (e: HeadCellProps[]) => {
        let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
        setHeadCells(headCellsArray);
      };


      const projectStatusProgress = (
      ) => {
        return (    
          
              <>
                {textDisplay("completed","")}
                {statusProgressIndicator("jobs")}
              </>
           
        );
      };

      const statusProgressIndicator = (projectJobs:string) => {

        return (
          <>
       
                {jobProgressBar(projectJobs)}
              
          </>
        );
      };



      const jobProgressBar = ( jobProgress: string) => {
        return (
          <>
            <CRXProgressBar
              loadingText=""
              className="crxJobProgressBar"
              value={100}
              error=""
              width={118}
              maxDataSize={true}
              loadingCompleted=""
            />
          </>
        );
      };

      

    const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
       
        {
          label: `${t("File_Name")}`,
          id: "filename",
          align: "right",
          dataComponent: (e: string) => textDisplay(e, " "),
          sort: true,
        },
        {
          label: `${t("Status")}`,
          id: "status",
          align: "right",
          dataComponent: projectStatusProgress,
          sort: false
        }
      
      ]);

    return (
        <div className="">
        {/* {rows && ( */}
          <CRXDataTable
            id={t("Queued_Assets")}
            getRowOnActionClick={(val: QueuedAssets) =>
              setSelectedActionRow(val)
            }
            showToolbar={true}
            showCountText={true}
            columnVisibilityBar={true}
            showHeaderCheckAll={false}
            initialRows={reformattedRows}
            dragVisibility={false}
            showCheckBoxesCol={false}
            showActionCol={false}
            headCells={headCells}
            dataRows={rows}
            orderParam={order}
            orderByParam={orderBy}
            searchHeader={true}
            allowDragableToList={true}
            showTotalSelectedText={false}
            showActionSearchHeaderCell={true}
            showCustomizeIcon={true}

            className=""
            onClearAll={clearAll}
            getSelectedItems={(v: QueuedAssets[]) => setSelectedItems(v)}
            onResizeRow={resizeQueuedAssets}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            offsetY={190}
          />
        {/* )} */}
      </div>
    )
}

export default QueuedAsstsDataTable

