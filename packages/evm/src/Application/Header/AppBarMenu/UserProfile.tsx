import React, { useEffect, useState } from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import { logOutUser } from "../../../Logout/API/auth";
import { useHistory } from "react-router";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/rootReducer';
import jwt_decode from "jwt-decode";


const CRXUserProfile = () => {
    const [userData, setUserData] = useState<any>();
    const accessToken = useSelector((state: RootState) => state.accessAndRefreshTokenSlice.accessToken);
    useEffect(() => {
        if (accessToken) {
            let decodedAccessToken: any = jwt_decode(accessToken);
            setUserData(decodedAccessToken);
        }
    }, accessToken)

    const { t } = useTranslation<string>();
    const history = useHistory();
    const listOFMenu = [
        {
            label: t('User_Profile'),
            router: "userProfile",

        },
        {
            label: t('Logout'),
            router: "Logout",
            onClick: logOut
        },
    ];

    function logOut() {
        logOutUser(() => {

            history.push('/logout')
        })
    }

    return (
        <div className="department">
            <CRXMenu
                id="userProfile"
                name={userData?.FName + " " + userData?.LName}  //Get Current User name and add here
                className="DarkTheme"
                btnClass="customButton"
                MenuList={listOFMenu}
                onClick={logOut} //CRXMenu needs to be corrected
            />
        </div>
    )
}

export default CRXUserProfile;