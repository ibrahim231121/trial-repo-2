import { CRXNestedMenu } from "@cb/shared";
import './Navigation.scss'

const CRXLefNavigation = () => {
    const items = [
        {
           label:'Home',
           icon:'fas fa-chart-pie NaveIcon',
        },
        {
           label:'Assets',
           icon:'icon-file-video NaveIcon',
           items:[
              {
                 label:'Left',
                 
              },
              {
                 label:'Right',
                 
              },
              {
                 label:'Center',
                 
              },
              {
                 label:'Justify',
                 
              },
    
           ]
        },
        {
           label:'Cases',
           icon:'fas fa-briefcase NaveIcon',
           items:[
              {
                 label:'New',
                
    
              },
              {
                 label:'Delete',
                 
    
              },
              {
                 label:'Search',
                 
                 items:[
                    {
                       label:'Filter',
                       
                       items:[
                          {
                             label:'Print',
                             
                          }
                       ]
                    },
                    {
                       
                       label:'List'
                    }
                 ]
              }
           ]
        },
        {
           label:'Live Video',
           icon:'fas fa-video NaveIcon',
           items:[
              {
                 label:'Edit',
                 
                 items:[
                    {
                       label:'Save',
                       
                    },
                    {
                       label:'Delete',
                       
                    }
                 ]
              },
              {
                 label:'Archieve',
                 
                 items:[
                    {
                       label:'Remove',
                       
                    }
                 ]
              }
           ]
        },
        {
            label:'Maps',
            icon:'icon-compass2 NaveIcon',
            items:[
               {
                  label:'Analytics Map',
                  
               },
               {
                  label:'AVL Map',
                  
               },
            ]
        },

        {
            label:'ALPR',
            icon:'fas fa-address-card NaveIcon',
            items:[
                {
                  label:'Plate Captures',
                },
                {
                  label:'Live ALPR',
                },
                {
                    label:'Live ALPR',
                },
                {
                    label : 'Manage Hot List'
                },
                {
                    separator:true
                },
                {
                    label : 'Manage Hot List Data Source'
                },
                {
                    label : 'Manage License Plates'
                }
            ]
        },

        {
            label:'Reports',
            icon:'icon-file-text NaveIcon',
            items:[
               {
                  label:'Analytics Map',
               },
               {
                  label:'AVL Map',
               },
            ]
        },

        {
            label:'Setups',
            icon:'fas fa-cogs NaveIcon',
            items:[
                {
                    label:'System Settings',
                },
                {
                    label:'Unit Configuration',
                },
                {
                    label:'Policies',
                },
                {
                    label:'Permissions',
                },
                {
                    label:'Category Forms',
                },
                {
                    label:'Active Directory',
                },
                {
                    label:'CAD Integration',
                },
                {
                    label:'Versions',
                },
                {
                    label : 'Unit Update'
                },
                {
                    label : 'Storage'
                },
                {
                    label : 'RTCC'
                }

            ]
        },

    ];
    return (
        <CRXNestedMenu className="CRXLeftMenu" model={items} />
    )
}

export default CRXLefNavigation;