import React, { useEffect } from "react";
import { getQueuedAssetInfoAsync } from "../../Redux/UnitReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import dateDisplayFormat from "../../GlobalFunctions/DateFormat";
import { DateTimeComponent } from '../../GlobalComponents/DateTime';
import { dateOptionsTypes } from '../../utils/constant';
import textDisplayStatus from "../../GlobalComponents/Display/textDisplayStatus";
import { CRXDataTable, CRXProgressBar, CRXColumn, CBXMultiCheckBoxDataFilter } from "@cb/shared";
import { useInterval } from 'usehooks-ts'
import {
  HeadCellProps,
  onResizeRow,
  Order,
  onSetSingleHeadCellVisibility,
  onClearAll,
  onSetHeadCellVisibility, onSaveHeadCellData,
  PageiGrid,
  onSetSearchDataValue,
  ValueString,
  SearchObject
} from "../../GlobalFunctions/globalDataTableFunctions";
import textDisplay from "../../GlobalComponents/Display/TextDisplay";
import { useTranslation } from "react-i18next";
import { QueuedAssets } from "../../utils/Api/models/UnitModels";

import TextSearch from "../../GlobalComponents/DataTableSearch/TextSearch";
import { EvidenceAgent } from '../../utils/Api/ApiAgent';

type infoProps = {
  unitId: any;
  setQueuedAssetsCount: any
}
interface renderCheckMultiselect {
  value: string,
  id: string,

}
type DateTimeProps = {
  dateTimeObj: DateTimeObject;
  colIdx: number;
};
type DateTimeObject = {
  startDate: string;
  endDate: string;
  value: string;
  displayText: string;
};
const QueuedAsstsDataTable: React.FC<infoProps> = ({ unitId, setQueuedAssetsCount }) => {
  const [queuedAssets, setqueuedAssets] = React.useState<QueuedAssets[]>([]);
  const { t } = useTranslation<string>();
  const [reformattedRows, setReformattedRows] = React.useState<QueuedAssets[]>();
  const [selectedActionRow, setSelectedActionRow] = React.useState<QueuedAssets>();
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [order] = React.useState<Order>("asc");
  const [orderBy] = React.useState<string>("name");
  const [open, setOpen] = React.useState<boolean>(false);
  const [rows, setRows] = React.useState<QueuedAssets[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<QueuedAssets[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)
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

  useInterval(
    () => {
      EvidenceAgent.getQueuedAssets(unitId).then((response: QueuedAssets[]) => setqueuedAssets(response));

      let headCellsArray = onSetHeadCellVisibility(headCells);
      setHeadCells(headCellsArray);
      onSaveHeadCellData(headCells, "unit_device_queued_tab_table");
    },
    // Speed in milliseconds or null to stop it
    10000,
  );
  React.useEffect(() => {
    EvidenceAgent.getQueuedAssets(unitId).then((response: QueuedAssets[]) => setqueuedAssets(response));

    setData();
  }, []);

  const setData = () => {
    let asset: QueuedAssets[] = [];

    if (queuedAssets && queuedAssets.length > 0) {
      asset = queuedAssets.map((dt: any, i: number) => {
        return {
          filename: dt.fileName,
          statusData:
          {
            status: dt.status,
            fileState: dt.fileState,
            totalsize: dt.totalSize
          },
          status: dt.status,
          fileState: dt.fileState,
          totalsize: dt.totalSize,
          queued: dt.queued,
          started: dt.started,
          updated: dt.updated

        }
      })
    }
    setRows(asset)
    setQueuedAssetsCount(asset.filter(x => x.fileState == "Uploading").length)
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


  const projectStatusProgress = (e: any, statusData: any) => {

    var filesizeMB = (Number(statusData.totalsize / 1000000));//For Now it shows the fileSize in MB //1073741824
    var remainingSize = ((filesizeMB * statusData.status) / 100);
    var showError = false;
    if (statusData.fileState == "Cancelled" || statusData.fileState == "Abandoned") {
      e = "Error";
      showError = true;
    }
    return (
      <div className="status_grid_loader">
        <CRXProgressBar
          id="raw"
          loadingText=''
          value={e}
          error={showError}
          width={236}
          maxDataSize={true}
          loadingCompleted={remainingSize.toFixed(2) + "MB of " + filesizeMB.toFixed(2) + "MB"}
        />
      </div>

    );
  };

  const tabsIdx: any = window.innerWidth;
  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });

  useEffect(() => {
    if (dateTime.colIdx !== 0) {
      if (
        dateTime.dateTimeObj.startDate !== "" &&
        dateTime.dateTimeObj.startDate !== undefined &&
        dateTime.dateTimeObj.startDate != null &&
        dateTime.dateTimeObj.endDate !== "" &&
        dateTime.dateTimeObj.endDate !== undefined &&
        dateTime.dateTimeObj.endDate != null
      ) {
        let newItem = {
          columnName: headCells[dateTime.colIdx].id.toString(),
          colIdx: dateTime.colIdx,
          value: [dateTime.dateTimeObj.startDate, dateTime.dateTimeObj.endDate],
        };
        setSearchData((prevArr) =>
          prevArr.filter(
            (e) => e.columnName !== headCells[dateTime.colIdx].id.toString()
          )
        );
        setSearchData((prevArr) => [...prevArr, newItem]);
      } else
        setSearchData((prevArr) =>
          prevArr.filter(
            (e) => e.columnName !== headCells[dateTime.colIdx].id.toString()
          )
        );
    }
  }, [dateTime]);

  const searchDate = (
    rowsParam: QueuedAssets[],
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
    //change heree add colx id
    if (
      headCells[colIdx].headerObject === undefined ||
      headCells[colIdx].headerObject === null
    ) {
      dateTimeObject = {
        dateTimeObj: {
          startDate: reformattedRows !== undefined ? reformattedRows[0].queued : "",
          endDate: reformattedRows !== undefined ? reformattedRows[reformattedRows.length - 1].queued : "",
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
  const searchText = (
    rowsParam: QueuedAssets[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    };

    return (
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
    );
  };
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
  // const getFilteredQueuedAssetData = () => {

  //   pageiGrid.gridFilter.filters = []

  //   searchData.filter(x => x.value[0] !== '').forEach((item:any, index:number) => {
  //       let x: GridFilter = {
  //       operator: headCells[item.colIdx].attributeOperator,
  //       //field: item.columnName.charAt(0).toUpperCase() + item.columnName.slice(1),
  //       field: headCells[item.colIdx].attributeName,
  //       value: item.value.length > 1 ? item.value.join('@') : item.value[0],
  //       fieldType: headCells[item.colIdx].attributeType,
  //       }
  //       pageiGrid.gridFilter.filters?.push(x)
  //   })
  //   pageiGrid.page = 0
  //   pageiGrid.size = rowsPerPage

  //   if(page !== 0)
  //       setPage(0)
  //   // else
  //   //     dispatch(getUsersInfoAsync(pageiGrid));

  //   setIsSearchable(false)
  // }
  // const handleKeyDown = (event:any) => {
  //   if (event.key === 'Enter') {
  //        getFilteredQueuedAssetData()
  //   }
  // }
  // const handleBlur = () => {
  //   if(isSearchable)
  //      getFilteredQueuedAssetData()
  // }

  const multiSelectCheckbox = (rowParam: QueuedAssets[], headCells: HeadCellProps[], colIdx: number, initialRows: any) => {

    if (colIdx === 2 && initialRows) {

      let status: any = [{ id: 0, value: t("No_Status") }];
      initialRows.map((x: any) => {
        status.push({ id: x.name, value: x.fileState });
      });


      return (
        <div>
          <CBXMultiCheckBoxDataFilter
            width={200}
            option={status}
            defaultValue={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v: any) => v.value !== "") : []}
            onChange={(value: any) => changeMultiselect(value, colIdx)}
            onSelectedClear={() => onSelectedClear(colIdx)}
            isCheckBox={true}
            multiple={true}
            isduplicate={true}
            selectAllLabel="All"
          />
        </div>
      )
    }


  }

  const changeMultiselect = (val: renderCheckMultiselect[], colIdx: number) => {
    onSelection(val, colIdx)
    headCells[colIdx].headerArray = val;
  }
  const onSelectedIndividualClear = (headCells: HeadCellProps[], colIdx: number) => {
    let headCellReset = headCells.map((headCell: HeadCellProps, index: number) => {
      if (colIdx === index)
        headCell.headerArray = [{ value: "" }];
      return headCell;
    });
    return headCellReset;
  };
  const onSelectedClear = (colIdx: number) => {
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
    let headCellReset = onSelectedIndividualClear(headCells, colIdx);
    setHeadCells(headCellReset);
  }

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: `${t("File_Name")}`,
      id: "filename",
      align: "right",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: `${tabsIdx && tabsIdx / 3 - 270}`,
      visible: true,
    },
    {
      label: `${t("Upload_Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: any, statusData: any) => projectStatusProgress(e, statusData),
      sort: false,
      searchFilter: true,
      searchComponent: searchText,
      detailedDataComponentId: "statusData",
      minWidth: `${tabsIdx && tabsIdx / 3 - 210}`,
      visible: true,
    },
    {
      label: `${t("Status")}`,
      id: "fileState",
      align: "left",
      dataComponent: (e: string) => textDisplayStatus(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: QueuedAssets[], columns: HeadCellProps[], colIdx: number, initialRows: QueuedAssets[]) =>
        multiSelectCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "175",
      maxWidth: "175",
      attributeName: "Status",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: `${t("Queued")}`,
      id: "queued",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: "174",
      maxWidth: "174",
      attributeName: "Queued",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: `${t("Started")}`,
      id: "started",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: "174",
      maxWidth: "174",
      attributeName: "Started",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
    {
      label: `${t("Updated")}`,
      id: "updated",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: "174",
      maxWidth: "174",
      attributeName: "Updated",
      attributeType: "DateTime",
      attributeOperator: "between"
    },
  ]);

  React.useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage });
    setPaging(true)
  }, [page, rowsPerPage])

  return (
    <div className="unit_detail_tab_events unit_Device_tabUI">
      {rows && (
        <CRXDataTable
          id="unit_device_queued_tab_table"
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
          showCheckBoxesCol={false}
          allowDragableToList={false}
          className="unit_detail_tab_events_data_table"
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
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={(page: any) => setPage(page)}
          setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
          totalRecords={rows.length}
          stickyToolbar={0}
        />
      )}
    </div>
  )
}

export default QueuedAsstsDataTable

