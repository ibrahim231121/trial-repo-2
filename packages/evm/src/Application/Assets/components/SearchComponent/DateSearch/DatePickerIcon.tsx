import React, { useState, useContext } from "react";
import { CRXDateTimePicker, CRXButton } from "@cb/shared";
import { DateContext } from "../DateContext";
import { CRXDropDown, CRXTooltip } from "@cb/shared";
import { CRXSelectBox } from "@cb/shared";
import { dateOptions } from "../../../../../utils/constant";

type Props = {
  onClose: () => void;
};

const DatePickerIcon: React.FC<Props> = ({ onClose }) => {
  const {
    setStartDateValue,
    setEndDateValue,
    setSelectedOption,
    selectedOptionValue,
    startDate,
    endDate,
  } = useContext(DateContext);

  const onChange = (e: any) => {
    setSelectedOption(e.target.value);
  };
  return (
    <div className="calenderContent">
      <div className="calenderDTP">
        <CRXDateTimePicker
          date={startDate.split("+")[0]}
          onChange={(e: any) => setStartDateValue(e.target.value)}
        />

        <div className="centerContent">to</div>
        <CRXDateTimePicker
          date={endDate.split("+")[0]}
          onChange={(e: any) => setEndDateValue(e.target.value)}
        />
      </div>

      <div className="selectBoxContent">
        <CRXSelectBox
          value={selectedOptionValue}
          onChange={onChange}
          options={dateOptions}
        />
        <CRXTooltip title="Select from pre-selection" placement="right"/>
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
