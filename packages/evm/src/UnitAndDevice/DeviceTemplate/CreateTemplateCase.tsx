import React,{useRef} from 'react';
import { Field, FieldArray, ErrorMessage } from 'formik';
import { CRXTooltip } from '@cb/shared';
import { Select, MenuItem, ListItemText } from '@material-ui/core';
import { CRXButton, CRXConfirmDialog } from '@cb/shared';
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

var re = /[\/]/;

const CustomizedSelectForFormik = (props: any) => {

  const { children, form, field } = props;
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <>
      <Select
        {...field}
        value={value ?? ""}
        onChange={e => {
          setFieldValue(name, e.target.value);
        }}
      >
        {children}
      </Select>
    </>
  );
};




const CustomizedMultiSelectForFormik = (props: any) => {

  const { children, name, options } = props;

  return (
    <>
      <Select
        multiple
        renderValue={(selected: any) => {
          var valuesAppend = children.filter((x: any) => x.key != "" && x.key != "add all").map((x: any) => {
            if (selected.some((y: any) => x.props.value == y) || selected.includes("add all")) {
              return x.key;
            }
          });
          var definedValues = valuesAppend.filter((y: any) => y !== undefined);
          if (definedValues.length < valuesAppend.length) {
            return definedValues.join(', ');
          }
          else {
            return "add all";
          }
        }}
        {...props}
      >
        {children}
      </Select>
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


const removeObject = (removeIndex: number, Initial_Values_obj_RequiredField: any, setInitial_Values_obj_RequiredField: any, values: any, applyValidation: any, setformSchema: any) => {
  var rowToDelete = values["CameraSetup/Camera/FieldArray"]?.feilds[removeIndex];
  const arrayOfObj = Object.entries(Initial_Values_obj_RequiredField).map((e) => ({ key: e[0], value: e[1] }));
  var arrayOfObjUpdated = arrayOfObj.filter((x: any) => !(rowToDelete.some((y: any) => y.key == x.key)));

  let key_value_pairs = arrayOfObjUpdated.reduce(
    (formObj: any, item: any) => ((formObj[item.key] = { type: item.value.type, validation: item.value.validation }), formObj),
    {}
  );
  setInitial_Values_obj_RequiredField(key_value_pairs);
};


const onChange = (e: any, formObj: any, applyValidation: any, Initial_Values_obj_RequiredField: any, setInitial_Values_obj_RequiredField: any, handleChange: any) => {
  handleChange(e);
  if (formObj.validationChangeFeilds !== undefined) {
    let arrayOfObj = Object.entries(Initial_Values_obj_RequiredField).map((e) => ({ key: e[0], value: e[1] }));
    formObj.validationChangeFeilds.filter((x: any) => x.value == e.target.checked)?.map((x: any) => {
      
      var splittedKey = x.key.split('_');
      var parentSplittedKey = formObj.key.split('_');
      var newKey = splittedKey.length > 1 ? splittedKey[0] + "_" + parentSplittedKey[1] + "_" + splittedKey[2] : x.key;
      if (x.todo == "add") {
        if (x.validation) {
          arrayOfObj.push({ "key": newKey, "value": { "type": x.type, "validation": x.validation } });
        }
      }
      else if (x.todo == "remove") {
        arrayOfObj = arrayOfObj.filter((x: any) => x.key !== newKey);
      }
    })
    
    let key_value_pairs = arrayOfObj.reduce(
      (formObj: any, item: any) => ((formObj[item.key] = { type: item.value.type, validation: item.value.validation }), formObj),
      {}
    );
    setInitial_Values_obj_RequiredField(key_value_pairs);
  }
}

const optionAppendOnChange = (e: any, formObj: any, values: any, setValues: any, handleChange: any, FormSchema: any, index: any) => {
  if (formObj.optionAppendOnChange !== undefined) {
    values[formObj.key] = e;
    var parentSplittedKey = formObj.key.split('_');
    formObj.optionAppendOnChange?.filter((x: any) => x.value == e)?.map((x: any) => {
      var splittedKey = x.selectKey.split('_');
      if (splittedKey.length > 0) {
        var key = splittedKey[0] + "_" + parentSplittedKey[1] + "_" + splittedKey[2];
        var select = values["CameraSetup/Camera/FieldArray"]
          ?.feilds[index]
          .find((feild: any) => feild.key == key);

        if (x.options.includes("all")) {
          select.options.filter((y: any) => y.hidden == true).map((y: any) => {
            y.hidden = false;
          })
        }
        else if (x.options.length > 0) {
          select.options.map((y: any) => {
            if (!x.options.includes(y.value)) {
              y.hidden = true;
            }
          })
        }
      }
    });
    setValues(values);
  }
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
    document.querySelector("body")?.classList.add("IncarTemplatePage")
  } else {
    document.querySelector("body")?.classList.remove("IncarTemplatePage")
  }



  const { formObj, values, setValues, index, handleChange, setFieldValue, cameraFeildArrayCounter, setCameraFeildArrayCounter, applyValidation, Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField, FormSchema, isValid, setformSchema, touched, errors } = props;

  const handleRowIdDependency = (key: string) => {
    var parentSplittedKey = formObj.key.split('_');
    key = key.replace("rowId", parentSplittedKey[1])
    var value = values[key]
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
    if (formObj.optionAppendOnChange !== undefined) {
      optionAppendOnChange(formObj.value, formObj, values, setValues, handleChange, FormSchema, index);
    }
  }, []);




  switch (formObj.type) {
    case "text":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <>
          {(formObj.labelGroupRecording) && <span className="MainHeadingDevices"><span className="MainHeadingDevices"><h1 className={`formMainHeading   ${formObj.labelGroupRecording} `}>{t(formObj.labelGroupRecording)}</h1></span></span>}
          <span className={formObj.class}>
            <div className={touched[formObj.key] == true && errors[formObj.key] ? " textFieldError" : "textField"} >
              <div className="UiLabelTextbox " >
                <div>
                  <label className="labelRadioo">{t(formObj.label)}
                    <label>
                      {formObj.validation?.some((x: any) => x.key == 'required') === true ? <span className={touched[formObj.key] == true && errors[formObj.key] ? "textBoxRed" : "textBoxBlack"}>*</span> : null}
                    </label>
                  </label>
                  <div className="UiLabelTextboxRight">
                    <Field
                      name={formObj.key}
                      id={formObj.id}
                      type={formObj.type}
                    />
                    <ErrorMessage
                      name={formObj.key}
                      render={(msg) => (
                        <div className="UiLabelTextboxError">
                          <i className="fas fa-exclamation-circle"></i>  {formObj.key.split(re)[1].split('_')[0] + " is " + msg}
                        </div>
                      )}
                    />
                  </div>


                  {formObj.hinttext == true ? (
                    <CRXTooltip
                      className="CRXTooltip_form"
                      iconName="fas fa-info-circle"
                      title={t(formObj.hintvalue)}
                      placement="right"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </span>
          <div className="UiColumnSpacer"></div>
        </>
      );
    case "time":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div className={formObj.class}>
          <div
            className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key))) ? 'DynamicFormTimeUi DynamicFormTimeUiDepend' : 'DynamicFormTimeUi'}
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
              {formObj.hinttext == true ? (
                <CRXTooltip
                  iconName="fas fa-info-circle"
                  title={t(formObj.hintvalue)}
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
            (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
            <>
              {(formObj.labelGroupRecording) && <h1 className={'formMainHeading ' + formObj.labelGroupRecording + `HeadingSpacer`} >{t(formObj.labelGroupRecording)}</h1>}
              <div className={formObj.class}>
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
                          id={formObj.id}
                          type={formObj.type}
                          name={formObj.key}
                          value={formObj.value}
                          onChange={(e: any) => onChange(e, formObj, applyValidation, Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField, handleChange)}
                        />
                        <span className="checkmarkRadio"></span>
                      </label>
                      <label className={formObj.label + "Text"}>{t(formObj.label)}
                        <label>
                          {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
                        </label>
                        <p className="labelMutedText"> {t(formObj.labelMutedText)} </p>

                      </label>

                      {formObj.hinttext == true ? (
                        <CRXTooltip
                          iconName="fas fa-info-circle"
                          title={t(formObj.hintvalue)}
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
              <div className="UiColumnRadioSpacer"></div>
            </>
          }
        </>
      );
    case "select":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <>
          {(formObj.labelGroupRecording) && <span className="MainHeadingDevices"><span className="MainHeadingDevices"><h1 className={'formMainHeading ' + formObj.labelGroupRecording + `HeadingSpacer`}>{t(formObj.labelGroupRecording)}</h1></span></span>}
          <div className={formObj.class}>
            <div
              className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key))) ? `UiStationSelect UiStationSelectDepended` : ' UiStationSelect'}
            >
              <div>
                <label className='UiStationSelectLabel'>{t(formObj.label)}
                  <label>
                    {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
                  </label></label>
                <div className="UicustomMulti">
                  <Field
                    name={formObj.key}
                    id={formObj.id}
                    component={CustomizedSelectForFormik}
                    // component={"select"}
                    onChange={(e: any) => formObj.optionAppendOnChange !== undefined ? optionAppendOnChange(e.target.value, formObj, values, setValues, handleChange, FormSchema, index) : handleChange(e)}

                  >
                    {formObj.options.filter((x: any) => x.hidden != true).map(
                      (opt: any, key: string) => (
                        <MenuItem
                          value={opt.value}
                          key={key}
                        >{t(opt.label)}{" "}</MenuItem>
                      )
                    )}
                  </Field>

                  <span className='UicustomMultiHint'>
                    {formObj.hinttext == true ? (
                      <CRXTooltip
                        iconName="fas fa-info-circle"
                        title={t(formObj.hintvalue)}
                        placement="right"
                      />
                    ) : null}
                  </span>
                </div>
              </div>
              <div>
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
          <div className="UiColumnSpacer"></div>
        </>
      );
    case "multiselect":

      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div
          className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key))) ? 'multiSelectUi multiSelectUiDepend' : 'multiSelectUi '}
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
              as={CustomizedMultiSelectForFormik}
            // multiple={true}
            >
              {formObj.options.map(
                (opt: any, key: string) => (

                  <MenuItem key={opt.label} value={opt.value}>
                    {/* <Checkbox checked={name.indexOf(opt.value) > -1} /> */}
                    <ListItemText primary={t(opt.label)} />
                  </MenuItem>

                  // <option
                  //   style={{ width: "50%" }}
                  //   value={opt.value}
                  //   key={key}
                  // >
                  //   {opt.label}{" "}
                  // </option>
                )
              )}
            </Field>
            {formObj.hinttext == true ? (
              <CRXTooltip
                iconName="fas fa-info-circle"
                title={t(formObj.hintvalue)}
                placement="right"
              />) : (<></>)}
          </div>
        </div>
      );
    case "checkbox":

      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <>
          {(formObj.labelGroupRecording) && <span className="MainHeadingDevices"><span className="MainHeadingDevices"><h1 className={'formMainHeading ' + formObj.labelGroupRecording + `HeadingSpacer`}>{t(formObj.labelGroupRecording)}</h1></span></span>}
          <div className={formObj.class}>
            <div
              className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key))) ? 'UiCheckbox UiCheckboxDepend ' : 'UiCheckbox'}
            >
              <div className="UiCheckboxMain">
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
                          }
                          else if (formObj.validationChangeFeilds != null) {
                            onChange(event, formObj, applyValidation, Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField, handleChange)
                        }}}
                        validateOnChange
                      />
                      <span className="checkmark" ></span>
                      <p className="checkHelperText">{t(formObj.checkHelperText)}</p>
                    </label>
                    <div>{formObj.checkBoxText ? <p>{t(formObj.checkBoxText)}</p> : ''}</div>
                    {formObj.hinttext == true ? (
                      <CRXTooltip
                        iconName="fas fa-info-circle"
                        title={t(formObj.hintvalue)}
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
            <div className={'UiColumnSpacerCheckBox'}></div>
          </div>
        </>
      );
    case "number":
      return (

        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div className={formObj.class}>
          <div className={touched[formObj.key] == true && errors[formObj.key] ? " NumberFieldError" : "NumberField"}>
            <div className={formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key))) ? 'UiNumberSelectorDepend' : ''}>
              <div
                className={`${formObj.seconds === false ? "UiNumberSelector UiNumberSelectorMinute" : "UiNumberSelector"}`}

              >
                {(formObj.labelGroupRecording) && <h1 className={'formMainHeading ' + formObj.labelGroupRecording + `HeadingSpacer`}>{t(formObj.labelGroupRecording)}</h1>}
                <div className={formObj.checkHelperText ? 'UiNumberSelectorMain checkHelperTextMain ' : 'UiNumberSelectorMain'}>
                  <div className="UiNumberSelectorLeft ">
                    <label>{t(formObj.label)}
                      <label>
                        {formObj.validation?.some((x: any) => x.key == 'required') === true ? <span className={touched[formObj.key] == true && errors[formObj.key] ? "starikRed" : "starikBlack"}>*</span> : null}
                      </label>
                    </label>
                  </div>
                  <div className={` ${formObj.hinttext === true ? 'UiNumberSelectorRight ' : "UiNumberSelectorRight UiNumberSelectorNoHint"}`}>
                    <span className={formObj.volts ? "voltsDepended" : ""} >
                      <Field
                        name={formObj.key}
                        id={formObj.id}
                        type={formObj.type}
                      />
                      <label className="timeShow">
                        {formObj.seconds === true
                          ? t("seconds")
                          : formObj.volts ? t("volts") : t("minutes")}
                      </label>
                      <p className="checkSelectorText">{t(formObj.checkHelperText)}</p>
                      {formObj.hinttext == true ? (
                        <CRXTooltip
                          iconName="fas fa-info-circle"
                          title={t(formObj.hintvalue)}
                          placement="right"
                        />
                      ) : null}
                      <ErrorMessage
                        name={formObj.key}
                        render={(msg) => (
                          <div className={formObj.checkHelperText ? `UiNumberSelectorError checkHelperTextPresent ` : `UiNumberSelectorError`}>
                            <i className="fas fa-exclamation-circle numberIconCircle"></i> {formObj.key.split(re)[1].split('_')[0] + " is " + msg}

                          </div>
                        )}
                      />
                    </span>
                  </div>
                </div>
                <div className="UiColumnSpacer"></div>
              </div>
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
            <div>
              {
                values[formObj.key]?.feilds && values[formObj.key]?.feilds.length > 0 ? (
                  values[formObj.key]?.feilds.map((feildArray: any, index: any) => (


                    feildArray.map((feild: any, key: any) => (

                      key == 0 ?
                        <>
                          <div className='cameraSetup'>
                            <h1>{t("Camera")} {(index + 1)}</h1>
                            <i className="fas fa-minus-circle" onClick={() => { IncarModalOpen(); setOpen(true); setRemoveIndex(index) }}></i>
                          </div>
                          <div key={formObj.key + "_DIV" + key}>
                            <CreateTempelateCase formObj={feild} values={values} setValues={setValues} index={index} handleChange={handleChange} setFieldValue={setFieldValue} applyValidation={applyValidation} Initial_Values_obj_RequiredField={Initial_Values_obj_RequiredField} setInitial_Values_obj_RequiredField={setInitial_Values_obj_RequiredField} FormSchema={FormSchema} cameraFeildArrayCounter={cameraFeildArrayCounter} setCameraFeildArrayCounter={setCameraFeildArrayCounter} isValid={isValid} setformSchema={setformSchema} touched={touched} errors={errors} />
                          </div></> :
                        <div key={formObj.key + "_DIV" + key}>
                          <CreateTempelateCase formObj={feild} values={values} setValues={setValues} index={index} handleChange={handleChange} setFieldValue={setFieldValue} applyValidation={applyValidation} Initial_Values_obj_RequiredField={Initial_Values_obj_RequiredField} setInitial_Values_obj_RequiredField={setInitial_Values_obj_RequiredField} FormSchema={FormSchema} cameraFeildArrayCounter={cameraFeildArrayCounter} setCameraFeildArrayCounter={setCameraFeildArrayCounter} isValid={isValid} setformSchema={setformSchema} touched={touched} errors={errors} />

                        </div>
                    ))



                  ))
                ) : (<></>)}
              <div className='AddCameraLineIncar'></div>
              <div className='AddCameraIncar'>
                <CRXButton onClick={() => addObject(formObj, arrayHelpers, cameraFeildArrayCounter, setCameraFeildArrayCounter, applyValidation, Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField, values, setValues, isValid, setformSchema)}>
                  <i className="fa fa-plus"></i>  {t("Add camera")}
                </CRXButton>
              </div>



              <CRXConfirmDialog
                setIsOpen={(e: React.MouseEvent<HTMLElement>) => { IncarModalClose(); setOpen(false); }}
                onConfirm={() => { IncarModalClose(); setOpen(false); removeObject(removeIndex, Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField, values, applyValidation, setformSchema); arrayHelpers.remove(removeIndex); }}
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
