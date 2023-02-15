import React, { FC, useEffect, useRef } from "react";
import {
  CRXButton,
  CRXConfirmDialog,
  CRXAlert,
  CRXSelectBox,
  CRXRows,
  CRXColumn,
  CRXToaster,
} from "@cb/shared";
import { useTranslation } from "react-i18next";
import "./formFieldsDetail.scss";
import { useDispatch } from "react-redux";
import { PageiGrid } from "../../../../GlobalFunctions/globalDataTableFunctions";
import { DropdownModel } from "../../../../utils/Api/models/CategoryModels";
import { SetupConfigurationAgent } from "../../../../utils/Api/ApiAgent";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { getAllFormFieldsFilter } from "../../../../Redux/FormFields";
import { controlTypes, controlTypesForValidation } from "../TypeConstant/constants";
import { useHistory, useParams } from "react-router";
import { urlList, urlNames } from "../../../../utils/urlList";

type FormFieldsDetailProps = {
  id: number;
  title: string;
  pageiGrid: PageiGrid;
  openModel: React.Dispatch<React.SetStateAction<any>>;
  isCategoryForms: boolean;
  setSelectedFields: any;
  selectedFields: any;
  setFieldValue: any;
};

type FormFieldDetailModel = {
  id: number;
  type: string;
  name: string;
  displayName: string;
  defaultFieldValue: string;
  isRequired: boolean;
};

const FormFieldDetailPage: FC<FormFieldsDetailProps> = (
  props: FormFieldsDetailProps
) => {

  const { id } = useParams<{ id: string }>();
  const history = useHistory();
 // const [id, setId] = useState<number>(props?.id);
  const [openModal, setOpenModal] = React.useState(false);
  const [isFieldValueEnable, setIsFieldValueEnable] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<boolean>(false);
  const [responseError, setResponseError] = React.useState<string>("");
  const { t } = useTranslation<string>();
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: 0,
    size: 25
  })
  const [formFieldPayLoad, setFormFieldPayLoad] =
    React.useState<FormFieldDetailModel>({
      id: 0,
      type: "",
      name: "",
      displayName: "",
      defaultFieldValue: "",
      isRequired: false,
    });
  const dispatch = useDispatch();
  const [controlTypesOptions, setControlTypesOptions] = React.useState<
    DropdownModel[]
  >([]);

  const setControlTypes = () => {
    let ControlTypesTemplateRows: any[] = [];
    if (controlTypes?.length > 0) {
      ControlTypesTemplateRows = controlTypes?.map((template: any) => {
        return {
          value: template.value,
          displayText: template.displayText,
        };
      });
    }
    setControlTypesOptions(ControlTypesTemplateRows);
  };

  const onSave = async (payload: FormFieldDetailModel) => {
    
    let url = "Fields";
    let body = {
      id: payload.id,
      type: payload.type,
      name: payload.name,
      Display: {
        caption: payload.displayName,
      },
      defaultFieldValue: payload.defaultFieldValue,
      isRequired: payload.isRequired,
    };
    if (body.id > 0) {
      url += "/" + id;
      SetupConfigurationAgent.putFormField(url, body)
        .then(() => {
          onMessageShow(true, t("Form_Field_Edited_Successfully"));
          setError(false);
          dispatch(getAllFormFieldsFilter(pageiGrid));
          setTimeout(() => {
            handleClose();
          }, 500);
        })
        .catch((e: any) => {
          if (e?.response?.status === 409) {
            setError(true);
            setResponseError(e?.response?.data);
          } else {
            setError(true);
            setResponseError(
              "An issue occurred while saving, please try again."
            );
          }
          return e;
        });
    } else {
      SetupConfigurationAgent.postFormFields(url, body)
        .then((res: any) => {
          onMessageShow(true, t("Form_Field_Saved_Successfully"));
          setError(false);
          if (props.isCategoryForms) {
            let fields = [
              ...props.selectedFields,
              {
                id: res,
                name: body?.name,
                displayName: payload?.displayName,
                controlType:
                  controlTypes?.find(
                    (x: any) =>
                      x.value == payload.type || x.displayText == payload.type
                  )?.displayText ?? "",
                width: 0,
                isRequired: payload?.isRequired,
              },
            ];
            props.setSelectedFields(fields);
            props.setFieldValue(
              "fields",
              fields.map((x: any) => {
                return x.id;
              })
            );
          } else {
            dispatch(getAllFormFieldsFilter(pageiGrid));
          }
          // setTimeout(() => {
          //   handleClose();
          // }, 500);
        })
        .catch((e: any) => {
          if (e?.response?.status === 409) {
            setError(true);
            setResponseError(e?.response?.data);
          } else {
            setError(true);
            setResponseError(
              "An issue occurred while saving, please try again."
            );
          }
          return e;
        });
    }
  };

  const FormFieldFormMessages = (obj: any) => {
    toasterRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  };

  const onMessageShow = (isSuccess: boolean, message: string) => {
    FormFieldFormMessages({
      message: message,
      variant: isSuccess ? "success" : "error",
      duration: 7000,
    });
  };

  const closeDialog = (dirty: any) => {
    if (dirty) {
      setIsOpen(true);
    } else {
      handleClose();
    }
  };

 
  const handleClose = () => {
    history.push(
      urlList.filter((item: any) => item.name === urlNames.categoryForms)[0].url
    );
  };

  React.useEffect(() => {
    setOpenModal(true);
    setControlTypes();
  }, []);

  useEffect(() => {
    let fieldId = id;
    if (fieldId != undefined && fieldId != null ) {
      SetupConfigurationAgent.getSingleFormField(Number.parseInt(fieldId))
        .then((response: any) => {
          if (response !== undefined && response != null) {
            setFormFieldPayLoad({
              id: Number.parseInt(fieldId),
              displayName: response?.display?.caption,
              name: response?.name,
              type: response?.type,
              defaultFieldValue: response?.defaultFieldValue,
              isRequired: response?.isRequired,
            });
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    } else {
      setFormFieldPayLoad({
        id: 0,
        type: "",
        name: "",
        displayName: "",
        defaultFieldValue: "",
        isRequired: false,
      });
    }
  }, [id]);

  const formFieldsValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    type: Yup.string().required("Control Type is required"),
    defaultFieldValue: Yup.string().when("type", {
      is: (key: any) => controlTypesForValidation.some((x => x.value === key)),
      then: Yup.string().required("Field Values is required")
    }),
  });

  return (
    <div className="searchComponents create_form_fields_form">
      <CRXToaster ref={toasterRef} className="formFieldToaster" />
      <Formik
        enableReinitialize={true}
        initialValues={formFieldPayLoad}
        validationSchema={formFieldsValidationSchema}
        onSubmit={(values) => {
          console.log("SUBMIT : " + values);
        }}
      >
        {({
          setFieldValue,
          values,
          errors,
          touched,
          dirty,
          isValid,
          handleBlur,
          setTouched,
        }) => (
          <>
            <div className={`FormFields ${error ? "errorFormField" : "" }`}>
             
                {error && (
                  <CRXAlert
                    className="formFieldError"
                    message={responseError}
                    type="error"
                    alertType="inline"
                    open={true}
                  />
                )}
                 <div className="indicatestext tp15"><b>*</b> Indicates required field</div> 
                <div className="create_category_form_field_content">
               

                  <CRXRows
                    container={true}
                    spacing={1}
                    className={`crx_form_group_row ${
                      touched.type && (errors.type?.length ?? 0) > 0
                        ? "error_staric"
                        : " "
                    }`}
                  >
                    <CRXColumn item={true} xs={3}>
                      <label className="cc_form_label">
                        {t("Control_Type")} <span>*</span>
                      </label>
                    </CRXColumn>
                    <CRXColumn item={true} xs={9}>
                      <CRXSelectBox
                        name="type"
                        id="type"
                        className="controle_type_select"
                        value={values.type}
                        onChange={(e: any) => {
                          let controlType = e.target.value;
                          setFieldValue("type", controlType)
                          let controlTypeId = controlTypes?.find((x: any) => x.value == controlType)?.id;
                          if (controlTypesForValidation.some((x => x.id === controlTypeId))) {
                            setIsFieldValueEnable(true);
                          } else {
                            setIsFieldValueEnable(false);
                          }
                        }}
                        options={controlTypesOptions}
                        onClose={(e: any) => {
                          handleBlur(e);
                          setTouched({
                            ...touched,
                            ["type"]: true,
                          });
                        }}
                        isRequried={
                          touched.type && (errors.type?.length ?? 0) > 0
                        }
                        error={!((errors.type?.length ?? 0) > 0)}
                        errorMsg={errors.type}
                      />
                    </CRXColumn>
                  </CRXRows>
                  <CRXRows
                    container={true}
                    spacing={1}
                    className={`crx_form_group_row ${
                      errors.name !== undefined && touched.name
                        ? "error_staric"
                        : ""
                    }`}
                  >
                    <CRXColumn item={true} xs={3}>
                      <label htmlFor="name" className="cc_form_label">
                        {t("Field_Name")} <span>*</span>
                      </label>
                    </CRXColumn>
                    <CRXColumn item={true} xs={9}>
                      <Field
                        id="name"
                        key="name"
                        name="name"
                        className={`crx_formik_field`}
                      />
                      {errors.name !== undefined && touched.name ? (
                        <div className="errorTenantStyle">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.name}
                        </div>
                      ) : (
                        <></>
                      )}
                    </CRXColumn>
                  </CRXRows>

                  <CRXRows
                    container={true}
                    spacing={1}
                    className="crx_form_group_row"
                  >
                    <CRXColumn item={true} xs={3}>
                      <label htmlFor="displayName" className="cc_form_label">
                        {t("Field_Display_Name")}
                      </label>
                    </CRXColumn>
                    <CRXColumn item={true} xs={9}>
                      <Field
                        id="displayName"
                        key="displayName"
                        name="displayName"
                        className={`crx_formik_field`}
                      />
                    </CRXColumn>
                  </CRXRows>
                 
                  {isFieldValueEnable && (
                  <CRXRows
                    container={true}
                    spacing={1}
                    className={`crx_form_group_row ${errors.defaultFieldValue !== undefined &&
                      touched.defaultFieldValue ? "error_staric" : ""}`}
                  >
                    <CRXColumn item={true} xs={3}>
                      <label htmlFor="defaultFieldValue" className="cc_form_label">
                        {t("Field_Values")} <span>*</span>
                      </label>
                    </CRXColumn>
                    <CRXColumn item={true} xs={9}>
                      <Field
                        id="defaultFieldValue"
                        key="defaultFieldValue"
                        name="defaultFieldValue"
                        className={`crx_formik_field`}
                      />
                        <div className="defaultFieldValuePlaceholder">(Use pipe separator "|" for multiple values)</div>
                      {errors.defaultFieldValue !== undefined &&
                        touched.defaultFieldValue ? (
                        <div className="errorTenantStyle">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.defaultFieldValue}
                        </div>
                      ) : (
                        <></>
                      )}
                    </CRXColumn>
                  </CRXRows>
                  )}
                  <CRXRows container={true} spacing={1} className="crx_form_group_row">
                    <CRXColumn item={true} xs={3}>
                      <label htmlFor="isReuired" className="cc_form_label">
                        {t("required")}
                      </label>
                    </CRXColumn>
                    <CRXColumn item={true} xs={9}>
                      <div className="formikCheckboxField">
                        <Field
                        type="checkbox"
                        name="isRequired"
                        id="isRequired"
                        key="isRequired"
                        className={``}
                      />
                      </div>
                    </CRXColumn>
                  </CRXRows>
                </div>
                <div className="crxFooterEditFormBtn stickyFooter_Tab">
                  <div className="__crxFooterBtnUser__">
                    <CRXButton
                      color="primary"
                      variant="contained"
                      className="groupInfoTabButtons"
                      onClick={() => onSave(values)}
                      disabled={!isValid || !dirty}
                    >
                      {t("Save")}
                    </CRXButton>
                    <CRXButton
                      className="groupInfoTabButtons"
                      color="secondary"
                      variant="outlined"
                      onClick={handleClose}
                    >
                      {t("Cancel")}
                    </CRXButton>
                  </div>
                  <div className="__crxFooterBtnUser__">
               
                    <CRXButton
                      className=""
                      color="secondary"
                      variant="outlined"
                      onClick={()=> closeDialog(dirty)}
                    >
                      {t("Close")}
                    </CRXButton>
                  </div>
                </div>
            
              <CRXConfirmDialog
                setIsOpen={() => setIsOpen(false)}
                onConfirm={handleClose}
                isOpen={isOpen}
                className="Categories_Confirm"
                primary={t("Yes_close")}
                secondary={t("No,_do_not_close")}
                text="retention policy form"
              >
                <div className="confirmMessage">
                  {t("You_are_attempting_to")} <strong> {t("close")}</strong>{" "}
                  {t("the")} <strong>{t("Form_Field")}</strong>.{" "}
                  {t("If_you_close_the_form")},
                  {t("any_changes_you_ve_made_will_not_be_saved.")}{" "}
                  {t("You_will_not_be_able_to_undo_this_action.")}
                  <div className="confirmMessageBottom">
                    {t("Are_you_sure_you_would_like_to")}{" "}
                    <strong>{t("close")}</strong> {t("the_form?")}
                  </div>
                </div>
              </CRXConfirmDialog>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default FormFieldDetailPage;
