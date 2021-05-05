import React from "react";
import { CRXDateTimePicker } from "@cb/shared";
type Props = {
  onClose: () => void;
  customSelected?: any;
};
const DatePicker: React.FC<Props> = ({ onClose, customSelected }) => {
  console.log(customSelected);
  return (
    <div>
      <div style={{ display: "flex" }}>
        <CRXDateTimePicker />
        <div>to</div>
        <CRXDateTimePicker />
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default DatePicker;
