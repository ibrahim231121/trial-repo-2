import React, { createContext } from "react";

export const DateContext = createContext<any>(null);

export const DateContextProvider: React.FC = ({ children }) => {
  const [startDate, setStartDate] = React.useState<string>("Jaffar Raza");
  const [endDate, setEndDate] = React.useState<string>("Jaffar Raza");

  const setEndDateValue = (val: any) => {
    setEndDate(val);
  };

  const setStartDateValue = (val: any) => {
    setStartDate(val);
  };
  return (
    <DateContext.Provider
      value={{ startDate, endDate, setStartDateValue, setEndDateValue }}
    >
      {children}
    </DateContext.Provider>
  );
};
