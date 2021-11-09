import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import CreateUserForm from "./CreateUserForm";
import { CRXModalDialog } from "@cb/shared";

type Props = {
  selectedItems?: any;
  row?: any;
};

const UserActionMenu: React.FC<Props> = ({ selectedItems, row }) => {
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);

  const openCreateUserForm = () => {
    setOpen(true);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
  };
  return (
    <>
      <CRXModalDialog
        className="createUser"
        style={{ minWidh: "550px" }}
        maxWidth="xl"
        title="Edit User"
        modelOpen={open}
        onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
        closeWithConfirm={closeWithConfirm}
      >
        {row && <CreateUserForm
          id={row.id}
          setCloseWithConfirm={setCloseWithConfirm}
          onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
        />}
      </CRXModalDialog>
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
        <MenuItem onClick={openCreateUserForm}>
          <div className="crx-meu-content groupingMenu crx-spac">
            <div className="crx-menu-icon">
              <i className="fas fa-pen"></i>
            </div>
            <div className="crx-menu-list">Edit user</div>
          </div>
        </MenuItem>
        {row?.status.toLocaleLowerCase() == "accountlocked" ? (
          <MenuItem>
            <div className="crx-meu-content">
              <div className="crx-menu-icon">
                <i className="fas fa-lock"></i>
              </div>
              <div className="crx-menu-list">Unlock account</div>
            </div>
          </MenuItem>
        ) : (
          <div></div>
        )}
        {row?.status.toLocaleLowerCase() != "deactivated" ? (
          <MenuItem>
            <div className="crx-meu-content">
              <div className="crx-menu-icon"></div>
              <div className="crx-menu-list">Deactivate account</div>
            </div>
          </MenuItem>
        ) : (
          <div></div>
        )}
      </Menu>
    </>
  );
};
export default UserActionMenu;
