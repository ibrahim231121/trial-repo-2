import moment from 'moment';
import React from 'react';
import { AssetRetentionFormat } from '../GlobalFunctions/AssetRetentionFormat';

type Props = {
    evidence: any,
    actionMenuName : string
};

const isAssetExpired = (evidence?: any) => {
    if (evidence) {
        let date: Date;
        if (evidence.holdUntill)
            date = moment(evidence.holdUntill).toDate();
        else
            date = moment(evidence.expireOn).toDate();

        if (moment(date).format('DD-MM-YYYY') == "31-12-9999")    
            return false;
        if (AssetRetentionFormat(date) == "Asset Expired")
            return true;
    }
    return false;
}

const CheckAssetExpiry: React.FunctionComponent<Props> = ({ evidence, actionMenuName, children }) => {

    if(!isAssetExpired(evidence)  || actionMenuName === "Assign User" )
    {
        return <>{children}</>;
    }

    return null;
};

export default CheckAssetExpiry;