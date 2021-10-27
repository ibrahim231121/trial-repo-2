export const urlList: any = {
    "/assets": [
        { type: "text", label: "Assets", }
    ],
    "/admin/usergroups": [
        { type: "text", label: "Admin", },
        { routeTo: "/admin/usergroups", type: "text", label: "Manage User Groups & Permissions", }
    ],
    "/admin/usergroups/group": [
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

};