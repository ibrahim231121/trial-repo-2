export const defaultPermissionType = "Select_permission_type"
export const defaultPermissionValue = "Select_permission_value"
export const defaultPermissionLevel = "Select_permission_level"

export const permissionTypes = [
    { value: 2, displayText: 'Category' },
    { value: 1, displayText: 'Uncategorized Assets' },
    { value: 3, displayText: 'Assigned To Self' }
];

export const permissionLevels = [
    { value: 1, displayText: 'View' },
    { value: 2, displayText: 'Share' },
    { value: 3, displayText: 'Update' },
    { value: 4, displayText: 'Exclusive(All)' }
];

export let defaultPermission = {
    type: { value: 0, label: "" },
    permissionValue: { value: 0, label: "" },
    permissionLevel: { value: 0, label: "" }
}