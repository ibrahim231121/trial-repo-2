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
        const diffDuration: any = moment.duration(diff);
        let differenceInString = "";
        if (diffDuration._data.days != 0)
            differenceInString = diffDuration._data.days + " Day(s) ";
        if (diffDuration._data.hours != 0)
            differenceInString = differenceInString + diffDuration._data.hours + " Hour(s) ";
        if (diffDuration._data.minutes != 0)
            differenceInString = differenceInString + diffDuration._data.minutes + " Minute(s)"
        return differenceInString;
    }
    return 'Asset Expired';
};
export { AssetRetentionFormat, CalculateRetentionSpan };
