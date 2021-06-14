import React, { createContext } from "react";
import moment from "moment";

export const DateContext = createContext<any>(null);

export const DateContextProvider: React.FC = ({ children }) => {
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [selectedOptionValue, setSelection] = React.useState<string>("");
  const [deafaultValue, setDeafault] = React.useState<string>("");

  const setEndDateValue = (val: any) => {
    setEndDate(val);
  };
  const setDeafaultValue = (val: any) => {
    setDeafault(val);
  };

  const setStartDateValue = (val: any) => {
    setStartDate(val);
  };

  const setSelectedOption = (val: any, dateOptions: any) => {
    setSelection(val);
    // if (val !== "custom") {
    //   setEndDate("");
    //   setStartDate("");
    // }
    // const startingDate = moment();
    // const endingDate = moment();
    let selectedDateOption = dateOptions.find((x:any) => x.value === val)


    if(val !== "custom"){
      setStartDateValue(selectedDateOption.startDate());
      setEndDateValue(selectedDateOption.endDate());
    }else{
      setSelection(val);
    }

    // switch (val) {
    //   case "last 30 days":
    //     setStartDateValue(selectedDateOption.startDate());
    //     setEndDateValue(selectedDateOption.endDate());
    //     break;
    //   case "last 7 days":
    //     setStartDateValue(selectedDateOption.startDate());
    //     setEndDateValue(selectedDateOption.endDate());
    //     break;
    //   case "yesterday":
    //     setStartDateValue(selectedDateOption.startDate());
    //     setEndDateValue(selectedDateOption.endDate());
    //     break;
    //   case "today":
    //     setStartDateValue(selectedDateOption.startDate());
    //     setEndDateValue(selectedDateOption.endDate());
    //     break;
        
        //setEndDateValue(endingDate.endOf("month").set("second", 0).format());

    //   case "current calendar month":
    //     setStartDateValue(startingDate.startOf("month").format());

    //     break;
    //   case "last calendar month":
    //     setStartDateValue(selectedDateOption.startDate());
    //     setEndDateValue(selectedDateOption.endDate());
    //     break;

    //   default:
    //     setSelection(val);
    //     break;
    // }
  };

  return (
    <DateContext.Provider
      value={{
        startDate,
        endDate,
        setStartDateValue,
        setEndDateValue,
        setSelectedOption,
        selectedOptionValue,setDeafaultValue,deafaultValue
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
