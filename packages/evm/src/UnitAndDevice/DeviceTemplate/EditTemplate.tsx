import React, { useState } from "react";
import { CRXTabs, CrxTabPanel, CRXButton } from "@cb/shared";
import { useHistory, useParams } from "react-router";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Link } from "react-router-dom";
import "./createTemplate.scss";
import FormSchema from "./editUnitAndDevicesTemplate.json";
import { Formik, Form, Field, useField } from "formik";
import { CRXConfirmDialog, CRXTooltip } from "@cb/shared";

const EditTemplate = () => {
  const [value, setValue] = React.useState(0);

  const [Initial_Values_obj, setInitial_Values_obj] = React.useState<any>({});
  const [dataOfUnit, setUnitData] = React.useState<any>([]);
  const [dataOfDevice, setDeviceData] = React.useState<any>([]);
  const [open, setOpen] = React.useState(false);

  const [primary] = React.useState<string>("Yes, close");
  const [secondary] = React.useState<string>("No, do not close");
  const [test, setTest] = React.useState<boolean>(false);
  var [arr3] = React.useState<any>([]);
  var [arr4] = React.useState<any>([]);

  const history = useHistory();

  const { id } = useParams<{ id: string }>();
  console.log("my name is umair", id);
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", TenantId: "1" },
    };

    const unitDataResponse = await fetch(
      `http://127.0.0.1:8083/ConfigurationTemplates/GetTemplateConfigurationTemplate?configurationTemplateName=${id}`,
      requestOptions
    );
    // console.log("category reponse = ", unitDataResponse);
    if (unitDataResponse.ok) {
      const response = await unitDataResponse.json();

      setUnitData(response.unittemplate);
      setDeviceData(response.device);
      setTest(true);
    }
  };

  React.useEffect(() => {
    let Initial_Values: Array<any> = [];

    // ****************
    // for loop for unittemplate
    // ****************
    // ****************
    // ****************

    for (const field of dataOfUnit) {
      if (field.hasOwnProperty("key")) {
        if (!field.hasOwnProperty("selected")) {
          Initial_Values.push({
            key: field.key, // thats the name of state
            value: field.value,
          });
        }
      }

      //console.log("initial values", Initial_Values);
      let key_value_pair = Initial_Values.reduce(
        (formObj, item) => ((formObj[item.key] = item.value), formObj),
        {}
      );

      //console.log("key value pair reduce", key_value_pair);
      setInitial_Values_obj(key_value_pair);
    }

    // ****************
    // for loop for device
    // ****************
    // ****************
    // ****************

    for (const field of dataOfDevice) {
      if (field.hasOwnProperty("key")) {
         if (!field.fieldType.hasOwnProperty("Radio")) {
        Initial_Values.push({
          key: field.key, // thats the name of state
          value:
            field.value === "true"
              ? true
              : field.value === "false"
              ? false
              : field.value,
        });
       }
      } 
      else if(field.fieldType.hasOwnProperty("Radio")) {
      // else if (field.fieldType == "Radio") {
        Initial_Values.push({
          key: field.key, // thats the name of state
          value: field.value && "enabled" && "muted",
        });
      }

      // "fieldType": "Radio",
      let key_value_pair = Initial_Values.reduce(
        (formObj, item) => ((formObj[item.key] = item.value), formObj),
        {}
      );
      setInitial_Values_obj(key_value_pair);
    }
  }, [test]);

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }

  const tabs = [
    { label: "UNIT TEMPLATE ", index: 0 },
    { label: "DEVICE", index: 1 },
    { label: "SENSORS AND TRIGGERS", index: 2 },
  ];

  const handleChangeCloseButton = (values: boolean) => {
    if (values == false) {
      setOpen(true);
    } else {
      history.push("/admin/unitconfiguration/unitconfigurationtemplate");
    }
  };
  const onConfirmm = () => {
    setOpen(false);
    history.push("/admin/unitconfiguration/unitconfigurationtemplate");
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
  };

  const handleSave = (values: any, resetForm: any) => {
    alert("im here");

    let Initial_Values: Array<any> = [];

    Object.entries(values).map(([key, value]) => {
      Initial_Values.push({
        key: key,
        value: value,
      });

      // Pretty straightforward - use key for the key and value for the value.
      // Just to clarify: unlike object destructuring, the parameter names don't matter here.
    });

    let templateName = Initial_Values.filter((o: any) => {
      return o.key == "templateName";
    });
    // let defaultTemplate = Initial_Values.filter((o: any) => {
    //   return o.key == "defaultTemplate";
    // });

    var templateNames = templateName[0].value;
    //var defaultTemplates = defaultTemplate[0].value;

    var fields = Initial_Values.filter(function (returnableObjects) {
      return (
        // returnableObjects.key !== "defaultTemplate" &&
        returnableObjects.key !== "templateName"
      );
    });

    const body = {
      name: templateNames,
      // isDefault: defaultTemplates,
      fields: fields,
      typeOfDevice: { id: 1 },
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        TenantId: "1",
      },
      body: JSON.stringify(body),
    };
    const url = `http://127.0.0.1:8083/ConfigurationTemplate{}`;
    fetch(url, requestOptions)
      .then((response: any) => {
        if (response.ok) {
          console.log("great");
          alert("happeded");
          resetForm();
        } else {
          throw new Error(response.statusText);
        }
      })
      .catch((err: any) => {
        // setError(true);
        console.error(err);
      });
  };

  let formSchemaArrayUnitTemplate: Array<any> =
    FormSchema.bodyWorn3.unittemplate.map((o: any) => {
      return {
        label: o.label,
        type: o.type,
        options: o.options,
        required: o.required,
      };
    });

  let formSchemaDeviceTemplate: Array<any> = FormSchema.bodyWorn3.device.map(
    (o: any) => {
     
      return {
        label: o.label,
        type: o.type,
        options: o.options,
        required: o.required,
        labelGroupRecording: o.labelGroupRecording,
        labelDeviceControls: o.labelDeviceControls,
        labelLocation: o.labelLocation,
        labelMute: o.labelMute,
        defaultChecked: o.defaultChecked,
        optionss:o.optionss
      };
    }
  );
  let unitArray = dataOfUnit.map((o: any) => {
    return {
      key: o.key,
      value: o.value,
    };
  });
  let deviceArray = dataOfDevice.map((o: any) => {
    var x = o.value;
    x = o.value == "true" ? true : o.value == "false" ? false : o.value;
    return {
      key: o.key,
      value: x,
    };
  });
  arr3 = formSchemaArrayUnitTemplate.map((item, i) =>
    Object.assign({}, item, unitArray[i])
  );

  arr4 = formSchemaDeviceTemplate.map((items, s) =>
    Object.assign({}, items, deviceArray[s])
  );

  //formSchemaArray.push(...changingResponse);

  //console.log("data set", data)
  // console.log("initial value object", Initial_Values_obj);

  // console.log("array 3", arr3);
  console.log("array 4", arr4);
  return (
    <div className="CrxCreateTemplate">
      <CRXConfirmDialog
        setIsOpen={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
        onConfirm={onConfirmm}
        title="Please Confirm"
        isOpen={open}
        modelOpen={open}
        primary={primary}
        secondary={secondary}
      >
        {
          <div className="crxUplockContent">
            You are attempting to <strong>close</strong> the{" "}
            <strong>BC03 Template</strong>. If you close the form, any changes
            you've made will not be saved. You will not be able to undo this
            action.
            <p>
              Are you sure you would like to <strong>close</strong> the form?
            </p>
          </div>
        }
      </CRXConfirmDialog>

      <Menu
        align="start"
        viewScroll="initial"
        direction="bottom"
        position="auto"
        arrow
        menuButton={
          <MenuButton>
            <i className="fas fa-ellipsis-h"></i>
          </MenuButton>
        }
      >
        <MenuItem>
          <Link to="/admin/unitsdevicestemplate/clonetemplate">
            <div className="crx-meu-content groupingMenu crx-spac">
              <div className="crx-menu-icon">
                <i className="fas fa-pen"></i>
              </div>
              <div className="crx-menu-list">Clone template</div>
            </div>
          </Link>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content groupingMenu crx-spac">
            <div className="crx-menu-icon">
              <i className="fas fa-pen"></i>
            </div>
            <div className="crx-menu-list">Delete template</div>
          </div>
        </MenuItem>
      </Menu>
      <div className="tabCreateTemplate">
        <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />
        <div className="tctContent">
          <Formik
            enableReinitialize={true}
            initialValues={Initial_Values_obj}
            onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {}}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              setValues,
              isSubmitting,
              dirty,
              isValid,
              resetForm,
              touched,
              setFieldValue,
            }) => (
              <Form>
                <CrxTabPanel value={value} index={0}>
                  <div>
                    {arr3.map((formObj: any, key: number) => {
                      if (formObj.type == "text") {
                        return (
                          <div
                            style={{
                              display: "block",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <label>{formObj.label}</label>
                            <label>
                              {formObj.required === true ? "*" : null}
                            </label>
                            <Field
                              name={formObj.key}
                              //id={formObj.id}
                              type={formObj.type}
                            />
                            {formObj.hinttext == true ? (
                              <CRXTooltip
                                iconName="fas fa-info-circle"
                                title={formObj.hintvalue}
                                placement="right"
                              />
                            ) : null}
                          </div>
                        );
                      }

                      if (formObj.type == "select") {
                        return (
                          <div
                            style={{
                              display: "block",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <label>{formObj.label}</label>
                            <label>
                              {formObj.required === true ? "*" : null}
                            </label>

                            <Field name={formObj.key} component={formObj.type}>
                              {formObj.options.map((opt: any, key: string) => (
                                <option
                                  style={{ width: "50%" }}
                                  value={opt.value}
                                  key={key}
                                >
                                  {opt.label}{" "}
                                </option>
                              ))}
                            </Field>
                            {formObj.hinttext == true ? (
                              <CRXTooltip
                                iconName="fas fa-info-circle"
                                title={formObj.hintvalue}
                                placement="right"
                              />
                            ) : null}
                          </div>
                        );
                      }

                      if (formObj.type == "checkbox") {
                        return (
                          <div
                            style={{
                              display: "block",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <label>{formObj.label}</label>
                            <label>
                              {formObj.required === true ? "*" : null}
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
                          </div>
                        );
                      }

                      if (formObj.type == "number") {
                        return (
                          <div
                            style={{
                              display: "block",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <label>{formObj.label}</label>
                            <label>
                              {formObj.required === true ? "*" : null}
                            </label>
                            <Field
                              name={formObj.key}
                              id={formObj.id}
                              type={formObj.type}
                              /////////////////
                              //my disable code
                              /////////////////
                              //  disabled={values.defaultTemplate == true ? true : false}
                            />
                            <label>
                              {formObj.seconds === true ? "seconds" : "minutes"}
                            </label>
                            {formObj.hinttext == true ? (
                              <CRXTooltip
                                iconName="fas fa-info-circle"
                                title={formObj.hintvalue}
                                placement="right"
                              />
                            ) : null}
                          </div>
                        );
                      }

                      if (formObj.type == "radio") {
                        return (
                          <div
                            style={{
                              display: "block",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <label>{formObj.label}</label>
                            <label>
                              {formObj.required === true ? "*" : null}
                            </label>
                            <Field
                              id={formObj.id}
                              type={"text"}
                              name={formObj.key}
                              value={formObj.value}
                            />
                            {formObj.hinttext == true ? (
                              <CRXTooltip
                                iconName="fas fa-info-circle"
                                title={formObj.hintvalue}
                                placement="right"
                              />
                            ) : null}
                          </div>
                        );
                      }
                    })}
                  </div>
                </CrxTabPanel>

                <CrxTabPanel value={value} index={1}>
                  <div>
                    <label>* indicates required fields</label>
                    {arr4.map((formObjs: any, key: number) => {
                      if (formObjs.type == "text") {
                        return (
                          <div
                            style={{
                              display: "block",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <label>{formObjs.label}</label>
                            <label>
                              {formObjs.required === true ? "*" : null}
                            </label>
                            <Field
                              name={formObjs.key}
                              id={formObjs.id}
                              type={formObjs.type}
                            />
                            {formObjs.hinttext == true ? (
                              <CRXTooltip
                                iconName="fas fa-info-circle"
                                title={formObjs.hintvalue}
                                placement="right"
                              />
                            ) : null}
                          </div>
                        );
                      }

                      if (formObjs.type == "select") {
                        return (
                          <div
                            style={{
                              display: "block",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <h3
                              style={{
                                display: "block",
                                marginBottom: "10px",
                                marginTop: "10px",
                              }}
                            >
                              {formObjs.labelGroupRecording}
                            </h3>
                            <label>{formObjs.label}</label>
                            <label>
                              {formObjs.required === true ? "*" : null}
                            </label>

                            <Field
                              name={formObjs.key}
                              component={formObjs.type}
                            >
                              {formObjs.options.map((opt: any, key: string) => (
                                <option
                                  style={{ width: "50%" }}
                                  value={opt.value}
                                  key={key}
                                >
                                  {opt.label}{" "}
                                </option>
                              ))}
                            </Field>
                            {formObjs.hinttext == true ? (
                              <CRXTooltip
                                iconName="fas fa-info-circle"
                                title={formObjs.hintvalue}
                                placement="right"
                              />
                            ) : null}
                          </div>
                        );
                      }

                      if (formObjs.type == "checkbox") {
                        return (
                          <div
                            style={{
                              display: "block",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <h3
                              style={{
                                display: "block",
                                marginBottom: "10px",
                                marginTop: "10px",
                              }}
                            >
                              {formObjs.labelDeviceControls}
                            </h3>
                            <h3
                              style={{
                                display: "block",
                                marginBottom: "10px",
                                marginTop: "10px",
                              }}
                            >
                              {formObjs.labelLocation}
                            </h3>
                            <label>{formObjs.label}</label>
                            <label>
                              {formObjs.required === true ? "*" : null}
                            </label>

                            <Field
                              name={formObjs.key}
                              type={formObjs.type}
                              //checked={formObjs.value}
                            />

                            {formObjs.hinttext == true ? (
                              <CRXTooltip
                                iconName="fas fa-info-circle"
                                title={formObjs.hintvalue}
                                placement="right"
                              />
                            ) : null}
                          </div>
                        );
                      }

                      if (formObjs.type == "number") {
                        return (
                          <div
                            style={{
                              display: "block",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <label>{formObjs.label}</label>
                            <label>
                              {formObjs.required === true ? "*" : null}
                            </label>
                            <Field
                              name={formObjs.key}
                              id={formObjs.id}
                              type={formObjs.type}
                              /////////////////
                              //my disable code
                              /////////////////
                              //  disabled={values.defaultTemplate == true ? true : false}
                            />
                            <label>
                              {formObjs.seconds === true
                                ? "seconds"
                                : "minutes"}
                            </label>
                            {formObjs.hinttext == true ? (
                              <CRXTooltip
                                iconName="fas fa-info-circle"
                                title={formObjs.hintvalue}
                                placement="right"
                              />
                            ) : null}
                          </div>
                        );
                      }

                      if (formObjs.type == "radio") {
                        return (
                          <div
                          style={{
                            display: "block",
                            marginBottom: "10px",
                            marginTop: "10px",
                          }}
                          >
                            <label
                              style={{
                                display: "block",
                                marginBottom: "10px",
                                marginTop: "10px",
                              }}
                              >
                              {formObjs.labelMute}
                            </label>
                            <label>{formObjs.label}</label>
                            <label>
                              {formObjs.required === true ? "*" : null}
                            </label>

                            {/* {formObjs.optionss.map((o:any)=>{
                             <p>{o.key}</p>
                            })} */}
                          
                            <Field
                              id={formObjs.id}
                              //type={formObjs.type}
                              name="mute"
                              value={formObjs.value}
                              checked={formObjs.value == "disabled"}
                              //defaultChecked={formObjs.defaultChecked}
                              //onChange={() => setFieldValue(formObjs.key, "a")}
                            >
                             
                            </Field>
                            

                            {formObjs.hinttext == true ? (
                              <CRXTooltip
                                iconName="fas fa-info-circle"
                                title={formObjs.hintvalue}
                                placement="right"
                              />
                            ) : null}
                          </div>
                        );
                      }
                    })}
                  </div>
                </CrxTabPanel>
                <CrxTabPanel value={value} index={2}></CrxTabPanel>
                <div className="tctButton">
                  <div className="tctLeft">
                    <CRXButton
                      disabled={!dirty}
                      type="submit"
                      onClick={() => handleSave(values, resetForm)}
                    >
                      Save
                    </CRXButton>
                    <CRXButton onClick={() => history.goBack()}>
                      Cancel
                    </CRXButton>
                  </div>
                  <div className="tctRight">
                    <CRXButton onClick={() => handleChangeCloseButton(!dirty)}>
                      Close
                    </CRXButton>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditTemplate;
