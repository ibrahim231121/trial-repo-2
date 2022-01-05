import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import CreateUserForm from "./CreateUserForm";
import { CRXModalDialog } from "@cb/shared";

import { CRXConfirmDialog, CRXAlert } from "@cb/shared";
import {
  updateUsersInfoAsync,
  getUsersInfoAsync,
} from "../../../Redux/UserReducer";
import { useDispatch } from "react-redux";
import "./UserActionMenu.scss";

import moment from "moment";
import {addNotificationMessages }  from "../../../Redux/notificationPanelMessages";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes"

type Props = {
  selectedItems?: any;
  row?: any;
  showToastMsg(obj: any): any
};

const UserActionMenu: React.FC<Props> = ({ selectedItems, row, showToastMsg }) => {
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [primary, setPrimary] = React.useState<string>("");
  const [secondary, setSecondary] = React.useState<string>("");
  const [modalType, setModalType] = React.useState<string>("");
  const [responseError, setResponseError] = React.useState<string>("");
  const [showAlert, setShowAlert] = React.useState<boolean>(false);

  const unlockUser = () => {
    setTitle("Unlock user account");
    setPrimary("Yes, unlock user account");
    setSecondary("No, do not unlock");
    setIsOpen(true);
    setModalType("unlock");
  };
  const deactivateUser = () => {
    setTitle("Deactivate user account");
    setPrimary("Yes, deactivate user account");
    setSecondary("No, do not deactivate");
    setIsOpen(true);
    setModalType("deactivate");
  };
  const dispatchNewCommand = (isSuccess: boolean, errorMsg: string) => {
    switch (modalType) {
      case 'unlock': {
        if (isSuccess) {
          showToastMsg({ message: "You have unlocked the user account.", variant: "success", duration: 7000 });
          dispatch(getUsersInfoAsync());
          setIsOpen(false);
        }
        else {
          setShowAlert(true);
          setResponseError("We're sorry. The account was unable to be unlocked. Please retry or contact your System Administrator.");
        }
        break;
      }
      case 'deactivate': {
        if (isSuccess) {
          showToastMsg({ message: "You have deactivated the user account.", variant: "success", duration: 7000 });
          dispatch(getUsersInfoAsync());
          setIsOpen(false);
        }
        else {
          setShowAlert(true);
          setResponseError("We're sorry. The account was unable to be deactivated. Please retry or contact your System Administrator.");
        }
        break;
      }
      default: {
        break;
      }
    }
    // dispatch(e);
  }

  const onConfirm = () => {
    switch (modalType) {
      case 'unlock': {
        dispatch(updateUsersInfoAsync({ dispatchNewCommand, userId: row?.id, columnToUpdate: '/account/status', valueToUpdate: 'Active' }));
        break;
      }
      case 'deactivate': {
        dispatch(updateUsersInfoAsync({ dispatchNewCommand, userId: row?.id, columnToUpdate: '/account/status', valueToUpdate: 'Deactivated' }));
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

  React.useEffect(() => {
    if(responseError !== undefined && responseError !== "") {
      let notificationMessage: NotificationMessage = {
          title: "Assets Action Menu", 
          message: responseError, 
          type: "error",
          date: moment(moment().toDate()).local().format("YYYY / MM / DD HH:mm:ss")
      }
      dispatch(addNotificationMessages(notificationMessage));
    }
  },[responseError])

  return (
    <>
      <CRXModalDialog
        className="CrxCreateUser"
        style={{ minWidth: "550px" }}

        title="Edit User"
        modelOpen={open}
        showSticky={true}
        onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
        closeWithConfirm={closeWithConfirm}
      >
        {row && (
          <CreateUserForm
            id={row.id}
            setCloseWithConfirm={setCloseWithConfirm}
            onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
            showToastMsg={showToastMsg}
          />
        )}
      </CRXModalDialog>
      <CRXConfirmDialog
        className="crx-unblock-modal"
        title={title}
        setIsOpen={setIsOpen}
        onConfirm={onConfirm}
        isOpen={isOpen}
        primary={primary}
        secondary={secondary}
      >
        {
          <>
            {showAlert && <CRXAlert className="UserActionAlert"
              message={responseError}
              alertType="inline"
              type="error"
              open={showAlert}
              setShowSucess={() => null}
            />}
            <div className="crxUplockContent">
              <p>
                You are attempting to <b>{modalType}</b> the following user
                account:
              </p>
              <p>
                {row?.firstName} {row?.lastName}: <b>{row?.userName}</b>
              </p>
              <p>
                Please confirm if you would like to {modalType} this user account.
              </p>
            </div>
          </>
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
        {row?.status.toLocaleLowerCase() == "accountlocked" ? (
          <MenuItem>
            <div className="crx-meu-content" onClick={unlockUser}>
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
            <div className="crx-meu-content" onClick={deactivateUser}>
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
