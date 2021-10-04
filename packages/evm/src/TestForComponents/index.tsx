import React from 'react';
import { CRXTabs, CrxTabPanel} from '@cb/shared' 

const TabsDemo = () => {
  const [value, setValue] = React.useState(0);

  function handleChange(event:any, newValue: number) {
    setValue(newValue);
  };

  const tabs = [
      {label : "Tab One", index : 0},
      {label : "Tab Two", index : 1},
      {label : "Tab Three", index : 2},
  ];
  
  return (
    <div className="App" style={{marginTop : "120px", marginLeft:"90px"}}>
      <CRXTabs value={value} onChange={handleChange} tabitems={tabs}/>
      <CrxTabPanel value={value} index={0}>
        <div>Tab Panel one</div>
      </CrxTabPanel>
      
      <CrxTabPanel value={value} index={1}>
      <div>Tab Panel 2</div>
      </CrxTabPanel>
      
      <CrxTabPanel value={value} index={2}>
      <div>Tab Panel 3</div>
      </CrxTabPanel>
    </div>
  );
}

export default TabsDemo;