// export const urlList: any = {
    
//     "/assets": [
//         { type: "text", label: "Assets", }
//     ],

//     "/admin/usergroups": [
//         { type: "text", label: "Admin", },
//         { routeTo: "/admin/usergroups", type: "text", label: "Manage User Groups & Permissions", }
//     ],
//     "/admin/usergroups/group/:id": [
//         { type: "text", label: "Admin", },
//         { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
//         { type: "text", label: "Group", }
//     ],
//     "/admin/usergroups/group/create": [
//         { type: "text", label: "Admin", },
//         { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
//         //{ routeTo: "/admin/usergroups/group", type: "link", label: "Group", },
//         { type: "text", label: "Create User Group", }
//     ],
//     "/admin/users": [
//         { type: "text", label: "Admin", },
//         { routeTo: "/admin/users", type: "text", label: "Manage Users", }
//     ],
//     "/admin/usergroups/group": [
//         { type: "text", label: "Admin", },
//         { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
//         { type: "text", label: "Group", }
//     ],
//     "/admin/TestDemo": [
//         { type: "text", label: "Admin", },
//         { routeTo: "/admin/TestDemo", type: "text", label: "Global Filter Components", }
//     ],

// };

export const urlNames: any = {
    assets: "assets",
    adminUserGroups: "adminUserGroups",
    adminUserGroup: "adminUserGroup",
    adminUserGroupId: "adminUserGroupId",
    userGroupCreate: "userGroupCreate",
    adminUsers: "adminUsers",
    adminTestDemo: "adminTestDemo",
    unitsAndDevices: "unitsAndDevices",
    unitsAndDevicesDetail: "unitsAndDevicesDetail",
    assetsDetail : "assetsDetail",
    adminUnitConfiguration: "adminUnitConfiguration",
    adminUnitConfigurationTemplate: "adminUnitConfigurationTemplate",
    adminUnitConfigurationTemplateCreate: "adminUnitConfigurationTemplateCreate",
    unitDeviceTemplateCreate : "unitDeviceTemplateCreate",
    unitDeviceTemplateClone: "unitDeviceTemplateClone",
    unitDeviceTemplate : "unitDeviceTemplate",
    unitDeviceTemplateCreateBCO3 : "unitDeviceTemplateCreateBCO3",
    unitDeviceTemplateCreateBCO4 : "unitDeviceTemplateCreateBCO4",
    unitDeviceTemplateCreateBCO3Lte : "unitDeviceTemplateCreateBCO3Lte"

}

export const urlList: any = [
    {
        name: urlNames.assets,
        url: "/assets",
        details: [
            { type: "text", label: "Assets", }
        ],
    },
    {
        name: urlNames.adminUserGroups,
        url: "/admin/usergroups",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/usergroups", type: "text", label: "Manage User Groups & Permissions", }
        ],
    },
    {
        name: urlNames.adminUserGroup,
        url: "/admin/usergroups/group",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
            { type: "text", label: "Group", }
        ],
    },
    {
        name: urlNames.adminUserGroupId,
        url: "/admin/usergroups/group/:id",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
            { type: "text", label: "Group", }
        ],
    },
    {
        name: urlNames.userGroupCreate,
        url: "/admin/usergroups/group/create",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
            { type: "text", label: "Create User Group", }
        ],
    },
    {
        name: urlNames.adminUsers,
        url: "/admin/users",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/users", type: "text", label: "Manage Users", }
        ],
    },
    {
        name: urlNames.adminTestDemo,
        url: "/admin/TestDemo",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/TestDemo", type: "text", label: "Global Filter Components", }
        ],
    },
    {
        name: urlNames.unitsAndDevices,
        url: "/unitsAndDevices",
        details: [
            { type: "text", label: "Manage Units & devices", }
        ],
    },
    // {
    //     name: urlNames.unitsAndDevices,
    //     url: "/unitsAndDevices",
    //     details: [
    //         { type: "text", label: "Manage Units & devices", }
    //     ],
    // },
    {
        name : urlNames.unitsAndDevicesDetail,
        url: "/unitsanddevices/detail/:id",
        details: [
             { routeTo: "/unitsanddevices/detail/:id", type: "link", label: "Units & devices", },
             { type: "text", label: "Unit Detail: <id>"},
        ],
    },
    {
        name : urlNames.assetsDetail,
        url: "/assets/detail/:id",
        details: [
            { routeTo: "/assets", type: "link", label: "Assets", },
            { type: "text", label: "Asset Detail: <id>" },
        ],
    },
    {
        name : urlNames.adminUnitConfiguration,
        url: "/admin/unitconfiguration",
        details: [
            { type: "text", label: "Admin", },
            { type: "text", label: "Manage Unit Configuration", },
        ],
    },
    {
        name : urlNames.adminUnitConfigurationTemplate,
        url: "/admin/unitconfiguration/unitconfigurationtemplate",
        details: [
            { type: "text", label: "Admin" },
            { routeTo: "/admin/unitconfiguration", type: "link", label: "Unit Configuration" },
            { type: "text", label: "Manage Unit Configuration Templates", },
        ],
    },
    {
        name : urlNames.adminUnitConfigurationTemplateCreate,
        url: "/admin/unitconfiguration/unitconfigurationtemplate/createtemplate",
        details: [
            { type: "text", label: "Admin" },
            { routeTo: "/admin/unitconfiguration", type: "link", label: "Unit Configuration" },
            { routeTo: "/admin/unitconfiguration/unitconfigurationtemplate", type: "link", label: "Unit Configuration Templates" },
            { type: "text", label: "Create Template", }
        ],
    },

    {
        name : urlNames.unitDeviceTemplateCreate,
        url: "/admin/unitsdevicestemplate/createtemplate",
        details: [
            { type: "link", label: "Admin", },
            { routeTo: "/admin/unitsdevicestemplate", type: "link", label: "Units & Devices Template", },
            { type: "text", label: "Create Template: <template type>", }
        ],
    },

    {
        name : urlNames.unitDeviceTemplateClone,
        url: "/admin/unitsdevicestemplate/clonetemplate",
        details: [
            { type: "link", label: "Admin", },
            { routeTo: "/admin/unitsdevicestemplate", type: "link", label: "Units & Devices Template", },
            { type: "text", label: "<Template: CLONE - <Template given name by user>", }
        ],
    },

    {
        name : urlNames.unitDeviceTemplate,
        url: "/admin/unitsdevicestemplate/template",
        details: [
            { type: "link", label: "Admin", },
            { routeTo: "/admin/unitsdevicestemplate", type: "link", label: "Units & Devices Template", },
            { type: "text", label: "Template, <template type>: <template name>", }
        ],
    },
    {
        name : urlNames.unitDeviceTemplateCreateBCO4,
        url: "/admin/unitanddevices/createtemplate/BC04",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/unitconfiguration/unitconfigurationtemplate", type: "link", label: "unit and devices templates", },
            { type: "text", label: "Create Template : BC04", }
        ],
    },

    {
        name : urlNames.unitDeviceTemplateCreateBCO3,
        url: "/admin/unitanddevices/createtemplate/BC03",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/unitconfiguration/unitconfigurationtemplate", type: "link", label: "unit and devices templates", },
            { type: "text", label: "Create Template : BC03", }
        ],
    },

    {
        name : urlNames.unitDeviceTemplateCreateBCO3Lte,
        url: "/admin/unitanddevices/createtemplate/BC03Lte",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/unitconfiguration/unitconfigurationtemplate", type: "link", label: "unit and devices templates", },
            { type: "text", label: "Create Template : BC03 Lte", }
        ],
    },

];