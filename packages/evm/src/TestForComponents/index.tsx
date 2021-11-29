import React, { useState } from 'react';
import { CRXGlobalSelectFilter} from '@cb/shared' 

interface renderCheck {
  value? : string,
  id? : string,   
  
}

const TestViewsForDemo = () => {
  
  const searchAbleOpt = [
    { value: 'The Shawshank Redemption', id: 1994 },
    { value: 'The Godfather', id: 1972 },
    { value: 'The Godfather: Part II', id: 1974 },
    { value: 'The Dark Knight', id: 2008 },
    { value: '12 Angry Men', id: 1957 },
    { value: "Schindler's List", id: 1993 },
    { value: 'Pulp Fiction', id: 1994 },
    { value: 'The Good, the Bad and the Ugly', id: 1966 },
    { value: 'Fight Club', id: 1999 },
    { value: 'Naked weppan', id: 2000 },
    { value: 'Avengers', id: 2001 },
  ];

  const [autoValue, setAutoValue] = React.useState<renderCheck[]>();
  const [open, setOprnState] = useState<boolean>()
  const hanlerChange = (e : any, val:renderCheck[]) => {
    
    console.log(val, e);
  }
  
  const hanlerChangeCom = (e : React.SyntheticEvent, val:renderCheck[]) => {
      console.log("On change Value", e);
      console.log(val);
      setAutoValue(val)
  }
  const openHandler = (_ : React.SyntheticEvent) => {
    setOprnState(true)
  }

  const deleteSelectedItems = (e : React.SyntheticEvent, options:renderCheck[]) => {
    setAutoValue([]);
  }

  // React.useEffect(() => {
  //   console.log("useEffect", autoValue);
  // },[autoValue])
  return (
    <div className="App" style={{marginTop : "120px", marginLeft:"90px"}}>
     <div className="inlineDiv">
       <div className="columnse">
      <CRXGlobalSelectFilter 
        id="SelectWithoutCheckBox"
        multiple={false}
        onChange={(e:any, val:renderCheck[])=>hanlerChange(e, val)}
        options={ searchAbleOpt }
        CheckBox={false}
        getOptionLabel= {(option : renderCheck)  => option.value ? option.value : " "}
        getOptionSelected={(option : renderCheck, value : renderCheck) => option.value === value.value}
        /> 
    </div>
    {/* <div className="columnse">
      <CRXGlobalSelectFilter 
        id="multiSelect"
        multiple={true}
        onChange={(e:any, val:renderCheck[])=>hanlerChange(e, val)}
        options={ searchAbleOpt }
        CheckBox={false}
        checkSign={true}
        getOptionLabel= {(option : renderCheck)  => option.value ? option.value : " "}
        getOptionSelected={(option : renderCheck, value : renderCheck) => option.value === value.value}
        /> 
        </div> */}
        <div className="columnse">
      <CRXGlobalSelectFilter 
        id="multiSelect"
        multiple={true}
        value={autoValue}
        onChange={(e:React.SyntheticEvent, option : renderCheck[]) => { return hanlerChangeCom(e, option)}}
        options={ searchAbleOpt }
        CheckBox={true}
        checkSign={false}
        open={open}
        clearSelectedItems={(e:React.SyntheticEvent, options:renderCheck[]) => deleteSelectedItems(e, options)}
        getOptionLabel= {(option : renderCheck)  => option.value ? option.value : " "}
        getOptionSelected={(option : renderCheck, value : renderCheck) => option.value === value.value}
        onOpen={(e: React.SyntheticEvent) => { return openHandler(e)}}
        /> 
        </div>
    </div>
    </div>
  );
}

export default TestViewsForDemo;