import React from 'react';
import { SearchModel } from '../utils/Api/models/SearchModel';
import CheckEvidenceExpiry from './CheckEvidenceExpiry';
import Restricted from './Restricted';
import SecurityDescriptor from './SecurityDescriptor';

type Props = {
    evidence: any,
    moduleId: number,
    descriptorId: number,
    maximumDescriptor: number,
    actionMenuName: string;
    securityDescriptors: Array<SearchModel.SecurityDescriptor>;
    isMultiSelectEvidenceExpired: boolean;
};

const ActionMenuCheckList: React.FunctionComponent<Props> = ({ evidence, moduleId, descriptorId, maximumDescriptor, actionMenuName, securityDescriptors, isMultiSelectEvidenceExpired, children }) => {
    return (<CheckEvidenceExpiry evidence={evidence} actionMenuName={actionMenuName} isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}>
        <Restricted moduleId={moduleId}>
            <SecurityDescriptor descriptorId={descriptorId} maximumDescriptor={maximumDescriptor} securityDescriptors={securityDescriptors}>
                <>{children}</>
            </SecurityDescriptor>
        </Restricted>
    </CheckEvidenceExpiry>)
};

export default ActionMenuCheckList;