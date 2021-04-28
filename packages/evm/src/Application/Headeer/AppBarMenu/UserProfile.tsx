import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";

const listOFMenu = [
    {
        label : 'User Profile',
        router : "userProfile"
    },
    {
        label : 'Logout',
        router : "Logout"
    },
];

const CRXUserProfile = () => {
    return (
        <div className="department">
             <CRXMenu
            id="userProfile"
            name="UserName"  //Get Current User name and add here
            className="DarkTheme"
            btnClass="customButton"
            MenuList = {listOFMenu}
            />
        </div>
    )
}

export default CRXUserProfile;