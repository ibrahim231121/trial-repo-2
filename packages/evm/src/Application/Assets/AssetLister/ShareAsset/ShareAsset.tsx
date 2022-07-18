import React from 'react';
import { Formik, Form } from 'formik';
import { CRXCheckBox, CRXSelectBox,CRXButton } from '@cb/shared';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import { AssetSharingModel } from '../../../../utils/Api/models/EvidenceModels';
import { useTranslation } from 'react-i18next';

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
  const [metaDataCheck, setMetaDataCheck] = React.useState<boolean>(false)
  const [downloadable, setDownloadable] = React.useState<boolean>(false)

  const [viewableOnce, setViewableOnce] = React.useState<boolean>(false)

  const [linkExpireType, setLinkExpireType] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [comment, setComment] = React.useState<string>("")
  const [reasonForView, setReasonForView] = React.useState<string>("")
  
  const [linkExpire, setLinkExpire] = React.useState<string>("")
  const [linkExpireDuration, setLinkExpireDuration] = React.useState<string>("")

  const [responseError, setResponseError] = React.useState<string>('');
  const [alert, setAlert] = React.useState<boolean>(false);
  const [emailError, setEmailError] = React.useState<string>('');
  const [showEmailError, setShowEmailError] = React.useState<boolean>(false);

  const regex = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
  
  const linkExpireOptions = [
    { value: 3, displayText: t("Infinite") },
    { value: 2, displayText: t("Days") },
    { value: 1, displayText: t("Hours") }
 ];

  const [currentRetention, setCurrentRetention] = React.useState<string>("-")
  const [assetSharing, setAssetSharing] = React.useState<AssetSharingModel>()

  React.useEffect(() => {
    
    if(assetSharing != null && emailError == "")
    {
      sendData();
    }
  }, [assetSharing]);
  React.useEffect(() => {
    debugger;
    if(linkExpireType == "1")//hour
    {
      setLinkExpireDuration(linkExpire);
    }
    else if(linkExpireType == "2")//day
    {
      let tmpExpireTime = parseInt(linkExpire)*24
      setLinkExpireDuration(tmpExpireTime+'');
    }
    else if(linkExpireType == "3")//infinite
    {
      setLinkExpireDuration(linkExpire);
    }
  }, [linkExpireType]);

  React.useEffect(() => {
    if (props.items.length <= 1)
      getRetentionData();

  }, []);
  React.useEffect(() => {
    
    
    if(email == "")
    {
      setEmailError('');
      setShowEmailError(false);
    }
    else if(regex.test(email) == false)
    {
      setEmailError('Invalid format');
      setShowEmailError(true);
    }
    
  },[email])

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetaDataCheck(e.target.checked)
  }
  const handleDownloadCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadable(e.target.checked)
  }
  const handleViewableCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewableOnce(e.target.checked)
  }
  
  const getRetentionData = async () => {
    
  }
  const onLinkExpireTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkExpireType(e.target.value);
}
  const onSubmitForm = async () => {
   
    let temp: AssetSharingModel = {
      message: comment,
      email: email,
      permissons: {
        isOneTimeViewable: viewableOnce,
        isDownloadable: downloadable,
        isAvailable: true,
        isViewable: true,
        isMetadataOnly: metaDataCheck
      },
      shared: {
        expiryDuration: parseInt(linkExpireDuration), //linkExpireDuration
        by: 1,
        on: new Date(),
        status: 'InProgress',
        type: 'Email'
      },
      revoked: {
        by: 1,
        on: undefined,
      },
      version: ''
    }

    setAssetSharing(temp);

  };
  const sendData = async () => {
    debugger;
    const url = '/Evidences/' + `${props.rowData.id}` + '/Assets/' + `${props.rowData.assetId}/Share`
    EvidenceAgent.shareAsset(url, assetSharing).then(() => {
      debugger;
      props.setOnClose();
      props.showToastMsg({
        message: "Share email sent to recipients",
        variant: "success",
        duration: 7000,
        clearButtton: true,
      });
    })
    .catch(function (error) {
      debugger;
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
  }


  return (
    <>
      <div style={{ height: "380px" }}>
        <Formik 
        initialValues={{email}} 
        onSubmit={() => onSubmitForm()}
        >
          {({ setFieldValue, values, errors, touched, dirty, isValid }) => (
            <>
            <Form>
              <div className='categoryTitle'>
                Email
              </div>
              <div >
                <input type="text"  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {showEmailError ? (
              <div className="errorStationStyle" style={{color: "red"}}>
                                 <i className="fas fa-exclamation-circle"></i> 
                                  {emailError}
                                </div>):null
              }
              <div style={{
                height: "0px", paddingTop: "5px",
                display: `${props.rowData.evidence.asset.length > 0
                  ? ""
                  : "none"
                  }`
              }}>
                <CRXCheckBox
                  inputProps={"metaDataCheck"}
                  className="relatedAssetsCheckbox"
                  lightMode={true}
                  checked={metaDataCheck}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => handleCheck(e)}
                />
                {t("Include_Metadata")}.
              </div>
              <div className='categoryTitle'>
                {t("Link_Expiry")}
              </div>
              <div >
                <input type="text"  value={linkExpire} onChange={(e) => setLinkExpire(e.target.value)} />
              
              <CRXSelectBox
                    className={`adVSelectBox createUserSelectBox`}
                    id="selectBoxLinkExpire"
                    value={linkExpireType}
                    onChange={(e: any) => onLinkExpireTypeChange(e)}
                    options={linkExpireOptions}
                    icon={true}
                    popover={"crxSelectPermissionGroup"}
                    defaultOptionText={linkExpireOptions[1].displayText}
                    defaultValue={linkExpireOptions[1].value} />
                    <div style={{
                height: "0px", paddingTop: "5px",
                display: `${props.rowData.evidence.asset.length > 0
                  ? ""
                  : "none"
                  }`
              }}>
                </div>
                <CRXCheckBox
                  inputProps={"assignUserCheck"}
                  className="relatedAssetsCheckbox"
                  lightMode={true}
                  checked={viewableOnce}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => handleViewableCheck(e)}
                />
                {t("Viewable_once")}
              </div>
              <div style={{
                height: "0px", paddingTop: "5px",
                display: `${props.rowData.evidence.asset.length > 0
                  ? ""
                  : "none"
                  }`
              }}>
                <CRXCheckBox
                  inputProps={"assignUserCheck"}
                  className="relatedAssetsCheckbox"
                  lightMode={true}
                  checked={downloadable}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => handleDownloadCheck(e)}
                />
                {t("Downloadable")}
              </div>
              <div className='categoryTitle'>
                Comments
              </div>
              <div >
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} ></textarea>
                {/* <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} /> */}
              </div>
              <div className='categoryTitle'>
              Reason for view
              </div>
              <div >
              <textarea  value={reasonForView} onChange={(e) => setReasonForView(e.target.value)} rows={3} ></textarea>
                {/* <input type="text" value={reasonForView} onChange={(e) => setReasonForView(e.target.value)} /> */}
              </div>
              <br />
              <br /><br />
              <br />

              <div className='modalFooter CRXFooter'>
                <div className='nextBtn'>
                  <CRXButton type='submit' className={'nextButton ' + buttonState && 'primeryBtn'} disabled={buttonState}>
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
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ShareAsset;
