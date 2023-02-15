import React, { useEffect, useState, useRef } from "react";
import {
  CRXTabs,
  CrxTabPanel,
  CRXAlert,
  CRXToaster,
} from "@cb/shared";
import "./categoryFormsAndFields.scss";
import { useParams } from "react-router";
import moment from "moment";
import { useDispatch } from "react-redux";
import { addNotificationMessages } from "../../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../../Header/CRXNotifications/notificationsTypes";
import { useTranslation } from "react-i18next";
import { UsersAndIdentitiesServiceAgent } from "../../../../utils/Api/ApiAgent";
import { UserGroups } from "../../../../utils/Api/models/UsersAndIdentitiesModel";
import { PageiGrid } from "../../../../GlobalFunctions/globalDataTableFunctions";
import CategoryFormsList from "../CategoryFormsLister/CategoryFormsList";
import { getAllCategyFormsFilter } from "../../../../Redux/CategoryForms";
import FormFieldsList from "../FormFieldsLister/FormFieldsList";


const CategoryFormsAndFields = () => {
  const { t } = useTranslation<string>();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const [messagesadd, setMessagesadd] = useState<string>("crxScrollGroupTop");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [messages, setMessages] = useState<string>("");
  const [alertType, setAlertType] = useState<string>("inline");
  const [error, setError] = useState<string>("");
  const [showMessageError, setShowMessageError] = useState<string>("");
  const [res, setRes] = React.useState<UserGroups>()
  const groupMsgRef = useRef<typeof CRXToaster>(null);
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: 0,
    size: 25
  })

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: t("Category_Forms"), index: 0 },
    { label: t("Form_Fields"), index: 1 }
  ];

  const { id } = useParams<{ id: string }>();
  const [ids, setIds] = useState<string>(id);

  useEffect(() => {
    if (ids !== undefined)
      UsersAndIdentitiesServiceAgent.getUserGroupsById(ids).then((response: UserGroups) => {
        setRes(response)
      });
  }, [ids]);

  const alertMsgDiv = showSuccess ? " " : "hideMessageGroup";

  useEffect(() => {
    if (messages !== undefined && messages !== "") {
      let notificationMessage: NotificationMessage = {
        title: "Group",
        message: messages,
        type: error,
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [messages]);

  return (
    <div className="switchLeftComponents category_ui_forms" style={{}}>
      {showSuccess && showSuccess ? <CRXAlert
        className={"CrxAlertNotificationGroup " + " " + alertMsgDiv}
        message={messages}
        type={error}
        open={showSuccess}
        alertType={alertType}
        setShowSucess={setShowSuccess}
      />
        : ""}
      <CRXToaster ref={groupMsgRef} />

      <CRXTabs value={value} onChange={handleChange} tabitems={tabs} stickyTab={130} />
      <CrxTabPanel value={value} index={0}>
        <div
          className={`${showMessageError} ${alertType == "inline" ? "" : "errorGroupInfo"
            }`}
        >
          <CategoryFormsList/>
        </div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={1}>
        <div
          className={`${showSuccess ? "crxGroupTab1 isErrorHide" : "crxGroupTab1"
            } ${messagesadd}`}
        >
          <FormFieldsList></FormFieldsList>
        </div>
      </CrxTabPanel>
    </div>
  );
};

export default CategoryFormsAndFields;
