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

import { CRXConfirmDialog } from "@cb/shared";
import { updateUsersInfoAsync, getUsersInfoAsync } from "../../../../Redux/UserReducer";
import { useDispatch, useSelector } from "react-redux";
type Props = {
  selectedItems?: any;
  row?: any;
};

const UserActionMenu: React.FC<Props> = ({ selectedItems, row }) => {
    const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);

  const dispatch = useDispatch();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>("");
    const [primary, setPrimary] = React.useState<string>("");
    const [secondary, setSecondary] = React.useState<string>("");
    const [modalType, setModalType] = React.useState<string>("");

    const unlockUser = () => {
        setTitle("Unlock user account");
        setPrimary("Yes, unlock user account");
        setSecondary("No, do not unlock");
        setIsOpen(true);
        setModalType("unlock");
    }
    const deactivateUser = () => {
        setTitle("Deactivate user account");
        setPrimary("Yes, deactivate user account");
        setSecondary("No, do not deactivate");
        setIsOpen(true);
        setModalType("deactivate");
    }

    const onConfirm = () => {

        switch (modalType) {
            case 'unlock': {
                dispatch(updateUsersInfoAsync({ dispatch, userId: row?.id, columnToUpdate: '/account/status', valueToUpdate: 'Active' }));
                break;
            }
            case 'deactivate': {
                dispatch(updateUsersInfoAsync({ dispatch, userId: row?.id, columnToUpdate: '/account/status', valueToUpdate: 'Deactivated' }));
                break;
            }
            default: {
                break;
            }
        }

    }
  const openCreateUserForm = () => {
    setOpen(true);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
    dispatch(getUsersInfoAsync());
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
            <CRXConfirmDialog
                title={title}
                setIsOpen={setIsOpen}
                onConfirm={onConfirm}
                isOpen={isOpen}
                primary={primary}
                secondary={secondary}
            >
                {
                    <div>
                        <p>You are attempting to {modalType} the following user account:</p>
                        <p>{row?.firstName} {row?.lastName}: <b>{row?.userName}</b></p>
                        <p>Please confirm if you would like to {modalType} this user account.</p>
                    </div>
                }
            </CRXConfirmDialog>
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
                {
                    row?.status.toLocaleLowerCase() == 'accountlocked' ?
                        <MenuItem>
                            <div className="crx-meu-content" onClick={unlockUser}>
                                <div className="crx-menu-icon">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <div className="crx-menu-list">
                                    Unlock account
                                </div>
                            </div>
                        </MenuItem>
                        : <div></div>
                }
                {
                    row?.status.toLocaleLowerCase() != 'deactivated' ?
                        <MenuItem>
                            <div className="crx-meu-content" onClick={deactivateUser}>
                                <div className="crx-menu-icon">

                                </div>
                                <div className="crx-menu-list">
                                    Deactivate account
                                </div>
                            </div>
                        </MenuItem>
                        : <div></div>
                }
            </Menu>
        </>

    );
};
export default UserActionMenu;
