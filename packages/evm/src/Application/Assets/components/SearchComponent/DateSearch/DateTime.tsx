import React from "react";
import DatePickerIcon from "./DatePickerIcon";
import { CRXDropDown, CRXSelectBox, CRXDropContainer } from "@cb/shared";
import { dateOptions } from "../../../../../utils/constant";
import "./DateTime.scss";
import { DateContext } from "../DateContext";

const DateTime: React.FC = () => {
  const { setSelectedOption, selectedOptionValue } =
    React.useContext(DateContext);

  const [open, setOpen] = React.useState(false);
  const [dropDownValue, setDropDownValue] = React.useState(null);

  const onSelectionChange = (e: any) => {
    const { value } = e.target;
    setSelectedOption(value);
  };
  const data = (
    <DatePickerIcon
      onClose={() => setOpen(false)}
      dropDownCustomValue={(v: any) => setDropDownValue(v)}
    />
  );
  console.log(dropDownValue);
  const img = <i className="far fa-calendar-alt"></i>;
  return (
    <div className="dateRangeContainer">
      <label className="dateTimeLabel">Date and Time</label>
      <CRXDropDown
        value={selectedOptionValue}
        onChange={onSelectionChange}
        options={dateOptions}
      >
        <CRXDropContainer
          icon={img}
          content={data}
          className="dateRangeButton"
          paperClass="CRXDateRange"
        />
      </CRXDropDown>
    </div>
  );
};

export default DateTime;
