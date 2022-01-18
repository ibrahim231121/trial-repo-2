import React, { useState, useEffect } from 'react';
import { CRXGlobalSelectFilter, CRXMultiSelectBoxLight, CrxAccordion, GoogleMap, BingMap } from '@cb/shared'

interface renderCheck {
  label?: string,
  id?: string,

}

const TestViewsForDemo = () => {

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

  const [autoValue, setAutoValue] = React.useState<renderCheck[]>();
  const [singleSelect, setSingleSelect] = React.useState<renderCheck[]>();
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

  const onChangeSelectSingle = (e: React.SyntheticEvent, val: renderCheck[]) => {
    setSingleSelect(val)
  }

  // React.useEffect(() => {
  //   console.log("useEffect", autoValue);
  // },[autoValue])
  const icons = <i className="fas fa-info"></i>

  //google map
  const getMarkerLatLong = (location: number[]) => {
    alert("Lat:->" + location[0] + ", Long:->" + location[1]);
  }

  const [expanded, isExpaned] = React.useState<string | boolean>("panel1");

  return (
    <div className="App" style={{ marginTop: "120px", marginLeft: "90px" }}>

      {/* <GoogleMap
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        zoomLevel={5}
        mapCenter={{ lat: 24.86, long: 67.00 }}
        mapTypeControl={false}
        getMarkerLatLong={(location: number[]) => getMarkerLatLong(location)}
      /> */}

      <BingMap apiKey={process.env.REACT_APP_BING_MAPS_API_KEY}
        zoomLevel={10}
        mapCenter={{ lat: 24.86, long: 67.00 }}
        mapTypeControl={false}
        getMarkerLatLong={(location: number[]) => getMarkerLatLong(location)}
      />

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

      <div className="accrodialTest">
        <CrxAccordion
          title="Accordion one"
          id="accorIdx1"
          className="crx-accordion"
          ariaControls="Content1"
          name="panel1"
          isExpanedChange={isExpaned}
          expanded={expanded === "panel1"}

        >
          <div style={{ border: "1px solid #ddd", width: "100%", margin: "0", background: "#f9f9f9", padding: "25px" }}>
            <h3>What is Lorem Ipsum? </h3>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>
        </CrxAccordion>

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
      </div>

      {/* <ControlledAccordions /> */}
    </div>
  );
}

export default TestViewsForDemo;