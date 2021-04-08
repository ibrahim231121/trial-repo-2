import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";

interface Prop {
  onChange: (state: any) => void;
  value: any;
}
const DateRangePicker: React.FC<Prop> = ({ onChange }) => {
  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const onChangeHandler = (item: any) => {
    setState([item.selection]);
    onChange(state);
  };
  return (
    <div>
      <DateRange
        onChange={(item: any) => onChangeHandler(item)}
        editableDateInputs={true}
        moveRangeOnFirstSelection={false}
        ranges={state}
      />
    </div>
  );
};

export default DateRangePicker;
