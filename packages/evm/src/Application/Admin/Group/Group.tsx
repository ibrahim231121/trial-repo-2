import React from "react";
import { CRXTabs, CrxTabPanel,CRXButton } from "@cb/shared";

const Group = () => {
  const [value, setValue] = React.useState(0);

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: "GROUP NAME", index: 0 },
    { label: "USERS", index: 1 },
    { label: "APPLICATION PERMISSIONS", index: 2 },
    { label: "DATA PERMISSIONS", index: 3},
  ];
  return (
    <div className="App" style={{ marginTop: "120px", marginLeft: "90px" }}>
      <>
        <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />

        <CrxTabPanel value={value} index={0}>
          <div>GROUP NAME</div>
        </CrxTabPanel>

        <CrxTabPanel value={value} index={1}>
          <div>USERS</div>
        </CrxTabPanel>

        <CrxTabPanel value={value} index={2}>
          <div>APPLICATION PERMISSIONS</div>
        </CrxTabPanel>

        <CrxTabPanel value={value} index={3}>
          <div>DATA PERMISSIONS</div>
        </CrxTabPanel>
      </>
      <div style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              justifyContent: "space-between",
              width: '92%'
      }}>
      <div>
        <CRXButton disabled={true}>Save</CRXButton>
        <CRXButton  disabled={true}>Cancel</CRXButton>
      </div>
        <CRXButton>Close</CRXButton>
      </div>
    </div>
  );
};

export default Group;
