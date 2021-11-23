import React, { useEffect } from "react";
import { CRXDataTableMultiLevel } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { HeadCellProps } from "../../../../utils/globalDataTableFunctions";
import useGetFetch from "../../../../utils/Api/useGetFetch";
import { APPLICATION_PERMISSION_URL } from '../../../../utils/Api/url'
import { idText } from "typescript";
import { ApplicationPermission } from "../Group"


type Props = {
  subModulesIds: Number[];
  applicationPermissions: ApplicationPermission[];
  onSetAppPermissions: any; 
}

const Application: React.FC<Props> = ({subModulesIds, onSetAppPermissions, applicationPermissions}) => {
  const { t } = useTranslation<string>();

  const finalLevel: number = 2

  const [applicationPermissionsActual, setApplicationPermissionsActual] = React.useState<ApplicationPermission[]>([]);

  const [getResponseAppPermission, resAppPermission] = useGetFetch<any>(APPLICATION_PERMISSION_URL, { 'Content-Type': 'application/json', 'TenantId': '1' });

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
      minWidth: "150",
      maxWidth: "250",
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
      minWidth: "200",
      maxWidth: "200",
    },
    {
      label: `${t("Advanced level")}`,
      id: "5",
      align: "center",
      minWidth: "200",
      maxWidth: "200",
    },
    {
      label: `${t("Restricted level")}`,
      id: "6",
      align: "center",
      minWidth: "200",
      maxWidth: "200",
    }
  ]);

  React.useEffect(() => {
      getResponseAppPermission();
  }, [])

  const getPermissions = (AppPermissions: any) => {
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
              selected: subModulesIds.indexOf(subModule.id) > -1 ? true : false,
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

  React.useEffect(() => {
    // only for 2 levels
    if (resAppPermission !== undefined) {
      //setApplicationPermissions(getPermissions(resAppPermission));
      if(applicationPermissions.length === 0)
        onSetAppPermissions(getPermissions(resAppPermission),onChangeAppPermissions())
      setApplicationPermissionsActual(getPermissions(resAppPermission));
    }
  }, [resAppPermission]);

  const onChangeAppPermissions = () => {
    if (JSON.stringify(applicationPermissions) !== JSON.stringify(applicationPermissionsActual))
     return true
    else
     return false
  }

  const onSetRow = (check: boolean, row: any) => {
    setCheckAllValues(check, row)
    onSetAppPermissions(applicationPermissions,onChangeAppPermissions())
  }

  const onSetCheckAllLevel = (checkAll: boolean, type: string) => {
    applicationPermissions.map((row: any) => {
      return setCheckAllValues(checkAll, row, type)
    })
    onSetAppPermissions(applicationPermissions,onChangeAppPermissions())
  }

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
  const onUnCheckAllParent = (check: boolean, row: any) => {
    applicationPermissions.map((item: any) => {
      item.children.map((x: any) => {
        if (x === row) {
          item.selected = false
          return true
        }
      })

    })
  }

  return (

    applicationPermissions && (
      <CRXDataTableMultiLevel
        headCells={headCells}
        rows={applicationPermissions}
        className="ManageAssetDataTable"
        finalLevel={finalLevel}
        onSetRow={onSetRow}
        onSetCheckAllLevel={onSetCheckAllLevel}
        onUnCheckAllParent={onUnCheckAllParent}
      />
    )
  )
}

export default Application;
