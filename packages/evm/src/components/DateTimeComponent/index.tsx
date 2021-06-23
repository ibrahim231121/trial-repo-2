import React from "react";
import { DateContextProvider } from "./DateContext";
import DateTime from "./DateTime";
type Props = {
  getStartDate: (v: string) => void;
  getEndDate: (v: string) => void;
  getSelectedDateOptionValue:(v: string) => void;
  minDate?: string;
  showChildDropDown?: boolean;
  maxDate?: string;
  defaultValue?: string;
  disabled?: boolean;
  reset?: boolean;
  dateOptions: any;
};
const DateTimeComponent: React.FC<Props> = ({
  getStartDate,
  getEndDate,getSelectedDateOptionValue,
  minDate,
  maxDate,
  showChildDropDown,
  disabled,
  dateOptions, defaultValue,reset=false
}) => {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState("");

  React.useEffect(() => {
    getStartDate(startDate);
    getEndDate(endDate);
    getSelectedDateOptionValue(selectedValue)
  }, [endDate, startDate,selectedValue]);
 
 

  return (
    <DateContextProvider>
      <DateTime
        reset={reset}
        getStartDate={(val: any) => setStartDate(val)}
        getEndDate={(val: any) => setEndDate(val)}
        minDate={minDate}
        maxDate={maxDate}
        showChildDropDown={showChildDropDown ? false : true}
        disabled={disabled}
        dateOptions={dateOptions}
        defaultValue={defaultValue?defaultValue:"last 30 days"}
        getSelectedDateOptionValue={val=>setSelectedValue(val)}
      />
    </DateContextProvider>
  );
};

export default DateTimeComponent;
