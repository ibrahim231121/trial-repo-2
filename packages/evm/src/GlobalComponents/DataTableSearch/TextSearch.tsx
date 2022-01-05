import React from "react";
import { TextField } from "@cb/shared";
import { ValueString } from "../../GlobalFunctions/globalDataTableFunctions"

type Props = {
  headCells: any[];
  colIdx: number;
  className?: string;
  onChange: (e: ValueString[]) => void;
};

const SearchText: React.FC<Props> = ({
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
    <TextField
      value={headCells[colIdx].headerArray !== undefined
        ? headCells[colIdx].headerArray[0].value 
        : headCells[colIdx].headerArray = [{value: ""}]
      }
      className={className}
      id={"CRX_" + colIdx.toString()}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
    />
  );
};

export default SearchText;
