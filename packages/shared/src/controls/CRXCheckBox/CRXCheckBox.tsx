import React from "react";
import { Checkbox } from "@material-ui/core";

interface Props {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: any) => void;
}
const CRXCheckBox: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <>
      <Checkbox
        checked={checked}
        onChange={onChange}
        name="checkedB"
        color="primary"
      />
    </>
  );
};
export default CRXCheckBox;
// {
//   /* <Checkbox name={​​​​​​name}​​​​​​ checked={​​​​​​value}​​​​​​ onChange={​​​​​​onChange}​​​​​​ /> */
// }
