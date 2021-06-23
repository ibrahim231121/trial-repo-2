import React, { useEffect } from "react";
import DatePickerIcon from "./DatePickerIcon";
import { CRXDropDown, CRXSelectBox, CRXDropContainer } from "@cb/shared";
//import { dateOptions } from "../../utils/constant";
import "./DateTime.scss";
import { DateContext } from "./DateContext";
import { convertTimeToAmPm } from "../../utils/convertTimeToAmPm";
type Props = {
  getStartDate: (v: string) => void;
  getEndDate: (v: string) => void;
  getSelectedDateOptionValue:(v: string) => void;
  minDate?: string;
  maxDate?: string;
  defaultValue?: string;
  reset: boolean;
  showChildDropDown: boolean;
  disabled?: boolean;
  dateOptions: any
};
const DateTime: React.FC<Props> = ({
  getStartDate,
  getEndDate,
  getSelectedDateOptionValue,
  minDate,
  maxDate,
  showChildDropDown,
  disabled,
  dateOptions, defaultValue,reset
}) => {
  const {
    setSelectedOption,
    selectedOptionValue,
    endDate,
    startDate,
    setStartDateValue,
    setEndDateValue,setDefaultValue
  } = React.useContext(DateContext);
  const ref: any = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [openContainerState, setOpenContainerState] = React.useState(false);

  const [dropDownValue, setDropDownValue] = React.useState(null);
  const [dateOptionsState, setDateOptionsState] = React.useState(dateOptions);

  //runs only on mount
  React.useEffect(() => {
    if (dateOptions && dateOptions.length > 0) {
      let firstOption = dateOptions[0]
      setDateOptionsState(dateOptions);
      setSelectedOption(defaultValue, dateOptions)
    }
    if (defaultValue) {
      setDefaultValue(defaultValue)
    }
  }, []);
  useEffect(() => {
    if (reset) {
    setSelectedOption(defaultValue, dateOptions)
    }
  }, [reset])
  //runs when start date or end date changes
  React.useEffect(() => {
    getStartDate(startDate);
    getEndDate(endDate);
    getSelectedDateOptionValue(selectedOptionValue)
  }, [endDate, startDate,selectedOptionValue]);


  const onSelectionChange = (e: any) => {
    const { value } = e.target;
    if (value === "custom") {
      setStartDateValue("");
      setEndDateValue("");
      setOpenContainerState(true);
    }
    else {
      const find = dateOptionsState.filter((x: any) => x.value !== "customRange");
      setDateOptionsState(find);
      setDropDownValue(null);
    }
    setSelectedOption(value, dateOptions);
  };

  React.useEffect(() => {
    getStartDate(startDate);
    getEndDate(endDate);
  }, [endDate, startDate]);

  React.useEffect(() => {
    if (dateOptions && dateOptions.length > 0) {
      let firstOption = dateOptions[0]
      setDateOptionsState(dateOptions);
      setSelectedOption(defaultValue, dateOptions)
    }
  }, [dateOptions]);


  const convertDateTime = (date: string) => {
    const newDate = date.split("T");
    const [yy, mm, dd] = newDate[0].split("-");
    newDate[0] = `${mm}/${dd}/${yy}`;
    newDate[1] = convertTimeToAmPm(newDate[1]);
    return newDate;
  };
  const setDropDownValueFunction = (v: any) => {
    const find = dateOptionsState.filter((x: any) => x.value !== "customRange");
    if (v === "customRange") {
      setDropDownValue(v);
      const newStartDateTime = convertDateTime(startDate);
      const newEndDateTime = convertDateTime(endDate);
      find.push({
        value: "customRange",
        displayText: `${newStartDateTime[0]}  ${newStartDateTime[1]}  -  ${newEndDateTime[0]}   ${newEndDateTime[1]} `,
      });
      setDateOptionsState(find);
    } else {
      setDateOptionsState(dateOptions);
      setSelectedOption(v, dateOptions);
      setDropDownValue(null);
    }
  };

  const data = (
    <DatePickerIcon
      dropDownCustomValue={(v: any) => setDropDownValueFunction(v)}
      minDate={minDate}
      maxDate={maxDate}
      showChildDropDown={showChildDropDown}
      dateOptions={dateOptions}
    />
  );
  const img = <i className="far fa-calendar-alt"></i>;
  return (
    <div className="dateRangeContainer" ref={ref}>
      <CRXDropDown
        value={dropDownValue ? dropDownValue : selectedOptionValue}
        onChange={onSelectionChange}
        options={dateOptionsState}
        disabled={disabled}
      >
        <CRXDropContainer
          icon={img}
          content={data}
          openState={openContainerState}
          stateStatus={(a: any) => setOpenContainerState(a)}
        />
      </CRXDropDown>
    </div>
  );
};

export default DateTime;
