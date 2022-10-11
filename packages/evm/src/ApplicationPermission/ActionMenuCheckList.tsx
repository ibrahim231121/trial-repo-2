import React from 'react';
import { SearchModel } from '../utils/Api/models/SearchModel';
import CheckAssetExpiry from './CheckAssetExpiry';
import Restricted from './Restricted';
import SecurityDescriptor from './SecurityDescriptor';

type Props = {
    evidence: any,
    moduleId: number,
    descriptorId: number,
    maximumDescriptor: number,
    actionMenuName: string;
    securityDescriptors: Array<SearchModel.SecurityDescriptor>;

};

const ActionMenuCheckList: React.FunctionComponent<Props> = ({ evidence, moduleId, descriptorId, maximumDescriptor, actionMenuName, securityDescriptors, children }) => {
    return (
        <CheckAssetExpiry evidence={evidence} actionMenuName={actionMenuName}>
            <Restricted moduleId={moduleId}>
                <SecurityDescriptor descriptorId={descriptorId} maximumDescriptor={maximumDescriptor} securityDescriptors={securityDescriptors}>
                    <>{children}</>
                </SecurityDescriptor>
            </Restricted>
        </CheckAssetExpiry>)
};

export default ActionMenuCheckList;