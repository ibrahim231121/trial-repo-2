import React from 'react'
import { CRXItem, CRXMenu,CRXTooltip,SVGImage } from "@cb/shared";
import AppsIcon from '@material-ui/icons/Apps';
import { useTranslation } from 'react-i18next';




const CRXAppDropdown = () => {
    const { t } = useTranslation<string>();
    const icon = <CRXTooltip className="crxTooltipAppBar applicationIcon" arrow={false} placement="bottom-end" iconName="icon icon-grid" title="getec applications"/>;
    const listOFMenu = [
        {
            label : t('Getac_Command'),
            router : "",
            onClick: () => {window.location.href = process.env.REACT_APP_COMMAND_URL as string }
        },
        {
            label : t('Getac_Enterprise'),
            router : "/"
        }
    ];
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