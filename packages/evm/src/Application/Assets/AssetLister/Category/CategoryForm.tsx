import React from 'react';
import { useRef ,  } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { CRXButton } from '@cb/shared';
import { AddToEditFormStateCreator } from '../../../../Redux/CategoryFormSlice';
import { CRXAlert } from '@cb/shared';
import { EVIDENCE_SERVICE_URL, SETUP_CONFIGURATION_SERVICE_URL } from '../../../../utils/Api/url';
import DialogueForm from './SubComponents/DialogueForm';
import DisplayCategoryForm from './SubComponents/DisplayCategoryForm';
import moment from 'moment';

type CategoryFormProps = {
  filterValue: any[];
  setremoveClassName: any;
  activeForm: number;
  rowData: any;
  isCategoryEmpty: boolean;
  setFilterValue: (param: any) => void;
  closeModal: (param: boolean) => void;
  setActiveForm: (param: any) => void;
  setOpenForm: () => void;
  setModalTitle: (param: string) => void;
  setIsformUpdated: (param: boolean) => void;
  setIndicateTxt: (param: boolean) => void;
  setshowSSticky: (param: boolean) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = (props) => {
  const dispatch = useDispatch();
  const [filteredFormArray, setFilteredFormArray] = React.useState<any[]>([]);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [saveBtn, setSaveBtn] = React.useState(true);
  const [formFields, setFormFields] = React.useState<any>([]);
  const [Initial_Values_obj, setInitial_Values_obj] = React.useState<any>({});
  const selectedRow = props.rowData;
  const evidenceId = selectedRow.assetId;
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const saveBtnClass = saveBtn ? 'nextButton-Edit' : 'primeryBtn';
  const isErrorClx = error && 'onErrorcaseClx';
  const alertRef = useRef(null);

  React.useEffect(() => {
    props.setModalTitle('Category form');
    props.setIndicateTxt(false);
    props.setshowSSticky(true)
    props.setremoveClassName('crxEditCategoryForm');
    // Untill save button get enabled, form will be in non updated.
    if (saveBtn) props.setIsformUpdated(false);
  }, []);

  React.useEffect(() => {
    const EvidenceID = selectedRow.assetId;
    const allCategories = props.filterValue;
    const categoriesFormArr: any[] = [];
    // Check how many categories are added recently,
    const previousAttachedCategoriesWithOutID = selectedRow.categories;
    const newSelectedCategories = allCategories.filter((x: any) => {
      return !previousAttachedCategoriesWithOutID.some((o: any) => o == x.label);
    });

    // If user selected addtional categories, then cross icon click should be a update case.
    if (newSelectedCategories.length > 0) {
      props.setIsformUpdated(true);
      const recentlyAddedCategory = categoryOptions
        .filter((o: any) => {
          return newSelectedCategories.some((e: any) => e.label === o.name);
        })
        .map((i: any) => {
          return {
            id: i.id,
            name: i.name,
            form: i.forms,
            type: 'add'
          };
        });
      categoriesFormArr.push(...recentlyAddedCategory);
    }

    // It means category was attacehd from the backend
    if (previousAttachedCategoriesWithOutID.length > 0) {
      props.setModalTitle('Edit category');
      const url = `${EVIDENCE_SERVICE_URL}/Evidences/${EvidenceID}`;
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', TenantId: '1' }
      })
        .then(awaitJson)
        .then((response: any) => {
          let changingResponse = response.categories.map((o: any) => {
            return {
              id: o.id,
              name: o.record.record.find((x: any) => x.key === 'Name').value,
              form: o.formData,
              type: 'update'
            };
          });
          categoriesFormArr.push(...changingResponse);
          setFilteredFormArray(categoriesFormArr);
        })
        .catch((err: any) => {
          setError(true);
          console.error(err);
        });
    } else {
      setFilteredFormArray(categoriesFormArr);
    }
  }, [props.filterValue, props.isCategoryEmpty]);

  React.useEffect(() => {
    let Initial_Values: Array<any> = [];
    if (filteredFormArray.length > 0) {
      for (const categoryObj of filteredFormArray) {
        for (const form of categoryObj.form) {
          for (const field of form.fields) {
            if (field.hasOwnProperty('key')) {
              Initial_Values.push({
                key: field.value,
                value: field.value
              });
            } else {
              Initial_Values.push({
                key: field.name,
                value: ''
              });
            }
          }
        }
      }

      let key_value_pair = Initial_Values.reduce((obj, item) => ((obj[item.key] = item.value), obj), {});

      setInitial_Values_obj(key_value_pair);
      const initial_values_of_fields = Object.entries(key_value_pair).map((o: any) => {
        return {
          key: o[0],
          value: o[1]
        };
      });
      setFormFields(initial_values_of_fields);
    }
  }, [filteredFormArray]);

  React.useEffect(() => {
    if (formFields.length > 0) {
      let isFormCompleteFilled: boolean = formFields.some((ele: any) => ele.value.length === 0);
      if (!isFormCompleteFilled) {
        setSaveBtn(false);
      }
    }
  }, [formFields]);

  const setFieldsFunction = (e: any) => {
    const { target } = e;
    let newArray = formFields.filter((o: any) => {
      return o.key !== target.name;
    });
    setFormFields(() => [...newArray, { key: target.name, value: target.value }]);
    props.setIsformUpdated(true);
  };

  const awaitJson = (response: any) => {
    if (response.ok) {
      return response.json() as Object;
    }
    throw new Error(response.statusText);
  };

  const backBtn = () => {
    props.setActiveForm((prev: number) => prev - 1);
  };

  const closeModalFunc = () => {
    props.setOpenForm();
    props.closeModal(false);
  };

  const submitForm = () => {
    //create object to pass in patch request.
    const categoryBodyArr: any[] = [];
    for (const obj of filteredFormArray) {
      const categoryId = obj.id;
      const categoryFormDataArr: any[] = [];
      for (const form of obj.form) {
        const fieldsArray = [];
        for (const field of form.fields) {
          let value: any;
          if (field.hasOwnProperty('key')) {
            value = formFields.filter((x: any) => x.key == field.value).map((i: any) => i.value)[0];
          } else {
            value = formFields.filter((x: any) => x.key == field.name).map((i: any) => i.value)[0];
          }
          const _field = {
            key: field.key === undefined ? field.name : field.key,
            value: value,
            dataType: field.dataType === undefined ? 'FieldTextBoxType' : field.dataType
          };
          fieldsArray.push(_field);
        }

        const _categoryFormbody = {
          formId: form.formId !== undefined ? form.formId : form.id,
          fields: fieldsArray
        };
        categoryFormDataArr.push(_categoryFormbody);
      }

      const _categoryBody = {
        id: categoryId,
        formData: categoryFormDataArr,
        assignedOn: moment().format('YYYY-MM-DDTHH:mm:ss'),
        type: obj.type
      };
      categoryBodyArr.push(_categoryBody);
    }
    const isEditCaseExist = categoryBodyArr.some((e) => e.type === 'update');
    if (isEditCaseExist) {
      dispatch(AddToEditFormStateCreator(categoryBodyArr));
      props.setActiveForm(5);
    } else {
      // Find highest retention, in categories.
      let retentionPrmomise = findRetention();
      Promise.resolve(retentionPrmomise).then((retentionId: number) => {
        // Remove type key from body.
        categoryBodyArr.forEach((v: any) => {
          delete v.type;
        });
        const body = {
          unAssignCategories: [],
          assignedCategories: categoryBodyArr,
          updateCategories: [],
          retentionId: [retentionId]
        };
        const requestOptions = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            TenantId: '1'
          },
          body: JSON.stringify(body)
        };
        const url = `${EVIDENCE_SERVICE_URL}/Evidences/${evidenceId}/Categories`;
        fetch(url, requestOptions)
          .then((response: any) => {
            if (response.ok) {
              setSuccess(true);
              setTimeout(() => closeModalFunc(), 3000);
            } else {
              throw new Error(response.statusText);
            }
          })
          .catch((err: any) => {
            setError(true);
            console.error(err);
          });
      });
    }
  };

  const findRetention = async () => {
    const retentionDetails: any = [];
    let retentionList = '';
    let count = 0;
    const categoriesWithRetention = categoryOptions.filter((o: any) => {
      return props.filterValue.some((e: any) => e.id === o.id);
    });
    for (const i of categoriesWithRetention) {
      const retentionId = i.policies.retentionPolicyId;
      retentionList +=
        props.filterValue.length !== count + 1 ? `PolicyIDList=${retentionId}&` : `PolicyIDList=${retentionId}`;
      count++;
    }
    const url = `${SETUP_CONFIGURATION_SERVICE_URL}/Policies/DataRetention?${retentionList}`;
    const call = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', TenantId: '1' }
    })
      .then(awaitJson)
      .then((response: any) => {
        for (let i = 0; i <= response.length - 1; i++) {
          retentionDetails.push({
            categoryName: props.filterValue[i].label,
            hours: response[i].detail.limit.hours + response[i].detail.limit.gracePeriodInHours
          });
        }
        const sortedArray = retentionDetails.sort((a: any, b: any) => (a.hours > b.hours ? 1 : -1)).reverse();
        const retentionId = categoryOptions.find((o: any) => o.name === sortedArray[0].categoryName).policies
          .retentionPolicyId;
        return retentionId;
      })
      .catch((err: any) => {
        setError(true);
        console.error(err.message);
      });
    return call;
  };

  const skipBtn = () => {
    let categoryBodyArr: any[] = [];
    for (const obj of filteredFormArray) {
      const _categoryBody = {
        id: obj.id,
        formData: [],
        assignedOn: moment().format('YYYY-MM-DDTHH:mm:ss')
      };
      categoryBodyArr.push(_categoryBody);
    }

    const body = {
      unAssignCategories: [],
      assignedCategories: categoryBodyArr,
      updateCategories: []
    };
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        TenantId: '1'
      },
      body: JSON.stringify(body)
    };
    const url = `${EVIDENCE_SERVICE_URL}/Evidences/${evidenceId}/Categories`;
    fetch(url, requestOptions)
      .then((response: any) => {
        if (response.ok) {
          setSuccess(true);
          setTimeout(() => {
            props.setOpenForm();
            props.setFilterValue((val: []) => []);
            props.closeModal(false);
          }, 3000);
        } else {
          throw new Error(response.statusText);
        }
      })
      .catch((err: any) => {
        setError(true);
        console.error(err);
      });
  };
  React.useEffect(() => {
    const optionalSticky : any = document.getElementsByClassName("optionalSticky")
    
    if(optionalSticky.length > 0) {
      optionalSticky[0].style.height = "79px"
    }else {
      if(optionalSticky.length > 0) {
          optionalSticky[0].style.height = "119px"
        }
    }
  },[alert])
  return (
    <>
      {success && <CRXAlert message='Success: You have saved the asset categorization' alertType='toast' open={true} />}
      {error && (
        <CRXAlert
          className='errorMessageCategory'
          message="We 're sorry. The form was unable to be saved. Please retry or contact your Systems Administrator"
          type='error'
          alertType='inline'
          open={true}
        />
      )}
      <div className={'indicatestext indicateLessPadding ' + isErrorClx}>
        <b>*</b> Indicates required field
      </div>
      {filteredFormArray.length > 0 ? (
        filteredFormArray.some((o: any) => o.form.length > 0) ? (
          // If form exist against selected category
          <>
            {filteredFormArray.map((categoryObj: any, key: any) => (
              <>
                <DisplayCategoryForm
                  key={key}
                  categoryObject={categoryObj}
                  isCategoryEmpty={props.isCategoryEmpty}
                  initialValuesObjects={Initial_Values_obj}
                  setFieldsFunction={(e: any) => setFieldsFunction(e)}
                />
              </>
            ))}
            <div className='categoryModalFooter CRXFooter'>
              <CRXButton onClick={submitForm} disabled={saveBtn} className={saveBtnClass + ' ' + 'editButtonSpace'}>
                {' '}
                {props.isCategoryEmpty === false ? 'Next' : 'Save'}
              </CRXButton>
              <CRXButton className='cancelButton secondary' color='secondary' variant='contained' onClick={backBtn}>
                Back
              </CRXButton>
              {props.isCategoryEmpty && (
                <CRXButton className='skipButton' onClick={skipBtn}>
                  Skip category form & save
                </CRXButton>
              )}
            </div>
          </>
        ) : (
          // Show dialogue Functionality
          <DialogueForm
            setActiveForm={props.setActiveForm}
            initialValues={props.filterValue}
            rowData={props.rowData}
            formCollection={filteredFormArray}
            setOpenForm={() => props.setOpenForm()}
            closeModal={(v: boolean) => props.closeModal(v)}
            setModalTitle={(i: string) => props.setModalTitle(i)}
            setFilterValue={(v: any) => props.setFilterValue(v)}
            setIndicateTxt={(e: any) => props.setIndicateTxt(e)}
          />
        )
      ) : null}
    </>
  );
};

export default CategoryForm;
