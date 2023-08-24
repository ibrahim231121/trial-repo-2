import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import Dialogbox from '../../UnitConfiguration/ConfigurationTemplates/Dialogbox';
import { useHistory } from "react-router";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';
import { urlList, urlNames } from '../../../../utils/urlList';
import { SetupConfigurationAgent } from '../../../../utils/Api/ApiAgent';

type Props = {
  selectedItems?: any;
  row?: any;
  updateSelectedItems: () => void;
  onMessageShow: (isSuccess: boolean, message: string) => void;
};

const UploadPoliciesTemplateActionMenu: React.FC<Props> = ({ selectedItems, row, updateSelectedItems, onMessageShow }) => {
  const { t } = useTranslation<string>();
  const history = useHistory();
  const [nondefault, setnondefault] = useState(false);
  const [policyName, setPolicyName] = useState<any[]>([]);

  const deleteUploadPolicies = () => {
    let eventIds: number[] = [];
    // if (Array.isArray(selectedItems) && selectedItems.length > 0) {
    //   eventIds = selectedItems.map((data: any) => {
    //     return data.id;
    //   });
    // }
    // else
    // {
    //   eventIds.push(row.id);
    // }
    if(row && !selectedItems.includes(row)) {
      eventIds.push(row.id);
    }
    else if(Array.isArray(selectedItems) && selectedItems.length > 0) {
      eventIds = selectedItems.map((data: any) => {
        return data.id;
      });
    }
    if (eventIds.length > 0) {
      SetupConfigurationAgent.deleteAllUploadPoliciesTemplate(eventIds)
        .then(function (response: any) {
          let { AssignIdName, UnAssignsIds } = response;
          deleteUploadPoliciesHandler(AssignIdName, UnAssignsIds);
          updateSelectedItems();
        })
        .catch(function (error) {
          if (error) {
            onMessageShow(false, error?.response?.data?.toString());
            return error;
          }
        });
    }

    const deleteUploadPoliciesHandler = (AssignIdName: any, UnAssignsIds: any) => {
      if (AssignIdName.length > 0) {
        let names = AssignIdName.map(function (x: any) {
          return x.name;
        });
        AssignIdName.length > 1 ? onMessageShow(false, t(("Unable_to_process_your_request,_Policies")) + names.join() + t("is_Assigned_on_Categories"))
          : onMessageShow(false, t(("Unable_to_process_your_request,_Policy")) + names.join() + t("is_Assigned_on_Categories"));
      }
      if (UnAssignsIds.length > 0) {
        UnAssignsIds.length > 1 ? onMessageShow(true, t("All_Upload_Policies_Deleted_Successfully")) : onMessageShow(true, t("Upload_Policy_Deleted_Successfully"));
      }
    }
  }

  const deleteConfirm = () => {
    if (selectedItems) {
      setnondefault(true);
      policyNameHandler();
    }
  }

  const openCreateUploadPolicyForm = () => {
    let urlPathName = urlList.filter((item: any) => item.name === urlNames.uploadPoliciesEdit)[0].url;
    history.push(
      urlPathName.substring(0, urlPathName.lastIndexOf("/")) + "/" + row?.id
    );
  };

  async function Onconfirm() {
    deleteUploadPolicies();
    setnondefault(false);
  }
  const policyNameHandler = () => {
    if (Array.isArray(selectedItems) && selectedItems.length > 0) {
      let uploadPolicyName = selectedItems.map((data: any) => {
        return data.name;
      });
      setPolicyName(uploadPolicyName)
    }
  }

  return (
    <div className="table_Inner_Action">
      <Menu
        key="right"
        align="center"
        viewScroll="close"
        direction="right"
        portal={true}
        position="auto"
        offsetX={-24}
        offsetY={24}
        className="menuCss uploadPolicyMainActionMenu"
        menuButton={
          <MenuButton>
            <i className="far fa-ellipsis-v"></i>
          </MenuButton>
        }

      >
        {(row && !selectedItems.includes(row)) || (selectedItems.length <= 1)  ? (
          <MenuItem onClick={openCreateUploadPolicyForm}>
            <Restricted moduleId={63}>
              <div className="crx-meu-content crx-spac "  >
                <div className="crx-menu-icon">
                  <i className="far fa-pencil"></i>
                </div>
                <div className="crx-menu-list">
                  {t("Edit_upload_policy")}
                </div>
              </div>
            </Restricted>
          </MenuItem>
        ) : (
          <div></div>
        )}

        <MenuItem >
          <Restricted moduleId={64}>
            <div className="crx-meu-content  crx-spac" onClick={deleteConfirm} >
              <div className="crx-menu-icon">
                <i className="far fa-trash-alt"></i>
              </div>
              <div className="crx-menu-list">
                {t("Delete_upload_policy")}
              </div>
            </div>
          </Restricted>
        </MenuItem>
      </Menu>
      <Dialogbox
        className="crx-unblock-modal crxConfigModal"
        title={""}
        setIsOpen={setnondefault}
        onConfirm={Onconfirm}
        isOpen={nondefault}
        myVar={true}
        secondary={t("Yes_delete")}
        primary={t("No_do_not_delete")}
      >
        {
          <div className="crxUplockContent configuserParaMain">
            <p className="configuserPara1">
              {t("You_are_attempting_to")} <span className="boldPara">{t("delete")}&nbsp;</span>{policyName.length > 1 ? `${t("Policies")}` : `${t("Policy")}`}<span className="boldPara">&nbsp;{policyName.join()}.</span>&nbsp;

              {t("You_will_not_be_able_to_undo_this_action.")}
            </p>
            <p className="configuserPara2">{t("Are_you_sure_you_would_like_to_delete_upload_policy?")}</p>
          </div>
        }
      </Dialogbox>
    </div>
  );
};
export default UploadPoliciesTemplateActionMenu;
