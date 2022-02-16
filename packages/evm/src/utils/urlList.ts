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
    unitDeviceTemplateCreateBCO3 : "unitDeviceTemplateCreateBCO3",
    unitDeviceTemplateCreateBCO4 : "unitDeviceTemplateCreateBCO4",
    unitDeviceTemplateCreateBCO3Lte : "unitDeviceTemplateCreateBCO3Lte",
    testVideoPlayer: "videoplayer",
    unitConfigEditTemplate:"unitConfigEditTemplate"

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
        name : urlNames.assetsDetail,
        url: "/assets/:id",
        details: [
            { routeTo: "/assets", type: "link", label: "Assets", },
            { type: "text", label: "Asset Detail" },
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
        name: urlNames.userGroupCreate,
        url: "/admin/usergroups/group",
        details: [
        { type: "text", label: "Admin", },
        { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
        { type: "text", label: "Create User Group", }
    ],
    },
    {
        name: urlNames.adminUserGroupId,
        url: "/admin/usergroups/group/:id",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
            { routeTo: "/admin/usergroups", type: "text", label: "Group", }
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
        url: "/unitsanddevices",
        details: [
        { type: "text", label: "Manage Units & devices", }
    ],
    },
    {
        name : urlNames.unitsAndDevicesDetail,
        url: "/unitsanddevices/:id",
        details: [
            { routeTo: "/unitsanddevices", type: "link", label: "Units & devices", }
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

    {
        name : urlNames.testVideoPlayer,
        url: "/videoplayer",
        details: [
            { type: "text", label: "Dev video player", }
        ],
    },

    {
        name : urlNames.unitConfigEditTemplate,
        url: "/admin/unitanddevices/edittemplate/BC04",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/unitconfiguration/unitconfigurationtemplate", type: "link", label: "unit and devices templates", },
            { type: "text", label: "Edit template : BC04", }
        ],
    },


];