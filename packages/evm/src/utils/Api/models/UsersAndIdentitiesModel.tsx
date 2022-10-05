import { History } from "../../../Application/Admin/Station/DefaultUnitTemplate/DefaultUnitTemplateModel";


export interface UsersInfo {
    email: string,
    fName: string,
    lName: number
    lastLogin: Date,
    recId: number,
    status: string
    userGroups: string,
    userName: string,
    headers: any
}

export interface UserGroups {
    description:string,
    groupSubModules:GroupSubModules[],
    history?:History,
    id:string,
    members:Members, //to be confirmed by backend
    name:string

}
export interface Members{
    users: MemberId[]
}

export interface MemberId{
    id: Number
}

export interface GroupSubModules{
    history?:History,
    id:string,
    permission?:number,
    subModuleId:string
}

export interface Member {
    users:Number[],
    childGroups:Number[],   
}

export interface GroupUserCount {
    group:number,
    userCount:number,   
}

export interface UserList {
    account: AccountBase,
    userGroups: UserGroupsDetail[],   
}

export interface UserStatus{
    id: Number,
    name: string
}

export interface AccountBase {
    status: string,
    userName: string,
    lastLogin: Date,
    isAdministrator: boolean,
    passwordDetail: PasswordDetail,
    isPasswordResetRequired: boolean
}

export interface UserGroupsDetail {
    groupId: number,
    groupName: string
}

export interface PasswordDetail {
    expiresOn: Date,
    numberOfInvalidAttempts: number
}

export interface User {
    email: string;
    deactivationDate: string;
    name: {
        first: string;
        last: string;
        middle: string;
    };
    account: Account;
    contacts: {
        contactType: number;
        number: string;
    }[];
    assignedGroupIds: any[] | undefined;
    timeZone: string;
    pin? : string | null;
}
export interface Account {
    isAdministrator: number;
    lastLogin: Date;
    passwordDetail: any;
    status: number;
    userName: string;
    password: string;
    isPasswordResetRequired: boolean;

}

export interface Module {
   id: number,
   name: string,
   appId: number,
   description: string,
   history: History,
   subModules: SubModule[]

}
export interface SubModule {
    id: number,
    name: string,
    subModuleGroupName: string,
    description: string
 }

 export interface GroupList{
    members: MemberList 

 }
 export interface MemberList{
    users: UserList[],
    childGroups: Number[]

 }