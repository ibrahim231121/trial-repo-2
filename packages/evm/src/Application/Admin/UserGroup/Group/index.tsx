import React, { useEffect, useState, useRef } from "react";
import {
  CRXTabs,
  CrxTabPanel,
  CRXButton,
  CRXAlert,
  CRXToaster,
} from "@cb/shared";
import User from "./GroupTabs/User";
import "./index.scss";
import { useHistory, useParams } from "react-router";
import Application from "./GroupTabs/Application";
import DataPermission from "./GroupTabs/DataPermission";
import GroupInfo from "./GroupTabs/GroupInfo";
import useGetFetch from "../../../../utils/Api/useGetFetch";
import {
  APPLICATION_PERMISSION_URL,
  GROUP_GET_BY_ID_URL,
  CONTAINERMAPPING_INFO_GET_URL,
  SAVE_USER_GROUP_URL,
  UPSERT_CONTAINER_MAPPING_URL,
} from "../../../../utils/Api/url";
import { CRXConfirmDialog } from "@cb/shared";
import { urlList, urlNames } from "../../../../utils/urlList";
import moment from "moment";
import { useDispatch } from "react-redux";
import { addNotificationMessages } from "../../../../Redux/notificationPanelMessages";
import dateDisplayFormat from "../../../../GlobalFunctions/DateFormat";
import { NotificationMessage } from "../../../Header/CRXNotifications/notificationsTypes";
import { getUsersInfoAsync } from "../../../../Redux/UserReducer";
import { enterPathActionCreator } from "../../../../Redux/breadCrumbReducer";
import { getToken } from "../../../../Login/API/auth";

export type GroupInfoModel = {
  name: string;
  description: string;
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
const Group = () => {
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const dispatch = useDispatch();
  const [groupInfo, setGroupInfo] = React.useState<GroupInfoModel>({
    name: "",
    description: "",
  });
  const [userIds, setUserIds] = React.useState<Number[]>([]);
  const [subModulesIds, setSubModulesIds] = React.useState<Number[]>([]);
  const [showGroupScroll, setShowGroupScroll] = React.useState(false);
  const [messagesadd, setMessagesadd] = useState<string>("crxScrollGroupTop");
  const [showMessageCls, setShowMessageCls] = useState<string>("");
  const [deletedDataPermissions, setDeletedDataPermissions] = React.useState<
    number[]
  >([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const [isAppPermissionsChange, setIsAppPermissionsChange] =
    React.useState<boolean>(false);
  const [applicationPermissions, setApplicationPermissions] = React.useState<
    ApplicationPermission[]
  >([]);
  const [applicationPermissionsActual, setApplicationPermissionsActual] =
    React.useState<ApplicationPermission[]>([]);

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

  const [showMessageError, setShowMessageError] = useState<string>("");

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
    useState<boolean>(true);
  const [groupIdName, setGroupIdName] = React.useState<GroupIdName>({
    id: "",
    name: "",
  });

  const groupMsgRef = useRef<typeof CRXToaster>(null);

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: "GROUP NAME", index: 0 },
    { label: "USERS", index: 1 },
    { label: "APPLICATION PERMISSIONS", index: 2 },
    { label: "DATA PERMISSIONS", index: 3 },
  ];

  const message = [
    { messageType: "success", message: "User group saved successfully." },
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

  const { id } = useParams<{ id: string }>();
  const [ids, setIds] = useState<string>(id);

  const [getResponse, res] = useGetFetch<any>(GROUP_GET_BY_ID_URL + "/" + ids, {
    "Content-Type": "application/json", TenantId: "1",'Authorization': `Bearer ${getToken()}`
  });

  const [getContainerMappingRes, ContainerMappingRes] = useGetFetch<any>(
    CONTAINERMAPPING_INFO_GET_URL + "?groupId=" + id,
    { "Content-Type": "application/json", TenantId: "1",'Authorization': `Bearer ${getToken()}` }
  );

  const [getResponseAppPermission, resAppPermission] = useGetFetch<any>(
    APPLICATION_PERMISSION_URL,
    { "Content-Type": "application/json", TenantId: "1", 'Authorization': `Bearer ${getToken()}` }
  );

  React.useEffect(() => {
    functionInitialized();
    window.addEventListener("scroll", checkGroupScrollTop);
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
      window.removeEventListener("scroll", checkGroupScrollTop);
    };
  }, []);

  const functionInitialized = () => {
    //this work is done for edit, if id available then retrive data from url
    if (!isNaN(+id)) {
      getResponse();
      getContainerMappingRes();
    }
    getResponseAppPermission();
    dispatch(getUsersInfoAsync());
  };

  const moduleAllCheck = (response: any, subModulesIdes: Number[]) => {
    let count: number = 0;
    if (response.subModules && response.subModules.length > 0) {
      response.subModules.map((subModule: any) => {
        let value = subModulesIdes.indexOf(subModule.id) > -1 ? true : false;
        if (value === true) count = count + 1;
      });
      if (count === response.subModules.length) return true;
      else return false;
    } else return false;
  };

  const getPermissions = (AppPermissions: any, subModulesIdes: Number[]) => {
    if (AppPermissions !== undefined) {
      let appPermission = AppPermissions.map((response: any) => {
        let x: ApplicationPermission = {
          id: response.id,
          name: response.name,
          level: 1,
          selected: moduleAllCheck(response, subModulesIdes),
          children:
            response.subModules && response.subModules.length > 0
              ? response.subModules.map((subModule: any) => {
                  let y: ApplicationPermission = {
                    id: subModule.id,
                    name: subModule.name,
                    level: 2,
                    selected:
                      subModulesIdes.indexOf(subModule.id) > -1 ? true : false,
                    levelType: subModule.subModuleGroupName,
                  };
                  return y;
                })
              : null,
        };
        return x;
      });
      return appPermission;
    }
  };

  React.useEffect(() => {
    // only for 2 levels
    if (resAppPermission !== undefined) {
      if (
        applicationPermissions === undefined ||
        applicationPermissions.length === 0
      )
        setApplicationPermissions(
          getPermissions(resAppPermission, subModulesIds)
        );
      setApplicationPermissionsActual(
        getPermissions(resAppPermission, subModulesIds)
      );
    }
  }, [resAppPermission]);

  React.useEffect(() => {
    showSave();
  }, [groupInfo, userIds, dataPermissions, isAppPermissionsChange]);

  useEffect(() => {
    if (
      applicationPermissions !== undefined &&
      applicationPermissionsActual !== undefined
    ) {
      if (
        JSON.stringify(applicationPermissions) !==
        JSON.stringify(applicationPermissionsActual)
      )
        setIsAppPermissionsChange(true);
      else setIsAppPermissionsChange(false);
    }
  }, [applicationPermissions]);

  React.useEffect(() => {
    if (res !== undefined) {
      dispatch(enterPathActionCreator({ val: res.name }));

      setGroupInfo({ name: res.name, description: res.description });
      setGroupIdName({ id: res.id, name: res.name });

      if (res.members !== undefined && res.members.users !== undefined) {
        let lstUserIds: number[] = [];
        res.members.users.map((x: any) => lstUserIds.push(x.id));
        setUserIds(lstUserIds);
      }

      if (res.groupSubModules !== undefined) {
        let lstSubModuleIds: number[] = [];
        res.groupSubModules.map((x: any) =>
          lstSubModuleIds.push(x.subModuleId)
        );
        setSubModulesIds(lstSubModuleIds);
      }
    }
  }, [res]);

  React.useEffect(() => {
    if (ContainerMappingRes !== undefined) {
      let newDataPerModel: DataPermissionModel[] = [];
      ContainerMappingRes.map((x: any) => {
        newDataPerModel.push({
          containerMappingId: parseInt(x.id),
          fieldType: x.fieldType,
          mappingId: x.mappingId,
          permission: x.groupMapping.permission,
        });
      });
      setDataPermissions(newDataPerModel);
      setDataPermissionsActual(newDataPerModel);
    }
  }, [ContainerMappingRes]);

  const onChangeGroupInfo = (name: string, decription: string) => {
    setGroupInfo({ name: name, description: decription });
  };
  const onChangeUserIds = (userIds: number[]) => {
    setUserIds(userIds);
  };

  const onChangeDataPermission = (
    dataPermissionModel: DataPermissionModel[]
  ) => {
    setDataPermissions(dataPermissionModel);
  };

  const redirectPage = () => {
    let groupInfo_temp: GroupInfoModel = {
      name: res === undefined ? "" : res.name,
      description: res === undefined ? "" : res.description,
    };

    let dataPermissionString = dataPermissions.sort(
      (a: DataPermissionModel, b: DataPermissionModel) => {
        if (a.containerMappingId < b.containerMappingId) {
          return -1;
        }
        if (a.containerMappingId > b.containerMappingId) {
          return 1;
        }
        return 0;
      }
    );

    let dataPermissionActualString = dataPermissionsActual.sort(
      (a: DataPermissionModel, b: DataPermissionModel) => {
        if (a.containerMappingId < b.containerMappingId) {
          return -1;
        }
        if (a.containerMappingId > b.containerMappingId) {
          return 1;
        }
        return 0;
      }
    );

    if (JSON.stringify(groupInfo) !== JSON.stringify(groupInfo_temp)) {
      setIsOpen(true);
      setValue(tabs[0].index);
    } else if (
      JSON.stringify(userIds.length === 0 ? "" : userIds) !==
      JSON.stringify(
        res === undefined || res.members === undefined
          ? ""
          : res.members.users.map((x: any) => x.id)
      )
    ) {
      setIsOpen(true);
      setValue(tabs[1].index);
    } else if (isAppPermissionsChange) {
      setIsOpen(true);
      setValue(tabs[2].index);
    } else if (
      JSON.stringify(dataPermissionString) !==
      JSON.stringify(dataPermissionActualString)
    ) {
      setIsOpen(true);
      setValue(tabs[3].index);
    } else
      history.push(
        urlList.filter((item: any) => item.name === urlNames.adminUserGroups)[0]
          .url
      );
  };

  const showSave = () => {
    let groupInfo_temp: GroupInfoModel = {
      name: res === undefined ? "" : res.name,
      description: res === undefined ? "" : res.description,
    };
    
    if (JSON.stringify(groupInfo) !== JSON.stringify(groupInfo_temp)) {
      setIsSaveButtonDisabled(false);
    } else if (
      JSON.stringify(userIds.length === 0 ? [] : userIds) !==
      JSON.stringify(
        res === undefined || res.members === undefined
          ? []
          : res.members.users.map((x: any) => x.id)
      )
    ) {
      setIsSaveButtonDisabled(false);
    } else if (isAppPermissionsChange) {
      setIsSaveButtonDisabled(false);
    } else if (
      JSON.stringify(dataPermissions) !== JSON.stringify(dataPermissionsActual)
    ) {
      setIsSaveButtonDisabled(false);
    } else {
      setIsSaveButtonDisabled(true);
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    history.push(
      urlList.filter((item: any) => item.name === urlNames.adminUserGroups)[0].url
    );
  };

  const getAppPermissions = (
    appPermission: any,
    onChangeAppPermissions: boolean
  ) => {
    setApplicationPermissions(appPermission);
    setIsAppPermissionsChange(onChangeAppPermissions);
  };

  const onSave = (e: React.MouseEventHandler<HTMLInputElement>) => {
    let editCase = !isNaN(+id);
    let method = editCase ? "PUT" : "POST";
    var groupURL = SAVE_USER_GROUP_URL;

    if (editCase) {
      groupURL = groupURL + "/" + id;
    }

    let subModules = applicationPermissions
      .map((x) => x.children)
      .flat(1)
      .filter((x) => x?.selected === true)
      .map((x) => {
        return { subModuleId: x?.id };
      });

    // if(editCase){
    //   subModules.map(x=> {return {...x, "id":parseInt(id)}})
    // }

    let userGroup = {
      name: groupInfo.name,
      description: groupInfo.description,
      groupSubModules: subModules,
      //  groupSubModules: subModules.map(x=> { return { "subModuleId": x?.id}}),
      //groupSubModules: appPermissionSample.map(x=> { return { "subModuleId": x.id}}),

      members: {
        users: userIds.map((x) => {
          return { id: x };
        }),
      },
    };
    let groupId = 0;
    let status = 0;

    const showToastMsg = () => {
      groupMsgRef.current.showToaster({
        message: message[0].message,
        variant: "success",
        duration: 7000,
        clearButtton: true,
      });
    };
    fetch(groupURL, {
      method: method,
      headers: {
        TenantId: "1",
        "Content-Type": "application/json",
        'Authorization': `Bearer ${getToken()}`
        
      },
      body: JSON.stringify(userGroup),
    })
      .then((res) => {
        status = res.status;
        return res.text();
      })
      .then((grpResponse) => {
        if (status === 201 || status === 204) {
          //which means group has been created or updated now its time to save container permission for station and categories.
          let groupId = 0;
          if (status === 201) {
            groupId = parseInt(grpResponse.replace(/["']/g, ""));
          }
          if (status === 204) {
            groupId = parseInt(id);
          }
          let permissionsToAdd = dataPermissions.map((x) => {
            return {
              id: x.containerMappingId,
              mappingId: x.mappingId,
              groupMapping: {
                groupId: groupId,
                permission: x.permission,
              },
              fieldType: x.fieldType,
            };
          });
          let dataPermissionObj = {
             groupId : id,
            containerMappings: permissionsToAdd,
            deletedContainerMappingIds: deletedDataPermissions,
          };
          fetch(UPSERT_CONTAINER_MAPPING_URL, {
            method: "PUT",
            headers: {
              TenantId: "1",
              "Content-Type": "application/json",
              'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(dataPermissionObj),
          })
            .then((container) => {
              if (container.status === 201 || container.status === 204) {
                // pushToHistory(urlList.filter((item:any) => item.name === urlNames.adminUserGroups)[0].url);
              } else if (
                container.status === 500 ||
                container.status === 400 ||
                container.status === 409 ||
                container.status === 404
              ) {
                effectAfterSave(groupId.toString(),container.status)

                setAlertType("inline");
                setMessages(message[2].message);
                setError(message[2].messageType);
              }
            })
            .catch((err: Error) => {
              
              
            });

          effectAfterSave(groupId.toString(),status)

          setAlertType("toast");
          setMessages(message[0].message);
          setError(message[0].messageType);
        } else if (status === 500 || status === 400) {
          setShowSuccess(true);
          functionInitialized();
          setIsAppPermissionsChange(false);
          setIsSaveButtonDisabled(true);

          setMessages(message[1].message);
          setError(message[1].messageType);
        } else if (status === 409 || status === 404) {
          let error = JSON.parse(grpResponse);

          // error = ( <div className="CrxMsgErrorGroup">We're Sorry. The Group Name <span> { error.substring(error.indexOf("'"), error.lastIndexOf("'")) }'</span> already exists, please choose a different group name.</div>)

          effectAfterSave(groupId.toString(),status)

          setShowMessageCls("showMessageGroup");
          setShowMessageError("errorMessageShow");

          setMessages(error);
          setAlertType("inline");
          setError("error");
        }
      });
  };

  useEffect(() => {
    if (ids !== undefined) getResponse()
  }, [ids]);

  const effectAfterSave = (groupId: string,status: number) => {
    setShowSuccess(true);
    functionInitialized();
    if(status != 409  ){
      redirectingToId(groupId);
    }
    setIsAppPermissionsChange(false);
    setIsSaveButtonDisabled(true);
  }

  const redirectingToId = (groupId: string) => {
    let urlPathName = urlList.filter(
      (item: any) => item.name === urlNames.adminUserGroupId
    )[0].url;
    setIds(groupId);
    history.push(
      urlPathName.substring(0, urlPathName.lastIndexOf("/")) + "/" + groupId
    );
  };

  const checkGroupScrollTop = () => {
    if (!showGroupScroll && window.pageYOffset > 15) {
      setShowGroupScroll(true);
      setMessagesadd("crxScrollGroup");
    } else if (!showGroupScroll && window.pageYOffset <= 15) {
      setShowGroupScroll(false);
      setMessagesadd("crxScrollGroupTop");
    }
  };

  const scrollGroupTop = () => {
    window.scrollTo({ top: 0 });
  };

  const alertMsgDiv = showSuccess ? " " : "hideMessageGroup";

  useEffect(() => {
    if (messages !== undefined && messages !== "") {
      let notificationMessage: NotificationMessage = {
        title: "Group",
        message: messages,
        type: error,
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [messages]);

  return (
    <div className="App crxTabsPermission switchLeftComponents" style={{}}>
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
        {/* <div className={showMessageError}> */}
        <div
          className={`${showMessageError} ${
            alertType == "inline" ? "" : "errorGroupInfo"
          }`}
        >
          <GroupInfo info={groupInfo} onChangeGroupInfo={onChangeGroupInfo} />
        </div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={1}>
        <div
          className={`${
            showSuccess ? "crxGroupTab1 isErrorHide" : "crxGroupTab1"
          } ${messagesadd}`}
        >
          <User ids={userIds} onChangeUserIds={onChangeUserIds}></User>
        </div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={2}>
        <div
          onClick={scrollGroupTop}
          className={`${
            showSuccess ? "hiddenArea isErrorHide" : "hiddenArea"
          } ${messagesadd}`}
        ></div>
        <Application
          resAppPermission={resAppPermission}
          applicationPermissions={applicationPermissions}
          onSetAppPermissions={getAppPermissions}
          groupIdName={groupIdName}
          isAppPermissionsChange={isAppPermissionsChange}
        ></Application>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={3}>
        <div className="crxGroupTab3">
          <DataPermission
            dataPermissionsInfo={dataPermissions}
            onChangeDataPermission={onChangeDataPermission}
            onDeletePermission={(id: number) => {
              var deletedPermissions = deletedDataPermissions;
              deletedPermissions.push(id);
              setDeletedDataPermissions(deletedPermissions);
            }}
          ></DataPermission>
        </div>
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
                  (item: any) => item.name === urlNames.adminUserGroups
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
        text="user group form"
      >
        <div className="confirmMessage">
          You are attempting to <strong>close</strong> the{" "}
          <strong>'user group form'</strong>. If you close the form, any changes
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

export default Group;
