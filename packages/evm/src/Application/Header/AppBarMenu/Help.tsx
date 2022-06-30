import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import { useTranslation } from 'react-i18next';





const CRXHelp = () => {
    const { t } = useTranslation<string>();
    const listOFMenu = [
        {
            label : 'User Guide',
            router : "UserGuide"
        },
        {
            label : 'Release Notes',
            router : "ReleaseNotes"
        },
        {
            label : 'Help Request',
            router : "HelpRequest"
        },
        {
            label : 'About',
            router : "About"
        }
    ];
    return (
        <div className="department">
             <CRXMenu
                id="CRXHelp"
                name={t("Help")}  //Get Current User name and add here
                className="DarkTheme"
                btnClass="customButton"
                MenuList = {listOFMenu}
            />
        </div>
    )
}

export default CRXHelp;