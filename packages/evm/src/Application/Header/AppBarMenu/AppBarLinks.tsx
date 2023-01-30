import React,{useContext} from 'react'
import { CRXItem, CRXMenu,CRXTooltip,SVGImage } from "@cb/shared";
import AppsIcon from '@material-ui/icons/Apps';
import { useTranslation } from 'react-i18next';
import {BASE_URL_COMMAND_SERVICE} from '../../../utils/Api/url';
import ApplicationPermissionContext from "../../../../../evm/src/ApplicationPermission/ApplicationPermissionContext";




const CRXAppDropdown = () => {
    const { t } = useTranslation<string>();
    const icon = <CRXTooltip className="crxTooltipAppBar applicationIcon" id="applicationIcon_grid_tooltip" arrow={false} placement="bottom-end" iconName="icon icon-grid" title="Getac applications"/>;
    const {getModuleIds} = useContext(ApplicationPermissionContext);
    var between = getModuleIds().filter( (item : any) => {
        return (item >= 32 && item <= 42);
      });
   
    const listOFMenu = [
        {
            label : t('Getac_Command'),
            onClick: () => { window.open(BASE_URL_COMMAND_SERVICE, "_blank") }
        },
        {
            label : t('Getac_Enterprise'),
            router : "/"
        }
    ];
    if(between.length <= 0){
        listOFMenu.shift()
    }
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
