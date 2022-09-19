import React from "react";
import moment from "moment";

const dateDisplayFormat = (dateTime: string) => {

  if (dateTime === null)
    return 'Error retrieving login data';

  const localDateTime = moment(dateTime)
    .local()
    .format("YYYY / MM / DD HH:mm:ss");
  return localDateTime
};

export default dateDisplayFormat;