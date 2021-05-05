import React from "react";
import { CRXDropDown, CRXDateRangePicker, CRXModal } from "@cb/shared";
import TodayIcon from "@material-ui/icons/Today";
import "./DateTime.scss";
import DatePicker from "./DatePicker";
const DateTime = () => {
  const [selectOption, setSelectOption] = React.useState("Please Select");
  const [showDate, setShowDate] = React.useState(false);
  const [showDateRange, setShowDateRange] = React.useState(false);
  const [startDate, setStartDate] = React.useState<any>();
  const [endDate, setEndDate] = React.useState(new Date().toISOString());
  const wrapperRef = React.useRef<HTMLDivElement>(null);
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
  const getDate = (type: string) => {
    switch (type) {
      case "yesterday":
        return ((d) => new Date(d.setDate(d.getDate() - 1)))(
          new Date()
        ).toISOString();
        break;
      case "today":
        return new Date();
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
        return ((d) => new Date(d.setDate(d.getDate() - 30)))(
          new Date()
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
  const handleClickOutSide = (e: MouseEvent) => {
    const { current: wrap } = wrapperRef;
    if (
      wrapperRef.current !== null &&
      !wrapperRef.current.contains(e.target as HTMLElement)
    ) {
      setShowDateRange(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const Search = () => {
    const date = getDate(selectOption);
    console.log(startDate);
    console.log(endDate);
    if (date != "custom") {
      setStartDate(date);
    }
  };
  return (
    <>
      <label className="dateTimeLabel">Date and Time</label>
      <CRXDropDown
        value={selectOption}
        onChange={(e: any) => setSelectOption(e.target.value)}
        options={dateOptions}
      >
        <button onClick={() => setOpen(true)}>
          <TodayIcon />
        </button>
      </CRXDropDown>
      <CRXModal isOpen={open}>
        <DatePicker
          customSelected={selectOption}
          onClose={() => setOpen(false)}
        />
      </CRXModal>
    </>
  );
};

export default DateTime;
