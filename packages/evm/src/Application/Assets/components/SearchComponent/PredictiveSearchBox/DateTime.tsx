import React from "react";
import { CRXDropDown, CRXDateRangePicker, CRXModal } from "@cb/shared";
import TodayIcon from "@material-ui/icons/Today";
import "./DateTime.scss";
import DatePicker from "./DatePicker";
import moment from "moment";
type Props = {
  searchStartDate: (e: any) => void;
  searchEndDate: (e: any) => void;
};
const DateTime: React.FC<Props> = ({ searchStartDate, searchEndDate }) => {
  const [selectOption, setSelectOption] = React.useState("Please Select");
  const [startDate, setStartDate] = React.useState<any>("");
  const [endDate, setEndDate] = React.useState<string>("");

  const [open, setOpen] = React.useState(false);
  const dateOptions = [
    { value: "today", displayText: "today " },
    { value: "yesterday", displayText: " yesterday" },
    { value: "last 7 days", displayText: "last 7 days" },
    { value: "last 30 days", displayText: "last 30 days" },
    { value: "current calendar month", displayText: "current calendar month" },
    { value: "last calendar month", displayText: "last calendar month" },
    { value: "custom", displayText: "custom" },
  ];

  const onSelctionCahnge = (e: any) => {
    console.log("Moment Date = " , moment());
    const { value } = e.target;
    setSelectOption(value);

    switch (value) {
      case "Please Select":
        setStartDate("");
        setEndDate("");
        break;

      case "today":
        setStartDate(
          new Date(new Date().setHours(0, 0, 0, 0)).toISOString().split(".")[0]
        );
        setEndDate(new Date().toISOString().split(".")[0]);
        break;

      case "yesterday":
        const date = ((d) => new Date(d.setDate(d.getDate() - 1)))(new Date());
        setStartDate(
          new Date(date.setHours(0, 0, 0, 0)).toISOString().split(".")[0]
        );
        setEndDate(new Date().toISOString().split(".")[0]);
        break;
    }
  };
  return (
    <>
      <label className="dateTimeLabel">Date and Time</label>
      <CRXDropDown
        value={selectOption}
        onChange={onSelctionCahnge}
        options={dateOptions}
      >
        <button onClick={() => setOpen(true)}>
          <TodayIcon />
        </button>
      </CRXDropDown>
      <CRXModal isOpen={open}>
        <DatePicker
          searchStartDate={(v: any) => searchStartDate(v)}
          searchEndDate={(v: any) => searchEndDate(v)}
          selectedOption={selectOption}
          onClose={() => setOpen(false)}
          startDate={startDate}
          endDate={endDate}
        />
      </CRXModal>
    </>
  );
};

export default DateTime;
