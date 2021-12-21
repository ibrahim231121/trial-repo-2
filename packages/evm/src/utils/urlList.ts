export const urlList: any = {
    "/assets": [
        { type: "text", label: "Assets", }
    ],
    "/admin/usergroups": [
        { type: "text", label: "Admin", },
        { routeTo: "/admin/usergroups", type: "text", label: "Manage User Groups & Permissions", }
    ],
    "/admin/usergroups/group/:id": [
        { type: "text", label: "Admin", },
        { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
        { type: "text", label: "Group", }
    ],
    "/admin/usergroups/group/create": [
        { type: "text", label: "Admin", },
        { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
        //{ routeTo: "/admin/usergroups/group", type: "link", label: "Group", },
        { type: "text", label: "Create User Group", }
    ],
    "/admin/users": [
        { type: "text", label: "Admin", },
        { routeTo: "/admin/users", type: "text", label: "Manage Users", }
    ],
    "/unitsanddevices": [
        { type: "text", label: "Manage Units & devices", }
    ],
    "/admin/unitconfiguration/unitconfigurationtemplate": [
        { type: "text", label: "Admin" },
        { routeTo: "/admin/unitconfiguration", type: "link", label: "Unit Configuration" },
        { type: "text", label: "Manage Unit Configuration Templates", },
    ],
    "/admin/unitconfiguration/unitconfigurationtemplate/createtemplate": [
        { type: "text", label: "Admin" },
        { routeTo: "/admin/unitconfiguration", type: "link", label: "Unit Configuration" },
        { routeTo: "/admin/unitconfiguration/unitconfigurationtemplate", type: "link", label: "Unit Configuration Templates" },
        { type: "text", label: "Create Template", }
    ],
    "/admin/unitconfiguration": [
        { type: "text", label: "Admin", },
        { type: "text", label: "Manage Unit Configuration", },
    ],
    "/unitsanddevices/detail/:id": [
        { routeTo: "/unitsanddevices", type: "link", label: "Units & devices", },
        { type: "text", label: "Unit Detail: <id>"},
    ],
    "/assets/detail/:id": [
        { routeTo: "/assets", type: "link", label: "Assets", },
        { type: "text", label: "Asset Detail: <id>" },
    ],
    "/admin/unitsdevicestemplate/createtemplate": [
        { type: "link", label: "Admin", },
        { routeTo: "/admin/unitsdevicestemplate", type: "link", label: "Units & Devices Template", },
        { type: "text", label: "Create Template: <template type>", }
    ],
    "/admin/unitsdevicestemplate/clonetemplate": [
        { type: "link", label: "Admin", },
        { routeTo: "/admin/unitsdevicestemplate", type: "link", label: "Units & Devices Template", },
        { type: "text", label: "<Template: CLONE - <Template given name by user>", }
    ],
    "/admin/unitsdevicestemplate/template": [
        { type: "link", label: "Admin", },
        { routeTo: "/admin/unitsdevicestemplate", type: "link", label: "Units & Devices Template", },
        { type: "text", label: "Template, <template type>: <template name>", }
    ],
    "/admin/usergroups/group": [
        { type: "text", label: "Admin", },
        { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
        { type: "text", label: "Group", }
    ],
 
    "/admin/unitanddevices/createtemplate/BC04": [
        { type: "text", label: "Admin", },
        { routeTo: "/unitanddevices", type: "link", label: "unit and devices templates", },
        { type: "text", label: "Create Template : BC04", }
    ],
    "/admin/unitanddevices/createtemplate/BC03": [
        { type: "text", label: "Admin", },
        { routeTo: "/unitanddevices", type: "link", label: "unit and devices templates", },
        { type: "text", label: "Create Template : BC03", }
    ],

};
