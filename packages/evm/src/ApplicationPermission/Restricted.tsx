import React, { useContext } from 'react';
import ApplicationPermissionContext from "./ApplicationPermissionContext";
import { Permission } from "./types";

type Props = {
    moduleId: Permission;
    isCategorizedByCheck?: boolean;
};

const Restricted: React.FunctionComponent<Props> = ({ moduleId, isCategorizedByCheck, children }) => {
    const { moduleIds } = useContext(ApplicationPermissionContext);
    if (isCategorizedByCheck)
        return <>{children}</>;
    else if (moduleIds.includes(moduleId) || moduleId === 0) // moduleId === 0 this is temporary logic and will be removed once all the permission included into application.
        return <>{children}</>;
    else
        return null;
};

export default Restricted;