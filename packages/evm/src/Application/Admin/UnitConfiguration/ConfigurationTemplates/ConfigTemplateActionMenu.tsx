import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  MenuItem,
  MenuButton,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { useDispatch } from "react-redux";
import  Dialogbox  from "./Dialogbox";
import { deletetemplate } from "../../../../Redux/TemplateConfiguration";
import "./ConfigTemplateActionMenu.scss";
import { useHistory } from "react-router";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';

type Props = {
  selectedItems?: any;
  row?: any;
};


const ConfigTemplateActionMenu: React.FC<Props> = ({selectedItems, row}) => {
const { t } = useTranslation<string>();
const dispatch = useDispatch()
const history = useHistory();

const [modal, setModal] = useState(false);
const [nondefault, setnondefault] = useState(false);
const toggleModal = () => {
  setModal(!modal);
};




const Deleteconfirm = () => {
  if(row)
  {
   
    if(row.indicator=="Default")
    {
      setModal(true)
    }
    else
    {
      setnondefault(true);
     
      
    }
  }
};


const ViewLog = () => {
  if(row)
  {
  
    
    history.push('/admin/unitanddevices/template/viewlog', { id: row.id, type: row.type, name: row.name })

   
  }
};


 async function Onconfirm(){
  dispatch(await deletetemplate(row))
  setnondefault(false);

}
  if(row) {
    var unitId = row.name; 
  }
  return (
    <div className="table_Inner_Action">

    <Menu
      key="right"
      align="center"
      viewScroll="auto"
      direction="right"
      position="auto"
      offsetX={25}
      offsetY={12}
      className="menuCss"
      menuButton={
        <MenuButton>
          <i className="far fa-ellipsis-v"></i>
        </MenuButton>
      }
    
    >
    <MenuItem >
    <Restricted moduleId={24}>
        <div className="crx-meu-content   crx-spac"  >
          <div className="crx-menu-icon">
          <i className="far fa-pencil"></i>
          </div>
          <div className="crx-menu-list">
            {t("Edit template")}
          </div>
        </div>
        </Restricted>
      </MenuItem>
      <MenuItem >
        <div className="crx-meu-content groupingMenu crx-spac"  >
          <div className="crx-menu-icon">
          <i className="far fa-copy"></i>
          </div>
          <div className="crx-menu-list">
            {t("Clone_template")}
          </div>
        </div>
      </MenuItem>
      <MenuItem >
      <Restricted moduleId={25}>
        <div className="crx-meu-content  crx-spac" onClick={Deleteconfirm} >
          <div className="crx-menu-icon">
            <i className="far fa-trash-alt"></i>
          </div>
          <div className="crx-menu-list">
          {t("Delete_template")}
          </div>
        </div>
        </Restricted>
      </MenuItem>
      {selectedItems.length <=1 ? (
      <MenuItem >
      
        <div className="crx-meu-content  crx-spac" onClick={ViewLog} >
          <div className="crx-menu-icon">
            <i className="far fa-trash-alt"></i>
          </div>
          <div className="crx-menu-list">
          {t("View_Change_Log")}         
          </div>        
        </div>
      </MenuItem>
       ) : (
          <div></div>
          )} 
    </Menu>
      <Dialogbox
        className="crx-unblock-modal crxConfigModal"
        title={""}
        setIsOpen={setnondefault}
        onConfirm={Onconfirm}
        isOpen={nondefault}
        myVar={true}
        secondary={"Yes, delete"}
        primary={"No, do not delete"}
      >
        {
          <div className="crxUplockContent configuserParaMain">
            <p className="configuserPara1">
            {t("You_are_attempting_to")} <span className="boldPara">{t("delete")}</span> {t("this")} <span className="boldPara">{unitId}</span> {t("template")}. 
            {t("You_will_not_be_able_to_undo_this_action.")}
            </p>
            <p className="configuserPara2">{("Are_you_sure_you_would_like_to_delete_template?")}</p>
          </div>
        }
      </Dialogbox> 
    </div>
 
  );
};
export default ConfigTemplateActionMenu;
