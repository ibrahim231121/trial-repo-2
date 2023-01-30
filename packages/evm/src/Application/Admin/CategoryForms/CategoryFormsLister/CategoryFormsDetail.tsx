import {enterPathActionCreator} from '../../../../Redux/breadCrumbReducer';
import React, { useRef }  from "react";
import { CRXRows, CRXColumn, CRXButton, CRXToaster, CRXConfirmDialog } from "@cb/shared";
import "./categoryFormsDetail.scss"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DataPermissionModel } from "../../UserGroup/Group";
import { PageiGrid } from "../../../../GlobalFunctions/globalDataTableFunctions";
import FieldLister from "./FieldLister";
import { getAllFormFields, getAllFormFieldsFilter } from "../../../../Redux/FormFields";
import { FormFieldsTemplate } from "../TypeConstant/types";
import FieldRowLister from "./FieldRowLister";
import { useHistory, useParams } from "react-router-dom";
import { SetupConfigurationAgent } from "../../../../utils/Api/ApiAgent";
import { Formik } from "formik";
import * as Yup from "yup";
import FormFieldInfo from "./FormFieldInfo";
import { urlList, urlNames } from "../../../../utils/urlList";
import { controlTypes } from '../TypeConstant/constants';
import FormFieldsDetail from '../FormFieldsLister/FormFieldsDetail';

type infoProps = {
    dataPermissionsInfo: DataPermissionModel[],
    onChangeDataPermission: any,
    onDeletePermission: any
}

export type CategoryFormsModel = {
    name: string;
    description: string;
    fields: number[];
}

const CategoryFormsDetail: React.FC<infoProps> = ({ dataPermissionsInfo, onChangeDataPermission, onDeletePermission }) => {
    const { id } = useParams<{ id: string }>();
    const [categoryFormId, SetcategoryFormId] = React.useState<number>(0);
    const [selectedFields, setSelectedFields] = React.useState<FormFieldsTemplate[]>([]);
    const [openModel, setOpenModel] = React.useState<boolean>(false);
    const [createFormFieldOpenModel, setCreateFormFieldOpenModel] = React.useState<boolean>(false);
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();
    const history = useHistory();
    const toasterRef = useRef<typeof CRXToaster>(null);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
    const [isOpen, setIsOpen] = React.useState(false);
    const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
        gridFilter: {
            logic: "and",
            filters: []
        },
        page: page,
        size: rowsPerPage
    });

    const [categoryFormsPayload, setCategoryFormsPayload] = React.useState<CategoryFormsModel>({
        name: "",
        description: "",
        fields: []
    });

    const onAddFormFields = (modelOpen: boolean) => {
        dispatch(getAllFormFields());
        setOpenModel(modelOpen);
    }

    const onCreateFormFields = (modelOpen: boolean) => {
        setCreateFormFieldOpenModel(modelOpen);
    }

    const updateOpenModel = (modelOpen: boolean) => {
        setOpenModel(modelOpen);
    }

    React.useEffect(() => {
        if (id) {
            let categoryFormsId = Number.parseInt(id);
            if (categoryFormsId > 0) {
                SetcategoryFormId(categoryFormsId);
                SetupConfigurationAgent.getSingleCategoryForm(categoryFormsId).then((response: any) => {
                    if (response !== undefined && response != null) {
                        let selectedFormFields: FormFieldsTemplate[] = [];
                        let formFields = response?.fields;
                        if (formFields?.length > 0) {
                            selectedFormFields = formFields?.map((template: any) => {
                                return {
                                    id: template.id,
                                    name: template.name,
                                    displayName: template?.display?.caption,
                                    controlType:  controlTypes?.find((x:any) => x.value ==template?.type)?.displayText,
                                    width: template?.display?.width
                                }
                            });
                            setSelectedFields(selectedFormFields);
                        }
                        let intoi = {
                            description: response?.description,
                            name: response?.name,
                            type: response?.type,
                            fields: formFields?.map((x: any) => { return x.id })
                        }
                        dispatch(enterPathActionCreator({ val: response?.name }));
                        setCategoryFormsPayload(intoi);
                    }
                })
                    .catch((err: any) => {
                        console.error(err);
                    });
            }
        }
    }, [id]);

    const categoryFromsValidationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        fields: Yup.array().min(1).required("at least one item needs to be here"),
    });

    const onSubmit =(values : any) => 
    {
        let url = "Forms";
        let fieldList = selectedFields?.map((template: any) => {
            return {
                id: template?.id,
                name: template?.name,
                type: controlTypes?.find((x:any) => x.displayText ==template?.controlType)?.value,
            }
        });
        let body = {
            name : values?.name,
            description : values?.description,
            fields : fieldList
        };
        
        if (id) {

            let categoryFormsId = Number.parseInt(id);
            if (categoryFormsId > 0) {
                url += "/ChangeForm/" + id;
                SetupConfigurationAgent.putCategoryForms(url, body).then((res:any)=>{
                    onMessageShow(true,t("Category_Form_Edited_Successfully"));
                    dispatch(enterPathActionCreator({ val: values?.name }));
                })
                    .catch((e: any) => {
                        console.error(e.message);
                        // setError(false);
                        return e;
                    })
            }
        }
        else
        {
            SetupConfigurationAgent.postCategoryForms(url, body).then((res:any)=>{
                onMessageShow(true,t("Category_Form_Saved_Successfully"));
                dispatch(enterPathActionCreator({ val: values?.name }));
                const path = `${urlList.filter((item: any) => item.name === urlNames.categoryFormsEdit)[0].url}`;
                history.push(path.substring(0, path.lastIndexOf("/")) + "/" + res);
                // setIsSaveDisable(true);
            })
                .catch((e: any) => {
                    console.error(e.message);
                    // setError(false);
                    return e;
                })
        }
    }

    const CategoryFormFormMessages = (obj: any) => {
        toasterRef?.current?.showToaster({
            message: obj.message,
            variant: obj.variant,
            duration: obj.duration,
            clearButtton: true,
        });
    }

    const onMessageShow = (isSuccess: boolean, message: string) => {
        CategoryFormFormMessages({
            message: message,
            variant: isSuccess ? 'success' : 'error',
            duration: 7000
        });
    }

    const navigateToCategoryFormsAndFields = () => {
        history.push(
            urlList.filter((item: any) => item.name === urlNames.categoryForms)[0].url
        );
    };

    const closeDialog = (dirty: boolean) => {
        if (dirty) {
            setIsOpen(true);
        }
        else {
            handleClose();
        }
    };

      const handleClose = () => {
        setIsOpen(false);
        navigateToCategoryFormsAndFields();
      };

    return (
        <div className="create_category_view switchLeftComponents">
            <CRXToaster ref={toasterRef} className="categoryFormToaster" />
            <Formik
                enableReinitialize={true}
                initialValues={categoryFormsPayload}
                validationSchema={categoryFromsValidationSchema}
                onSubmit={(values) => {}}
            >
                {({ setFieldValue, values, errors, touched, dirty, isValid, handleBlur, setTouched }) => (


                    <div className="create_category_form_area">
                        <FormFieldInfo setFieldValue={setFieldValue} name={values.name} description={values.description} errors={errors} touched={touched}></FormFieldInfo>
                        {
                            openModel &&
                            (<FieldLister categoryFormId={categoryFormId} title={t("Create_Category_Forms")} pageiGrids={pageiGrid} selectedFields={selectedFields} setSelectedFields={setSelectedFields} openModel={updateOpenModel} setFieldValue={setFieldValue} />)
                        }
                        {
                            createFormFieldOpenModel &&
                            (<FormFieldsDetail id={0} title={t("Create_Form_Fields")} pageiGrid={pageiGrid} openModel={onCreateFormFields} isCategoryForms={true} setSelectedFields={setSelectedFields} selectedFields={selectedFields} setFieldValue={setFieldValue}/>)
                        }
                        <div className="addFormFields formFieldBtn">
                            <CRXButton
                                className='add_exist_button'
                                onClick={onAddFormFields}
                                color='primary'
                                variant='contained'
                            > {t("Add_Existing_Form_Fields")}
                            </CRXButton>
                            <CRXButton
                                className='create_form_field_button'
                                onClick={onCreateFormFields}
                                color='primary'
                                variant='contained'
                            > {t("Create_Form_Fields")}
                            </CRXButton>
                        </div>
                        <div className="create_category_Content">
                            <CRXRows container="container" spacing={0}>
                                <CRXColumn className="create_category_column" container="container" item="item" xs={4} spacing={0}>{t("Field_Display_Name")}</CRXColumn>
                                <CRXColumn className="create_category_column" container="container" item="item" xs={4} spacing={0}>{t("Field_Name")}</CRXColumn>
                                <CRXColumn className="create_category_column" container="container" item="item" xs={4} spacing={0}>{t("Control_Type")}</CRXColumn>
                            </CRXRows>
                        </div>
                        <FieldRowLister selectedFields={selectedFields} setSelectedFields={setSelectedFields} setFieldValue={setFieldValue}></FieldRowLister>
                        <div className="formFieldFooterButton">
                            <div className="submit_cancel_btn">
                                <CRXButton
                                    disabled={!(isValid && dirty)}
                                    variant="contained"
                                    className="groupInfoTabButtons"
                                    onClick={() => onSubmit(values)}
                                >
                                    {t("Save")}
                                </CRXButton>
                                <CRXButton
                                    className="groupInfoTabButtons secondary"
                                    color="secondary"
                                    variant="outlined"
                                    onClick={navigateToCategoryFormsAndFields}
                                >
                                    {t("Cancel")}
                                </CRXButton>
                            </div>
                            <div className="category_view_exit">
                                <CRXButton
                                    className="groupInfoTabButtons-Close secondary"
                                    color="secondary"
                                    variant="outlined"
                                    onClick={()=> closeDialog(dirty)}
                                >
                                    {t("Close")}
                                </CRXButton>
                            </div>
                        </div>
                    </div>


                )}
            </Formik>
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
            <strong>{t("Category_Forms_And_Fields")}</strong>. {t("If_you_close_the_form")},
            {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
            <div className="confirmMessageBottom">
              {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
            </div>
          </div>
        </CRXConfirmDialog>
        </div>
    )
}

export default CategoryFormsDetail;
