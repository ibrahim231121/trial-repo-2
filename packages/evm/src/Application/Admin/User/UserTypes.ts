export type NameAndValue = {
    groupId: string;
    groupName: string;
};

export interface AutoCompleteOptionType {
    label?: string;
    id?: string;
}

export interface userStateProps {
    userName: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userGroups: AutoCompleteOptionType[];
    deactivationDate: string;
    pin: string | null;
}
