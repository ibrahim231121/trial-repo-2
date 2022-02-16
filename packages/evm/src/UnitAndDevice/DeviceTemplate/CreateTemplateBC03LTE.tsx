import React, { useState } from "react";
import { CRXTabs, CrxTabPanel, CRXButton } from "@cb/shared";
import { useHistory, useParams } from "react-router";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Link } from "react-router-dom";
import "./createTemplate.scss";
import FormSchema from "../unitSchemaBCO3Lte.json";
import { Formik, Form, Field } from 'formik';
import { CRXModalDialog } from "@cb/shared";
import { CRXConfirmDialog } from "@cb/shared";
const CreateTemplate = () => {
  const [value, setValue] = React.useState(0);
  const [premission, setPermission] = useState(true);
  const [saveBtn, setSaveBtn] = React.useState(true);
  const [formValues, Final] = React.useState('')
  const [formFields, setFormFields] = React.useState<any>([]);
  const [Initial_Values_obj, setInitial_Values_obj] = React.useState<any>({});
  const [formFieldsFinal, setFormFieldsFinal] = React.useState<any>([]);
  const [closeButton, setCloseButton] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [set, setMe] = React.useState(false)
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [primary] = React.useState<string>("Yes, close");
  const [secondary] = React.useState<string>("No, do not close");

  const history = useHistory()
  // const { BC04 } = useParams<{ BC04: string }>();
  // console.log('im BC04', BC04)
  React.useEffect(() => {

    let Initial_Values: Array<any> = [];

    // ****************
    // for loop for 
    // ****************
    // ****************
    // ****************

    for (const field of FormSchema.unittemplate) {

      if (field.hasOwnProperty('key')) {
        if (!field.hasOwnProperty('selected')) {
          Initial_Values.push({
            key: field.key, // thats the name of state
            value: field.value,
          })
        }
      }
      let key_value_pair = Initial_Values.reduce(
        (formObj, item) => ((formObj[item.key] = item.value), formObj),
        {}
      );
      setInitial_Values_obj(key_value_pair);
      const initial_values_of_fields = Object.entries(key_value_pair).map((o: any) => {
        return {
          key: o[0],
          value: o[1],
        }
      });
      setFormFields(initial_values_of_fields);
    }

    // ****************
    // for loop for device
    // ****************
    // ****************
    // ****************

    for (const field of FormSchema.device) {

      if (field.hasOwnProperty('key')) {
        if (!field.hasOwnProperty('selected')) {
          Initial_Values.push({
            key: field.key, // thats the name of state
            value: field.value,
          })
        }
        else if (field.selected == true) {
          Initial_Values.push({
            key: field.key, // thats the name of state
            value: field.value,
          })
        }
      }
      let key_value_pair = Initial_Values.reduce(
        (formObj, item) => ((formObj[item.key] = item.value), formObj),
        {}
      );
      setInitial_Values_obj(key_value_pair);
      const initial_values_of_fields = Object.entries(key_value_pair).map((o: any) => {
        return {
          key: o[0],
          value: o[1],
        }
      });
      setFormFields(initial_values_of_fields);
    }
  }, []);



  const onConfirm = () => {
    alert('great')
  }




  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }

  const tabs = [
    { label: "UNIT TEMPLATE ", index: 0 },
    { label: "DEVICE", index: 1 },
    { label: "SENSORS AND TRIGGERS", index: 2 },
    { label: "LTE Settings", index: 3 }
  ];

  const handleChangeCloseButton = (values: boolean) => {
    if (values == false) {
      setOpen(true)
    }
    else {
      history.push('/admin/unitconfiguration/unitconfigurationtemplate')
    }

  }
  const onConfirmm = () => {
    setOpen(false)
    history.push('/admin/unitconfiguration/unitconfigurationtemplate')
  }
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {

    setOpen(false);

  };

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
            You are attempting to <strong>close</strong> the <strong>BC03 Template</strong>. If you close the form, any changes you've made will not be saved. You will not be able to undo this action.

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
        <MenuItem >
          <Link to="/admin/unitsdevicestemplate/clonetemplate">
            <div className="crx-meu-content groupingMenu crx-spac">
              <div className="crx-menu-icon">
                <i className="fas fa-pen"></i>
              </div>
              <div className="crx-menu-list">Clone template</div>
            </div>
          </Link>
        </MenuItem>
        <MenuItem >
          <div className="crx-meu-content groupingMenu crx-spac">
            <div className="crx-menu-icon">
              <i className="fas fa-pen"></i>
            </div>
            <div className="crx-menu-list">Delete template</div>
          </div>
        </MenuItem>
      </Menu >
      <div className="tabCreateTemplate">
        <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />
        <div className="tctContent">


          <Formik
            enableReinitialize={true}
            initialValues={Initial_Values_obj}
            onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {
              alert(JSON.stringify(values, null, 2));

              resetForm()
            }}
          >
            {({ values, handleChange, handleSubmit, setValues, isSubmitting, dirty, isValid }) => (
              <Form>

                <CrxTabPanel value={value} index={0}  >
                  {FormSchema.unittemplate.map((formObj: any, key: number) => {
                    <div>

                      <p>{formObj.labelGroupRecording}</p>
                    </div>
                    switch (formObj.type) {
                      case "text":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field
                              name={formObj.key}
                              id={formObj.id}
                              type={formObj.type}

                            />

                          </div>
                        )


                      case "radio":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field
                              id={formObj.id}
                              type={formObj.type}
                              name={formObj.key}
                              value={formObj.value}

                            />
                          </div>
                        )
                      case "select":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field name={formObj.key} id={formObj.id} component={formObj.type}>
                              {formObj.options.map((opt: any, key: string) =>
                                <option style={{ width: '50%' }} value={opt.value} key={key}>{opt.label} </option>
                              )}
                            </Field>
                          </div>
                        )

                      case "checkbox":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field name={formObj.key} id={formObj.id} type={formObj.type} />
                          </div>
                        )
                      case "number":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field name={formObj.key} id={formObj.id} type={formObj.type}
                            /////////////////
                            //my disable code
                            ///////////////// 
                            //  disabled={values.defaultTemplate == true ? true : false} 
                            />
                            <label >{formObj.seconds === true ? "seconds" : "minutes"}</label>
                          </div>
                        )
                    }

                  }
                  )}
                </CrxTabPanel>

                <CrxTabPanel value={value} index={1}>
                  <label>* indicates required fields</label>
                  {FormSchema.device.map((formObj: any, key: number) => {

                    <label>{formObj.recording}</label>
                    switch (formObj.type) {
                      case "text":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field
                              name={formObj.key}
                              id={formObj.id}
                              type={formObj.type}
                            />

                          </div>
                        )


                      case "radio":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>{formObj.labelMute}</label>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>

                            <Field
                              id={formObj.id}
                              type={formObj.type}
                              name={formObj.key}
                              value={formObj.value}
                            />

                          </div>
                        )

                      case "select":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <h3 style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>{formObj.labelGroupRecording}</h3>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field name={formObj.key} id={formObj.id} component={formObj.type}

                            /////////////////
                            //my disable code
                            ///////////////// 
                            //  disabled={values.defaultTemplate == true ? true : false} 
                            // disabled={values.enablePreBufferCheckbox == true ? true : false}

                            >
                              {formObj.options.map((opt: any, key: string) =>
                                <option style={{ width: '50%' }} value={opt.value} key={key}>{opt.label} </option>
                              )}
                            </Field>
                          </div>
                        )

                      case "checkbox":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <h3 style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>{formObj.labelDeviceControls}</h3>
                            <h3 style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>{formObj.labelLocation}</h3>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field name={formObj.key} id={formObj.id} type={formObj.type} />
                          </div>
                        )
                      case "number":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field name={formObj.key} id={formObj.id} type={formObj.type}

                            />
                            <label >{formObj.seconds === true ? "seconds" : "minutes"}</label>
                          </div>
                        )

                    }
                  }
                  )
                  }
                </CrxTabPanel>

                <CrxTabPanel value={value} index={2}>
                  {/* <SensorsAndTriggers  formVal={formVal} /> */}
                </CrxTabPanel>

                <CrxTabPanel value={value} index={3}>
                {FormSchema.lteSetting.map((formObj: any, key: number) => {
                    <div>

                      <p>{formObj.labelGroupRecording}</p>
                    </div>
                    switch (formObj.type) {
                      case "text":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field
                              name={formObj.key}
                              id={formObj.id}
                              type={formObj.type}

                            />

                          </div>
                        )


                      case "radio":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field
                              id={formObj.id}
                              type={formObj.type}
                              name={formObj.key}
                              value={formObj.value}

                            />
                          </div>
                        )
                      case "select":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field name={formObj.key} id={formObj.id} component={formObj.type}>
                              {formObj.options.map((opt: any, key: string) =>
                                <option style={{ width: '50%' }} value={opt.value} key={key}>{opt.label} </option>
                              )}
                            </Field>
                          </div>
                        )

                      case "checkbox":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field name={formObj.key} id={formObj.id} type={formObj.type} />
                          </div>
                        )
                      case "number":
                        return (
                          <div style={{ display: "block", marginBottom: '10px', marginTop: '10px' }}>
                            <label >{formObj.label}</label>
                            <label >{formObj.required === true ? "*" : null}</label>
                            <Field name={formObj.key} id={formObj.id} type={formObj.type}
                            /////////////////
                            //my disable code
                            ///////////////// 
                            //  disabled={values.defaultTemplate == true ? true : false} 
                            />
                            <label >{formObj.seconds === true ? "seconds" : "minutes"}</label>
                          </div>
                        )
                    }

                  }
                  )}



                </CrxTabPanel>


                <div className="tctButton">
                  <div className="tctLeft">
                    <CRXButton disabled={!dirty} type="submit">Save</CRXButton>
                    <CRXButton onClick={() => history.push('/admin/unitconfiguration/unitconfigurationtemplate')}>Cancel</CRXButton>
                  </div>
                  <div className="tctRight">

                    <CRXButton onClick={() => handleChangeCloseButton(!dirty)}>Close</CRXButton>
                  </div>
                </div>

              </Form>
            )}
          </Formik>
        </div>
      </div>

    </div>
  )
}


export default CreateTemplate;