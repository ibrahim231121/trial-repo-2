import React from "react";
import moment from "moment";
import momentTz from 'moment-timezone';
import timezone from '../Application/Admin/SetupAndConfiguration/Timezones.json'

export const dateDisplayFormat = (dateTime: string) => {

  if (dateTime === null || dateTime == "")
    return 'N/A';

  const localDateTime = moment(dateTime)
    .local()
    .format("YYYY / MM / DD HH:mm:ss");
  return localDateTime
};


export const dateTimeSelectedZoneFormat = (dateTime: string, dateTimeZone: string, dateFormat: string) => {

  if(dateFormat == "AM/PM")
    dateFormat = "YYYY/MM/DD hh:mm:ss A"
  else if(dateFormat == "24hour")
    dateFormat = "YYYY/MM/DD HH:mm:ss"
  else if(dateFormat == "Military")
    dateFormat = "DDHHmm(Z)MMMYY"

  var item = timezone.filter(x => x.value == dateTimeZone)[0]
  var utcCutoff = momentTz.utc(dateTime, 'YYYY/MM/DD HH:mm:ss');
  var displayCutoff = utcCutoff.clone().tz(item.utc[0]);

  console.log('utcCutoff:', utcCutoff.format(dateFormat)); 
  console.log('displayCutoff:', displayCutoff.format(dateFormat));
};

export const dateTimeLocalZoneFormat = (dateTime: string, dateFormat: string) => {

  if(dateFormat == "AM/PM")
    dateFormat = "YYYY/MM/DD hh:mm:ss A"
  else if(dateFormat == "24hour")
    dateFormat = "YYYY/MM/DD HH:mm:ss"
  else if(dateFormat == "Military")
    dateFormat = "DDHHmm(Z)MMMYY"

  console.log(dateTime); 
  var stillUtc = moment.utc(dateTime, 'YYYY/MM/DD HH:mm:ss').toDate();
  var localDateTime = moment(stillUtc).local().format(dateFormat);
  console.log(localDateTime);

  moment.locale('en-GB')
  console.log(moment.locale('en-GB'));

  var formatL = moment.localeData().longDateFormat('LLLL');
  var x = moment.utc(localDateTime, 'YYYY/MM/DD HH:mm:ss').format(formatL);
  console.log("x",x);

  console.log(moment(moment.utc(localDateTime, 'YYYY/MM/DD HH:mm:ss').toDate(), 'L').format());
  // m.isValid()
  // m.format()

  //return localDateTime
};