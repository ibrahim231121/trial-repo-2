import React, { useEffect, useState, useRef } from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory, CRXCheckBox, CRXButton, CRXAlert } from '@cb/shared';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../../Redux/UserReducer";
import { EVIDENCE_SERVICE_URL } from '../../../../utils/Api/url'
import { addNotificationMessages } from '../../../../Redux/notificationPanelMessages';
import { NotificationMessage } from '../../../Header/CRXNotifications/notificationsTypes';
import Cookies from 'universal-cookie';
import moment from 'moment';
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import { AddOwner, Asset } from '../../../../utils/Api/models/EvidenceModels';
import { CMTEntityRecord } from '../../../../utils/Api/models/CommonModels';
import { useTranslation } from "react-i18next";

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
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  const [assetOwners, setAssetOwners] = React.useState<AddOwner[]>([]);
  const [responseError, setResponseError] = React.useState<string>('');
  const [alert, setAlert] = React.useState<boolean>(false);
  const alertRef = useRef(null);
  const users: any = useSelector(
    (state: RootState) => state.userReducer.usersInfo
  );
  const [assignUserCheck, setAssignUserCheck] = React.useState<boolean>(false)

  React.useEffect(() => {
    dispatch(getUsersInfoAsync());
    getData();
    //getMasterAsset();
  }, []);
  React.useEffect(() => {

    console.log('assetOwners', assetOwners);
    if (assetOwners.length > 0) {
      sendData();
    }
  }, [assetOwners]);


  useEffect(() => {

    if (responseError !== undefined && responseError !== '') {
      let notificationMessage: NotificationMessage = {
        title: 'User',
        message: responseError,
        type: 'error',
        date: moment(moment().toDate()).local().format('YYYY / MM / DD HH:mm:ss')
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [responseError]);
  useEffect(() => {
    const alertClx: any = document.getElementsByClassName("crxAlertUserEditForm");
    const optionalSticky: any = document.getElementsByClassName("optionalSticky");
    const altRef = alertRef.current;

    if (alert === false && altRef === null) {

      alertClx[0].style.display = "none";
      //optionalSticky[0].style.height = "79px"
    } else {
      alertClx[0].setAttribute("style", "display:flex;margin-top:42px;margin-bottom:42px");
      if (optionalSticky.length > 0) {
        optionalSticky[0].style.height = "119px"
      }
    }
  }, [alert]);

  const sendData = async () => {
    const url = '/Evidences/AssignUsers?IsChildAssetincluded=' + `${assignUserCheck}`
    EvidenceAgent.addUsersToMultipleAsset(url, assetOwners).then(() => {
      setTimeout(() => { dispatch(getAssetSearchInfoAsync("")) }, 1000);
      props.setOnClose();
      props.showToastMsg({
        message: "Asset Assignees updated",
        variant: "success",
        duration: 7000,
        clearButtton: true,
      });
    })
    .catch(function (error) {
      setAlert(true);
        setResponseError(
          "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
        );
      return error;
    });
  }
  const getData = () => {

    let notSame = 0;
    if (props.selectedItems.length > 1) {
      var selectedItemsOwnerList = props.selectedItems.map(x => x.evidence?.masterAsset?.owners);
      for (var i = 0; i < selectedItemsOwnerList.length - 1; i++) {
        if (JSON.stringify(selectedItemsOwnerList[i]) != JSON.stringify(selectedItemsOwnerList[i + 1])) {
          notSame++;
        }
      }
      if (notSame == 0) {
        getMasterAsset();
      }
    }
    else {
      getMasterAsset();
    }
  }
  const getMasterAsset = async () => {
    const url = '/Evidences/' + `${props.rowData.id}` + '/assets/' + `${props.rowData.assetId}`
    EvidenceAgent.getAsset(url).then((response: any) => {
      let result = response.owners.map((x: CMTEntityRecord) => {
        let item: any = {
          id: x.id.split("_")[2],
          label: x.record.length > 0 ? x.record.filter((t: any) => t.key === 'UserName')[0].value : ""
        }
        return item
      })
      props.setFilterValue(() => result);
    })
  }

  React.useEffect(() => {
    props.setFilterValue(() => props.filterValue);
    props.filterValue?.length > 0 ? setButtonState(false) : setButtonState(true);
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
          id: element.recId,
          label: element.userName
        });
      }
    }
    sortedArray = sortedArray.sort((a: any, b: any) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1));
    return sortedArray;
  };

  const handleChange = (e: any, colIdx: number, v: any, reason: any, detail: any) => {
    props.setFilterValue(() => [...v]);
    if (reason === 'remove-option') {
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
    let removedValueWasSaved = props.rowData.categories.some((x: any) => x === label);
    if (removedValueWasSaved) {
      return true;
    }
    return false;
  };
  const onSubmitForm = async () => {
    setResponseError('');
    setAlert(false);
    if (props.selectedItems.length > 1) {
      var tempOwnerList = [...assetOwners];
      props.selectedItems.forEach((el) => {
        var temp: AddOwner = {
          evidenceId: el.id,
          assetId: el.assetId,
          owners: props.filterValue.map(x => x.id)
        }
        tempOwnerList.push(temp);
      })
      setAssetOwners(tempOwnerList);
    }
    else {
      const url = '/Evidences/' + `${props.rowData.id}` + '/assets/' + `${props.rowData.assetId}` + '/AssignUsersToAssets?IsChildAssetincluded=' + `${assignUserCheck}`
      EvidenceAgent.addUsersToAsset(url, props.filterValue.map(x => x.id)).then(() => {
        props.setOnClose();
        props.showToastMsg({
          message: "Asset Assignees updated",
          variant: "success",
          duration: 7000,
          clearButtton: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
        setAlert(true);
        setResponseError(
          "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
        );
        return error;
      });
    }
  };

  const cancelBtn = () => {
    //if (props.filterValue?.length !== 0) {
    props.setOnClose();
    //}
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignUserCheck(e.target.checked)
  }

  return (
    <>
      <CRXAlert
        ref={alertRef}
        message={responseError}
        className='crxAlertUserEditForm'
        alertType='inline'
        type='error'
        open={alert}
        setShowSucess={() => null}
      />
      <div style={{ height: "200px" }}>
        <Formik initialValues={{}} onSubmit={() => onSubmitForm()}>
          {() => (
            <Form>
              <div className='categoryTitle'>
              {t("Users")}<b>*</b>
              </div>
              <div >
                <MultiSelectBoxCategory
                  className='categortAutocomplete'
                  multiple={true}
                  CheckBox={true}
                  visibility={true}
                  options={filterUser(users)}
                  value={props.filterValue}
                  autoComplete={false}
                  isSearchable={true}
                  onChange={(event: any, newValue: any, reason: any, detail: any) => {
                    return handleChange(event, 1, newValue, reason, detail);
                  }}
                />
              </div>
              <div style={{
                height: "100px", paddingTop: "20px",
                display: `${props.rowData.evidence.asset.length > 0
                  ? ""
                  : "none"
                  }`
              }}>
                <CRXCheckBox
                  inputProps={"assignUserCheck"}
                  className="relatedAssetsCheckbox"
                  lightMode={true}
                  checked={assignUserCheck}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => handleCheck(e)}
                />
                {t("Apply_to_all_assets_in_the_group")}.
              </div>
              <div className='modalFooter CRXFooter'>
                <div className='nextBtn'>
                  <CRXButton type='submit' className={'nextButton ' + buttonState && 'primeryBtn'} >
                    {t("Save")}
                  </CRXButton>
                </div>
                <div className='cancelBtn'>
                  <CRXButton onClick={cancelBtn} className='cancelButton secondary'>
                  {t("Cancel")}
                  </CRXButton>
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
