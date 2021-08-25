import React from "react";
import { TextField } from "@cb/shared";
import { ValueString } from "../../../../components/SupportiveFunctions"

type Props = {
  headCells: any[];
  colIdx: number;
  onChange: (e: ValueString[]) => void;
};

const SearchText: React.FC<Props> = ({
  headCells,
  colIdx,
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
      id={"CRX_" + colIdx.toString()}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
    />
  );
};

export default SearchText;
