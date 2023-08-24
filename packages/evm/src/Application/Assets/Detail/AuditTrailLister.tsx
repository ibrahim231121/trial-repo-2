import { CRXColumn, CRXDataTable } from "@cb/shared";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import { DateTimeComponent } from '../../../GlobalComponents/DateTime';
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import textDisplayStatus from "../../../GlobalComponents/Display/textDisplayStatus";
import {dateDisplayFormat} from "../../../GlobalFunctions/DateFormat";
import { RootState } from "../../../Redux/rootReducer";
import { dateOptionsTypes } from '../../../utils/constant';
import "./AssetDetailTabsMenu.scss";
import "./assetDetailTemplate.scss";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  HeadCellProps, onClearAll, onDateCompare, onResizeRow, onSaveHeadCellData, onSetHeadCellVisibility, onSetSearchDataValue, onSetSingleHeadCellVisibility, onTextCompare, Order, SearchObject, ValueString
} from "../../../GlobalFunctions/globalDataTableFunctions";
import { AuditTrail, DateTimeObject, DateTimeProps } from "./AssetDetailsTemplateModel";
import auditTrailPDFDownload, { convertDateTime, toDataURL } from "../utils/auditTrailPDF";
import { formatBytes, milliSecondsToTimeFormat, retentionSpanText } from "../AssetLister/ActionMenu";
import { FileAgent } from "../../../utils/Api/ApiAgent";

const AuditTrailLister = (props: any) => {
  const {evidence, assetId, metaData, uploadedOn} = props;
  const assetDetailBottomTabs: boolean = useSelector(
    (state: RootState) => state.videoPlayerSettingsSlice.assetDetailBottomTabs
  );
  const { t } = useTranslation<string>();
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [orderBy] = React.useState<string>("name");
  const [open, setOpen] = React.useState<boolean>(false);
  const [rows, setRows] = React.useState<AuditTrail[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<AuditTrail>();
  const [selectedItems, setSelectedItems] = React.useState<AuditTrail[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<AuditTrail[]>();
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [order] = React.useState<Order>("asc");
  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });


  const AssetTrail: any = useSelector((state: RootState) => state.assetDetailReducer.assetTrailInfo);

  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);
  const dataArrayBuilder = () => {
    let dataRows : any[] = reformattedRows ?? [];
    searchData.forEach((el: SearchObject) => {
      if (el.columnName === "userName" || el.columnName === "notes")
        dataRows = onTextCompare(dataRows, headCells, el);
      if (el.columnName === "performedOn") {
        dataRows = onDateCompare(dataRows, headCells, el);
      }
    });
    setRows(dataRows);
  };

  const resizeRowAssetsDataTable = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };


  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "assetDataTable");
  }, []);


  useEffect(() => {
 
    setRows(AssetTrail)
    setReformattedRows(AssetTrail)
  }, [AssetTrail]);

  const searchText = (
    rowsParam: AuditTrail[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    };

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
          prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
        );
      }
    };


    return (
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
    );
  };

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

  const getuploadCompletedOn = async (files: any) => {
    if (files) {
      let uploadCompletedOn;
      for (const file of files) {
        if (file.type == "Video") {
          let url = "/Files/"+file.filesId +"/"+ file.accessCode;
          await FileAgent.getFile(url).then((response) => {
            uploadCompletedOn = response.history.uploadCompletedOn;
          });
          break;
        }
      }
      return uploadCompletedOn;
    }
  };
  

  const searchDate = (
    rowsParam: any[],
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
          startDate: reformattedRows !== undefined ? reformattedRows[0].captured : "",
          endDate: reformattedRows !== undefined ? reformattedRows[reformattedRows.length - 1].captured : "",
          value: "anytime",
          displayText: t("anytime"),
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

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: `${t("Seq. No")}`,
      id: "seqNo",
      align: "right",
      searchComponent: searchText,
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      minWidth: '130',
  
    },
    {
      label: `${t("Captured")}`,
      id: "performedOn",
      align: "right",
      dataComponent: dateDisplayFormat,
      //  dataComponent: (e: string) => textDisplay(e, " "),
      searchFilter: true,
      searchComponent: searchDate,
      sort: true,
      minWidth: '175',
    
  
    },
    {
      label: `${t("User_Name")}`,
      id: "userName",
      align: "right",
      searchFilter: true,
      searchComponent: searchText,
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      minWidth: '314',
 
    },
    {
      label: `${t("Activity")}`,
      id: "notes",
      align: "right",
      searchFilter: true,
      searchComponent: searchText,
      dataComponent: (e: string) => textDisplayStatus(e, " "),
      sort: true,
      minWidth: '1100',
    }
  ]);

  const clearAll = () => {
    const clearButton: any = document.getElementsByClassName(
      "MuiAutocomplete-clearIndicator"
    )[0];
    clearButton && clearButton.click();
    setOpen(false);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
    setSearchData([]);
  };

  const resizeRowUnitDetail = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  }

  const downloadAuditTrail = async () => {
    if (rows) {
      let image = await toDataURL(window.location.origin + '/assets/images/Getac_logo_orange.jpg').then(dataUrl => {
        return dataUrl;
      })
      image = image ? image : "";
      let getAssetData = JSON.parse(JSON.stringify(evidence))
      let AllAssetData = [getAssetData.assets.master, ...getAssetData.assets.children];
      let currentAssetData = AllAssetData.find((x:any)=> x.id == assetId);
      let assetInfo;
      if(currentAssetData){
        if (getAssetData) {
          let categories: any[] = getAssetData.categories.map((x: any) => {
              return x.name;
          });

          let owners: any[] = currentAssetData.owners.map(
            (x: any) =>
              x.record.find((y: any) => y.key == "UserName")?.value ?? ""
          );

          let unit  = currentAssetData.unitId <= 0 ? "N/A" : currentAssetData.unit?.record.find((y: any) => y.key == "Name")?.value ?? "N/A"
            
          let checksum: number[] = [];
          currentAssetData.files.forEach((x: any) => {
            checksum.push(x.checksum.checksum);
          });

          let size = currentAssetData.files.reduce(
            (a: any, b: any) => a + b.size,
            0
          );

          let categoriesForm: string[] = [];
          getAssetData.categories.forEach((x: any) => {
            categoriesForm.push(x.record.cmtFieldName);
          });

          assetInfo = {
            owners: owners.join(", "),
            unit: unit.toString(),
            capturedDate: convertDateTime(getAssetData.createdOn).join(" "),
            checksum: checksum,
            duration: milliSecondsToTimeFormat(
              new Date(currentAssetData.duration)
            ),
            size: formatBytes(size, 2),
            retention:
              retentionSpanText(
                getAssetData.holdUntil,
                getAssetData.expireOn
              ) ?? "",
            categories: categories.join(", "),
            categoriesForm: categoriesForm,
            id: currentAssetData.id,
            assetName: currentAssetData.name,
            typeOfAsset: currentAssetData.typeOfAsset,
            status: currentAssetData.status,
            camera: currentAssetData.camera ?? "",
            recordedBy: currentAssetData?.recordedByCSV ?? "",
          };
        }
        
      }
      let uploadCompletedOn = await getuploadCompletedOn(
        currentAssetData?.files
      );
      let uploadCompletedOnFormatted = uploadCompletedOn
          ? convertDateTime(uploadCompletedOn).join(" ")
          : "";

      //download
      if (rows && assetInfo) {
        auditTrailPDFDownload(rows, assetInfo, uploadCompletedOnFormatted,image)
      }
    }
  }


  
  return (

            <div className="asset_detail_AT_table" style={{display: assetDetailBottomTabs ? "block" : "none"}}>
              {rows && (
                <CRXDataTable
                  id="Audit Trail"
                  getRowOnActionClick={(val: AuditTrail) =>
                    setSelectedActionRow(val)
                  }
                  toolBarButton={
                    <div className="auditTrailButton">
                      <button className="iconButton_global" onClick={() => downloadAuditTrail()}>
                        <i className="far fa-download"></i>
                        Export
                      </button>
                    </div>
                  }
                  showToolbar={true}
                  showCountText={false}
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
                  showCustomizeIcon={false}
                  className="asset_detail_AT_dataTable"
                  onClearAll={clearAll}
                  getSelectedItems={(v: AuditTrail[]) => setSelectedItems(v)}
                  onResizeRow={resizeRowUnitDetail}
                  onHeadCellChange={onSetHeadCells}
                  setSelectedItems={setSelectedItems}
                  selectedItems={selectedItems}
                  offsetY={0}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setPage={(page: any) => setPage(page)}
                  setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                  totalRecords={rows.length}
                  selfPaging={true}
                  stickyToolbar={242}
                  searchHeaderPosition={63}
                  dragableHeaderPosition={29}
                  selfSorting={true}
                />
              )}
            </div>
  );
};

export default AuditTrailLister;
