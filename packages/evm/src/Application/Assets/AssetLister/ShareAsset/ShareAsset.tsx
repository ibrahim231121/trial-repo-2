import React from "react";
import { Formik, Form } from "formik";
import { CRXCheckBox, CRXSelectBox, CRXButton, CRXRadio } from "@cb/shared";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { EvidenceAgent } from "../../../../utils/Api/ApiAgent";
import { AssetSharingModel } from "../../../../utils/Api/models/EvidenceModels";
import { useTranslation } from "react-i18next";
import "./ShareAsset.scss";

type ShareAssetProps = {
  items: any[];
  filterValue: any[];
  //setFilterValue: (param: any) => void;
  rowData: any;
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
  showToastMsg: (obj: any) => any;
};

const cookies = new Cookies();

const ShareAsset: React.FC<ShareAssetProps> = (props) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  const [metaDataCheck, setMetaDataCheck] = React.useState<boolean>(false);
  const [downloadable, setDownloadable] = React.useState<boolean>(false);

  const [viewableOnce, setViewableOnce] = React.useState<boolean>(false);

  const [linkExpireType, setLinkExpireType] = React.useState<string>("2")
  const [email, setEmail] = React.useState<string>("")
  const [comment, setComment] = React.useState<string>("")
  const [reasonForView, setReasonForView] = React.useState<string>("")
  
  const [linkExpire, setLinkExpire] = React.useState<string>("1")
  const [linkExpireDuration, setLinkExpireDuration] = React.useState<string>("")



  const [responseError, setResponseError] = React.useState<string>("");
  const [alert, setAlert] = React.useState<boolean>(false);
  const [emailError, setEmailError] = React.useState<string>("");
  const [showEmailError, setShowEmailError] = React.useState<boolean>(false);
  const [showReasonError, setShowReasonError] = React.useState<boolean>(false);

  const [radioCheck, setRadioCheck] = React.useState<string>("");
  const [reasonCheck, setreasonCheck] = React.useState<string>("");
  const [showreasonCheckError, setShowreasonCheckError] =
    React.useState<boolean>(false);
  const [meteDataErrMsg, setMetaDataErrMsg] = React.useState({
    required: "",
  });
  const regex =
    /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;

  const linkExpireOptions = [
    { value: 1, displayText: t("Hour(s)") },
    { value: 2, displayText: t("Day(s)") },
    { value: 3, displayText: t("No_Expiration") },
  ];

  const [currentRetention, setCurrentRetention] = React.useState<string>("-");
  const [assetSharing, setAssetSharing] = React.useState<AssetSharingModel>();
  const [error, setError] = React.useState({
    emailErr: "",
    
  });


  React.useEffect(() => {
    if (assetSharing != null && emailError == "W") {
      sendData();
    }
  }, [assetSharing]);
  React.useEffect(() => {
    if(linkExpireType == "1")//hour
    {
      setLinkExpireDuration(linkExpire);
    } else if (linkExpireType == "2") {
      //day
      let tmpExpireTime = parseInt(linkExpire) * 24;
      setLinkExpireDuration(tmpExpireTime + "");
    } else if (linkExpireType == "3") {
      //infinite
      setLinkExpireDuration(linkExpire);
    }
  }, [linkExpireType]);

  React.useEffect(() => {
    if (props.items.length <= 1) getRetentionData();
  }, []);
  React.useEffect(() => {
    if (email == "" || regex.test(email) == true) {
      setEmailError("");
      setShowEmailError(false);
    } else if (regex.test(email) == false) {
      setEmailError("Invalid format");
      setShowEmailError(true);
    }
  }, [email]);

  React.useEffect(() => {
    if (reasonForView == "") {
      setreasonCheck("Reason of sharing is required");
      setShowreasonCheckError(false);
    }
    else if (reasonForView.length > 1) {
      setreasonCheck("");
      setShowreasonCheckError(false);
    } else {
      setreasonCheck("Invalid format");
      setShowreasonCheckError(true);
    }
  }, [reasonForView]);
  console.log(reasonForView, "checkreason");

  console.log(reasonForView, "reason");
  const checkEmail = () => {
    if (email == "") {
      setEmailError("Email is required");
      setShowEmailError(true);
    } else {
      setEmailError("W");
      setShowEmailError(false);
    }
  };
  const checkSharingReason = () => {
    if (reasonForView == "") {
      setreasonCheck("Reason of sharing is required");
      //setShowReasonError(true);
      setShowreasonCheckError(true);
    } else {
      setreasonCheck("W");
      //setShowReasonError(false);
      setShowreasonCheckError(false);
    }
  };
  
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetaDataCheck(e.target.checked);
  };
  const handleDownloadCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadable(e.target.checked);
  };
  const handleViewableCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewableOnce(e.target.checked);
  };

  const getRetentionData = async () => {};
  const onLinkExpireTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkExpireType(e.target.value);
    setMetaDataErrMsg({ ...meteDataErrMsg, required: "" });
  };
  const onSubmitForm = async () => {
    let temp: AssetSharingModel = {
      message: comment,
      email: email,
      permissons: {
        isOneTimeViewable: viewableOnce,
        isDownloadable: downloadable,
        isAvailable: true,
        isViewable: true,
        isMetadataOnly: metaDataCheck,
      },
      shared: {
        expiryDuration: parseInt(linkExpireDuration), //linkExpireDuration
        by: 1,
        on: new Date(),
        status: "InProgress",
        type: "Email",
      },
      revoked: {
        by: 1,
        on: undefined,
      },
      version: "",
    };

    setAssetSharing(temp);
  };
  const sendData = async () => {
    const url = '/Evidences/' + `${props.rowData.id}` + '/Assets/' + `${props.rowData.assetId}/Share`
    EvidenceAgent.shareAsset(url, assetSharing).then(() => {
      props.setOnClose();
      props.showToastMsg({
        message: "Share email sent to recipients",
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
  

  const cancelBtn = () => {
    props.setOnClose();
  };
  const validateMultipleEmails = () => {
    // Get value on emails input as a string
    let emails = email.split(",");

    for (let i = 0; i < emails.length; i++) {
      // Trim whitespaces from email address
      emails[i] = emails[i].trim();
    }
  };

  const RadioBtnValues = [
    {
      id: 1,
      value: "Viewable Once",
      isDisabled: false,
      label: "Viewable Once",
      Comp: () => {},
    },
    {
      id: 2,
      value: "Downloadable",
      isDisabled: false,
      label: "Downloadable",
      Comp: () => {},
    },
  ];

  return (
    <>
      <div className="__Crx__Share__Asset__Modal">
        <Formik initialValues={{ email }} onSubmit={() => onSubmitForm()}>
          {({ setFieldValue, values, errors, touched, dirty, isValid }) => (
            <>
              <Form>
                <div className="CrxCreateUser">
                  <div className="CrxIndicates">
                    <sup>*</sup> {t("Indicates_required_field")}
                  </div>
                </div>
                <div
                  className={`__CRX__ShareAssets__Layout __CRX__ShareAssets__Layout__Email ${
                    showEmailError === true ? "__CRX__Share__Error" : ""
                  }`}
                >
                  <div className="categoryTitle">
                    Email <span>*</span>
                  </div>
                  <div className="CBX-input">
                    <input
                      type="text"
                      className="crx-input"
                      value={email}
                      required={true}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={checkEmail}
                    />
                    {showEmailError ? (
                      <div className="errorStationStyle">
                        <i className="fas fa-exclamation-circle"></i>
                        {emailError}
                        {console.log(emailError, "emailcheck")}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="__CRX__ShareAssets__Layout">
                  <div className="categoryTitle __CRX__Title__Share">
                    {t("Link_Expiration")}
                    <span>*</span>
                  </div>
                  <div className="CBX-input _Crx_link_ ">
                    <span className="CRX__Number__Wrapper">
                    <input
                      type="number"
                      min="0"
                      value={linkExpire}
                      onChange={(e) => setLinkExpire(e.target.value)}
                    />
                
                  </span>
         
                    <CRXSelectBox
                      className={`adVSelectBox createUserSelectBox`}
                      id="selectBoxLinkExpire"
                      value={linkExpireType}
                      onChange={(e: any) => onLinkExpireTypeChange(e)}
                      options={linkExpireOptions}
                      icon={true}
                      isRequried={true}
                      error={meteDataErrMsg.required == "" ? true : false}
                      errorMsg={meteDataErrMsg.required}
                      popover={"crxSelectPermissionGroup"}
                      defaultOptionText={linkExpireOptions[1].displayText}
                      defaultValue={linkExpireOptions[1].value}
                    />
                  </div>
                </div>

                <div className="__Crx_checkbox__Share">
                  <div className="categoryTitle __CRX__Title__Share __Crx_Radio__Share">
                    {t("Link_Permissions")}
                  </div>
                  <div
                  className="__CRX__CheckBox__Share__Align"
                    style={{
                      display: `${
                        props.rowData.evidence.asset.length > 0 ? "" : "none"
                      }`,
                    }}
                  >
                    <div>
                    <CRXCheckBox
                      inputProps={"metaDataCheck"}
                      className="relatedAssetsCheckbox"
                      lightMode={true}
                      checked={metaDataCheck}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleCheck(e)
                      }
                    />
                    {t("Include_Metadata")}
                    </div>
                    <div>
                    <CRXCheckBox
                      inputProps={"assignUserCheck"}
                      className="relatedAssetsCheckbox"
                      lightMode={true}
                      checked={viewableOnce}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleViewableCheck(e)
                      }
                    />
                    {t("Viewable_Once")}
                    </div>
                    <div>
                    <CRXCheckBox
                      inputProps={"assignUserCheck"}
                      className="relatedAssetsCheckbox"
                      lightMode={true}
                      checked={downloadable}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleDownloadCheck(e)
                      }
                    />
                    {/* <CRXRadio className="usama" value={radioCheck} setValue={setRadioCheck} content={RadioBtnValues} /> */}
                    {t("Downloadable")}
                    </div>
                  </div>
                </div>

                <div className="__CRX__ShareAssets__Layout">
                  <div className="categoryTitle __CRX__Title__Share">
                    {t("Comments")}
                  </div>
                  <div className=" CBX-input __CRX__TextArea__Share">
                    <textarea
                      className="crx-category-scroll"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    {/* <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} /> */}
                  </div>
                </div>

                <div
                  className={`__CRX__ShareAssets__Layout ${
                    showreasonCheckError == true ? "__CRX__Reason__Error" : ""
                  }`}
                >
                  <div className="categoryTitle __CRX__Title__Share __CRX__Title__Reason">
                  {t("Reason_for_Sharing")}<span>*</span>
                  </div>
                  <div className="CBX-input __CRX__TextArea__Share">
                    <textarea
                      className="crx-category-scroll"
                      value={reasonForView}
                      onChange={(e) => setReasonForView(e.target.value)}
                      onBlur={checkSharingReason}
                      required={true}
                    ></textarea>
                    {showreasonCheckError ? (
                      <div className="errorStationStyle">
                        <i className="fas fa-exclamation-circle"></i>
                        {reasonCheck}
                      </div>
                    ) : null}
                    {/* <input type="text" value={reasonForView} onChange={(e) => setReasonForView(e.target.value)} /> */}
                  </div>
                </div>

                <div className="modalFooter CRXFooter">
                  <div className="nextBtn">
                    <CRXButton
                      type="submit"
                      className={"primeryBtn"}
                     
                    >
                      {t("Share asset")}
                    </CRXButton>
                  </div>
                  <div className="cancelBtn">
                    <CRXButton
                      onClick={cancelBtn}
                      className="cancelButton secondary"
                    >
                      {t("Cancel")}
                    </CRXButton>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ShareAsset;
