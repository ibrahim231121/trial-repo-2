import React from "react";
import "./DropDown.css";

interface Props {
  children?: React.ReactNode;
  options: { value: string; displayText: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  id?: string;
  className?: string;
}

const DropDown: React.FC<Props> = ({
  children,
  onChange,
  options,
  value,
  id,
  className,
}) => {
  return (
    <div className="wrapper">
      <div className="select">
        <select
          id={id}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e)}
        >
          <option value={-1}>Please Select</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.displayText}
            </option>
          ))}
        </select>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};

export default DropDown;

// const [selectOption, setSelectOption] = React.useState("Please Select");
//import TodayIcon from "@material-ui/icons/Today";

// <DropDown
// value={selectOption}
// onChange={(e) => console.log(e.target.value)}
// options={[
//   { value: "jaffar", displayText: "jaffar" },
//   { value: "raza", displayText: "raza" },
//   { value: "dar", displayText: "dar" },
// ]}
// >
// <TodayIcon />
// </DropDown>
