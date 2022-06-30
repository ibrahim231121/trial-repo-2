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
  };

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
      url: urlList.filter((item: any) => item.name === urlNames.assets)[0].url,
      disabled: false,
      
    },
    {
      moduleId: 0,
      label: t("Cases"),
      icon: "fas fa-briefcase NaveIcon",
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
    // {
    //   moduleId:0,
    //   label: "Live Video",
    //   icon: "fas fa-video NaveIcon",
    //   classes: "liveVideoTab",
    //   items: [
    //     {
    //       moduleIds:0,
    //       label: "Edit",

    //       items: [
    //         {
    //           moduleIds:0,
    //           label: "Save",
    //         },
    //         {
    //           moduleIds:0,
    //           label: "Delete",
    //         },
    //       ],
    //     },
    //     {
    //       moduleIds:0,
    //       label: "Archieve",

    //       items: [
    //         {
    //           moduleIds:0,
    //           label: "Remove",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   moduleId:0,
    //   label: "Maps",
    //   icon: "icon icon-compass5 NaveIcon",
    //   classes: "mapsTab",
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
      moduleId: 13,
      label: t('Units_&_Devices'),
      icon: 'fas fa-laptop-code NaveIcon',
     
      command: () => {
        navigateToPage(urlList.filter((item: any) => item.name === urlNames.unitsAndDevices)[0].url);
      },
    },

    {
      moduleId: 0,
      label: t("ALPR"),
      icon: "fas fa-address-card NaveIcon",
      classes: "aplrTab",
      items: [
        {
          moduleIds: 0,
          label: t("Plate_Captures"),
        },
        {
          moduleIds: 0,
          label: t("Live_ALPR"),
        },
        {
          moduleIds: 0,
          label: t("Live_ALPR"),
        },
        {
          moduleIds: 0,
          label: t("Manage_Hot_List"),
        },
        {
          moduleIds: 0,
          separator: true,
        },
        {
          moduleIds: 0,
          label: t("Manage_Hot_List_Data_Source"),
        },
        {
          moduleIds: 0,
          label: t("Manage_License_Plates"),
        },
      ],
    },

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
          moduleIds: 0,
          label: t('Evidence(Dev)'),
          command: () => { navigateToPage(urlList.filter((item: any) => item.name === urlNames.testEvidence)[0].url) },
        },
        {
          moduleIds: 17,
          label: t('Manage_Station'),
          url: "/admin/stations",
        }
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
