
import React from "react";
import { CRXRows, CRXColumn, CRXButton } from "@cb/shared";
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

type infoProps = {
    dataPermissionsInfo: DataPermissionModel[],
    onChangeDataPermission: any,
    onDeletePermission: any
}

export type CategoryFormsModel = {
    name: string;
    description: string;
    type: string;
    fields: number[];
}

const CategoryFormsDetail: React.FC<infoProps> = ({ dataPermissionsInfo, onChangeDataPermission, onDeletePermission }) => {
    const { id } = useParams<{ id: string }>();
    const [categoryFormId, SetcategoryFormId] = React.useState<number>(0);
    const [selectedFields, setSelectedFields] = React.useState<FormFieldsTemplate[]>([]);
    const [openModel, setOpenModel] = React.useState<boolean>(false);
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();
    const history = useHistory();
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
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
        type: "",
        fields: []
    });

    const onAddFormFields = (modelOpen: boolean) => {
        dispatch(getAllFormFieldsFilter(pageiGrid));
        setOpenModel(modelOpen);
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
                                    controlType: template?.type,
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
                        setCategoryFormsPayload(intoi);
                    }
                })
                    .catch((err: any) => {
                        console.error(err);
                    });
            }
        }
    }, [id]);

    React.useEffect(() => {
        dispatch(getAllFormFieldsFilter(pageiGrid))
        dispatch(getAllFormFields())
    }, []);

    const categoryFromsValidationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        fields: Yup.array().min(1).required("at least one item needs to be here"),
        type: Yup.string().required("Type is required"),
    });

    const navigateToCategoryFormsAndFields = () => {
        history.push(
            urlList.filter((item: any) => item.name === urlNames.categoryFormsAndFields)[0].url
        );
    };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={categoryFormsPayload}
            validationSchema={categoryFromsValidationSchema}
            onSubmit={(values) => {
                console.log("SUBMIT : " + values);
            }}
        >
            {({ setFieldValue, values, errors, touched, dirty, isValid, handleBlur, setTouched }) => (


                <div className="crx-datapermission-tab">
                    <FormFieldInfo setFieldValue={setFieldValue} name={values.name} description={values.description} type={values.type} errors={errors} touched={touched} handleBlur={handleBlur} setTouched={setTouched}></FormFieldInfo>
                    {
                        openModel &&
                        (<FieldLister categoryFormId={categoryFormId} title={t("Create_Category_Forms")} pageiGrids={pageiGrid} selectedFields={selectedFields} setSelectedFields={setSelectedFields} openModel={updateOpenModel} setFieldValue={setFieldValue} />)
                    }
                    <div className="addFormFields formFieldBtn">
                        <CRXButton
                            // disabled={isdisable}
                            className='PreSearchButton'
                            onClick={onAddFormFields}
                            color='primary'
                            variant='contained'
                        > {t("Add_Existing_Form_Fields")}
                        </CRXButton>
                    </div>
                    <div className="dataPermissionContent">
                        <CRXRows container="container" spacing={0}>
                            <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>{t("Field_Display_Name")}</CRXColumn>
                            <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>{t("Field_Name")}</CRXColumn>
                            <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>{t("Control_Type")}</CRXColumn>
                            <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>{t("Width")}</CRXColumn>
                        </CRXRows>
                    </div>
                    <FieldRowLister selectedFields={selectedFields} setSelectedFields={setSelectedFields} setFieldValue={setFieldValue}></FieldRowLister>
                    <div className="formFieldFooterButton">
                        <div>
                            <CRXButton
                                type="submit"
                                disabled={!(isValid && dirty)}
                                variant="contained"
                                className="groupInfoTabButtons"
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
                        <div>
                            <CRXButton
                                //   onClick={() => redirectPage(values)}
                                className="groupInfoTabButtons-Close secondary"
                                color="secondary"
                                variant="outlined"
                            >
                                {t("Close")}
                            </CRXButton>
                        </div>
                    </div>
                </div>


            )}
        </Formik>
    )
}

export default CategoryFormsDetail;
