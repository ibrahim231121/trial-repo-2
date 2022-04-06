import React from "react";
import "./DropDown.scss";

interface Props {
  children?: React.ReactNode;
  options: { value: string; displayText: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  id?: string;
  className?: string;
  disabled? : boolean

}

const DropDown: React.FC<Props> = ({
  children,
  onChange,
  options,
  value,
  id,
  className,
  disabled
}) => {
  return (
    <div className="wrapper">
      <div className="select">
        <select
          id={id}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e)}
          disabled={disabled}
        >
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
// onChange={(e) => 
// options={[
//   { value: "jaffar", displayText: "jaffar" },
//   { value: "raza", displayText: "raza" },
//   { value: "dar", displayText: "dar" },
// ]}
// >
// <TodayIcon />
// </DropDown>
