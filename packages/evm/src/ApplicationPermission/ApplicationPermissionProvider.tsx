import React from 'react';
import {Permission} from "./types";
import ApplicationPermissionContext from "./ApplicationPermissionContext";

type Props = {
    setModuleIds:(moduleIds:number[])=> void,
    getModuleIds:()=> number[],
    moduleIds:  number[],
    getGroupIds: () => number[],
    getTenantId: () => number
}

type PermissionCache = {
    [key:number]: boolean;
}


const ApplicationPermissionProvider: React.FunctionComponent<Props> = ({setModuleIds, getModuleIds, moduleIds, getGroupIds, children,getTenantId}) => {
    return  <ApplicationPermissionContext.Provider
                value={{
                    setModuleIds,
                    getModuleIds,
                    moduleIds,
                    getGroupIds,
                    getTenantId   
                }} >
                {children}
            </ApplicationPermissionContext.Provider>;
};

export default ApplicationPermissionProvider;
