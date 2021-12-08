
import React from "react";
import {CRXToaster } from "@cb/shared";
import { CRXButton } from "@cb/shared";

const Station: React.FC = () => {
    
    return (
        <div className="crxManageUsers">
			<CRXToaster />
            <CRXButton id={"createUser"} className="primary manageUserBtn">  
             Create Station
            </CRXButton>
        </div>
    )
}

export default Station
