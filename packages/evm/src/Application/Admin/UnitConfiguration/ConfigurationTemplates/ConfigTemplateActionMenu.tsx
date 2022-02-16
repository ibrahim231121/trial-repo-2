import React, { useState } from "react";
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
type Props = {

  row?: any;
};

const ConfigTemplateActionMenu: React.FC<Props> = ({row}) => {
    const dispatch = useDispatch()


const [modal, setModal] = useState(false);
const [nondefault, setnondefault] = useState(false);
const toggleModal = () => {
  setModal(!modal);
};




const Deleteconfirm = () => {
  if(row)
  {
    console.log(row)
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

 async function Onconfirm(){
  console.log("I am called")
  dispatch(await deletetemplate(row))
  setnondefault(false);

}

  return (
    <>
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
        <div className="crx-meu-content groupingMenu crx-spac" onClick={Deleteconfirm} >
          <div className="crx-menu-icon"></div>
          <div className="crx-menu-list">
           Delete Config Template
          </div>
        </div>
      </MenuItem>
    </Menu>
    <Dialogbox
        className="crx-unblock-modal"
        title={"ERROR"}
        setIsOpen={setModal}
        onConfirm={toggleModal}
        isOpen={modal}
        myVar={false}
       // primary={primary}
        secondary={"Confirm"}
      >
        {
          <div className="crxUplockContent">
            <p>
             Deleting Default Template is unathorized
            </p>
          </div>
        }
      </Dialogbox>
      <Dialogbox
        className="crx-unblock-modal"
        title={""}
        setIsOpen={setnondefault}
        onConfirm={Onconfirm}
        isOpen={nondefault}
        myVar={true}
        primary={"Cancel"}
        secondary={"Confirm"}
      >
        {
          <div className="crxUplockContent">
            <p>
             Are you sure you want to Delete ?
            </p>
          </div>
        }
      </Dialogbox>
    </>
  );
};
export default ConfigTemplateActionMenu;
