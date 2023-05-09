import moment from 'moment';
import { CMTEntityRecord } from '../utils/Api/models/CommonModels';
const AssetRetentionFormat = (dateTime: Date) => {
    const dateTimeObj = moment(dateTime).local();
    if (dateTime === null) return 'Error retrieving login data';
    return CalculateRetentionSpan(dateTimeObj);
};

const CalculateRetentionSpan = (expiration: moment.Moment): string => {
    const now = moment().local();
    if (now < expiration) {
        const differenceInString = RetentionDateTimeFormatter(now, expiration);
        return differenceInString;
    }
    return 'Expired';
};

const RetentionDateTimeFormatter = (now :  moment.Moment, expiration: moment.Moment) => {
    const difference = moment.duration(expiration.diff(now));
    const diffInDays = Math.round(difference.asDays());
    const diffInHours = difference.asHours() - (diffInDays * 24);
    let differenceInString = "";
    let years, months, days: number;
    switch (true) {
        case diffInDays > 365:
            years = Math.floor(diffInDays / 365);
            months = Math.floor(diffInDays / 30.42);
            differenceInString = years + " Year(s) " + " " + (months > 0 ? months + " Month(s)" : "");
            break;
        case diffInDays <= 365 && diffInDays > 31:
            months = Math.floor(diffInDays / 30.42);
            days = Math.floor(diffInDays - (months * 30.42));
            differenceInString = months + " Month(s)" + " " + (days > 0 ? days + " Day(s)" : "")
            break;
        case diffInDays <= 31 && diffInDays > 0:
            differenceInString = Math.floor(diffInDays) + " Day(s) " + " " + (diffInHours > 0 ? Math.floor(diffInHours) + " Hour(s) " : "")
            break;
        case diffInDays <= 0 && diffInHours > 0:
            differenceInString = Math.floor(diffInHours) + " Hour(s) "
            break;
        default:
            differenceInString = " 1 Hour(s) "
    }
    return differenceInString;
}

const ExtractHoursFromCMTEntityRecord = (param: CMTEntityRecord): { totalHours: number; retentionId: number } => {
    const Hours = param.record.filter((x) => x.key === 'Hours')[0].value;
    const GracePeriodHours = param.record.filter((x) => x.key === 'GracePeriodHours')[0].value;
    const _totalHours = parseInt(Hours) + parseInt(GracePeriodHours);
    const _retentionId = param.cmtFieldValue;
    return {
        totalHours: _totalHours,
        retentionId: _retentionId
    };
};
  
export { AssetRetentionFormat, CalculateRetentionSpan, RetentionDateTimeFormatter, ExtractHoursFromCMTEntityRecord };
