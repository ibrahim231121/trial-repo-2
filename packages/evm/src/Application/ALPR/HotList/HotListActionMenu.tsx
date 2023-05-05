import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import Restricted from "../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";
import { CRXConfirmDialog, CRXAlert } from "@cb/shared";

type Props = {
  selectedItems?: any;
  row?: any;
  gridData: any;
};

const HotListActionMenu: React.FC<Props> = ({ selectedItems, row, gridData }) => {

  const { t } = useTranslation<string>();
  const history = useHistory();
  const [primary, setPrimary] = React.useState<string>("");
  const [secondary, setSecondary] = React.useState<string>("");
  const [IsOpen, setIsOpen] = React.useState<boolean>(false);
  const [showAlert, setShowAlert] = React.useState<boolean>(false);

  const editCategories = () => {
    localStorage.setItem('selectedRow', JSON.stringify(row));
    const path = `${urlList.filter((item: any) => item.name === urlNames.HotListDetail)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.id, t("Edit Hot List"));
  };

  const deleteCategory = () => {
    setPrimary(t("Yes"));
    setSecondary(t("No"));
    setIsOpen(true);
    // setModalType("deactivate");
  }
  const onConfirm = () => {

  }

  return (
    <React.Fragment>
      <CRXConfirmDialog
        className="crx-unblock-modal"
        title="Delete an Entry"
        setIsOpen={setIsOpen}
        onConfirm={onConfirm}
        isOpen={IsOpen}
        primary={primary}
        secondary={secondary}
      >
        {
          <>
            {showAlert && (
              <CRXAlert
                className="UserActionAlert"
                message={""}
                alertType="inline"
                type="error"
                open={showAlert}
                setShowSucess={() => null}
              />
            )}
            <div className="crxUplockContent">
              <p>
                {t("You are about to delete ")} <b>{row?.name}</b> {t("this entry")}
              </p>
            </div>
          </>
        }
      </CRXConfirmDialog>

      <div className="table_Inner_Action">

        <Menu
          key="right"
          align="center"
          viewScroll="close"
          direction="right"
          position="auto"
          offsetX={-15}
          offsetY={0}
          portal={true}
          className="menuCss "
          menuButton={
            <MenuButton>
              <i className="far fa-ellipsis-v"></i>
            </MenuButton>
          }
        >
          {selectedItems.length <= 1 ? (
            <MenuItem onClick={editCategories}>
              <Restricted moduleId={54}>
                <div className="crx-meu-content   crx-spac"  >
                  <div className="crx-menu-icon">
                    <i className="far fa-pencil"></i>
                  </div>
                  <div className="crx-menu-list">
                    {t("Edit Hot List")}
                  </div>
                </div>
              </Restricted>
            </MenuItem>
          ) : (
            <div></div>
          )}
          <MenuItem onClick={deleteCategory}>
            <Restricted moduleId={11}>
              <div className="crx-meu-content" >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">{t("Delete")}</div>
              </div>
            </Restricted>
          </MenuItem>
        </Menu>
      </div>
    </React.Fragment>
  );
};
export default HotListActionMenu;