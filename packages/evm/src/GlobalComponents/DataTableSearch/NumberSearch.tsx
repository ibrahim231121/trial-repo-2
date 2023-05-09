import React from "react";
import { NumberField } from "@cb/shared";
import { ValueString } from "../../GlobalFunctions/globalDataTableFunctions"

type Props = {
  headCells: any[];
  colIdx: number;
  className?: string;
  onChange: (e: ValueString[]) => void;
};

const SearchNumber: React.FC<Props> = ({
  headCells,
  colIdx,
  className,
  onChange,
}) => {
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let valuesObject: ValueString[] = [{
      value: e.target.value
    }]
    onChange(valuesObject)
  }
  
  return (
    <NumberField
      id={"CRX_" + colIdx.toString()}
      value={headCells[colIdx].headerArray !== undefined
        ? headCells[colIdx].headerArray[0].value 
        : headCells[colIdx].headerArray = [{value: ""}]
      }
      className={className}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
      type="number"
    />
  );
};

export default SearchNumber;
