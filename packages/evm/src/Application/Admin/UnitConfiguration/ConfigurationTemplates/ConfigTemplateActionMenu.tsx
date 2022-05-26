import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { useDispatch } from "react-redux";
import  Dialogbox  from "./Dialogbox";
import { deletetemplate } from "../../../../Redux/TemplateConfiguration";
import "./ConfigTemplateActionMenu.scss";
import { useHistory } from "react-router";
type Props = {

  row?: any;
};


const ConfigTemplateActionMenu: React.FC<Props> = ({row}) => {
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
  console.log("I am called")
  dispatch(await deletetemplate(row))
  setnondefault(false);

}
  if(row) {
    var unitId = row.name; 
  }
  return (
    <div className="table_Inner_Action">

    <Menu
      align="start"
      viewScroll="initial"
      direction="right"
      position="auto"
      className="menuCss"
      arrow
      menuButton={
        <MenuButton>
          <i className="far fa-ellipsis-v"></i>
        </MenuButton>
      }
    
    >
    <MenuItem >
        <div className="crx-meu-content   crx-spac"  >
          <div className="crx-menu-icon">
          <i className="far fa-pencil"></i>
          </div>
          <div className="crx-menu-list">
            Edit template
          </div>
        </div>
      </MenuItem>
      <MenuItem >
        <div className="crx-meu-content groupingMenu crx-spac"  >
          <div className="crx-menu-icon">
          <i className="far fa-copy"></i>
          </div>
          <div className="crx-menu-list">
            Clone template
          </div>
        </div>
      </MenuItem>
      <MenuItem >
        <div className="crx-meu-content  crx-spac" onClick={Deleteconfirm} >
          <div className="crx-menu-icon">
            <i className="far fa-trash-alt"></i>
          </div>
          <div className="crx-menu-list">
           Delete template
          </div>
        </div>
      </MenuItem>
      <MenuItem >
      
        <div className="crx-meu-content  crx-spac" onClick={ViewLog} >
          <div className="crx-menu-icon">
            <i className="far fa-trash-alt"></i>
          </div>
          <div className="crx-menu-list">
           View Change Log
           
          </div>
        
        </div>
   
      </MenuItem>

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
            You are attempting to <span className="boldPara">delete</span> this <span className="boldPara">{unitId}</span> template. You will not be abe to undo this action.
            </p>
            <p className="configuserPara2">Are you sure you would like to delete template?</p>
          </div>
        }
      </Dialogbox> 
    </div>
 
  );
};
export default ConfigTemplateActionMenu;
