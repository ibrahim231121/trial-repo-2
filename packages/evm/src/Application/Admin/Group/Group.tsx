import React, { useEffect, useState } from "react";
import { CRXTabs, CrxTabPanel, CRXButton, CRXAlert } from "@cb/shared";
import User from '../Group/components/User';
import "../Group/group.scss";
import { useHistory, useParams } from "react-router";
import Application from "../Group/components/Application"
import DataPermission from "./components/DataPermission";
import GroupInfo from "./GroupInfo";
import useGetFetch from "../../../utils/Api/useGetFetch";
import { GROUP_GET_BY_ID_URL, CONTAINERMAPPING_INFO_GET_URL, SAVE_USER_GROUP_URL, UPSERT_CONTAINER_MAPPING_URL } from "../../../utils/Api/url";
import { CRXConfirmDialog } from "@cb/shared";
import { urlList } from "../../../utils/urlList"
import { APPLICATION_PERMISSION_URL } from '../../../utils/Api/url'
import { group } from "console";

export type GroupInfoModel = {
  name: string;
  description: string;
}
export type DataPermissionModel = {
  containerMappingId:number,
  mappingId: number,
  permission: number,
  fieldType: number,
}
export type ApplicationPermission = {
  id: number;
  name: string;
  level: number;
  selected: boolean;
  levelType?: string;
  children?: ApplicationPermission[];
}
const Group = () => {
  const [value, setValue] = React.useState(0);
  const history = useHistory();

  const [groupInfo, setGroupInfo] = React.useState<GroupInfoModel>({ name: "", description: "" });
  const [userIds, setUserIds] = React.useState<Number[]>([]);
  const [subModulesIds, setSubModulesIds] = React.useState<Number[]>([]);
  
  const [deletedDataPermissions, setDeletedDataPermissions] = React.useState<number[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const [isAppPermissionsChange, setIsAppPermissionsChange] = React.useState<boolean>(false);
  const [applicationPermissions, setApplicationPermissions] = React.useState<ApplicationPermission[]>([]);

  const [dataPermissions, setDataPermissions] = React.useState<DataPermissionModel[]>([]);
  const [dataPermissionsActual, setDataPermissionsActual] = React.useState<DataPermissionModel[]>([]);

  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(true);

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: "GROUP NAME", index: 0 },
    { label: "USERS", index: 1 },
    { label: "APPLICATION PERMISSIONS", index: 2 },
    { label: "DATA PERMISSIONS", index: 3 },
  ];

  const { id } = useParams<{ id: string }>();
  const [getResponse, res] = useGetFetch<any>(GROUP_GET_BY_ID_URL + "/" + id, { 'Content-Type': 'application/json', 'TenantId': '1' });

  const [getContainerMappingRes, ContainerMappingRes] = useGetFetch<any>(CONTAINERMAPPING_INFO_GET_URL + "?groupId=" + id, { 'Content-Type': 'application/json', 'TenantId': '1' });


  React.useEffect(() => {
    //this work is done for edit, if id available then retrive data from url
    if (!isNaN(+id)) {
      getResponse();
      getContainerMappingRes();
    }
  }, [])

  React.useEffect(()=>{    
      showSave();
  },[groupInfo,userIds,dataPermissions,isAppPermissionsChange])
  React.useEffect(() => {
    if (res !== undefined) {
      setGroupInfo({ name: res.name, description: res.description });

      if (res.members !== undefined && res.members.users !== undefined) {
        let lstUserIds: number[] = [];
        res.members.users.map((x: any) => lstUserIds.push(x.id));
        setUserIds(lstUserIds);
      }

      if (res.groupSubModules !== undefined) {
        let lstSubModuleIds: number[] = [];
        res.groupSubModules.map((x: any) => lstSubModuleIds.push(x.subModuleId));
        setSubModulesIds(lstSubModuleIds);
      }
    }
  }, [res])

  React.useEffect(() => { 
    if (ContainerMappingRes !== undefined) {
      let newDataPerModel: DataPermissionModel[] = [];

      ContainerMappingRes.map((x: any) => {
        newDataPerModel.push({ containerMappingId:x.id, fieldType: x.fieldType, mappingId: x.mappingId, permission: x.groupMapping.permission });
      });
      console.log("ne data per model");
      console.log(newDataPerModel);
      setDataPermissions(newDataPerModel);
      setDataPermissionsActual(newDataPerModel);
    }
  }, [ContainerMappingRes])


  const onChangeGroupInfo = (name: string, decription: string) => {
    setGroupInfo({ name: name, description: decription });
  }
  const onChangeUserIds = (userIds: number[]) => {
    setUserIds(userIds);
  }
  const onChangeDataPermission = (dataPermissionModel: DataPermissionModel[]) => {
    setDataPermissions(dataPermissionModel);
  }
  const redirectPage = () => {

    let groupInfo_temp: GroupInfoModel = {
      name: (res === undefined ? "" : res.name),
      description: (res === undefined ? "" : res.description)
    }

    let dataPermissionString = dataPermissions.sort((a: DataPermissionModel, b: DataPermissionModel) => {
      if ( a.containerMappingId < b.containerMappingId ){
        return -1;
      }
      if ( a.containerMappingId > b.containerMappingId ){
        return 1;
      }
      return 0;
    });

    
    let dataPermissionActualString = dataPermissionsActual.sort((a: DataPermissionModel, b: DataPermissionModel) => {
      if ( a.containerMappingId < b.containerMappingId ){
        return -1;
      }
      if ( a.containerMappingId > b.containerMappingId ){
        return 1;
      }
      return 0;
    });

    console.log("dataPermissions String",JSON.stringify(dataPermissionString))
    console.log("dataPermissionsActual String",JSON.stringify(dataPermissionActualString))

    if (JSON.stringify(groupInfo) !== JSON.stringify(groupInfo_temp)) {
      setIsOpen(true)
      setValue(tabs[0].index);
    }
    else if (JSON.stringify(userIds.length === 0 ? "" : userIds) !== JSON.stringify(((res === undefined || res.members === undefined) ? "" : res.members.users.map((x: any) => x.id)))) {
      setIsOpen(true)
      setValue(tabs[1].index);
    }
    else if (isAppPermissionsChange) {
      setIsOpen(true)
      setValue(tabs[2].index);
    }
    else if (JSON.stringify(dataPermissionString) !== JSON.stringify(dataPermissionActualString)) {
      setIsOpen(true)
      setValue(tabs[3].index);
    }
    else
      history.push(Object.entries(urlList)[1][0].toString())
  }

  const showSave = () => {
    let groupInfo_temp: GroupInfoModel = {
      name: (res === undefined ? "" : res.name),
      description: (res === undefined ? "" : res.description)
    }
    if (JSON.stringify(groupInfo) !== JSON.stringify(groupInfo_temp)) {
      setIsSaveButtonDisabled(false);
    }
    else if (JSON.stringify(userIds.length === 0 ? "" : userIds) !== JSON.stringify(((res === undefined || res.members === undefined) ? "" : res.members.users.map((x: any) => x.id)))) {
      setIsSaveButtonDisabled(false);
    }
    else if (isAppPermissionsChange) {
      setIsSaveButtonDisabled(false);
    }
    else if (JSON.stringify(dataPermissions) !== JSON.stringify(dataPermissionsActual)) {
      setIsSaveButtonDisabled(false);
    }
    else{
      setIsSaveButtonDisabled(true);
    }
  }

  const closeDialog = () => {
    setIsOpen(false)
    history.push(Object.entries(urlList)[1][0].toString())
  }

  const getAppPermissions = (appPermission: any, onChangeAppPermissions: boolean) => {
    setApplicationPermissions(appPermission)
    setIsAppPermissionsChange(onChangeAppPermissions)
  }

  const onSave = (e: React.MouseEventHandler<HTMLInputElement>) => {

    let editCase =  !isNaN(+id);
    let method = editCase ? 'PUT' : 'POST';
    var groupURL = SAVE_USER_GROUP_URL;

    if(editCase){
     groupURL =  groupURL + '/'+id;

    }

    let subModules =  applicationPermissions
    .map(x=> x.children)
    .flat(1)
    .filter(x=> x?.selected=== true)
    .map(x=>{return { "subModuleId":x?.id}})

    // if(editCase){
    //   subModules.map(x=> {return {...x, "id":parseInt(id)}})
    // }

    console.log("Sub Modules");
    console.log(subModules);

    let userGroup  = {
      name:groupInfo.name,
      description:groupInfo.description,
      groupSubModules: subModules,
      //  groupSubModules: subModules.map(x=> { return { "subModuleId": x?.id}}),
      //groupSubModules: appPermissionSample.map(x=> { return { "subModuleId": x.id}}),
      
      members:{
        users:userIds.map(x=> {return {"id": x} } )
      }
    }
      let groupId = 0; 
      let status  = 0;
    fetch(groupURL, {
      method: method,
      headers: {
        'TenantId': '1',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userGroup)
    })
    .then(res=>{
      console.log("Response");
      console.log(res);
      status =   res.status;
      console.log("status = " , status);
      return res.text();
    })
    .then(grpResponse => {
      if(status === 201 || status === 204){ //which means group has been created or updated now its time to save container permission for station and categories.
          console.log("Group Response");
          console.log(grpResponse.replace(/["']/g, ""));
          let groupId = 0;
          if(status === 201){
            groupId = parseInt(grpResponse.replace(/["']/g, ""));
          }
          if(status === 204){
            groupId = parseInt(id);
          }
          console.log("Group Id");
          console.log(groupId);
          let permissionsToAdd = dataPermissions.map(x=> {
            return{
              "id":x.containerMappingId,
              "mappingId":x.mappingId,
              "groupMapping":{
                "groupId":groupId,
                "permission":x.permission
              },
              "fieldType":x.fieldType
            }
          })
          let dataPermissionObj = {
            "containerMappings":permissionsToAdd,
            "deletedContainerMappingIds" : deletedDataPermissions
          }

          console.log("dataPermissionObj")
          console.log(dataPermissionObj);
          fetch(UPSERT_CONTAINER_MAPPING_URL, {
            method: 'PUT',
            headers: {
              'TenantId': '1',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataPermissionObj)
          })
          .then(container=>{

            console.log("Container Response");
            console.log(container);
            history.push(Object.entries(urlList)[1][0].toString());
            setShowSuccess(true);


          })
          .catch((err:Error) => {
            console.log("An error occured");
            console.log(err);
            console.log(err.message);
          })
      }
    })

  }

  return (
    <div className= "App crxTabsPermission" style={{  }}>
      <>
      <CRXAlert
                          className="crx-alert-notification"
                          message={"User group saved successfully"}
                          type="success"
                          open={showSuccess}
                          setShowSucess={setShowSuccess}

                        />
        <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />

        <CrxTabPanel value={value} index={0}  >
          <GroupInfo info={groupInfo} onChangeGroupInfo={onChangeGroupInfo} />
        </CrxTabPanel>

        <CrxTabPanel value={value} index={1}  >
          <User ids={userIds} onChangeUserIds={onChangeUserIds}></User>
        </CrxTabPanel>

        <CrxTabPanel value={value} index={2}>
          <Application subModulesIds={subModulesIds}
            applicationPermissions={applicationPermissions}
            onSetAppPermissions={getAppPermissions}
          ></Application>
        </CrxTabPanel>

        <CrxTabPanel value={value} index={3}>
          <DataPermission 
            dataPermissionsInfo={dataPermissions} 
            onChangeDataPermission={onChangeDataPermission}
            onDeletePermission={(id:number)=>{
              var deletedPermissions = deletedDataPermissions;
              deletedPermissions.push(id);
              console.log("Deleted Permission");
              console.log(deletedDataPermissions);
                setDeletedDataPermissions(deletedPermissions);
            }}
            
          ></DataPermission>
        </CrxTabPanel>
      </>
      <div className="tab-bottom-buttons">
        <div className="save-cancel-button-box">
          <CRXButton  variant="contained" className="groupInfoTabButtons"  onClick={onSave} disabled={isSaveButtonDisabled}>Save</CRXButton>
                    <CRXButton className="groupInfoTabButtons secondary" color="secondary" variant="outlined" onClick={() => history.push(Object.entries(urlList)[1][0].toString())}>Cancel</CRXButton>
        </div>
     <CRXButton onClick={()=> redirectPage()} 
          className="groupInfoTabButtons-Close secondary" color="secondary" variant="outlined">Close</CRXButton>
      </div>
      <CRXConfirmDialog
        setIsOpen={() => setIsOpen(false)}
        onConfirm={closeDialog}
        isOpen={isOpen}
        primary="Yes"
        secondary="No"
        text="user group form"
      />
    </div>
  );
};

export default Group;
