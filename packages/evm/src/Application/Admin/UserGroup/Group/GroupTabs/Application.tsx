import React, { useEffect } from "react";
import { CRXDataTableMultiLevel, CRXMenu } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { HeadCellProps } from "../../../../../GlobalFunctions/globalDataTableFunctions";
import useGetFetch from "../../../../../utils/Api/useGetFetch";
import { APPLICATION_PERMISSION_URL, GROUP_USER_LIST, GROUP_GET_BY_ID_URL, GROUP_GET_URL } from '../../../../../utils/Api/url'
import { idText } from "typescript";
import { ApplicationPermission, GroupIdName } from ".."
import "./application.scss"
import Condition from "yup/lib/Condition";
import { UsersAndIdentitiesServiceAgent } from "../../../../../utils/Api/ApiAgent";
import { UserGroups } from "../../../../../utils/Api/models/UsersAndIdentitiesModel";

type Props = {
  resAppPermission: any;
  applicationPermissions: ApplicationPermission[];
  onSetAppPermissions: any; 
  groupIdName: GroupIdName;
  isAppPermissionsChange: boolean;
}

type NameAndValue = {
  value: string;
  label: string;
  onClick : (e : any) => void
};

const Application: React.FC<Props> = ({resAppPermission, onSetAppPermissions, applicationPermissions, groupIdName, isAppPermissionsChange}) => {
  const { t } = useTranslation<string>();

  const finalLevel: number = 2

  const [responseGroups,setResponseGroups] = React.useState<UserGroups[]>([])
  const [responseSelectedGroup,setResponseSelectedGroups] =  React.useState<UserGroups>()
  const [userGroupsList, setUserGroupsList] = React.useState<NameAndValue[]>();
  const [selectedUserGroup, setSelectedUserGroup] = React.useState<GroupIdName>(
      isAppPermissionsChange ? {
      id: "",
      name: "",
    } : 
    groupIdName
  );


  
  //const [getResponseGroups, responseGroups] = useGetFetch<any>(GROUP_GET_URL, { 'Content-Type': 'application/json', 'TenantId': '1' });
  //const [getResponseSelectedGroup, responseSelectedGroup] = useGetFetch<any>(GROUP_GET_BY_ID_URL + "/" + selectedUserGroup?.id, { 'Content-Type': 'application/json', 'TenantId': '1' });

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    // {
    //   label: `${t("")}`,
    //   id: "1",
    //   align: "center",
    //   minWidth: "20",
    //   maxWidth: "20",
    // },
    {
      label: t("Module_Names"),
      id: "2",
      align: "right",
      minWidth: "300",
      maxWidth: "330",
    },
    // {
    //   label: `${t("")}`,
    //   id: "3",
    //   align: "center",
    //   visible: false,
    //   minWidth: "150",
    //   maxWidth: "250",
    // },
    {
      label: t("Basic_level"),
      id: "4",
      align: "center",
      minWidth: "270",
      maxWidth: "300",
    },
    {
      label: t("Advanced_level"),
      id: "5",
      align: "center",
      minWidth: "270",
      maxWidth: "300",
    },
    {
      label: t("Restricted_level"),
      id: "6",
      align: "center",
      minWidth: "270",
      maxWidth: "300",
    }
  ]);

  React.useEffect(() => {    
    UsersAndIdentitiesServiceAgent.getUsersGroups().then((response: UserGroups[]) => {
      setResponseGroups(response)
   });
  }, [])

  const selectGroup = (e : any, id:string, name:string) => {
    setSelectedUserGroup({id,name})
  }

  useEffect(() => {
    if (selectedUserGroup !== undefined) {
      UsersAndIdentitiesServiceAgent.getUserGroupsById(selectedUserGroup?.id).then((response: UserGroups) => {
        setResponseSelectedGroups(response)
     });
    }
  
  },[selectedUserGroup])
  const moduleAllCheck = (response: any, subModulesIdes: Number[]) => {
    let count: number = 0
    if(response.subModules && response.subModules.length > 0)  {
      response.subModules.map((subModule: any) => {
        let value = subModulesIdes.indexOf(subModule.id) > -1 ? true : false
        if(value === true)
          count = count + 1
      })
      if(count === response.subModules.length)
        return true
      else
        return false
    }
    else 
      return false
  }

  const getPermissions = (AppPermissions: any, subModulesIdes: Number[]) => {
    if(AppPermissions !== undefined){
      let appPermission = AppPermissions.map((response: any) => {
        
        let x: ApplicationPermission = {
          id: response.id,
          name: response.name,
          level: 1,
          selected:  moduleAllCheck(response, subModulesIdes),
          children: ((response.subModules && response.subModules.length > 0) ?
            response.subModules.map((subModule: any) => {
              let y: ApplicationPermission = {
                id: subModule.id,
                name: subModule.name,
                level: 2,
                selected: subModulesIdes.indexOf(subModule.id) > -1 ? true : false,
                levelType: subModule.subModuleGroupName
              }
              return y
            })
            : null
          )
        }
        return x
      })
      return appPermission
    }
  }

  React.useEffect(() => {
    
    if (responseSelectedGroup !== undefined && responseSelectedGroup.groupSubModules !== undefined) {
        let lstSubModuleIds: number[] = [];
        responseSelectedGroup.groupSubModules.map((x: any) => lstSubModuleIds.push(x.subModuleId));
        // let changed: boolean = false;
        // if (JSON.stringify(getPermissions(resAppPermission,lstSubModuleIds)) !== JSON.stringify(applicationPermissionsActual))
        //   changed = true
        onSetAppPermissions(getPermissions(resAppPermission,lstSubModuleIds))
    }
  }, [responseSelectedGroup]);

  React.useEffect(() => {
    if (responseGroups !== undefined) {
      var groupNames = responseGroups.map((x: any) => {
        let j: NameAndValue = {
          value: x.id,
          label: x.name,
          onClick : (e) => selectGroup(e, x.id, x.name)
        };
        return j;
      });
      groupNames = groupNames.sort(function (a: any, b: any) {
        return a.label.localeCompare(b.label);
      });
      setUserGroupsList(groupNames);
    }
  }, [responseGroups]);

  // This is for Horizontal ChecK All
  const onSetRow = (check: boolean, row_Param: any) => {
    
    //let data = setCheckAllValues(check, row)
    let data = applicationPermissions.map((item: any) => {
      let bl: boolean = false
      if(item === row_Param)
      {
        bl = true
        item.selected = check
      }
      if(item.children !== null && item.children.length > 0) {
        item.children.map((x: any) => {
          if (bl || x === row_Param) {
            x.selected = check
          }
          return x
        })
      }
      return item
    })
    onSetAppPermissions(data);
  }

  // This is for Vertical Check All
  const onSetCheckAllLevel = (checkAll: boolean, type: string) => {
    let data = applicationPermissions.map((row: any) => {
      return setCheckAllValues(checkAll, row, type)
    })
    onCheckUnCheckChildren(checkAll)
    onSetAppPermissions(data)
  }

  // Both Vertiacal ans Horizontal Check All Calls this method
  const setCheckAllValues = (checkAll: boolean, row: ApplicationPermission, type?: string) => {
    if (
      (type !== undefined && row.levelType === type) ||  // For Vertical CheckAll only
      (type !== undefined && row.levelType === undefined && checkAll === false) || // For Vertical CheckAll only
      (type === undefined)  // For Horizontal CheckAll only
    )
      row.selected = checkAll

    if (row.children && row.children.length > 0) {
      row.children.map((item: any) => {
        return setCheckAllValues(checkAll, item, type)
      });
    }
    return row
  }

  // only for 2 levels
  const onCheckUnCheckChildren = (check: boolean, row?: any) => {
    if(!check) {
      applicationPermissions.map((item: any) => {
        if(item.children !== null && item.children.length > 0) {
          item.children.map((x: any) => {
            if (x === row) {
              item.selected = false
              return true
            }
          })
        }
      })
    }
    else {
      applyParentRowChangeOnChecked()
    }
  }

  const applyParentRowChangeOnChecked = () => {
    applicationPermissions.map((item: any) => {
      let count: number = 0
      if(item.children !== null && item.children.length > 0) {
        item.children.map((x: any) => {
          if(x.selected === true)
            count = count + 1
        })
        if(count === item.children.length)
          item.selected = true
      }
      
    })
  }

  return (
    <div className="applicationPermission-content">
    <div className="application-permission-menu">
        <label>{t("Apply_application_permissions_from")}:</label>
        <CRXMenu
            id={selectedUserGroup?.id}
            name={selectedUserGroup?.name}
            className="DarkTheme"
            btnClass="customButton"
            wrapper="application-permission-dropdown"
            MenuList = {userGroupsList !== undefined ? 
              userGroupsList.filter(item => item.value !== selectedUserGroup.id) 
              : []}
        />
    
    </div>
    {applicationPermissions && (
      <CRXDataTableMultiLevel
        headCells={headCells}
        rows={applicationPermissions}
        className="application-Permission-DataTable"
        finalLevel={finalLevel}
        onSetRow={onSetRow}
        onSetCheckAllLevel={onSetCheckAllLevel}
        onCheckUnCheckChildren={onCheckUnCheckChildren}
      />
    )}
    </div>
  )
}

export default Application;
