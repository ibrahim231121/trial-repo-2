import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { CRXTooltip } from '@cb/shared';

var re = /[\/]/;


const addObject = (formObj: any, arrayHelpers: any, cameraFeildArrayCounter: any, setCameraFeildArrayCounter: any, formSchema: any, setformSchema: any, applyValidation: any, Initial_Values_obj_RequiredField: any, values : any, setValues : any) => {
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

  var initialValuesArrayRequiredField: any[] = applyValidation(arrayOfObj);
  var formSchemaTemp = initialValuesArrayRequiredField.reduce(                  // Validations Object
    (obj, item: any) => ({ ...obj, [item.key]: item.value }),
    {}
  );
  setformSchema(formSchemaTemp);

  debugger;
  var valuesKV = arr.reduce(                  // Validations Object
    (obj, item: any) => ({ ...obj, [item.key]: item.value }),
    {}
  );
  setValues({...values, ...valuesKV});

  arrayHelpers.push(arr);
};


const onChange = (e: any, formObj: any, setformSchema: any, applyValidation: any, Initial_Values_obj_RequiredField: any, handleChange: any) => {
  handleChange(e);
  if (formObj.validationChangeFeilds !== undefined) {
    let arrayOfObj = Object.entries(Initial_Values_obj_RequiredField).map((e) => ({ key: e[0], value: e[1] }));
    formObj.validationChangeFeilds.filter((x: any) => x.value == e.target.value)?.map((x: any) => {

      var splittedKey = x.key.split('_');
      var parentSplittedKey = formObj.key.split('_');
      var newKey = splittedKey[0] + "_" + parentSplittedKey[1] + "_" + splittedKey[2];
      if (x.todo == "add") {
        if (x.validation) {
          arrayOfObj.push({ "key": newKey, "value": { "type": x.type, "validation": x.validation } });
        }
      }
      else if (x.todo == "remove") {
        arrayOfObj = arrayOfObj.filter((x: any) => x.key !== newKey);
      }
    })

    var initialValuesArrayRequiredField: any[] = applyValidation(arrayOfObj);
    var formSchemaTemp = initialValuesArrayRequiredField.reduce(                  // Validations Object
      (obj, item: any) => ({ ...obj, [item.key]: item.value }),
      {}
    );
    setformSchema(formSchemaTemp);
  }
}






let customEvent = (event: any, y: any, z: any) => {
  if (event.target[z.inputType] === z.if) {
    y(z.field, z.value)
  }

}




export const CreateTempelateCase = (props: any) => {

  const { formObj, values, setValues, index, handleChange, setFieldValue, cameraFeildArrayCounter, setCameraFeildArrayCounter, formSchema, setformSchema, applyValidation, Initial_Values_obj_RequiredField } = props;

  const handleRowIdDependency = (key: string) => {
    key = key.replace("rowId", index)
    var value = values[key]
    return value;
  }

  // React.useEffect(() => {
  //   
  //   // setStationDropDown();
  // }, [values["device/blackBoxRecording_1_Camera/Radio"]]);




  switch (formObj.type) {
    case "text":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div
          style={{
            display: "block",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <label>{formObj.label}</label>
          <label>
            {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
          </label>
          <Field
            name={formObj.key}
            id={formObj.id}
            type={formObj.type}
          />
          {formObj.hinttext == true ? (
            <CRXTooltip
              iconName="fas fa-info-circle"
              title={formObj.hintvalue}
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
      );
    case "time":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div
          style={{
            display: "block",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <label style={{
            display: "block",
            marginBottom: "10px",
            marginTop: "10px",
          }}>{formObj.labelMute}</label>
          <label>{formObj.label}</label>
          <label>
            {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
          </label>
          <Field
            name={formObj.key}
            id={formObj.id}
            type={"time"}
          />
          {formObj.hinttext == true ? (
            <CRXTooltip
              iconName="fas fa-info-circle"
              title={formObj.hintvalue}
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
      );
    case "radio":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div
          style={{
            display: "block",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <label>{formObj.label}</label>
          <label>
            {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
          </label>
          <Field
            id={formObj.id}
            type={formObj.type}
            name={formObj.key}
            value={formObj.value}
            onChange={(e: any) => onChange(e, formObj, setformSchema, applyValidation, Initial_Values_obj_RequiredField, handleChange)}
          />
          {formObj.hinttext == true ? (
            <CRXTooltip
              iconName="fas fa-info-circle"
              title={formObj.hintvalue}
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
      );
    case "select":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div
          style={{
            display: "block",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <label>{formObj.label}</label>
          <label>
            {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
          </label>

          <Field
            name={formObj.key}
            id={formObj.id}
            component={formObj.type}
          >
            {formObj.options.map(
              (opt: any, key: string) => (
                <option
                  style={{ width: "50%" }}
                  value={opt.value}
                  key={key}
                  selected={true}
                >
                  {opt.label}{" "}
                </option>
              )
            )}
          </Field>
          {formObj.hinttext == true ? (
            <CRXTooltip
              iconName="fas fa-info-circle"
              title={formObj.hintvalue}
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
      );
    case "multiselect":

      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div
          style={{
            display: "block",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <label>{formObj.label}</label>
          <label>
            {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
          </label>

          <Field
            name={formObj.key}
            id={formObj.id}
            component={"select"}
            multiple={true}
          >
            {formObj.options.map(
              (opt: any, key: string) => (
                <option
                  style={{ width: "50%" }}
                  value={opt.value}
                  key={key}
                >
                  {opt.label}{" "}
                </option>
              )
            )}
          </Field>
          {formObj.hinttext == true ? (
            <CRXTooltip
              iconName="fas fa-info-circle"
              title={formObj.hintvalue}
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
      );
    case "checkbox":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div
          style={{
            display: "block",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <label>{formObj.label}</label>
          <label>
            {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
          </label>
          <Field
            name={formObj.key}
            id={formObj.id}
            type={formObj.type}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(event);
              if (formObj.dependant != null) {

                customEvent(event, setFieldValue, formObj.dependant);
              }

            }}
            validateOnChange
          />
          {formObj.hinttext == true ? (
            <CRXTooltip
              iconName="fas fa-info-circle"
              title={formObj.hintvalue}
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
      );
    case "number":
      return (
        (formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key)))) &&
        <div
          style={{
            display: "block",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <label>{formObj.label}</label>
          <label>
            {formObj.validation?.some((x: any) => x.key == 'required') === true ? "*" : null}
          </label>
          <Field
            name={formObj.key}
            id={formObj.id}
            type={formObj.type}
          />
          <label>
            {formObj.seconds === true
              ? "seconds"
              : "minutes"}
          </label>
          {formObj.hinttext == true ? (
            <CRXTooltip
              iconName="fas fa-info-circle"
              title={formObj.hintvalue}
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
                        <><h1>Camera {(index + 1)}</h1> <button type="button" onClick={() => arrayHelpers.remove(index)}>-</button>
                          <div key={formObj.key + "_DIV" + key}>
                          <CreateTempelateCase formObj={feild} values={values} setValues={setValues} index={index + 1} handleChange={handleChange} setFieldValue={setFieldValue} formSchema={formSchema} applyValidation={applyValidation} setformSchema={setformSchema} Initial_Values_obj_RequiredField={Initial_Values_obj_RequiredField} />
                          </div></> :
                        <div key={formObj.key + "_DIV" + key}>
                          <CreateTempelateCase formObj={feild} values={values} setValues={setValues} index={index + 1} handleChange={handleChange} setFieldValue={setFieldValue} formSchema={formSchema} applyValidation={applyValidation} setformSchema={setformSchema} Initial_Values_obj_RequiredField={Initial_Values_obj_RequiredField} />

                        </div>
                    ))



                  ))
                ) : (<></>)}
              <button type="button" onClick={() => addObject(formObj, arrayHelpers, cameraFeildArrayCounter, setCameraFeildArrayCounter, formSchema, setformSchema, applyValidation, Initial_Values_obj_RequiredField, values, setValues)}>
                Add a feild
              </button>


            </div>

          )}
        />
      );

  }

}
