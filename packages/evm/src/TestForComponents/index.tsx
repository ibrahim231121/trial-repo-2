import React, { useState } from 'react';
import { CRXGlobalSelectFilter, CRXGlobalTooltip } from '@cb/shared'

interface renderCheck {
  value?: string,
  id?: string,

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
  const hanlerChange = (e: any, val: renderCheck[]) => {

    console.log(val, e);
  }

  const hanlerChangeCom = (e: React.SyntheticEvent, val: renderCheck[]) => {
    console.log("On change Value", e);
    console.log(val);
    setAutoValue(val)
  }
  const openHandler = (_: React.SyntheticEvent) => {
    setOprnState(true)
  }

  const deleteSelectedItems = (e: React.SyntheticEvent, options: renderCheck[]) => {
    setAutoValue([]);
  }

  // React.useEffect(() => {
  //   console.log("useEffect", autoValue);
  // },[autoValue])
  const icons = <i className="fas fa-info"></i>
  return (
    <div className="App" style={{ marginTop: "120px", marginLeft: "90px" }}>



      <div className="inlineDiv">
        <div className="columnse">
          <CRXGlobalSelectFilter
            id="SelectWithoutCheckBox"
            multiple={false}
            onChange={(e: any, val: renderCheck[]) => hanlerChange(e, val)}
            options={searchAbleOpt}
            CheckBox={false}
            getOptionLabel={(option: renderCheck) => option.value ? option.value : " "}
            getOptionSelected={(option: renderCheck, value: renderCheck) => option.value === value.value}
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
            onChange={(e: React.SyntheticEvent, option: renderCheck[]) => { return hanlerChangeCom(e, option) }}
            options={searchAbleOpt}
            CheckBox={true}
            checkSign={false}
            open={open}
            clearSelectedItems={(e: React.SyntheticEvent, options: renderCheck[]) => deleteSelectedItems(e, options)}
            getOptionLabel={(option: renderCheck) => option.value ? option.value : " "}
            getOptionSelected={(option: renderCheck, value: renderCheck) => option.value === value.value}
            onOpen={(e: React.SyntheticEvent) => { return openHandler(e) }}
          />
        </div>
        <div className="columnse">
          <h3>Tooltip Popup</h3>
          <div  style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>TOP</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="top" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"}}>
            <label style={{ margin: "0 100px  0 50px" }}>TOP START</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="top-start" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px" }}>
            <label style={{ margin: "0 100px  0 50px" }}>TOP END</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="top-end" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px",  marginTop : "10px" }}>
            <label style={{ margin: "0 100px  0 50px" }}>RIGHT</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="right" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>RIGHT START</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="right-start" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>RIGHT END</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="right-end" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>BOTTOM</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="bottom" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>BOTTOM START</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="bottom-start" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>BOTTOM END</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="bottom-end" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>LEFT</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="left" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>LEFT START</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="left-start" arrow={true} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>LEFT END</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="left-end" arrow={true} />
          </div>
        </div>

        
        <div className="columnse">
        <h3>Tooltip </h3>
          <div  style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>TOP</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="top" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"}}>
            <label style={{ margin: "0 100px  0 50px" }}>TOP START</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="top-start" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px" }}>
            <label style={{ margin: "0 100px  0 50px" }}>TOP END</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="top-end" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px",  marginTop : "10px" }}>
            <label style={{ margin: "0 100px  0 50px" }}>RIGHT</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="right" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>RIGHT START</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="right-start" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>RIGHT END</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="right-end" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>BOTTOM</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="bottom" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>BOTTOM START</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="bottom-start" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>BOTTOM END</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="bottom-end" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>LEFT</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="left" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>LEFT START</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="left-start" arrow={false} />
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop : "10px"  }}>
            <label style={{ margin: "0 100px  0 50px" }}>LEFT END</label>
            <CRXGlobalTooltip iconName="fas fa-info-circle" title="Select from pre-selection" placement="left-end" arrow={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestViewsForDemo;