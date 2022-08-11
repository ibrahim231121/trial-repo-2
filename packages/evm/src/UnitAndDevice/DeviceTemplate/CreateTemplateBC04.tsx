/* eslint-disable eqeqeq */
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
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
import { CRXConfirmDialog, CRXTooltip, CRXToaster, CRXAlert } from "@cb/shared";
import { enterPathActionCreator } from '../../Redux/breadCrumbReducer';
import * as Yup from "yup";
import { CRXTitle } from "@cb/shared";
import { urlList, urlNames } from "../../utils/urlList";
import { RootState } from "../../Redux/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { getRetentionPolicyInfoAsync, getCategoriesAsync, getStationsAsync } from "../../Redux/templateDynamicForm";
import { CreateTempelateCase } from "./CreateTemplateCase";
import Cookies from 'universal-cookie';
import { UnitsAndDevicesAgent } from "../../utils/Api/ApiAgent";
import { ConfigurationTemplate, DefaultConfigurationTemplate } from "../../utils/Api/models/UnitModels";
import { useTranslation } from "react-i18next";

const cookies = new Cookies();


var re = /[\/]/;
const username = localStorage.getItem('username')

const applyValidation = (arrayOfObj: any) => {
  var initialValuesArrayRequiredField: any = [];
  arrayOfObj.map((x: any) => {                           // Validations Object
    var validationstring: any;
    if (x.value.type == "number") {
      validationstring = Yup.number();
    }
    else if (x.value.type == "text") {
      validationstring = Yup.string();
    }
    else if (x.value.type == "select") {
      validationstring = Yup.string();
    }
    else if (x.value.type == "multiselect") {
      validationstring = Yup.array();
    }
    if (validationstring) {
      x.value.validation.map((y: any) => {
        if (y.when !== undefined) {
          let keySplittedWhen = y.when.key.split('_');
          let keyWhen = y.when.key;
          if(keySplittedWhen.length > 1){
            let keySplitted = x.key.split('_');
            keySplittedWhen[1] = keySplitted[1];
            keyWhen = keySplittedWhen.join('_')
          }
          validationstring = validationstring.when( keyWhen, {
            is: (key: any)=> key === y.when.value, 
            then: x.value.type == "multiselect" ? validationstring.min(1, y.msg) : validationstring.required(y.msg),
            otherwise: validationstring,
          })
        }
        else{
          if (y.key == "required") {
            validationstring = x.value.type == "multiselect" ? validationstring.min(1, y.msg) : validationstring.required(y.msg) ;
          }
          if (y.key == "min") {
            validationstring = validationstring.min(y.value, y.msg);
          }
          if (y.key == "max") {
            validationstring = validationstring.max(y.value, y.msg);
          }
        }
      })
    }
    initialValuesArrayRequiredField.push({ key: x.key, value: validationstring });
  })
  
  return initialValuesArrayRequiredField;
}

const CreateTemplate = (props: any) => {
  const { t } = useTranslation<string>();
  const [value, setValue] = React.useState(0);
  const [_FormSchema, setFormSchema] = React.useState({});
  const [Initial_Values_obj_RequiredField, setInitial_Values_obj_RequiredField] = React.useState<any>({});
  const [Initial_Values_obj, setInitial_Values_obj] = React.useState<any>({});
  const [open, setOpen] = React.useState(false);
  const [cameraFeildArrayCounter, setCameraFeildArrayCounter] = React.useState<number>(1);
  const [formSchema, setformSchema] = React.useState<any>({});
  const [primary] = React.useState<string>(t("Yes_close"));
  const [secondary] = React.useState<string>(t("No,_do_not_close"));
  const history = useHistory();
  let historyState = props.location.state;
  let templateNameHistory = "";
  if (historyState.isclone) {
    templateNameHistory = t("CLONE - ") + historyState.name;
  }
  else {
    templateNameHistory = historyState.name;
  }
  const [dataOfUnit, setUnitData] = React.useState<any>([]);
  const [dataFetched, setDataFetched] = React.useState<boolean>(false);
  const [editCase, setEditCase] = React.useState<boolean>(false);
  const retention: any = useSelector((state: RootState) => state.unitTemplateSlice.retentionPolicy);
  const categories: any = useSelector((state: RootState) => state.unitTemplateSlice.categories);
  const stations: any = useSelector((state: RootState) => state.unitTemplateSlice.stations);
  const [stationsLoaded, setStationsLoaded] = React.useState<boolean>(false);
  const formikProps = useFormikContext()
  const [errCkher, seterrChker] = React.useState<string>("");
  const targetRef = React.useRef<typeof CRXToaster>(null);
  const alertRef = useRef(null);
  const [alertType] = useState<string>('inline');
  const [errorType] = useState<string>('error');
  const [responseError] = React.useState<string>('');
  const [alert] = React.useState<boolean>(false);

  let FormSchema: any = null;
  let templateName: string = "";
  const dispatch = useDispatch();
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
  let tabs1: { label: keyof typeof FormSchema, index: number }[] = [];

  Object.keys(FormSchema).forEach((x, y) => {
    const data = x as keyof typeof FormSchema
    tabs.push({ label: data, index: y })
  })
  Object.keys(FormSchema).forEach((x, y) => {
    let data = x as keyof typeof FormSchema
    if (data == "CameraSetup") {
      data = "Camera Setup";
    }
    tabs1.push({ label: data, index: y })
  })

  React.useEffect(() => {
    if (historyState.deviceType == "Incar") {
      dispatch(getRetentionPolicyInfoAsync());
      dispatch(getCategoriesAsync());
    }

    dispatch(getStationsAsync());
    if (historyState.isedit || historyState.isclone) {
      dispatch(enterPathActionCreator({ val: t("Template, ") + historyState.deviceType + ": " + templateNameHistory }));
      loadData(historyState.name);
    }
    else {
      setDataFetched(true);
      dispatch(enterPathActionCreator({ val: t("Create_Template") + historyState.deviceType }));
    }

    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
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
      FormSchema["Primary Device"].map((x: any, y: number) => {
        if (x.key == "device/blackboxRetentionPolicy/Select" && x.options.length == 1) {
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
      setStationsLoaded(true);
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
      let cameraFeildArrayCounterValue: number = 1;
      var counter = 1;
      for (let e0 of dataOfUnit) {
        //configGroup/key/fieldType
        let val: any;
        if (e0.fieldType == "NumberBox")
          val = parseInt(e0.value);
        else if (e0.fieldType == "CheckBox")
          val = e0.value.toLowerCase() === "true" ? true : false;
        else if (e0.fieldType == "Multiselect")
          val = (e0.value ?? "").split(',')
        else
          val = e0.value;

        if (historyState.isclone) {
          if (e0.key == "templateName") {
            val = templateNameHistory;
          }
        }

        var keySplitted = e0.key.split('_');
        if (keySplitted.length > 1) {
          var key = e0.configGroup + "/" + e0.key + "/" + e0.fieldType;
          var findingKey = e0.configGroup + "/" + keySplitted[0] + "__" + keySplitted[2] + "/" + e0.fieldType;
          var parentKey = e0.configGroup + "/" + keySplitted[2] + "/" + "FieldArray";

          var feildObj = FormSchema[e0.configGroup]
            .find((x: any) => x.key == parentKey)
          ["feilds"]
          [0]
            .find((y: any) => y.key.replace('1', '') == findingKey && (y.type == "radio" ? y.value == val : true));

          var valueToPush = { ...feildObj, key: key, value: val };
          var valueIsExist = editT1.find((x: any) => x.key == parentKey);

          if (keySplitted[1] > cameraFeildArrayCounterValue) {
            cameraFeildArrayCounterValue = keySplitted[1];
            if (valueIsExist !== undefined) {
              counter++
            }
          }





          if (feildObj.hasOwnProperty("validation")) {
            Initial_Values_RequiredField.push({
              key: key,
              type: feildObj.type,
              validation: feildObj.validation
            });
          }


          if (valueIsExist !== undefined) {
            var feildLength = valueIsExist.value.feilds.length;
            if (feildLength < counter) {
              valueIsExist.value.feilds.push([valueToPush]);
            }
            else {
              if (feildObj.type == "radio") {
                var feildObjArr = FormSchema[e0.configGroup]
                  .find((x: any) => x.key == parentKey)
                ["feilds"]
                [0]
                  .filter((y: any) => y.key.replace('1', '') == findingKey);

                feildObjArr.map((a: any) => {
                  var arrayToPushIn = valueIsExist.value.feilds[counter - 1];
                  arrayToPushIn.push({ ...a, key: key, value: a.value });
                })

              }
              else {
                var arrayToPushIn = valueIsExist.value.feilds[counter - 1];
                arrayToPushIn.push(valueToPush);
              }
            }
          }
          else {
            editT1.push({
              key: parentKey,
              value: { value: "", feilds: [[valueToPush]] }
            })
          }
        }
        editT1.push({
          key: e0.configGroup + "/" + e0.key + "/" + e0.fieldType,
          value: val
        })
      }
      let tab1: any;
      if (historyState.isedit || historyState.isclone) {
        tab1 = editT1;
      }
      else {
        tab1 = FormSchema[Property];
        FormSchema[Property].map((x: any) => {
          if (x.type == "fieldarray") {
            x.feilds.map((y: any) => {
              y.map((z: any) => {
                tab1.push({
                  key: z.key,
                  value: z.value,
                })
              })

            })
          }
        })
      }
      for (const field of tab1) {
        var addItem: boolean = true;
        var radios = tab1.filter((y: any) => y.key == field.key && y.type == "radio");
        if (radios?.length > 0) {
          var radio = radios?.find((y: any) => y.value == field.value && y.selected == true);
          if (radio == undefined) {
            addItem = false;
          }
        }

        if (field.key == "unitSettings/categories/Multiselect") {
          Initial_Values.push({
            key: field.key,
            value: field.value,
          });
        }
        else if (field.hasOwnProperty("key") && addItem) {
          Initial_Values.push({
            key: field.key,
            value: field.value,
            feilds: field.value?.feilds !== undefined ? field.value?.feilds : field.feilds,
          });
        }


        let key_value_pair = Initial_Values.reduce(
          (formObj, item) => ((formObj[item.key] = item.feilds !== undefined ? { value: item.value, feilds: item.feilds } : item.value), formObj),
          {}
        );

        setInitial_Values_obj(key_value_pair);
      }


      for (const field of FormSchema[Property]) {

        if (field.hasOwnProperty("validation") || field.type == "fieldarray" && field.depends == undefined) {
          if (field.hasOwnProperty("validation")) {
            Initial_Values_RequiredField.push({
              key: field.key,
              type: field.type,
              validation: field.validation
            });
          }
          else if (field.type == "fieldarray") {
            if (!historyState.isedit && !historyState.isclone) {
              field.feilds.map((x: any) =>
                x.map((y: any) => {
                  if (y.validation) {
                    Initial_Values_RequiredField.push({
                      key: y.key,
                      type: y.type,
                      validation: y.validation
                    })
                  }
                }
                )
              )
            }
          }
        }
      }
      let key_value_pairs = Initial_Values_RequiredField.reduce(
        (formObj, item) => ((formObj[item.key] = { type: item.type, validation: item.validation }), formObj),
        {}
      );
      setInitial_Values_obj_RequiredField(key_value_pairs);

      const arrayOfObj = Object.entries(key_value_pairs).map((e) => ({ key: e[0], value: e[1] }));
      var initialValuesArrayRequiredField: any[] = applyValidation(arrayOfObj)
      var formSchemaTemp = initialValuesArrayRequiredField.reduce(                  // Validations Object
        (obj, item: any) => ({ ...obj, [item.key]: item.value }),
        {}
      );
      setformSchema(formSchemaTemp);

      setCameraFeildArrayCounter(cameraFeildArrayCounterValue);
    }

  }, [dataFetched]);


  const loadData = async (templateName:string) => {
    const url = `/ConfigurationTemplates/GetTemplateConfigurationTemplate?configurationTemplateName=${templateName}`;
    UnitsAndDevicesAgent.getTemplateConfiguration(url)
    .then((response:DefaultConfigurationTemplate) => 
    {
      setUnitData(response.templateData) // If we get this it puts in the values for the forms !!!!
      setDataFetched(true)
      if (historyState.isclone !== true) {
        setEditCase(true)
      }
    }
    );
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

    Object.entries(values).forEach(([key, value]) => {
      var valueRaw: any = value;
      var split = key.split(re);
      if (!(valueRaw?.feilds !== undefined)) {
        var valueToSave = true;
        var keySubSplit = split[1].split('_');
        if (keySubSplit.length > 1) {
          var parentKey = split[0] + "/" + keySubSplit[2] + "/" + "FieldArray";
          valueToSave = values[parentKey].feilds.some((x: any) => x.some((y: any) => y.key == key));
        }
        if (valueToSave) {
          if (split[2] == "Multiselect") {
            if (valueRaw.includes("add all")) {
              valueRaw = "";
              FormSchema["Unit Settings"].find((y: any) => y.key == key).options.map((x: any) => {
                if (x.value != "" && x.value != "add all") {
                  valueRaw = valueRaw + x.value + ",";
                }
              })
              if (valueRaw[valueRaw.length - 1] == ',') {
                valueRaw = valueRaw.substring(0, valueRaw.length - 1);
              }
            }
          }
          Initial_Values.push({
            key: split[1],
            value: valueRaw,
            group: split[0],
            valueType: split[2],
            sequence: 1,
          });
        }
      }

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
    let body: ConfigurationTemplate = {
      id: 0,
      name: templateNames,
      fields: fields,
      stationId: stationId,
      typeOfDevice: { id: historyState.deviceId },
      // sequence:
    };
    if (editCase == false) {
      UnitsAndDevicesAgent.addTemplateConfiguration(body).then((response: number)=>{
        if (response > 0) {
          history.push('/admin/unitanddevices/createtemplate/template', { id: response, name: templateNames, isedit: true, deviceId: historyState.deviceId, deviceType: historyState.deviceType })
          history.go(0)
          resetForm()
        }
        targetRef.current.showToaster({ message: t("Template_Sucessfully_Saved"), variant: "Success", duration: 5000, clearButtton: true });
      })
      .catch((e:any) => {
        if (e.request.status == 409) {
          targetRef.current.showToaster({ message: `${t("Template_with_this_name")} ${templateNames} ${t("is_already_exists")}`, variant: "Error", duration: 5000, clearButtton: true });
        }
        else{
          console.error(e.message);
          return e;
        }
      })
    }

    else {
      body.id = historyState.id;
      const url = `/ConfigurationTemplates/${historyState.id}/${username}/KeyValue`;
      UnitsAndDevicesAgent.changeKeyValues(url,body).then(()=>{
        setDataFetched(false);
        targetRef.current.showToaster({ message: t("Template_Edited_Sucessfully"), variant: "Success", duration: 5000, clearButtton: true });
        loadData(templateNames);
        dispatch(enterPathActionCreator({ val: t("Template, ") + historyState.deviceType + ": " + templateNames }));
        resetForm();
      })
      .catch((e:any) => {
        console.error(e);
        throw new Error(e.statusText);
      })
    }
  };

  const cloneTemplate = () => {
    history.push('/admin/unitanddevices/createtemplate/template', { id: historyState.id, isclone: true, name: historyState.name, deviceId: historyState.deviceId, deviceType: historyState.deviceType })
    history.go(0)
  }



  let customEvent = (event: any, y: any, z: any) => {
    if (event.target[z.inputType] === z.if) {
      y(z.field, z.value)
    }

  }

  return (
    <div className="CrxCreateTemplate CrxCreateTemplateUi ">
      <CRXToaster ref={targetRef} />
      <CRXAlert
        ref={alertRef}
        message={responseError}
        className='crxAlertUserEditForm'
        alertType={alertType}
        type={errorType}
        open={alert}
        setShowSucess={() => null}
      />
      <CRXConfirmDialog
        setIsOpen={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
        onConfirm={onConfirmm}
        title={t("Please_Confirm")}
        isOpen={open}
        modelOpen={open}
        primary={primary}
        secondary={secondary}
      >
        {
          <div className="crxUplockContent">
            {t("You_are_attempting_to")} <strong>{t("close")}</strong> {t("the")}{" "}
            <strong>{t("BC03_Template")}</strong>. {t("If_you_close_the_form")} 
            {t("any_changes_you_ve_made_will_not_be_saved.")} 
            {t("You_will_not_be_able_to_undo_this_action.")}
            <p>
            {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
            </p>
          </div>
        }
      </CRXConfirmDialog>

      <Menu
        align="start"
        viewScroll="initial"
        direction="left"
        position="auto"
        arrow
        menuButton={
          <MenuButton>
            <i className="fas fa-ellipsis-h"></i>
          </MenuButton>
        }
      >
        <MenuItem onClick={cloneTemplate}>
        <Link to={{ pathname: '/admin/unitanddevices/createtemplate/template', state: { id: historyState.id, isclone: true, type: historyState.name, deviceId: historyState.deviceId, deviceType: historyState.deviceType } }}>
            <div className="crx-meu-content groupingMenu crx-spac">
              <div className="crx-menu-icon">
                <i className="far fa-copy"></i>
              </div>
              <div className="crx-menu-list">{t("Clone_template")}</div>
            </div>
          </Link>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content groupingMenu crx-spac">
            <div className="crx-menu-icon">
              <i className="far fa-trash-alt"></i>
            </div>
            <div className="crx-menu-list">{t("Delete_template")}</div>
          </div>
        </MenuItem>
      </Menu>
      <div className="tabCreateTemplate">
        <CRXTabs value={value} onChange={handleChange} tabitems={tabs1} />
        <div className="tctContent">
          <Formik
            enableReinitialize={true}
            initialValues={Initial_Values_obj}
            onSubmit={(values, { setSubmitting, resetForm, setStatus }) => { }}
            validationSchema={Yup.object().shape(formSchema)}>
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
              errors
            }) => (
              <Form>
                {
                  <>

                    {tabs.map(x => {
                      return <CrxTabPanel value={value} index={x.index}>
                        <p className="DeviceIndicator"><span>*</span> {t("Indicates_required_field")}</p>
                        <div>

                        </div>
                        {FormSchema[x.label].map(
                          (formObj: any, key: number) => {
                            <div>
                              <p>{formObj.labelGroupRecording}</p>
                            </div>;

                            return (formObj.type !== undefined ? (
                              <div key={key}>
                                {stationsLoaded && <CreateTempelateCase
                                  formObj={formObj}
                                  values={values}
                                  setValues={setValues}
                                  FormSchema={FormSchema}
                                  index={0}
                                  handleChange={handleChange}
                                  setFieldValue={setFieldValue}
                                  cameraFeildArrayCounter={cameraFeildArrayCounter}
                                  setCameraFeildArrayCounter={setCameraFeildArrayCounter}
                                  applyValidation={applyValidation}
                                  Initial_Values_obj_RequiredField={Initial_Values_obj_RequiredField}
                                  setInitial_Values_obj_RequiredField={setInitial_Values_obj_RequiredField}
                                  isValid={isValid} setformSchema={setformSchema}
                                  touched={touched} errors={errors} />}
                              </div>) : (<></>));

                          }
                        )}
                      </CrxTabPanel>
                    })}
                  </>
                }
                <div className="tctButton">
                  <div className="tctLeft">
                    <CRXButton
                      className={!isValid || !dirty ? "tctSaveDisable " : " tctSaveEnable"}
                      disabled={!isValid || !dirty}
                      type="submit"
                      onClick={() => handleSave(values, resetForm)}
                    >
                      {t("Save")}
                    </CRXButton>
                    <CRXButton onClick={() => history.goBack()}>
                    {t("Cancel")}
                    </CRXButton>
                  </div>
                  <div className="tctRight">
                    <CRXButton onClick={() => handleChangeCloseButton(!dirty)}>
                    {t("Close")}
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
