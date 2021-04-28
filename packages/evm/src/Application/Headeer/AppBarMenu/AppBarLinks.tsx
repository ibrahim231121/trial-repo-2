import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import AppsIcon from '@material-ui/icons/Apps';

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
        >
            <CRXItem>Real-time command</CRXItem>
            <CRXItem>Getac Enterprise</CRXItem>
        
        </CRXMenu>
        </div>
    )
}

export default CRXAppDropdown;