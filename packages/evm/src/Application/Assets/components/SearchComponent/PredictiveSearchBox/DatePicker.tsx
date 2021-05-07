import React, { useState, useEffect } from "react";
import { CRXDateTimePicker, CRXButton } from "@cb/shared";
type Props = {
  onClose: () => void;
  selectedOption?: any;
  endDate: Object | undefined;
  startDate: Object | undefined;
  searchStartDate: (e: any) => void;
  searchEndDate: (e: any) => void;
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

const DatePicker: React.FC<Props> = ({
  onClose,
  endDate,
  startDate,
  searchStartDate,
  searchEndDate,
}) => {
  const [StartDate, setStartDate] = useState(startDate);
  const [EndDate, setEndDate] = useState(endDate);

React.useEffect(() => {
    setStartDate(startDate)
    setEndDate(endDate);
    console.log("Use Effect");
}, [startDate,endDate])
  console.log(" Start Date = ", startDate);
  console.log("End date ", endDate);
  return (
    <div>
      <div className="calenderDTP">
        <CRXDateTimePicker
          date={startDate}
          onChange={(e: any) => searchStartDate(e.target.value)}
        />
        <div className="centerContent">to</div>
        <CRXDateTimePicker
          date={endDate}
          onChange={(e: any) => searchEndDate(e.target.value)}
        />
      </div>
      <div className="paperFooter">
        <CRXButton className="clearButton" onClick={onClose}>Clear</CRXButton>
      </div>
    </div>
  );
};

export default DatePicker;
