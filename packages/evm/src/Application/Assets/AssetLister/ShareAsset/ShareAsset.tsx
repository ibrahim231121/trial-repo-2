import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory, CRXCheckBox, CRXRadio,CRXSelectBox } from '@cb/shared';
import { CRXButton } from '@cb/shared';
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
  const linkExpireOptions = [
    { value: 3, displayText: 'Infinite' },
    { value: 2, displayText: 'Days' },
    { value: 1, displayText: 'Hours' }
 ];




  const [currentRetention, setCurrentRetention] = React.useState<string>("-")
  const [originalRetention, setOriginalRetention] = React.useState<string>("-")

  const [retentionList, setRetentionList] = React.useState<evidenceModel[]>([])

  const [retentionDays, setRetentionDays] = React.useState<number>(0)
  let retentionRadio = [
    {
      value: "1", label: "Extend retention by days", Comp: () => { }
    },
    {
      value: "2", label: "Extend retention Indefinitely", Comp: () => { }
    }
  ]

  const [retentionOpt, setRetentionOpt] = React.useState<Retentionmodel[]>(retentionRadio)

  React.useEffect(() => {
    debugger;
    if (retentionList.length > 0) {
      sendData();
    }
    console.log('Curr_Retention',currentRetention);
  }, [retentionList]);

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
    //let permissions = [...dataPermissions]
    setLinkExpireType(e.target.value);
}
  const onSubmitForm = async () => {

  };
  const sendData = async () => {
    
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
