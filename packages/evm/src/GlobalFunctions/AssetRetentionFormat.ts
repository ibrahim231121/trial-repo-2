import moment from 'moment';

const AssetRetentionFormat = (dateTime: string) => {
    const stillUtc = moment.utc(dateTime).toDate();
    if (dateTime === null) return 'Error retrieving login data';

    const localDateTime = moment(stillUtc).local().format('YYYY / MM / DD HH:mm:ss');
    return CalculateHoldUntill(localDateTime);
};

const CalculateHoldUntill = (dateTime: string): string => {
    const now = moment();
    const expiration = moment(dateTime).utc();
    if (now < expiration) {
        const diff = expiration.diff(now);
        const diffDuration = moment.duration(diff);
        let DifferenceInString;
        if (diffDuration.days() > 1) {
            DifferenceInString = `${diffDuration.days()} Days ${diffDuration.hours()} Hours`;
        } else {
            DifferenceInString = `${diffDuration.hours()} Hours`;
        }
        return DifferenceInString.toString();
    }
    return 'Asset Expired';
};
export {AssetRetentionFormat, CalculateHoldUntill} ;
