import React, { useState,useContext } from "react";
import { CRXDateTimePicker, CRXButton, TextField } from "@cb/shared";
import { DateContext } from "../DateContext";
import { CRXTooltip } from "@cb/shared";
import { CRXSelectBox } from "@cb/shared";
import { dateOptions } from "../../../../../utils/constant";

type Props = {
  onClose: () => void;
  dropDownCustomValue: (v: any) => void;
};

const DatePickerIcon: React.FC<Props> = ({ onClose, dropDownCustomValue }) => {
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  const {
    setStartDateValue,
    setEndDateValue,
    setSelectedOption,
    selectedOptionValue,
    startDate,
    endDate,
  } = useContext(DateContext);
  React.useEffect(() => {
    if (selectedOptionValue === "custom" && startDate && endDate) {
      dropDownCustomValue("customRange");
    }
  }, [startDate, endDate]);
  const onChange = (e: any) => {
    const { value } = e.target;
    dropDownCustomValue(value)
    setSelectedOption(value);
  };


  const onClear = () => {
    setStartDateValue("");
    setEndDateValue("");
    setSelectedOption("");
  };

  return (
    <div className="calenderContent">
      <div className="calenderDTP">
        <TextField
          value={startDate.split("+")[0]}
          type="datetime-local"
          defaultValue={startDate.split("+")[0]}
          onChange={(e: any) => {
            setSelectedOption("custom")
            setStart(e.target.value)

            setStartDateValue(e.target.value)}}
        />

        <div className="centerContent">to</div>
        <TextField
          value={endDate.split("+")[0]}
          type="datetime-local"
          defaultValue={endDate.split("+")[0]}
          onChange={(e: any) => {
            setSelectedOption("custom")
            setEnd(e.target.value)
            setEndDateValue(e.target.value)}}
        />
      </div>

      <div className="selectBoxContent">
        <CRXSelectBox
          value={selectedOptionValue}
          defaultValue={selectedOptionValue}
          onChange={onChange}
          options={dateOptions}
          className="daysSelection"
        />
        <CRXTooltip title="Select from pre-selection" placement="right" />
      </div>

      <div className="paperFooter">
        <CRXButton className="clearButton" onClick={onClear}>
          Clear
        </CRXButton>
      </div>
    </div>
  );
};

export default DatePickerIcon;
