import { CRXColumn, CRXDataTable } from "@cb/shared";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import { DateTimeComponent } from '../../../GlobalComponents/DateTime';
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { RootState } from "../../../Redux/rootReducer";
import { dateOptionsTypes } from '../../../utils/constant';
import "./AssetDetailTabsMenu.scss";
import "./assetDetailTemplate.scss";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  HeadCellProps, onClearAll, onResizeRow, onSetSearchDataValue, onSetSingleHeadCellVisibility, Order, SearchObject, ValueString
} from "../../../GlobalFunctions/globalDataTableFunctions";
import { AuditTrail, DateTimeObject, DateTimeProps } from "./AssetDetailsTemplateModel";

const AuditTrailLister = (props: any) => {
  const {metaData, uploadedOn} = props;
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


  const AssetTrail: any = useSelector((state: RootState) => state.assetDetailReducer.assetTrailInfo);
  useEffect(() => {
    setRows(AssetTrail)
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

  const [dateTime, setDateTime] = React.useState<DateTimeProps>({
    dateTimeObj: {
      startDate: "",
      endDate: "",
      value: "",
      displayText: "",
    },
    colIdx: 0,
  });

  const searchDate = (
    rowsParam: AuditTrail[],
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
          value: "custom",
          displayText: "custom range",
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
      minWidth: '211',
      maxWidth: '300'
    },
    {
      label: `${t("Captured")}`,
      id: "performedOn",
      align: "right",
      dataComponent: dateDisplayFormat,
      //  dataComponent: (e: string) => textDisplay(e, " "),
      searchFilter: true,
      searchComponent: searchDate,
      sort: false,
      minWidth: '313',
      maxWidth: '485'
    },
    {
      label: `${t("Username")}`,
      id: "userName",
      align: "right",
      searchFilter: true,
      searchComponent: searchText,
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      minWidth: '314',
      maxWidth: '485'
    },
    {
      label: `${t("Activity")}`,
      id: "notes",
      align: "right",
      searchFilter: true,
      searchComponent: searchText,
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      minWidth: '415',
      maxWidth: '485'
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
  };

  const resizeRowUnitDetail = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  }

  const downloadAuditTrail = () => {
    if (rows && metaData) {
      const head = [[t('Seq No'), t('Captured'), t('Username'), t('Activity')]];
      let data: any[] = [];
      let arrS: any[] = [];
      rows.forEach((x: any) => {
        arrS.push(x.seqNo);
        arrS.push((new Date(x.performedOn)).toLocaleString());
        arrS.push(x.userName);
        arrS.push(x.notes);
        data.push(arrS);
        arrS = [];
      }
      );

      let CheckSum = metaData.checksum ? metaData.checksum.toString() : "";
      let assetId = metaData.id ? metaData.id.toString() : "";


      const doc = new jsPDF()
      doc.setFontSize(11)
      doc.setTextColor(100)
      let yaxis1 = 14;
      let yaxis2 = 70;
      let xaxis = 25;

      doc.text(t("CheckSum") + ":", yaxis1, xaxis)
      doc.text(CheckSum, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Asset Id") + ":", yaxis1, xaxis)
      doc.text(assetId, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Asset Type") + ":", yaxis1, xaxis)
      doc.text(metaData.typeOfAsset, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Asset Status") + ":", yaxis1, xaxis)
      doc.text(metaData.status, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Username") + ":", yaxis1, xaxis)
      doc.text(metaData.owners.join(", "), yaxis2, xaxis)
      xaxis += 5;

      let categoriesString = "";
      let tempxaxis = 0;
      metaData.categories.forEach((x: any, index: number) => {
        let formData = x.formDatas.map((y: any, index1: number) => {
          if (index1 > 0) {
            tempxaxis += 5
          }
          return y.key + ": " + y.value + "\n";
        })
        categoriesString += (x.name ? x.name : "") + ":    " + formData + "\n";
        if (index > 0) {
          tempxaxis += 5
        }
      }
      )
      doc.text(t("Categories") + ":", yaxis1, xaxis)
      doc.text(categoriesString, yaxis2, xaxis)
      xaxis += tempxaxis + 5;

      doc.text(t("Camera Name") + ":", yaxis1, xaxis)
      doc.text(metaData.camera, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Captured") + ":", yaxis1, xaxis)
      doc.text(metaData.capturedDate, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Uploaded") + ":", yaxis1, xaxis)
      doc.text(uploadedOn, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Duration") + ":", yaxis1, xaxis)
      doc.text(metaData.duration, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Size") + ":", yaxis1, xaxis)
      doc.text(metaData.size, yaxis2, xaxis)
      xaxis += 5;

      doc.text(t("Retention") + ":", yaxis1, xaxis)
      doc.text(metaData?.retention, yaxis2, xaxis)
      xaxis += 5;

      autoTable(doc, {
        startY: xaxis,
        head: head,
        body: data,
        didDrawCell: (data: any) => {
          console.log(data.column.index)
        },
      })
      doc.save('ASSET ID_Audit_Trail.pdf');
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
                  offsetY={51}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setPage={(page: any) => setPage(page)}
                  setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                  totalRecords={rows.length}
                  selfPaging={true}
                />
              )}
            </div>
  );
};

export default AuditTrailLister;
