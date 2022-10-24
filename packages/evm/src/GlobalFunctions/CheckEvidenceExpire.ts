import moment from 'moment';
import { AssetRetentionFormat } from '../GlobalFunctions/AssetRetentionFormat';

const CheckEvidenceExpire = (evidence?: any) => {
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

export { CheckEvidenceExpire };
