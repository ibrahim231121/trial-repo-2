import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import AppsIcon from '@material-ui/icons/Apps';

const listOFMenu = [
    {
        label : 'REAL TIME Command',
        router : "",
        onClick: () => {window.location.href = process.env.REACT_APP_COMMAND_URL as string }
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
            className="DarkTheme applicationMenu"
            btnClass="appsDropDown"
            iconHtml={icon}
            wrapper="applicationsMenu"
            MenuList={listOFMenu}
            horizontal="left"
        />
        </div>
    )
}

export default CRXAppDropdown;