import { CRXNestedMenu } from "@cb/shared";
import { RemoveSharp } from "@material-ui/icons";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import Restricted from "../../../ApplicationPermission/Restricted";
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
      moduleId:1,
      label: "Assets",
      icon: "icon icon-file-video NaveIcon",
      url: "/assets",
      disabled: false,
      items: [
        {
          label: "Assets",
          command: () => {
            navigateToPage("/assets");
          },
        },
        {
          label: "Right",
        },
        {
          label: "Center",
        },
        {
          label: "Justify",
        },
      ],
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
        },
        {
          label: "Manage Users",
        },
      ],
    },
  ];

var AssetPermission = items.filter((x:any) => getModuleIds().includes(x.moduleId) || x.moduleId === 0); // x.moduleId === 0 is a temporary logic should be remove once all permission assigned.


  return <CRXNestedMenu className="CRXLeftMenu" model={AssetPermission} />;
};

export default CRXLefNavigation;
