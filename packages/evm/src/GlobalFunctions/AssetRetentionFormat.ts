import moment from 'moment';
const AssetRetentionFormat = (dateTime: Date) => {
    const dateTimeObj = moment(dateTime).local();
    if (dateTime === null) return 'Error retrieving login data';
    return CalculateRetentionSpan(dateTimeObj);
};

const CalculateRetentionSpan = (expiration: moment.Moment): string => {
    const now = moment().local();
    if (now < expiration) {
        const diff = expiration.diff(now);
        const diffDuration = moment.duration(diff);
        let differenceInString;
        if (diffDuration.asDays() > 1) {
            let hours = diffDuration.asHours();
            let days = hours / 24;
            let remainingHours = days % 24;
            differenceInString = `${Math.round(days)} Days ${Math.round(remainingHours)} Hours`;
        } else {
            differenceInString = `${diffDuration.asHours()} Hours`;
        }
        return differenceInString.toString();
    }
    return 'Asset Expired';
};
export {AssetRetentionFormat, CalculateRetentionSpan} ;
