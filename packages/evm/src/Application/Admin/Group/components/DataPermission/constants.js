export const defaultPermissionType = "-- Select permission type --"
export const defaultPermissionValue = "-- Select permission value --"
export const defaultPermissionLevel = "-- Select permission level --"

export const permissionTypes = [
    {  value:1, displayText: 'Category' },
    {  value:2, displayText: 'Station' }
];

export const permissionLevels = [
    {  value:1, displayText: 'View' },
    {  value:2, displayText: 'Share' },
    {  value:3, displayText: 'Update' },
    {  value:4, displayText: 'Exclusive(All)' }
];

export let defaultPermission = { 
    type:{ value:0, label:""},
    permissionValue:{ value:0, label:""},
    permissionLevel:{ value:0, label:""}
}