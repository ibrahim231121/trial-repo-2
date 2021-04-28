import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import AppsIcon from '@material-ui/icons/Apps';

const listOFMenu = [
    {
        label : 'Real-time command',
        router : "RealTimeCommand"
    },
    {
        label : 'Getac Enterprise',
        router : "/"
    }
];
const CRXAppDropdown = () => {
    const icon = <AppsIcon />;
    return (
        <div className="aplication">
        <CRXMenu
            id="applications"
            iconButton={true}
            className="DarkTheme"
            btnClass="appsDropDown"
            iconHtml={icon}
            wrapper="applicationsMenu"
            MenuList={listOFMenu}
        />
        </div>
    )
}

export default CRXAppDropdown;