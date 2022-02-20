import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { CRXTabs, CrxTabPanel, CRXButton, CRXAlert, CRXToaster } from "@cb/shared";
import { useHistory, useParams } from "react-router";
import UnitConfigurationInfo from "./UnitConfigurationInfo";
import useGetFetch from "../../utils/Api/useGetFetch";
import {
  Unit_GET_BY_ID_URL,
  CONTAINERMAPPING_INFO_GET_URL,
  EDIT_UNIT_URL,
  UPSERT_CONTAINER_MAPPING_URL,
} from "../../utils/Api/url";
import { CRXConfirmDialog } from "@cb/shared";
import { urlList, urlNames } from "../../utils/urlList"
import "./UnitDetail.scss";
import { enterPathActionCreator } from "../../Redux/breadCrumbReducer";
import { useDispatch } from "react-redux";

export type UnitInfoModel = {
  name: string;
  description: string;
  groupName: string;
};
const UnitCreate = (props: any) => {
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const dispatch = useDispatch();

  const [unitInfo, setUnitInfo] = React.useState<UnitInfoModel>({
    name: "",
    description: "",
    groupName: ""
  });
  
  const [isOpen, setIsOpen] = React.useState(false);

  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [messages, setMessages] = useState<string>("");
  const [alertType, setAlertType] = useState<string>("inline");
  const [error, setError] = useState<string>("");

  const [showMessageCls, setShowMessageCls] = useState<string>("");
  const [showMessageError, setShowMessageError] = useState<string>("");

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
    useState<boolean>(true);

  const groupMsgRef = useRef<typeof CRXToaster>(null)

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: "Configuration", index: 0 }
  ];

  const message = [
    { messageType: "success", message: "Unit edited successfully." },
    {
      messageType: "error",
      message:
        "We're sorry. The group information, users, and application permissions were unable to be saved. Please retry or contact your System Administrator.",
    },
    {
      messageType: "error",
      message:
        "We're sorry. The data permissions were unable to be saved. Please retry or contact your System Administrator.",
    },
  ];

  const { id } = useParams<{ id: string }>();// change rs
  let index_num = id.lastIndexOf("_")


  const historyState = props.location.state;
  let stationID = historyState.stationId;
  let unitID = historyState.unitId;

  console.log(Unit_GET_BY_ID_URL + "/Stations/" + stationID + "/Units/" + unitID);
  const [getResponse, res] = useGetFetch<any>(Unit_GET_BY_ID_URL + "/Stations/" + stationID + "/Units/" + unitID + "/GetPrimaryDeviceInfo", {
    "Content-Type": "application/json",
    TenantId: "1",
  });

  React.useEffect(() => {
    //this work is done for edit, if id available then retrive data from url

    //if (!isNaN(+id)) { // 

    getResponse();

  }, []);

  React.useEffect(() => {
    showSave();
  }, [unitInfo]);
  React.useEffect(() => {
    if (res !== undefined) {
      setUnitInfo({ name: res.name, description: res.description, groupName: res.triggerGroup });
      dispatch(enterPathActionCreator({ val: res.name }));
   
    }
  }, [res]);

  const onChangeGroupInfo = (name: string, decription: string, groupName: string) => {
    setUnitInfo({ name: name, description: decription, groupName: groupName });
  };

  const redirectPage = () => {
    let unitInfo_temp: UnitInfoModel = {
      name: res === undefined ? "" : res.name,
      description: res === undefined ? "" : res.description,
      groupName: res === undefined ? "" : res.triggerGroup
    };

    if (JSON.stringify(unitInfo) !== JSON.stringify(unitInfo_temp)) {
      setIsOpen(true);
      setValue(tabs[0].index);
    }
    else
      history.push(urlList.filter((item: any) => item.name === urlNames.unitsAndDevices)[0].url)
  }

  const showSave = () => {
    let unitInfo_temp: UnitInfoModel = {
      name: res === undefined ? "" : res.name,
      description: res === undefined ? "" : res.description,
      groupName: res === undefined ? "" : res.triggerGroup
    };
    if (JSON.stringify(unitInfo) !== JSON.stringify(unitInfo_temp)) {
      setIsSaveButtonDisabled(false);
    }
    else {
      setIsSaveButtonDisabled(true);
    }
  };

  const closeDialog = () => {

    setIsOpen(false)
    history.push(urlList.filter((item: any) => item.name === urlNames.unitsAndDevices)[0].url)
  }

  const onSave = (e: React.MouseEventHandler<HTMLInputElement>) => {

    //let editCase = !isNaN(+id);
    let method = "PUT"; //: "POST";
    var unitURL = EDIT_UNIT_URL + "/Stations/" + stationID + "/Units/" + unitID + "/ChangeUnitInfo";

    let unitData = {
      name: unitInfo.name,
      description: unitInfo.description,
      triggerGroup: unitInfo.groupName
    };
     let status = 0;

    const showToastMsg = () => {
      groupMsgRef.current.showToaster({
        message: message[0].message, variant: "success", duration: 7000, clearButtton: true
      });
    }
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
          setShowSuccess(true);
          setAlertType("toast");
          setMessages(message[0].message);
          setError(message[0].messageType);
          setIsSaveButtonDisabled(true);
          getResponse();
        }
        status = res.status;
        return res.text();
      })
      .then((grpResponse) => {
      }     
      );
  };
  const alertMsgDiv = showSuccess ? " " : "hideMessageGroup"


  const [resChecker, setresChecker] = useState(true);

  const useWindowSize = () => {
    const [size, setSize] = useState(0);
    useLayoutEffect(() => {
      const updateSize = () => {
        setSize(window.innerWidth);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  const size = useWindowSize();
  return (

    <div className="App crxTabsPermission" style={{}}>
      {res != undefined ?
        <div className='unitDeviceDetail'>
          <div className='uddDashboard'>
            <div className={resChecker === false ? 'MainBoard MainBoardFlow ' : 'MainBoard'} onChange={(e) => console.log(e)}>
              <div className='LeftBoard'>
                <div className='pannelBoard'>
                  <h2>{res.deviceType}</h2>
                  <span className='pdDeviceIcon'><i className="fas fa-car"></i></span>
                  <p>PRIMARY UNIT DEVICE</p>
                </div>
                <div className='pannelBoard'>
                  <h2>{res.status}</h2>
                  <span className='pdStatus'><i className="fas fa-circle"></i></span>
                  <p>STATUS</p>
                </div>
                <div className='pannelBoard'>
                  <h2>{res.serialNumber}</h2>
                  <span className='noRow'></span>
                  <p>SERIAL NUMBER</p>
                </div>
                <div className='pannelBoard'>
                  <h2>{res.version}</h2>
                  <span className='noRow'></span>
                  <p>CURRENT VERSION</p>
                </div>
                <div className='pannelBoard'>
                  <h2>{res.station}</h2>
                  <span className='noRow'></span>
                  <p>STATION</p>
                </div>
              </div>
              <div className='RightBoard'>
                <div className='pannelBoard'>
                  <h2>0</h2>
                  <span className='pdUpload'><i className="fad fa-sync-alt"></i></span>
                  <p>UPLOADING</p>
                </div>
                <div className={size < 1540 && resChecker === true ? 'pannelBoard pannelBoardHide' : 'pannelBoard'}  >
                  <h2>0</h2>
                  <span className='noRow'></span>
                  <p>ASSETS</p>
                </div>
                <div className={size < 1540 && resChecker === true ? 'pannelBoard pannelBoardHide' : 'pannelBoard'} >
                  <h2>{res.assignedTo}</h2>
                  <span className='pdDotted'><i className="fas fa-ellipsis-h"></i></span>
                  <p>ASSIGNED TO</p>
                </div>
              </div>
              <div onClick={() => { setresChecker(false) }} className={size < 1540 && resChecker === true ? 'arrowResponsiveShow' : 'arrowResponsiveHide'}><i className="far fa-angle-right"></i></div>
            </div>
          </div>


        </div>
        : null}
      {console.log(showSuccess)}

      <CRXAlert
        className={"CrxAlertNotificationGroup " + " " + alertMsgDiv}
        message={messages}
        type={error}
        open={showSuccess}
        alertType={alertType}
        setShowSucess={setShowSuccess}
      />
      <CRXToaster ref={groupMsgRef} />

      <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />
      <CrxTabPanel value={value} index={0}>
        <div className={showMessageError}>
          <UnitConfigurationInfo info={unitInfo} onChangeGroupInfo={onChangeGroupInfo} />
        </div>
      </CrxTabPanel>

      <div className="tab-bottom-buttons">
        <div className="save-cancel-button-box">
          <CRXButton variant="contained" className="groupInfoTabButtons" onClick={onSave} disabled={isSaveButtonDisabled}>Save</CRXButton>
          <CRXButton className="groupInfoTabButtons secondary" color="secondary" variant="outlined" onClick={() => history.push(urlList.filter((item: any) => item.name === urlNames.unitsAndDevices)[0].url)}>Cancel</CRXButton>
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
          <strong>'unit configuration form'</strong>. If you close the form, any changes
          you've made will not be saved. You will not be able to undo this
          action.
          <div className="confirmMessageBottom">
            Are you sure you would like to <strong>close</strong> the form?
          </div>
        </div>
      </CRXConfirmDialog>
    </div>
  );
};

export default UnitCreate;
