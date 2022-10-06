import React from 'react';
import CheckAssetExpiry from './CheckAssetExpiry';
import Restricted from './Restricted';
import SecurityDescriptor from './SecurityDescriptor';

type Props = {
    evidence: any,
    moduleId: number,
    descriptorId: number,
    maximumDescriptor: number,
    actionMenuName : string
};

const ActionMenuCheckList: React.FunctionComponent<Props> = ({ evidence, moduleId, descriptorId, maximumDescriptor, actionMenuName, children }) => {
    return (<CheckAssetExpiry evidence={evidence} actionMenuName={actionMenuName}>
        <Restricted moduleId={moduleId}>
            <SecurityDescriptor descriptorId={descriptorId} maximumDescriptor={maximumDescriptor} securityDescriptors={evidence?.securityDescriptors}>
                <>{children}</>
            </SecurityDescriptor>
        </Restricted>
    </CheckAssetExpiry>)
};

export default ActionMenuCheckList;