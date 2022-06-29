import React, { useState, useRef, useLayoutEffect } from "react";
import {
  CRXTabs,
  CrxTabPanel,
  CRXButton,
  CRXAlert,
  CRXToaster,
} from "@cb/shared";
import { useHistory } from "react-router";
import UnitConfigurationInfo from "./UnitConfigurationInfo";
import useGetFetch from "../../utils/Api/useGetFetch";
import BC03 from "../../Assets/Images/BC03.png";
import DVRVRX20 from "../../Assets/Images/DVR-VR-X20.png";
import BC04 from "../../Assets/Images/BC04.png";
import MASTERDOCK from "../../Assets/Images/Master-Dock.png";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import {
  Unit_GET_BY_ID_URL,
  EDIT_UNIT_URL,
  BASE_URL_UNIT_SERVICE,
} from "../../utils/Api/url";
import { CRXConfirmDialog } from "@cb/shared";
import { urlList, urlNames } from "../../utils/urlList";
import "./UnitDetail.scss";
import { enterPathActionCreator } from "../../Redux/breadCrumbReducer";
import { useDispatch } from "react-redux";
import { CRXDataTable } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../GlobalComponents/Display/TextDisplay";
import {
  HeadCellProps,
  onResizeRow,
  Order,
  onSetSingleHeadCellVisibility,
  onClearAll,
} from "../../GlobalFunctions/globalDataTableFunctions";
import UnitAndDevicesActionMenu from "../UnitAndDevicesActionMenu";
import Cookies from 'universal-cookie';
import QueuedAsstsDataTable from "./AssetQueuedDataTable";
const cookies = new Cookies();

export type UnitInfoModel = {
  name: string;
  description: string;
  groupName: string;
  configTemp: any;
  configTemplateList: any;
  stationList: any;
  stationId: any;
};

type UnitAndDevice = {
  deviceNames:string;
  deviceTypes:string;
  deviceSerialNumbers:string;
  deviceVersions:string
 
};

type stateProps = {
  template: any;
  unitId: any;
  stationId: historyProps;
};

type locationProps = {
  state: stateProps;
};

type historyProps = {
  location: locationProps;
  stationId: string;
};

const UnitCreate = (props: historyProps) => {
  const { location } = props;

  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const dispatch = useDispatch();

  const [unitInfo, setUnitInfo] = React.useState<UnitInfoModel>({
    name: "",
    description: "",
    groupName: "",
    configTemp: "",
    configTemplateList: [],
    stationList: [],
    stationId: ""
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const { t } = useTranslation<string>();
  const [showSuccess,] = useState<boolean>(false);
  const [showMessageError] = useState<string>("");
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(true);
  const [buttonLogic, setButton] = useState<boolean>();
  const [rows, setRows] = React.useState<UnitAndDevice[]>([]);
  const [order] = React.useState<Order>("asc");
  const [orderBy] = React.useState<string>("name");
  const [open, setOpen] = React.useState<boolean>(false);
  const validationCheckOnButton = (checkError: boolean) => {setButton(checkError);};
  const [selectedActionRow, setSelectedActionRow] =React.useState<UnitAndDevice>();
  const [selectedItems, setSelectedItems] = React.useState<UnitAndDevice[]>([]);
  const [reformattedRows, setReformattedRows] = React.useState<UnitAndDevice[]>();
  const targetRef = React.useRef<typeof CRXToaster>(null);
  const alertRef = useRef(null);
  const [alertType] = useState<string>('inline');
  const [errorType] = useState<string>('error');
  const [responseError] = React.useState<string>('');
  const [alert] = React.useState<boolean>(false);


  const [stationName, SetStationName] = React.useState<string>('');

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }



  const stationID = location.state.stationId;
  const unitID = location.state.unitId;
  const inCarTab: any = location.state.template;

  const tabs = [
    { label: "Configuration", index: 0 },
    { label: "Queued Assets", index: 1 },
    { label: "Events", index: 2 },
    { label: "Device Diagnostic", index: 3 },
    { label: "Update History", index: 4 }
  ];

  const tabs1 = [
    { label: "Configurations", index: 0 },
    { label: "Devices", index: 1 },
    { label: "Queued Assets", index: 2 }
  ];

  const [getResponse, res] = useGetFetch<any>(
    Unit_GET_BY_ID_URL +
      "/Stations/" +
      stationID +
      "/Units/" +
      unitID +
      "/GetPrimaryDeviceInfo",
    {
      "Content-Type": "application/json",'Authorization': `Bearer ${cookies.get('access_token')}`,
      TenantId: "1",
    }
  );
  const [getconfigTemplateList, configTemplateList] = useGetFetch<any>(
    BASE_URL_UNIT_SERVICE +
      "/Stations/" +
      stationID +
      "/Units/" +
      unitID +
      "/GetConfigurationTemplate",
    {
      "Content-Type": "application/json",'Authorization': `Bearer ${cookies.get('access_token')}`,
      TenantId: "1",
    }
  );

  const [getstationList, stationList] = useGetFetch<any>(
    BASE_URL_UNIT_SERVICE +
      "/Stations/GetAllStationInfo",
    {
      "Content-Type": "application/json",'Authorization': `Bearer ${cookies.get('access_token')}`,
      TenantId: "1",
    }
  );




  const [getAllDevices, allDevicesList] = useGetFetch<any>(
    BASE_URL_UNIT_SERVICE +
      "/Stations/" +
      stationID +
      "/Units/" +
      unitID +
      "?Page=1&Size=100",
    {
      "Content-Type": "application/json",'Authorization': `Bearer ${cookies.get('access_token')}`,
      TenantId: "1",
    }
  );

  React.useEffect(() => {
    getResponse();
    getconfigTemplateList();
    getstationList();
    getAllDevices();
  }, []);

  React.useEffect(() => {
    let unitAndDevicesRows: UnitAndDevice[] = [];
    let deviceNames:UnitAndDevice[]=[]
  
    if (allDevicesList != undefined) {
      deviceNames = allDevicesList.name
      unitAndDevicesRows = allDevicesList.devices.map((data: any) => {
        return { id: data.id,deviceNames:deviceNames, deviceTypes:data.publicKey.format,deviceSerialNumbers:data.identifier,
          deviceVersions:data.version.current.major+"."+data.version.current.minor+"."+data.version.current.build+"."+data.version.current.revision
         };
      });

      setRows(unitAndDevicesRows);
    }
  }, [allDevicesList]);

  React.useEffect(() => {
    showSave();
  }, [unitInfo]);

  React.useEffect(() => {
    if (buttonLogic == true) setIsSaveButtonDisabled(true);

    if (buttonLogic == false) setIsSaveButtonDisabled(false);
  }, [buttonLogic]);

  React.useEffect(() => {
    if (buttonLogic == true) setIsSaveButtonDisabled(true);
  });

  React.useEffect(() => {
    if (res !== undefined && configTemplateList !== undefined &&  stationList !== undefined) {
      SetStationName(res.station)
      let template: any = [{ displayText: "None", value: "0" }];
      configTemplateList.map((x: any) => {
        template.push({ displayText: x.name, value: x.id });
      });


        let stationlst: any = [{ displayText: "None", value: "0" }];
        stationList.map((x: any) => {
          stationlst.push({ displayText: x.name, value: x.id });
        });

      setUnitInfo({
        name: res.name,
        description: res.description,
        groupName: res.triggerGroup,
        configTemp: res.configTemplateId,
        configTemplateList: template,
        stationList: stationlst,
        stationId: stationID
      });
      dispatch(
        enterPathActionCreator({
          val:
            "Unit Detail: " +
            res.name.charAt(0).toUpperCase() +
            res.name.slice(1),
        })
      );
    }
  }, [res, configTemplateList]);

  const onChangeGroupInfo = (
    name: string,
    decription: string,
    groupName: string,
    configTemp: any,
    configTemplateList: any,
    stationList: any,
    stationId: any
  ) => {
    setUnitInfo({
      name: name,
      description: decription,
      groupName: groupName,
      configTemp: configTemp,
      configTemplateList: configTemplateList,
      stationList: stationList,
      stationId: stationId
    });
  };

  const redirectPage = () => {
    var unitInfo_temp: UnitInfoModel = {
      name: res === undefined ? "" : res.name,
      description: res === undefined ? "" : res.description,
      groupName: res === undefined ? "" : res.triggerGroup,
      configTemp: res === undefined ? "" : res.configTemplateId, // none
      configTemplateList: configTemplateList,
      stationList: stationList,
      stationId: res === undefined ? "" : stationID
    };

    if (JSON.stringify(unitInfo) !== JSON.stringify(unitInfo_temp)) {
      setIsOpen(true);
    } else
      history.push(
        urlList.filter((item: any) => item.name === urlNames.unitsAndDevices)[0]
          .url
      );
  };

  const showSave = () => {
    let unitInfo_temp: UnitInfoModel = {
      name: res === undefined ? "" : res.name,
      description: res === undefined ? "" : res.description,
      groupName: res === undefined ? "" : res.triggerGroup,
      configTemp: res === undefined ? "" : res.configTemplateId,
      configTemplateList: res === undefined ? [] : unitInfo.configTemplateList,
      stationList: res === undefined ? [] : unitInfo.stationList,
      stationId: res === undefined ? "": stationID
    };

    if (JSON.stringify(unitInfo) !== JSON.stringify(unitInfo_temp)) {
      setIsSaveButtonDisabled(false);
    } else {
      setIsSaveButtonDisabled(true);
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    history.push(
      urlList.filter((item: any) => item.name === urlNames.unitsAndDevices)[0]
        .url
    );
  };

  const onSave = (e: React.MouseEventHandler<HTMLInputElement>) => {
    //let editCase = !isNaN(+id);
    let method = "PUT"; //: "POST";
    var unitURL =
      EDIT_UNIT_URL +
      "/Stations/" +
      stationID +
      "/Units/" +
      unitID +
      "/ChangeUnitInfo";

    let unitData = { 
      name: unitInfo.name,
      description: unitInfo.description,
      triggerGroup: unitInfo.groupName,
      unitConfigurationTemplate: unitInfo.configTemp,
      stationId: unitInfo.stationId
    };
    let status = 0;

   
    fetch(unitURL, {
      method: method,
      headers: {
        TenantId: "1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(unitData),
    })
      .then((res) => {
        if (res.status == 204) {
          targetRef.current.showToaster({message: "Unit Edited Sucessfully ", variant: "Success", duration: 5000, clearButtton: true});
          setIsSaveButtonDisabled(true);
          SetStationName(unitInfo.stationList.find((y:any)=> y.value === unitInfo.stationId).displayText)
       
        }
        status = res.status;
        return res.text();
      })
      
  };
  const alertMsgDiv = showSuccess ? " " : "hideMessageGroup";

  const [resChecker, setresChecker] = useState(true);

  const useWindowSize = () => {
    const [size, setSize] = useState(0);
    useLayoutEffect(() => {
      const updateSize = () => {
        setSize(window.innerWidth);
      };
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  };

  const size = useWindowSize();

  const toggleChecker = () => {
    setresChecker(false);
    console.log("false here");
    if (resChecker === false) {
      setresChecker(true);
      console.log("true here");
    }
  };


  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
  
    {
      label: `${t("Device Name")}`,
      id: "deviceNames",
      align: "right",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
    },
    {
      label: `${t("Device Type")}`,
      id: "deviceTypes",
      align: "right",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
    },
    {
      label: `${t("Serial Number")}`,
      id: "deviceSerialNumbers",
      align: "right",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false
    },
    {
      label: `${t("Version")}`,
      id: "deviceVersions",
      align: "right",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false
    }
  ]);
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
  const resizeRowUnitDetail = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };
  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);
  };
  return (
    <div className="UnitDetailMain UnitDetailMainDetail switchLeftComponents">
      <CRXToaster ref={targetRef} />
      <div className="unitDetailAction">
        <div className="menuUnitDetail">
          <Menu
            align="start"
            viewScroll="initial"
            direction="bottom"
            position="auto"
            className="menuCss"
            arrow
            menuButton={
              <MenuButton>
                <i className="fas fa-ellipsis-h"></i>
              </MenuButton>
            }
          >
            <MenuItem>
              <div className="crx-meu-content">
                <div className="crx-menu-icon">
                  <i className="far fa-user-tag fa-md"></i>
                </div>
                <div className="crx-menu-list">test</div>
              </div>
            </MenuItem>
            <MenuItem>
              <div className="crx-meu-content groupingMenu">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">test</div>
              </div>
            </MenuItem>
            <MenuItem>
              <div className="crx-meu-content ">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">test</div>
              </div>
            </MenuItem>
          </Menu>
        </div>
        <div className="unitExit">
          <p onClick={history.goBack}>Exit</p>
        </div>
      </div>

      <div className="App crxTabsPermission CrxUnitDetailId">
        {res != undefined ? (
          <div className="unitDeviceDetail">
            <div className="uddDashboard">
              <div
                className={
                  resChecker === false
                    ? "MainBoard MainBoardFlow "
                    : "MainBoard"
                }
                onChange={(e) => console.log(e)}
              >
                <div
                  onClick={() => {
                    toggleChecker();
                  }}
                  className={
                    size < 1540 && resChecker === false
                      ? "arrowResponsiveLeftShow"
                      : "arrowResponsiveLeftHide"
                  }
                >
                  <i className="far fa-angle-left"></i>
                </div>
                <div className="LeftBoard">
                  <div
                    className={
                      size < 1540 && resChecker === false
                        ? "pannelBoard pannelBoardHide"
                        : "pannelBoard"
                    }
                  >
                    <h2>{res.deviceType.toUpperCase()}</h2>
                    <img
                      className="deviceImage"
                      src={
                        res.deviceType === "BC03"
                          ? BC03
                          : res.deviceType === "BC04"
                          ? BC04
                          : res.deviceType === "MasterDock"
                          ? MASTERDOCK
                          : DVRVRX20
                      }
                      alt={res.deviceType}
                    />
                    <p>PRIMARY UNIT DEVICE</p>
                  </div>
                  <div
                    className={
                      size < 1350 && resChecker === false
                        ? "pannelBoard pannelBoardHide pannelBoard_2"
                        : "pannelBoard pannelBoard_2"
                    }
                  >
                    <h2>{res.status.toUpperCase()}</h2>
                    <span className={`pdStatus ${res.status}`}>
                      <i className="fas fa-circle"></i>
                    </span>
                    <p>STATUS</p>
                  </div>
                  <div className="pannelBoard">
                    <h2>{res.serialNumber.toUpperCase()}</h2>
                    <span className="noRow"></span>
                    <p>SERIAL NUMBER</p>
                  </div>
                  <div className="pannelBoard">
                    <h2>{res.version}</h2>
                    <span className="noRow"></span>
                    <p>CURRENT VERSION</p>
                  </div>
                  <div className="pannelBoard">
                    <h2>{stationName.toUpperCase()}</h2>
                    <span className="noRow"></span>
                    <p>STATION</p>
                  </div>
                  
                </div>

                <div className="RightBoard">
                  <div className="pannelBoard">
                    <h2>0</h2>
                    <span className="pdUpload">
                      <i className="fad fa-sync-alt"></i>
                    </span>
                    <p>UPLOADING</p>
                  </div>
                  <div
                    className={
                      size < 1350 && resChecker === true
                        ? "pannelBoard pannelBoardHide"
                        : "pannelBoard"
                    }
                  >
                    <h2>0</h2>
                    <span className="noRow"></span>
                    <p>ASSETS</p>
                  </div>
                  <div
                    className={
                      size < 1540 && resChecker === true
                        ? "pannelBoard pannelBoardHide"
                        : "pannelBoard"
                    }
                  >
                    <h2>{res.assignedTo}</h2>
                    <span className="pdDotted">
                      <i className="fas fa-ellipsis-h"></i>
                    </span>
                    <p>ASSIGNED TO</p>
                  </div>
                </div>
                
                <div
                  onClick={() => {
                    toggleChecker();
                  }}
                  className={
                    size < 1540 && resChecker === true
                      ? "arrowResponsiveShow"
                      : "arrowResponsiveHide"
                  }
                >
                  <i className="far fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
        ) : null}
    

        
        {/* <CRXAlert
        ref={alertRef}
        message={responseError}
        className='crxAlertUserEditForm'
        alertType={alertType}
        type={errorType}
        open={alert}
        setShowSucess={() => null}
      /> */}

        <CRXTabs
          value={value}
          onChange={handleChange}
          tabitems={inCarTab === "Incar" ? tabs1 : tabs}
        />
        <CrxTabPanel value={value} index={0}>
          <div className={showMessageError}>
            <UnitConfigurationInfo
              info={unitInfo}
              onChangeGroupInfo={onChangeGroupInfo}
              validationCheckOnButton={validationCheckOnButton}
            />
          </div>
        </CrxTabPanel>

        {inCarTab === "Incar" ? (
          <CrxTabPanel value={value} index={1}>
            <div className="unitDeviceMain searchComponents unitDeviceMainUii">
              {rows && (
                <CRXDataTable
                  id="Unit Details"
                  getRowOnActionClick={(val: UnitAndDevice) =>
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
                  getSelectedItems={(v: UnitAndDevice[]) => setSelectedItems(v)}
                  onResizeRow={resizeRowUnitDetail}
                  onHeadCellChange={onSetHeadCells}
                  setSelectedItems={setSelectedItems}
                  selectedItems={selectedItems}
                  offsetY={190}
                />
              )}
            </div>
            {/* {`station ID == ${stationID}`} <br />
            {`unit ID == ${unitID}`} <br />
            {`template name == ${inCarTab}`} */}
          </CrxTabPanel>
        ) : null}

      {inCarTab === "Incar" ? (
        <CrxTabPanel value={value} index={2}>    
          <QueuedAsstsDataTable/>       
        </CrxTabPanel>
          ) : null}

        <CrxTabPanel value={value} index={1}>    
          <QueuedAsstsDataTable/>       
        </CrxTabPanel>


        <div className="tab-bottom-buttons">
          <div className="save-cancel-button-box">
            <CRXButton
              variant="contained"
              className="groupInfoTabButtons"
              onClick={onSave}
              disabled={isSaveButtonDisabled}
            >
              Save
            </CRXButton>
            <CRXButton
              className="groupInfoTabButtons secondary"
              color="secondary"
              variant="outlined"
              onClick={() =>
                history.push(
                  urlList.filter(
                    (item: any) => item.name === urlNames.unitsAndDevices
                  )[0].url
                )
              }
            >
              Cancel
            </CRXButton>
          </div>
          <CRXButton
            onClick={() => redirectPage()}
            className="groupInfoTabButtons-Close secondary"
            color="secondary"
            variant="outlined"
          >
            Close
          </CRXButton>
        </div>
        <CRXConfirmDialog
          setIsOpen={() => setIsOpen(false)}
          onConfirm={closeDialog}
          isOpen={isOpen}
          className="userGroupNameConfirm"
          primary="Yes, close"
          secondary="No, do not close"
          text="unit configuration form"
        >
          <div className="confirmMessage">
            You are attempting to <strong>close</strong> the{" "}
            <strong>'unit configuration form'</strong>. If you close the form,
            any changes you've made will not be saved. You will not be able to
            undo this action.
            <div className="confirmMessageBottom">
              Are you sure you would like to <strong>close</strong> the form?
            </div>
          </div>
        </CRXConfirmDialog>
      </div>
    </div>
  );
};

export default UnitCreate;
