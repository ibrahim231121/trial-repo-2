import React from 'react';
import { Permission } from "./types";

type Props = {
    descriptorId: Permission;
    maximumDescriptor : Permission;
};

const SecurityDescriptor: React.FunctionComponent<Props> = ({ maximumDescriptor, descriptorId, children }) => {
    if(maximumDescriptor != 0){
        if (maximumDescriptor >= descriptorId) {
            return <>{children}</>;
        }
    }
    return null;
};

export default SecurityDescriptor;