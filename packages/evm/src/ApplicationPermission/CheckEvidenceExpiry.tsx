import React from 'react';
import { CheckEvidenceExpire } from '../GlobalFunctions/CheckEvidenceExpire';

type Props = {
    evidence: any,
    actionMenuName: string,
    isMultiSelectEvidenceExpired: boolean
};

const allowedEvidenceExpireActionMenuList = ["Assign user", "Export"]

const CheckEvidenceExpiry: React.FunctionComponent<Props> = ({ evidence, actionMenuName, isMultiSelectEvidenceExpired, children }) => {
    if ((!CheckEvidenceExpire(evidence) && !isMultiSelectEvidenceExpired) || allowedEvidenceExpireActionMenuList.indexOf(actionMenuName) > -1) {
        return <>{children}</>;
    }

    return null;
};

export default CheckEvidenceExpiry;