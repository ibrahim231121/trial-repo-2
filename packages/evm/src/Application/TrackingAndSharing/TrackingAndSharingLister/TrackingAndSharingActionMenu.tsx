import React, { useEffect } from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

import { CRXConfirmDialog, CRXAlert } from "@cb/shared";
import {
  updateUsersInfoAsync,
  getUsersInfoAsync,
} from "../../../Redux/UserReducer";
import { useDispatch } from "react-redux";
import "./TrackingAndSharingActionMenu.scss";

import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import Restricted from "../../../ApplicationPermission/Restricted";
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageiGrid, RemoveSidePanelClass } from "../../../GlobalFunctions/globalDataTableFunctions";
import { setRevokeAccess } from "../../../Redux/TrackingAndSharingReducer";

type Props = {
  row?: any;
  selectedItems?: any;
  showToastMsg(obj: any): any;
};

const TrackingAndSharingActionMenu: React.FC<Props> = ({
  row,
  selectedItems,
  showToastMsg
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
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: 0,
    size: 25
  })

  const revokeAccessAll = async () => {
    let trackingIds: number[] = [];

    if(row && !selectedItems.includes(row)) {
      trackingIds.push(row.id);
    }
    else if(Array.isArray(selectedItems) && selectedItems.length > 0) {
      trackingIds = selectedItems.map((data: any) => {
        return data.id;
      });
    }
    if (trackingIds.length > 0) {
      await dispatch(setRevokeAccess(trackingIds))
    }
    trackingIds.length == 1 ?
    showToastMsg?.({
      message: t("Access_to") + " '" + `${row.referenceTitle}` + "' " + t("has_been_revoked"),
      variant: "success",
      duration: 5000,
    })
    :
    showToastMsg?.({
      message: t("Access_to_selected_assets_has_been_revoked"),
      variant: "success",
      duration: 5000,
    })
  }

  const onConfirm = async () => {
    await revokeAccessAll();
    setIsOpen(false);
    
  };

  const onHandleRevoke = () => {
    setTitle(t("Revoke Access"));
    setPrimary(t("Yes"));
    setSecondary(t("Cancel"));
    setIsOpen(true);
  };
  
  
  return (
    <>
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
              {t("Do_you_want_to_revok_share_access_effective_immediately?")}
            </div>
          </>
        }
      </CRXConfirmDialog>
      <Menu
        key="right"
        align="start"
        viewScroll="close"
        direction="right"
        position="auto"
        offsetX={-28}
        offsetY={-25}
        className={`manageUsersMenuUi`}
        portal={true}
        menuButton={
          
          <MenuButton >
            <i className="far fa-ellipsis-v"></i>
          </MenuButton>
        }
      >
        {/* {row ? (
          <MenuItem>
            <Restricted moduleId={0}>
              <div className="crx-meu-content" >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">{t("Update_Share_Options")}</div>
              </div>
            </Restricted>
          </MenuItem>
        ) : (
          <div></div>
        )} */}
        {row ? (
          <MenuItem>
            <Restricted moduleId={0}>
              <div className="crx-meu-content" onClick={onHandleRevoke} >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">{t("Revoke_Access")}</div>
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
export default TrackingAndSharingActionMenu;
