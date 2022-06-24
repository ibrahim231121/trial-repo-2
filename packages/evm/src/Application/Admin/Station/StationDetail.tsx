import React from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { DEVICETYPE_GET_URL, STATION } from "../../../utils/Api/url";
import { useHistory, useParams } from "react-router";
import { urlList, urlNames } from "../../../utils/urlList";
import { getCountryStateAsync, getRetentionStateAsync, getUploadStateAsync } from "../../../Redux/StationReducer";
import {
  CRXMultiSelectBoxLight,
  CrxAccordion,
  CRXAlert,
  GoogleMap,
  CRXButton,
  CRXRows,
  CRXColumn,
  CRXConfirmDialog,
  CRXSelectBox
} from "@cb/shared";
import "./station.scss";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import Cookies from 'universal-cookie';
import { ConfigurationTemplates, TypeOfDevice } from "./DefaultUnitTemplate/DefaultUnitTemplateModel";

type StationFormType = {
  Name: string;
  StreetAddress?: string;
  Passcode?: string;
  Location?: any;
  PolicyId?: number;
  RetentionPolicy?: AutoCompleteOptionType;
  UploadPolicy?: AutoCompleteOptionType;
  BlackboxRetentionPolicy?: AutoCompleteOptionType;
  SSId?: string;
  Password?: string;
  ConfigurationTemplate: ConfigurationTemplates[] | any[];
};

interface AutoCompleteOptionType {
  label?: string;
  id?: string;
}

const cookies = new Cookies();
const StationDetail: React.FC = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getCountryStateAsync());
    dispatch(getRetentionStateAsync());
    dispatch(getUploadStateAsync());
  }, []);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const isAddCase = !!isNaN(+id);
  const retentionResponse: any = useSelector(
    (state: RootState) => state.stationReducer.retentionState
  );
  const uploadResponse: any = useSelector(
    (state: RootState) => state.stationReducer.uploadState
  );
  const [retentionAutoCompleteOptions, setRetentionAutoCompleteOptions] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [uploadAutoCompleteOptions, setUploadAutoCompleteOptions] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [blackBoxAutoCompleteOptions, setBlackBoxAutoCompleteOptions] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [errorResponseMessage, setErrorResponseMessage] =
    React.useState<string>(
      "We 're sorry. The station was unable to be saved. Please retry or contact your Systems Administrator"
    );
  const [deviceTypeCollection, setDeviceTypeCollection] = React.useState<TypeOfDevice[]>([]);
  const [defaultUnitTemplateSelectBoxValues, setDefaultUnitTemplateSelectBoxValues] = React.useState<any[]>([]);
  const configurationTemplatesFromStore = useSelector((state: any) => state.configurationTemplatesSlice.configurationTemplates);
  const [expanded, isExpaned] = React.useState("panel1");

  const stationInitialState: StationFormType = {
    Name: "",
    StreetAddress: "",
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
  interface IlatLong {
    lat: number;
    long: number;
  }
  const [stationPayload, setStationPayload] =
    React.useState<StationFormType>(stationInitialState);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<boolean>(false);
  const [retentionAutoCompleteValue, setRetentionAutoCompleteValue] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [uploadAutoCompleteValue, setUploadAutoCompleteValue] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [blackBoxAutoCompleteValue, setBlackBoxAutoCompleteValue] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [reset, setReset] = React.useState<boolean>(false);

  const [displayStationErrors, setDisplayStationError] =
    React.useState<string>("");

  const [latLong, setLatLong] = React.useState<IlatLong>();
  const [disableSaveButton, setDisableSaveButton] =
    React.useState<boolean>(true);
  const regex = /^[a-zA-Z0-9]+[a-zA-Z0-9\b]*$/;

  React.useEffect(() => {
    getDeviceTypeRecord();
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, []);

  React.useEffect(() => {
    if (retentionResponse) {
      setRetentionAutoCompleteOptions(retentionResponse)
      setBlackBoxAutoCompleteOptions(retentionResponse)
    }
  }, [retentionResponse]);

  React.useEffect(() => {
    if (uploadResponse)
      setUploadAutoCompleteOptions(uploadResponse)
  }, [uploadResponse]);

  React.useEffect(() => {
    if (!isAddCase) {
      const url = `${STATION}/${id}`;
      stationService(url, "GET")
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((station) => {
          const _station: StationFormType = {
            Name: station.name,
            StreetAddress: station.address.street,
            Passcode: station.passcode,
            Location: {
              latitude: station.geoLocation.latitude,
              longitude: station.geoLocation.longitude,
            },
            PolicyId: station.policies[0].id,
            RetentionPolicy: {
              id: station.policies[0].retentionPolicyId,
            },
            UploadPolicy: {
              id: station.policies[0].uploadPolicyId,
            },
            BlackboxRetentionPolicy: {
              id: station.policies[0].blackboxRetentionPolicyId,
            },
            SSId: station.ssid,
            Password: station.password,
            ConfigurationTemplate: station.policies[0].configurationTemplates
          };
          setRetentionAutoCompleteValue([{ id: station.policies[0].retentionPolicyId }]);
          setUploadAutoCompleteValue([{ id: station.policies[0].uploadPolicyId }]);
          setBlackBoxAutoCompleteValue([{ id: station.policies[0].blackBoxAutoCompleteValue }]);
          setStationPayload(_station);
          dispatch(enterPathActionCreator({ val: _station.Name }));
        });
    }
  }, [isAddCase]);

  React.useEffect(() => {
    /**
    * * Set Unit Template Select Box Values.
    */
    fillDefaultUnitTemplateSelectBoxValues();
  }, [stationPayload]);

  const filterData = (arr: Array<any>): Array<any> => {
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

  const retentionAutoCompleteonChange = (
    _: React.SyntheticEvent,
    val: AutoCompleteOptionType[],
    setFieldValue: any,
    reason: any
  ) => {
    setFieldValue("RetentionPolicy", val, false);
    setReset(!reset);
    setRetentionAutoCompleteValue(val);
  };

  const blackBoxAutoCompleteonChange = (
    _: React.SyntheticEvent,
    val: AutoCompleteOptionType[],
    setFieldValue: any,
    reason: any
  ) => {
    setFieldValue("BlackboxRetentionPolicy", val, false);
    setReset(!reset);
    setBlackBoxAutoCompleteValue(val);
  };

  const uploadAutoCompleteonChange = (
    _: React.SyntheticEvent,
    val: AutoCompleteOptionType[],
    setFieldValue: any,
    reason: any
  ) => {
    setFieldValue("UploadPolicy", val, false);
    setReset(!reset);
    setUploadAutoCompleteValue(val);
  };

  const stationService = async (url: string, type: string, body?: any) => {
    let requestOptions: any;
    if (type === "GET") {
      requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", TenantId: "1", 'Authorization': `Bearer ${cookies.get('access_token')}` },
      };
    } else if (type === "PUT") {
      requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json", TenantId: "1", 'Authorization': `Bearer ${cookies.get('access_token')}` },
        body: JSON.stringify(body),
      };
    } else {
      requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", TenantId: "1", 'Authorization': `Bearer ${cookies.get('access_token')}` },
        body: JSON.stringify(body),
      };
    }
    return fetch(url, requestOptions);
  };

  const errorHandler = (param: any) => {
    if (param !== undefined) {
      let error = JSON.parse(param);
      console.error("Error ", error)
      if (error.errors !== undefined) {
        if (
          error.errors.Passcode !== undefined &&
          error.errors.Passcode.length > 0
        ) {
          setError(true);
          setErrorResponseMessage(error.errors.Passcode[0]);
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
    debugger;
    let body = {
      name: values.Name,
      address: {
        street: values.StreetAddress,
      },
      geoLocation: {
        latitude: values.Location.latitude,
        longitude: values.Location.longitude,
      },
      units: [],
      policies: [
        {
          Id: values.PolicyId,
          RetentionPolicyId: values.RetentionPolicy?.id,
          BlackboxRetentionPolicyId: values.BlackboxRetentionPolicy?.id,
          UploadPolicyId: values.UploadPolicy?.id,
          ConfigurationTemplates: values.ConfigurationTemplate
        }
      ],
      passcode: values.Passcode,
      SSId: values.SSId,
      password: values.Password
    };
    /**
     * * Due To Validation On DeviceType.
     */
    body.policies[0].ConfigurationTemplates = body.policies[0].ConfigurationTemplates.map((obj: any) => {
      return {
        ...obj, typeOfDevice: { id: obj.typeOfDevice.id }
      }
    });
    if (isAddCase) {
      stationService(STATION, "POST", body)
        .then((res: any) => {
          if (res.ok) {
            setSuccess(true);
            setTimeout(() => navigateToStations(), 3000);
          } else return res.text();
        })
        .then((message) => {
          errorHandler(message);
        })
        .catch((err: any) => {
          setError(true);
          console.error(err);
        });
    } else {

      stationService(`${STATION}/${id}`, "PUT", body)
        .then((res: any) => {
          if (res.ok) {
            setSuccess(true);
            setTimeout(() => navigateToStations(), 3000);
          } else return res.text();
        })
        .then((message) => {
          errorHandler(message);
        })
        .catch((err: any) => {
          setError(true);
          console.error(err);
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

  const stationValidationSchema = Yup.object().shape({

    Name: Yup.string().required("Station Name is required"),
    Passcode: Yup.string()
      .test(
        'len',
        'Minimum 5 characters are allowed.',
        (val) => val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
      )
      .trim().matches(regex, 'Only alphabets and digits are allowed.').required("Pass Code is required"),
    SSId: Yup.string().test(
      'len',
      'Minimum 5 characters are allowed.',
      (val) => val === undefined || val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
    )
      .trim().matches(regex, 'Only alphabets and digits are allowed.').notRequired(),
    Password: Yup.string().test(
      'len',
      'Minimum 5 characters are allowed.',
      (val) => val === undefined || val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
    )
      .trim().matches(regex, 'Only alphabets and digits are allowed.').notRequired(),
    //RetentionPolicy: Yup.string().required("Retention policy is required"),
  });

  const getDeviceTypeRecord = () => {
    stationService(DEVICETYPE_GET_URL, "GET")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setDeviceTypeCollection(data);
      })
      .catch((err: any) => {
        setError(true);
        console.error(err);
      });
  }

  const fillDefaultUnitTemplateSelectBoxValues = () => {
    let stateObjectArray = [];
    if ((Object.keys(stationPayload.ConfigurationTemplate).length > 0)) {
      for (const x of stationPayload.ConfigurationTemplate) {
        stateObjectArray.push({ deviceId: x.typeOfDevice.id, templateId: x.id });
      }
      setDefaultUnitTemplateSelectBoxValues(stateObjectArray);
    }
  }

  const UnitTemplatesRender = ({ setFieldValue, values }: any): JSX.Element => {

    let Quotient = deviceTypeCollection.length / 2;
    let Remainder = deviceTypeCollection.length % 2;
    let NoOFColumnInFirstRow;
    let NoOFColumnInSecondRow;
    if (Remainder === 0) {
      NoOFColumnInFirstRow = Quotient;
      NoOFColumnInSecondRow = NoOFColumnInFirstRow;
    } else {
      NoOFColumnInFirstRow = Quotient + Remainder;
      NoOFColumnInSecondRow = Quotient;
    }
    const formatConfigurationTemplatesToMapCRXSelectBox = (collection: any[]) => {
      return collection.map((obj: any) => {
        return {
          displayText: obj.name,
          value: parseInt(obj.id)
        }
      });
    }

    const defaultUnitTemplateChangeHandler = (e: any, deviceId: string) => {
      /*
       * * To State Value.
       */
      setDefaultUnitTemplateSelectBoxValues((newObject) => {
        let values = newObject.filter((o: any) => {
          return o.deviceId !== deviceId;
        });
        return [...values, { deviceId: deviceId, templateId: e.target.value }]
      });

      /*
        * * To Update Formik Value For Post Or Update.
      */
      const templateId = e.target.value.toString();
      const searchedTemplate = configurationTemplatesFromStore.find((x: any) => x.id === templateId);
      const isAlreadyExist = defaultUnitTemplateSelectBoxValues.find(x => x.templateId === templateId);
      let operationType = 0;
      /**
       * * operationType = 1, Update,  operationType = 2, Add
       */
      isAlreadyExist ? operationType = 1 : operationType = 2;
      /**
       * * 'searchedTemplate' was freezed so in order to change its property, needed to create copy of it.
       */
      const objectCopy = { ...searchedTemplate };
      objectCopy.operationType = operationType;
      const configTemplateFormikValue = [...values.ConfigurationTemplate, objectCopy];
      setFieldValue("ConfigurationTemplate", configTemplateFormikValue, false);
    }

    const filterOptionValuesOnTheBaseOfDeviceId = (deviceId: number) => {
      if (Object.keys(configurationTemplatesFromStore).length > 0) {
        let filteredCollection: any;
        if (!isAddCase) {
          filteredCollection = configurationTemplatesFromStore.filter((obj: any) => {
            if ((parseInt(obj.typeOfDevice.id) === deviceId) && (obj.stationId == id)) {
              return obj;
            }
          });
        } else {
          filteredCollection = configurationTemplatesFromStore.filter((obj: any) => {
            if (parseInt(obj.typeOfDevice.id) === deviceId) {
              return obj;
            }
          });
        }
        return formatConfigurationTemplatesToMapCRXSelectBox(filteredCollection);
      }
      return [];
    }

    const setValueOfDefaultUnitTemplateSelectBox = (deviceTypeObj: TypeOfDevice) => {
      if (defaultUnitTemplateSelectBoxValues.length > 0) {
        if (defaultUnitTemplateSelectBoxValues.some(x => x.deviceId === deviceTypeObj.id)) {
          const filteredArray = configurationTemplatesFromStore.filter((x: any) => x.id.toString() == deviceTypeObj.id);
          const singleObject = filteredArray.map((x: any) => {
            return {
              displayText: x.name,
              value: parseInt(x.id)
            }
          })[0];
          return singleObject;
        }
      }
    }

    const setValueOfSelectBoxInUpdateCase = (deviceTypeObj: TypeOfDevice) => {
      const requiredDeviceObject = defaultUnitTemplateSelectBoxValues.find((x: any) => x.deviceId === deviceTypeObj.id)
      if (requiredDeviceObject) {
        return requiredDeviceObject.templateId.toString();
      }
    }

    return (
      <>
        <div className="stationDetailOne gepStationSetting">
          <div className="stationColumnSet">
            <CRXRows
              className="crxStationDetail"
              container="container"
              spacing={0}
            >
              {deviceTypeCollection.slice(0, NoOFColumnInFirstRow).map((deviceTypeObj: any) => (
                <CRXColumn
                  className="stationDetailCol"
                  container="container"
                  item="item"
                  lg={12}
                  xs={12}
                  spacing={0}
                  key={deviceTypeObj.id}
                >
                  <div className="colstation">
                    <label htmlFor="name">{deviceTypeObj.name}</label>
                    {
                      <CRXSelectBox
                        id={'simple-select-' + deviceTypeObj.id}
                        name={deviceTypeObj.id}
                        className='Autocomplete'
                        options={filterOptionValuesOnTheBaseOfDeviceId(parseInt(deviceTypeObj.id))}
                        onChange={(e: React.ChangeEvent) => defaultUnitTemplateChangeHandler(e, deviceTypeObj.id)}
                        value={
                          (!isAddCase)
                            ?
                            (defaultUnitTemplateSelectBoxValues.length > 0) && setValueOfSelectBoxInUpdateCase(deviceTypeObj)
                            :
                            setValueOfDefaultUnitTemplateSelectBox(deviceTypeObj)
                        }
                      />
                    }
                  </div>
                </CRXColumn>
              ))}
            </CRXRows>
          </div>
          <div className="stationColumnSet">
            <CRXRows
              className="crxStationDetail"
              container="container"
              spacing={0}
            >
              {deviceTypeCollection.slice(NoOFColumnInFirstRow, NoOFColumnInFirstRow + NoOFColumnInSecondRow).map((deviceTypeObj: any) => (
                <CRXColumn
                  className="stationDetailCol"
                  container="container"
                  item="item"
                  lg={12}
                  xs={12}
                  spacing={0}
                  key={deviceTypeObj.id}
                >
                  <div className="colstation">
                    <label htmlFor="name">{deviceTypeObj.name}</label>
                    {
                      <CRXSelectBox
                        id={'simple-select-' + deviceTypeObj.id}
                        name={deviceTypeObj.id}
                        className='Autocomplete'
                        options={filterOptionValuesOnTheBaseOfDeviceId(parseInt(deviceTypeObj.id))}
                        onChange={(e: React.ChangeEvent) => defaultUnitTemplateChangeHandler(e, deviceTypeObj.id)}
                        value={
                          (!isAddCase)
                            ?
                            (defaultUnitTemplateSelectBoxValues.length > 0) && setValueOfSelectBoxInUpdateCase(deviceTypeObj)
                            :
                            setValueOfDefaultUnitTemplateSelectBox(deviceTypeObj)
                        }
                      />
                    }
                  </div>
                </CRXColumn>
              ))}
            </CRXRows>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={stationPayload}
        validationSchema={stationValidationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, errors, touched, dirty, isValid }) => (
          <>
            <Form>
              <div className="ManageStation  switchLeftComponents">
                {success && (
                  <CRXAlert
                    message="Success: You have saved the Station"
                    alertType="toast"
                    open={true}
                  />
                )}
                {error && (
                  <CRXAlert
                    className=""
                    message={errorResponseMessage}
                    type="error"
                    alertType="inline"
                    open={true}
                  />
                )}
                <CrxAccordion
                  title="Station"
                  id="accorIdx1"
                  className="crx-accordion"
                  ariaControls="Content1"
                  name="panel1"
                  isExpanedChange={isExpaned}
                  expanded={expanded === "panel1"}
                >
                  <div className="stationDetailOne">
                    <div className="stationColumnSet">
                      <CRXRows
                        className="crxStationDetail"
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                          className={
                            "stationDetailCol " +
                            ` ${errors.Name && touched.Name == true
                              ? displayStationErrors
                              : ""
                            }`
                          }
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="name">
                              Station Name <span>*</span>
                            </label>
                            <div className="CrxStationError">
                              <Field id="name" name="Name" />
                              {errors.Name !== undefined &&
                                touched.Name === true ? (
                                <div className="errorStationStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.Name}
                                  {setDisplayStationError("errorBrdr")}
                                </div>
                              ) : null}
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
                          <div className="CBX-input">
                            <label htmlFor="latitude">Latitude</label>
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
                            <label htmlFor="longitude">Longitude</label>
                            <Field id="longitude" name="Location.longitude" />
                          </div>
                        </CRXColumn>
                        <CRXColumn
                          className="crxStationDetailBtn stationDetailCol crxLocationBtn"
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <label htmlFor="Location">Location</label>
                          <CRXButton
                            className="groupInfoTabButtons secondary"
                            onClick={() => setModal(true)}
                            color="secondary"
                          >
                            Map location
                          </CRXButton>
                        </CRXColumn>
                      </CRXRows>
                    </div>
                    <div className="stationColumnSet">
                      <CRXRows
                        className="crxStationDetail"
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                          className="stationDetailCol"
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="street">Street Address</label>
                            <Field id="street" name="StreetAddress" />
                          </div>
                        </CRXColumn>
                        <CRXColumn
                          className={
                            "stationDetailCol " +
                            ` ${errors.Passcode && touched.Passcode == true
                              ? displayStationErrors
                              : ""
                            }`
                          }
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="passcode">
                              Pass Code <span>*</span>
                            </label>
                            <div className="CrxStationError">
                              <Field id="passcode" name="Passcode" />
                              {errors.Passcode !== undefined &&
                                touched.Passcode === true ? (
                                <div className="errorStationStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.Passcode}
                                  {setDisplayStationError("errorBrdr")}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </CRXColumn>
                      </CRXRows>
                    </div>
                  </div>
                </CrxAccordion>
                <CrxAccordion
                  title="Station Settings"
                  id="accorIdx2"
                  className="crx-accordion "
                  ariaControls="Content2"
                  name="panel2"
                  isExpanedChange={isExpaned}
                  expanded={expanded === "panel2"}
                >
                  <div className="stationDetailOne gepStationSetting">
                    <div className="stationColumnSet">
                      <CRXRows
                        className="crxStationDetail"
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                          className="stationDetailCol"
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <div className="colstation">
                            <label htmlFor="name">Data Retention Policy</label>
                            <div className="CrxStationError">
                              <CRXMultiSelectBoxLight
                                id="retentionPolicyMultiSelect"
                                className="getStationField"
                                multiple={false}
                                value={retentionAutoCompleteValue}
                                options={filterData(
                                  retentionAutoCompleteOptions
                                )}
                                onChange={(
                                  e: React.SyntheticEvent,
                                  option: AutoCompleteOptionType[],
                                  reason: any
                                ) =>
                                  retentionAutoCompleteonChange(
                                    e,
                                    option,
                                    setFieldValue,
                                    reason
                                  )
                                }
                                CheckBox={true}
                                checkSign={false}
                                required={true}
                              />

                              {errors.RetentionPolicy !== undefined ? (
                                <div className="errorStationStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {" Retention Policy is required"}
                                  {setDisplayStationError("errorBrdr")}
                                </div>
                              ) : null}
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
                            <label htmlFor="name">Data Upload Policy</label>
                            <div className="CrxStationError">
                              <CRXMultiSelectBoxLight
                                id="uploadPolicyMultiSelect"
                                className="getStationField"
                                multiple={false}
                                value={uploadAutoCompleteValue}
                                options={filterData(
                                  uploadAutoCompleteOptions
                                )}
                                onChange={(
                                  e: React.SyntheticEvent,
                                  option: AutoCompleteOptionType[],
                                  reason: any
                                ) =>
                                  uploadAutoCompleteonChange(
                                    e,
                                    option,
                                    setFieldValue,
                                    reason
                                  )
                                }
                                CheckBox={true}
                                checkSign={false}
                                required={true}
                              />
                              {errors.UploadPolicy !== undefined ? (
                                <div className="errorStationStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {" Upload Policy is required"}
                                  {setDisplayStationError("errorBrdr")}
                                </div>
                              ) : null}
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
                            <label htmlFor="name">BlackBox Retention Policy</label>
                            <div className="CrxStationError">
                              <CRXMultiSelectBoxLight
                                id="blackBoxPolicyMultiSelect"
                                multiple={false}
                                value={blackBoxAutoCompleteValue}
                                options={filterData(
                                  blackBoxAutoCompleteOptions
                                )}
                                onChange={(
                                  e: React.SyntheticEvent,
                                  option: AutoCompleteOptionType[],
                                  reason: any
                                ) =>
                                  blackBoxAutoCompleteonChange(
                                    e,
                                    option,
                                    setFieldValue,
                                    reason
                                  )
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
                    <div className="stationColumnSet">
                      <CRXRows
                        className="crxStationDetail"
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                          className={
                            "stationDetailCol " +
                            ` ${errors.SSId && touched.SSId == true
                              ? displayStationErrors
                              : ""
                            }`
                          }
                          container="container"
                          item="item"
                          lg={10}
                          xs={10}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="SSId">
                              SSID
                            </label>
                            <div className="CrxStationError">
                              <Field id="SSId" name="SSId" />
                              {errors.SSId !== undefined &&
                                touched.SSId === true ? (
                                <div className="errorStationStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.SSId}
                                  {setDisplayStationError("errorBrdr")}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </CRXColumn>
                        <CRXColumn
                          className={
                            "stationDetailCol " +
                            ` ${errors.Password && touched.Password == true
                              ? displayStationErrors
                              : ""
                            }`
                          }
                          container="container"
                          item="item"
                          lg={10}
                          xs={10}
                          spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="password">
                              Password
                            </label>
                            <div className="CrxStationError">
                              <Field id="password" name="Password" />
                              {errors.Password !== undefined &&
                                touched.Password === true ? (
                                <div className="errorStationStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.Password}
                                  {setDisplayStationError("errorBrdr")}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </CRXColumn>
                      </CRXRows>
                    </div>
                  </div>
                </CrxAccordion>
                <CrxAccordion
                  title="Unit Templates"
                  id="accorIdx3"
                  className="crx-accordion "
                  ariaControls="Content3"
                  name="panel3"
                  isExpanedChange={isExpaned}
                  expanded={expanded === "panel3"}
                >
                  {deviceTypeCollection.length > 0 &&
                    UnitTemplatesRender({ setFieldValue, values })
                  }
                </CrxAccordion>

                <CRXRows container="container" spacing={0}>
                  <CRXColumn
                    className=""
                    container="container"
                    item="item"
                    xs={12}
                    spacing={0}
                  >
                    <div className="crxStationDetailBtn">
                      <CRXButton
                        type="submit"
                        disabled={!(isValid && dirty)}
                        variant="contained"
                        className="groupInfoTabButtons"
                      >
                        Save
                      </CRXButton>
                      <CRXButton
                        className="groupInfoTabButtons secondary"
                        color="secondary"
                        variant="outlined"
                        onClick={navigateToStations}
                      >
                        Cancel
                      </CRXButton>
                    </div>
                  </CRXColumn>
                </CRXRows>
              </div>
            </Form>

            <CRXConfirmDialog
              className="crx-unblock-modal CRXStationModal"
              title={"Select location on the map"}
              setIsOpen={setModal}
              onConfirm={() => onConfirm(setFieldValue)}
              isOpen={modal}
              primary={"Save Location"}
              secondary={"Cancel"}
              primaryDisabled={disableSaveButton}
            >
              {
                <>
                  <GoogleMap
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    zoomLevel={15}
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
