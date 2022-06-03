import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory, CRXCheckBox } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../../Redux/UserReducer";
import { EVIDENCE_SERVICE_URL } from '../../../../utils/Api/url'
import Cookies from 'universal-cookie';
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";

type AssignUserProps = {
  selectedItems: any[];
  filterValue: any[];
  setFilterValue: (param: any) => void;
  rowData: any;
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
};

type ownersModel = {
  evidenceId: any,
  assetId: any,
  owners: number[]
}
const cookies = new Cookies();

const AssignUser: React.FC<AssignUserProps> = (props) => {
  const dispatch = useDispatch();
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  const [assetOwners,setAssetOwners] = React.useState<ownersModel[]>([]);
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

    console.log('assetOwners',assetOwners);
    if(assetOwners.length > 0)
    {
    sendData();
    }
      //dispatch(getUsersInfoAsync());
  }, [assetOwners]);
  const sendData = async () =>{

    const url = EVIDENCE_SERVICE_URL + '/Evidences/AssignUsers?IsChildAssetincluded=' + `${assignUserCheck}`
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', TenantId: '1', 'Authorization': `Bearer ${cookies.get('access_token')}` },
        body: JSON.stringify(assetOwners)
      })
      .then(function (res) {
        if (res.ok) {
          setTimeout(() => {  dispatch(getAssetSearchInfoAsync("")) }, 1000);
          props.setOnClose();
        } 
        else if (res.status == 500) {
          // setAlert(true);
          // setResponseError(
          //   "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
          // );
        }
      })
      .catch(function (error) {
        return error;
      });
  }
  const getData = () => {

    let notSame = 0;
    if (props.selectedItems.length > 1) {
      var selectedItemsOwnerList = props.selectedItems.map(x => x.evidence?.masterAsset?.owners);
      for(var i = 0; i< selectedItemsOwnerList.length-1; i++)
        {
            if(JSON.stringify(selectedItemsOwnerList[i]) != JSON.stringify(selectedItemsOwnerList[i+1]))
            {
              notSame++;
            }
        }
        if(notSame == 0)
        {
          getMasterAsset();
        }
    }
    else
    {
      getMasterAsset();
    }
  }
  const getMasterAsset = async () => {

    const url = EVIDENCE_SERVICE_URL + '/Evidences/' + `${props.rowData.id}` + '/assets/' + `${props.rowData.assetId}`
    
    const res = await fetch(url, {
      method: 'Get',
      headers: { 'Content-Type': 'application/json', TenantId: '1'},
    })
    var response = await res.json();

    if(response != null) {
      let result = response.owners.map((x:any) => { 
                    let item: any = {
                      id: x.id.split("_")[2],
                      label: x.record.length > 0 ? x.record.filter((t:any) => t.key === 'UserName')[0].value : "" 
                    }
                    return item
                  })
      props.setFilterValue(() => result);
    } 
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
    if (props.selectedItems.length > 1) 
    {
      var tempOwnerList = [...assetOwners];
      props.selectedItems.forEach((el) => {
        var temp: ownersModel = {
          evidenceId: el.id,
          assetId: el.assetId,
          owners: props.filterValue.map(x => x.id)
        }
        tempOwnerList.push(temp);
      })
      setAssetOwners(tempOwnerList);
    }
    else
    {
    const url = EVIDENCE_SERVICE_URL + '/Evidences/' + `${props.rowData.id}` + '/assets/' + `${props.rowData.assetId}` + '/AssignUsersToAssets?IsChildAssetincluded=' + `${assignUserCheck}`

    if (props.filterValue?.length !== 0) {
      //props.setActiveForm((prev: any) => prev + 1);
    }
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', TenantId: '1', 'Authorization': `Bearer ${cookies.get('access_token')}` },
      body: JSON.stringify(props.filterValue.map(x => x.id))
    })
      .then(function (res) {
        if (res.ok) {
          setTimeout(() => {  dispatch(getAssetSearchInfoAsync("")) }, 1000);
          props.setOnClose();
        } 
        else if (res.status == 500) 
        {
          // setAlert(true);
          // setResponseError(
          //   "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
          // );
        }
      })
      .catch(function (error) {
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
      <div style={{ height: "200px" }}>
        <Formik initialValues={{}} onSubmit={() => onSubmitForm()}>
          {() => (
            <Form>
              <div className='categoryTitle'>
                Users <b>*</b>
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
                Apply to all assets in the group.
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

export default AssignUser;
