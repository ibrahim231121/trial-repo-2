import { CRXNestedMenu, CRXTooltip } from "@cb/shared";
import { RemoveSharp } from "@material-ui/icons";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import { MODULES } from '../../../utils/Api/url'
import Restricted from "../../../ApplicationPermission/Restricted";
import useGetFetch from "../../../utils/Api/useGetFetch";
import { urlList, urlNames } from "./../../../utils/urlList"
import "./index.scss";

import { useTranslation } from 'react-i18next';

const CRXLefNavigation = () => {
  const { t } = useTranslation<string>();
  const history = useHistory();
  const navigateToPage = (path: string) => {
    history.push(path);
    
    let pathBody = document.querySelector("body");

    if(path !== urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url) {
        pathBody?.classList.remove("pathAssetDetail");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
    const { getModuleIds, moduleIds } = useContext(ApplicationPermissionContext);
    const items = [
    {
      moduleId: 0,
      label: t("Home"),
      icon: "fas fa-chart-pie NaveIcon",
    },
    {
      moduleId: 1,
      label: t("Assets"),
      icon: "icon icon-file-video NaveIcon",
      command: () => {
        navigateToPage(urlList.filter((item: any) => item.name === urlNames.assets)[0].url);
      },

      disabled: false,

    },
    {
      moduleId: 0,
      label: t("Cases"),
      icon: "fas fa-briefcase NaveIcon",
      command: () => {
        navigateToPage(urlList.filter((item: any) => item.name === urlNames.cases)[0].url);
      },
      // items: [
      //   {
      //     moduleIds:0,
      //     label: "New",
      //   },
      //   {
      //     moduleIds:0,
      //     label: "Delete",
      //   },
      //   {
      //     moduleIds:0,
      //     label: "Search",

      //     items: [
      //       {
      //         moduleIds:0,
      //         label: "Filter",

      //         items: [
      //           {
      //             moduleIds:0,
      //             label: "Print",
      //           },
      //         ],
      //       },
      //       {
      //         moduleIds:0,
      //         label: "List",
      //       },
      //     ],
      //   },
      // ],
    },
    {
      moduleId: 13,
      label: t('Units_&_Devices'),
      icon: 'fas fa-laptop-code NaveIcon',

      command: () => {
        navigateToPage(urlList.filter((item: any) => item.name === urlNames.unitsAndDevices)[0].url);
      },
    },
    {
      moduleId: 57,
      label: "Live Video",
      icon: "fas fa-video NaveIcon",
      classes: "liveVideoTab",
      url: urlList.filter((item: any) => item.name === urlNames.liveVideo)[0].url,
      target: "_blank"
    },
    {
      moduleId: 57,
      label: "AVL Map",
      icon: "icon icon-compass5 NaveIcon",
      classes: "mapsTab",
      url: urlList.filter((item: any) => item.name === urlNames.avlMap)[0].url,
      target: "_blank"
    },
    // {
    //   moduleId: 0,
    //   label: t("ALPR"),
    //   icon: "fas fa-address-card NaveIcon",
    //   classes: "aplrTab",
    //   items: [
    //     {
    //       moduleIds: 0,
    //       label: t("Plate_Captures"),
    //     },
    //     {
    //       moduleIds: 0,
    //       label: t("Live_ALPR"),
    //     },
    //     {
    //       moduleIds: 0,
    //       label: t("Live_ALPR"),
    //     },
    //     {
    //       moduleIds: 0,
    //       label: t("Manage_Hot_List"),
    //     },
    //     {
    //       moduleIds: 0,
    //       separator: true,
    //     },
    //     {
    //       moduleIds: 0,
    //       label: t("Manage_Hot_List_Data_Source"),
    //     },
    //     {
    //       moduleIds: 0,
    //       label: t("Manage_License_Plates"),
    //     },
    //   ],
    // },

    // {
    //   moduleId:0,
    //   label: "Reports",
    //   icon: "icon icon-file-text NaveIcon",
    //   classes: "reportingTab",
    //   items: [
    //     {
    //       moduleIds:0,
    //       label: "Analytics Map",
    //     },
    //     {
    //       moduleIds:0,
    //       label: "AVL Map",
    //     },
    //   ],
    // },

    {
      moduleId: 0,
      label: t("Admin"),
      icon: "fas fa-sitemap NaveIcon",
      items: [
        {
          moduleIds: 5,
          label: t("Manage_User_Groups_Permissions"),
          command: () => {
            navigateToPage(urlList.filter((item: any) => item.name === urlNames.adminUserGroups)[0].url);
          },
        },
        {
          moduleIds: 8,
          label: t("Manage_Users"),
          command: () => {
            navigateToPage(urlList.filter((item: any) => item.name === urlNames.adminUsers)[0].url);
          },

        },
        {
          moduleIds: 22,
          label: t('Manage_Device_Unit_Templates'),
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.adminUnitConfigurationTemplate)[0].url) },
        },
        {
          moduleIds: 49,
          label: t('Sensors_And_Triggers'),
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.sensorsAndTriggers)[0].url) },
        },
        {
          moduleIds: 31,
          label: 'Tenant Settings',
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.tenantSettings)[0].url) },
        },
        {
          moduleIds: 69,
          label: 'AD Groups Mapping',
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.ADGroupsMapping)[0].url) },
        },
        {
          moduleIds: 17,
          label: t('Manage_Station'),
          command: () => {
            navigateToPage(urlList.filter((item: any) => item.name === urlNames.adminStation)[0].url);
          },
        },
        {
          moduleIds: 0,
          label: 'Manage Default Unit Templates',
          command: () => {
            navigateToPage(urlList.filter((item: any) => item.name === urlNames.defaultUnitTemplate)[0].url);
          },
        },
        {
          moduleIds: 61,
          label: t('Retention_Policies'),
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.retentionPolicies)[0].url) },
        },
        {
          moduleIds: 61,
          label: t('Upload_Policies'),
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.uploadPolicies)[0].url) },
        },
        {
          moduleIds: 53,
          label: t('Categories'),
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.categories)[0].url) },
        },
        {
          moduleIds: 55,
          label: t('Category_Forms_And_Fields'),
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.categoryForms)[0].url) },
        },
        {
          moduleIds: 0,
          label: t('FOTA_Version_Management'),
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.updateVersion)[0].url) },
        }
      ],
    },
    {
      moduleId: 0,
      label: t("ALPR"),
      icon: "fas fa-car-on NaveIcon",
      items: [
      {
        moduleIds: 0,
        label: t("Advanced_Search"),
        command: () => {
          navigateToPage(urlList.filter((item: any) => item.name === urlNames.AlprAdvanceSearch)[0].url);
        },
      },  
      {
        moduleIds: 0,
        label: t("Captures"),
        command: () => {
          navigateToPage(urlList.filter((item: any) => item.name === urlNames.AlprCapturePanel)[0].url);
        },
      },{
        moduleIds: 0,
        label: t("HotList"),
        command: () => {
          navigateToPage(urlList.filter((item: any) => item.name === urlNames.HotList)[0].url);
        },
      },
        {moduleIds: 0,
        label: t("HotList_Data_Source"),
        command: () => {;
          navigateToPage(urlList.filter((item: any) => item.name === urlNames.dataSourceList)[0].url);
        },
      },
        {moduleIds: 0,
        label: t("License_Plates"),
        command: () => {
          navigateToPage(urlList.filter((item: any) => item.name === urlNames.LicensePlateList)[0].url);
        },
      },
      
        
    ],
    },
  ];

  var AssetPermission = items.filter((x: any) => getModuleIds().includes(x.moduleId) || x.moduleId === 0);
  // x.moduleId === 0 is a temporary logic should be remove once all permission assigned.4

  var SubModulePermission = AssetPermission.map((item: any) => {
    return {
      ...item, items: item.items?.filter((item: any) =>
        getModuleIds().includes(item?.moduleIds) || item.moduleIds === 0)
    }
  })

  return <CRXNestedMenu className="CRXLeftMenu" model={SubModulePermission} />;
};

export default CRXLefNavigation;
