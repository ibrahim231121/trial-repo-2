import React, {useContext} from 'react';
import ApplicationPermissionContext from "./ApplicationPermissionContext";
import {Permission} from "./types";

type Props = {
    moduleId: Permission;
};

const Restricted: React.FunctionComponent<Props> = ({moduleId, children}) => {
    const {moduleIds} = useContext(ApplicationPermissionContext);

    console.log("moduleId",moduleId)
    console.log("children",{children})


    if( moduleIds.includes(moduleId) || moduleId === 0){ // moduleId === 0 this is temporary logic and will be removed once all the permission included into application.
        return <>{children}</>;
    }

    return null;
};

export default Restricted;