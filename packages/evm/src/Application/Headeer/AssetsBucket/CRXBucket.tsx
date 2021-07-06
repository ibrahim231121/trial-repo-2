import React from "react";
import { CRXDrawer, CRXIcon, CRXRows, CRXColumn  } from "@cb/shared";
import "./CRXBucket.scss";

const ToggleButton = (
  <CRXIcon className="bucketIcon">
    <i className="fas icon-drawer2"></i>
  </CRXIcon>
);

const CRXAssetsBucketPanel = () => {  
  
  const [isOpen,setIsOpen]=React.useState<boolean>(false);

  const toggleState = () =>
    setIsOpen((prevState) => (!prevState));

  return (
    <CRXDrawer
      className="CRXBucketPanel"
      anchor="right"
      button={ToggleButton}
      btnStyle="bucketIconButton"
      isOpen={isOpen}
      toggleState={toggleState}
      variant="persistent"
    >
      <CRXRows container spacing={0}>
        <CRXColumn item xs={11} className="bucketPanelTitle">
          <label>Your Asset Bucket</label>
        </CRXColumn>
        <CRXColumn item xs={1} className="topColumn">
          <i
            className="fas fa-times"
            onClick={() => setIsOpen( false )}
          ></i>
        </CRXColumn>
      </CRXRows>

      <div className="uploadContent">
        <div className="iconArea">
          <i className="fas fa-layer-plus"></i>
        </div>
        <div className="textArea">
          Drag and drop an <b>asset</b> to the Asset Bucket to add, or use the
          <br />
          <span className="textFileBrowser">file browser</span>
        </div>
      </div>
      <div className="bucketContent">Your Asset Bucket is empty.</div>
    </CRXDrawer>
  );
};

export default CRXAssetsBucketPanel;
