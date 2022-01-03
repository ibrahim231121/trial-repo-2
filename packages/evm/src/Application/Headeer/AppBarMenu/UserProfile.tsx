import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import { LogOutUser } from '../../../Login/API/auth';
import { useHistory } from "react-router";

let history :any;
const listOFMenu = [
    {
        label : 'User Profile',
        router : "userProfile"
    },
    {
        label : 'Logout',
        router : "Logout",
        onClick :  ()=>LogOutUser(()=> history)
    },
];

const CRXUserProfile = () => {
    history = useHistory();
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