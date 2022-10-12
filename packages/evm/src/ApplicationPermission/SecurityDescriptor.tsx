import React, { useContext } from 'react';
import ApplicationPermissionContext from './ApplicationPermissionContext';
import { Permission } from "./types";

type Props = {
    descriptorId: Permission;
    maximumDescriptor: Permission;
    securityDescriptors?: any;
};

const SecurityDescriptor: React.FunctionComponent<Props> = ({ maximumDescriptor, descriptorId, securityDescriptors, children }) => {
    const {getGroupIds} = useContext(ApplicationPermissionContext);
    let groupIds  = getGroupIds();
    let evidenceGroupIds = securityDescriptors?.map((x: any) => x.groupId);
    if(maximumDescriptor != 0 && groupIds?.some((x: any) => evidenceGroupIds?.includes(x))){
        if (maximumDescriptor >= descriptorId) {
            return <>{children}</>;
        }
    }
    return null;
};

export default SecurityDescriptor;