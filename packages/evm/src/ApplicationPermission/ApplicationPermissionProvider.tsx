import React from 'react';
import {Permission} from "./types";
import ApplicationPermissionContext from "./ApplicationPermissionContext";

type Props = {
    setModuleIds:(moduleIds:number[])=> void,
    getModuleIds:()=> number[],
    moduleIds:  number[],
    groupIds: number[]
}

type PermissionCache = {
    [key:number]: boolean;
}


const ApplicationPermissionProvider: React.FunctionComponent<Props> = ({setModuleIds, getModuleIds, moduleIds, groupIds, children}) => {

    return  <ApplicationPermissionContext.Provider
                value={{
                    setModuleIds,
                    getModuleIds,
                    moduleIds,
                    groupIds   
                }} >
                {children}
            </ApplicationPermissionContext.Provider>;
};

export default ApplicationPermissionProvider;
