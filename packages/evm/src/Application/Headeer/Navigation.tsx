import { CRXNestedMenu } from "@cb/shared";
import { useHistory } from "react-router-dom";
import './Navigation.scss'

const CRXLefNavigation = () => {
   const history = useHistory();
   const navigateToPage = (path: string) => {
      history.push(path);
   }

   const items = [
      {
         label: 'Home',
         icon: 'fas fa-chart-pie NaveIcon',
      },
      {
         label: 'Assets',
         icon: 'icon-file-video NaveIcon',
         url: "/assets",
         items: [
            {
               label: 'Assets',
               command: () => { navigateToPage("/assets") },
            },
            {
               label: 'Right',

            },
            {
               label: 'Center',

            },
            {
               label: 'Justify',

            },

         ]
      },
      {
         label: 'Cases',
         icon: 'fas fa-briefcase NaveIcon',
         items: [
            {
               label: 'New',


            },
            {
               label: 'Delete',


            },
            {
               label: 'Search',

               items: [
                  {
                     label: 'Filter',

                     items: [
                        {
                           label: 'Print',

                        }
                     ]
                  },
                  {

                     label: 'List'
                  }
               ]
            }
         ]
      },
      {
         label: 'Live Video',
         icon: 'fas fa-video NaveIcon',
         classes: 'liveVideoTab',
         items: [
            {
               label: 'Edit',

               items: [
                  {
                     label: 'Save',

                  },
                  {
                     label: 'Delete',

                  }
               ]
            },
            {
               label: 'Archieve',

               items: [
                  {
                     label: 'Remove',

                  }
               ]
            }
         ]
      },
      {
         label: 'Maps',
         icon: 'icon-compass2 NaveIcon',
         classes: 'mapsTab',
         items: [
            {
               label: 'Analytics Map',

            },
            {
               label: 'AVL Map',

            },
         ]
      },

      {
         label: 'Units & Devices',
         icon: 'fas fa-laptop-code NaveIcon',
         url: "/unitsAndDevices",
      },

      {
         label: 'ALPR',
         icon: 'fas fa-address-card NaveIcon',
         classes: 'aplrTab',
         items: [
            {
               label: 'Plate Captures',
            },
            {
               label: 'Live ALPR',
            },
            {
               label: 'Live ALPR',
            },
            {
               label: 'Manage Hot List'
            },
            {
               separator: true
            },
            {
               label: 'Manage Hot List Data Source'
            },
            {
               label: 'Manage License Plates'
            }
         ]
      },

      {
         label: 'Reports',
         icon: 'icon-file-text NaveIcon',
         classes: 'reportingTab',
         items: [
            {
               label: 'Analytics Map',
            },
            {
               label: 'AVL Map',
            },
         ]
      },

      {
         label: 'Admin',
         icon: 'fas fa-sitemap NaveIcon',
         items: [
            {
               label: 'Manage User Groups & Permissions'
            },
            {
               label: 'Manage Users'
            },
            {
               label: 'Unit Configuration',
               command: () => { navigateToPage("/admin/unitconfiguration") },
               items:[
                  {
                     label: 'Unit Configuration Templates',
                     command: () => { navigateToPage("/admin/unitconfigurationtemplate") },
                  }
               ]
            }
         ]
      },

   ];

   return (
      <CRXNestedMenu className="CRXLeftMenu" model={items} />
   )
}

export default CRXLefNavigation;