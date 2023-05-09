import React, { useEffect, useState, useRef } from "react";
import { Formik, Form } from "formik";
import {
  MultiSelectBoxCategory,
  CRXCheckBox,
  CRXButton,
  CRXAlert,
  CRXConfirmDialog,
} from "@cb/shared";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/rootReducer";
import { getUsersIdsAsync } from "../Redux/UserReducer";
import { getGroupAsync } from "../Redux/GroupReducer";
import { addNotificationMessages } from "../Redux/notificationPanelMessages";
import moment from "moment";
import { UnitsAndDevicesAgent } from "../utils/Api/ApiAgent";
import { AssignUsersToUnit } from "../utils/Api/models/UnitModels";
import { CMTEntityRecord } from "../utils/Api/models/CommonModels";
import { useTranslation } from "react-i18next";
import { PageiGrid } from "../GlobalFunctions/globalDataTableFunctions";
import { useHistory, useParams } from "react-router";
import { urlList, urlNames } from "../utils/urlList";
import { SearchType } from "../Application/Assets/utils/constants";
import { NotificationMessage } from "../Application/Header/CRXNotifications/notificationsTypes";
import UnitAndDevices from "./UnitsAndDevices";
import { getUnitInfoAsync } from "../Redux/UnitReducer";


type AssignUserProps = {
  selectedItems: any[];
  filterValue: any[];
  setFilterValue: (param: any) => void;
  filterGroupValue: any[];
  setFilterGroupValue: (param: any) => void;
  rowData: any;
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
  showToastMsg: (obj: any) => any;
  setIsformUpdated: (param: boolean) => void;
};

const UnitDeviceAssignUser: React.FC<AssignUserProps> = (props) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [initialfilterValue, setInitialfilterValue] = React.useState(
    props.filterValue
  );

  const [buttonState, setButtonState] = React.useState(true);
  const [responseError, setResponseError] = React.useState<string>("");
  const [alert, setAlert] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isShowInfo, setIsShowInfo] = React.useState<boolean>(false);
  const [isIncar, setIsInCar] = React.useState<boolean>(props?.rowData?.deviceType == "DVR" ? true : false);
  const alertRef = useRef(null);
  const users: any = useSelector(
    (state: RootState) => state.userReducer.userIds
  );
  const groups: any = useSelector(
    (state: RootState) => state.groupReducer.groups
  );

  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: 0,
    size: 25
  })

  React.useEffect(() => {
    dispatch(getUsersIdsAsync(pageiGrid));
    dispatch(getGroupAsync(pageiGrid));
    getData();

  }, []);


  useEffect(() => {
    if (responseError !== undefined && responseError !== "") {
      let notificationMessage: NotificationMessage = {
        title: "User",
        message: responseError,
        type: "error",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [responseError]);
  useEffect(() => {
    const alertClx: any = document.getElementsByClassName(
      "crxAlertUserEditForm"
    );
    const optionalSticky: any =
      document.getElementsByClassName("optionalSticky");
    const altRef = alertRef.current;

    if (alert === false && altRef === null) {
      alertClx[0].style.display = "none";
      //optionalSticky[0].style.height = "79px"
    } else {
      alertClx[0].setAttribute(
        "style",
        "display:flex;margin-top:42px;margin-bottom:42px"
      );
      if (optionalSticky.length > 0) {
        optionalSticky[0].style.height = "119px";
      }
    }
  }, [alert]);

  const history = useHistory();

  const getData = () => {
    props.setIsformUpdated(false);

    getAssignedUsers();
    if(isIncar)
       getAssignedGroups();
  };
  const closeDialog = () => {
    setIsOpen(false);
    history.push(
      urlList.filter((item: any) => item.name === urlNames.unitsAndDevices)[0].url 
    );
  };
  const getAssignedUsers = async () => {
    const url =
      "/Stations/0" +
      "/Units/" +
      `${props?.rowData?.id}`+
      "/GetAssignedUsers";
    UnitsAndDevicesAgent.getAssignedUsers(url).then((response: any) => {
      let result = response.map((x: CMTEntityRecord) => {
        let item: any = {
          id: x.id.split("_")[2],
          label:
            x.record.length > 0
              ? x.record.filter((_t: any) => _t.key === "UserName")[0].value
              : "",
        };
        return item;
      });
      props.setFilterValue(() => result);
    });
    setIsShowInfo( props.selectedItems.length > 1 ? true :false);
  };

  const getAssignedGroups = async () => {
    const url =
      "/Stations/0" +
      "/Units/" +
      `${props?.rowData?.id}`+
      "/GetAssignedGroups";
    UnitsAndDevicesAgent.getAssignedGroups(url).then((response: any) => {
      let result = response.map((x: CMTEntityRecord) => {
        let item: any = {
          id: x.id.split("_")[2],
          label:
            x.record.length > 0
              ? x.record.filter((_t: any) => _t.key === "Name")[0].value
              : "",
        };
        return item;
      });
    
      props.setFilterGroupValue(() => result);
    });
    setIsShowInfo( props.selectedItems.length > 1 ? true :false);
  };


  React.useEffect(() => {
    props.setFilterValue(() => props.filterValue);

  }, [props.filterValue]);

  React.useEffect(() => {
    props.setFilterGroupValue(() => props.filterGroupValue);

  }, [props.filterGroupValue]);


  const filterUser = (arr: Array<any>): Array<any> => {
    let sortedArray: any = [];
    if (arr.length > 0) {
      for (const element of arr) {
        sortedArray.push({
          id: element.recId,
          label: element.loginId,
        });
      }
    }
    sortedArray = sortedArray.sort((a: any, b: any) =>
      a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
    );
    return sortedArray;
  };

  const filterGroup = (arr: Array<any>): Array<any> => {
    let sortedArray: any = [];
    if (arr.length > 0) {
      for (const element of arr) {
        sortedArray.push({
          id: element.id,
          label: element.name,
        });
      }
    }
    sortedArray = sortedArray.sort((a: any, b: any) =>
      a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
    );
    return sortedArray;
  };
  const handleChange = (
    _e: any,
    _colIdx: number,
    v: any,
    reason: any,
    detail: any
  ) => {
    setButtonState(false);
    props.setFilterValue(() => [...v]);
    props.setIsformUpdated(true);

  };
  const handleChange1 = (
    _e: any,
    _colIdx: number,
    v: any,
    reason: any,
    detail: any
  ) => {
    setButtonState(false);
    props.setFilterGroupValue(() => [...v]);
    props.setIsformUpdated(true);
  };

  
  const onSubmitForm = async () => {
    setResponseError("");
    setAlert(false);

    let body: AssignUsersToUnit;
    if(props.selectedItems.length > 1)
    {
      body = {
          unitIds: props.selectedItems.map((x: any) => x.id),
          userIds: props.filterValue.map((x) => x.id),
          groupIds: props.filterGroupValue.map((x) => x.id),
    };
    }
    else{
        var lst = [];
        lst.push(props?.rowData.id);
        body = {
              unitIds: lst,
              userIds: props.filterValue.map((x) => x.id),
              groupIds: props.filterGroupValue.map((x) => x.id),
        };
    }

      const url =
      "/Stations/0"+         
      "/Units/" +
      `${props?.rowData?.id}` +
      "/AssignUsersToUnits";
      UnitsAndDevicesAgent.addUsersToUnits(
      url,body
  
    )
      .then(() => {
        setTimeout(() => {
          dispatch(getUnitInfoAsync(pageiGrid));
        }, 1510);
        props.setOnClose();
        props.showToastMsg({
          message: t("Unit_Assignees_updated"),
          variant: "success",
          duration: 7000,
          clearButtton: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
        setAlert(true);
        setResponseError(
          t(
            "We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator"
          )
        );
        return error;
      });
  };

  const cancelBtn = () => {
    /**
     * ! Below code is commented behalf of GEP-3886, it might be reverted back.
     */
    // if (initialfilterValue != props.filterValue) {
    //   setIsOpen(true);
    // } else {
    //   props.setOnClose();
    // }
    props.setOnClose();
  };

  return (
    <>
      <CRXAlert
        ref={alertRef}
        message={responseError}
        className="crxAlertUserEditForm"
        alertType="inline"
        type="error"
        open={alert}
        setShowSucess={() => null}
      />
      <div className="assignModalContent">
        <Formik initialValues={{}} onSubmit={() => onSubmitForm()}>
          {() => (
            <Form>
              <div className="assignFieldBlock">
                <div className="categoryTitle">
                  {t("Users")}
                  <b>*</b>
                </div>
                <div className="fieldAssigInput">
                  {users.data && <MultiSelectBoxCategory
                    className="categortAutocomplete"
                    multiple={true}
                    CheckBox={true}
                    visibility={true}
                    options={filterUser(users.data)}
                    value={props.filterValue}
                    autoComplete={true}
                    isSearchable={true}
                    onChange={(
                      event: any,
                      newValue: any,
                      reason: any,
                      detail: any
                    ) => {
                      return handleChange(event, 1, newValue, reason, detail);
                    }}
                  />}

              {isIncar == true ?   <>
                <div className="categoryTitle">
                  {t("Groups")}
                  <b>*</b>
                </div>
                {groups.data && <MultiSelectBoxCategory
                    className="categortAutocomplete"
                    multiple={true}
                    CheckBox={true}
                    visibility={true}
                    options={filterGroup(groups.data)}
                    value={props.filterGroupValue}
                    autoComplete={true}
                    isSearchable={true}
                    onChange={(
                      event: any,
                      newValue: any,
                      reason: any,
                      detail: any
                    ) => {
                      return handleChange1(event, 1, newValue, reason, detail);
                    }}
                  />}
                  </>
              : null}
              </div>
                <div className="fieldAssigSelectT">
                    {isShowInfo === true ? (
                      t("(Selected_users_will_replace_all_current_assigned_users)")
                    ) : null}

                  </div>
              </div>
              <div className="modalFooter CRXFooter">
                <div className="nextBtn">
                  <CRXButton
                    type="submit"
                    className='primeryBtn'
                    disabled={buttonState}
                  >
                    {t("Save")}
                  </CRXButton>
                </div>
                <div className="cancelBtn">
                  <CRXButton
                    onClick={cancelBtn}
                    className="cancelButton secondary"
                  >
                    {t("Cancel")}
                  </CRXButton>
                  <CRXConfirmDialog
                    setIsOpen={() => setIsOpen(false)}
                    onConfirm={closeDialog}
                    isOpen={isOpen}
                    className="userGroupNameConfirm"
                    primary={t("Yes_close")}
                    secondary={t("No,_do_not_close")}
                    text="user group form"
                  >
                    <div className="confirmMessage">
                      {t("You_are_attempting_to")}{" "}
                      <strong> {t("close")}</strong> {t("the")}{" "}
                      <strong>{t("'user form'")}</strong>.{" "}
                      {t("If_you_close_the_form")},
                      {t("any_changes_you_ve_made_will_not_be_saved.")}{" "}
                      {t("You_will_not_be_able_to_undo_this_action.")}
                      <div className="confirmMessageBottom">
                        {t("Are_you_sure_you_would_like_to")}{" "}
                        <strong>{t("close")}</strong> {t("the_form?")}
                      </div>
                    </div>
                  </CRXConfirmDialog>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default UnitDeviceAssignUser;
