import React from 'react';
import {
  TextField
} from '@cb/shared';
import "./Test.scss"
const TabsDemo = () => {
 const [value, setValue] = React.useState<any>();
 
 const [values, setValues] = React.useState<any>();
 const [ShowHideTextVlaue, setShowHideText] = React.useState<boolean>(false);
 const handleChange = (e : any) => {
  setValue(e.target.value);
 }
 const handleChanged = (e : any) => {
  setValues(e.target.value)
 }

  const changeEyeIcon =() => {
    setShowHideText(!ShowHideTextVlaue)
  }
  return (
    <div className="App" style={{ marginTop: "130px", marginLeft: "90px" }}>
      <div className="inlineDiv">
          <TextField 
            name="demo"
            type="number"
            value={value}
            onChange={(e : any) => handleChange(e)}
          />


          <TextField 
            name="demo"
            type={ShowHideTextVlaue == false ? "password" : "text"}
            value={values}
            eyeIcon={true}
            showHideText={ShowHideTextVlaue}
            showPassword={() => changeEyeIcon()}
            onChange={(e : any) => handleChanged(e)}
          />

          
      </div>

    </div>
  );
}

export default TabsDemo;