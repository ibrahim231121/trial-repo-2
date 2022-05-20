import React, { useEffect } from "react";
import { Formik, Field, Form, FormikHelpers, useField } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { STATION } from "../../../utils/Api/url";
import { useHistory, useParams } from "react-router";
import { urlList, urlNames } from "../../../utils/urlList";
import { getCountryStateAsync, getRetentionStateAsync, getUploadStateAsync } from "../../../Redux/StationReducer";
import {
  CRXMultiSelectBoxLight,
  CrxAccordion,
  CRXAlert,
  CRXModalDialog,
  GoogleMap,
  CRXButton,
  CRXRows,
  CRXColumn,
  CRXConfirmDialog,
} from "@cb/shared";
import "./station.scss";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

interface AutoCompleteOptionType {
  label?: string;
  id?: string;
}

type StationFormType = {
  Name: string;
  StreetAddress?: string;
  Location?: any;
  PolicyId?: number;
  RetentionPolicy?: AutoCompleteOptionType;
  UploadPolicy?: AutoCompleteOptionType;
  BlackboxRetentionPolicy?: AutoCompleteOptionType;
};

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
  const [expanded, isExpaned] = React.useState("panel1");
  
  const stationInitialState: StationFormType = {
    Name: "",
    StreetAddress: "",
    Location: {
      longitude: null,
      latitude: null,
    },
    RetentionPolicy: {
      id: "",
      label:""
    },
    UploadPolicy: {
      id: "",
      label:""
    },
    BlackboxRetentionPolicy: {
      id: "",
      label:""
    }
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

  const [displayStationErrors, setDisplayStationCategoryForm] =
    React.useState<string>("");

  const [latLong, setLatLong] = React.useState<IlatLong>();
  const [disableSaveButton, setDisableSaveButton] =
    React.useState<boolean>(true);

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
            BlackboxRetentionPolicy : {
              id : station.policies[0].blackboxRetentionPolicyId,
            }
          };
          setRetentionAutoCompleteValue([{id:station.policies[0].retentionPolicyId}])
          setUploadAutoCompleteValue([{id:station.policies[0].uploadPolicyId}])
          setBlackBoxAutoCompleteValue([{id:station.policies[0].blackBoxAutoCompleteValue}])
          setStationPayload(_station);
          dispatch(enterPathActionCreator({ val: _station.Name }));
        });
    }
  }, [isAddCase]);

  React.useEffect(() => {
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, []);

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
        headers: { "Content-Type": "application/json", TenantId: "1",  'Authorization': `Bearer ${cookies.get('access_token')}` },
      };
    } else if (type === "PUT") {
      requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json", TenantId: "1",  'Authorization': `Bearer ${cookies.get('access_token')}` },
        body: JSON.stringify(body),
      };
    } else {
      requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", TenantId: "1",  'Authorization': `Bearer ${cookies.get('access_token')}` },
        body: JSON.stringify(body),
      };
    }
    return await fetch(url, requestOptions);
  };

  const errorHandler = (param: any) => {
    if (param !== undefined) {
      let error = JSON.parse(param);
      if (error.errors !== undefined) {
        if (
          error.errors.UserName !== undefined &&
          error.errors.UserName.length > 0
        ) {
          setError(true);
          setErrorResponseMessage(error.errors.UserName[0]);
        }
        if (error.errors.First !== undefined && error.errors.First.length > 0) {
          setError(true);
          setErrorResponseMessage(error.errors.First[0]);
        }
        if (error.errors.Last !== undefined && error.errors.Last.length > 0) {
          setError(true);
          setErrorResponseMessage(error.errors.Last[0]);
        }
        if (
          error.errors.Middle !== undefined &&
          error.errors.Middle.length > 0
        ) {
          setError(true);
          setErrorResponseMessage(error.errors.Middle[0]);
        }
        if (error.errors.Email !== undefined && error.errors.Email.length > 0) {
          setError(true);
          setErrorResponseMessage(error.errors.Email[0]);
        }
        if (
          error.errors.Number !== undefined &&
          error.errors.Number.length > 0
        ) {
          setError(true);
          setErrorResponseMessage(error.errors.Number[0]);
        }

        if (
          error.errors.Password !== undefined &&
          error.errors.Password.length > 0
        ) {
          setError(true);
          setErrorResponseMessage(error.errors.Password[0]);
        }
        if (
          error.errors['Address.State'] !== undefined
        ) {
          setErrorResponseMessage(error.errors['Address.State'][0]);
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
    const body = {
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
        }
      ],
      passcode: "abc123"
    };


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
  });
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
          {console.log('errors', errors)}
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
                                  {setDisplayStationCategoryForm("errorBrdr")}
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
                                {setDisplayStationCategoryForm("errorBrdr")}
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
                                {setDisplayStationCategoryForm("errorBrdr")}
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
                  </div>
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
