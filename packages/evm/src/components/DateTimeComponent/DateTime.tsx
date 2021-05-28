import React, { useEffect } from "react";
import DatePickerIcon from "./DatePickerIcon";
import { CRXDropDown, CRXSelectBox, CRXDropContainer } from "@cb/shared";
import { dateOptions } from "../../utils/constant";
import "./DateTime.scss";
import { DateContext } from "./DateContext";
type Props = {
  getStartDate: (v: string) => void;
  getEndDate: (v: string) => void;
};
const DateTime: React.FC<Props> = ({ getStartDate, getEndDate }) => {
  const {
    setSelectedOption,
    selectedOptionValue,
    endDate,
    startDate,
    setStartDateValue,
    setEndDateValue,
  } = React.useContext(DateContext);

  const [open, setOpen] = React.useState(false);
  const [dropDownValue, setDropDownValue] = React.useState(null);
  const [dateOptionsState, setDateOptionsState] = React.useState(dateOptions);
  const [state, setstate] = React.useState(false);
  const popupRef = React.useRef<HTMLDivElement>(null);

  const onSelectionChange = (e: any) => {
    const { value } = e.target;
    if (value === "custom") {
      setStartDateValue("");
      setEndDateValue("");
    } else {
      const find = dateOptionsState.filter((x) => x.value !== "customRange");
      setDateOptionsState(find);
      setDropDownValue(null);
    }
    setSelectedOption(value);
  };

  React.useEffect(() => {
    getStartDate(startDate);
    getEndDate(endDate);
  }, [endDate, startDate]);
  
  const outSideClickContainer = (e: MouseEvent) => {
    // debugger;
    // const { current: wrap } = popupRef;
    // if (
    //   popupRef.current !== null &&
    //   !popupRef.current.contains(e.target as HTMLElement)
    // ) {
    //   setstate(false);
    // }
  };

  React.useEffect(() => {
    window.addEventListener("mousedown", outSideClickContainer);
    return () => {
      window.removeEventListener("mousedown", outSideClickContainer);
    };
  }, []);

  const setDropDownValueFunction = (v: any) => {
    const find = dateOptionsState.filter((x) => x.value !== "customRange");
    if (v === "customRange") {
      setDropDownValue(v);
      find.push({
        value: "customRange",
        displayText: `${startDate} - ${endDate}`,
      });
      setDateOptionsState(find);
    } else {
      setDateOptionsState(dateOptions);
      setSelectedOption(v);
      setDropDownValue(null);
    }
  };

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
        value={dropDownValue ? dropDownValue : selectedOptionValue}
        onChange={onSelectionChange}
        options={dateOptionsState}
        disabled={state}
      >
        <CRXDropContainer
          icon={img}
          content={data}
          className="dateRangeButton"
          paperClass="CRXDateRange"
          onClick={() => setstate(!state)}
          paperState={state}
          ref={popupRef}
        />
      </CRXDropDown>
    </div>
  );
};

export default DateTime;
