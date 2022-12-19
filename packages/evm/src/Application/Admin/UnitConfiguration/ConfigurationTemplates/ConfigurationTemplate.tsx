import React, { useEffect, useContext } from "react";
import { CRXDataTable, CBXMultiSelectForDatatable } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { RootState } from "../../../../Redux/rootReducer";
import "./ConfigurationTemplate.scss";
import { CRXButton } from "@cb/shared";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import ConfigTemplateActionMenu from "./ConfigTemplateActionMenu";
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import {
  getConfigurationInfoAsync,
  getDeviceTypeInfoAsync,
  getAllConfigurationValuesAsync
} from "../../../../Redux/TemplateConfiguration";
import { Link } from "react-router-dom";
import { urlList, urlNames } from "../../../../utils/urlList";
import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onTextCompare,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  onClearAll,
  onSetHeadCellVisibility,
  onSaveHeadCellData,
  GridFilter,
  PageiGrid
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

type ConfigTemplate = {
  id: number;
  name: string;
  deviceType: string;
  station: string;
  defaultTemplate: string;
  device: any;
};

type DeviceType = {
  id: string;
  name: string;
  description: string;
  deviceType: string;
  deviceTypeCategory: string;
};

type Unit = {
  id: number;
  unitId: string;
  description: string;
  serialNumber: string;
  version: string;
  station: string;
  type: string;
  assignedTo: string[];
  lastCheckedIn: string;
  status: string;
  stationId: number;
};
interface renderCheckMultiselect {
  value: string;
  id: string;
}

const configTemplate = (name: string, device: any) => {
  return (
    <>
      <Link
        className={"linkColor"}
        children={name}
        key={device.recId}
        to={{
          pathname: urlList.filter((item: any) => item.name === urlNames.unitDeviceTemplateCreateBCO4)[0].url,
          state: {
            id: device.recId,
            name: name,
            isedit: true,
            deviceId: device.deviceId,
            deviceType: device.deviceType,
            isDefaultTemplate: device.isDefaultTemplate
          },
        }}
      />
    </>
  );
};

const ConfigurationTemplates: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  let history = useHistory();
  const { getModuleIds, moduleIds } = useContext(ApplicationPermissionContext);
  
  React.useEffect(() => {
    //dispatch(getConfigurationInfoAsync(pageiGrid));
    dispatch(getDeviceTypeInfoAsync());
    dispatch(getAllConfigurationValuesAsync());
    // setCreateTemplateDropdown([
    //   {
    //     "id": "1",
    //     "name": "Incar",
    //     "description": "This is Incar",
    //     "deviceType": "Incar",
    //     "deviceTypeCategory": "DVR"
    //   },
    //   {
    //     "id": "6",
    //     "name": "BC03",
    //     "description": "This is BodyWorn Gen3",
    //     "deviceType": "BC03",
    //     "deviceTypeCategory": "BodyWorn"
    //   },
    //   {
    //     "id": "7",
    //     "name": "BC03 LTE",
    //     "description": "This is BodyWorn Gen3 LTE",
    //     "deviceType": "BC03LTE",
    //     "deviceTypeCategory": "BodyWorn"
    //   },
    //   {
    //     "id": "8",
    //     "name": "BC04",
    //     "description": "This is BodyWorn Gen4",
    //     "deviceType": "BC04",
    //     "deviceTypeCategory": "BodyWorn"
    //   }
    // ]);
    let headCellsArray = onSetHeadCellVisibility(headCells); 
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "unitConfifTemplateDataTable"); // will check this
  }, []);

  const UnitConfigurationTemplates: any = useSelector(
    (state: RootState) => state.templateSlice.templateInfo
  );

  const UnitConfigurationTemplateValues: any = useSelector(
    (state: RootState) => state.templateSlice.configTemplateValues
  );

  const createTemplateDropdown: DeviceType[] = useSelector(
    (state: RootState) => state.templateSlice.deviceType
  ).filter((x: any) => x.showDevice == true).map((x: any) => {
    return {
      id: x.id,
      name: x.name,
      description: x.description,
      deviceType: x.name,
      deviceTypeCategory: x.category
    }
  });

  // const [createTemplateDropdown, setCreateTemplateDropdown] = React.useState<
  //   DeviceType[]
  // >([]);
  const [rows, setRows] = React.useState<ConfigTemplate[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Name");
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<ConfigTemplate[]>(
    []
  );
  const [reformattedRows, setReformattedRows] =
    React.useState<any>();
  const [selectedActionRow, setSelectedActionRow] =
    React.useState<ConfigTemplate>();
  const [open, setOpen] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage,
    gridSort: {
      field: orderBy,
      dir: order
    }
  })
  const [isSearchable, setIsSearchable] = React.useState<boolean>(false)

  const setData = () => {
    let configTemplateRows: ConfigTemplate[] = [];
    if (UnitConfigurationTemplates.data && UnitConfigurationTemplates.data.length > 0) {
      configTemplateRows = UnitConfigurationTemplates.data.map(
        (template: any, i: number) => {
          return {
            id: template.recId,
            name: template.name,
            deviceType: template.deviceType,
            station: template.stationName,
            defaultTemplate: template.isDefaultTemplate ? "Default" : "Not a Default",
            device: template,
          };
        }
      );
    }

    setRows(configTemplateRows);

    let stations = UnitConfigurationTemplateValues.map((item:any, i:number) => {
      let element: any = {
        id: item.stationId,
        name: item.stationName ?? ""
      }
      return element
    }).filter((x: any) => x.name !== "")

    let deviceType = UnitConfigurationTemplateValues.map((item:any, i:number) => {
      let element: any = {
        id: item.deviceId,
        name: item.deviceType
      }
      return element
    })

    let indicator = UnitConfigurationTemplateValues.map((item:any, i:number) => {
      let element: any = {
        name: item.isDefaultTemplate ? "Default" : "Not a Default",
      }
      return element
    })
    setReformattedRows({...reformattedRows, rows: configTemplateRows, stations: stations, deviceType: deviceType, indicator: indicator });
  };

  React.useEffect(() => {
    setData();
  }, [UnitConfigurationTemplates.data, UnitConfigurationTemplateValues]);

  useEffect(() => {
    if(paging)
      dispatch(getConfigurationInfoAsync(pageiGrid));
    setPaging(false)
  },[pageiGrid])

  const searchText = (
    rowsParam: ConfigTemplate[],
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

  const onSelectedIndividualClear = (headCells: HeadCellProps[], colIdx: number) => {
    let headCellReset = headCells.map((headCell: HeadCellProps, index: number) => {
      if(colIdx === index)
        headCell.headerArray = [{ value: "" }];
      return headCell;
    });
    return headCellReset;
  };

  const onSelectedClear = (colIdx: number) => {
    setSearchData((prevArr) => prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString()));
    let headCellReset = onSelectedIndividualClear(headCells,colIdx);
    setHeadCells(headCellReset);
  }

  const changeMultiselect = (
    e: React.SyntheticEvent,
    val: renderCheckMultiselect[],
    colIdx: number
  ) => {
    onSelection(val, colIdx);
    headCells[colIdx].headerArray = val;
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
  // ------------------STATION DROP DOWN START
  const multiSelectStationCheckbox = (
    rowParam: ConfigTemplate[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any
  ) => {

    if(colIdx === 2 && initialRows && initialRows.stations && initialRows.stations.length > 0) { 

      let station: any = [{id: 0,  value: t("No_Station") }];
      initialRows.stations.map((x: any) => {
        station.push({id: x.id, value: x.name });
      });

      return (
        <div>
          <CBXMultiSelectForDatatable 
            width = {400} 
            option={station} 
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
            onChange={(e: any, value : any) => changeMultiselect(e, value, colIdx)}
            onSelectedClear = {() => onSelectedClear(colIdx)}
            isCheckBox={true}
            isduplicate={true}
          />
        </div>
      )
    } 
  };

  // ------------------STATION DROP DOWN END

  // ------------------TYPE DROP DOWN START
  const multiSelectTypeCheckbox = (
    rowParam: ConfigTemplate[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any
  ) => {
    if (colIdx === 3 && initialRows && initialRows.deviceType && initialRows.deviceType.length > 0) {

      let type: any = [{id: 0,  value: t("No_type") }];
      initialRows.deviceType.map((x: any) => {
        type.push({id: x.id, value: x.name });
      });

      return (
        <div>
          <CBXMultiSelectForDatatable 
            width = {400} 
            option={type} 
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
            onChange={(e: any, value : any) => changeMultiselect(e, value, colIdx)}
            onSelectedClear = {() => onSelectedClear(colIdx)}
            isCheckBox={true}
            isduplicate={true}
          />
        </div>
      );
    }
  };

  // ------------------TYPE DROP DOWN END

  //------------------INDICATOR DROP DOWN START
  const multiSelectIndicatorCheckbox = (
    rowParam: ConfigTemplate[],
    headCells: HeadCellProps[],
    colIdx: number,
    initialRows: any
  ) => {
    if (colIdx === 4 && initialRows && initialRows.indicator && initialRows.indicator.length > 0) {

      let indicator: any = [{id: 0,  value: t("Default") }];
      initialRows.indicator.map((x: any) => {
        indicator.push({id: x.id, value: x.name });
      });
      return (
        <div>
          <CBXMultiSelectForDatatable 
            width = {300} 
            option={indicator} 
            value={headCells[colIdx].headerArray !== undefined ? headCells[colIdx].headerArray?.filter((v:any) => v.value !== "") : []} 
            onChange={(e: any, value : any) => changeMultiselect(e, value, colIdx)}
            onSelectedClear = {() => onSelectedClear(colIdx)}
            isCheckBox={true}
            isduplicate={true}
          />
        </div>
      );
    }
  };

  // ------------------INDICATOR DROP DOWN END

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
    },
    {
      label: `${t("Name")}`,
      id: "name",
      align: "left",
      //dataComponent: configTemplate,
      dataComponent: getModuleIds().includes(24) ? configTemplate: textDisplay,
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "460",
      detailedDataComponentId: "device",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: t("Station"),
      id: "station",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: ConfigTemplate[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRows: ConfigTemplate[]
      ) => multiSelectStationCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "400",
      detailedDataComponentId: "id",
      attributeName: "StationName",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: t("Type"),
      id: "deviceType",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: ConfigTemplate[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRows: ConfigTemplate[]
      ) => multiSelectTypeCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "400",
      attributeName: "DeviceType",
      attributeType: "List",
      attributeOperator: "contains"
    },
    {
      label: t("Default_Template"),
      id: "defaultTemplate",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "data_table_fixedWidth_wrapText"),
      sort: true,
      searchFilter: true,
      searchComponent: (
        rowData: ConfigTemplate[],
        columns: HeadCellProps[],
        colIdx: number,
        initialRows: ConfigTemplate[]
      ) => multiSelectIndicatorCheckbox(rowData, columns, colIdx, initialRows),
      minWidth: "300",
      attributeName: "IsDefaultTemplate",
      attributeType: "bool",
      attributeOperator: "eq"
    },
  ]);

  useEffect(() => {
    //dataArrayBuilder();
    console.log("searchData", searchData)
    if(searchData.length > 0)
      setIsSearchable(true)
  }, [searchData]);

  const dataArrayBuilder = () => {
    if (reformattedRows !== undefined) {
      let dataRows: ConfigTemplate[] = reformattedRows;
      searchData.forEach((el: SearchObject) => {
        if(el.columnName === "name")
          dataRows = onTextCompare(dataRows, headCells, el);
      });
      setRows(dataRows);
    }
  };

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getConfigurationInfoAsync(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };
  useEffect(() => {
    document
      .querySelector(".footerDRP")
      ?.closest(".MuiMenu-paper")
      ?.classList.add("MuiMenu_Modal_Ui");
  });

  const getFilteredConfigurationTemplateData = () => {

      pageiGrid.gridFilter.filters = []

      searchData.filter(x => x.value[0] !== '').forEach((item:any, index:number) => {
          let x: GridFilter = {
            operator: headCells[item.colIdx].attributeOperator,
            //field: item.columnName.charAt(0).toUpperCase() + item.columnName.slice(1),
            field: headCells[item.colIdx].attributeName,
            value: item.value.length > 1 ? item.value.join('@') : item.value[0],
            fieldType: headCells[item.colIdx].attributeType,
          }
          pageiGrid.gridFilter.filters?.push(x)
      })
      pageiGrid.page = 0
      pageiGrid.size = rowsPerPage

      if(page !== 0)
        setPage(0)
      else{
        dispatch(getConfigurationInfoAsync(pageiGrid));
        //dispatch(getGroupUserCountAsync());
      }
      setIsSearchable(false)
  }

  useEffect(() => {
    setPageiGrid({...pageiGrid, page:page, size:rowsPerPage, gridSort:{field: orderBy, dir: order}});
    setPaging(true)
  },[page, rowsPerPage])

  const sortingOrder = (sort: any) => {
    setPageiGrid({...pageiGrid, gridSort:{field: sort.orderBy, dir:sort.order}})
    setPaging(true)
  }

  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      getFilteredConfigurationTemplateData()
    }
  }
  const handleBlur = () => {
    if(isSearchable)
      getFilteredConfigurationTemplateData()
  }

  return (
    <ClickAwayListener onClickAway={handleBlur}>
    <div className="CrxConfigTemplate switchLeftComponents" onKeyDown={handleKeyDown} onBlur={handleBlur}>

      {
        rows && (
          <CRXDataTable
            id="unitConfifTemplateDataTable"
            actionComponent={<ConfigTemplateActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
            />}
            toolBarButton=
            {
              getModuleIds().includes(23) ? 
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
                      {t("Create_Template")}
                    </MenuButton>
                  }
                >
                  {createTemplateDropdown.map((x, y) => {
                    return (
                      <MenuItem >
                        <Link to={{ pathname: urlList.filter((item:any) => item.name === urlNames.unitDeviceTemplateCreateBCO4)[0].url,
                                    state: { id: y,
                                             isedit: false,
                                             type: x.name,
                                             deviceId: x.id,
                                             deviceType: x.deviceType
                                           }
                                  }}>
                          <div style={{ backgroundColor: '#FFFFFF' }}>{t("Create")} {x.name}</div>
                        </Link>
                      </MenuItem>
                    )
                  })}
                </Menu >
              </div>
            :<div></div>
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
            showCheckBoxesCol={true}
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showTotalSelectedText={false}
            showActionSearchHeaderCell={true}
            showCustomizeIcon={false}
            initialRows = {reformattedRows}
            className="crxTableHeight crxTableDataUi configTemplate"
            onClearAll={clearAll}
            getSelectedItems={(v: ConfigTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowConfigTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage= {(page:any) => setPage(page)}
            setRowsPerPage= {(rowsPerPage:any) => setRowsPerPage(rowsPerPage)}
            totalRecords={UnitConfigurationTemplates.totalCount}
            setSortOrder={(sort:any) => sortingOrder(sort)}
             //Please dont miss this block.
             offsetY={65}
             headerPositionInit={207}
             topSpaceDrag = {99}
             //End here
          />
        )
      }
    </div>
    </ClickAwayListener>
  );
};

export default ConfigurationTemplates;
