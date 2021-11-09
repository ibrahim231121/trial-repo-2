import React, { useEffect } from "react";
import { CRXDataTableMultiLevel } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { HeadCellProps } from "../../../../utils/globalDataTableFunctions";
import useGetFetch from "../../../../utils/Api/useGetFetch";
import { APPLICATION_PERMISSION_URL } from '../../../../utils/Api/url'

type ApplicationPermission = {
  id: number;
  name: string;
  level: number;
  selected: boolean;
  levelType?: string;
  children?: ApplicationPermission[];
}

const Application: React.FC = () => {
  const { t } = useTranslation<string>();

  const [rows, setRows] = React.useState<ApplicationPermission[]>([]);
  const [getResponse, res] = useGetFetch<any>(APPLICATION_PERMISSION_URL,{ 'Content-Type': 'application/json', 'TenantId': '1' });
  const finalLevel: number = 2 

  React.useEffect(() => {
    getResponse();
  }, []);

  React.useEffect(() => {
    // only for 2 levels
    if(res !== undefined) {
    let appPermission = res.map((response: any) => {
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
                        selected: false,
                        levelType: subModule.subModuleGroupName
                      }
                      return y
                    })
                    : null
                  )
        }
        return x
      })
      setRows(appPermission);
    }
  }, [res]);


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

  const onSetRow = (check:boolean, row:any) => {
    setCheckAllValues(check, row)
  }

  const onSetCheckAllLevel = (checkAll: boolean, type:string) => {
    rows.map((row: any) => {
      return setCheckAllValues(checkAll, row, type)
    })
  }

  const setCheckAllValues = (checkAll: boolean, row:ApplicationPermission, type?:string) => {
    
    if( 
        (type !== undefined  && row.levelType === type) ||  // For Vertical CheckAll only
        (type !== undefined && row.levelType === undefined && checkAll === false) || // For Vertical CheckAll only
        (type === undefined)  // For Horizontal CheckAll only
      ) 
      row.selected = checkAll       
    
    if(row.children && row.children.length > 0) {
      row.children.map((item:any) => {  
        return setCheckAllValues(checkAll, item, type)
      });
    }
    return row
  }
  
  // only for 2 levels
  const onUnCheckAllParent = (check:boolean, row:any) => {
    rows.map((item: any) => {
      item.children.map((x: any) => {
        if(x === row) {
          item.selected = false
          return true
        }
      })
      
    })
  }

  return (

      rows && (
        <CRXDataTableMultiLevel
          headCells={headCells}
          rows={rows}
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
