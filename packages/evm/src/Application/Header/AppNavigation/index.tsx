import { CRXNestedMenu } from "@cb/shared";
import { RemoveSharp } from "@material-ui/icons";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import { MODULES } from '../../../utils/Api/url'
import Restricted from "../../../ApplicationPermission/Restricted";
import useGetFetch from "../../../utils/Api/useGetFetch";
import { urlList, urlNames } from "./../../../utils/urlList"
import "./index.scss";


const CRXLefNavigation = () => {
  const history = useHistory();
  const navigateToPage = (path: string) => {
    history.push(path);
  };
  
  const { getModuleIds, moduleIds } = useContext(ApplicationPermissionContext);

  const items = [
    {
      moduleId:0,
      label: "Home",
      icon: "fas fa-chart-pie NaveIcon",
    },
    {
      moduleId:0,
      label: "Assets",
      icon: "icon icon-file-video NaveIcon",
      url: urlList.filter((item:any) => item.name === urlNames.assets)[0].url,
      disabled: false,
      items: [],
    },
    {
      moduleId:0,
      label: "Cases",
      icon: "fas fa-briefcase NaveIcon",
      items: [
        {
          label: "New",
        },
        {
          label: "Delete",
        },
        {
          label: "Search",

          items: [
            {
              label: "Filter",

              items: [
                {
                  label: "Print",
                },
              ],
            },
            {
              label: "List",
            },
          ],
        },
      ],
    },
    {
      moduleId:0,
      label: "Live Video",
      icon: "fas fa-video NaveIcon",
      classes: "liveVideoTab",
      items: [
        {
          label: "Edit",

          items: [
            {
              label: "Save",
            },
            {
              label: "Delete",
            },
          ],
        },
        {
          label: "Archieve",

          items: [
            {
              label: "Remove",
            },
          ],
        },
      ],
    },
    {
      moduleId:0,
      label: "Maps",
      icon: "icon icon-compass5 NaveIcon",
      classes: "mapsTab",
      items: [
        {
          label: "Analytics Map",
        },
        {
          label: "AVL Map",
        },
      ],
    },
    {
      moduleId:0,
      label: 'Units & Devices',
      icon: 'fas fa-laptop-code NaveIcon',
      command: () => {
        navigateToPage(urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url);
      },
   },

    {
      moduleId:0,
      label: "ALPR",
      icon: "fas fa-address-card NaveIcon",
      classes: "aplrTab",
      items: [
        {
          label: "Plate Captures",
        },
        {
          label: "Live ALPR",
        },
        {
          label: "Live ALPR",
        },
        {
          label: "Manage Hot List",
        },
        {
          separator: true,
        },
        {
          label: "Manage Hot List Data Source",
        },
        {
          label: "Manage License Plates",
        },
      ],
    },

    {
      moduleId:0,
      label: "Reports",
      icon: "icon icon-file-text NaveIcon",
      classes: "reportingTab",
      items: [
        {
          label: "Analytics Map",
        },
        {
          label: "AVL Map",
        },
      ],
    },

    {
      moduleId:0,
      label: "Admin",
      icon: "fas fa-sitemap NaveIcon",
      items: [
        {
          label: "Manage User Groups & Permissions",
          command: () => {
            navigateToPage(urlList.filter((item:any) => item.name === urlNames.adminUserGroups)[0].url);
          },
        },
        {
          label: "Manage Users",
          command: () => {
            navigateToPage(urlList.filter((item:any) => item.name === urlNames.adminUsers)[0].url);
          },
          
        },
        {
          label: 'Unit Configuration',
          command: () => { navigateToPage("/admin/unitconfiguration") },
          items:[
             {
                label: 'Unit Configuration Templates',
                command: () => { navigateToPage("/admin/unitconfiguration/unitconfigurationtemplate") },
             }
          ]
       }
      ],
    },
  ];

  var AssetPermission = items.filter((x:any) => getModuleIds().includes(x.moduleId) || x.moduleId === 0); 
  // x.moduleId === 0 is a temporary logic should be remove once all permission assigned.


  return <CRXNestedMenu className="CRXLeftMenu" model={AssetPermission} />;
};

export default CRXLefNavigation;
