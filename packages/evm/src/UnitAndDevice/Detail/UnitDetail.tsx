import React, { useEffect, useState, useRef , useLayoutEffect } from "react";
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

export type GroupInfoModel = {
  name: string;
  description: string;
  groupName: string;
};
export type GroupIdName = {
  id: string;
  name: string;
};
export type DataPermissionModel = {
  containerMappingId: number;
  mappingId: number;
  permission: number;
  fieldType: number;
};
export type ApplicationPermission = {
  id: number;
  name: string;
  level: number;
  selected: boolean;
  levelType?: string;
  children?: ApplicationPermission[];
};
const UnitCreate = (props:any) => {
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const dispatch = useDispatch();

  const [groupInfo, setGroupInfo] = React.useState<GroupInfoModel>({
    name: "",
    description: "",
    groupName: ""
  });
  const [userIds, setUserIds] = React.useState<Number[]>([]);
  const [subModulesIds, setSubModulesIds] = React.useState<Number[]>([]);

  const [deletedDataPermissions, setDeletedDataPermissions] = React.useState<
    number[]
  >([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const [isAppPermissionsChange, setIsAppPermissionsChange] =
    React.useState<boolean>(false);
  const [applicationPermissions, setApplicationPermissions] = React.useState<
    ApplicationPermission[]
  >([]);

  const [dataPermissions, setDataPermissions] = React.useState<
    DataPermissionModel[]
  >([]);
  const [dataPermissionsActual, setDataPermissionsActual] = React.useState<
    DataPermissionModel[]
  >([]);

  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [messages, setMessages] = useState<string>("");
  const [alertType, setAlertType] = useState<string>("inline");
  const [error, setError] = useState<string>("");

  const [showMessageCls, setShowMessageCls] = useState<string>("");
  const [showMessageError, setShowMessageError] = useState<string>("");

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
    useState<boolean>(true);
  const [groupIdName, setGroupIdName] = React.useState<GroupIdName>({
    id: "",
    name: "",
  });

  const groupMsgRef = useRef<typeof CRXToaster>(null)

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: "Configuration", index: 0 },
    // { label: "USERS", index: 1 },
    // { label: "APPLICATION PERMISSIONS", index: 2 },
    // { label: "DATA PERMISSIONS", index: 3 },
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

  console.log(Unit_GET_BY_ID_URL + "/Stations/" + stationID+"/Units/"+ unitID);
  const [getResponse, res] = useGetFetch<any>(Unit_GET_BY_ID_URL + "/Stations/" + stationID+"/Units/"+ unitID+"/GetPrimaryDeviceInfo", {
    "Content-Type": "application/json",
    TenantId: "1",
  });
 
  const [getContainerMappingRes, ContainerMappingRes] = useGetFetch<any>(
    CONTAINERMAPPING_INFO_GET_URL + "?groupId=" + id,
    { "Content-Type": "application/json", TenantId: "1" }
  );

  React.useEffect(() => {
    //this work is done for edit, if id available then retrive data from url
   
    //if (!isNaN(+id)) { // 
    
      getResponse();
     // getContainerMappingRes();
   // }
  }, []);

  React.useEffect(() => {
    showSave();
  }, [groupInfo, userIds, dataPermissions, isAppPermissionsChange]);
  React.useEffect(() => {
    if (res !== undefined) {
      debugger
      setGroupInfo({ name: res.name, description: res.description, groupName: res.triggerGroup });
      setGroupIdName({ id: res.id, name: res.name });
      dispatch(enterPathActionCreator({ val: res.name }));

      // if (res.members !== undefined && res.members.users !== undefined) {
      //   let lstUserIds: number[] = [];
      //   res.members.users.map((x: any) => lstUserIds.push(x.id));
      //   setUserIds(lstUserIds);
      // }

      // if (res.groupSubModules !== undefined) {
      //   let lstSubModuleIds: number[] = [];
      //   res.groupSubModules.map((x: any) =>
      //     lstSubModuleIds.push(x.subModuleId)
      //   );
      //   setSubModulesIds(lstSubModuleIds);
      // }
    }
  }, [res]);

  React.useEffect(() => {
    if (ContainerMappingRes !== undefined) {
      let newDataPerModel: DataPermissionModel[] = [];

      ContainerMappingRes.map((x: any) => {
        newDataPerModel.push({
          containerMappingId: x.id,
          fieldType: x.fieldType,
          mappingId: x.mappingId,
          permission: x.groupMapping.permission,
        });
      });
      setDataPermissions(newDataPerModel);
      setDataPermissionsActual(newDataPerModel);
    }
  }, [ContainerMappingRes]);

  const onChangeGroupInfo = (name: string, decription: string, groupName: string) => {
    setGroupInfo({ name: name, description: decription, groupName: groupName });
  };
  const onChangeUserIds = (userIds: number[]) => {
    setUserIds(userIds);
  };
  const onChangeDataPermission = (
    dataPermissionModel: DataPermissionModel[]
  ) => {
    setDataPermissions(dataPermissionModel);
    console.log("test", dataPermissions);
  };

  const redirectPage = () => {
    let groupInfo_temp: GroupInfoModel = {
      name: res === undefined ? "" : res.name,
      description: res === undefined ? "" : res.description,
      groupName: res === undefined ? "" : res.triggerGroup
    };

    // let dataPermissionString = dataPermissions.sort(
    //   (a: DataPermissionModel, b: DataPermissionModel) => {
    //     if (a.containerMappingId < b.containerMappingId) {
    //       return -1;
    //     }
    //     if (a.containerMappingId > b.containerMappingId) {
    //       return 1;
    //     }
    //     return 0;
    //   }
    // );

    // let dataPermissionActualString = dataPermissionsActual.sort(
    //   (a: DataPermissionModel, b: DataPermissionModel) => {
    //     if (a.containerMappingId < b.containerMappingId) {
    //       return -1;
    //     }
    //     if (a.containerMappingId > b.containerMappingId) {
    //       return 1;
    //     }
    //     return 0;
    //   }
    // );

    if (JSON.stringify(groupInfo) !== JSON.stringify(groupInfo_temp)) {
      setIsOpen(true);
      setValue(tabs[0].index);
    } 
    // else if (
    //   JSON.stringify(userIds.length === 0 ? "" : userIds) !==
    //   JSON.stringify(
    //     res === undefined || res.members === undefined
    //       ? ""
    //       : res.members.users.map((x: any) => x.id)
    //   )
    // ) {
    //   setIsOpen(true);
    //   setValue(tabs[1].index);
    // } else if (isAppPermissionsChange) {
    //   setIsOpen(true);
    //   setValue(tabs[2].index);
    // } else if (
    //   JSON.stringify(dataPermissionString) !==
    //   JSON.stringify(dataPermissionActualString)
    // ) {
    //   setIsOpen(true);
    //   setValue(tabs[3].index);
    // }
    else
      history.push(urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url)
  }

  const disableAddPermission = () => {
    dataPermissions.map((obj) => {
        if(obj.fieldType > 0 && (obj.mappingId > 0 || obj.mappingId < 0 ) && obj.permission > 0 ){
        setIsSaveButtonDisabled(false);
        }
        else{
          setIsSaveButtonDisabled(true);
        }
    })
}

useEffect(() => {
    disableAddPermission();
    
}, [dataPermissions])

  const showSave = () => {
    let groupInfo_temp: GroupInfoModel = {
      name: res === undefined ? "" : res.name,
      description: res === undefined ? "" : res.description,
      groupName: res === undefined ? "" : res.triggerGroup
    };
    if (JSON.stringify(groupInfo) !== JSON.stringify(groupInfo_temp)) 
    {
      setIsSaveButtonDisabled(false);
    }
   else {
      setIsSaveButtonDisabled(true);
    }
  };

  const closeDialog = () => {

    setIsOpen(false)
    history.push(urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url)
  }

  const getAppPermissions = (
    appPermission: any,
    onChangeAppPermissions: boolean
  ) => {
    setApplicationPermissions(appPermission);
    setIsAppPermissionsChange(onChangeAppPermissions);
  };

  const onSave = (e: React.MouseEventHandler<HTMLInputElement>) => {
    
    //let editCase = !isNaN(+id);
    let method =  "PUT"; //: "POST";
    var unitURL = EDIT_UNIT_URL+"/Stations/"+stationID+"/Units/"+unitID+"/ChangeUnitInfo";

    // if (editCase) {
    //   groupURL = groupURL + "/" + id;
    // }

    // let subModules = applicationPermissions
    //   .map((x) => x.children)
    //   .flat(1)
    //   .filter((x) => x?.selected === true)
    //   .map((x) => {
    //     return { subModuleId: x?.id };
    //   });

    // if(editCase){
    //   subModules.map(x=> {return {...x, "id":parseInt(id)}})
    // }

    let userGroup = {
       name: groupInfo.name,
       description: groupInfo.description,
       triggerGroup: groupInfo.groupName
      // groupSubModules: subModules,
      // //  groupSubModules: subModules.map(x=> { return { "subModuleId": x?.id}}),
      // //groupSubModules: appPermissionSample.map(x=> { return { "subModuleId": x.id}}),

      // members: {
      //   users: userIds.map((x) => {
      //     return { id: x };
      //   }),
      // },
    };
    let groupId = 0;
    let status = 0;

    const showToastMsg = () => {
      groupMsgRef.current.showToaster({
          message: message[0].message, variant: "success", duration: 7000, clearButtton:true
      });
  }
    fetch(unitURL, {
      method: method,
      headers: {
        TenantId: "1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userGroup),
    })
      .then((res) => {
        if(res.status == 204)
        {
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
     //   debugger;
       // if (status === 201 || status === 204) {
         // setShowSuccess(true);
          //which means group has been created or updated now its time to save container permission for station and categories.
          // let groupId = 0;
          // if (status === 201) {
          //   groupId = parseInt(grpResponse.replace(/["']/g, ""));
          // }
          // if (status === 204) {
          //   groupId = parseInt(id);
          // }
          // console.log("Group Id");
          // let permissionsToAdd = dataPermissions.map((x) => {
          //   return {
          //     id: x.containerMappingId,
          //     mappingId: x.mappingId,
          //     groupMapping: {
          //       groupId: groupId,
          //       permission: x.permission,
          //     },
          //     fieldType: x.fieldType,
          //   };
          // });
          // let dataPermissionObj = {
          //   containerMappings: permissionsToAdd,
          //   deletedContainerMappingIds: deletedDataPermissions,
          // };
          // fetch(UPSERT_CONTAINER_MAPPING_URL, {
          //   method: "PUT",
          //   headers: {
          //     TenantId: "1",
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(dataPermissionObj),
          // })
          //   .then((container) => {
          //     if (container.status === 201 || container.status === 204) {
          //       // history.push(urlList.filter((item:any) => item.name === urlNames.adminUserGroups)[0].url);
          //     } else if (
          //       container.status === 500 ||
          //       container.status === 400 ||
          //       container.status === 409 ||
          //       container.status === 404
          //     ) {
          //       setShowSuccess(true);
                
          //       setTimeout(() => {
          //         setShowSuccess(false);
                 
          //       }, 70000);
          //       setAlertType("inline");
          //       setMessages(message[2].message);
          //       setError(message[2].messageType);
          //     }
          //   })
          //   .catch((err: Error) => {
          //     console.log("An error occured in permission");
          //     console.log(err.message);
          //   });

          // setShowSuccess(true);
          // setAlertType("toast");
          // setMessages(message[0].message);
          // setError(message[0].messageType);
        }
        // } else if (status === 500 || status === 400) {
        //   setShowSuccess(true);
        //   setShowMessageCls("showMessageGroup");
        //   setTimeout(() => {
        //     setShowSuccess(false);
            
        //   }, 70000);
        //   setMessages(message[1].message);
        //   setError(message[1].messageType);
        // } else if (status === 409 || status === 404) {
        //   let error = JSON.parse(grpResponse);

        //   // error = ( <div className="CrxMsgErrorGroup">We're Sorry. The Group Name <span> { error.substring(error.indexOf("'"), error.lastIndexOf("'")) }'</span> already exists, please choose a different group name.</div>)

        //   setShowSuccess(true);
        //   setShowMessageCls("showMessageGroup");
        //   setShowMessageError("errorMessageShow")
        //   setTimeout(() => {
        //     setShowSuccess(false);
        //     setShowMessageError("")
        //   }, 70000);
        //   setMessages(error);
        //   setError("error");
        // }
     // }
      );
  };
  const alertMsgDiv = showSuccess ? " " : "hideMessageGroup"
  

  const [resChecker, setresChecker] = useState(true);

  const  useWindowSize = () => {
      const [size, setSize] = useState(0);
      useLayoutEffect(() => {
        const updateSize = () =>  {
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
      {res != undefined? 
          <div className='unitDeviceDetail'>
            <div className='uddDashboard'>
                <div className={ resChecker === false ? 'MainBoard MainBoardFlow ' : 'MainBoard' } onChange={(e) => console.log(e)}>
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
                        <div className= { size < 1540  && resChecker === true ? 'pannelBoard pannelBoardHide' : 'pannelBoard'  }  >
                            <h2>0</h2>
                            <span className='noRow'></span>
                            <p>ASSETS</p>
                        </div>
                        <div className= { size < 1540  && resChecker === true  ? 'pannelBoard pannelBoardHide' : 'pannelBoard'  } >
                            <h2>{res.assignedTo}</h2>
                            <span className='pdDotted'><i className="fas fa-ellipsis-h"></i></span>
                            <p>ASSIGNED TO</p>
                        </div>
                    </div>
                    <div onClick={() => { setresChecker(false)} } className={size < 1540  && resChecker === true ? 'arrowResponsiveShow' : 'arrowResponsiveHide'}><i className="far fa-angle-right"></i></div>
                </div>
            </div>
            
        
        </div>
    :null}
      {console.log(showSuccess)} 
    
        <CRXAlert
          className={"CrxAlertNotificationGroup " +  " " + alertMsgDiv }
          message={messages}
          type={error}
          open={showSuccess}
          alertType={alertType}
          setShowSucess={setShowSuccess}
        />
        <CRXToaster ref={groupMsgRef}/>

        <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />
        <CrxTabPanel value={value}   index={0}>
        <div className={showMessageError}>
          <UnitConfigurationInfo info={groupInfo} onChangeGroupInfo={onChangeGroupInfo} />
          </div>
        </CrxTabPanel>
       

        {/* <CrxTabPanel value={value} index={1}>
          <User ids={userIds} onChangeUserIds={onChangeUserIds}></User>
        </CrxTabPanel> */}
{/* 
        <CrxTabPanel value={value} index={2}>
          <div className={showSuccess ? "hiddenArea isErrorHide" : "hiddenArea"}></div>
          <Application
            subModulesIds={subModulesIds}
            applicationPermissions={applicationPermissions}
            onSetAppPermissions={getAppPermissions}
            groupIdName={groupIdName}
          ></Application>
        </CrxTabPanel>

        <CrxTabPanel value={value} index={3}>
          <DataPermission
            dataPermissionsInfo={dataPermissions}
            onChangeDataPermission={onChangeDataPermission}
            onDeletePermission={(id: number) => {
              var deletedPermissions = deletedDataPermissions;
              deletedPermissions.push(id);
              console.log("Deleted Permission");
              setDeletedDataPermissions(deletedPermissions);
            }}
          ></DataPermission>
        </CrxTabPanel>
    */}
      <div className="tab-bottom-buttons">
        <div className="save-cancel-button-box">
          <CRXButton  variant="contained" className="groupInfoTabButtons"  onClick={onSave} disabled={isSaveButtonDisabled}>Save</CRXButton>
                    <CRXButton className="groupInfoTabButtons secondary" color="secondary" variant="outlined" onClick={() => history.push(urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url)}>Cancel</CRXButton>
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
