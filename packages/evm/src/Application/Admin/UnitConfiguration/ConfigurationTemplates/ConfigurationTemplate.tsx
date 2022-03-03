import React, { useEffect } from "react";
import { CRXDataTable, CRXMenu } from "@cb/shared";
import { useTranslation } from "react-i18next";
import useGetFetch from "../../../../utils/Api/useGetFetch";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGroupAsync, getGroupUserCountAsync } from "../../../../Redux/GroupReducer";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import anchorDisplay from "../../../../GlobalComponents/Display//AnchorDisplay";
import { RootState } from "../../../../Redux/rootReducer";
import './ConfigurationTemplate.scss'
import {
  DEVICETYPE_GET_URL
} from "../../../../utils/Api/url";
import { CRXButton } from "@cb/shared";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import ConfigTemplateActionMenu from "./ConfigTemplateActionMenu";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import { getConfigurationInfoAsync, getDeviceTypeInfoAsync } from "../../../../Redux/TemplateConfiguration";
import { Link } from "react-router-dom";
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
  onSaveHeadCellData
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import { CRXGlobalSelectFilter } from "@cb/shared";
import { PausePresentation } from "@material-ui/icons";
import { classicNameResolver } from "typescript";


type ConfigTemplate = {
  id: number;
  name: string;
  type: string;
  station: string,
  indicator: string;
  device: any;


}

type DeviceType = {
  id: string,
  name: string,
  description: string,
  category: string,
  deviceTypeCategory: string,
  history: {
    createdOn: string,
    updateOn: string | null
    rowVersion: string
  }
}

type Unit = {
  id: number;
  unitId: string,
  description: string,
  serialNumber: string,
  version: string,
  station: string,
  type: string
  assignedTo: string[],
  lastCheckedIn: string,
  status: string,
  stationId: number
}
interface renderCheckMultiselect {
  label?: string,
  id?: string,

}


const configTemplate = (name: string, device: any) => {
  return (
    <>
      <Link className={"linkColor"} children={name} key={device.recId} to={{ pathname: '/admin/unitanddevices/createtemplate/template', state: { id: device.recId, name: name, isedit: true, deviceId: device.deviceTypeCategory, deviceType: device.type } }} />
    </>
  );
};

const ConfigurationTemplates: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  let history = useHistory()


  React.useEffect(() => {
    dispatch(getConfigurationInfoAsync());
    dispatch(getDeviceTypeInfoAsync());

    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "unitConfifTemplateDataTable");  // will check this

  }, []);



  const UnitConfigurationTemplates: any = useSelector((state: RootState) => state.templateSlice.templateInfo);
  const DeviceTypes: any = useSelector((state: RootState) => state.templateSlice.deviceType);

  const [createTemplateDropdown, setCreateTemplateDropdown] = React.useState<DeviceType[]>([]);
  const [rows, setRows] = React.useState<ConfigTemplate[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<ConfigTemplate[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<ConfigTemplate[]>();
  const [selectedActionRow, setSelectedActionRow] = React.useState<ConfigTemplate>();
  const [open, setOpen] = React.useState<boolean>(false)

  const setData = () => {
    let configTemplateRows: ConfigTemplate[] = [];
    if (UnitConfigurationTemplates && UnitConfigurationTemplates.length > 0) {
      configTemplateRows = UnitConfigurationTemplates.map((template: any, i: number) => {
        return {
          id: template.recId,
          name: template.name,
          type: template.type,
          indicator: template.indicator,
          device: template

        }
      })
    }
    setRows(configTemplateRows);
    setReformattedRows(configTemplateRows);

  }
  const setTemplateDropdown = () => {
    if (DeviceTypes && DeviceTypes.length > 0) {
      setCreateTemplateDropdown(DeviceTypes)
    }

  }
  React.useEffect(() => {
    setTemplateDropdown();
  }, [DeviceTypes]);

  React.useEffect(() => {
    setData();
  }, [UnitConfigurationTemplates]);

  const searchText = (
    rowsParam: ConfigTemplate[],
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

  function findUniqueValue(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  const openHandler = (_: React.SyntheticEvent) => {
    console.log("onOpen")
    setOpen(true)
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
  // ------------------SATION DROP DOWN START
  const multiSelectVersionCheckbox = (rowParam: ConfigTemplate[], headCells: HeadCellProps[], colIdx: number, initialRows: ConfigTemplate[]) => {

    if (colIdx === 2) {

      let stationlist: any = [];
      if (initialRows !== undefined) {
        if (initialRows.length > 0) {
          initialRows.map((x: ConfigTemplate) => {
            stationlist.push(x.station);
          });
        }
      }
      stationlist = stationlist.filter(findUniqueValue);
      let station: any = [{ label: "No Station" }];
      stationlist.map((x: string) => { station.push({ label: x }) })

      const settingValues = (headCell: HeadCellProps) => {

        let val: any = []
        if (headCell.headerArray !== undefined)
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
            options={station}
            CheckBox={true}
            checkSign={false}
            open={open}
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

  // ------------------SATION DROP DOWN END


  // ------------------TYPE DROP DOWN START
  const multiSelectTypeCheckbox = (rowParam: ConfigTemplate[], headCells: HeadCellProps[], colIdx: number, initialRows: ConfigTemplate[]) => {

    if (colIdx === 3) {

      let typelist: any = [];
      if (initialRows !== undefined) {
        if (initialRows.length > 0) {
          initialRows.map((x: ConfigTemplate) => {
            typelist.push(x.type);
          });
        }
      }
      typelist = typelist.filter(findUniqueValue);

      let type: any = [{ label: "No type" }];
      typelist.map((x: string) => { type.push({ label: x }) })

      const settingValues = (headCell: HeadCellProps) => {

        let val: any = []
        if (headCell.headerArray !== undefined)
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
            className="typeDropDown"
            value={settingValues(headCells[colIdx])}
            onChange={(e: React.SyntheticEvent, option: renderCheckMultiselect[]) => { return changeMultiselect(e, option, colIdx) }}
            options={type}
            CheckBox={true}
            checkSign={false}
            open={open}
            theme="dark"
            clearSelectedItems={(e: React.SyntheticEvent, options: renderCheckMultiselect[]) => deleteSelectedItems(e, options)}
            getOptionLabel={(option: renderCheckMultiselect) => option.label ? option.label : " "}
            getOptionSelected={(option: renderCheckMultiselect, label: renderCheckMultiselect) => option.label === label.label}
            onOpen={(e: React.SyntheticEvent) => { return openHandler(e) }}
            noOptionsText="No Type"
          />
        </div>
      )
    }

  }

  // ------------------TYPE DROP DOWN END


  //------------------INDICATOR DROP DOWN START
  const multiSelectIndicatorCheckbox = (rowParam: ConfigTemplate[], headCells: HeadCellProps[], colIdx: number, initialRows: ConfigTemplate[]) => {

    if (colIdx === 4) {

      let indicatorlist: any = [];
      if (initialRows !== undefined) {
        if (initialRows.length > 0) {
          initialRows.map((x: ConfigTemplate) => {
            indicatorlist.push(x.indicator);
          });
        }
      }
      indicatorlist = indicatorlist.filter(findUniqueValue);

      let indicator: any = [{ label: "Default" }];
      indicatorlist.map((x: string) => { indicator.push({ label: x }) })

      const settingValues = (headCell: HeadCellProps) => {

        let val: any = []
        if (headCell.headerArray !== undefined)
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
            options={indicator}
            CheckBox={false}
            checkSign={true}
            open={open}
            theme="dark"
            clearSelectedItems={(e: React.SyntheticEvent, options: renderCheckMultiselect[]) => deleteSelectedItems(e, options)}
            getOptionLabel={(option: renderCheckMultiselect) => option.label ? option.label : " "}
            getOptionSelected={(option: renderCheckMultiselect, label: renderCheckMultiselect) => option.label === label.label}
            onOpen={(e: React.SyntheticEvent) => { return openHandler(e) }}
            noOptionsText="No Indicator"
          />
        </div>
      )
    }

  }

  const IndicatorDisplay = (text: string, classes: string | undefined) => {
    return (<div>Default</div>)
  }

  const StationDisplay = (text: string, classes: string | undefined) => {
    return (<div>Station 1</div>)
  }


  // ------------------INDICATOR DROP DOWN END




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
      label: `${t("Name")}`,
      id: "name",
      align: "left",
      dataComponent: configTemplate,
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
      detailedDataComponentId: "device"
    },
    {
      label: `${t("Station")}`,
      id: "Station",
      align: "left",
      dataComponent: (e: string) => StationDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: ConfigTemplate[], columns: HeadCellProps[], colIdx: number, initialRows: ConfigTemplate[]) =>
        multiSelectVersionCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "100",
      maxWidth: "100",
      detailedDataComponentId: "id",
    },
    {
      label: `${t("Type")}`,
      id: "type",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: ConfigTemplate[], columns: HeadCellProps[], colIdx: number, initialRows: ConfigTemplate[]) =>
        multiSelectTypeCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "100",
      maxWidth: "100",
    },
    {
      label: `${t("Indicator")}`,
      id: "indicator",
      align: "left",
      dataComponent: (e: string) => IndicatorDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: (rowData: ConfigTemplate[], columns: HeadCellProps[], colIdx: number, initialRows: ConfigTemplate[]) =>
        multiSelectIndicatorCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "100",
      maxWidth: "100",
    }
  ]);


  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);


  const dataArrayBuilder = () => {
    if (reformattedRows !== undefined) {
      let dataRows: ConfigTemplate[] = reformattedRows;
      searchData.forEach((el: SearchObject) => {
        if (el.columnName === "name" || el.columnName === "type" || el.columnName === "indicator")
          dataRows = onTextCompare(dataRows, headCells, el);


      }
      );
      setRows(dataRows);
    }
  };

  const resizeRow = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };
  useEffect(() => {
    document.querySelector(".footerDRP")?.closest(".MuiMenu-paper")?.classList.add("MuiMenu_Modal_Ui");
  })
  return (
    <div className="CrxConfigTemplate">
      <div className="menu_List_Button">
        <Menu
          style={{ backgroundColor: '#FFFFFF' }}
          align="start"
          viewScroll="initial"
          direction="bottom"
          position="auto"
          arrow
          menuButton={
            <MenuButton>
              Create Template
            </MenuButton>
          }
        >
          {createTemplateDropdown.map((x, y) => {
            return (
              <MenuItem >
                <Link to={{ pathname: '/admin/unitanddevices/createtemplate/template', state: { id: y, isedit: false, type: x.name, deviceId: x.id, deviceType: x.category } }}>
                  <div style={{ backgroundColor: '#FFFFFF' }}>Create {x.name}</div>
                </Link>
              </MenuItem>
            )
          })}
        </Menu >
      </div>

      {
        rows && (
          <CRXDataTable
            id="unitConfifTemplateDataTable"
            actionComponent={<ConfigTemplateActionMenu
              row={selectedActionRow}
            />}
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
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showTotalSelectedText={false}
            showActionSearchHeaderCell={true}
            showCustomizeIcon={true}
            className="crxTableHeight crxTableDataUi configTemplate"
            onClearAll={clearAll}
            getSelectedItems={(v: ConfigTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRow}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
          />
        )
      }
    </div>
  )
}

export default ConfigurationTemplates