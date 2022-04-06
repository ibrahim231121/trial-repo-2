import React from 'react'
import { CRXItem, CRXMenu,CRXTooltip } from "@cb/shared";
import AppsIcon from '@material-ui/icons/Apps';

const listOFMenu = [
    {
        label : 'REAL TIME Command',
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
           <CRXTooltip className="crxTooltipAppBar" arrow={false} placement="bottom-end" iconName="fa fa-times" title="getec applications"/>
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