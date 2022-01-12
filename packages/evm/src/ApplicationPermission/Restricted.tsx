import React, {useContext} from 'react';
import ApplicationPermissionContext from "./ApplicationPermissionContext";
import {Permission} from "./types";

type Props = {
    moduleId: Permission;
};

const Restricted: React.FunctionComponent<Props> = ({moduleId, children}) => {
    const {moduleIds} = useContext(ApplicationPermissionContext);

    if( moduleIds.includes(moduleId)){
        return <>{children}</>;
    }

    return null;
};

export default Restricted;