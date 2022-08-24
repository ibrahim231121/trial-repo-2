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
        let differenceInHours = diffDuration.asHours();  
        return (`${ Math.round(differenceInHours / 24) } Days ${ Math.round(differenceInHours % 24)} Hours`).toString();
    }else{
        return 'Asset Expired';
    }
};
export {AssetRetentionFormat, CalculateHoldUntill} ;
