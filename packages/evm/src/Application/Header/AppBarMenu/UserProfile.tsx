import React, { useEffect, useState } from 'react'
import { CRXMenu, CRXToaster, CRXConfirmDialog } from "@cb/shared";
import { logOutUser } from "../../../Logout/API/auth";
import { useHistory } from "react-router";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/rootReducer';
import { useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";
import { navigationUpdate } from "../../../Redux/NavigationStateReducer"
declare const window: any;


const CRXUserProfile = () => {
    
    window.URL = window.URL || window.webkitURL;
    const [userData, setUserData] = useState<any>();
    const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
    const accessToken = useSelector((state: RootState) => state.accessAndRefreshTokenSlice.accessToken);
    const dispatch = useDispatch();
    useEffect(() => {
        if (accessToken) {
            let decodedAccessToken: any = jwt_decode(accessToken);
            setUserData(decodedAccessToken);
        }
    }, accessToken)
    const toasterRef = React.useRef<typeof CRXToaster>(null);
    const { t } = useTranslation<string>();
    const history = useHistory();
    const listOFMenu = [
        {
            label: t('User_Profile'),
            router: "userProfile",

        },
        {
            label: t('Logout'),
            //router: "Logout",
            onClick: logOut
        },
    ];

    const showToastClose = () => {
        console.log("accessToken", accessToken)
        toasterRef.current.showToaster({
          message: "close",
          variant: "success",
          duration: 7000,
          clearButtton: false,
          //isSessionExpired: true
        });
      }

    function logOut() {
        if (window.TotalFilePer != undefined && window.TotalFilePer != 0 && window.TotalFilePer != 100) {
            setIsOpenConfirm(true);
        }
        else {
            logOutUser(() => {
                history.push('/logout')
            })
            dispatch(navigationUpdate("Assets"));
        }
    }
    const onConfirm = () => {
        window.TotalFilePer = 0;
        logOutUser(() => {
            history.push('/logout')
        })
        dispatch(navigationUpdate("Assets"));
    }
    return (
        <>
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
            <CRXConfirmDialog
                className="crx-unblock-modal"
                title={t("Please_confirm")}
                setIsOpen={setIsOpenConfirm}
                onConfirm={onConfirm}
                isOpen={isOpenConfirm}
                primary={t("Yes")}
                secondary={t("No")}
                maxWidth="sm"
            >
                <div className="crxUplockContent __CRX__Uploading__Content">

                    <div className="uploadCancelBottom">
                        <p>{t("You_are_logging_out_from_application")}</p>
                        <p>{t("Are_you_sure_to_logout_your_user_from_application")}</p>

                    </div>
                </div>
            </CRXConfirmDialog>
        </>

    )
}

export default CRXUserProfile;