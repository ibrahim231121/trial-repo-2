import { TextField, CRXHeading } from "@cb/shared";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

interface Props {
    categoryObject: any;
    initialValues: Array<any>;
    setFieldForm: (event: any, formId: string, datatype: string) => void;
}

const CategoryFormOFAssetBucket: React.FC<Props> = ({ categoryObject, initialValues, setFieldForm }) => {
    const { t } = useTranslation<string>();
    const initialValueArray = [];

    for (const initialValue in initialValues) {
        initialValueArray.push(initialValue);
    }
    const validationSchema = initialValueArray.reduce(
        (obj, item) => ({ ...obj, [item]: Yup.string().max(1024, t("Maximum_lenght_is_1024")).required(t("required")) }),
        {}
    );
    return (
        <>
            {categoryObject.form.map((formObj: any) => (
                <div className="__Crx__Choose_Asset__MetaData__">
                    <CRXHeading variant="h4">
                        {t("Category")} {categoryObject.label}
                    </CRXHeading>
                    <CRXHeading variant="h6">
                        {t("Form")} {formObj.name}
                    </CRXHeading>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        onSubmit={() => { }}
                        validationSchema={Yup.object({
                            ...validationSchema,
                        })}
                    >
                        {({ errors }) => (
                            <Form>
                                {formObj.fields.map((field: any) => {
                                    return (
                                        <div className="__CRX__Asset__MetaData__Field">
                                            <label className="categoryFormLabel" htmlFor={field.id}>{field.display.caption}</label>
                                            <div className="CBX-input">
                                            <Field
                                                type="text"
                                                id={field.id}
                                                name={field.name === undefined ? field.value : field.name}
                                                onKeyUp={(e: any) => {
                                                    setFieldForm(e, field.formId, field.datatype);
                                                }} />
                                            
                                            {errors[field.name === undefined ? field.value : field.name] !== undefined ? (
                                                <div className="errorStyle">
                                                    <i className="fas fa-exclamation-circle"></i>
                                                    {errors[field.name === undefined ? field.value : field.name]}
                                                </div>
                                            ) : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </Form>
                        )}
                    </Formik>
                </div>
            ))}
        </>
    );
}

export default CategoryFormOFAssetBucket;