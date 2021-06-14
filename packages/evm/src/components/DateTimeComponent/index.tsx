import React from "react";
import { DateContextProvider } from "./DateContext";
import DateTime from "./DateTime";
type Props = {
  getStartDate: (v: string) => void;
  getEndDate: (v: string) => void;
  minDate?: string;
  showChildDropDown?: boolean;
  maxDate?: string;
  defaultValue?: string;
  disabled?: boolean;
  dateOptions: any;
};
const DateTimeComponent: React.FC<Props> = ({
  getStartDate,
  getEndDate,
  minDate,
  maxDate,
  showChildDropDown,
  disabled,
  dateOptions, defaultValue
}) => {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  React.useEffect(() => {
    getStartDate(startDate);
    getEndDate(endDate);
  }, [endDate, startDate]);

  return (
    <DateContextProvider>
      <DateTime
        getStartDate={(val: any) => setStartDate(val)}
        getEndDate={(val: any) => setEndDate(val)}
        minDate={minDate}
        maxDate={maxDate}
        showChildDropDown={showChildDropDown ? false : true}
        disabled={disabled}
        dateOptions={dateOptions}
        defaultValue={defaultValue?defaultValue:"last 30 days"}
      />
    </DateContextProvider>
  );
};

export default DateTimeComponent;
