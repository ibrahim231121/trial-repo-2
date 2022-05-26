import React from 'react'
import { CRXItem, CRXMenu,CRXTooltip,SVGImage } from "@cb/shared";
import AppsIcon from '@material-ui/icons/Apps';

const listOFMenu = [
    {
        label : 'Getac Command',
        router : "",
        onClick: () => {window.location.href = process.env.REACT_APP_COMMAND_URL as string }
    },
    {
        label : 'Getac Enterprise',
        router : "/"
    }
];
const CRXAppDropdown = () => {
    const icon = <CRXTooltip className="crxTooltipAppBar applicationIcon" arrow={false} placement="bottom-end" iconName="icon icon-grid" title="getec applications"/>;
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