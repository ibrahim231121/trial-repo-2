import React, { useEffect } from "react";
import { Formik, Field, Form, FormikHelpers, useField } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { STATION } from "../../../utils/Api/url";
import { useHistory, useParams } from "react-router";
import { urlList, urlNames } from "../../../utils/urlList";
import { getCountryStateAsync } from "../../../Redux/StationReducer";
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

interface AutoCompleteOptionType {
  label?: string;
  id?: string;
}

type StationFormType = {
  Name: string;
  StreetAddress?: string;
  Country?: AutoCompleteOptionType;
  State?: AutoCompleteOptionType;
  City?: string;
  ZipCode?: string;
  PhoneNumber?: string;
  Location?: any;
};

const StationDetail: React.FC = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getCountryStateAsync());
  }, []);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const isAddCase = !!isNaN(+id);
  const countryStatesResponse: any = useSelector(
    (state: RootState) => state.stationReducer.countryStates
  );
  const [countryAutoCompleteOptions, setCountryAutoCompleteOptions] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [statesAutoCompleteOptions, setStatesAutoCompleteOptions] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [errorResponseMessage, setErrorResponseMessage] =
    React.useState<string>(
      "We 're sorry. The station was unable to be saved. Please retry or contact your Systems Administrator"
    );
  const [expanded, isExpaned] = React.useState("panel1");
  const stationInitialState: StationFormType = {
    Name: "",
    StreetAddress: "",
    Country: {
      id: "",
      label: "",
    },
    State: {
      id: "",
      label: "",
    },
    City: "",
    ZipCode: "",
    PhoneNumber: "",
    Location: {
      longitude: null,
      latitude: null,
    },
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
  const [countryAutoCompleteValue, setCountryAutoCompleteValue] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [stateAutoCompleteValue, setStateAutoCompleteValue] = React.useState<
    AutoCompleteOptionType[]
  >([]);
  const [reset, setReset] = React.useState<boolean>(false);

  const [displayStationErrors, setDisplayStationCategoryForm] =
    React.useState<string>("");

  const [latLong, setLatLong] = React.useState<IlatLong>();
  const [disableSaveButton, setDisableSaveButton] =
    React.useState<boolean>(true);

  React.useEffect(() => {
    if (countryStatesResponse)
      setCountryAutoCompleteOptions(countryStatesResponse);
  }, [countryStatesResponse]);

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
            Country: station.address.country,
            State: station.address.state,
            City: station.address.city,
            ZipCode: station.address.zip,
            PhoneNumber: "1-201-456-15",
            Location: {
              latitude: station.geoLocation.latitude,
              longitude: station.geoLocation.longitude,
            },
          };
          setStationPayload(_station);
        });
    }
  }, [isAddCase]);

  const filterOptionsSource = (arr: Array<any>): Array<any> => {
    const countryOptionsArray: any = [];
    if (arr.length > 0) {
      for (const elem of arr) {
        countryOptionsArray.push({
          id: elem.iso3,
          label: elem.name,
        });
      }
      const first = "United States";
      countryOptionsArray.sort((x: any, y: any) => {
        return x.label == first ? -1 : y.label == first ? 1 : 0;
      });
    }
    return countryOptionsArray;
  };

  const countryAutoCompleteonChange = (
    _: React.SyntheticEvent,
    val: AutoCompleteOptionType[],
    setFieldValue: any,
    reason: any
  ) => {
    setFieldValue("Country", val, false);
    setReset(!reset);
    setCountryAutoCompleteValue(val);
    setStateAutoCompleteValue([]);
    if (!(reason === "clear")) {
      const _country: any[] = [];
      _country.push(val);
      const _states = countryStatesResponse
        .find((x: any) => x.name === _country[0].label)
        .states.map((i: any) => {
          return {
            id: i.state_code,
            label: i.name,
          };
        });
      setStatesAutoCompleteOptions(_states);
    }
  };

  const stateAutoCompleteOnChange = (
    _: React.SyntheticEvent,
    value: AutoCompleteOptionType[],
    setFieldValue: any
  ) => {
    setFieldValue("State", value, false);
    setStateAutoCompleteValue(value);
  };

  const stationService = async (url: string, type: string, body?: any) => {
    let requestOptions: any;
    if (type === "GET") {
      requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", TenantId: "1" },
      };
    } else if (type === "PUT") {
      requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json", TenantId: "1" },
        body: JSON.stringify(body),
      };
    } else {
      requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", TenantId: "1" },
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
        city: values.City,
        country: values.Country?.label,
        state: values.State?.label,
        zip: values.ZipCode,
      },
      geoLocation: {
        latitude: values.Location.latitude,
        longitude: values.Location.longitude,
      },
      units: [],
      checkIns: [],
      policies: [],
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

  const SignupSchema = Yup.object().shape({
    Name: Yup.string().required("Station Name is required"),
  });
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={stationPayload}
        validationSchema={SignupSchema}
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
                            ` ${
                              errors.Name && touched.Name == true
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
                          <div className="colstation">
                            <label htmlFor="countryMultiSelect">Country</label>
                            <CRXMultiSelectBoxLight
                              id="countryMultiSelect"
                              multiple={false}
                              value={countryAutoCompleteValue}
                              options={filterOptionsSource(
                                countryAutoCompleteOptions
                              )}
                              onChange={(
                                e: React.SyntheticEvent,
                                option: AutoCompleteOptionType[],
                                reason: any
                              ) =>
                                countryAutoCompleteonChange(
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
                            <label htmlFor="stateMultiSelect">
                              State / Province
                            </label>
                            <CRXMultiSelectBoxLight
                              key={reset}
                              id="stateMultiSelect"
                              multiple={false}
                              value={stateAutoCompleteValue}
                              onChange={(
                                e: React.SyntheticEvent,
                                option: AutoCompleteOptionType[]
                              ) =>
                                stateAutoCompleteOnChange(
                                  e,
                                  option,
                                  setFieldValue
                                )
                              }
                              options={statesAutoCompleteOptions}
                              CheckBox={true}
                              checkSign={false}
                              required={true}
                              getOptionLabel={(option: any) =>
                                option.label || []
                              }
                            />
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
                            <label htmlFor="city">City</label>
                            <Field id="city" name="City" />
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
                            <label htmlFor="street">Street Address</label>
                            <Field id="street" name="StreetAddress" />
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
                            <label htmlFor="zipcode">Zip Code</label>
                            <Field id="zipcode" name="ZipCode" />
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
                            <label htmlFor="phone">Phone Number</label>
                            <Field id="phone" name="PhoneNumber" />
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
