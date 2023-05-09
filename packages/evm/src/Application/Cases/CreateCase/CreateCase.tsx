import { forwardRef, ForwardRefRenderFunction, useRef, useImperativeHandle, useEffect, useState } from "react";
import { Field, Form, Formik, FormikProps } from "formik";
import { AutoCompleteOptionType, TCaseFormType, TCaseEditUserDetail } from "../CaseTypes";
import { CRXColumn, CRXRows, CRXMultiSelectBoxLight, CRXContainer, CRXRichTextBox } from "@cb/shared";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import './CreateCase.scss';
import moment from "moment";

type CreateCaseProps = {
    formInitialState?: TCaseFormType,
    statusAutoCompleteOptions: AutoCompleteOptionType[],
    caseLeadAutoCompleteOptions: AutoCompleteOptionType[],
    cadCsvAutoCompleteOptions: AutoCompleteOptionType[],
    formValues: TCaseFormType | undefined,
    isEdit: boolean,
    editDetails?: TCaseEditUserDetail,
    isViewOnly?: boolean,
    updateFormValues: (values: any) => void,
    onSubmit: (values: any, setSubmitting: (isSubmitting: boolean) => void) => void,
    validationCallback: (isInvalid: boolean) => void
}

const caseInitialState: TCaseFormType = {
    RecId:0,
    CaseId: "",
    CMT_CAD_RecId: 0,
    CADCsv: [],
    RMSId: "",
    State: { id: 0, label: "" },
    CaseLead: { id: 0, label: "" },
    Status:  { id: 0, label: "" },
    CreationType: { id: 0, label: "" },
    DescriptionPlainText: "",
    DescriptionJson: "",
    ClosedType: { id: 0, label: "" }
};

const CreateCase: ForwardRefRenderFunction<any, CreateCaseProps> = ((props, ref) => {

    const [formInitialState, setFormInitialState] = useState<TCaseFormType>(caseInitialState);

    const formikElementRef = useRef<FormikProps<TCaseFormType> | null>(null);
    const richTextBoxRef = useRef<any>(null);

    const { t } = useTranslation<string>();

    useImperativeHandle(ref, () => ({
        formikElementRef: formikElementRef.current,
    }));

    useEffect(() => {
        if(props.isEdit === true && props.formInitialState) {
            setFormInitialState(props.formInitialState);
        }

        if(Array.isArray(props.caseLeadAutoCompleteOptions) && !props.isEdit) {
            const currentUserId = parseInt(localStorage.getItem('User Id') ?? "0");
            const caseLead = props.caseLeadAutoCompleteOptions.find(a => a.id === currentUserId);
            if(caseLead != null && currentUserId > 0 && caseInitialState.CaseLead?.id === 0) {
                caseInitialState.CaseLead = { id: currentUserId, label: caseLead.label };
                setFormInitialState(caseInitialState);
            }
        }
    }, [props.caseLeadAutoCompleteOptions, props.formInitialState])

    useEffect(() => {
      if(props.formValues != null && formikElementRef.current != null && typeof formikElementRef.current.setValues === "function") {
          formikElementRef.current.setValues(props.formValues);
      }
      else {
        if(!props.isEdit) {
          const uuId = generateUniqueCaseId();
          setFormInitialState((prevState: any) => ({
            ...prevState,
            CaseId: uuId 
          }));
        }
      }
      
    }, []);

    const caseValidationSchema = Yup.object().shape({
        CaseId: Yup.string().required("Case Id is required").when([], {
          is: () => !props.isEdit,
          then: Yup.string().test("caseIdValidation", t("CaseId_,_must_match_with_pattern_(_YEAR_-_6_digit_number_)"),
            function(value) {
              if(!props.isEdit) {
                if(value?.match(/\d{4}[-]\d{6}$/g)) {
                  const valueArray = value?.split('-');
                  if(Array.isArray(valueArray) && valueArray[0] === new Date().getFullYear().toString()) {
                    return true;
                  }
                }
              }
              return false;
            })
        }),
        CaseLead: Yup.object().shape({
          id: Yup.number().required('Case Lead is required').min(1).positive(),
          label: Yup.string()
        }),
        Status: Yup.object().shape({
          id: Yup.number().required('Status is required').min(1).positive(),
          label: Yup.string()
        }),
      });

    const generateUniqueCaseId = () => {
      return `${new Date().getUTCFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    }

    const getFormatedDateTime = (value: string) => {
      if(typeof value === "string") {
        const formatedDate = moment(value).format("DD/MM/YYYY HH:mm:ss A");
        return formatedDate === "Invalid date" ? "" : formatedDate;
      }
      return "";
    }

    const onDescriptionChange = (value: any, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void) => {
      if(richTextBoxRef.current != null) {
        const descriptionRawText = JSON.stringify(richTextBoxRef.current.getContentAsRaw());
        setFieldValue("DescriptionPlainText", descriptionRawText, true);
      }
    }

    const onFormSubmit = (values: TCaseFormType, setSubmitting: (isSubmitting: boolean) => void) => {
      if(richTextBoxRef.current != null) {
        const descriptionPlainText = richTextBoxRef.current.getContentAsPlainText();
        values.DescriptionPlainText = descriptionPlainText;
        const descriptionRawText = JSON.stringify(richTextBoxRef.current.getContentAsRaw());
        values.DescriptionJson = descriptionRawText;
      }
      props.onSubmit(values, setSubmitting);
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={formInitialState}
            validationSchema={caseValidationSchema}
            onSubmit={(values, { setSubmitting }) => onFormSubmit(values, setSubmitting) }
            validateOnChange={true}
            innerRef={formikElementRef}
          >
        {({ isValid, dirty, isSubmitting, touched, errors, values, setFieldTouched, setFieldValue }) => (
          (
            <>
            { props.updateFormValues(values) }
            { props.validationCallback(!isValid || !dirty || isSubmitting) }
              <Form id="create-case-form" className={props.isEdit === true ? 'editCaseForm' : ''}>
                <div className="createCaseForm">
                  <div className="centerGeneralTab">
                    {
                      !props.isEdit ?
                        <label className="createCaseFormHeading">Case Information</label>
                      : null
                    } 
                    <CRXContainer className="createCaseContainer">
                      <CRXRows
                        className="createCaseRow"
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                            className={ "createCaseCol columnLeft " +
                              `${errors.CaseId && touched.CaseId == true
                              ? "errorValidation"
                              : ""
                              }`
                            }
                            container="container"
                            item="item"
                            lg={props.isEdit === true ? 4 : 6}
                            xs={12}
                            spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="caseId">
                              Case ID <span>*</span>
                            </label>
                            <div className="caseIdValidation">
                                <Field
                                  id="CaseId"
                                  key="CaseId"
                                  name="CaseId"
                                  onChange={(e: any) => {
                                    e.preventDefault();
                                    setFieldTouched("CaseId", true);
                                    setFieldValue("CaseId", e.target.value, true);
                                  }}
                                  disabled={props.isViewOnly === true}
                                />
                                { errors.CaseId != undefined && touched.CaseId ? (
                                <div className="caseIdError">
                                    <i className="fas fa-exclamation-circle"></i>
                                    {errors.CaseId}
                                </div>
                                ) : null }
                            </div>
                          </div>
                        </CRXColumn>
                        
                        <CRXColumn
                          className="createCaseCol columnRight"
                          container="container"
                          item="item"
                          lg={props.isEdit === true ? 4 : 6}
                          xs={12}
                          spacing={0}
                        >
                          <CRXMultiSelectBoxLight
                            id="CaseLead"
                            className="caseAutoComplete"
                            label= "Case Lead"
                            multiple={false}
                            error={errors.CaseLead != undefined && touched.CaseLead }
                            errorMsg={"Case Lead is required"}
                            value={ values.CaseLead != null ? values.CaseLead : null }
                            options={Array.isArray(props.caseLeadAutoCompleteOptions) ? props.caseLeadAutoCompleteOptions : []}
                            onChange={(e: any, value: AutoCompleteOptionType) =>
                              {
                                e.preventDefault();
                                let newValue = null;
                                if(value != null)
                                  newValue = Object.assign({}, value);
                                setFieldTouched("CaseLead", true);
                                setFieldValue("CaseLead", newValue, true);
                              }
                            }
                            onOpen={(e: any) => {
                              e.preventDefault();
                              setFieldTouched("CaseLead", true)
                            }}
                            CheckBox={true}
                            checkSign={false}
                            required={true}
                            disabled={props.isViewOnly === true}
                          />
                        </CRXColumn>

                        {
                          props.isEdit === true ?
                          (
                            <CRXColumn
                              className="createCaseEditCol"
                              container="container"
                              item="item"
                              lg={4}
                              xs={8}
                              spacing={0}
                              aria-rowspan={2}
                            >
                              <div className="editContentDetailContainer">
                                {props.editDetails != null ?
                                  (
                                    <>
                                      <div className="editContentDetailItem">
                                        <div className="editContentDetailItem-heading">Created On:</div>
                                        <div className="editContentDetailItem-content">{getFormatedDateTime(props.editDetails.createdOn)}</div>
                                      </div>
                                      <div className="editContentDetailItem">
                                        <div className="editContentDetailItem-heading">Updated On:</div>
                                        <div className="editContentDetailItem-content">{getFormatedDateTime(props.editDetails.updatedOn)}</div>
                                      </div>
                                      <div className="editContentDetailItem">
                                        <div className="editContentDetailItem-heading">Created By:</div>
                                        <div className="editContentDetailItem-content">{props.editDetails.createdByName}</div>  
                                      </div>
                                    </>
                                  )
                                  : null
                                }
                              </div>
                            </CRXColumn> )
                          : null
                        }
                      </CRXRows>

                      <CRXRows
                        className={`createCaseRow ${props.isEdit === true ? '-margin20' : ''}`}
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                          className="createCaseCol columnLeft"
                          container="container"
                          item="item"
                          lg={props.isEdit === true ? 4 : 6}
                          xs={12}
                          spacing={0}
                        >
                          <CRXMultiSelectBoxLight
                            id="CADCsv"
                            className="caseAutoComplete"
                            label= "CAD ID"
                            multiple={true}
                            value={values.CADCsv != undefined ? values.CADCsv : null}
                            options={Array.isArray(props.cadCsvAutoCompleteOptions) ? props.cadCsvAutoCompleteOptions : []}
                            onChange={( e: any, value: AutoCompleteOptionType) =>
                              {
                                e.preventDefault();
                                let newValue = null;
                                if(value != null)
                                  newValue = Object.assign({}, value);
                                setFieldTouched("CADCsv", true);
                                setFieldValue("CADCsv", newValue, true);
                              }
                            }
                            onOpen ={() => setFieldTouched("CADCsv", true) }
                            CheckBox={true}
                            checkSign={false}
                            required={false}
                            disabled={props.isViewOnly === true}
                          />
                        </CRXColumn>

                        <CRXColumn
                          className="createCaseCol columnRight"
                          container="container"
                          item="item"
                          lg={props.isEdit === true ? 4 : 6}
                          xs={12}
                          spacing={0}
                        >
                          <CRXMultiSelectBoxLight
                            id="Status"
                            className="caseAutoComplete"
                            label= "Status"
                            multiple={false}
                            error={errors.Status != undefined && touched.Status}
                            errorMsg={"Status is required"}
                            value={values.Status != undefined ? values.Status : null}
                            options={Array.isArray(props.statusAutoCompleteOptions) ? props.statusAutoCompleteOptions : []}
                            onChange={( e: any, value: AutoCompleteOptionType) =>
                              {
                                e.preventDefault();
                                let newValue = null;
                                if(value != null)
                                  newValue = Object.assign({}, value);
                                setFieldTouched("Status", true);
                                setFieldValue("Status", newValue, true);
                              }
                            }
                            onOpen ={() => setFieldTouched("Status", true) }
                            CheckBox={true}
                            checkSign={false}
                            required={true}
                            disabled={props.isViewOnly === true}
                          />
                        </CRXColumn>

                      </CRXRows>

                      <CRXRows
                        className="createCaseRow -margin0"
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                          className="createCaseCol"
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <h6 className="MuiTypography-root label MuiTypography-subtitle1">
                            <span>Description</span>
                          </h6>
                          <div className="createCase-DraftEditor-Container">
                            <CRXRichTextBox value={values.DescriptionJson || ""} ref={richTextBoxRef}
                              onChange={(value: any) => onDescriptionChange(value, setFieldValue) } disabled={props.isViewOnly}/>
                          </div>
                        </CRXColumn>

                      </CRXRows>

                    </CRXContainer>
                  </div>
                </div>
            </Form>
          </>
        ))}
        </Formik>
    )
})

export default forwardRef(CreateCase);
