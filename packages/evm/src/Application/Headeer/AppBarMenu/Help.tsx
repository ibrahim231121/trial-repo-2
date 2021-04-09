import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";

const CRXHelp = () => {
    return (
        <div className="department">
             <CRXMenu
                id="CRXHelp"
                name="Help"  //Get Current User name and add here
                className="DarkTheme"
                btnClass="customButton"
            >
            <CRXItem>User Guide</CRXItem>
            <CRXItem>Release Notes</CRXItem>
            <CRXItem>Help Request</CRXItem>
            <CRXItem>About</CRXItem>
        </CRXMenu>
        </div>
    )
}

export default CRXHelp;