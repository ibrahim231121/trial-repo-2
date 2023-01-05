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

import {BASE_URL_COMMAND_SERVICE} from './Api/url';


export const urlNames: any = {
    assets: "assets",
    assetSearchResult:"assetSearchResult",
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
    tenantSettings: "tenantSetting",
    adminStation: 'adminStation',
    adminStationCreate: 'adminStationCreate',
    adminStationEdit: 'adminStationEdit',
    createUser: 'createUser',
    editUser : 'editUser',
    sharedMedia : 'sharedMedia',    
    manageUnitDeviceTemplate : 'manageUnitDeviceTemplate',
    liveVideo : 'liveVideo',
    avlMap: 'avlMap',
    sensorsAndTriggers: 'sensorsAndTriggers',
    sensorsAndTriggersCreate: 'sensorsAndTriggersCreate',
    sensorsAndTriggersEdit: "sensorsAndTriggersEdit",
    singleLiveView:'singleLiveView',
    retentionPolicies: 'retentionPolicies',
    uploadPolicies: 'uploadPolicies',
    uploadPoliciesCreate: 'uploadPoliciesCreate',
    uploadPoliciesEdit: "uploadPoliciesEdit",
    categories : 'categories',
    categoryForms : 'categoryForms',
    about : 'about',
    categoryFormsCreate : 'categoryFormsCreate',
    categoryFormsEdit : 'categoryFormsEdit'
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
        name: urlNames.tenantSettings,
        url: "/tenantSettings",
        details: [
            { type: "text", label: "Tenant Settings", }
        ],
    },
    {
        name: urlNames.sharedMedia,
        url: "/assets/sharedMedia",
        details: [
            { routeTo: "/assets/sharedMedia", type: "text", label: "Shared Media", }
        ],
    },
    {
        name: urlNames.assetsDetail,
        url: '/assetdetail',
        details: [
            { routeTo: "/assets", type: "link", label: "Assets", },
            { routeTo:'/assetSearchResult', type: 'text', label: 'Search Results' },
        ]
    },
    {
        name: urlNames.assetSearchResult,
        url: '/assetSearchResult',
        details: [
            { routeTo: "/assets", type: "link", label: "Assets", },
            { routeTo:'/assetSearchResult', type: 'text', label: 'Search Results' },
            
        ]
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
        type : "form",
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
        name: urlNames.liveVideo,
        url: `${BASE_URL_COMMAND_SERVICE}?tmplId=3`,  //Multi Live View URL
        details: [
            { type: "text", label: "Live Video", }
        ],
    },
    {
        name: urlNames.avlMap,
        url: `${BASE_URL_COMMAND_SERVICE}?tmplId=1`,  //Avl Map Live View URL
        details: [
            { type: "text", label: "Avl Map", }
        ],
    },
    {
        name: urlNames.singleLiveView,
        url: `${BASE_URL_COMMAND_SERVICE}?tmplId=2`,  //Single Live View URL
        details: [
            { type: "link", label: "Single Live View", }
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
    },
    {
        name: urlNames.manageUnitDeviceTemplate,
        url: "/admin/defaultUnitTemplate",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/defaultUnitTemplate', type: 'text', label: 'Manage Default Unit Template' }
        ],
    },
    {
        name: urlNames.sensorsAndTriggers,
        url: "/admin/sensorsAndTriggers",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/sensorsAndTriggers', type: 'text', label: 'Sensors & Triggers' }
        ],
    },
    {
        name: urlNames.sensorsAndTriggersCreate,
        url: "/admin/sensorsAndTriggers/sensorsAndTriggersCreate",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/sensorsAndTriggers', type: 'link', label: 'Sensors & Triggers' },
            { type: "text", label: "Create Sensors & Triggers", }
        ],
    },
    {
        name: urlNames.sensorsAndTriggersEdit,
        url: "/admin/sensorsAndTriggers/sensorsAndTriggersEdit/:id",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/sensorsAndTriggers', type: 'link', label: 'Sensors & Triggers' },
        ],
    },
    {
        name: urlNames.retentionPolicies,
        url: "/admin/retentionPolicies",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/retentionPolicies', type: 'text', label: 'Retention Policies' }
        ],
    }
    ,
    {
        name: urlNames.uploadPolicies,
        url: "/admin/uploadPolicies",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/uploadPolicies', type: 'text', label: 'Upload Policies' }
        ],
    },
    {
        name: urlNames.uploadPoliciesCreate,
        url: "/admin/uploadPolicies/uploadPoliciesCreate",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/uploadPolicies', type: 'link', label: 'Upload Policies' },
            { type: "text", label: "Create Upload Policy", }
        ],
    },
    {
        name: urlNames.uploadPoliciesEdit,
        url: "/admin/uploadPolicies/uploadPoliciesEdit/:id",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/uploadPolicies', type: 'link', label: 'Upload Policies' },
        ],
    },
    {
        name: urlNames.categories,
        url: "/admin/categories",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/categories', type: 'text', label: 'Categories' }
        ],
    },
    {
        name: urlNames.categoryForms,
        url: "/admin/categoryForms",
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/categoryForms', type: 'text', label: 'Category Forms & Fields' }
        ],
    },
    {
        name: urlNames.about,
        url: "/about",
        details: [
            { type: 'text', label: 'Microservices Build Version' }
        ],
    },
    {
        name: urlNames.categoryFormsCreate,
        url: '/admin/categoryForms/categoryForm',
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/categoryForms/', type: 'link', label: 'Category Forms & Fields' },
            { type: 'text', label: 'Create Category Forms' }
        ]
    },
    {
        name: urlNames.categoryFormsEdit,
        url: '/admin/categoryForms/categoryForm/:id',
        details: [
            { type: 'text', label: 'Admin' },
            { routeTo: '/admin/categoryForms/', type: 'link', label: 'Category Forms & Fields' },
            { type: 'text', label: 'Edit Category Forms' }
        ]
    }
    
];
