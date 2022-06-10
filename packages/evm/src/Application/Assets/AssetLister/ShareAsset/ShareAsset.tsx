import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory, CRXCheckBox, CRXRadio,CRXSelectBox,CRXButton } from '@cb/shared';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../../Redux/rootReducer";
import { USER_INFO_GET_URL } from '../../../../utils/Api/url'
import Cookies from 'universal-cookie';
import useGetFetch from "../../../../utils/Api/useGetFetch";
import { EVIDENCE_SERVICE_URL } from "../../../../utils/Api/url";
import moment from "moment";
import { log } from 'console';
import { Link } from 'react-router-dom';

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

  const dispatch = useDispatch();
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  const [metaDataCheck, setMetaDataCheck] = React.useState<boolean>(false)
  const [downloadable, setDownloadable] = React.useState<boolean>(false)

  const [viewableOnce, setViewableOnce] = React.useState<boolean>(false)

  const [linkExpireType, setLinkExpireType] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [linkExpire, setLinkExpire] = React.useState<string>("")
  const [responseError, setResponseError] = React.useState<string>('');
  const [alert, setAlert] = React.useState<boolean>(false);
  
  type Retentionmodel = {
    value: string;
    label: string;
    Comp: any;
  };
  type assetModel = {
    master: any,
    children: any
  }
  type stationModel = {
    CMTFieldValue: number
  }
  type RetentionPolicyModel = {
    CMTFieldValue: number
  }

  type evidenceModel = {
    Id: any,
    ExtendedDays: number,
  }
  type PermissionModel = {
    isOneTimeViewable: boolean,
    isDownloadable: boolean,
    isAvailable: boolean,
    isViewable: boolean,
    isMetadataOnly: boolean
  }
  type SharedModel = {
    expiryDuration: number,
    by: number,
    on: Date,
    status: string,
    type: string
  }
  type RevokedModel = {
    by: number,
    on: Date,
  }
  type AssetSharingModel = 
    {
        Message: string,
        Permissons: PermissionModel,
        Shared: SharedModel,
        Revoked: RevokedModel,
        //CreatedOn
        //ModifiedOn
        Version: string
    }
  const linkExpireOptions = [
    { value: 3, displayText: 'Infinite' },
    { value: 2, displayText: 'Days' },
    { value: 1, displayText: 'Hours' }
 ];

  const [currentRetention, setCurrentRetention] = React.useState<string>("-")
  const [assetSharing, setAssetSharing] = React.useState<AssetSharingModel>()

  const [retentionList, setRetentionList] = React.useState<evidenceModel[]>([])

  const [retentionDays, setRetentionDays] = React.useState<number>(0)

  React.useEffect(() => {
    debugger;
    if(assetSharing != null)
    {
      sendData();
    }
  }, [assetSharing]);

  React.useEffect(() => {
    if (props.items.length <= 1)
      getRetentionData();

  }, []);

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
    debugger;
    var temp: AssetSharingModel = {
      Message: email,
      Permissons: {
        isOneTimeViewable: viewableOnce,
        isDownloadable: downloadable,
        isAvailable: true,
        isViewable: true,
        isMetadataOnly: metaDataCheck
      },
      Shared: {
        expiryDuration: parseInt(linkExpire),
        by: 1,
        on: new Date("2021-03-08T15:14:53.251Z"),
        status: 'InProgress',
        type: 'Email'
      },
      Revoked: {
        by: 1,
        on: new Date("2021-03-08T15:14:53.251Z"),
      },
      Version: ''
    }

    setAssetSharing(temp);

  };
  const sendData = async () => {
    debugger;
    const url = EVIDENCE_SERVICE_URL + '/Evidences/' + `${props.rowData.id}` + '/Assets/' + `${props.rowData.assetId}/Share`
    await fetch(url, 
      {
        method:'POST',
        headers:{ 'Content-Type': 'application/json', TenantId:'1', 'Authorization': `Bearer ${cookies.get('access_token')}`},
        body: JSON.stringify(assetSharing)
      })
      .then(function (res) {
        if (res.ok) {
          debugger
          props.setOnClose();
          props.showToastMsg({
            message: "Share email sent to recipients",
            variant: "success",
            duration: 7000,
            clearButtton: true,
          });
        }
        else if (res.status == 500) {
          setAlert(true);
          setResponseError(
            "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
          );
        }
      })
      .catch(function (error) {
        return error;
      });
  }

  const cancelBtn = () => {
    props.setOnClose();
  };

  return (
    <>
      <div style={{ height: "270px" }}>
        <Formik initialValues={{}} onSubmit={() => onSubmitForm()}>
          {() => (
            <Form>
              <div className='categoryTitle'>
                Email
              </div>
              <div >
                <input type="text"  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
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
                Include Metadata.
              </div>
              <div className='categoryTitle'>
                Link Expiry
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
                Viewable once
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
                Downloadable
              </div>
              <div className='modalFooter CRXFooter'>
                <div className='nextBtn'>
                  <CRXButton type='submit' className={'nextButton ' + buttonState && 'primeryBtn'} disabled={buttonState}>
                    Save
                  </CRXButton>
                </div>
                <div className='cancelBtn'>
                  <CRXButton onClick={cancelBtn} className='cancelButton secondary'>
                    Cancel
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

export default ShareAsset;
