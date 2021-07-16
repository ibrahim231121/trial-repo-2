import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import './index.scss'
type Props = {
  isSelected: boolean;
};
const ActionMenu: React.FC<Props> = ({ isSelected }) => {
  return (
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
        <MenuItem>
          <div className="crx-meu-content groupingMenu">
            <div className="crx-menu-icon"></div>
            <div className="crx-menu-list">
              Add to asset bucket
            </div>
          </div>
        </MenuItem>   
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
            <i className="far fa-clipboard-list fa-md"></i>
            </div>
            <div className="crx-menu-list">
              Categorize
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
            
            </div>
            <div className="crx-menu-list">
              Set as primary asset
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
              <i className="far fa-user-tag fa-md"></i> 
            </div>
            <div className="crx-menu-list">
                Assign user
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content groupingMenu">
            <div className="crx-menu-icon">
              
            </div>
            <div className="crx-menu-list">
                Modify Retention
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
              <i className="far fa-envelope fa-md"></i>
            </div>
            <div className="crx-menu-list">
                Email
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content groupingMenu">
            <div className="crx-menu-icon">
              
            </div>
            <div className="crx-menu-list">
              <SubMenu label="Export">
                <MenuItem>File</MenuItem>
                <MenuItem>Metadata</MenuItem>
                <MenuItem>Evidence overlaid video</MenuItem>
                <MenuItem>Metadata overlaid video</MenuItem>
              </SubMenu>
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
              <i className="far fa-link fa-md"></i>
            </div>
            <div className="crx-menu-list">
              Link asset
            </div>
          </div>
        </MenuItem>
        <MenuItem disabled>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
              
            </div>
            <div className="crx-menu-list disabledItem">
            Link to this group
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
            <i className="far fa-external-link-square fa-md"></i>
            </div>
            <div className="crx-menu-list">
            Move asset
            </div>
          </div>
        </MenuItem>
        <MenuItem disabled>
          <div className="crx-meu-content groupingMenu">
            <div className="crx-menu-icon">
           
            </div>
            <div className="crx-menu-list disabledItem">
              Move to this group
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
            <i className="far fa-user-lock fa-md"></i>
            </div>
            <div className="crx-menu-list">
              Restrict access
            </div>
          </div>
        </MenuItem>
    </Menu>
  );
};
export default ActionMenu;
