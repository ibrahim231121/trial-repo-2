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
  assets: 'assets',
  adminUserGroups: 'adminUserGroups',
  adminUserGroup: 'adminUserGroup',
  adminUserGroupId: 'adminUserGroupId',
  userGroupCreate: 'userGroupCreate',
  adminUsers: 'adminUsers',
  adminTestDemo: 'adminTestDemo',
  adminStation: 'adminStation',
  adminStationCreate: 'adminStationCreate',
  adminStationEdit : 'adminStationEdit'
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
        name: urlNames.adminUserGroups,
        url: "/admin/usergroups",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/usergroups", type: "text", label: "Manage User Groups & Permissions", }
        ],
    },
    // {
    //     name: urlNames.adminUserGroup,
    //     url: "/admin/usergroups/group",
    //     details: [
    //         { type: "text", label: "Admin", },
    //         { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
    //         { type: "text", label: "Group", }
    //     ],
    // },
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
        url: "/admin/usergroups/group/:id(\\d+)",
        details: [
            { type: "text", label: "Admin", },
            { routeTo: "/admin/usergroups", type: "link", label: "Manage User Groups & Permissions", },
            { type: "text", label: "Group", }
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
      { type: 'text', label: 'Station_Name' }
    ]
  },
  {
    name: urlNames.adminStationEdit,
    url: '/admin/stations/station/:id',
    details: [
      { type: 'text', label: 'Admin' },
      { routeTo: '/admin/stations', type: 'link', label: 'Manage Stations' },
      { type: 'text', label: 'Edit Station' }
    ]
  }
];
