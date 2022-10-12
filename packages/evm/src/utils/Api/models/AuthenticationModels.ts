export interface Token {
    accessToken:string;
    idToken:string;
    refreshToken:string;
    AssignedGroups:string;
    AssignedModules:string;
    ClientIP:string;
    Email:string;
    Id:string;
    TenantId:string;
    UserId:string;
    exp:number;
    iat:number;
    nbf:number;
  }