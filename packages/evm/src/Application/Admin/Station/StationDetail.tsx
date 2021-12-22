
import React from "react";
import { CRXButton } from "@cb/shared";

const StationDetail: React.FC = () => {

    return (
        <div  className="App crxTabsPermission">
        <>
            <div className="crxManageUsers">
                
               
            </div>
        </>
            <div className="tab-bottom-buttons" style ={{marginTop: "600px"}}>
                <div className="save-cancel-button-box">
                    <CRXButton variant="contained" className="groupInfoTabButtons" >Save</CRXButton>
                    <CRXButton className="groupInfoTabButtons secondary" color="secondary" variant="outlined" >Cancel</CRXButton>
                </div>
                <CRXButton
                    className="groupInfoTabButtons-Close secondary" color="secondary" variant="outlined">Close</CRXButton>
            </div>
        </div>
    )
}

export default StationDetail
