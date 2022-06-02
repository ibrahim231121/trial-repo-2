import React, { useEffect, useContext } from "react";
import { CRXDataTable, CRXColumn,CRXGlobalSelectFilter  } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {DateTimeComponent } from '../GlobalComponents/DateTime';
import { dateOptionsTypes } from '../utils/constant';
import { RootState } from "../Redux/rootReducer";
import textDisplay from "../GlobalComponents/Display/TextDisplay";

import anchorDisplayUnit from "../GlobalComponents/Display/AnchorDisplayUnit";
import './index.scss'
import { getUnitInfoAsync } from "../Redux/UnitReducer";
import dateDisplayFormat from "../GlobalFunctions/DateFormat";
import textDisplayStatus from "../GlobalComponents/Display/textDisplayStatus";
import textDisplayStation from "../GlobalComponents/Display/textDisplayStation";
import multitextDisplayAssigned from "../GlobalComponents/Display/multitextDisplayAssigned";
import MultSelectiDropDown from "../GlobalComponents/DataTableSearch/MultSelectiDropDown";
import { makeStyles } from "@material-ui/core/styles";
import Popper from '@material-ui/core/Popper';


import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onTextCompare,
  onMultipleCompare,
  onDateCompare,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  onClearAll,
  onSaveHeadCellData,
  onSetHeadCellVisibility
} from "../GlobalFunctions/globalDataTableFunctions";
import UnitAndDevicesActionMenu from "./UnitAndDevicesActionMenu";
import TextSearch from "../GlobalComponents/DataTableSearch/TextSearch";

import { enterPathActionCreator } from "../Redux/breadCrumbReducer";
import ApplicationPermissionContext from "../ApplicationPermission/ApplicationPermissionContext";


type Unit = {
  id: number;
  unitId: string,
  description: string,
  serialNumber: string,
  template: string,
  version: string,
  station: string,
  assignedTo: string[],
  lastCheckedIn: string,
  status: string,
  stationId: number,
  
}
interface renderCheckMultiselect {
  label?: string,
  id?: string,

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



const UnitAndDevices: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();


  React.useEffect(() => {
    dispatch(getUnitInfoAsync()); // getunitInfo 

   let headCellsArray = onSetHeadCellVisibility(headCells);
   setHeadCells(headCellsArray);
   onSaveHeadCellData(headCells, "Units & Devices");  // will check this
   document.getElementById("UDAssigned")?.parentElement?.classList.add("UDAssignedClass");
  }, []);

  


  const units: any = useSelector((state: RootState) => state.unitReducer.unitInfo);
  const [rows, setRows] = React.useState<Unit[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Unit[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<Unit[]>();
  const [selectedActionRow, setSelectedActionRow] = React.useState<Unit>();

  const [open, setOpen] = React.useState<boolean>(false)

  const {getModuleIds} = useContext(ApplicationPermissionContext);

  const setData = () => {
 
    let unitRows: Unit[] = [];
    
        if (units && units.length > 0) {
          unitRows = units.map((unit: any, i:number) => {
            // <a href={`unitsanddevices/detail/${unit.recId +"_"+ unit.stationRecId}`}>{unit.station}</a>,
                return {
                    id: unit.recId,
                    unitId: unit.unitId + "_" + unit.recId +"_"+ unit.stationRecId+"_"+unit.template,
                    description: unit.description,
                    station: unit.station,
                    serialNumber: unit.serialNumber,
                    template: unit.template,
                    version: unit.version,
                    assignedTo: unit.assignedTo,
                  //   assignedTo: unit.assignedTo != null ? unit.assignedTo.split(',').map((x: string) => {
                  //     return x.trim();
                  // }) : [],
                    lastCheckedIn: unit.lastCheckedIn,
                    status: unit.status,
                    stationId: unit.stationRecId
                }
            })
        }
        setRows(unitRows)
        setReformattedRows(unitRows);

  }

  React.useEffect(() => {
    setData();
    dispatch(enterPathActionCreator({ val: ""}));
  }, [units]);

  const searchText = (
    rowsParam: Unit[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {

    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
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
      rowsParam: Unit[],
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
                  startDate: reformattedRows !== undefined ? reformattedRows[0].lastCheckedIn : "",
                  endDate: reformattedRows !== undefined ? reformattedRows[reformattedRows.length - 1].lastCheckedIn : "",
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
  function findUniqueValue(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}

const useStyles = makeStyles({
  paper: {
    backgroundColor: "blue !important",
    paddingBottom: 16,
    paddingRight: 16,
    marginTop: 16,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 500
  },

});

const classes = useStyles();

const multiSelectVersionCheckbox = (rowParam: Unit[],headCells: HeadCellProps[], colIdx: number, initialRows:Unit[]) => {
 

  if(colIdx === 6) {

  let versionlist: any = [];
    if(initialRows !== undefined){
  if(initialRows.length > 0) {
      initialRows.map((x: Unit) => {
        versionlist.push(x.version );
      });
  }
}
  versionlist = versionlist.filter(findUniqueValue);
  let version: any = [{ label: "No Version"}];
  versionlist.map((x: string) => { version.push({ label: x}) })

  const settingValues = (headCell: HeadCellProps) => {

      let val: any = []
      if(headCell.headerArray !== undefined) 
          val = headCell.headerArray.filter(v => v.value !== "").map(x => x.value)
      else 
          val = []
      return val
  }
  return (
      <div>

          <CRXGlobalSelectFilter
              id="multiSelect"
              multiple={true}
              value={settingValues(headCells[colIdx])}
              onChange={(e: React.SyntheticEvent, option: renderCheckMultiselect[]) => { return changeMultiselect(e, option, colIdx) }}
              options={version}
              className="unitVersionMultiSelect"
              CheckBox={true}
              checkSign={false}
              open={open}
              classes={{
                paper: classes.paper

              }
              }
              theme="dark"
              clearSelectedItems={(e: React.SyntheticEvent, options: renderCheckMultiselect[]) => deleteSelectedItems(e, options)}
              getOptionLabel={(option: renderCheckMultiselect) => option.label ? option.label : " "}
              getOptionSelected={(option: renderCheckMultiselect, label: renderCheckMultiselect) => option.label === label.label}
              onOpen={(e: React.SyntheticEvent) => { return openHandler(e) }}
              noOptionsText="No Version"
     
          />                  
      </div>
  )
  }

}


  const multiSelectCheckbox = (rowParam: Unit[],headCells: HeadCellProps[], colIdx: number, initialRows:Unit[]) => {

    if(colIdx === 2) {
       

    let statuslist: any = [];

    if(initialRows !== undefined){
    if(initialRows.length > 0) {
        initialRows.map((x: Unit) => {
          statuslist.push(x.status);
        });
    }
  }
    statuslist = statuslist.filter(findUniqueValue);
    let status: any = [{ label: "No Status"}];
    statuslist.map((x: string) => { status.push({ label: x}) })
    const settingValues = (headCell: HeadCellProps) => {
  
        let val: any = []
        if(headCell.headerArray !== undefined) 
            val = headCell.headerArray.filter(v => v.value !== "").map(x => x.value)
        else 
            val = []
        return val
    }

  
  
    return (
        <div>
            
            <CRXGlobalSelectFilter
                id="multiSelect"
                multiple={true}
                value={settingValues(headCells[colIdx])}
                onChange={(e: React.SyntheticEvent, option: renderCheckMultiselect[]) => { return changeMultiselect(e, option, colIdx) }}
                options={status}
                CheckBox={true}
                className="unitStatusMultiSelect"
                checkSign={false}
                statusIcon={true}
                open={open}
                theme="dark"
                clearSelectedItems={(e: React.SyntheticEvent, options: renderCheckMultiselect[]) => deleteSelectedItems(e, options)}
                getOptionLabel={(option: renderCheckMultiselect) => option.label ? option.label : " "}
                getOptionSelected={(option: renderCheckMultiselect, label: renderCheckMultiselect) => option.label === label.label}
                onOpen={(e: React.SyntheticEvent) => { return openHandler(e) }}
                noOptionsText="No Status"
            />
        </div>
    )
    }


    if(colIdx === 9) {
     
  let templatelist: any = [];

  if(initialRows !== undefined){
  if(initialRows.length > 0) {
      initialRows.map((x: Unit) => {
        templatelist.push(x.template);
      });
  }
}
  templatelist = templatelist.filter(findUniqueValue);
  let template: any = [{ label: "No Template"}];
  templatelist.map((x: string) => { template.push({ label: x}) })
  const settingValues = (headCell: HeadCellProps) => {

      let val: any = []
      if(headCell.headerArray !== undefined) 
          val = headCell.headerArray.filter(v => v.value !== "").map(x => x.value)
      else 
          val = []
      return val
  }

  const PopperTemplate = function (props: any) {
    return (<Popper {...props}  className="PopperTemplate" placement="left-start"/>)
  }

  return (
      <div>
          
          <CRXGlobalSelectFilter
              id="multiSelect"
              multiple={true}
              value={settingValues(headCells[colIdx])}
              onChange={(e: React.SyntheticEvent, option: renderCheckMultiselect[]) => { return changeMultiselect(e, option, colIdx) }}
              options={template}
              CheckBox={true}
              PopperComponent={PopperTemplate}
              className="unitTemplateMultiSelect"
              checkSign={false}
              statusIcon={false}
              open={open}
              theme="dark"
              clearSelectedItems={(e: React.SyntheticEvent, options: renderCheckMultiselect[]) => deleteSelectedItems(e, options)}
              getOptionLabel={(option: renderCheckMultiselect) => option.label ? option.label : " "}
              getOptionSelected={(option: renderCheckMultiselect, label: renderCheckMultiselect) => option.label === label.label}
              onOpen={(e: React.SyntheticEvent) => { return openHandler(e) }}
              noOptionsText="No Template"
          />
      </div>
  )
  }


}


const changeMultiselect = (e: React.SyntheticEvent, val: renderCheckMultiselect[], colIdx: number) => {

  let value: any[] = val.map((x) => {
      let item = {
          value: x.label
      }
      return item
  })
  onSelection(value, colIdx)
  headCells[colIdx].headerArray = value;
}
const deleteSelectedItems = (e: React.SyntheticEvent, options: renderCheckMultiselect[]) => {
  setSearchData([]);
  let headCellReset = onClearAll(headCells);
  setHeadCells(headCellReset);
}
const openHandler = (_: React.SyntheticEvent ) => {
  
  //setOpen(true)
}



const AnchorDisplay = (e: string) => {
  if(getModuleIds().includes(14)) {
  return anchorDisplayUnit(e)
  }
  else{
  let lastid = e.lastIndexOf("_");
  let text =  e.substring(0,lastid)
  return textDisplay(text,"")
  }
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
      maxWidth: "100",
    },
    {
      label: `${t("Unit ID")}`,
      id: "unitId",
      align: "left",
      dataComponent: (e: string) => AnchorDisplay(e),// textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "120",
      
    }, 
    {
      label: `${t("Status")}`,
      id: "status",
      align: "left",
      dataComponent: (e: string) => textDisplayStatus(e, ""),
      sort: true,
      searchFilter: true,
    //  searchComponent: searchText,
      
     searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number, initialRows:Unit[]) =>
      multiSelectCheckbox(rowData, columns, colIdx, initialRows),
         
     minWidth: "100",
      maxWidth: "100",
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "265",
      maxWidth: "265",
    },
    {
      label: `${t("Assigned To")}`,
      id: "assignedTo",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplayAssigned(e, ""),
      sort: true,
      searchFilter: true,
    //  searchComponent: searchText,
       searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number) => searchAndNonSearchMultiDropDown(rowData, columns, colIdx, true),
           
      minWidth: "20",
      maxWidth: "20",
    },
    {
      label: `${t("Serial Number")}`,
      id: "serialNumber",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "160",
      maxWidth: "160",
    },
    {
      label: `${t("Version")}`,
      id: "version",
      align: "center",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number, initialRows:Unit[]) =>
      multiSelectVersionCheckbox(rowData, columns, colIdx, initialRows),
        
       minWidth: "80",
       maxWidth: "100",
    },
    {
      label: `${t("Station")}`,
      id: "station",
      align: "left",
      dataComponent: (e: string) => textDisplayStation(e, "linkColor"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "185",
      maxWidth: "185",
    },
    {
      label: `${t("Last Checked In")}`,
      id: "lastCheckedIn",
      align: "center",
      dataComponent: dateDisplayFormat,
      sort: true,
      searchFilter: true,
      searchComponent: searchDate,
      minWidth: "190"
    },
    {
      label: `Template`,
      id: "template",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
     // searchComponent: searchText,
      
     searchComponent: (rowData: Unit[], columns: HeadCellProps[], colIdx: number, initialRows:Unit[]) =>
         multiSelectCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "100",
      
    }, 
  ]);

  const searchAndNonSearchMultiDropDown = (
    rowsParam: Unit[],
    headCells: HeadCellProps[],
    colIdx: number,  
    isSearchable: boolean,
) => {
    const onSetSearchData = () => {
        setSearchData((prevArr) =>
            prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
        );
    };
    const onSetHeaderArray = (v: ValueString[]) => {
        headCells[colIdx].headerArray = v;
    };
  
   return (
        <MultSelectiDropDown
            headCells={headCells}
            colIdx={colIdx}
            reformattedRows={reformattedRows !== undefined ? reformattedRows : rowsParam}
            isSearchable={isSearchable}
            onMultiSelectChange={onSelection}
            onSetSearchData={onSetSearchData}
            onSetHeaderArray={onSetHeaderArray}
          
        />
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


  useEffect(() => {
    dataArrayBuilder();
}, [searchData]);

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

const dataArrayBuilder = () => {
    if (reformattedRows !== undefined) {
    
        let dataRows: Unit[] = reformattedRows;
        searchData.forEach((el: SearchObject) => {
          if (el.columnName === "description" || el.columnName === "station" || el.columnName === "unitId" || el.columnName === "assignedTo" || el.columnName === "serialNumber")
                dataRows = onTextCompare(dataRows, headCells, el);
            if (el.columnName === "lastCheckedIn")
                dataRows = onDateCompare(dataRows, headCells, el);
                if (el.columnName === "status") {
                  dataRows = onMultipleCompare(dataRows, headCells, el);
                  if(el.value.includes("No Status")) {
                      reformattedRows.filter(i => i.status.length === 0).map((x:Unit) => {
                          dataRows.push(x)
                      })
                      
                  }
              }
              if (el.columnName === "version") {
                dataRows = onMultipleCompare(dataRows, headCells, el);
                if(el.value.includes("No Version")) {
                    reformattedRows.filter(i => i.version.length === 0).map((x:Unit) => {
                        dataRows.push(x)
                    })
                    
                }
            }

            if (el.columnName === "template") {
              dataRows = onMultipleCompare(dataRows, headCells, el);
              if(el.value.includes("No Template")) {
                  reformattedRows.filter(i => i.template.length === 0).map((x:Unit) => {
                      dataRows.push(x)
                  })
                  
              }
          }



        }
        );
        setRows(dataRows);
    }
};

const resizeRowUnitDevice = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
};

const clearAll = () => {
  const clearButton:any = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
  clearButton && clearButton.click()
  setOpen(false)
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
};

const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
};

useEffect(()=>{
  var headAssigned = document.getElementById("UDAssigned");
  headAssigned?.parentElement?.classList.add("UDAssignedClass");
 })


  return (
 
  
    <div className="unitDeviceMain searchComponents unitDeviceMainUii ">
      {/* <p className="unitsStatusCounter">{rows.length} Units</p> */}
      {
        
        rows && (
        <CRXDataTable
          id="Units & Devices"
          actionComponent={<UnitAndDevicesActionMenu />}
          getRowOnActionClick={(val: Unit) =>
            setSelectedActionRow(val)
          }
          showToolbar={true}
          showCountText={true}
          columnVisibilityBar={true}
          showHeaderCheckAll={true}
          initialRows={reformattedRows}
          dragVisibility={false}
          showCheckBoxesCol={true}
          showActionCol={true}
          headCells={headCells}
          dataRows={rows}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          allowDragableToList={true}
          showTotalSelectedText={false}
          showActionSearchHeaderCell={true}
          showCustomizeIcon={true}
          //---required Props
          className=""
          onClearAll={clearAll}
          getSelectedItems={(v: Unit[]) => setSelectedItems(v)}
          onResizeRow={resizeRowUnitDevice}
          onHeadCellChange={onSetHeadCells}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          offsetY={190}
          />
          )
        }
      
    </div>
 
  )
}

export default UnitAndDevices
