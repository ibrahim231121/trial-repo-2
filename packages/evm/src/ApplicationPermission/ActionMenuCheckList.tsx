import React from 'react';
import { SearchModel } from '../utils/Api/models/SearchModel';
import CheckEvidenceExpiry from './CheckEvidenceExpiry';
import Restricted from './Restricted';
import SecurityDescriptor from './SecurityDescriptor';
import PrimaryAssetActionMenuCheck from './PrimaryAssetActionMenuCheck';

type Props = {
    evidence: any,
    moduleId: number,
    descriptorId: number,
    maximumDescriptor: number,
    actionMenuName: string;
    securityDescriptors: Array<SearchModel.SecurityDescriptor>;
    isMultiSelectEvidenceExpired: boolean;
    isCategorizedByCheck?: boolean;
    isCategorizedBy?: boolean;
    asset: any;
};

const ActionMenuCheckList: React.FunctionComponent<Props> = ({ evidence, moduleId, descriptorId, maximumDescriptor, actionMenuName, securityDescriptors, isMultiSelectEvidenceExpired, isCategorizedByCheck, isCategorizedBy, asset, children }) => {

    const isCategorizedCheck = (isCategorizedByCheck: boolean | undefined, isCategorizedBy: boolean | undefined): boolean => {
        if (isCategorizedByCheck && isCategorizedBy) return true;
        else return false;
    }

    return (<PrimaryAssetActionMenuCheck evidence={evidence} actionMenuName={actionMenuName} asset={asset}>
        <CheckEvidenceExpiry evidence={evidence} actionMenuName={actionMenuName} isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}>
            <Restricted moduleId={moduleId} isCategorizedByCheck={isCategorizedCheck(isCategorizedByCheck, isCategorizedBy)}>
                <SecurityDescriptor descriptorId={descriptorId} maximumDescriptor={maximumDescriptor} securityDescriptors={securityDescriptors} isCategorizedByCheck={isCategorizedCheck(isCategorizedByCheck, isCategorizedBy)}>
                    <>{children}</>
                </SecurityDescriptor>
            </Restricted>
        </CheckEvidenceExpiry>
    </PrimaryAssetActionMenuCheck>)
};

export default ActionMenuCheckList;