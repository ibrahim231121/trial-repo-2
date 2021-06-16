import React, { useState,useContext } from "react";
import { CRXSelectBox,CRXInputDatePicker,CRXButton ,CRXTooltip} from "@cb/shared";

import { DateContext } from "./DateContext";

type Props = {
  dropDownCustomValue: (v: any) => void;
  minDate?:string;
  maxDate?:string;
  showChildDropDown:boolean;
dateOptions:any
};

const DatePickerIcon: React.FC<Props> = ({dropDownCustomValue , minDate,maxDate,showChildDropDown, dateOptions }) => {
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  const {
    setStartDateValue,
    setEndDateValue,
    setSelectedOption,
    selectedOptionValue,
    startDate,
    endDate,defaultValue
  } = useContext(DateContext);
  React.useEffect(() => {
    if (selectedOptionValue === "custom" && startDate && endDate) {
      dropDownCustomValue("customRange");
    }
  }, [startDate, endDate]);
  const onChange = (e: any) => {
    const { value } = e.target;
    setSelectedOption(value,dateOptions);
    dropDownCustomValue(value)
  };


  const onClear = () => {
    setStartDateValue("");
    setEndDateValue("");
  //       if(dateOptions && dateOptions.length > 0 ){
  //     let firstOption = dateOptions[0]
  //     setSelectedOption(firstOption.value, dateOptions)
  // }
  setSelectedOption(defaultValue,dateOptions)
};

  return (
    <div className="calenderContent">
      <div className="calenderDTP">
        <CRXInputDatePicker
          value={startDate.split("+")[0]}
          type="datetime-local"
          // defaultValue={startDate.split("+")[0]}
          onChange={(e: any) => {
            setSelectedOption("custom",dateOptions)
            setStart(e.target.value)
            setStartDateValue(e.target.value)}}
            minDate={minDate}
            maxDate={maxDate}
        />

        <div className="centerContent">to</div>
        <CRXInputDatePicker
          value={endDate.split("+")[0]}
          type="datetime-local"
          // defaultValue={endDate.split("+")[0]}
          onChange={(e: any) => {
            setSelectedOption("custom",dateOptions)
            setEndDateValue(e.target.value)}}
            minDate={minDate}
            maxDate={maxDate}
        />
      </div>

    {showChildDropDown &&   <div className="selectBoxContent">
        <CRXSelectBox
          value={selectedOptionValue}
          defaultOption={false}
          // defaultValue={selectedOptionValue}
          onChange={onChange}
          options={dateOptions}
          className="daysSelection"
        />
        <CRXTooltip title="Select from pre-selection" placement="right" />
      </div>}

      <div className="paperFooter" style={{marginTop:"25%"}}>
        <CRXButton className="clearButton" color="primary" variant="contained" onClick={onClear}>
          Reset to default
        </CRXButton>
      </div>
    </div>
  );
};

export default DatePickerIcon;
