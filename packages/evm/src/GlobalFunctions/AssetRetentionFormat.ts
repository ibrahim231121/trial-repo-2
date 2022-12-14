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
                differenceInString = years + " Year(s) " + " " + months + " Month(s)";
                break;
            case diffInDays < 365 && diffInDays > 30:
                months = Math.floor(diffInDays % 365 / 30);
                days = Math.floor(diffInDays % 365 % 30);
                differenceInString = months + " Month(s)" + " " + days + " Day(s)"
                break;
            case diffInDays < 30 && diffInDays > 0:
                differenceInString = diffInDays + " Day(s) " + " " + diffInHours + " Hour(s) "
                break;
            case diffInDays <= 0 && diffInHours > 0:
                differenceInString = diffInHours + " Hour(s) "
                break;

            default:
                differenceInString = " 1 Hour(s) "
        }

        return differenceInString;
    }
    return 'Asset Expired';
};

// const CalculateRetentionSpan = (expiration: moment.Moment): string => {
//     debugger;
//     const now = moment().local();
//     if (now < expiration) {
//         const diff = expiration.diff(now);
//         const diffDuration: any = moment.duration(diff);
//         let differenceInString = "";
//         if (diffDuration._data.days != 0)
//             differenceInString = diffDuration._data.days + " Day(s) ";
//         if (diffDuration._data.hours != 0)
//             differenceInString = differenceInString + diffDuration._data.hours + " Hour(s) ";
//         if (diffDuration._data.minutes != 0)
//             differenceInString = differenceInString + diffDuration._data.minutes + " Minute(s)"
//         return differenceInString;
//     }
//     return 'Asset Expired';
// };
export { AssetRetentionFormat, CalculateRetentionSpan };
