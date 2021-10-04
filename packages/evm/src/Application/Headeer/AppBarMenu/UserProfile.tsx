import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import { logOutUser } from '../../../Login/API/auth';

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
        <div className="department" onClick={()=>logOutUser()}>
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