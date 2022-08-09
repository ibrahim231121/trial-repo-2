import React from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

import { CRXConfirmDialog, CRXAlert } from "@cb/shared";
import {
  updateUsersInfoAsync,
  getUsersInfoAsync,
} from "../../../Redux/UserReducer";
import { useDispatch } from "react-redux";
import "./UserActionMenu.scss";

import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import Restricted from "../../../ApplicationPermission/Restricted";
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GridFilter } from "../../../GlobalFunctions/globalDataTableFunctions";

type Props = {
  selectedItems?: any;
  row?: any;
  showToastMsg(obj: any): any;
};

let gridFilter: GridFilter = {
  logic: "and",
  filters: []
}

const UserActionMenu: React.FC<Props> = ({
  selectedItems,
  row,
  showToastMsg,
}) => {
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [primary, setPrimary] = React.useState<string>("");
  const [secondary, setSecondary] = React.useState<string>("");
  const [modalType, setModalType] = React.useState<string>("");
  const [responseError, setResponseError] = React.useState<string>("");
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const history = useHistory()
  const unlockUser = () => {
    setTitle(t("Unlock_user_account"));
    setPrimary(t("Yes_unlock_user_account"));  
    setSecondary(t("No_do_not_unlock"));
    setIsOpen(true);
    setModalType("unlock");
  };
  const deactivateUser = () => {
    setTitle(t("Deactivate_user_account"));
    setPrimary(t("Yes_deactivate_user_account"));
    setSecondary(t("No_do_not_deactivate"));
    setIsOpen(true);
    setModalType("deactivate");
  };
  const dispatchNewCommand = (isSuccess: boolean, errorMsg: string) => {
    switch (modalType) {
      case "unlock": {
        if (isSuccess) {
          showToastMsg({
            message: t("You_have_unlocked_the_user_account."),
            variant: "success",
            duration: 7000,
          });
          dispatch(getUsersInfoAsync(gridFilter));
          setIsOpen(false);
        } else {
          setShowAlert(true);
          setResponseError(
            t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
          );
        }
        break;
      }
      case "deactivate": {
        if (isSuccess) {
          showToastMsg({
            message: t("You_have_deactivated_the_user_account"),
            variant: "success",
            duration: 7000,
          });
          dispatch(getUsersInfoAsync(gridFilter));
          setIsOpen(false);
        } else {
          setShowAlert(true);
          setResponseError(
            t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
          );
        }
        break;
      }
      default: {
        break;
      }
    }
    // dispatch(e);
  };
  const onConfirm = () => {
    switch (modalType) {
      case "unlock": {
        dispatch(
          updateUsersInfoAsync({
            dispatchNewCommand,
            userId: row?.id,
            columnToUpdate: "/account/status",
            valueToUpdate: "Active",
          })
        );
        break;
      }
      case "deactivate": {
        dispatch(
          updateUsersInfoAsync({
            dispatchNewCommand,
            userId: row?.id,
            columnToUpdate: "/account/status",
            valueToUpdate: "Deactivated",
          })
        );
        break;
      }
      default: {
        break;
      }
    }
  };

  const openCreateUserForm = () => {
   
    const path = `${urlList.filter((item: any) => item.name === urlNames.editUser)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.id);
    
  };

  React.useEffect(() => {
    if (responseError !== undefined && responseError !== "") {
      let notificationMessage: NotificationMessage = {
        title: t("Assets_Action_Menu"),
        message: responseError,
        type: "error",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [responseError]);
 
  return (
    <>
      {/* <CRXModalDialog
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
   
            showToastMsg={showToastMsg}
          />
        )}
      </CRXModalDialog> */}
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
            {showAlert && (
              <CRXAlert
                className="UserActionAlert"
                message={responseError}
                alertType="inline"
                type="error"
                open={showAlert}
                setShowSucess={() => null}
              />
            )}
            <div className="crxUplockContent">
              <p>
              {t("You_are_attempting_to")} <b>{modalType}</b> {t("the_following_user_account")}
              </p>
              <p>
                {row?.firstName} {row?.lastName}: <b>{row?.userName}</b>
              </p>
              <p>
                {t("Please_confirm_if_you_would_like_to")} {modalType} {t("this_user_account.")}
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
          <Restricted moduleId={10}>
            <div className="crx-meu-content groupingMenu crx-spac">
              <div className="crx-menu-icon">
                <i className="fas fa-pen"></i>
              </div>
              <div className="crx-menu-list">{t("Edit_user")}</div>
            </div>
          </Restricted>
        </MenuItem>
        {row?.status.toLocaleLowerCase() == "accountlocked" && !row?.isADUser ? (
          <MenuItem>
            <Restricted moduleId={12}>
              <div className="crx-meu-content" onClick={unlockUser}>
                <div className="crx-menu-icon">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="crx-menu-list">{t("Unlock_account")}</div>
              </div>
            </Restricted>
          </MenuItem>
        ) : (
          <div></div>
        )}
        {row?.status.toLocaleLowerCase() != "deactivated" && !row?.isADUser ? (
          <MenuItem>
            <Restricted moduleId={11}>
              <div className="crx-meu-content" onClick={deactivateUser}>
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">{t("Deactivate_account")}</div>
              </div>
            </Restricted>
          </MenuItem>
        ) : (
          <div></div>
        )}
      </Menu>
    </>
  );
};
export default UserActionMenu;
