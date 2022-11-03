import React, { createContext, useEffect } from "react";
import DateTime from "./DateTime";


export const DateContext = createContext<any>(null);

export type DateTimeProp = {
  startDate:()=>string;
  endDate:()=>string;
  value:string;
  displayText:string;
}

export type DateTimeObject = {
  startDate:string;
  endDate:string;
  value:string;
  displayText:string;
}

 type Props = {
  minDate?: string;
  maxDate?: string;
  showChildDropDown?: boolean;
  dateOptionType?:string;
  disabled?: boolean;
  reset?: boolean;
  showCompact? :boolean;
  dateTimeDetail : DateTimeObject,
  getDateTimeDropDown :(obj: DateTimeObject) => void
};

 export const DateTimeComponent: React.FC<Props> = ({
    minDate,
    maxDate,
    showChildDropDown,
    dateOptionType,
    disabled, 
    reset=false,
    showCompact=false,
    dateTimeDetail,
    getDateTimeDropDown
}) => {

  const [openContainerState, setOpenContainerState] = React.useState(false);

  const onSelectionChange = (selectedDateOption: DateTimeProp) => {
    var dateValue : DateTimeObject ={
       startDate: selectedDateOption.startDate(),
       endDate: selectedDateOption.endDate(),
       value: selectedDateOption.value,
       displayText:selectedDateOption.displayText
    }
    getDateTimeDropDown(dateValue);
  };

  return (
    <DateContext.Provider 
    value={{
      minDate,
      maxDate,
      showChildDropDown,
      dateOptionType,
      disabled, 
      reset,
      openContainerState,
      setOpenContainerState,
      showCompact,
      dateTimeDetail,
      getDateTimeDropDown,
      onSelectionChange
    }}
    >
      <DateTime />
    </DateContext.Provider>
  );
};

