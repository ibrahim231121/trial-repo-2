import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory, CRXCheckBox, CRXRadio } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../../Redux/rootReducer";
import { USER_INFO_GET_URL } from '../../../../utils/Api/url'
import Cookies from 'universal-cookie';
import useGetFetch from "../../../../utils/Api/useGetFetch";
import {EVIDENCE_SERVICE_URL} from "../../../../utils/Api/url";
import moment from "moment";

type AssignUserProps = {
    items:any[];
  filterValue: any[];
  //setFilterValue: (param: any) => void;
  rowData: any;
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
};

const cookies = new Cookies();

const AssignUser: React.FC<AssignUserProps> = (props) => {
    console.log("selectedItems",props.items);
    
  const dispatch = useDispatch();
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  const users: any = useSelector(
    (state: RootState) => state.userReducer.usersInfo
  );
  const [assignUserCheck, setAssignUserCheck] = React.useState<boolean>(false)
  const [retention, setRetention] = React.useState<string>("")
  const [currentRetention, setCurrentRetention] = React.useState<string>("")

  const [retentionDays,setRetentionDays] = React.useState<number>(0)
  //const originalRetention = [{value: "originalRetention",label:"Revert to original retention", Comp: () => {}}]
  let retentionRadio = [
    {
    value: "customExtention",label:"Extend retention by days", Comp: () => {}},
    {value: "extendIndefinitely",label:"Extend retention Indefinitely", Comp: () => {}}]
        
    const originalRetention = '2022/04/25T12:35:28.537Z';
    const currRetention = '2022/04/27T12:35:28.537Z';
    if(originalRetention != null)
    {
retentionRadio.push({value: "originalRetention",label:"Revert to original retention", Comp: () => {}})
    }
  React.useEffect(() =>  {
    // dispatch(getUsersInfoAsync());
    
    console.log("Retention",retention)
    //console.log("Retention options",retentionOptions)
  }, [retention]);

  React.useEffect(() =>  {
    assetData();
    getRetentionData();
  }, []);
  
  React.useEffect(() => {
    
    const changeInValues = props.filterValue.filter((o: any) => {
      return !props.rowData.categories.some((i: string) => i === o.value);
    });
  }, [props.filterValue]);
  const [assetData, getAssetData] = useGetFetch<any>(
    EVIDENCE_SERVICE_URL + "/Evidences/" + "2",
    {
      "Content-Type": "application/json",
      TenantId: "1",
    }
  );
  const getRetentionData = () => {
    
    // setCurrentRetention(moment(getAssetData.retainUntil).format(
    //     "YYYY / MM / DD HH:mm:ss"
    //   ))
    const data = getAssetData;
    console.log("asset data",getAssetData);
  }
  React.useEffect(() =>  {
    getRetentionData();
  }, [getAssetData]);

  const onSubmitForm = () => {
      console.log('Submit work here')
    if (props.filterValue?.length !== 0) {
      //props.setActiveForm((prev: any) => prev + 1);
    }
  };

  const cancelBtn = () => {
    //if (props.filterValue?.length !== 0) {
      props.setOnClose();
    //}
  };
    
  return (
    <>
    <div style={{height:"200px"}}>
      <Formik initialValues={{}} onSubmit={() => onSubmitForm()}>
        {() => (
          <Form>
            {/* <div className='categoryTitle'>
              Users <b>*</b>
            </div> */}
            <div >
            <div>Extend {props.items.length} Assets</div>
            <CRXRadio
                className='crxEditRadioBtn'
                disableRipple={true}
                content={retentionRadio}
                value={retention}
                setValue={setRetention}
              />
              
              <input type="number" value={retentionDays} onChange={(e) => setRetentionDays(parseInt(e.target.value))}/>
            </div>
            <div>
                <h4>Original Retention: {originalRetention}</h4>
                <h4>Current Retention: {currRetention}</h4>
                <br></br>
                <br></br>
                <br></br>

            </div>
            <div>
               
            </div>
            {/* <div style={{height:"100px", paddingTop:"20px",
            display:`${props.rowData.evidence.asset.length > 0
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
              
              Retention test content.
            </div> */}
           
            
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

export default AssignUser;
