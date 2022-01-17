import React, { useEffect } from "react";
import { CRXDataTableMultiLevel, CRXMenu } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { HeadCellProps } from "../../../../../GlobalFunctions/globalDataTableFunctions";
import useGetFetch from "../../../../../utils/Api/useGetFetch";
import { APPLICATION_PERMISSION_URL, GROUP_USER_LIST, GROUP_GET_BY_ID_URL, GROUP_GET_URL } from '../../../../../utils/Api/url'
import { idText } from "typescript";
import { ApplicationPermission, GroupIdName } from ".."
import "./application.scss"

type Props = {
  subModulesIds: Number[];
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

const Application: React.FC<Props> = ({subModulesIds, onSetAppPermissions, applicationPermissions, groupIdName, isAppPermissionsChange}) => {
  const { t } = useTranslation<string>();

  const finalLevel: number = 2

  const [applicationPermissionsActual, setApplicationPermissionsActual] = React.useState<ApplicationPermission[]>([]);
  const [userGroupsList, setUserGroupsList] = React.useState<NameAndValue[]>();
  const [selectedUserGroup, setSelectedUserGroup] = React.useState<GroupIdName>(
      isAppPermissionsChange ? {
      id: "",
      name: "",
    } : 
    groupIdName
  );

  const [getResponseAppPermission, resAppPermission] = useGetFetch<any>(APPLICATION_PERMISSION_URL, { 'Content-Type': 'application/json', 'TenantId': '1' });
  const [getResponseGroups, responseGroups] = useGetFetch<any>(GROUP_GET_URL, { 'Content-Type': 'application/json', 'TenantId': '1' });
  const [getResponseSelectedGroup, responseSelectedGroup] = useGetFetch<any>(GROUP_GET_BY_ID_URL + "/" + selectedUserGroup?.id, { 'Content-Type': 'application/json', 'TenantId': '1' });

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    // {
    //   label: `${t("")}`,
    //   id: "1",
    //   align: "center",
    //   minWidth: "20",
    //   maxWidth: "20",
    // },
    {
      label: `${t("Module Names")}`,
      id: "2",
      align: "right",
      minWidth: "300",
      maxWidth: "100%",
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
      label: `${t("Basic level")}`,
      id: "4",
      align: "center",
      minWidth: "270",
      maxWidth: "100%",
    },
    {
      label: `${t("Advanced level")}`,
      id: "5",
      align: "center",
      minWidth: "270",
      maxWidth: "100%",
    },
    {
      label: `${t("Restricted level")}`,
      id: "6",
      align: "center",
      minWidth: "270",
      maxWidth: "100%",
    }
  ]);

  React.useEffect(() => {
      getResponseAppPermission();
      getResponseGroups();

  }, [])

  const getPermissions = (AppPermissions: any, subModulesIdes: Number[]) => {
    if(AppPermissions !== undefined){
      let appPermission = AppPermissions.map((response: any) => {
        let x: ApplicationPermission = {
          id: response.id,
          name: response.name,
          level: 1,
          selected: false,
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

  const selectGroup = (e : any, id:string, name:string) => {
    setSelectedUserGroup({id,name})
  }

  useEffect(() => {
    if (selectedUserGroup !== undefined) {
      getResponseSelectedGroup();
    }
  },[selectedUserGroup])

  React.useEffect(() => {
    // only for 2 levels
    if (resAppPermission !== undefined) {
      if(applicationPermissions === undefined || applicationPermissions.length === 0)
        onSetAppPermissions(getPermissions(resAppPermission,subModulesIds),onChangeAppPermissions())
      setApplicationPermissionsActual(getPermissions(resAppPermission,subModulesIds));
    }
  }, [resAppPermission]);

  React.useEffect(() => {
    
    if (responseSelectedGroup !== undefined && responseSelectedGroup.groupSubModules !== undefined) {
        let lstSubModuleIds: number[] = [];
        responseSelectedGroup.groupSubModules.map((x: any) => lstSubModuleIds.push(x.subModuleId));
        let changed: boolean = false;
        if (JSON.stringify(getPermissions(resAppPermission,lstSubModuleIds)) !== JSON.stringify(applicationPermissionsActual))
          changed = true
        onSetAppPermissions(getPermissions(resAppPermission,lstSubModuleIds),changed)
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

  const onChangeAppPermissions = () => {
    if (JSON.stringify(applicationPermissions) !== JSON.stringify(applicationPermissionsActual))
     return true
    else
     return false
  }

  // This is for Horizontal ChecK All
  const onSetRow = (check: boolean, row: any) => {
    setCheckAllValues(check, row)
    onSetAppPermissions(applicationPermissions,onChangeAppPermissions())
  }

  // This is for Vertical Check All
  const onSetCheckAllLevel = (checkAll: boolean, type: string) => {
    applicationPermissions.map((row: any) => {
      return setCheckAllValues(checkAll, row, type)
    })
    onCheckUnCheckChildren(checkAll)
    onSetAppPermissions(applicationPermissions,onChangeAppPermissions())
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
        item.children.map((x: any) => {
          if (x === row) {
            item.selected = false
            return true
          }
        })
      })
    }
    else {
      applicationPermissions.map((item: any) => {
        let count: number = 0
        let isSelectSameRow: boolean = false
        item.children.map((x: any) => {
          // if (x === row) 
          //   isSelectSameRow = true
          if(x.selected === true)
            count = count + 1
        })
        if(count === item.children.length)
          item.selected = true
      })
    }
  }

  return (
    <div className="applicationPermission-content">
    <div className="application-permission-menu">
        <label>Apply application permissions from:</label>
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
