import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";

const CRXUserProfile = () => {
    return (
        <div className="department">
             <CRXMenu
            id="userProfile"
            name="UserName"  //Get Current User name and add here
            className="DarkTheme"
            btnClass="customButton"
            >
            <CRXItem>User Profile</CRXItem>
            <CRXItem>Logout</CRXItem>
        </CRXMenu>
        </div>
    )
}

export default CRXUserProfile;