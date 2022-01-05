import React from 'react';
import {Permission} from "./types";

type ApplicationPermissionContextType = {
    setModuleIds: () => void,
    moduleids:number[]
}
const defaultBehaviour: ApplicationPermissionContextType = {
    setModuleIds: () => {},
    moduleids:[]
}

// Create the context
const ApplicationPermissionContext = React.createContext<any>( null);

export default ApplicationPermissionContext;
