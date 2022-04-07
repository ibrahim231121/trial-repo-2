import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import { logOutUser } from "../../../Logout/API/auth";
import { useHistory } from "react-router";


const CRXUserProfile = () => {
    const history = useHistory();
    const listOFMenu = [
        {
            label : 'User Profile',
            router : "userProfile",
           
        },
        {
            label : 'Logout',
            router : "Logout",
            onClick:()=>logOut
        },
    ];

function logOut(){
    logOutUser(()=>{
        history.push('/logout')
      })
}

    return (
        <div className="department">
             <CRXMenu
            id="userProfile"
            name="Username"  //Get Current User name and add here
            className="DarkTheme"
            btnClass="customButton"
            MenuList = {listOFMenu}
            onClick={logOut} //CRXMenu needs to be corrected
            />
        </div>
    )
}

export default CRXUserProfile;