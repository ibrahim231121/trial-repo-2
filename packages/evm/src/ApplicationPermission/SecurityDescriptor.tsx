import React, { useContext } from 'react';
import ApplicationPermissionContext from './ApplicationPermissionContext';
import { Permission } from "./types";

type Props = {
    descriptorId: Permission;
    maximumDescriptor: Permission;
    securityDescriptors?: any;
    isCategorizedByCheck?: boolean;
};

const SecurityDescriptor: React.FunctionComponent<Props> = ({ maximumDescriptor, descriptorId, securityDescriptors, isCategorizedByCheck, children }) => {
    const { getGroupIds } = useContext(ApplicationPermissionContext);
    let groupIds = getGroupIds();
    let evidenceGroupIds = securityDescriptors?.map((x: any) => x.groupId);
    if (maximumDescriptor != 0 && groupIds?.some((x: any) => evidenceGroupIds?.includes(x))) {
        if (isCategorizedByCheck)
            return <>{children}</>;
        else if (maximumDescriptor >= descriptorId)
            return <>{children}</>;
        else
            return null;
    }
    return null;
};

export default SecurityDescriptor;