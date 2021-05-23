import React from "react";
import DatePickerIcon from "./DatePickerIcon";
import { CRXDropDown, CRXSelectBox, CRXDropContainer } from "@cb/shared";
import { dateOptions } from "../../../../../utils/constant";
import "./DateTime.scss";
import { DateContext } from "../DateContext";

const DateTime: React.FC = () => {
  const { setSelectedOption, selectedOptionValue ,endDate , startDate } =
    React.useContext(DateContext);

  const [open, setOpen] = React.useState(false);
  const [dropDownValue, setDropDownValue] = React.useState(null);
  const [dateOptionsState, setDateOptionsState] = React.useState(dateOptions);

  const onSelectionChange = (e: any) => {
    const { value } = e.target;
    setSelectedOption(value);
  };




  const setDropDownValueFunction=(v:any)=>{
    const find = dateOptionsState.filter(x=>x.value!=="customRange")

    if (v==="customRange") {
      setDropDownValue(v)
      find.push({value: "customRange", displayText: `${startDate} - ${endDate}`})
      setDateOptionsState(find)
    }
   else{
    setDateOptionsState(dateOptions)
    setSelectedOption(v)
    setDropDownValue(null)

   }
  }

  const data = (
    <DatePickerIcon
      onClose={() => setOpen(false)}
      dropDownCustomValue={(v: any) => setDropDownValueFunction(v)}
    />
  );
  const img = <i className="far fa-calendar-alt"></i>;
  return (
    <div className="dateRangeContainer">
      <label className="dateTimeLabel">Date and Time</label>
      <CRXDropDown
        value={dropDownValue?dropDownValue:selectedOptionValue}
        onChange={onSelectionChange}
        options={dateOptionsState}
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
