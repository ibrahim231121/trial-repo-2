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
import { RootState } from "../../../../Redux/rootReducer";
import { getAllUsersAsync } from "../../../../Redux/UserReducer";
import { addNotificationMessages } from "../../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../../Header/CRXNotifications/notificationsTypes";
import Cookies from "universal-cookie";
import moment from "moment";
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";
import { EvidenceAgent } from "../../../../utils/Api/ApiAgent";
import { AddOwner } from "../../../../utils/Api/models/EvidenceModels";
import { CMTEntityRecord } from "../../../../utils/Api/models/CommonModels";
import { useTranslation } from "react-i18next";
import { PageiGrid } from "../../../../GlobalFunctions/globalDataTableFunctions";
import { useHistory, useParams } from "react-router";
import { urlList, urlNames } from "../../../../utils/urlList";

type AssignUserProps = {
  selectedItems: any[];
  filterValue: any[];
  setFilterValue: (param: any) => void;
  rowData: any;
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
  showToastMsg: (obj: any) => any;
};

const cookies = new Cookies();

const AssignUser: React.FC<AssignUserProps> = (props) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [initialfilterValue, setInitialfilterValue] = React.useState(
    props.filterValue
  );

  const [buttonState, setButtonState] = React.useState(true);
  const [assetOwners, setAssetOwners] = React.useState<AddOwner[]>([]);
  const [responseError, setResponseError] = React.useState<string>("");
  const [alert, setAlert] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const alertRef = useRef(null);
  const users: any = useSelector(
    (state: RootState) => state.userReducer.users
  );
  const [assignUserCheck, setAssignUserCheck] = React.useState<boolean>(false);
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: 0,
    size: 25
})

  React.useEffect(() => {
    dispatch(getAllUsersAsync(pageiGrid));
    getData();
    //getMasterAsset();
  }, []);
  React.useEffect(() => {
    if (assetOwners.length > 0) {
      sendData();
    }
  }, [assetOwners]);

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
  const sendData = async () => {
    const url =
      "/Evidences/AssignUsers?IsChildAssetincluded=" + `${assignUserCheck}`;
    EvidenceAgent.addUsersToMultipleAsset(url, assetOwners)
      .then(() => {
        setTimeout(() => {
          dispatch(getAssetSearchInfoAsync(""));
        }, 1500);
        props.setOnClose();
        props.showToastMsg({
          message: t("Asset_Assignees_updated"),
          variant: "success",
          duration: 7000,
          clearButtton: true,
        });
      })
      .catch((error: any) => {
        setAlert(true);
        setResponseError(
          t(
            "We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator"
          )
        );
        return error;
      });
  };
  const getData = () => {
    let notSame = 0;
    if (props.selectedItems.length > 1) {
      let selectedItemsOwnerList = props.selectedItems.map(
        (x) => x.evidence?.masterAsset?.owners
      );
      for (var i = 0; i < selectedItemsOwnerList.length - 1; i++) {
        if (
          JSON.stringify(selectedItemsOwnerList[i]) !=
          JSON.stringify(selectedItemsOwnerList[i + 1])
        ) {
          notSame++;
        }
      }
      if (notSame == 0) {
        getMasterAsset();
      }
    } else {
      getMasterAsset();
    }
  };
  const closeDialog = () => {
    setIsOpen(false);
    history.push(
      urlList.filter((item: any) => item.name === urlNames.assets)[0].url
    );
  };
  const getMasterAsset = async () => {
    const url =
      "/Evidences/" +
      `${props.rowData.id}` +
      "/assets/" +
      `${props.rowData.assetId}`;
    EvidenceAgent.getAsset(url).then((response: any) => {
      let result = response.owners.map((x: CMTEntityRecord) => {
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
  };

  React.useEffect(() => {
    props.setFilterValue(() => props.filterValue);
    props.filterValue?.length > 0
      ? setButtonState(false)
      : setButtonState(true);
    // Dropdown is updated, so x button will redirect to cancel confirmation.
    // Check either new value added.
    const changeInValues = props.filterValue.filter((o: any) => {
      return !props.rowData.categories.some((i: string) => i === o.value);
    });
  }, [props.filterValue]);

  const filterUser = (arr: Array<any>): Array<any> => {
    let sortedArray: any = [];
    if (arr.length > 0) {
      for (const element of arr) {
        sortedArray.push({
          id: element.id,
          label: element.account.userName,
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
    props.setFilterValue(() => [...v]);
    if (reason === "remove-option") {
      // Show "Remove Category Reason" Modal Here.
      // Set value of removed option in to parent state.
      if (isNewlyAddedCategory(detail.option.label)) {
        props.setRemovedOption(detail.option);
      } else {
        //props.setIsformUpdated(false);
      }
    }
  };

  const isNewlyAddedCategory = (label: string): boolean => {
    let removedValueWasSaved = props.rowData.categories.some(
      (x: any) => x === label
    );
    if (removedValueWasSaved) {
      return true;
    }
    return false;
  };
  const onSubmitForm = async () => {
    setResponseError("");
    setAlert(false);
    if (props.selectedItems.length > 1) {
      var tempOwnerList = [...assetOwners];
      props.selectedItems.forEach((el) => {
        var temp: AddOwner = {
          evidenceId: el.id,
          assetId: el.assetId,
          owners: props.filterValue.map((x) => x.id),
        };
        tempOwnerList.push(temp);
      });
      setAssetOwners(tempOwnerList);
    } else {
      const url =
        "/Evidences/" +
        `${props.rowData.id}` +
        "/assets/" +
        `${props.rowData.assetId}` +
        "/AssignUsersToAssets?IsChildAssetincluded=" +
        `${assignUserCheck}`;
      EvidenceAgent.addUsersToAsset(
        url,
        props.filterValue.map((x) => x.id)
      )
        .then(() => {
          setTimeout(() => {
            dispatch(getAssetSearchInfoAsync(""));
          }, 1510);
          props.setOnClose();
          props.showToastMsg({
            message: t("Asset_Assignees_updated"),
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
    }
  };

  const cancelBtn = () => {
    if (initialfilterValue != props.filterValue) {
      setIsOpen(true);
    } else {
      props.setOnClose();
    }
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignUserCheck(e.target.checked);
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
                {users && <MultiSelectBoxCategory
                    className="categortAutocomplete"
                    multiple={true}
                    CheckBox={true}
                    visibility={true}
                    options={filterUser(users)}
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
                  <div className="fieldAssigSelectT">
                  {t("(Selected_users_will_replace_all_current_assigned_users)")}.
                   
                  </div>
                </div>
              </div>
              <div
                className="checkBoxAssign"
                style={{
                  display: `${
                    props.rowData.evidence.asset.length > 0 ? "" : "none"
                  }`,
                }}
              >
                <CRXCheckBox
                  inputProps={"assignUserCheck"}
                  className="relatedAssetsCheckbox"
                  lightMode={true}
                  checked={assignUserCheck}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleCheck(e)
                  }
                />
                {t("Apply_to_all_assets_in_the_group")}.
              </div>
              <div className="modalFooter CRXFooter">
                <div className="nextBtn">
                  <CRXButton
                    type="submit"
                    className={"nextButton " + buttonState && "primeryBtn"}
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

export default AssignUser;
