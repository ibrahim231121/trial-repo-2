import React, { useState,useContext } from "react";
import { CRXSelectBox,CRXInputDatePicker,CRXButton ,CRXTooltip} from "@cb/shared";

import { DateContext } from "./DateContext";
import { dateOptions } from "../../utils/constant";

type Props = {
  onClose: () => void;
  dropDownCustomValue: (v: any) => void;
  minDate?:string;
  maxDate?:string;
  showChildDropDown:boolean
};

const DatePickerIcon: React.FC<Props> = ({ onClose, dropDownCustomValue,minDate,maxDate,showChildDropDown }) => {
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
        <CRXInputDatePicker
          value={startDate.split("+")[0]}
          type="datetime-local"
          defaultValue={startDate.split("+")[0]}
          onChange={(e: any) => {
            setSelectedOption("custom")
            setStart(e.target.value)
            setStartDateValue(e.target.value)}}
            minDate={minDate}
            maxDate={maxDate}
        />

        <div className="centerContent">to</div>
        <CRXInputDatePicker
          value={endDate.split("+")[0]}
          type="datetime-local"
          defaultValue={endDate.split("+")[0]}
          onChange={(e: any) => {
            setSelectedOption("custom")
            setEnd(e.target.value)
            setEndDateValue(e.target.value)}}
            minDate={minDate}
            maxDate={maxDate}
        />
      </div>

    {showChildDropDown &&   <div className="selectBoxContent">
        <CRXSelectBox
          value={selectedOptionValue}
          defaultValue={selectedOptionValue}
          onChange={onChange}
          options={dateOptions}
          className="daysSelection"
        />
        <CRXTooltip title="Select from pre-selection" placement="right" />
      </div>}

      <div className="paperFooter">
        <CRXButton className="clearButton" color="primary" variant="contained" onClick={onClear}>
          Reset to default
        </CRXButton>
      </div>
    </div>
  );
};

export default DatePickerIcon;
