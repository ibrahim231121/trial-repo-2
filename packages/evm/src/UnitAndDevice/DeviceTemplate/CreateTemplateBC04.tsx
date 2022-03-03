import React from "react";
import { CRXTabs, CrxTabPanel, CRXButton } from "@cb/shared";
import { useHistory } from "react-router";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Link } from "react-router-dom";
import "./createTemplate.scss";
import BC04 from "../unitSchemaBC04.json";
import BC03 from '../unitSchemaBC03.json';
import VRX from '../unitSchemaVRX.json';
import BC03LTE from "../unitSchemaBCO3Lte.json";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { CRXModalDialog } from "@cb/shared";
import { CRXConfirmDialog, CRXTooltip } from "@cb/shared";
import { BASE_URL_UNIT_SERVICE } from '../../utils/Api/url'
import * as Yup from "yup";
import { CRXTitle } from "@cb/shared";
import { urlList, urlNames } from "../../utils/urlList";
import { RootState } from "../../Redux/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { getRetentionPolicyInfoAsync, getCategoriesAsync, getStationsAsync } from "../../Redux/templateDynamicForm";



var re = /[\/]/;
const CreateTemplate = (props: any) => {

  const [value, setValue] = React.useState(0);
  const [_FormSchema, setFormSchema] = React.useState({});
  const [Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField] = React.useState<any>({});
  const [Initial_Values_obj, setInitial_Values_obj] = React.useState<any>({});
  const [open, setOpen] = React.useState(false);
  const [primary] = React.useState<string>("Yes, close");
  const [secondary] = React.useState<string>("No, do not close");
  const history = useHistory();
  const historyState = props.location.state;
  const [dataOfUnit, setUnitData] = React.useState<any>([]);
  const [dataFetched, setDataFetched] = React.useState<boolean>(false);
  const [editCase, setEditCase] = React.useState<boolean>(false);
  const retention: any = useSelector((state: RootState) => state.unitTemplateSlice.retentionPolicy);
  const categories: any = useSelector((state: RootState) => state.unitTemplateSlice.categories);
  const stations: any = useSelector((state: RootState) => state.unitTemplateSlice.stations);
  const formikProps = useFormikContext()
  let FormSchema: any = null;
  let templateName: string = "";
  const dispatch = useDispatch();
  console.log(historyState)
  if (historyState.deviceType == "BC03") {
    FormSchema = BC03;
  }
  else if (historyState.deviceType == "BC04") {
    FormSchema = BC04;
  }
  else if (historyState.deviceType == "Incar") {
    FormSchema = VRX;

  }
  else if (historyState.deviceType == "BC03LTE") {
    FormSchema = BC03LTE;
  }
  else {
    window.location.replace("/notfound")
  }
  React.useEffect(() => {
    setFormSchema(FormSchema);
  }, [FormSchema])
  templateName = historyState.deviceType;

  let tabs: { label: keyof typeof FormSchema, index: number }[] = [];

  Object.keys(FormSchema).forEach((x, y) => {
    const data = x as keyof typeof FormSchema
    tabs.push({ label: data, index: y })
  })


  React.useEffect(() => {
    if (historyState.deviceType == "Incar") {
      dispatch(getRetentionPolicyInfoAsync());
      dispatch(getCategoriesAsync());
    }

    dispatch(getStationsAsync());


    if (historyState.isedit)
      loadData();
    else
      setDataFetched(true);
  }, []);
  React.useEffect(() => {
    if (historyState.deviceType == "Incar") {
      setRetentionDropdown();
    }
  }, [retention]);
  React.useEffect(() => {
    if (historyState.deviceType == "Incar") {
      setCategoriesDropdown();
    }
  }, [categories]);


  React.useEffect(() => {
    setStationDropDown();
  }, [stations]);


  const setRetentionDropdown = () => {
    var retentionOptions: any = [];
    if (retention && retention.length > 0) {
      retention.map((x: any, y: number) => {
        retentionOptions.push({ value: x.id, label: x.name })

      })
      FormSchema["Unit Settings"].map((x: any, y: number) => {
        if (x.key == "unitSettings/mediaRetentionPolicy/Select" && x.options.length == 1) {
          x.options.push(...retentionOptions)
        }
      })
      setFormSchema(FormSchema);
    }
  }
  const setCategoriesDropdown = () => {
    var categoriesOptions: any = [];
    if (categories && categories.length > 0) {
      categories.map((x: any, y: number) => {
        categoriesOptions.push({ value: x.id, label: x.name })
      })
      //  categories.sort((a: any, b: any) => a.label.localeCompare(b.label));
      FormSchema["Unit Settings"].map((x: any, y: number) => {
        if (x.key == "unitSettings/categories/Multiselect" && x.options.length == 2) {
          x.options.push(...categoriesOptions)
        }
      })
      setFormSchema(FormSchema);
    }
  }

  const setStationDropDown = () => {
    var stationOptions: any = [];
    if (stations && stations.length > 0) {
      stations.map((x: any, y: number) => {
        stationOptions.push({ value: x.id, label: x.name })
      })
      if (historyState.deviceType == "Incar") {
        FormSchema["Template Information"].map((x: any, y: number) => {
          if (x.key == "unittemplate/station/Select" && x.options.length == 0) {
            x.options.push(...stationOptions)
          }
        })
      }
      else {
        FormSchema["Unit Template"].map((x: any, y: number) => {
          if (x.key == "unittemplate/station/Select" && x.options.length == 0) {
            x.options.push(...stationOptions)
          }
        })
      }
      setFormSchema(FormSchema);
    }
  }


  React.useEffect(() => {

    let Initial_Values_RequiredField: Array<any> = [];
    let Initial_Values: Array<any> = [];

    if (historyState.isedit) {

    }
    // ****************
    // for loop for unittemplate
    // ****************
    // ****************
    // ****************


    //#region Tab 1

    for (var x of tabs) {

      var Property = x.label as keyof typeof FormSchema
      let editT1: Array<any> = [];
      for (let e0 of dataOfUnit) {
        //configGroup/key/fieldType
        let val;
        if (e0.fieldType == "NumberBox")
          val = parseInt(e0.value);
        else if (e0.fieldType == "CheckBox")
          val = e0.value.toLowerCase() === "true" ? true : false;
        else
          val = e0.value;

        editT1.push({
          key: e0.configGroup + "/" + e0.key + "/" + e0.fieldType,
          value: val
        })
      }

      let tab1;
      if (historyState.isedit)
        tab1 = editT1;
      else
        tab1 = FormSchema[Property];

      for (const field of tab1) {
        if (field.key == "unitSettings/categories/Multiselect") {
          Initial_Values.push({
            key: field.key,
            value: field.value.split(','),
          });
        }
        else if (field.hasOwnProperty("key")) {
          Initial_Values.push({
            key: field.key,
            value: field.value,
          });
        }


        let key_value_pair = Initial_Values.reduce(
          (formObj, item) => ((formObj[item.key] = item.value), formObj),
          {}
        );

        setInitial_Values_obj(key_value_pair);
      }

      for (const field of FormSchema[Property]) {
        if (field.hasOwnProperty("requiredField")) {
          Initial_Values_RequiredField.push({
            key: field.key,
          });
        }

        let key_value_pairs = Initial_Values_RequiredField.reduce(
          (formObj, item) => ((formObj[item.key] = item.value), formObj),
          {}
        );

        setInitial_Values_obj_RequiredField(key_value_pairs);
      }
    }


    //#endregion

    // ****************
    // for loop for device
    // ****************
    // ****************
    // ****************


  }, [dataFetched]);

  const loadData = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", TenantId: "1" },
    };

    const unitDataResponse = await fetch(
      `${BASE_URL_UNIT_SERVICE}/ConfigurationTemplates/GetTemplateConfigurationTemplate?configurationTemplateName=${historyState.name}`,
      requestOptions
    );

    if (unitDataResponse.ok) {
      const response = await unitDataResponse.json();
      setUnitData(response.templateData); // If we get this it puts in the values for the forms !!!!
      setDataFetched(true);
      setEditCase(true)
    }
  };

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }



  const handleChangeCloseButton = (values: boolean) => {
    if (values == false) {
      setOpen(true);
    } else {
      history.push(urlList.filter((item: any) => item.name === urlNames.adminUnitConfigurationTemplate)[0].url);
    }
  };
  const onConfirmm = () => {
    setOpen(false);
    history.push(urlList.filter((item: any) => item.name === urlNames.adminUnitConfigurationTemplate)[0].url);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
  };

  const handleSave = (values: any, resetForm: any) => {
    //  let value1 = values
    //  let value2= valuess
    let Initial_Values: Array<any> = [];

    Object.entries(values).map(([key, value]) => {
      Initial_Values.push({
        key: key.split(re)[1],
        value: value,
        group: key.split(re)[0],
        valueType: key.split(re)[2],
        sequence: 1,
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

      var x = returnableObjects;
      Object.keys(x).forEach((a) => {
        if (a == "value" && Array.isArray(x[a])) {
          x[a] = x[a].toString()
        }
      })
      return (
        x.key !== "defaultTemplate"
        // && returnableObjects.key !== "templateName"
      );
    });

    var stationId = Initial_Values.find(x => x.key == "station").value;
    const body = {
      name: templateNames,
      isDefault: true, //added because of removal of defaultTemplate
      fields: fields,
      valueType: "1",
      stationId: stationId,
      typeOfDevice: { id: historyState.deviceId },
      // sequence:
    };
    if (editCase == false) {

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          TenantId: "1",
        },
        body: JSON.stringify(body),
      };
      const url = `${BASE_URL_UNIT_SERVICE}/ConfigurationTemplates`;
      fetch(url, requestOptions)
        .then((response: any) => {
          if (response.ok) {

            alert("happened form is being saved");

            window.location.reload()
            resetForm();
          } else {
            throw new Error(response.statusText);
          }
        })
        .catch((err: any) => {
          // setError(true);
          console.error(err);
        });
    }

    else {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          TenantId: "1",
        },
        body: JSON.stringify(body),
      };
      const url = `${BASE_URL_UNIT_SERVICE}/ConfigurationTemplates/${historyState.id}/KeyValue`;
      fetch(url, requestOptions)
        .then((response: any) => {
          if (response.ok) {
            setDataFetched(false);

            alert("happened form is being Edited");
            //setTest(true)
            loadData();
            // setTest(true)
            resetForm();
          } else {
            throw new Error(response.statusText);
          }
        })
        .catch((err: any) => {
          // setError(true);
          console.error(err);
        });
    }
  };

  const initialValuesArrayRequiredField = [];
  for (const i in Initial_Values_obj_RequiredField) {
    initialValuesArrayRequiredField.push(i);
  }

  const formSchema = initialValuesArrayRequiredField.reduce(                  // Validations Object
    (obj, item: any) => ({ ...obj, [item]: Yup.string().required("Required") }),
    {}
  );


  let customEvent = (event: any, y: any, z: any) => {
    if (event.target[z.inputType] === z.if) {
      y(z.field, z.value)
    }

  }

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
            onSubmit={(values, { setSubmitting, resetForm, setStatus }) => { }}
            validationSchema={Yup.object({
              ...formSchema,
            })}
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
                {
                  <>
                    {tabs.map(x => {
                      return <CrxTabPanel value={value} index={x.index}>
                        {FormSchema[x.label].map(
                          (formObj: any, key: number) => {
                            <div>
                              <p>{formObj.labelGroupRecording}</p>
                            </div>;

                            switch (formObj.type) {
                              case "text":
                                return (
                                  (formObj.depends == null || formObj.valueDepends.includes(values[formObj.depends])) &&
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
                                    <ErrorMessage
                                      name={formObj.key}
                                      render={(msg) => (
                                        <div style={{ color: "red" }}>
                                          {formObj.key.split(re)[1] + " is " + msg}
                                        </div>
                                      )}
                                    />
                                  </div>
                                );
                              case "time":
                                return (
                                  (formObj.depends == null || formObj.valueDepends.includes(values[formObj.depends])) &&
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
                                      {formObj.required === true ? "*" : null}
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
                                          {formObj.key.split(re)[1] + " is " + msg}
                                        </div>
                                      )}
                                    />
                                  </div>
                                );
                              case "radio":
                                return (
                                  (formObj.depends == null || formObj.valueDepends.includes(values[formObj.depends])) &&
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
                                      type={formObj.type}
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
                                    <ErrorMessage
                                      name={formObj.key}
                                      render={(msg) => (
                                        <div style={{ color: "red" }}>
                                          {formObj.key.split(re)[1] + " is " + msg}
                                        </div>
                                      )}
                                    />
                                  </div>
                                );
                              case "select":
                                return (
                                  (formObj.depends == null || formObj.valueDepends.includes(values[formObj.depends])) &&
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
                                          {formObj.key.split(re)[1] + " is " + msg}
                                        </div>
                                      )}
                                    />
                                  </div>
                                );
                              case "multiselect":

                                return (
                                  (formObj.depends == null || formObj.valueDepends.includes(values[formObj.depends])) &&
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
                                          {formObj.key.split(re)[1] + " is " + msg}
                                        </div>
                                      )}
                                    />
                                  </div>
                                );
                              case "checkbox":
                                return (
                                  (formObj.depends == null || formObj.valueDepends.includes(values[formObj.depends])) &&
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
                                          {formObj.key.split(re)[1] + " is " + msg}
                                        </div>
                                      )}
                                    />
                                  </div>
                                );
                              case "number":
                                return (
                                  (formObj.depends == null || formObj.valueDepends.includes(values[formObj.depends])) &&
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
                                          {formObj.key.split(re)[1] + " is " + msg}
                                        </div>
                                      )}
                                    />
                                  </div>
                                );
                            }
                          }
                        )}
                      </CrxTabPanel>
                    })}
                  </>
                }
                <div className="tctButton">
                  <div className="tctLeft">
                    <CRXButton
                      disabled={!isValid || !dirty}
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
    </div >
  );



};

export default CreateTemplate;
