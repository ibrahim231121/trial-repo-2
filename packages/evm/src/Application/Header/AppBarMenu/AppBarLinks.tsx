import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import AppsIcon from '@material-ui/icons/Apps';

const listOFMenu = [
    {
        label : 'REAL TIME Command',
        router : "",
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
            onClick={() => {window.location.href = "http://localhost:8081" }}
        />
        </div>
    )
}

export default CRXAppDropdown;