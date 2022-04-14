import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory, CRXCheckBox } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../../Redux/UserReducer";
import { USER_INFO_GET_URL } from '../../../../utils/Api/url'
import Cookies from 'universal-cookie';

type AssignUserProps = {
  filterValue: any[];
  setFilterValue: (param: any) => void;
  rowData: any;
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
};

const cookies = new Cookies();

const AssignUser: React.FC<AssignUserProps> = (props) => {
  const dispatch = useDispatch();
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  const users: any = useSelector(
    (state: RootState) => state.userReducer.usersInfo
  );
  const [assignUserCheck, setAssignUserCheck] = React.useState<boolean>(false)

  React.useEffect(() =>  {
    dispatch(getUsersInfoAsync());
  }, []);

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

  const onSubmitForm = () => {
    if (props.filterValue?.length !== 0) {
      //props.setActiveForm((prev: any) => prev + 1);
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
    <div style={{height:"200px"}}>
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
                visibility = {true}
                options={filterUser(users)}
                value={props.filterValue}
                autoComplete={false}
                isSearchable={true}
                onChange={(event: any, newValue: any, reason: any, detail: any) => {
                  return handleChange(event, 1, newValue, reason, detail);
                }}
              />
            </div>
            <div style={{height:"100px", paddingTop:"20px",
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
