// import StationAnchorDisplay from "../Application/Admin/Station/StationAnchorDisplay";
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
    assetsDetail: "assetsDetail",
    adminUnitConfiguration: "adminUnitConfiguration",
    adminUnitConfigurationTemplate: "adminUnitConfigurationTemplate",
    // unitDeviceTemplateCreateBCO3: "unitDeviceTemplateCreateBCO3",
    unitDeviceTemplateCreateBCO4: "unitDeviceTemplateCreateBCO4",
    unitDeviceTemplateViewLog: "unitDeviceTemplateViewLog",
    // unitDeviceTemplateCreateBCO3Lte: "unitDeviceTemplateCreateBCO3Lte",
    testVideoPlayer: "videoplayer",
    testEvidence: "Evidence",
    adminStation: 'adminStation',
    adminStationCreate: 'adminStationCreate',
    adminStationEdit: 'adminStationEdit',
    createUser: 'createUser',
    editUser : 'editUser'
};

export const urlList: any = [
    {
        name: urlNames.assets,
        url: "/assets",
        details: [
            { type: "text", label: "Assets", }
        ],
    },
    {
        name: urlNames.assetsDetail,
        url: "/assetdetail",
        details: [
            { routeTo: "/assets", type: "link", label: "Assets", },
        ],
    },
    // {
    //     name: urlNames.assetsDetail,
    //     url: "/assets/:id",
    //     details: [
    //         { routeTo: "/assets", type: "link", label: "Assets", },
    //         { type: "text", label: "Asset Detail" },
    //     ],
    // },
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
            //{ routeTo: "/admin/usergroups", type: "text", label: "Group", }
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
        name: urlNames.createUser,
        url: "/admin/users/createUser",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/users/", type: "link", label: "User", },
            { type: "text", label: "Create user", }
        ],
    },
    {
        name: urlNames.editUser,
        url: '/admin/users/editUser/:id',
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/users/', type: 'link', label: 'User' }
        ]
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
        name: urlNames.adminStation,
        url: '/admin/stations',
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/stations', type: 'text', label: 'Manage Stations' }
        ]
    },
    {
        name: urlNames.adminStationCreate,
        url: '/admin/stations/station',
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/stations', type: 'link', label: 'Manage Stations' },
            { type: 'text', label: 'Create Station' }
        ]
    },
    {
        name: urlNames.adminStationEdit,
        url: '/admin/stations/station/:id',
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/stations', type: 'link', label: 'Manage Stations' },
            // { type: 'text', label: 'Station_Name' }
        ]
    },
    // {
    //     name: urlNames.adminStationEdit,
    //     url: '/admin/stations/station/:id',
    //     details: [
    //         { type: 'text', label: 'Admin' },
    //         { routeTo: '/admin/stations', type: 'link', label: 'Manage Stations' },
    //         { type: 'text', label: 'Edit Station' }
    //     ]
    // },
    {
        name: urlNames.unitsAndDevices,
        url: "/unitsanddevices",
        details: [
            { type: "text", label: "Units & Devices", }
        ],
    },
    {
        name: urlNames.unitsAndDevicesDetail,
        url: "/unitsanddevices/:id",
        details: [
            { routeTo: "/unitsanddevices", type: "link", label: " Units & Devices", }
        ],
    },
    {
        name: urlNames.adminUnitConfiguration,
        url: "/admin/unitconfiguration",
        details: [
            { type: "text", label: "Admin", },
            { type: "text", label: "Manage Unit Configuration", },
        ],
    },
    {
        name: urlNames.adminUnitConfigurationTemplate,
        url: "/admin/configurationtemplate",
        details: [
            { type: "text", label: "Admin" },
            { type: "Link", label: "Manage Units & Devices Templates", },
        ],
    },
    {
        name: urlNames.unitDeviceTemplateCreateBCO4, //inuse
        url: "/admin/unitanddevices/createtemplate/template",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/configurationtemplate", type: "link", label: "Units & Devices Templates", },
            //{ type: "text", label: "Create Template : BC04", }
        ],
    },

    {
        name: urlNames.unitDeviceTemplateViewLog, //inuse
        url: "/admin/unitanddevices/template/viewlog",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/configurationtemplate", type: "link", label: "Manage Units & Devices Configuration Templates", },
            //{ type: "text", label: "Create Template : BC04", }
        ],
    },

    // {
    //     name: urlNames.unitDeviceTemplateCreateBCO3,
    //     url: "/admin/unitanddevices/createtemplate/BC03",
    //     details: [
    //         { type: "text", label: "Admin", },
    //         { routeTo: "/admin/unitconfiguration/unitconfigurationtemplate", type: "link", label: "Units & devices templates", },
    //         { type: "text", label: "Create Template : BC03", }
    //     ],
    // },

    // {
    //     name: urlNames.unitDeviceTemplateCreateBCO3Lte,
    //     url: "/admin/unitanddevices/createtemplate/BC03Lte",
    //     details: [
    //         { type: "text", label: "Admin", },
    //         { routeTo: "/admin/unitconfiguration/unitconfigurationtemplate", type: "link", label: "Units & devices templates", },
    //         { type: "text", label: "Create Template : BC03 Lte", }
    //     ],
    // },

    {
        name: urlNames.testVideoPlayer,
        url: "/videoplayer",
        details: [
            { type: "text", label: "Dev video player", }
        ],
    },
    {
        name: urlNames.testEvidence,
        url: "/Evidence",
        details: [
            { type: "text", label: "Evidence List", }
        ],
    }


];
