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
import { getDeviceTypesAsync } from "../../Redux/templateDynamicForm";
import { CreateTempelateCase } from "./CreateTemplateCase";
import { UnitsAndDevicesAgent } from "../../utils/Api/ApiAgent";
import { ConfigurationTemplate, DeviceType } from "../../utils/Api/models/UnitModels";
import { useTranslation } from "react-i18next";
import { CaptureDevice } from "../../utils/Api/models/StationModels";
import { getCategoryAsync } from "../../Redux/categoryReducer";
import { getRetentionStateAsync, getStationsInfoAllAsync } from "../../Redux/StationReducer";
import {getAllSensorsEvents} from '../../Redux/SensorEvents';
import Dialogbox from "../../Application/Admin/UnitConfiguration/ConfigurationTemplates/Dialogbox";



var re = /[\/]/;


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
  const [FormSchema, setFormSchema] = React.useState<any>();
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
  const retention: any = useSelector((state: RootState) => state.stationReducer.retentionState);
  const categories: any = useSelector((state: RootState) => state.assetCategory.category);
  const deviceTypes: any = useSelector((state: RootState) => state.unitTemplateSlice.deviceTypes);
  const stations: any = useSelector((state: RootState) => state.stationReducer.stationInfo);
  const [stationsLoaded, setStationsLoaded] = React.useState<boolean>(false);
  const [deviceTypeLoaded, setDeviceTypeLoaded] = React.useState<boolean>(false);
  const formikProps = useFormikContext()
  const [errCkher, seterrChker] = React.useState<string>("");
  const targetRef = React.useRef<typeof CRXToaster>(null);
  const alertRef = useRef(null);
  const [alertType] = useState<string>('inline');
  const [errorType] = useState<string>('error');
  const [responseError] = React.useState<string>('');
  const [alert] = React.useState<boolean>(false);
  const [templateName] = React.useState<string>(historyState.deviceType);
  const [tabss, settabss] = React.useState<any>();
  const [tabss1, settabss1] = React.useState<any>();
  const [validationFailed, setValidationFailed] = React.useState<boolean>(true);
  const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] = React.useState<boolean>(false);
  const sensorEvents: any = useSelector((state: RootState) => state.sensorEventsSlice.sensorEvents);


  let tabs: { label: keyof typeof FormSchema, index: number }[] = [];
  let tabs1: { label: keyof typeof FormSchema, index: number }[] = [];
  const dispatch = useDispatch();
  async function setintialschema() {
    let dType  = historyState.deviceType.replace(/\s/g, '');
    let deviceId = historyState.deviceId.toString();
    if (dType == "Incar" || dType == "BC02" || dType == "BC03" || dType == "BC03LTE" || dType == "BC04") {
      var deviceTypeDataRow = await UnitsAndDevicesAgent.getDeviceType(deviceId).then((response:DeviceType) => response);
      if(deviceTypeDataRow.schema){
        setFormSchema(JSON.parse(deviceTypeDataRow.schema));
      }
    }
    else {
      window.location.replace("/notfound")
    }
  }

  React.useEffect(() => {
    setintialschema();
  }, [])

  React.useEffect(() => {
    if(FormSchema){
      Object.keys(FormSchema).forEach((x, y) => {
        const data = x as keyof typeof FormSchema
        tabs.push({ label: data, index: y })
      })
      Object.keys(FormSchema).forEach((x, y) => {
        let data = x as keyof typeof FormSchema
        if (data == "CameraSetup") {
          data = "Camera Setup";
        }
        let tData = t(data.toString())
        tabs1.push({ label: tData, index: y })
      })
      settabss(tabs);
      settabss1(tabs1);
      setintial();
    }
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, [FormSchema])
  
  function setintial() {
    if (historyState.deviceType == "Incar") {
      dispatch(getDeviceTypesAsync());
      dispatch(getAllSensorsEvents());
    }
    dispatch(getRetentionStateAsync());
    dispatch(getCategoryAsync());
    dispatch(getStationsInfoAllAsync());
    if (historyState.isedit || historyState.isclone) {
      dispatch(enterPathActionCreator({ val: t("Template, ") + historyState.deviceType + ": " + templateNameHistory }));
      loadData(historyState.id);
    }
    else {
      setDataFetched(true);
      dispatch(enterPathActionCreator({ val: t("Create_Template") + ": " + historyState.deviceType }));
    }
  }

  React.useEffect(() => {
    if (retention && retention.length > 0 && FormSchema) {
      setRetentionDropdown();
    }
  }, [retention,FormSchema]);

  React.useEffect(() => {
    if (categories && categories.length > 0 && FormSchema) {
      setCategoriesDropdown();
    }
  }, [categories,FormSchema]);

  React.useEffect(() => {
    if (deviceTypes && deviceTypes.length > 0 && FormSchema && historyState.deviceType == "Incar") {
      setCameraDeviceDropdown();
    }
  }, [deviceTypes,FormSchema, Initial_Values_obj]);

  React.useEffect(() => {
    if (stations && stations.length > 0 && FormSchema) {
      setStationDropDown();
    }
  }, [stations,FormSchema]);

  React.useEffect(() => {
    if(sensorEvents && sensorEvents.length > 0 && FormSchema && historyState.deviceType == "Incar") {
      setSensorsAndTriggersDropDown();
    }
  },[sensorEvents,FormSchema])

  const openCreateSensorsAndTriggersTemplate = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.sensorsAndTriggersCreate)[0].url}`;
    history.push(path);
  };




  const setRetentionDropdown = () => {
    var retentionOptions: any = [];
    retention.map((x: any, y: number) => {
      retentionOptions.push({ value: x.id, label: x.name })

    })
    if(historyState.deviceType == "Incar")
    {
      FormSchema["Unit Settings"].map((x: any, y: number) => {
        if (x.key == "unitSettings/mediaRetentionPolicy/Select" && x.options.length == 1) {
          x.options.push(...retentionOptions)
        }
        if (x.key == "unitSettings/blackboxRetentionPolicy/Select" && x.options.length == 1) {
          x.options.push(...retentionOptions)
        }
      })
    }
    else
    {
      let mediaRetentionPolicy = FormSchema["Device"].find((x:any) => x.key == "device/mediaRetentionPolicy/Select" && x.options.length == 1)
      let blackboxRetentionPolicy = FormSchema["Device"].find((x:any) => x.key == "device/blackboxRetentionPolicy/Select" && x.options.length == 1)
      mediaRetentionPolicy?.options.push(...retentionOptions)
      blackboxRetentionPolicy?.options.push(...retentionOptions)
    }
    setFormSchema(FormSchema);
  }
  const setCategoriesDropdown = () => {
    var categoriesOptions: any = [];
    categories.map((x: any, y: number) => {
      categoriesOptions.push({ value: x.id, label: x.name })
    })
    if(historyState.deviceType == "Incar"){
      FormSchema["Unit Settings"].map((x: any, y: number) => {
        if (x.key == "unitSettings/categories/Multiselect" && x.options.length == 1) {
          x.options.push(...categoriesOptions)
        }
      })
    }
    else{
      let x = FormSchema["Device"].find((x:any) => x.key == "device/categories/Multiselect" && x.options.length == 1)
      if(x)
      {
        x.options.push(...categoriesOptions)
      }
    }
    setFormSchema(FormSchema);
  }

  const setCameraDeviceDropdown = () => {
    var captureDevicesOptions: any = [];
    deviceTypes.filter((x:DeviceType) => x.name !== "Incar" && (x.category == "IPCamera" || x.category == "Video" || x.category == "Audio" || x.category == "DVR")).map((x: DeviceType) => {
      captureDevicesOptions.push({ value: x.id, label: x.name, category: x.category })
    })
    if (historyState.deviceType == "Incar") {
      console.log(Initial_Values_obj);
      let cameraDevice = FormSchema["CameraSetup"].find((x: any) => x.key == "CameraSetup/Camera/FieldArray")["feilds"][0].find((x: any) => x.key == "CameraSetup/device_1_Camera/Select")
      cameraDevice.options = [];
      cameraDevice.options.push(...captureDevicesOptions.filter((x:any) => x.category !== "Audio" && x.category !== "DVR"))
      if(Initial_Values_obj["CameraSetup/Camera/FieldArray"] && (historyState.isedit || historyState.isclone))
      {
        let cameraDevice1 = Initial_Values_obj["CameraSetup/Camera/FieldArray"]["feilds"][0].find((x: any) => x.key == "CameraSetup/device_1_Camera/Select")
        cameraDevice1.options = [];
        cameraDevice1.options.push(...captureDevicesOptions.filter((x:any) => x.category !== "Audio" && x.category !== "DVR"))
      }

      let audioDevice = FormSchema["CameraSetup"].find((x: any) => x.key == "CameraSetup/Camera/FieldArray")["feilds"][0].find((x: any) => x.key == "CameraSetup/audioDeviceType_1_Camera/Select")
      audioDevice.options = [];
      audioDevice.options.push(...captureDevicesOptions.filter((x:any) => x.category == "Audio"))
      if(Initial_Values_obj["CameraSetup/Camera/FieldArray"] && (historyState.isedit || historyState.isclone))
      {
        let audioDevice1 = Initial_Values_obj["CameraSetup/Camera/FieldArray"]["feilds"][0].find((x: any) => x.key == "CameraSetup/audioDeviceType_1_Camera/Select")
        audioDevice1.options = [];
        audioDevice1.options.push(...captureDevicesOptions.filter((x:any) => x.category == "Audio"))
      }

      let devicePrimaryDevice = FormSchema["Primary Device"].find((x: any) => x.key == "device/PrimaryDevice/Select")
      devicePrimaryDevice.options = [];
      devicePrimaryDevice.options.push(...captureDevicesOptions.filter((x:any) => x.category == "DVR"))
    }
    setFormSchema(FormSchema);
    setInitial_Values_obj(Initial_Values_obj);
    setDeviceTypeLoaded(true);
  }

  const setStationDropDown = () => {
    var stationOptions: any = [];
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

  const setSensorsAndTriggersDropDown = () => {
    let sensorsAndTriggersOptions: any = [];
    sensorsAndTriggersOptions.push({value : "Add All", label: "Add All"})
    sensorEvents.map((x:any) => {
      sensorsAndTriggersOptions.push({value : x.id, label: x.description})
    })
    SensorsAndTriggersHandler(sensorEvents,sensorsAndTriggersOptions);
  }
  
  const SensorsAndTriggersHandler =(sensorsEvents: any,sensorsAndTriggersOptions: any) => {
    if (historyState.deviceType == "Incar" && sensorsEvents.length > 0) {
      let sensorEvents = FormSchema["Sensors & Triggers"].find((x: any) => x.key == "SensorsAndTriggers/SensorEvents/Multiselect");
      if (Array.isArray(sensorsAndTriggersOptions)) {
        sensorEvents.options = [...sensorsAndTriggersOptions];
        setFormSchema(FormSchema);
      }
    }
  }


  React.useEffect(() => {
    if(dataFetched){
      let Initial_Values_RequiredField: Array<any> = [];
      let Initial_Values: Array<any> = [];

      // ****************
      // for loop for unittemplate
      // ****************
      // ****************
      // ****************


      //#region Tab 1

      for (var x of tabss) {
        var Property = x.label as keyof typeof FormSchema
        let editT1: Array<any> = [];
        let cameraFeildArrayCounterValue: number = 1;
        var counter = 1;
        for (let e0 of dataOfUnit) {
          //group/key/valueType
          let val: any;
          if (e0.valueType == "NumberBox")
            val = parseInt(e0.value);
          else if (e0.valueType == "CheckBox")
            val = e0.value.toLowerCase() === "true" ? true : false;
          else if (e0.valueType == "Multiselect")
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
            var key = e0.group + "/" + e0.key + "/" + e0.valueType;
            var findingKey = e0.group + "/" + keySplitted[0] + "__" + keySplitted[2] + "/" + e0.valueType;
            var parentKey = e0.group + "/" + keySplitted[2] + "/" + "FieldArray";

            var feildObj = FormSchema[e0.group]
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



        if(feildObj)
        {

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
                  var feildObjArr = FormSchema[e0.group]
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
          }
          editT1.push({
            key: e0.group + "/" + e0.key + "/" + e0.valueType,
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
    }

  }, [dataFetched]);

  const loadData = async (id:number) => {
    const url = `/ConfigurationTemplates/${id}`;
    UnitsAndDevicesAgent.getTemplateConfiguration(url)
    .then((response:ConfigurationTemplate) => 
    {
      setUnitData(response.fields) // If we get this it puts in the values for the forms !!!!
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

  const handleRowIdDependency = (key: string, extraFieldDependency?: any, formObj?: any, values?: any) => {
    let parentSplittedKey = formObj.key.split('_');
    key = key.replace("rowId", parentSplittedKey[1])
    let value = values[key]
    if(extraFieldDependency == "cameraDevice")
    {
      return FormSchema["CameraSetup"].find((x: any) => x.key == "CameraSetup/Camera/FieldArray")["feilds"][0].find((x: any) => x.key == "CameraSetup/device_1_Camera/Select").options.find((x:any) => x.value == value)?.label;
    }
    return value;
  }

  const handleSave = (values: any, resetForm: any) => {
    //  let value1 = values
    //  let value2= valuess
    let Initial_Values: Array<any> = [];
    let visibleCameraFields = values["CameraSetup/Camera/FieldArray"].feilds.flat(1).filter((formObj: any) => formObj.depends == null || formObj.depends?.every((x: any) => x.value.includes(handleRowIdDependency(x.key, x.extraFieldDependency, formObj, values))))
    Object.entries(values).forEach(([key, value]) => {
      var valueRaw: any = value;
      var split = key.split(re);
      let valueSaved = false;
      if (!(valueRaw?.feilds !== undefined)) {
        var valueToSave = true;
        var nonDependantValue = true;
        var keySubSplit = split[1].split('_');
        if(split[1] == "PrimaryDevice" && valueToSave)
        {
          let deviceType: DeviceType = deviceTypes.find((x:DeviceType) => x.id == valueRaw);
          if(deviceType)
          {
            Initial_Values.push({
              key: "PrimaryDeviceName",
              value: deviceType.name,
              group: split[0],
              valueType: split[2],
              sequence: 1,
            });
          }
        }
        if(split[1] === "SensorEvents") {
          valueRaw = valueRaw.filter((a: any) => a != "list of all sensors and triggers");
          if(valueRaw === undefined || valueRaw.length === 0){
            valueRaw = "";
          }
        }
        if (keySubSplit.length > 1) {
          var parentKey = split[0] + "/" + keySubSplit[2] + "/" + "FieldArray";
          valueToSave = values[parentKey].feilds.some((x: any) => x.some((y: any) => y.key == key)) && visibleCameraFields.some((x: any) => x.key == key);
          nonDependantValue = visibleCameraFields.some((x: any) => x.key == key);
          if(keySubSplit[0] == "device" && valueToSave)
          {
            let deviceType: DeviceType = deviceTypes.find((x:DeviceType) => x.id == valueRaw);
            if(deviceType)
            {
              Initial_Values.push({
                key: "deviceTypeCategory_" + keySubSplit[1] + "_" + keySubSplit[2],
                value: deviceType.category,
                group: split[0],
                valueType: split[2],
                sequence: 1,
              });
              Initial_Values.push({
                key: "deviceTypeName_" + keySubSplit[1] + "_" + keySubSplit[2],
                value: deviceType.name,
                group: split[0],
                valueType: split[2],
                sequence: 1,
              });
            }
          }
          else if(keySubSplit[0] == "audioDeviceType" && valueToSave){
            let deviceType: DeviceType = deviceTypes.find((x:DeviceType) => x.id == valueRaw);
            if(deviceType)
            {
              Initial_Values.push({
                key: "audioDeviceTypeName" + "_" + keySubSplit[1] + "_" + keySubSplit[2],
                value: deviceType.name,
                group: split[0],
                valueType: split[2],
                sequence: 1,
              });
            }
          }
        }
        if (valueToSave) {
          if(nonDependantValue)
          {
            Initial_Values.push({
              key: split[1],
              value: valueRaw,
              group: split[0],
              valueType: split[2],
              sequence: 1,
            });
          }
          else{
            Initial_Values.push({
              key: split[1],
              value: "",
              group: split[0],
              valueType: split[2],
              sequence: 1,
            });
          }
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
      const url = `/ConfigurationTemplates/${historyState.id}/KeyValue`;
      UnitsAndDevicesAgent.changeKeyValues(url,body).then(()=>{
        setDataFetched(false);
        targetRef.current.showToaster({ message: t("Template_Edited_Sucessfully"), variant: "Success", duration: 5000, clearButtton: true });
        loadData(historyState.id);
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

  const OnDeleteConfirmation = () => {
    UnitsAndDevicesAgent.deleteConfigurationTemplate(historyState.id)
    .then(() => {
      history.push(urlList.filter((item:any) => item.name === urlNames.adminUnitConfigurationTemplate)[0].url) 
    })
    .catch(function (error) {
        return error;
    });    
    setDeleteConfirmationIsOpen(false);
  }

  return (
    <>
      {tabss1 && tabss && <div className="CrxCreateTemplate switchLeftComponents CrxCreateTemplateUi ">
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
                      <CRXTooltip 
                      className="assetsGroupPopupTootip"
                      placement="bottom-left"
                      arrow={false}
                      title={"action"}
                      content={<i className="fas fa-ellipsis-h"></i>}

                      />
            </MenuButton>
          }
        >
          <MenuItem onClick={cloneTemplate}>
            <div className="crx-meu-content groupingMenu crx-spac">
              <div className="crx-menu-icon">
                <i className="far fa-copy"></i>
              </div>
              <div className="crx-menu-list">{t("Clone_template")}</div>
            </div>
          </MenuItem>
          {!historyState?.isDefaultTemplate && <MenuItem onClick={() => {setDeleteConfirmationIsOpen(true)}}>
            <div className="crx-meu-content groupingMenu crx-spac">
              <div className="crx-menu-icon">
                <i className="far fa-trash-alt"></i>
              </div>
              <div className="crx-menu-list">{t("Delete_template")}</div>
            </div>
          </MenuItem>}
        </Menu>
        <div className="tabCreateTemplate">
          <CRXTabs value={value} onChange={handleChange} tabitems={tabss1} />
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

                      {tabss.map((x: any) => {
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
                                    touched={touched} errors={errors} 
                                    setValidationFailed = {setValidationFailed}
                                    sensorsEvent = {openCreateSensorsAndTriggersTemplate} />}
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
                        className={validationFailed || !dirty ? "tctSaveDisable " : " tctSaveEnable"}
                        disabled={validationFailed || !dirty}
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
      </div >}

      <Dialogbox
        className="crx-unblock-modal crxConfigModal"
        title={""}
        setIsOpen={setDeleteConfirmationIsOpen}
        onConfirm={OnDeleteConfirmation}
        isOpen={deleteConfirmationIsOpen}
        myVar={true}
        secondary={t("Yes_delete")}
        primary={t("No_do_not_delete")}
      >
        {
          <div className="crxUplockContent configuserParaMain">
            <p className="configuserPara1">
              {t("You_are_attempting_to")} <span className="boldPara">{t("delete")}</span> {t("this")} {t("template")}.
              {t("You_will_not_be_able_to_undo_this_action.")}
            </p>
            <p className="configuserPara2">{t("Are_you_sure_you_would_like_to_delete_template?")}</p>
          </div>
        }
      </Dialogbox>
    </>
  );



};

export default CreateTemplate;


