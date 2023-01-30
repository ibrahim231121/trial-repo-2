import React, { useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router";
import { useTranslation } from 'react-i18next';
import './caseDetail.scss';
import * as Yup from "yup";
import moment from "moment";
import { Formik, Form, Field } from "formik";
import { AutoCompleteOptionType, CaseFormType, Case } from "../CaseTypes";
import { NotificationMessage } from  '../../Header/CRXNotifications/notificationsTypes';
import { CasesAgent } from "../../../utils/Api/ApiAgent"; 
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
  CRXToaster,
  TextField
} from "@cb/shared";

const CasesDetail:React.FC = () => {
  const { t } = useTranslation<string>();
  const history = useHistory();
  const caseInitialState: CaseFormType = {
    Title: "",
    CMT_CAD_RecId: 0,
    CADCsv: "",
    RMSId: "",
    State: {
      id: 0,
      label: ""
    },
    Status: {
      id: 0,
      label: ""
    },
    CreationType: {
      id: 0,
      label: ""
    },
    DescriptionPlainText: "",
    DescriptionJson: "",
    ClosedType: {
      id: 0,
      label: ""
    }
   };
   const [casePayload, setCasePayload] = React.useState<CaseFormType>(caseInitialState);
   const [states, setStates] = React.useState<AutoCompleteOptionType[]>([{ id :0, label: "Created"}, {id: 1, label: "New"}, {id: 2, label: "Approved"}]);
   const [status, setStatus] = React.useState<AutoCompleteOptionType[]>([{ id :0, label: "Open"}, {id: 1, label: "Closed"}, {id: 2, label: "Deleted"}]);  
   const [creationTypes, setCreationTypes] = React.useState<AutoCompleteOptionType[]>([{ id :0, label: "Manual"}, {id: 1, label: "Automatic"}, {id: 2, label: "RMS"}]);  
   const [closedTypes, setClosedTypes] = React.useState<AutoCompleteOptionType[]>([{ id :0, label: "ClosedAndReleaseEvidence"}, {id: 1, label: "ClosedWithEvidenceDelete"}]);
   const toasterRef = useRef<typeof CRXToaster>(null);


   //useEffects
    useEffect(()  =>{
      async function fetchAllDropDownsData() {

        await CasesAgent.getCaseStates('/Cases/GetCaseStates')
        .then((states: any) => {
          setStates(states);
        })
        .catch(() => {});

        await CasesAgent.getCaseStatus('/Cases/GetCaseStatus')
        .then((status: any) => {
          setStatus(status);
        })
        .catch(() => {});

        await CasesAgent.getCaseCreationType('/Cases/GetCaseCreationType')
        .then((creationTypes: any) => {
          setCreationTypes(creationTypes);
        })
        .catch(() => {});

        await CasesAgent.getCaseClosedType('/Cases/GetCaseClosedType')
        .then((closedTypes: any) => {
          setClosedTypes(closedTypes);
        })
        .catch(() => {});
      }
      
      fetchAllDropDownsData();
    }, []);

   //methods
   const caseValidationSchema = Yup.object().shape({
    Title: Yup.string().required("Title is required"),
    State: Yup.object().shape({
      id: Yup.string().required('State is required')
    }),
    Status: Yup.object().shape({
      id: Yup.string().required('Status is required')
    }),
    CreationType:  Yup.object().shape({
      id: Yup.string().required('Creation Type is required')
    })
  });

  const onSubmit= (values: any) => {
    console.log("submitFrom function", values)
    let caseBody: Case = { 
      RecId:0,
      Title:values.Title,
      CMT_CAD_RecId:0,
      CADCsv: "CADCsv",
      RMSId:"RMSId",
      State: values.State.id,
      Status: values.Status.id,
      CreationType: values.CreationType.id,
      ClosedType: values.ClosedType.id,
      DescriptionPlainText: values.DescriptionPlainText,
      DescriptionJson: "DescriptionJson",
    }
    console.log("caseBody", caseBody);
    showToastMsg();
    if (true) {
      CasesAgent.addCase('/Cases',caseBody).then((response: number) => {
        console.log("success response",response)
        showToastMsg();
        //dispatch(enterPathActionCreator({ val: t("Station") + ": " + body.name }));
        // const path = `${urlList.filter((item: any) => item.name === urlNames.adminStationEdit)[0].url}`;
        // history.push(path.substring(0, path.lastIndexOf("/")) + "/" + response);
        
        //setTimeout(() => navigateToStations(), 3000);
      })
        .catch((e: any) => {
          // errorHandler(e.response.data);
          // setError(true);
          console.log("error", e)
          console.error(e);
        });
    }
  }
  
  
  const showToastMsg = () => {
    toasterRef.current.showToaster({
      message: t("You_have_saved_the_Case_successfully"),
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
    //dispatch(addNotificationMessages(notificationMessage));
  };




   return (
      <>
       <CRXToaster ref={toasterRef} className="assetsBucketToster" />
        <Formik
        enableReinitialize={true}
        initialValues={casePayload}
        validationSchema={caseValidationSchema}
        onSubmit={(values) => {
          console.log("SUBMIT : " + values);
        }}
        >
      {
        ({setFieldValue, values, errors, touched, dirty, isValid }) => (
          <>
            <Form>
            <div className="CaseSettingsUpdate  switchLeftComponents">
              <div className="centerGeneralTab">
                <div className="itemIndicator">
                  <label className="indicates-label"><b>*</b> Indicates required field</label>
                </div>
                <CRXRows 
                  className="crxCaseDetail"
                  container="container"
                  spacing={0}
                  >
                  <CRXColumn
                    className="CaseDetailCol"
                    container="container"
                    item="item"
                    lg={6}
                    xs={6}
                    spacing={0}
                  >
                  <label></label>
                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                    <div className="CBX-input">
                        <label htmlFor="title">
                                Title<span>*</span>
                        </label>
                        <Field
                            id="title"
                            key="title"
                            name="Title"
                          />
                    </div>
                    {errors.Title !== undefined &&
                        touched.Title ? (
                          <div className="errorTenantStyle">
                            <i className="fas fa-exclamation-circle"></i>
                            {errors.Title}
                          </div>
                        ) : (
                          <></>
                        )}
                  </CRXColumn>

                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                    <div className="CBX-input">
                        <label htmlFor="cMT_CAD_RecId">
                        CMT_CAD 
                        </label>
                        <Field
                            id="cMT_CAD_RecId"
                            key="cMT_CAD_RecId"
                            name="CMT_CAD_RecId"
                          />
                    </div>
                  </CRXColumn>

                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                    <div className="CBX-input">
                        <label htmlFor="cADCsv">
                        CAD Csv 
                        </label>
                        <Field
                            id="cADCsv"
                            key="cADCsv"
                            name="CADCsv"
                          />
                    </div>
                  </CRXColumn>

                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                    <div className="CBX-input">
                        <label htmlFor="rMSId">
                        RMS Id
                        </label>
                        <Field
                            id="rMSId"
                            key="rMSId"
                            name="RMSId"
                          />
                    </div>
                  </CRXColumn>

                  <CRXColumn
                      className="CaseDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                    <CRXMultiSelectBoxLight
                            className="reasonsAutocomplete"
                            label="State"
                            multiple={false}
                            CheckBox={true}
                            required={true}
                            options={states}
                            value={values.State}
                            autoComplete={false}
                            isSearchable={true}
                            disabled={!values.State}
                            onChange={(
                              e: React.SyntheticEvent,
                              value: string[]
                            ) => {
                              setFieldValue("State", value, true);
                            }}
                          />
                  </CRXColumn>

                  <CRXColumn
                      className="CaseDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                    <CRXMultiSelectBoxLight
                            className="reasonsAutocomplete"
                            label="Status"
                            multiple={false}
                            CheckBox={true}
                            required={true}
                            options={status}
                            value={values.Status}
                            autoComplete={false}
                            isSearchable={true}
                            disabled={!values.Status}
                            onChange={(
                              e: React.SyntheticEvent,
                              value: string[]
                            ) => {
                              setFieldValue("Status", value, true);
                            }}
                          />
                  </CRXColumn>

                  <CRXColumn
                      className="CaseDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                    <CRXMultiSelectBoxLight
                            className="reasonsAutocomplete"
                            label="Creation Type"
                            multiple={false}
                            CheckBox={true}
                            required={true}
                            options={creationTypes}
                            value={values.CreationType}
                            autoComplete={false}
                            isSearchable={true}
                            disabled={!values.CreationType}
                            onChange={(
                              e: React.SyntheticEvent,
                              value: string[]
                            ) => {
                              setFieldValue("CreationType", value, true);
                            }}
                          />
                  </CRXColumn>

                  <CRXColumn
                      className="CaseDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                    <CRXMultiSelectBoxLight
                            className="reasonsAutocomplete"
                            label="Closed Type"
                            multiple={false}
                            CheckBox={true}
                            required={false}
                            options={closedTypes}
                            value={values.ClosedType}
                            autoComplete={false}
                            isSearchable={true}
                            disabled={!values.ClosedType}
                            onChange={(
                              e: React.SyntheticEvent,
                              value: string[]
                            ) => {
                             setFieldValue("ClosedType", value, true);
                            }}
                          />
                  </CRXColumn>

                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                    <div className="CBX-input">
                        <label htmlFor="descriptionPlainText">
                        Description 
                        </label>
                        <TextField
                            id="descriptionPlainText"
                            key="descriptionPlainText"
                            name="DescriptionPlainText"

                            required={false}
                            value={values.DescriptionPlainText}
                          //  label="Description"
                            className="retention-policies-input"
                            onChange={(e: any) =>  setFieldValue("DescriptionPlainText", e.target.value, true)}
                            disabled = {false}
                            type="text"
                            regex=""
                            
                          />
                    </div>
                  </CRXColumn>

                
                  </CRXColumn>

                  
                </CRXRows>

                <CRXButton
                    type="submit"
                    disabled={!isValid || !dirty}
                    onClick={() => onSubmit(values)} 
                    variant="contained"
                    className="groupInfoTabButtons"
                  >
                    Save
                  </CRXButton>
              </div>
            </div>
          </Form>
        </>
        )}
      </Formik>
    </>
  );
}

export default CasesDetail;