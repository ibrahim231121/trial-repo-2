import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import { logOutUser } from "../../../Logout/API/auth";
import { useHistory } from "react-router";
import { useTranslation } from 'react-i18next';



const CRXUserProfile = () => {
    const { t } = useTranslation<string>();
    const history = useHistory();
    const listOFMenu = [
        {
            label : t('User_Profile'),
            router : "userProfile",
           
        },
        {
            label : t('Logout'),
            router : "Logout",
            onClick: logOut
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
            name={t("Username")}  //Get Current User name and add here
            className="DarkTheme"
            btnClass="customButton"
            MenuList = {listOFMenu}
            onClick={logOut} //CRXMenu needs to be corrected
            />
        </div>
    )
}

export default CRXUserProfile;