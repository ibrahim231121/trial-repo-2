import React,{useEffect, useState} from 'react';
import { Field, FieldArray, ErrorMessage } from 'formik';
import { CRXTooltip, CRXSelectBox, CRXRadio, CRXMultiSelectBoxLight } from '@cb/shared';
import { CRXButton, CRXConfirmDialog  } from '@cb/shared';
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Restricted from '../../ApplicationPermission/Restricted';

var re = /[\/]/;

export const inCarSelectTypes = [
  { value: "value", displayText: 'label' },
];

const CustomizedSelectForFormik = (props: any) => {

  const { options, field, onChange, errors, handleBlur, setTouched, touched, formObj } = props;
  const { value } = field;

  
  return (
    <>  
      <CRXSelectBox
        {...field}
        value={value ?? ""}
        onChange={(e:any) => { onChange(e) }}
        className="selectFormikIncar"
        options={options}
        isRequried={touched[field.name] == true && (errors[formObj.key]?.length > 0)}
        error={ !(errors[formObj.key]?.length > 0)}
        errorMsg={formObj.key.split(re)[1].split('_')[0] + " is " + errors[formObj.key]}
        icon={true}
        popover={"selectFormikIncar_wraper"}
        defaultOptionText={value}
        defaultValue={value}
        onClose={(e: any) => {
          handleBlur(e);
          setTouched({...touched,[field.name]: true });
        }}
      />
   
    </>
  );
};

const cameraTemplateFledForRadio = (props : any) => { 
  const { value, values, onChange, formObj } = props;
  return (
    <>
    <CRXRadio 
      className="usama" 
      value={value} 
      checked={values[formObj.key]} 
      name={formObj.key}
      singleRadioChange={onChange}
     />
    </>
  )
}




const CustomizedMultiSelectForFormik = (props: any) => {
  const { form, field, options, formObj, errors } = props;
  const { name, value } = field;
  const { setFieldValue } = form;
  const valueArray = Array.isArray(value) ? value : value.split(',')
  
  return (
  <>
    <CRXMultiSelectBoxLight
      className="_device_template_multiselect"
      multiple={true}
      CheckBox={false}
      error={errors[formObj.key]?.length > 0}
      errorMsg={formObj.key.split(re)[1].split('_')[0] + " is " + errors[formObj.key]}
      options={options}
      value={options.filter((x: any) => valueArray.includes(x.value))}
      isSearchable={false}
      onChange={(e: any, value: any[]) => {
        let values = value.map((x: any) => x.value ?? x);
        setFieldValue(name, values);
      }}
    />
    </>
  )
};


const addObject = (formObj: any, arrayHelpers: any, cameraFeildArrayCounter: any, setCameraFeildArrayCounter: any, applyValidation: any, Initial_Values_obj_RequiredField: any, setInitial_Values_obj_RequiredField: any, values: any, setValues: any, isValid: any, setformSchema: any) => {


  var rowId = parseInt(cameraFeildArrayCounter) + 1;
  setCameraFeildArrayCounter(rowId);

  var lastFeildArrayFeilds = formObj.feilds[0];

  const arrayOfObj = Object.entries(Initial_Values_obj_RequiredField).map((e) => ({ key: e[0], value: e[1] }));

  var arr: any[] = []
  lastFeildArrayFeilds.map((x: any) => {
    var splittedKey = x.key.split('_');
    var key = splittedKey[0] + "_" + rowId + "_" + splittedKey[2];
    if (x.validation && x.depends == undefined) {
      arrayOfObj.push({ "key": key, "value": { "type": x.type, "validation": x.validation } });
    }
    arr.push({ ...x, key: key });
  });

  let key_value_pairs = arrayOfObj.reduce(
    (formObj: any, item: any) => ((formObj[item.key] = { type: item.value.type, validation: item.value.validation }), formObj),
    {}
  );
  setInitial_Values_obj_RequiredField(key_value_pairs);

  var valuesKV = arr.reduce(                  // Validations Object
    (obj, item: any) => ({ ...obj, [item.key]: item.value }),
    {}
  );
  setValues({ ...values, ...valuesKV });

  arrayHelpers.push(arr);

  var initialValuesArrayRequiredField: any[] = applyValidation(arrayOfObj)
  var formSchemaTemp = initialValuesArrayRequiredField.reduce(                  // Validations Object
    (obj, item: any) => ({ ...obj, [item.key]: item.value }),
    {}
  );
  setformSchema(formSchemaTemp);

};


const removeObject = (removeIndex: number, Initial_Values_obj_RequiredField: any, setInitial_Values_obj_RequiredField: any, values: any, applyValidation: any, setformSchema: any, setValues: any) => {
  var rowToDelete = values["CameraSetup/Camera/FieldArray"]?.feilds[removeIndex];
  const arrayOfObj = Object.entries(Initial_Values_obj_RequiredField).map((e) => ({ key: e[0], value: e[1] }));
  var arrayOfObjUpdated = arrayOfObj.filter((x: any) => !(rowToDelete.some((y: any) => y.key == x.key)));

  let key_value_pairs = arrayOfObjUpdated.reduce(
    (formObj: any, item: any) => ((formObj[item.key] = { type: item.value.type, validation: item.value.validation }), formObj),
    {}
  );
  setInitial_Values_obj_RequiredField(key_value_pairs);

  var initialValuesArrayRequiredField: any[] = applyValidation(arrayOfObjUpdated)
  var formSchemaTemp = initialValuesArrayRequiredField.reduce(                  // Validations Object
    (obj, item: any) => ({ ...obj, [item.key]: item.value }),
    {}
  );
  setformSchema(formSchemaTemp);

  const valuesArray = Object.entries(values).map((e) => ({ key: e[0], value: e[1] }));
  var valuesArrayUpdated = valuesArray.filter((x: any) => !(rowToDelete.some((y: any) => y.key == x.key)));
  if(rowToDelete.length > 0)
  {
    let indexNumber = rowToDelete[0].key.split('_')[1];
    valuesArrayUpdated = valuesArrayUpdated.filter((x: any) => !x.key.includes('_' + indexNumber + "_") );
  }
  var updatedValuesKV = valuesArrayUpdated.reduce(                  // Validations Object
    (obj, item: any) => ({ ...obj, [item.key]: item.value }),
    {}
  );
  setValues(updatedValuesKV);
};



const optionAppendOnChange = (e: any, formObj: any, values: any, setValues: any, index: any) => {
  let parentSplittedKey = formObj.key.split('_');

  let validationOnCurrentValue = formObj.optionAppendOnChange?.filter((x: any) => x.value == e);
  validationOnCurrentValue?.map((x: any) => {
    let splittedKey = x.selectKey.split('_');
    if (splittedKey.length > 0) {
      let key = splittedKey[0] + "_" + parentSplittedKey[1] + "_" + splittedKey[2];
      let select = values["CameraSetup/Camera/FieldArray"]
        ?.feilds[index]
        .find((feild: any) => feild.key == key);

      if (x.options.length > 0) {
        select.options.map((y: any) => {
          if (!x.options.includes(y.value)) {
            y.hidden = true;
          }
          else{
            y.hidden = false;
          }
        })
      }
    }
  });
  if(validationOnCurrentValue.length === 0){
    let x = formObj.optionAppendOnChange?.[0];
    if(x){
      let splittedKey = x.selectKey.split('_');
      if (splittedKey.length > 0) {
        let key = splittedKey[0] + "_" + parentSplittedKey[1] + "_" + splittedKey[2];
        let select = values["CameraSetup/Camera/FieldArray"]
          ?.feilds[index]
          .find((feild: any) => feild.key == key);

        select?.options.filter((y: any) => y.hidden == true).map((y: any) => {
          y.hidden = false;
        })
      }
    }
  }
  setValues(values);
  console.log("resolution values", values["CameraSetup/Camera/FieldArray"]?.feilds)
}


const valueSetOnChange = (e: any, formObj: any, setFieldValue: any) => {
  let parentSplittedKey = formObj.key.split('_');
  formObj.valueSetOnChange?.filter((x: any) => x.value == e)?.map((x: any) => {
    let splittedKey = x.valueToSetKey.split('_');
    if (splittedKey.length > 0) {
      let key = splittedKey[0] + "_" + parentSplittedKey[1] + "_" + splittedKey[2];
      setFieldValue(key, x.setValue);
    }
  });
}





let customEvent = (event: any, y: any, z: any) => {
  if (event.target[z.inputType] === z.if) {
    y(z.field, z.value)
  }

}



export const CreateTempelateCase = (props: any) => {
  const { t } = useTranslation<string>();

  let LocationPath: any = useLocation();

    if (LocationPath?.state?.deviceType === "Incar") {
      document.querySelector("main")?.classList.add("IncarTemplatePage")
    }  else {
      document.querySelector("main")?.classList.remove("IncarTemplatePage")
    }
 



  const { formObj, values, setValues, index, handleChange, setFieldValue, cameraFeildArrayCounter, setCameraFeildArrayCounter, applyValidation, Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField, FormSchema, isValid, setformSchema, touched, errors, setValidationFailed, handleBlur, setTouched, sensorsEvent} = props;
  

  const handleRowIdDependency = (key: string, extraFieldDependency?: any) => {
    var parentSplittedKey = formObj.key.split('_');
    key = key.replace("rowId", parentSplittedKey[1])
    var value = values[key]
    if(extraFieldDependency == "cameraDevice")
    {
      return FormSchema["CameraSetup"].find((x: any) => x.key == "CameraSetup/Camera/FieldArray")["feilds"][0].find((x: any) => x.key == "CameraSetup/device_1_Camera/Select").options.find((x:any) => x.value == value)?.label;
    }
    return value;
  }

  const [open, setOpen] = React.useState(false);
  const [removeIndex, setRemoveIndex] = React.useState(0);

  const IncarModalOpen = () => {
    document.querySelector("body")?.classList.add("incarMOdalOpen");
  }
  const IncarModalClose = () => {
    document.querySelector("body")?.classList.remove("incarMOdalOpen");
  }

  React.useEffect(() => {
   let validations = Object.entries(Initial_Values_obj_RequiredField).map((e) => e[0])
   let errorAccured = Object.entries(errors).map((e) => e[0])

   let validationError = validations.some(x => errorAccured.includes(x));
   setValidationFailed(validationError);
  }, [errors]);





  switch (formObj.type) {
    case "text":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency)))) &&
        <>
          {(formObj.labelGroupRecording) && <span className="MainHeadingDevices"><span className="MainHeadingDevices"><h1 className={`formMainHeading   ${formObj.labelGroupRecording} `}>{t(formObj.labelGroupRecording)}</h1></span></span>}
          <div className={"_template_form_group " + formObj.class}>
            <div className={touched[formObj.key] == true && errors[formObj.key] ? " textFieldError" : "textField"} >
              <div className="UiLabelTextbox " >
                
                  <label className="labelRadioo">{t(formObj.label)}
                    <label>
                      {formObj.validation?.some((x: any) => x.key == 'required') === true ? <span className={touched[formObj.key] == true && errors[formObj.key] ? "textBoxRed" : "textBoxBlack"}>*</span> : null}
                    </label>
                  </label>
                  <div className="UiLabelTextboxRight">
                    <Field
                      name={formObj.key }
                      id={formObj.id}
                      type={formObj.type}
                      placeholder={formObj.hinttext ? formObj.hintvalue : ""}
                    />
                    <ErrorMessage
                      name={formObj.key}
                      render={(msg) => (
                        <>
                        <div className="UiLabelTextboxError">
                          <i className="fas fa-exclamation-circle"></i>  {formObj.key.split(re)[1].split('_')[0] + " is " + msg}
                        </div>
                        </>
                 
                      )}
                    />
                  </div>


                  {formObj.hintText ? (
                    <CRXTooltip
                      className="CRXTooltip_form"
                      iconName="fas fa-info-circle"
                      title={t(formObj.hintText)}
                      placement="right"
                    />
                  ) : null}
                
              </div>
            </div>
          </div>
          {/* <div className="UiColumnSpacer"></div> */}
        </>
      );
    case "time":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency)))) &&
        <div className={formObj.class}>
          <div
            className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency))) ? 'DynamicFormTimeUi DynamicFormTimeUiDepend' : 'DynamicFormTimeUi'}
          >
            <div className='DFTUILeft'>
              <label>{t(formObj.labelMute)}</label>
              <label className='DFTUILabel'>{t(formObj.label)}</label>
              <label className='DFTUIRequired'>
                {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
              </label>
            </div>
            <div className='DFTUIRight'>
              <Field
                name={formObj.key}
                id={formObj.id}
                type={"time"}
              />
              {formObj.hintText ? (
                <CRXTooltip
                  iconName="fas fa-info-circle"
                  title={t(formObj.hintText)}
                  placement="right"
                />
              ) : null}
              <ErrorMessage
                name={formObj.key}
                render={(msg) => (
                  <div style={{ color: "red" }}>
                    {formObj.key.split(re)[1].split('_')[0] + " is " + msg}
                  </div>
                )}
              />
            </div>
          </div>
        </div>

      );
    case "radio":
      return (
        <>
          {
            (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency)))) &&
            <>
              {(formObj.labelGroupRecording) && <h1 className={'formMainHeading ' + formObj.labelGroupRecording + `HeadingSpacer`} >{t(formObj.labelGroupRecording)}</h1>}
              
              <div className={formObj.labelMute + " _template_radio_button"}>
                <div className="UiRadioMain">
                  <div className="UiRadioLabel">
                    <label >{t(formObj.labelMute)}</label>
                  </div>
                  <div
                    className="UiRadioCheck"
                  >
                    <div className="Enabled">
                      <label className="containerRadio">
                        
                        <Field
                          formObj={formObj}
                          value={formObj.value}
                          values={values}
                          component={cameraTemplateFledForRadio}
                          onChange={(e: any) => setFieldValue(formObj.key, e.target.value)}
                        />
                        
                      </label>
                      <label className="radio_label">{t(formObj.label)}
                        <label>
                          {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
                        </label>
                        <p className="labelMutedText"> {t(formObj.labelMutedText)} </p>

                      </label>

                      {formObj.hintText ? (
                        <CRXTooltip
                          iconName="fas fa-info-circle"
                          title={t(formObj.hintText)}
                          placement="right"
                        />
                      ) : null}
                      <ErrorMessage
                        name={formObj.key}
                        render={(msg) => (
                          <div style={{ color: "red" }}>
                            {formObj.key.split(re)[1].split('_')[0] + " is " + msg}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
            </>
          }
        </>
      );
    case "select":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency)))) &&
        <>
        <div className={touched[formObj.key] == true && errors[formObj.key] ? "selectFieldError" : "selectField"} >
        {(formObj.labelGroupRecording) && <span className="MainHeadingDevices"><span className="MainHeadingDevices"><h1 className={'formMainHeading ' + formObj.labelGroupRecording + `HeadingSpacer`}>{t(formObj.labelGroupRecording)}</h1></span></span>}
          <div className={formObj.class}>
            <div
              className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency))) ? `UiStationSelect UiStationSelectDepended` : ' UiStationSelect'}
            >
              
                <label className='UiStationSelectLabel'>{t(formObj.label)}
                  <label className='starikBlack'>
                    {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
                  </label></label>
                <div className="UicustomMulti">
                  <Field
                    name={formObj.key}
                    id={formObj.id}
                    component={CustomizedSelectForFormik}
                    onChange={(e:any) => {
                      if(formObj.valueSetOnChange){
                        valueSetOnChange(e.target.value, formObj, setFieldValue);
                      }
                      if(formObj.optionAppendOnChange){
                        optionAppendOnChange(e.target.value, formObj, values, setValues, index);
                      }
                      setFieldValue(formObj.key, e.target.value);
                    }}
                    options={formObj.options?.filter((x: any) => x.hidden != true).map((x: any) => {
                        return {
                          "displayText" : x.label ,
                          "value" : x.value    
                        }
                      })
                    }
                    errors={errors}
                    handleBlur={handleBlur}
                    setTouched={setTouched}
                    touched={touched}
                    formObj={formObj}
                  />

                  <span className='UicustomMultiHint'>
                    {formObj.hintText ? (
                      <CRXTooltip
                        iconName="fas fa-info-circle"
                        title={t(formObj.hintText)}
                        placement="right"
                      />
                    ) : null}
                  </span>
                
              </div>
            
            </div>
          </div>
        </div>
          <div className="UiColumnSpacer"></div>
        </>
      );
    case "multiselect":

      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency)))) &&
        
        <div className={formObj.class  + touched[formObj.key] == true && errors[formObj.key] ? " multiSelectFieldError" : "multiSelectField"}>
        
               <div
          className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency))) ? 'multiSelectUi multiSelectUiDepend' : 'multiSelectUi '}
        >
          <div className='multiSelectUiLeft'>
            <label className='multiSelectUiLabel'>{t(formObj.label)}</label>
            <label className='multiSelectUiStar'>
              {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
            </label>
          </div>

          <div className='multiSelectUiRight'>
            <Field
              name={formObj.key}
              id={formObj.id}
              placeholder="Heloss"
              component={CustomizedMultiSelectForFormik}
              formObj={formObj}
              options={formObj.options}
              errors={errors}
            />
              
            <ErrorMessage
                  name={formObj.key}
                  render={(msg) => (
                    <div style={{ color: "red" }}>
                      {formObj.key.split(re)[1].split('_')[0] + " is " + msg}
                    </div>
                  )}
                />
            {formObj.hintText ? (
              <CRXTooltip
                iconName="fas fa-info-circle"
                title={t(formObj.hintText)}
                placement="right"
              />) : (<></>)}
          </div>
          <Restricted moduleId={52}>
            {formObj.extraHtml ? (<div className='CreateSensorsEventForm'>
                  <CRXButton onClick={sensorsEvent}>
                      {t("Create Sensor & Trigger")}
                  </CRXButton>
            </div>) :(<></>)}
          </Restricted>
        </div>
        </div>
     
      );
    case "checkbox":

      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency)))) &&
        <>
          {(formObj.labelGroupRecording) && <span className={ "MainHeadingDevices " + formObj.label + formObj.id }><span className="MainHeadingDevices"><h1 className={'formMainHeading '}>{t(formObj.labelGroupRecording)}</h1></span></span>}
          <div className={formObj.class + " _template_checkbox"}>
            <div
              className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency))) ? 'UiCheckbox UiCheckboxDepend ' : 'UiCheckbox'}
            >
              
                <div className="UiCheckboxLeft">
                  <label className={formObj.label ? "labelAdded" : "labelNotAdded"}>{t(formObj.label)}
                    <label>
                      {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
                    </label>
                  </label>
                </div>
                <div className="UiCheckboxRight">
                  <div className="UiCheckboxRightPosition">
                    <label className="containerCheck" >
                      <Field           
                        name={formObj.key}
                        id={formObj.id}
                        type={formObj.type}
                        onClick={(event: React.ChangeEvent<HTMLInputElement>) => {                   
                          handleChange(event);
                          if (formObj.dependant != null) {
                            customEvent(event, setFieldValue, formObj.dependant);
                          }}}
                      />
                      <span className="checkmark" ></span>
                      <p className="checkHelperText">{t(formObj.belowFieldText)}</p>
                    </label>
                    <div className='textWithRadioCheckBox'>{formObj.checkBoxText ? <p>{t(formObj.checkBoxText)}</p> : ''}</div>
                    {formObj.hintText ? (
                      <CRXTooltip
                        iconName="fas fa-info-circle"
                        title={t(formObj.hintText)}
                        placement="right"
                      />
                    ) : null}
                    <ErrorMessage
                      name={formObj.key}
                      render={(msg) => (
                        <div style={{ color: "red" }}>
                          {formObj.key.split(re)[1].split('_')[0] + " is " + msg}
                        </div>
                      )}
                    />
                  </div>
                </div>
              
            </div>
            
          </div>
        </>
      );
    case "number":
      return (

        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency)))) &&
        
          <div className={touched[formObj.key] == true && errors[formObj.key] ? " NumberFieldError NumberField " : "NumberField " + formObj.label}>
            <div className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency))) ? 'UiNumberSelectorDepend' : ''}>
              <div
                className={`${(formObj.postFieldText && formObj.postFieldText == "minutes") ? "UiNumberSelector UiNumberSelectorMinute" : "UiNumberSelector"}`}
              >
                
                {(formObj.labelGroupRecording) && <h1 className={'formMainHeading ' + formObj.labelGroupRecording + `HeadingSpacer`}>{t(formObj.labelGroupRecording)}</h1>}
                <div className={formObj.belowFieldText ? 'UiNumberSelectorMain checkHelperTextMain ' : 'UiNumberSelectorMain'}>
                  <div className="UiNumberSelectorLeft ">
                    <label>{t(formObj.label)}
                      <label>
                        {formObj.validation?.some((x: any) => x.key == 'required') === true ? <span className={touched[formObj.key] == true && errors[formObj.key] ? "starikRed" : "starikBlack"}>*</span> : null}
                      </label>
                    </label>
                  </div>
                  <div className={` ${formObj.hintText ? 'UiNumberSelectorRight ' : "UiNumberSelectorRight UiNumberSelectorNoHint"}`}>
                    <div className={(formObj.postFieldText && formObj.postFieldText == "volts") ? "voltsDepended" : ""} >
                      <Field
                        name={formObj.key}
                        id={formObj.id}
                        type={formObj.type}
                      />
                      <label className="timeShow">
                        {formObj.postFieldText ? t(formObj.postFieldText) : ""}
                      </label>
                      {formObj.hintText ? (
                        <CRXTooltip
                          iconName="fas fa-info-circle"
                          title={t(formObj.hintText)}
                          placement="right"
                        />
                      ) : null}
                      
                      <div className="checkSelectorText">{t(formObj.belowFieldText)}</div>
                      <ErrorMessage
                        name={formObj.key}
                        render={(msg) => (
                          <div className={formObj.belowFieldText ? `UiNumberSelectorError checkHelperTextPresent ` : `UiNumberSelectorError`}>
                            <i className="fas fa-exclamation-circle numberIconCircle"></i> {formObj.key.split(re)[1].split('_')[0] + " is " + msg}

                          </div>
                        )}
                      />
                      
                    </div>
                  </div>
                </div>
                <div className="UiColumnSpacer"></div>
              </div>
            </div>
          </div>
      );
    case "fieldarray":
      return (
        <FieldArray
          name={formObj.key + ".feilds"}
          render={arrayHelpers => (
            // <></>
            <div className='_camera_setup_tab'>
              {
                values[formObj.key]?.feilds && values[formObj.key]?.feilds.length > 0 ? (
                  values[formObj.key]?.feilds.map((feildArray: any, index: any) => (


                    feildArray.map((feild: any, key: any) => (

                      key == 0 ?
                        <>
                          <div className='cameraSetup'>
                            <div className='_device_temp_camera_title'>{t("Camera")} {(index + 1)}</div>
                               <div className='_remove_camera_icon' onClick={() => { IncarModalOpen(); setOpen(true); setRemoveIndex(index) }}>
                                    <CRXTooltip 
                                      className="assetsGroupPopupTootip"
                                      placement="bottom-left"
                                      arrow={false}
                                      title={"remove camera"}
                                      content={<i className="fas fa-minus-circle"></i>}
                                      />
                               </div>
                        
                          </div>
                        
                          <div className='_camera_setup_flieds' key={formObj.key + "_DIV" + key}>
                            <CreateTempelateCase formObj={feild} values={values} setValues={setValues} index={index} handleChange={handleChange} setFieldValue={setFieldValue} applyValidation={applyValidation} Initial_Values_obj_RequiredField={Initial_Values_obj_RequiredField} setInitial_Values_obj_RequiredField={setInitial_Values_obj_RequiredField} FormSchema={FormSchema} cameraFeildArrayCounter={cameraFeildArrayCounter} setCameraFeildArrayCounter={setCameraFeildArrayCounter} isValid={isValid} setformSchema={setformSchema} touched={touched} errors={errors} handleBlur={handleBlur} setTouched={setTouched} setValidationFailed={setValidationFailed} />
                          </div></> :
                        <div className='_camera_setup_flieds' key={formObj.key + "_DIV" + key}>
                          <CreateTempelateCase formObj={feild} values={values} setValues={setValues} index={index} handleChange={handleChange} setFieldValue={setFieldValue} applyValidation={applyValidation} Initial_Values_obj_RequiredField={Initial_Values_obj_RequiredField} setInitial_Values_obj_RequiredField={setInitial_Values_obj_RequiredField} FormSchema={FormSchema} cameraFeildArrayCounter={cameraFeildArrayCounter} setCameraFeildArrayCounter={setCameraFeildArrayCounter} isValid={isValid} setformSchema={setformSchema} touched={touched} errors={errors} handleBlur={handleBlur} setTouched={setTouched} setValidationFailed={setValidationFailed} />

                        </div>
                        
                    ))



                  ))
                ) : (<></>)}
              <div className='AddCameraLineIncar'></div>
              <div className='AddCameraIncar'>
                <CRXButton className=" secondary" color="secondary" variant="outlined" onClick={() => addObject(formObj, arrayHelpers, cameraFeildArrayCounter, setCameraFeildArrayCounter, applyValidation, Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField, values, setValues, isValid, setformSchema)}>
                  <i className="fa fa-plus"></i>  {t("Add camera")}
                </CRXButton>
              </div>



              <CRXConfirmDialog
                setIsOpen={(e: React.MouseEvent<HTMLElement>) => { IncarModalClose(); setOpen(false); }}
                onConfirm={() => { IncarModalClose(); setOpen(false); removeObject(removeIndex, Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField, values, applyValidation, setformSchema, setValues); arrayHelpers.remove(removeIndex); }}
                title={t("Please_Confirm")}
                isOpen={open}
                className="IncarDeviceModalUiMain"
                modelOpen={open}
                primary={t("Remove_camera")}
                secondary={t("Cancel")}
              >
                {
                  <div className="crxUplockContent">
                    <p className='modalPara1'>
                    {t("You_are_attempting_to")} <strong>{t("remove")}</strong> <strong>{t("Camera")} {removeIndex + 1}</strong>. 
                    {t("If_you_remove_this_camera,")} 
                    {t("any_changes_you_ve_made_will_not_be_saved.")} 
                    {t("You_will_not_be_able_to_undo_this_action.")}
                    </p>
                    <p className='modalPara2'>
                    {t("Are_you_sure_you_would_like_to")}<strong>{t("remove")}</strong> {t("this_camera?")}
                    </p>
                  </div>
                }
              </CRXConfirmDialog>

            </div>

          )}
        />
      );

  }

}
