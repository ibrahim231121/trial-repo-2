import React from "react";
import { CRXTabs, CrxTabPanel, CRXButton } from "@cb/shared";
import { useHistory } from "react-router";
import {  Menu, MenuButton , MenuItem } from "@szhsin/react-menu";
import {Link} from "react-router-dom";
import "./createTemplate.scss";
import TemplateInformation  from "./InnerDeviceTemplate/TemplateInformation";
import UnitSettings from "./InnerDeviceTemplate/UnitSettings";
import Devices from "./InnerDeviceTemplate/Devices";




const DevicesTemplate = () => {
    const [value, setValue] = React.useState(0);
    const [premission,setPermission] = React.useState(true);
    const history = useHistory()

    function handleChange(event: any, newValue: number) {
        setValue(newValue);
      }
      const formVal = (dataval: any) => {
        setPermission(dataval)
      }
      const tabs = [
        { label: "TEMPLATE INFORMATION ", index: 0 },
        { label: "UNIT SETTINGS", index: 1 },
        { label: "DEVICES", index: 2 }
      ];

    return (
        <div className="CrxCreateTemplate">
               <Menu
                align="start"
                viewScroll="initial"
                direction="bottom"
                position="auto"
                arrow
                menuButton={
                    <MenuButton>
                        <i className="fas fa-ellipsis-h"></i>
                    </MenuButton>
                }
            >
            <MenuItem >
                <Link to="/admin/unitsdevicestemplate/clonetemplate">
                <div className="crx-meu-content groupingMenu crx-spac">
                <div className="crx-menu-icon">
                <i className="fas fa-pen"></i>
                </div>
                <div className="crx-menu-list">Clone template</div>
                </div>
                </Link>    
            </MenuItem>
            <MenuItem >
                <div className="crx-meu-content groupingMenu crx-spac">
                <div className="crx-menu-icon">
                <i className="fas fa-pen"></i>
                </div>
                <div className="crx-menu-list">Delete template</div>
                </div>
            </MenuItem>
            </Menu >
            <div className="tabCreateTemplate">
                <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />
                <div className="tctContent">
                    <CrxTabPanel value={value} index={0}  >
                        <TemplateInformation formVal={formVal} />
                    </CrxTabPanel>

                    <CrxTabPanel value={value} index={1}  >
                        <UnitSettings formVal={formVal} />
                    </CrxTabPanel>

                    <CrxTabPanel value={value} index={2}>
                        <Devices />
                    </CrxTabPanel>
                </div>
            </div>
            <div className="tctButton">
                <div className="tctLeft">
                    <CRXButton disabled={true}>Save</CRXButton>
                    <CRXButton  onClick={()=> history.push('/admin/usergroups')}>Cancel</CRXButton>
                </div>
                <div className="tctRight">
                     <CRXButton onClick={ () => history.push("admin/unitsdevicestemplate/createtemplate")} >Close</CRXButton> 
                </div>
            </div>
        </div>
    )
}


export default DevicesTemplate;