import React, { useState } from 'react';
import {
  CRXGlobalSelectFilter,
  CRXMultiSelectBoxLight,
  CrxAccordion,
  TextField,
  CRXTabs, CrxTabPanel,
  CRXProgressBar, GoogleMap, BingMap
} from '@cb/shared';

interface renderCheck {
  label?: string,
  id?: string,
}

const TabsDemo = () => {
  const [value, setValue] = React.useState(0);

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  };

  const searchAbleOpt = [
    { label: 'The Shawshank Redemption', id: 1994 },
    { label: 'The Godfather', id: 1972 },
    { label: 'The Godfather: Part II', id: 1974 },
    { label: 'The Dark Knight', id: 2008 },
    { label: '12 Angry Men', id: 1957 },
    { label: "Schindler's List", id: 1993 },
    { label: 'Pulp Fiction', id: 1994 },
    { label: 'The Good, the Bad and the Ugly', id: 1966 },
    { label: 'Fight Club', id: 1999 },
    { label: 'Naked weppan', id: 2000 },
    { label: 'Avengers', id: 2001 },
  ];
  
  const tabs = [
    { label: "Tab One", index: 0 },
    { label: "Tab Two", index: 1 },
    { label: "Tab three", index: 2 },
    { label: "Tab Four", index: 3 },
    { label: "Tab Five", index: 4 },
    { label: "Tab six", index: 5 },
    { label: "Tab Seven", index: 6 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },
    { label: "Tab Eight", index: 7 },



  ];
  const filesize = <div className='loadingFilesize'><strong>30</strong>GB of <strong>90</strong>GB</div>

  const [autoValue, setAutoValue] = React.useState<renderCheck[]>();
  const [singleSelect, setSingleSelect] = React.useState<renderCheck[]>();
  const [open, setOprnState] = useState<boolean>()
  const hanlerChange = (e: any, val: renderCheck[]) => {


  }

  const hanlerChangeCom = (e: React.SyntheticEvent, val: renderCheck[]) => {


    setAutoValue(val)
  }
  const openHandler = (_: React.SyntheticEvent) => {
    setOprnState(true)
  }

  const onChangeSelectSingle = (e: React.SyntheticEvent, val: renderCheck[]) => {
    setSingleSelect(val)
  }

  // React.useEffect(() => {
  //   
  // },[autoValue])
  const icons = <i className="fas fa-info"></i>

  //google map
  const getMarkerLatLong = (location: number[]) => {
    alert("Lat:->" + location[0] + ", Long:->" + location[1]);
  }

  const [expanded, isExpaned] = React.useState<string | boolean>("panel1");

  return (
    <div className="App" style={{ marginTop: "120px", marginLeft: "90px" }}>
      <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />
      <CrxTabPanel value={value} index={0}>
        <div>Tab Panel one</div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={1}>
        <div>Tab Panel 2</div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={2}>
        <div>Tab Panel 3</div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={3}>
        <div>Tab Panel 4</div>
      </CrxTabPanel>
      {/* <GoogleMap
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        zoomLevel={5}
        mapCenter={{ lat: 24.86, long: 67.00 }}
        mapTypeControl={false}
        getMarkerLatLong={(location: number[]) => getMarkerLatLong(location)}
      /> */}

      <CrxTabPanel value={value} index={4}>
        <div>Tab Panel 5</div>
      </CrxTabPanel>
      <BingMap apiKey={process.env.REACT_APP_BING_MAPS_API_KEY}
        zoomLevel={10}
        mapCenter={{ lat: 24.86, long: 67.00 }}
        mapTypeControl={false}
        getMarkerLatLong={(location: number[]) => getMarkerLatLong(location)}
      />

      <CrxTabPanel value={value} index={5}>
        <div>Tab Panel 6</div>
      </CrxTabPanel>
      <div className="inlineDiv">

        <div className="columnse">
          <CRXMultiSelectBoxLight
            id="multiSelect"
            multiple={false}
            value={singleSelect}
            onChange={(e: React.SyntheticEvent, option: renderCheck[]) => { return onChangeSelectSingle(e, option) }}
            options={searchAbleOpt}
            CheckBox={true}
            checkSign={false}
            required={true}
          />
        </div>
      </div>

      {/* <div className="accrodialTest">
        <CrxAccordion
          title="Accordion one"
          id="accorIdx1"
          className="crx-accordion"
          ariaControls="Content1"
          name="panel1"
          isExpanedChange={isExpaned}
          expanded={expanded === "panel1"}

        >
        <div className=''  style={{display:"flex", placeItems:"center", placeContent:"center", border: "0px solid #ddd", width: "100%", margin: "0", padding: "0px 25px 33px 25px"  }}>
        <label style={{paddingRight : "15px", fontSize: "14px"}}>Field Label </label>
        <TextField className="crx-generate-btn" value="Loram ispm" />
        </div>
          <div style={{ border: "1px solid #ddd", width: "100%", margin: "0", background: "#f9f9f9", padding: "25px" }}>
            <h3>What is Lorem Ipsum? </h3>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>
        </CrxAccordion>

      <CrxTabPanel value={value} index={7}>
      <div>Tab Panel 8</div>
      </CrxTabPanel> }
        <CrxAccordion
          title="Accordion two"
          id="accorIdx2"
          className="crx-accordion"
          ariaControls="Content2"
          name="panel2"
          isExpanedChange={isExpaned}
          expanded={expanded === "panel2"}

        >

          <div style={{ border: "1px solid #ddd", width: "100%", margin: "0", background: "#f9f9f9", padding: "25px" }}>
            <h3>What is Lorem Ipsum? </h3>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>
          <div className="tooltip-div" style={{ border: "1px solid black", width: "325px", margin: "2px, 2px, 2px,200px", background: "#d1d2d4", padding: "2px", marginTop: "10px" }}>
            <label style={{ margin: "0 100px  0 50px" }}>RIGHT</label></div>

        </CrxAccordion>

        <CrxAccordion
          title="Accordion three"
          id="accorIdx3"
          className="crx-accordion"
          disabled={true}
          ariaControls="Content3"
          name="panel3"
          isExpanedChange={isExpaned}
          expanded={expanded === "panel3"}

        >
          <h3>What is Lorem Ipsum? </h3>
          <div style={{ border: "1px solid #ddd", width: "100%", margin: "0", background: "#f9f9f9", padding: "25px" }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>
        </CrxAccordion>
      </div> */}

      {/* <ControlledAccordions /> */}

      {/* <div className="progressBar">
        
          <CRXProgressBar
            id="solid"
            loadingText="Loading files..."
            value={3}
            error={true}
            maxDataSize= {false}
            loadingCompleted="4 minutes remaining..."
          />
        
      </div>

      <div className="progressBar">
        <div style={{width : "250px"}}>
        <CRXProgressBar
        id="raw"
          loadingText="Asset Uploading"
          value={2}
          error={true}
          maxDataSize= {true}
          loadingCompleted={filesize}
        />
      </div>
    </div> */}

    </div>
  );
}

export default TabsDemo;