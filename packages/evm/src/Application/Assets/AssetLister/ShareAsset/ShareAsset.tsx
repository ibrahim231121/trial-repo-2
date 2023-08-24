import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { CRXCheckBox, CRXSelectBox, CRXButton } from "@cb/shared";
import { EvidenceAgent, getUserId } from "../../../../utils/Api/ApiAgent";
import { AssetSharingModel, AssetShareLink } from "../../../../utils/Api/models/EvidenceModels";
import { useTranslation } from "react-i18next";
import "./ShareAsset.scss";
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import { ActionMenuPlacement } from "../ActionMenu/types";
import truncateMiddle from "truncate-middle";
import { clearAllGroupedSelectedAssets } from "../../../../Redux/groupedSelectedAssets";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/rootReducer";

type ShareAssetProps = {
  items: any[];
  filterValue: any[];
  //setFilterValue: (param: any) => void;
  rowData: any;
  childAssets: any[];
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
  showToastMsg: (obj: any) => any;
  actionPlacement: any;
};

const ShareAsset: React.FC<ShareAssetProps> = (props) => {
  const { t } = useTranslation<string>();
  const [buttonState, setButtonState] = React.useState<boolean>(true);
  const [groupedAssetsIncluded,setGroupedAssetsIncluded] = React.useState<boolean>(false);
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
  const [linkExpireDisableState, setLinkExpireDisableState] = React.useState<boolean>(false);


  const [reasonCheck, setreasonCheck] = React.useState<string>("");
  const [commentCheck, setcommentCheck] = React.useState<string>("");

  const [linkExpireCheck, setlinkExpireCheck] = React.useState<string>("");

  const [showreasonCheckError, setShowreasonCheckError] =
    React.useState<boolean>(false);
  const [showcommentCheckError, setShowcommentCheckError] =
    React.useState<boolean>(false);
  const [showLinkExpirationError, setShowLinkExpirationError] =
    React.useState<boolean>(false);
  const [meteDataErrMsg, setMetaDataErrMsg] = React.useState({
    required: "",
  });
  const regexEmail = /^(?:\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*\s?[^\s,]+@[^\s,]+\.[^\s,]+$/;
  const regexSpecialChar = /^[^*|\":<>[\]{}`\\()';%/?@!#&$]+$/;
  const regexEmailDot = /^(?!\.)(?!.*\.$)(?!.*\.\.)/;
  const regexAttherate = /^(?!.*@.*@).*@.*$/;
  const regexAlpha = /^[A-Za-z]+$/;
  const linkExpireOptions = [
    { value: 1, displayText: t("Hour(s)") },
    { value: 2, displayText: t("Day(s)") },
    { value: 3, displayText: t("No_Expiration") },
  ];
  const dispatch = useDispatch();
  const [assetSharing, setAssetSharing] = React.useState<AssetSharingModel[]>();
  const { getTenantId } = useContext(ApplicationPermissionContext);
  const groupedSelectedAssets: any = useSelector(
	  (state: RootState) => state.groupedSelectedAssetsReducer.groupedSelectedAssets
	);
  React.useEffect(() => {
    if (assetSharing != null && emailError == "W") {
      sendData();
    }
  }, [assetSharing]);
  React.useEffect(() => {
    
    if (linkExpireType == "1")//hour
    {
      setLinkExpireDisableState(false);
      setLinkExpireDuration(linkExpire);
    } else if (linkExpireType == "2") {
      //day
      setLinkExpireDisableState(false);
      let tmpExpireTime = parseInt(linkExpire) * 24;
      setLinkExpireDuration(tmpExpireTime + "");
    } else if (linkExpireType == "3") {
      //infinite
      setShowLinkExpirationError(false);
      setLinkExpireDisableState(true);
      setlinkExpireCheck("");
      setLinkExpire('');
      setLinkExpireDuration(linkExpire);
    }
    validateFields();
  }, [linkExpireType]);

  React.useEffect(() => {
    validateFields();
  }, [showLinkExpirationError]);


  React.useEffect(() => {
    validateEmail(false);
    
  }, [email]);

  React.useEffect(() => {
    if (reasonForView == "") {
      setreasonCheck("Reason of sharing is required");
      setButtonState(true);
      setShowreasonCheckError(false);
    }
    else if (reasonForView.length > 1) {
      setreasonCheck("");
      setButtonState(false);
      setShowreasonCheckError(false);
    } else {
      setreasonCheck("Invalid format");
      setButtonState(true);
      setShowreasonCheckError(true);
    }
    validateFields();
  }, [reasonForView]);
  React.useEffect(() => {
    if (comment.length > 1000) {
      setcommentCheck("Characters must be less than or equal to 1000");
      setButtonState(true);
      setShowcommentCheckError(true);
    }
    else {
      setcommentCheck("");
      setButtonState(false);
      setShowcommentCheckError(false);
    }
    validateFields();
  }, [comment]);
  React.useEffect(() => {
    
    if (linkExpire == "" && linkExpireType != "3") {
      setlinkExpireCheck("Link Expiration is required");
      setButtonState(false);
      setShowLinkExpirationError(false);
    }
    else if (linkExpire.length >= 1 && linkExpire.length < 5) {
      setlinkExpireCheck("");
      setButtonState(false);
      setShowLinkExpirationError(false);
      
    }
    else if (linkExpire.length >= 5) {
      setlinkExpireCheck("The value is too large");
      setButtonState(false);
      setShowLinkExpirationError(false);
    }
    
    if (linkExpireType == "1")//hour
    {
      setLinkExpireDisableState(false);
      setLinkExpireDuration(linkExpire);
    } else if (linkExpireType == "2") {
      //day
      setLinkExpireDisableState(false);
      let tmpExpireTime = parseInt(linkExpire) * 24;
      setLinkExpireDuration(tmpExpireTime + "");
    } else if (linkExpireType == "3") {
      //infinite
      setLinkExpireDisableState(true);
      setLinkExpire('');
      setLinkExpireDuration(linkExpire);
    }

    validateFields();
  }, [linkExpire]);
  const validateEmail = (isFieldLeft:boolean = true) => {
    let isNotValid = 0;
    if (email == "" && isFieldLeft == true) {
      setEmailError("Email is required");
      setButtonState(true);
      setShowEmailError(true);
    }
    else if (regexEmail.test(email) == false && email.length > 0) {
      setEmailError("Invalid format");
      setButtonState(true);
      setShowEmailError(true);
    } 
    else if (regexEmail.test(email) == true) {
      var emailList = email.split(",");
      
      emailList.forEach(e => {
        var attherate = e.split("@");
        var dotSeperated = attherate[1].split(".");
        var unique = Array.from(new Set(dotSeperated));
        if(regexSpecialChar.test(attherate[0]) == false || regexSpecialChar.test(attherate[1]) == false 
        || regexAttherate.test(e) == false || regexEmailDot.test(attherate[0]) == false
        || regexEmailDot.test(attherate[1]) == false)
        {
          isNotValid++;
        }
        if(dotSeperated.length > unique.length)
        {
          isNotValid++;
        }

        else
        {
          dotSeperated.forEach(e => {
            if(e.length < 2 || regexAlpha.test(e) == false)
            {
              isNotValid++;
            }
          });
        }
        
      });
      if(isNotValid == 0)
      {
        setEmailError("W");
        setButtonState(false);
        setShowEmailError(false);
      }
      else
      {
        setEmailError("Invalid format");
        setButtonState(true);
        setShowEmailError(true);
      }
      validateFields();
    }

  }
  const checkEmail = () => {
    validateEmail();
   
  };
  const validateFields =() => {
    
    if(showLinkExpirationError == false && reasonForView.length > 0 && showEmailError == false && comment.length <= 1000 
      && email.length > 0 && ((linkExpire == "" && linkExpireType == "3") || (linkExpire != "" && linkExpireType != "3")) && linkExpire != "0" && linkExpire.length < 5 )
    {
      setButtonState(false);
    }
    else
    {
      setButtonState(true);
    }
  }
  const checkSharingReason = () => {
    if (reasonForView == "") {
      setreasonCheck("Reason of sharing is required");
      setButtonState(true);
      setShowreasonCheckError(true);
    } else {
      setreasonCheck("W");
      setButtonState(false);
      setShowreasonCheckError(false);
    }
    validateFields();
  };
  const checkComment = () => {
    if (comment.length > 1000) {
      setcommentCheck("Characters must be less than or equal to 1000");
      setButtonState(true);
      setShowcommentCheckError(true);
    } else {
      setcommentCheck("W");
      setButtonState(false);
      setShowcommentCheckError(false);
    }
    validateFields();
  };
  const checkExpirationLink = () => {
    
    if ((linkExpire == "" || linkExpire == "0") && linkExpireType != "3") {
      setlinkExpireCheck("Link Expiration is required");
      //setShowReasonError(true)
      setButtonState(true);
      setShowLinkExpirationError(true);
    } 
    else if (linkExpire.length >= 5) {
      setlinkExpireCheck("The value is too large");
      setButtonState(true);
      setShowLinkExpirationError(true);
    }
    else {
      setlinkExpireCheck("W");
      //setShowReasonError(false)
      setButtonState(false);
      setShowLinkExpirationError(false);
    }
    validateFields();
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetaDataCheck(e.target.checked);
  };
  const handlegroupedAssetsCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupedAssetsIncluded(e.target.checked);
  }
  const handleDownloadCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadable(e.target.checked);
  };
  const handleViewableCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewableOnce(e.target.checked);
  };


  const onLinkExpireTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkExpireType(e.target.value);
    setMetaDataErrMsg({ ...meteDataErrMsg, required: "" });
  };
  const onSubmitForm = async () => {
    let tId = getTenantId();
    let rowObject: AssetShareLink[] = [];
    setButtonState(true);
    if(groupedAssetsIncluded == true) //Share all assets from assetDetail page
    {
      props.rowData.evidence?.asset?.forEach((x:any) => 
      {
      rowObject.push({
        masterId: props.rowData.assetId,
        assetId: x.assetId,
        evidenceId: (props.rowData.id == undefined) ? props.rowData.evidence.id : props.rowData.id,
        assetName: x.assetName,
        fileType: x.files[0].type,
        assetType: x.assetType,
      })
    })
    }
    else
    {
    if (props.items.length > 0) {

      props.items.forEach((x) => {
        rowObject.push({
          masterId: x.evidence.masterAsset.assetId,
          assetId: x.assetId,
          evidenceId: x.id == undefined ? x.evidence.id : x.id,
          assetName: x.evidence.asset.find((asset:any) => asset.assetId == x.assetId).assetName,
          fileType: x.evidence.asset.find((asset:any) => asset.assetId == x.assetId).files[0].type,
          assetType: x.evidence.asset.find((asset:any) => asset.assetId == x.assetId).assetType,

        })
      });
    }
    else {
      rowObject.push({
        masterId: props.rowData.assetId,
        assetId: props.rowData.assetId,
        evidenceId: (props.rowData.id == undefined) ? props.rowData.evidence.id : props.rowData.id,
        assetName: props.rowData.evidence.asset.find((x:any) => x.assetId == props.rowData.assetId).assetName,
        fileType: props.rowData.evidence.asset.find((x:any) => x.assetId == props.rowData.assetId).files[0].type,
        assetType: props.rowData.evidence.asset.find((x:any) => x.assetId == props.rowData.assetId).assetType,
      })
    }
    if (props.childAssets.length > 0 && props.actionPlacement != ActionMenuPlacement.AssetDetail) {
      props.childAssets.forEach((c) => {
        if(rowObject.filter(x => x.assetName == c.assetName).length == 0)
        {
        rowObject.push({
          masterId: c.masterId,
          assetId: c.assetId,
          evidenceId: c.evidenceId,
          assetName: c.assetName,
          fileType: c.fileType,
          assetType: c.assetType,
        });
      }
      });
    }
  }

    let temp: AssetSharingModel[] = [];
    var userId = parseInt(getUserId());

    rowObject.forEach((x) => {
      temp.push({
        assetId: x.assetId,
        masterId: x.masterId,
        evidenceId: x.evidenceId,
        assetName: x.assetName,
        assetType: x.assetType,
        fileType: x.fileType,

        tenantId: tId,
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
          by: userId,
          on: new Date(),
          status: "InProgress",
          type: "Email",
        },
        revoked: {
          by: 1,
          on: undefined,
        },
        version: "",
        sharingReason: reasonForView,
      });
    })
    dispatch(clearAllGroupedSelectedAssets());
    setAssetSharing(temp);
  };
  const sendData = async () => {
    const url = '/Evidences/Share'// + `${props.items}`
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
      Comp: () => { },
    },
    {
      id: 2,
      value: "Downloadable",
      isDisabled: false,
      label: "Downloadable",
      Comp: () => { },
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
                  className={`__CRX__ShareAssets__Layout __CRX__ShareAssets__Layout__Email ${showEmailError === true ? "__CRX__Share__Error" : ""
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

                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="__CRX__ShareAssets__Layout">
                  <div
                    className={`__CRX__ShareAssets__Layout ${showLinkExpirationError == true ? "__CRX__Share__Error" : ""
                      }`}
                  >
                    <div className="categoryTitle __CRX__Title__Share">
                      {t("Link_Expiration")}
                      <span>*</span>
                    </div>
                    <div className="CBX-input _Crx_link_ ">
                      <span className="">
                        <input
                          type="number"
                          className="crx-input"
                          min="1"
                          onBlur={checkExpirationLink}
                          required={true}
                          value={linkExpire}
                          onChange={(e) => setLinkExpire(e.target.value)}
                          disabled={linkExpireDisableState}
                        />
                        <div>{showLinkExpirationError ? (
                          <div className="errorStationStyle">
                            <i className="fas fa-exclamation-circle"></i>
                            {linkExpireCheck}
                          </div>
                        ) : null}</div>
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
                </div>

                <div className="__Crx_checkbox__Share">
                  <div className="categoryTitle __CRX__Title__Share __Crx_Radio__Share">
                    {t("Link_Permissions")}
                  </div>
                  <div
                    className="__CRX__CheckBox__Share__Align"
                    style={{
                      // display: `${props.rowData.evidence.asset.length > 0 ? "" : "none"
                      display: `${props.rowData != undefined ? 
                                  props.rowData.evidence.asset.length > 0 ? "" : "none" 
                                  : 
                                  props.items.length > 0 ? "" : "none" 
                        }`,
                    }}
                  >
                    {(props.actionPlacement == ActionMenuPlacement.AssetDetail || props.actionPlacement == ActionMenuPlacement.AssetLister) ? (
                    <div>
                      <CRXCheckBox
                        inputProps={"groupedAssetsIncluded"}
                        className="relatedAssetsCheckbox"
                        lightMode={true}
                        checked={groupedAssetsIncluded}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handlegroupedAssetsCheck(e)
                        }
                      />
                      {t("Include_AllGroupedAssets")}
                    </div>
                    ) : null}
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

                <div
                  className={`__CRX__ShareAssets__Layout ${showcommentCheckError == true ? "__CRX__Reason__Error" : ""
                    }`}
                >
                  <div className="categoryTitle __CRX__Title__Share">
                    {t("Comments")}
                  </div>
                  <div className=" CBX-input __CRX__TextArea__Share">
                    <textarea
                      className="crx-category-scroll"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onBlur={checkComment}
                    ></textarea>
                    {showcommentCheckError ? (
                      <div className="errorStationStyle">
                        <i className="fas fa-exclamation-circle"></i>
                        {commentCheck}
                      </div>
                    ) : null}
                    {/* <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} /> */}
                  </div>
                </div>

                <div
                  className={`__CRX__ShareAssets__Layout ${showreasonCheckError == true ? "__CRX__Reason__Error" : ""
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
                      disabled={buttonState}
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
