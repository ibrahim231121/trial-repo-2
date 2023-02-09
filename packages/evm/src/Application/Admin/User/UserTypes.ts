export type NameAndValue = {
    groupId: string;
    groupName: string;
};

export interface AutoCompleteOptionType {
    label?: string;
    id?: string;
}

export interface userStateProps {
    loginId: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    userGroups: AutoCompleteOptionType[];
    deactivationDate: string;
    pin: string | null;
}
