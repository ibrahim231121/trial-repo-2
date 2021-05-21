import React, { createContext } from "react";
import moment from "moment";

export const DateContext = createContext<any>(null);

export const DateContextProvider: React.FC = ({ children }) => {
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [selectedOptionValue, setSelection] = React.useState<string>("");

  const setEndDateValue = (val: any) => {
    setEndDate(val);
  };

  const setStartDateValue = (val: any) => {
    setStartDate(val);
  };

  const setSelectedOption = (val: any) => {
    setSelection(val);
    setEndDate("");
    setStartDate("");

    const m = moment();
    const startingDate=moment();
    const endingDate=moment();

    if (val !== "last calendar month") {
      setEndDateValue(m.endOf("day").set("second",0).format());
    }

    switch (val) {
      case "last 30 days":
        setStartDateValue(startingDate.startOf("day").subtract(30, "days").format());
        setEndDateValue(endingDate.endOf("day").set("second",0).format());
        break;
      case "last 7 days":
        setStartDateValue(startingDate.startOf("day").subtract(7, "days").format());
        setEndDateValue(endingDate.endOf("day").subtract(1, "days").set("second",0).format());
        break;
      case "yesterday":
        setStartDateValue(startingDate.startOf("day").subtract(1, "days").format());
        setEndDateValue(endingDate.endOf("day").subtract(1, "days").format());
        break;
      case "today":
       setEndDateValue(endingDate.endOf("day").set("second",0).format());
        setStartDateValue(startingDate.startOf("day").format());
        break;

      case "current calendar month":
        setStartDateValue(m.startOf("month").format());

        break;
      case "last calendar month":
        setEndDateValue(m.startOf("month").format());
        setStartDateValue(m.subtract(1, "months").endOf("month").format());
        break;

      default:
        setSelection(val);
        setEndDate("");
        break;
    }
  };

  return (
    <DateContext.Provider
      value={{
        startDate,
        endDate,
        setStartDateValue,
        setEndDateValue,
        setSelectedOption,
        selectedOptionValue,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
