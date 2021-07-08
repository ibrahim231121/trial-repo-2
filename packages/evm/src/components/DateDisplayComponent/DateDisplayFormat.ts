import React from "react";
import moment from "moment";

const dateDisplayFormat = (dateTime: string) => {
  const stillUtc = moment.utc(dateTime).toDate();
  const localDateTime = moment(stillUtc)
    .local()
    .format("YYYY / MM / DD HH:mm:ss");
  return localDateTime
};

export default dateDisplayFormat;
