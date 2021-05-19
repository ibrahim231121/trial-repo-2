import React, { useState, useContext } from "react";
import { CRXDateTimePicker, CRXButton } from "@cb/shared";
import { DateContext } from "../DateContext";
import { CRXSelectBox } from "@cb/shared";
import { dateOptions } from "../../../../../utils/constant";
type Props = {
  onClose: () => void;
  selectedOption?: any;
  endDate: Object | undefined;
  startDate: Object | undefined;
};
const getDate = (type: string) => {
  switch (type) {
    case "yesterday":
      return ((d) => new Date(d.setDate(d.getDate() - 1)))(
        new Date()
      ).toISOString();
      break;
    case "today":
      return new Date().toISOString();
      break;
    case "last 7 days":
      return ((d) => new Date(d.setDate(d.getDate() - 7)))(
        new Date()
      ).toISOString();
      break;
    case "last 30 days":
      return ((d) => new Date(d.setDate(d.getDate() - 30)))(
        new Date()
      ).toISOString();
      break;
    case "current calendar month":
      return new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toISOString();
      break;
    case "last calendar month":
      return ((d) => new Date(d.setDate(d.getDate() - 30)))(
        new Date()
      ).toISOString();
      break;
    case "custom":
      return "custom";
      break;
    default:
      return new Date().toISOString();
  }
};

const DatePickerIcon: React.FC<Props> = ({ onClose, endDate, startDate }) => {
  const {
    setStartDateValue,
    setEndDateValue,
    setSelectedOption,
    selectedOptionValue,
  } = useContext(DateContext);
  const [StartDate, setStartDate] = useState(startDate);
  const [EndDate, setEndDate] = useState(endDate);
  const [selectOption, setSelectOption] = React.useState("");

  React.useEffect(() => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, [startDate, endDate]);

  const onChange = (e: any) => {
    setSelectedOption(e.target.value);
  };
  return (
    <div>
      <div className="calenderDTP">
        <CRXDateTimePicker
          date={startDate}
          onChange={(e: any) => setStartDateValue(e.target.value)}
        />
        <div className="centerContent">to</div>
        <CRXDateTimePicker
          date={endDate}
          onChange={(e: any) => setEndDateValue(e.target.value)}
        />
      </div>

      <div>
        <CRXSelectBox
          value={selectedOptionValue}
          onChange={onChange}
          options={dateOptions}
        />
      </div>

      <div className="paperFooter">
        <CRXButton className="clearButton" onClick={onClose}>
          Clear
        </CRXButton>
      </div>
    </div>
  );
};

export default DatePickerIcon;
