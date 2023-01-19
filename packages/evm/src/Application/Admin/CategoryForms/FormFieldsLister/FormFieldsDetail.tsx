import React, { FC, useEffect, useState } from "react";
import { CRXModalDialog, CRXButton, CRXConfirmDialog, CRXAlert, CRXSelectBox, CRXRows, CRXColumn } from "@cb/shared";
import { useTranslation } from "react-i18next";
import './formFieldsDetail.scss';
import { useDispatch } from "react-redux";
import { PageiGrid } from "../../../../GlobalFunctions/globalDataTableFunctions";
import { DropdownModel } from "../../../../utils/Api/models/CategoryModels";
import { SetupConfigurationAgent } from "../../../../utils/Api/ApiAgent";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { getAllFormFieldsFilter } from "../../../../Redux/FormFields";
import { controlTypes } from "../TypeConstant/constants";

type FormFieldsDetailProps = {
  id: number,
  title: string,
  pageiGrid: PageiGrid,
  openModel: React.Dispatch<React.SetStateAction<any>>;
}

type FormFieldDetailModel = {
  id: number;
  type: string;
  name: string;
  displayName: string;
  defaultFieldValue: string;
}

const FormFieldsDetail: FC<FormFieldsDetailProps> = (props: FormFieldsDetailProps) => {
  const [id, setId] = useState<number>(props?.id);
  const [openModal, setOpenModal] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<boolean>(false);
  const [responseError, setResponseError] = React.useState<string>('');
  const { t } = useTranslation<string>();
  const [formFieldPayLoad, setFormFieldPayLoad] = React.useState<FormFieldDetailModel>({
    id: 0,
    type: "",
    name: "",
    displayName: "",
    defaultFieldValue: ""
  });
  const dispatch = useDispatch();
  const [controlTypesOptions, setControlTypesOptions] = React.useState<DropdownModel[]>([]);

  const setControlTypes = () => {
    let ControlTypesTemplateRows: any[] = [];
    if (controlTypes?.length > 0) {
      ControlTypesTemplateRows = controlTypes?.map((template: any) => {
        return {
          value: template.value,
          displayText: template.displayText,
        }
      })
    }
    setControlTypesOptions(ControlTypesTemplateRows);
  }

  const onSave = async (payload: FormFieldDetailModel) => {
    let url = "Fields";
    let body = {
      id: payload.id,
      type: payload.type,
      name: payload.name,
      Display: {
        caption: payload.displayName,
      },
      defaultFieldValue: payload.defaultFieldValue
    }
    if (id > 0) {
      url += "/" + id;
      SetupConfigurationAgent.putFormField(url, body).then(() => {
        setSuccess(true);
        setError(false);
        dispatch(getAllFormFieldsFilter(props.pageiGrid));
        setTimeout(() => { handleClose() }, 500);
      })
        .catch((e: any) => {
          console.error(e.message);
          setError(false);
          return e;
        })
    }
    else {
      SetupConfigurationAgent.postFormFields(url, body).then(() => {
        setSuccess(true);
        setError(false);
        dispatch(getAllFormFieldsFilter(props.pageiGrid));
        setTimeout(() => { handleClose() }, 500);
      })
        .catch((e: any) => {
          console.error(e.message);
          setError(false);
          return e;
        })
    }
  }

  const closeDialog = () => {
    handleClose();
  };


  const handleClose = () => {
    setOpenModal(false);
    props.openModel(false);
  };

  React.useEffect(() => {
    setOpenModal(true)
    setControlTypes();
  }, []);


  useEffect(() => {
    if (id != undefined && id != null && id > 0) {
      SetupConfigurationAgent.getSingleFormField(id).then((response: any) => {
        if (response !== undefined && response != null) {
          setFormFieldPayLoad({
            id: id,
            displayName: response?.display?.caption,
            name: response?.name,
            type: response?.type,
            defaultFieldValue: response?.defaultFieldValue
          });
        }
      })
        .catch((err: any) => {
          console.error(err);
        });
    }
    else {
      setFormFieldPayLoad({
        id: 0,
        type: "",
        name: "",
        displayName: "",
        defaultFieldValue: ""
      });
    }
  }, [id]);

  const formFieldsValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    type: Yup.string().required("Control Type is required")
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={formFieldPayLoad}
        validationSchema={formFieldsValidationSchema}
        onSubmit={(values) => {
          console.log("SUBMIT : " + values);
        }}
      >
        {({ setFieldValue, values, errors, touched, dirty, isValid, handleBlur, setTouched }) => (
          <>

            <div className="FormFields">
              <CRXModalDialog
                maxWidth="gl"
                title={props.title}
                className={'CRXModal ___CRXCreateFormFields__ ___CRXEditFormFields__'}
                modelOpen={openModal}
                onClose={closeDialog}
                defaultButton={false}
                showSticky={false}
                closeWithConfirm={closeWithConfirm}

              >
                {success && (
                  <CRXAlert
                    message={t("Success_You_have_saved_the_Retention_Policy")}
                    alertType="toast"
                    open={true}
                  />
                )}
                {error && (
                  <CRXAlert
                    className=""
                    message={responseError}
                    type="error"
                    alertType="inline"
                    open={true}
                  />
                )}
                <CRXRows container={true} spacing={1} style={{ marginBottom: "15px" }}>
                  <CRXColumn item={true} xs={4}>

                    <label className="">
                      {t("Control_Type")} <span>*</span>
                    </label>
                  </CRXColumn>
                  <CRXColumn item={true} xs={8}>
                    <CRXSelectBox
                      name="type"
                      id="type"
                      value={values.type}
                      onChange={(e: any) => {
                        setFieldValue("type", e.target.value)
                      }
                      }
                      options={controlTypesOptions}
                      onClose={(e: any) => {
                        handleBlur(e);
                        setTouched({
                          ...touched,
                          ["type"]: true,
                        });
                      }}
                      isRequried={touched.type && ((errors.type?.length ?? 0) > 0)}
                      error={!((errors.type?.length ?? 0) > 0)}
                      errorMsg={errors.type}
                    />

                  </CRXColumn>
                </CRXRows>
                <CRXRows container={true} spacing={1} style={{ marginBottom: "15px" }}>
                  <CRXColumn item={true} xs={4}>
                    <label htmlFor="name">
                      {t("Field_Name")} <span>*</span>
                    </label>
                  </CRXColumn>
                  <CRXColumn item={true} xs={8}>
                    <Field
                      id="name"
                      key="name"
                      name="name"
                    />
                    {errors.name !== undefined &&
                      touched.name ? (
                      <div className="errorTenantStyle">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors.name}
                      </div>
                    ) : (
                      <></>
                    )}

                  </CRXColumn>
                </CRXRows>

                <CRXRows container={true} spacing={1} style={{ marginBottom: "15px" }}>
                  <CRXColumn item={true} xs={4}>
                    <label htmlFor="displayName">
                      {t("Field_Display_Name")}
                    </label>
                  </CRXColumn>
                  <CRXColumn item={true} xs={8}>
                    <Field
                      id="displayName"
                      key="displayName"
                      name="displayName"
                    />
                  </CRXColumn>
                </CRXRows>
                <CRXRows container={true} spacing={1} style={{ marginBottom: "15px" }}>
                  <CRXColumn item={true} xs={4}>
                    <label htmlFor="defaultFieldValue">
                      {t("Default_Field_Value")}
                    </label>
                  </CRXColumn>
                  <CRXColumn item={true} xs={8}>
                    <Field
                      id="defaultFieldValue"
                      key="defaultFieldValue"
                      name="defaultFieldValue"
                    />
                  </CRXColumn>
                </CRXRows>

                <div className="tab-bottom-buttons form-fields-btns">
                  <div className="save-cancel-button-box">
                    <CRXButton
                      variant="contained"
                      className="groupInfoTabButtons"
                      onClick={() => onSave(values)}
                      disabled={!isValid || !dirty}
                    >
                      {t("Save")}
                    </CRXButton>
                    <CRXButton
                      className="groupInfoTabButtons secondary"
                      color="secondary"
                      variant="outlined"
                      onClick={handleClose}
                    >
                      {t("Cancel")}
                    </CRXButton>
                  </div>

                </div>
              </CRXModalDialog>
              <CRXConfirmDialog
                setIsOpen={() => setIsOpen(false)}
                onConfirm={handleClose}
                isOpen={isOpen}
                className="CategoriesConfirm"
                primary={t("Yes_close")}
                secondary={t("No,_do_not_close")}
                text="retention policy form"
              >
                <div className="confirmMessage">
                  {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
                  <strong>{t("retention_policy_Form")}</strong>. {t("If_you_close_the_form")},
                  {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
                  <div className="confirmMessageBottom">
                    {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
                  </div>
                </div>
              </CRXConfirmDialog>

            </div>
          </>
        )}
      </Formik>
    </>
  )
}

export default FormFieldsDetail;
