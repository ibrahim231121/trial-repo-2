import React from 'react';
import { CheckEvidenceExpire } from '../GlobalFunctions/CheckEvidenceExpire';

type Props = {
    evidence: any,
    actionMenuName : string
};

const allowedEvidenceExpireActionMenuList = ["Assign User", "Export"]

const CheckEvidenceExpiry: React.FunctionComponent<Props> = ({ evidence, actionMenuName, children }) => {

    if (!CheckEvidenceExpire(evidence) || allowedEvidenceExpireActionMenuList.indexOf(actionMenuName) > -1) {
        return <>{children}</>;
    }

    return null;
};

export default CheckEvidenceExpiry;