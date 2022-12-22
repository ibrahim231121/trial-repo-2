import moment from 'moment';
const AssetRetentionFormat = (dateTime: Date) => {
    const dateTimeObj = moment(dateTime).local();
    if (dateTime === null) return 'Error retrieving login data';
    return CalculateRetentionSpan(dateTimeObj);
};

const CalculateRetentionSpan = (expiration: moment.Moment): string => {
    const now = moment().local();
    if (now < expiration) {
        const diffInDays = expiration.diff(now, 'days');
        const diffInHours =   expiration.diff(now, 'hours') - (diffInDays * 24);
        // const diffDuration: any = moment.duration(diff);
        let differenceInString = "";
        let years, months, days: number;
        switch (true) {
            case diffInDays > 365:
                years = Math.floor(diffInDays / 365);
                months = Math.floor(diffInDays % 365 / 30);
                differenceInString = years + " Year(s) " + " " + (months > 0 ? months + " Month(s)" : "");
                break;
            case diffInDays < 365 && diffInDays > 30:
                months = Math.floor(diffInDays % 365 / 30);
                days = Math.floor(diffInDays % 365 % 30);
                differenceInString = months + " Month(s)" + " " + (days > 0 ? days + " Day(s)" : "")
                break;
            case diffInDays < 30 && diffInDays > 0:
                differenceInString = diffInDays + " Day(s) " + " " + (diffInHours > 0 ? diffInHours + " Hour(s) " : "")
                break;
            case diffInDays <= 0 && diffInHours > 0:
                differenceInString = diffInHours + " Hour(s) "
                break;
            default:
                differenceInString = " 1 Hour(s) "
        }

        return differenceInString;
    }
    return 'Expired';
};
export { AssetRetentionFormat, CalculateRetentionSpan };
