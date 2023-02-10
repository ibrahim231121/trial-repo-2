import React, { FC, useEffect, useState, useRef } from "react";
import { CRXModalDialog, CRXButton, CRXConfirmDialog,  CRXSelectBox, TextField, CRXToaster } from "@cb/shared";
import { useTranslation } from "react-i18next";
import './categoriesDetail.scss';
import { useDispatch, useSelector } from "react-redux";
import { PageiGrid } from "../../../../GlobalFunctions/globalDataTableFunctions";
import { RootState } from "../../../../Redux/rootReducer";
import { CategoryModel, DropdownModel, RequestCategoryModel } from "../../../../utils/Api/models/CategoryModels";
import { SetupConfigurationAgent } from "../../../../utils/Api/ApiAgent";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { CRXMultiSelectBoxLight } from "@cb/shared";
import { getAllCategoriesFilter } from "../../../../Redux/Categories";
import moment from "moment";
import { addNotificationMessages } from "../../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../../Header/CRXNotifications/notificationsTypes";

type CategoriesDetailProps = {
  id: number,
  title: string,
  pageiGrid: PageiGrid,
  openModel: React.Dispatch<React.SetStateAction<any>>;
}

const CategoriesDetail: FC<CategoriesDetailProps> = (props: CategoriesDetailProps) => {
  const categoriesFormRef = useRef<typeof CRXToaster>(null);
  const [id, setId] = useState<number>(props?.id);
  const retentionPoliciesList: any = useSelector((state: RootState) => state.retentionPoliciesSlice.getAllRetentionPolicies);
  const uploadPoliciesList: any = useSelector((state: RootState) => state.retentionPoliciesSlice.getAllUploadPolicies);
  const categoryFormsList: any = useSelector((state: RootState) => state.CategoryFormSlice.getAllCategoryForms);
  const [openModal, setOpenModal] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [requestCategoryModel, setRequestCategoryModel] = React.useState<RequestCategoryModel>();
  const { t } = useTranslation<string>();
  const [categoryPayLoad, setCategoryPayLoad] = React.useState<CategoryModel>({
    name: "",
    description: "",
    evidenceRetentionPolicy: 0,
    uploadPolicy: 0,
    categoryForms: [],
    audioprompt: ""
  });
  const dispatch = useDispatch();
  const [evidenceRetentionPoliciesOptions, setEvidenceRetentionPoliciesOptions] = React.useState<any[]>([]);
  const [categoryFormsOptions, setCategoryFormsOptions] = React.useState<DropdownModel[]>([]);
  const [uploadPolicesOptions, setUploadPolicesOptions] = React.useState<DropdownModel[]>([]);

  const setEvidenceRetentionPolicies = () => {
    let RetentionPoliciesTemplateRows: DropdownModel[] = [];
    if (retentionPoliciesList?.data && retentionPoliciesList?.data.length > 0) {

      RetentionPoliciesTemplateRows = retentionPoliciesList?.data.map((template: any) => {
        return {
          value: template.id,
          displayText: template.name,
        }
      })
    }
    setEvidenceRetentionPoliciesOptions(RetentionPoliciesTemplateRows);
  }

  const setCategoryForms = () => {
    let CategoryFormsTemplateRows: DropdownModel[] = [];
    if (categoryFormsList?.data && categoryFormsList?.data.length > 0) {
      CategoryFormsTemplateRows = categoryFormsList?.data.map((template: any) => {
        return {
          id: template.id,
          label: template.name,
        }
      })
    }
    setCategoryFormsOptions(CategoryFormsTemplateRows);
  }

  const setUploadPolicies = () => {
    let UploadPoliciesTemplateRows: DropdownModel[] = [];
    if (uploadPoliciesList?.data && uploadPoliciesList?.data.length > 0) {
      UploadPoliciesTemplateRows = uploadPoliciesList?.data.map((template: any) => {
        return {
          value: template.id,
          displayText: template.name,
        }
      })
    }
    setUploadPolicesOptions(UploadPoliciesTemplateRows);
  }

  const CategoriesFormMessages = (obj: any) => {
    categoriesFormRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  }

  const onMessageShow = (isSuccess: boolean, message: string) => {
    CategoriesFormMessages({
      message: message,
      variant: isSuccess ? 'success' : 'error',
      duration: 7000
    });
    if (isSuccess) {
      let notificationMessage: NotificationMessage = {
        title: t("Categories"),
        message: message,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }

  const SendSaveRequest = (Obj: RequestCategoryModel) => {
    if (Obj.Name != "") {
      var body = Obj;
      let url = "Categories";
      if (id > 0) {
        url += "/" + id;
        SetupConfigurationAgent.putCategories(url, body).then(() => {
          onMessageShow(true, t("Category_Edited_Successfully"));
          dispatch(getAllCategoriesFilter(props.pageiGrid));
          setTimeout(() => { handleClose() }, 500);
          setRequestCategoryModel({
            Name: "",
            Description: "",
            Policies: {
              RetentionPolicyId: 0,
              UploadPolicyId: 0,
            },
            Forms: [],
            AudioPrompt: body.AudioPrompt.toString().length > 0 ? body.AudioPrompt : ""
          })
        })
          .catch((e: any) => {
            if (e?.response?.status === 409) {
              onMessageShow(false, e?.response?.data);
            }
            else {
              onMessageShow(false, "An issue occurred while saving, please try again.");
            }
            return e;
          })
      }
      else {
        SetupConfigurationAgent.postCategories(url, body).then(() => {
          onMessageShow(true, t("Category_Saved_Successfully"));
          dispatch(getAllCategoriesFilter(props.pageiGrid));
          setTimeout(() => { handleClose() }, 500);
          setRequestCategoryModel({
            Name: "",
            Description: "",
            Policies: {
              RetentionPolicyId: 0,
              UploadPolicyId: 0,
            },
            Forms: [],
            AudioPrompt: body.AudioPrompt.toString().length > 0 ? body.AudioPrompt : ""
          })
        }).catch((e: any) => {
          if (e?.response?.status === 409) {
            onMessageShow(false, e?.response?.data);
          }
          else {
            onMessageShow(false, "An issue occurred while saving, please try again.");
          }
          return e;
        })
      }

    }
  }

  const onSave = async (payload: CategoryModel) => {
    if (payload.audioprompt != "" && payload.audioprompt != null) {
      await getBase64(payload)
    }
    else {
      var Obj: RequestCategoryModel = {
        AudioPrompt: "",
        Name: payload.name,
        Description: payload.description,
        Policies: {
          RetentionPolicyId: payload.evidenceRetentionPolicy,
          UploadPolicyId: payload.uploadPolicy
        },
        Forms: payload.categoryForms.map((x: any) => { return { Id: x.id, Name: x.label, Type: "Unknown" } })
      }
      setRequestCategoryModel(Obj)
      SendSaveRequest(Obj)
    }

  }

  const closeDialog = (dirty: any) => {
    if (dirty) {
      setIsOpen(true);
    }
    else {
      handleClose();
    }
  };


  const handleClose = () => {
    setOpenModal(false);
    //props.openModel(false);
    setIsOpen(false);
  };
  React.useEffect(() => {
    setOpenModal(true)
  }, []);

  const getBase64 = async (payload: CategoryModel) => {
    let reader = new FileReader();
    reader.readAsDataURL(payload.audioprompt);
    reader.onloadend = function () {
      var Obj: RequestCategoryModel = {
        AudioPrompt: reader.result ? reader.result : "",
        Name: payload.name,
        Description: payload.description,
        Policies: {
          RetentionPolicyId: payload.evidenceRetentionPolicy,
          UploadPolicyId: payload.uploadPolicy
        },
        Forms: payload.categoryForms.map((x: any) => { return { Id: x.id, Name: x.label, Type: "Unknown" } })
      }
      setRequestCategoryModel(Obj)
      SendSaveRequest(Obj)
    };

    reader.onerror = function (error) {
      console.log(error)
    };

  }



  useEffect(() => {
    if (id != undefined && id != null && id > 0) {
      SetupConfigurationAgent.getSingleCategory(id).then((response: any) => {
        if (response !== undefined && response != null) {
          let category: CategoryModel = {
            name: response.name,
            evidenceRetentionPolicy: response.policies.retentionPolicyId,
            uploadPolicy: response.policies.uploadPolicyId,
            description: response.description,
            categoryForms: response.forms.map((x: any) => { return { id: x.id, label: x.name } }),
            audioprompt: ""
          };
          setCategoryPayLoad(category);
        }
      })
        .catch((err: any) => {
          console.error(err);
        });
    }
    else {
      setCategoryPayLoad({
        name: "",
        description: "",
        evidenceRetentionPolicy: 0,
        uploadPolicy: 0,
        categoryForms: [],
        audioprompt: ""
      });
    }
  }, [id]);

  React.useEffect(() => {
    setEvidenceRetentionPolicies();
  }, [retentionPoliciesList?.data]);

  React.useEffect(() => {
    setCategoryForms();
  }, [categoryFormsList?.data]);

  React.useEffect(() => {
    setUploadPolicies();
  }, [uploadPoliciesList?.data]);

  const categoriesFromValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(3, "Name must be greater than 3 characters").max(128, "Name must be less than 128 characters"),
    evidenceRetentionPolicy: Yup.number().min(1, "Evidence Retention Policy is required"),
    uploadPolicy: Yup.number().min(1, "Upload Policy is required"),
    audioprompt: Yup.mixed()
      .test(
        "fileSize",
        "File is too large",
        value => !value || (value && value.size <= 512000)
      )
      .test("fileSize", "Only .wav files are accepted", (value) => {
        return !value || (value && (
          value.name.split(".")[1] === "wav"
        ));
      }),
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={categoryPayLoad}
        validationSchema={categoriesFromValidationSchema}
        onSubmit={(values) => {
          console.log("SUBMIT : " + values);
        }}
      >
        {({ setFieldValue, values, errors, touched, dirty, isValid, handleBlur, setTouched }) => (
          <>
            <div className="categories">
              <CRXToaster ref={categoriesFormRef} />
              <CRXModalDialog
                maxWidth="gl"
                title={props.title}
                className={' ___CRXCreateRetentionPolicy__ ___CRXEditRetentionPolicy__ create_category_form_modal'}
                modelOpen={openModal}
                onClose={() => closeDialog(dirty)}
                defaultButton={false}
                showSticky={false}
                closeWithConfirm={closeWithConfirm}

              >

                <div className="createCategory_form">
                  <div className="indicatestext tp15"><b>*</b> Indicates required field</div>
                  <div className="category_form_fields">
                    <div className="CBX-input">
                      <label htmlFor="name">
                        Name <span className={`${errors.name !== undefined &&
                          touched.name ? " error_staric" : " "}`}>*</span>
                      </label>
                      <Field
                        id="name"
                        key="name"
                        name="name"
                        className={`name_field ${errors.name !== undefined &&
                          touched.name ? " error_filed" : " "}`}
                      />

                    </div>
                    {errors.name !== undefined &&
                      touched.name ? (
                      <div className="errorTenantStyle">
                        <i className="fas fa-exclamation-circle"></i>
                        {errors.name}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="category_form_fields">

                    <TextField
                      id="description"
                      required={false}
                      value={values.description}
                      label={t("Description")}
                      className="categories-input"
                      onChange={(e: any) => setFieldValue("description", e.target.value)}
                      disabled={false}
                      type="text"
                      multiline={true}
                    />
                  </div>


                  <div className="category_form_fields">
                    <label className="form_label">
                      {t("Evidence_Retention_Policy")} <span className={`${touched.evidenceRetentionPolicy && " error_staric"}`}>*</span>
                    </label>
                    <CRXSelectBox
                      name="evidenceRetentionPolicy"
                      id="evidenceRetentionPolicy"
                      className={`evidence_rentention_select wd450 ${touched.evidenceRetentionPolicy && " error_select"}`}
                      value={values.evidenceRetentionPolicy}
                      onChange={(e: any) => {
                        setFieldValue("evidenceRetentionPolicy", e.target.value)
                      }
                      }
                      options={evidenceRetentionPoliciesOptions}
                      onClose={(e: any) => {
                        handleBlur(e);
                        setTouched({
                          ...touched,
                          ["evidenceRetentionPolicy"]: true,
                        });
                      }}
                      isRequried={touched.evidenceRetentionPolicy && ((errors.evidenceRetentionPolicy?.length ?? 0) > 0)}
                      error={!((errors.evidenceRetentionPolicy?.length ?? 0) > 0)}
                      errorMsg={errors.evidenceRetentionPolicy}
                    />
                  </div>

                  <div className="category_form_fields">
                    <label className="form_label">
                      {t("Upload_Policy")} <span className={`${touched.uploadPolicy && " error_staric"}`}>*</span>
                    </label>
                    <CRXSelectBox
                      id="uploadPolicy"
                      name="uploadPolicy"
                      className={`wd450 ${touched.uploadPolicy && " error_select"}`}
                      value={values.uploadPolicy}
                      onChange={(e: any) => {
                        setFieldValue("uploadPolicy", e.target.value)
                      }
                      }
                      options={uploadPolicesOptions}
                      onClose={(e: any) => {
                        handleBlur(e);
                        setTouched({
                          ...touched,
                          ["uploadPolicy"]: true,
                        });

                      }}
                      isRequried={touched.uploadPolicy && ((errors.uploadPolicy?.length ?? 0) > 0)}
                      error={!((errors.uploadPolicy?.length ?? 0) > 0)}
                      errorMsg={errors.uploadPolicy}
                    />
                  </div>

                  <div className="category_form_fields">

                    <CRXMultiSelectBoxLight
                      label={t("Category_Forms")}
                      id="categoryForms"
                      className="category_form_multiSelect wd450"
                      multiple={true}
                      value={values.categoryForms}
                      options={categoryFormsOptions}
                      onChange={(_e: React.SyntheticEvent, value: DropdownModel[]) => {
                        console.log("Errors", errors);
                        console.log("errors.uploadPolicy", errors?.uploadPolicy)
                        console.log("(errors.uploadPolicy?.length ?? 0) > 0", (errors.uploadPolicy?.length ?? 0) > 0)
                        let filteredValues = value.filter((x: any) => x.inputValue !== x.label);
                        setFieldValue("categoryForms", filteredValues);
                      }}
                    />
                  </div>
                  <div className="file_upload_button">
                    <input
                      type="file"
                      accept=".wav"
                      id="audioprompt"
                      name="audioprompt"
                      className="audio_file_upload"
                      onChange={(e) => { setFieldValue("audioprompt", e.currentTarget.files ? e.currentTarget.files[0] : null) }}
                    />
                    {errors.audioprompt &&
                      <div>
                        {errors.audioprompt}
                      </div>}
                  </div>
                </div>
                <div className="create_category_form_btns">
                  <div className="save-cancel-button-box">
                    <CRXButton
                      variant="contained"
                      className="groupInfoTabButtons"
                      onClick={() => { onSave(values) }}
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
                className="Categories_Confirm"
                primary={t("Yes_close")}
                secondary={t("No,_do_not_close")}
                text="retention policy form"
              >
                <div className="confirmMessage">
                  {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
                  <strong>{props.title + "Form"}</strong>. {t("If_you_close_the_form")},
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

export default CategoriesDetail;
