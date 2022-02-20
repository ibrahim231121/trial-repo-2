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


type ConfigTemplate = {
  id: number;
  name: string;
  type: string;
  indicator: string;
  device: any;


}

type DeviceType = {
  id: string,
  name: string,
  description: string,
  category: string,
  history: {
    createdOn: string,
    updateOn: string | null
    rowVersion: string
  }
}


const configTemplate = (name: string, device: any) => {
  console.log(device);
  return (
    <>
      <Link className={"linkColor"} children={name} key={device.recId} to={{ pathname: '/admin/unitanddevices/createtemplate/template', state: { id: device.recId, name: name, isedit: true, type: "BC04", deviceTypeCategory: device.deviceTypeCategory } }} />
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
      label: `${t("Type")}`,
      id: "type",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
    },
    {
      label: `${t("Indicator")}`,
      id: "indicator",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
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
  return (
    <div style={{ marginLeft: "6%", marginTop: "10%" }}>
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
              <Link to={{ pathname: '/admin/unitanddevices/createtemplate/template', state: { id: y, isedit: false, type: x.name, deviceTypeCategory: x.category } }}>
                <div style={{ backgroundColor: '#FFFFFF' }}>Create {x.name}</div>
              </Link>
            </MenuItem>
          )
        })}
      </Menu >
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