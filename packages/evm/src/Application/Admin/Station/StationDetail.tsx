import React, { useEffect, useRef } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { useHistory, useParams } from "react-router";
import { urlList, urlNames } from "../../../utils/urlList";
import { getRetentionStateAsync, getUploadStateAsync } from "../../../Redux/StationReducer";
import {
  CRXTabs,
  CrxTabPanel,
  CRXMultiSelectBoxLight,
  CRXAlert,
  GoogleMap,
  CRXButton,
  CRXRows,
  CRXColumn,
  CRXConfirmDialog,
  CRXToaster
} from "@cb/shared";
import "./station.scss";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { useTranslation } from 'react-i18next';
import InputShowHide from "../../../utils/InputShowHide/InputShowHide";
import { UnitsAndDevicesAgent } from "../../../utils/Api/ApiAgent";
import { ConfigurationTemplate, DeviceType } from "../../../utils/Api/models/UnitModels";
import { Station } from "../../../utils/Api/models/StationModels";
import { getConfigurationTemplatesAsync } from "../../../Redux/ConfigurationTemplatesReducer";
import { AutoCompleteOptionType, IlatLong, StationFormType } from "./StationTypes";
import { stationValidationSchema } from "./StationValidation";
import UnitTemplates from "./UnitTemplates/UnitTemplates";
import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "./../../Header/CRXNotifications/notificationsTypes"
import { RemoveSidePanelClass } from "../../../GlobalFunctions/globalDataTableFunctions";

const StationDetail: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const isAddCase = !!isNaN(+id);
  const toasterRef = useRef<typeof CRXToaster>(null);
  const retentionResponse: any = useSelector(
    (state: RootState) => state.stationReducer.retentionState
  );
  const uploadResponse: any = useSelector(
    (state: RootState) => state.stationReducer.uploadState
  );
  const [retentionAutoCompleteOptions, setRetentionAutoCompleteOptions] = React.useState<AutoCompleteOptionType[]>([]);
  const [uploadAutoCompleteOptions, setUploadAutoCompleteOptions] = React.useState<AutoCompleteOptionType[]>([]);
  const [blackBoxAutoCompleteOptions, setBlackBoxAutoCompleteOptions] = React.useState<AutoCompleteOptionType[]>([]);
  const [errorResponseMessage, setErrorResponseMessage] = React.useState<string>(
    t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
  );
  const [deviceTypeCollection, setDeviceTypeCollection] = React.useState<DeviceType[]>([]);
  const [blackBoxRetentionTouched, setBlackBoxRetentionTouched] = React.useState<number>(0);
  const [retentionPolicyTouched, setRetentionPolicyTouched] = React.useState<number>(0);
  const [uploadPolicyTouched, setUploadPolicyTouched] = React.useState<number>(0);
  const [blackBoxRetentionValue, setBlackBoxRetentionValue] = React.useState<AutoCompleteOptionType | null | undefined>(undefined);
  const [retentionPolicyValue, setRetentionPolicyValue] = React.useState<AutoCompleteOptionType | null | undefined>(undefined);
  const [uploadPolicyValue, setUploadPolicyValue] = React.useState<AutoCompleteOptionType | null | undefined>(undefined);
  const [defaultUnitTemplateSelectBoxValues, setDefaultUnitTemplateSelectBoxValues] = React.useState<any[]>([]);
  const stationInitialState: StationFormType = {
    Name: "",
    StreetAddress: "",
    Phone: "",
    Passcode: "",
    Location: {
      longitude: null,
      latitude: null,
    },
    RetentionPolicy: {
      id: "",
      label: ""
    },
    UploadPolicy: {
      id: "",
      label: ""
    },
    BlackboxRetentionPolicy: {
      id: "",
      label: ""
    },
    SSId: "",
    Password: "",
    ConfigurationTemplate: []
  };
  const [stationPayload, setStationPayload] = React.useState<StationFormType>(stationInitialState);
  const [error, setError] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<boolean>(false);
  const [retentionAutoCompleteValue, setRetentionAutoCompleteValue] = React.useState<AutoCompleteOptionType | null>(null);
  const [uploadAutoCompleteValue, setUploadAutoCompleteValue] = React.useState<AutoCompleteOptionType | null>(null);
  const [blackBoxAutoCompleteValue, setBlackBoxAutoCompleteValue] = React.useState<AutoCompleteOptionType | null>(null);
  const [latLong, setLatLong] = React.useState<IlatLong>();
  const [disableSaveButton, setDisableSaveButton] = React.useState<boolean>(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isButtonDisable, setIsButtionDisable] = React.useState(false);
  React.useEffect(() => {
    setIsButtionDisable(false);
    dispatch(getRetentionStateAsync());
    dispatch(getUploadStateAsync());
    getDeviceTypeRecord();
    dispatch(getConfigurationTemplatesAsync());
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, []);

  React.useEffect(() => {
    if (retentionResponse && Object.keys(retentionResponse).length > 0) {
      setRetentionAutoCompleteOptions(remapArrayToAutoCompleteOptionType(retentionResponse));
      setBlackBoxAutoCompleteOptions(remapArrayToAutoCompleteOptionType(retentionResponse));
    }
  }, [retentionResponse]);

  React.useEffect(() => {
    if (uploadResponse && Object.keys(uploadResponse).length > 0)
      setUploadAutoCompleteOptions(remapArrayToAutoCompleteOptionType(uploadResponse))
  }, [uploadResponse]);

  const getStation = () => {
    const url = `/Stations/${id}`;
    UnitsAndDevicesAgent.getStation(url)
      .then((response: Station) => {
        return response
      })
      .then((station) => {
        const _station: StationFormType = {
          Name: station.name,
          StreetAddress: station.address.street,
          Phone: station.address.phone,
          Passcode: station.passcode,
          Location: {
            latitude: station.geoLocation.latitude,
            longitude: station.geoLocation.longitude,
          },
          PolicyId: station.policies[0].id,
          RetentionPolicy: {
            id: String(station.policies[0].retentionPolicyId.cmtFieldValue),
            label : ""
          },
          UploadPolicy: {
            id: String(station.policies[0].uploadPolicyId),
            label : ""
          },
          BlackboxRetentionPolicy: {
            id: String(station.policies[0].blackboxRetentionPolicyId),
            label: ""
          },
          SSId: station.ssid ?? "",
          Password: station.password ?? "",
          ConfigurationTemplate: station.policies[0].configurationTemplates
        };
        setStationPayload(_station);
        dispatch(enterPathActionCreator({ val: t("Station") + ": " + _station.Name }));
        setIsButtionDisable(false);
      });
  }

  React.useEffect(() => {
    if (!isAddCase) {
      getStation();
    }
  }, [isAddCase]);
  
  React.useEffect(() => {
    /**
    * * Set Unit Template Select Box Values.
    */
    fillDefaultUnitTemplateSelectBoxValues();
    fillRetentionRelatedAutoCompletes();
  }, [stationPayload, retentionAutoCompleteOptions, blackBoxAutoCompleteOptions, uploadAutoCompleteOptions]);

  const fillDefaultUnitTemplateSelectBoxValues = () => {
    let stateObjectArray = [];
    if ((stationPayload.ConfigurationTemplate) && (Object.keys(stationPayload.ConfigurationTemplate).length > 0)) {
      for (const x of stationPayload.ConfigurationTemplate) {
        stateObjectArray.push({ deviceId: x.typeOfDevice.id, templateId: x.id });
      }
      setDefaultUnitTemplateSelectBoxValues(stateObjectArray);
    }
  }

  const fillRetentionRelatedAutoCompletes = () => {
    if (stationPayload.Name !== "") {
      if (retentionAutoCompleteOptions.length > 0) {
        let retentionAutoComplete = retentionAutoCompleteOptions.filter((x: any) => x.id == stationPayload.RetentionPolicy?.id)[0];
        setRetentionAutoCompleteValue(retentionAutoComplete);
        setRetentionPolicyValue(retentionAutoComplete);
      }
      if (blackBoxAutoCompleteOptions.length > 0) {
        let blackBoxAutoComplete = blackBoxAutoCompleteOptions.filter((x: any) => x.id == stationPayload.BlackboxRetentionPolicy?.id)[0];
        setBlackBoxAutoCompleteValue(blackBoxAutoComplete);
        setBlackBoxRetentionValue(blackBoxAutoComplete);
      }
      if (uploadAutoCompleteOptions.length > 0) {
        let uploadAutoComplete = uploadAutoCompleteOptions.filter(x => x.id == stationPayload.UploadPolicy?.id)[0];
        setUploadAutoCompleteValue(uploadAutoComplete);
        setUploadPolicyValue(uploadAutoComplete);
      }
    }
  }

  const remapArrayToAutoCompleteOptionType = (arr: Array<any>): Array<AutoCompleteOptionType> => {
    let retentionArray: any = [];
    if (arr.length > 0) {
      for (const elem of arr) {
        retentionArray.push({
          id: elem.id,
          label: elem.name,
        });
      }
      retentionArray = retentionArray.sort((a: any, b: any) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1));
    }
    return retentionArray;
  };

  const retentionAutoCompleteonChange = (e: React.SyntheticEvent, val: AutoCompleteOptionType, setFieldValue: any, reason: string) => {
    e.preventDefault();
    setFieldValue("RetentionPolicy", val, true);
    setRetentionAutoCompleteValue(val);
  }

  const blackBoxAutoCompleteonChange = (e: React.SyntheticEvent, val: AutoCompleteOptionType, setFieldValue: any, reason: string) => {
    e.preventDefault();
    setFieldValue("BlackboxRetentionPolicy", val, true);
    setBlackBoxAutoCompleteValue(val);
  }

  const uploadAutoCompleteonChange = (e: React.SyntheticEvent, val: AutoCompleteOptionType, setFieldValue: any, reason: string) => {
    e.preventDefault();
    setFieldValue("UploadPolicy", val, true);
    setUploadAutoCompleteValue(val);
  }

  const errorHandler = (param: any) => {
    if (param !== undefined) {
      let error = param;
      console.error("Error ", error)
      if (error.errors !== undefined) {
        if (
          error.errors.Passcode !== undefined &&
          error.errors.Passcode.length > 0
        ) {
          setError(true);
          setErrorResponseMessage(error.errors.Passcode[0]);
        }
        if (
          error.errors.Address.Phone !== undefined &&
          error.errors.Address.Phone.length > 0
        ) {
          setError(true);
          setErrorResponseMessage(error.errors.Address.Phone[0]);
        }
        if (error.errors.Name !== undefined && error.errors.Name.length > 0) {
          setError(true);
          setErrorResponseMessage(error.errors.Name[0]);
        }
        if (
          error.errors['Address.State'] !== undefined
        ) {
          setErrorResponseMessage(error.errors['Address.State'][0]);
          setError(true);
        }
        if (
          error.errors.SSId !== undefined
        ) {
          setErrorResponseMessage(error.errors.SSId[0]);
          setError(true);
        }
        if (
          error.errors.Password !== undefined
        ) {
          setErrorResponseMessage(error.errors.Password[0]);
          setError(true);
        }
      } else if (!isNaN(+error)) {
      } else if (error) {
        setError(true);
        setErrorResponseMessage(error);
      }
    }
  };

  const navigateToStations = () => {
    history.push(
      urlList.filter((item: any) => item.name === urlNames.adminStation)[0].url
    );
  };

  const onSubmit = (
    values: StationFormType,
    actions: FormikHelpers<StationFormType>
  ) => {
    setIsButtionDisable(true);
    let _configurationTemplate = values.ConfigurationTemplate.map((x: any) => {
      let configurationTemplate: any = {
        id: x.id,
        fields: x.fields,
        history: x.history,
        name: x.name,
        operationType: x.operationType,
        stationId: x.stationId,
        typeOfDevice: x.typeOfDevice
      }
      return configurationTemplate
    })
    let body: Station = {
      id: 0,
      name: values.Name,
      address: {
        street: values.StreetAddress,
        phone: values.Phone,
      },
      geoLocation: {
        latitude: values.Location.latitude,
        longitude: values.Location.longitude,
      },
      units: [],
      policies: [
        {
          id: values.PolicyId,
          retentionPolicyId: {
            cmtFieldValue: Number(values.RetentionPolicy?.id),
            cmtFieldName: '',
            id: '',
            record: []
          },
          blackboxRetentionPolicyId: Number(values.BlackboxRetentionPolicy?.id),
          uploadPolicyId: Number(values.UploadPolicy?.id),
          configurationTemplates: _configurationTemplate ?? []
        }
      ],
      passcode: values.Passcode ?? "",
      ssid: values.SSId ?? "",
      password: values.Password ?? ""
    };
    /**
     * * Due To Validation On DeviceType.
     */
    body.policies[0].configurationTemplates = body.policies[0].configurationTemplates.map((obj: ConfigurationTemplate) => {
      return {
        ...obj, typeOfDevice: { id: obj.typeOfDevice.id }
      }
    });
    if (isAddCase) {
      UnitsAndDevicesAgent.addStation(body).then((response: number) => {
        showToastMsg()
        setError(false);
        dispatch(enterPathActionCreator({ val: t("Station") + ": " + body.name }));
        const path = `${urlList.filter((item: any) => item.name === urlNames.adminStationEdit)[0].url}`;
        history.push(path.substring(0, path.lastIndexOf("/")) + "/" + response);
      })
        .catch((e: any) => {
          errorHandler(e.response.data);
          setError(true);
          console.error(e);
          setIsButtionDisable(false);
        });
    } else {
      body.id = Number(id);
      UnitsAndDevicesAgent.updateStation(`/Stations/${id}`, body).then((response: any) => {
        setError(false);
        showToastMsg()
        dispatch(enterPathActionCreator({ val: t("Station") + ": " + body.name }));
        getStation();
      })
        .catch((e: any) => {
          errorHandler(e.response.data);
          setError(true);
          console.error(e);
          setIsButtionDisable(false);
        });
    }
    actions.setSubmitting(false);
  };

  //google map
  const getMarkerLatLong = (location: number[]) => {
    setLatLong({ lat: location[0], long: location[1] });
    setDisableSaveButton(false);
  };
  const onConfirm = (setFieldValue: any) => {
    setFieldValue("Location.latitude", latLong?.lat, false);
    setFieldValue("Location.longitude", latLong?.long, false);
    setModal(false);
    setDisableSaveButton(true);
  };

  const getDeviceTypeRecord = () => {
    UnitsAndDevicesAgent.getAllDeviceTypes()
      .then((response: DeviceType[]) => {
        return response
      })
      .then((data) => {
        setDeviceTypeCollection(data);
      })
      .catch((err: any) => {
        setError(true);
        console.error(err);
      });
  }

  const handleChange = (event: any, newValue: number) => setValue(newValue);
  const tabs = [
    { label: t("General"), index: 0 },
    { label: t("Station_Settings"), index: 1 },
    { label: t("Unit_Templates"), index: 2 },
  ];

  const redirectPage = (values: StationFormType) => {
    if (
      JSON.stringify(stationPayload) !==
      JSON.stringify(values)
    ) {
      setIsOpen(true)
      setValue(tabs[0].index);
    } else
      history.push(
        urlList.filter((item: any) => item.name === urlNames.adminStation)[0]
          .url
      );
  };

  const closeDialog = () => {
    setIsOpen(false);
    history.push(
      urlList.filter((item: any) => item.name === urlNames.adminStation)[0].url
    );
  };

  const showToastMsg = () => {
    toasterRef.current.showToaster({
      message: t("Success_You_have_saved_the_Station"),
      variant: "success",
      duration: 7000,
      clearButtton: true,
    });

    let notificationMessage: NotificationMessage = {
      title: t("Station_Detail"),
      message: t("Success_You_have_saved_the_Station"),
      type: "success",
      date: moment(moment().toDate())
        .local()
        .format("YYYY / MM / DD HH:mm:ss"),
    };
    dispatch(addNotificationMessages(notificationMessage));
  };

  useEffect(() => {
    RemoveSidePanelClass()
  },[])

  const returnErrorString = (field: any, msg: string, fieldtouched: any) => {

    return ` ${field && fieldtouched == true
      ? msg
      : ""
      }`
  }

  const returnHtmlError = (field: any, fieldtouched: any) => {
    return field !== undefined &&
      fieldtouched === true ? (
      <div className="errorStationStyle ">
        <i className="fas fa-exclamation-circle"></i>
        {t(field)}
      </div>
    ) : null
  }

  const setfieldTouchedValue = (value: any) => {
    return value ? 1 : 0
  }

  const setFieldsValue = (value : AutoCompleteOptionType) => {
    return value === null ? null : value
  }
  
  return (
    <>
      <CRXToaster ref={toasterRef} className="assetsBucketToster" />
      <Formik
        enableReinitialize={true}
        initialValues={stationPayload}
        validationSchema={stationValidationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, errors, touched, dirty, isValid }) => (
          <>
            <Form>
              <div className="ManageStation ManageStationUi">
                {/* {success && (
                  <CRXAlert
                    message={t("Success_You_have_saved_the_Station")}
                    alertType="toast"
                    open={true}
                  />
                )} */}
                {error && (
                  <CRXAlert
                    className=""
                    message={errorResponseMessage}
                    type="error"
                    alertType="inline"
                    open={true}
                  />
                )}

                <CRXTabs value={value} onChange={handleChange} tabitems={tabs} stickyTab={142} />
                <CrxTabPanel value={value} index={0} >
                  <div className="centerGeneralTab">
                    <div className="itemIndicator">
                      <label className="indicates-label"><b>*</b> Indicates required field</label>
                    </div>
                    <div className="generalContainer crxStationDetail">
                      <div className="itemLeft">
                        <CRXColumn
                          className="crxStationDetailBtn stationDetailCol crxLocationBtn"
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <CRXButton
                            className="groupInfoTabButtons secondary  "
                            onClick={() => setModal(true)}
                            color="secondary"
                          >
                            {t("Map_location")}
                          </CRXButton>
                        </CRXColumn>

                        <CRXColumn
                          className="stationDetailCol latitudeGeneral"
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="latitude">{t("Latitude")}</label>
                            <Field id="latitude" name="Location.latitude" />
                          </div>
                        </CRXColumn>

                        <CRXColumn
                          className="stationDetailCol"
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="longitude">{t("Longitude")}</label>
                            <Field id="longitude" name="Location.longitude" />
                          </div>
                        </CRXColumn>


                      </div>
                      <div className="itemRight">


                        <CRXColumn
                          className={
                            "stationDetailCol " +
                            returnErrorString(errors.Name, "errorBrdr", touched.Name)
                          }
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="name">
                              {t("Station_Name")} <span>*</span>
                            </label>
                            <div className="CrxStationError">
                              <Field id="name" name="Name" />
                              {returnHtmlError(errors.Name, touched.Name)}
                            </div>
                          </div >
                        </CRXColumn>

                        <CRXColumn
                          className="stationDetailCol"
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="street">{t("Street_Address")}
                            </label>
                            <div className="CrxStationError">
                              <Field id="street" name="StreetAddress" />
                              {returnHtmlError(errors.StreetAddress, touched.StreetAddress)}
                            </div>
                          </div>
                        </CRXColumn>

                        <CRXColumn
                          className={
                            "stationDetailCol " +
                            returnErrorString(errors.Phone, "errorBrdr", touched.Phone)
                          }
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="phone">{t("Phone_Number")}</label>
                            <div className="CrxStationError">
                              <Field id="phone" name="Phone" />
                              {returnHtmlError(errors.Phone, touched.Phone)}
                            </div>
                          </div>
                        </CRXColumn>




                      </div>
                    </div>
                  </div>

                </CrxTabPanel>


                <CrxTabPanel value={value} index={1}>
                  <div className="centerSettingTab">
                    <div className="itemIndicator">
                      <label className="indicates-label"><b>*</b> Indicates required field</label>
                    </div>
                    <CRXRows
                      className="crxStationDetail"
                      container="container"
                      spacing={0}
                    >
                      <CRXColumn
                        className={
                          "stationDetailCol " +
                          returnErrorString(errors.Passcode, "errorBrdr", touched.Passcode)
                        }
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                        <div className="CBX-input passwordStationField">
                          <label htmlFor="passcode">
                            {t("Registration_Pass_Code")} <span>*</span>
                          </label>
                          <div className="CrxStationError">
                            <Field id="passcode" name="Passcode" component={InputShowHide} />
                          </div>
                        </div>
                      </CRXColumn>
                      <CRXColumn
                        className={
                          "stationDetailCol " +
                          returnErrorString(errors.SSId, "errorBrdr", touched.SSId)
                        }
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                        <div className="CBX-input">
                          <label htmlFor="SSId">
                            {t("SSID")}
                          </label>
                          <div className="CrxStationError">
                            <Field id="SSId" name="SSId" />
                            {returnHtmlError(errors.SSId, touched.SSId)}
                          </div>
                        </div>
                      </CRXColumn>
                      <CRXColumn
                        className={
                          "stationDetailCol " +
                          returnErrorString(errors.Password, "errorBrdr", touched.Password)
                        }
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                        style={{display: "none"}}
                      >
                        <div className="CBX-input passwordStationField">
                          <label htmlFor="password">
                            {t("SSID_Password")}
                          </label>
                          <div className="CrxStationError">
                            <Field id="password" name="Password" component={InputShowHide} />
                          </div>
                        </div>
                      </CRXColumn>
                      <CRXColumn
                        className="stationDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                        <div className="colstation">
                          <label htmlFor="name">{t("BlackBox_Retention_Policy")}<span>*</span></label>
                          <div className="CrxStationError">
                            <CRXMultiSelectBoxLight
                              id="blackBoxPolicyMultiSelect"
                              name="blackBoxPolicyMultiSelect"
                              multiple={false}
                              error={blackBoxRetentionTouched == 1}
                              errorMsg={t("Blackbox_Retention_Policy_is_required")}
                              value={blackBoxAutoCompleteValue}
                              options={blackBoxAutoCompleteOptions.length > 0 ? blackBoxAutoCompleteOptions : []}
                              onChange={(
                                e: any,
                                value: AutoCompleteOptionType,
                                reason: string
                              ) => {
                                blackBoxAutoCompleteonChange(
                                  e,
                                  value,
                                  setFieldValue,
                                  reason
                                )
                                setBlackBoxRetentionTouched(setfieldTouchedValue(value === null))
                                setBlackBoxRetentionValue(value);
                                setFieldValue("BlackboxRetentionPolicy", {
                                  id : value?.id,
                                  label : ""
                                })
                              }
                              }
                              onBlur ={() =>
                              {
                                setBlackBoxRetentionTouched(setfieldTouchedValue(blackBoxRetentionValue == (null || undefined)))
                              }}
                              CheckBox={true}
                              checkSign={false}
                              required={true}
                            />
                            
                          </div>
                        </div>
                      </CRXColumn>

                      <CRXColumn
                        className="stationDetailCol Uncategorized_Retention_Policy"
                        container="container "
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                        <div className="colstation">
                          <label htmlFor="name">{t("Data_Retention_Policy")}<span>*</span></label>
                          <div className="CrxStationError">
                            <CRXMultiSelectBoxLight
                              id="retentionPolicyMultiSelect"
                              className="getStationField"
                              multiple={false}
                              error={retentionPolicyTouched === 1}
                              errorMsg={t("Retention_Policy_is_required")}
                              value={retentionAutoCompleteValue}
                              options={retentionAutoCompleteOptions.length > 0 ? retentionAutoCompleteOptions : []}
                              onChange={(
                                e: any,
                                value: AutoCompleteOptionType,
                                reason: string
                              ) =>
                              {
                                retentionAutoCompleteonChange(
                                  e,
                                  value,
                                  setFieldValue,
                                  reason
                                )
                                setRetentionPolicyTouched(setfieldTouchedValue(value === null))
                                setRetentionPolicyValue(value);
                                setFieldValue("RetentionPolicy", {
                                  id : value?.id,
                                  label : ""
                                })
                              }
                              }

                              onBlur = {() =>
                              {
                                setRetentionPolicyTouched(setfieldTouchedValue(retentionPolicyValue == (null || undefined)))
                              }
                            }
                              CheckBox={true}
                              checkSign={false}
                              required={true}
                            />
                            
                          </div>
                        </div>

                      </CRXColumn>
                      <CRXColumn
                        className="stationDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                        <div className="colstation">
                          <label htmlFor="name">{t("Data_Upload_Policy")}<span>*</span></label>
                          <div className="CrxStationError">
                            <CRXMultiSelectBoxLight
                              id="uploadPolicyMultiSelect"
                              className="getStationField"
                              error={uploadAutoCompleteOptions.length > 0 && uploadPolicyTouched === 1}
                              errorMsg={t("Upload_Policy_is_required")}
                              multiple={false}
                              value={uploadAutoCompleteValue}
                              options={uploadAutoCompleteOptions.length > 0 ? uploadAutoCompleteOptions : []}
                              onChange={(
                                e: any,
                                value: AutoCompleteOptionType,
                                reason: string
                              ) =>
                              {
                                uploadAutoCompleteonChange(
                                  e,
                                  value,
                                  setFieldValue,
                                  reason
                                )
                                setUploadPolicyTouched(setfieldTouchedValue(value === null))
                                setUploadPolicyValue(value);
                                setFieldValue("UploadPolicy", {
                                  id : value?.id,
                                  label : ""
                                })
                              }
                              }
                              onBlur = {() =>
                              {
                                setUploadPolicyTouched(setfieldTouchedValue(uploadPolicyValue == (null || undefined)))
                              }
                              }
                              CheckBox={true}
                              checkSign={false}
                              required={true}
                            />
                            
                          </div>
                        </div>
                      </CRXColumn>
                    </CRXRows>
                  </div>
                </CrxTabPanel>

                <CrxTabPanel value={value} index={2}>
                  <div>
                    {deviceTypeCollection.length > 0 &&
                      <UnitTemplates
                        values={values}
                        setFieldValue={setFieldValue}
                        deviceTypeCollection={deviceTypeCollection}
                        isAddCase={isAddCase}
                        defaultUnitTemplateSelectBoxValues={defaultUnitTemplateSelectBoxValues}
                        setDefaultUnitTemplateSelectBoxValues={(p: any[]) => setDefaultUnitTemplateSelectBoxValues(p)}
                      />
                    }
                  </div>
                </CrxTabPanel>

                <div className="stationDetailButton stickyFooter_Tab">
                  <div>
                    <CRXButton
                      type="submit"
                      disabled={((!(isValid && dirty)) || isButtonDisable)}
                      variant="contained"
                      className="groupInfoTabButtons"
                    >
                      {t("Save")}
                    </CRXButton>
                    <CRXButton
                      className="groupInfoTabButtons secondary"
                      color="secondary"
                      variant="outlined"
                      onClick={navigateToStations}
                    >
                      {t("Cancel")}
                    </CRXButton>
                  </div>
                  <div>
                    <CRXButton
                      onClick={() => redirectPage(values)}
                      className="groupInfoTabButtons-Close secondary"
                      color="secondary"
                      variant="outlined"
                    >
                      {t("Close")}
                    </CRXButton>
                  </div>
                </div>
              </div>
            </Form>

            <CRXConfirmDialog
              setIsOpen={() => setIsOpen(false)}
              onConfirm={closeDialog}
              isOpen={isOpen}
              className="userGroupNameConfirm"
              primary={t("Yes_close")}
              secondary={t("No,_do_not_close")}
              text="user group form"
            >
              <div className="confirmMessage __crx__Please__confirm__modal">
                {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
                <strong>{t("'station'")}</strong>. {t("If_you_close_the_form")},
                {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
                <div className="confirmMessageBottom">
                  {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
                </div>
              </div>
            </CRXConfirmDialog>

            <CRXConfirmDialog
              className="crx-unblock-modal CRXStationModal"
              title={t("Select_location_on_the_map")}
              setIsOpen={setModal}
              onConfirm={() => onConfirm(setFieldValue)}
              isOpen={modal}
              primary={t("Save_Location")}
              secondary={t("Cancel")}
              primaryDisabled={disableSaveButton}
            >
              {
                <>
                  <GoogleMap
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    zoomLevel={isAddCase ? 0 : 15}
                    mapTypeControl={true}
                    // initialMarker={{ lat: 24.86, long: 67.0 }}
                    initialMarker={
                      !isAddCase
                        ? {
                          lat: values.Location.latitude,
                          long: values.Location.longitude,
                        }
                        : values.Location.latitude == 0 &&
                          values.Location.longitude == 0
                          ? undefined
                          : {
                            lat: values.Location.latitude,
                            long: values.Location.longitude,
                          }
                    }
                    //{lat: initialValues..Location.latitude, long: stationPayload.Location.longitude } : undefined}
                    getMarkerLatLong={(location: number[]) =>
                      getMarkerLatLong(location)
                    }
                  />
                </>
              }
            </CRXConfirmDialog>
          </>
        )}
      </Formik>
    </>
  );
};
export default StationDetail;
