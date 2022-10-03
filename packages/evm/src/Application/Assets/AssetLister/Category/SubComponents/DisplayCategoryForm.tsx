import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CRXHeading } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { DisplayCategoryFormProps } from "../Model/DisplayCategoryForm";

const DisplayCategoryForm: React.FC<DisplayCategoryFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const [displayErrors, setDisplayCategoryForm] = React.useState<string>('');
  const initialValueArray = [];
  for (const initialValue in props.initialValueObjects) {
    initialValueArray.push(initialValue);
  }

  const validationSchema = initialValueArray.reduce(
    (obj, item) => ({ ...obj, [item]: Yup.string().max(1024, t("Maximum_lenght_is_1024")).required(t("required")) }),
    {}
  );
  
  return (
    <>
      {Object.keys(props.initialValueObjects).length > 0 && props.categoryObject.form.map((formObj: any) => (
        <div className="categoryFormAdded" key={formObj.formId}>
          <CRXHeading variant="h4" className="categoryFormTitle">
          {t("Category_Forms")}{" "}
            {formObj.record !== undefined
              ? formObj.record.record.find((x: any) => x.key === "Name").value
              : formObj.name}
          </CRXHeading>
          <Formik
            enableReinitialize={true}
            initialValues={props.initialValueObjects}
            onSubmit={() => { }}
            validationSchema={Yup.object({
              ...validationSchema,
            })}
          >
            {({ errors, touched }) => (
              <Form>
                {formObj.fields.map((field: any) => (
                  <div className={`categoryInnerField`} key={field.id}>
                    <label className="categoryFormLabel" htmlFor={field.id}>
                      {field.key === undefined ? (field.name === undefined ? field.value : field.name) : field.key}
                    </label>
                    <b className={errors[field.name === undefined ? field.value : field.name] ? "errorStaric" : "formStaric"}>*</b>
                    <div className="CBX-input">
                      <Field
                        className={
                          "editCategoryField " +
                          `${errors[field.name === undefined ? field.value : field.name] ? displayErrors : ''}`
                        }
                        id={field.id}
                        name={
                          field.name === undefined ? field.value : field.name
                        }
                        onKeyUp={(e: any) => {
                          props.setFieldsFunction(e);
                        }}
                      />
                      {/* 
                      {errors[fieldName] !== undefined && touched[fieldName] === true && fieldName && field.value === undefined ? ( */}
                      {/* Above logic is used to handle error message, commented in bug fixing  */}
                      {errors[field.name === undefined ? field.value : field.name] !== undefined ? (
                        <div className="errorStyle">
                          <i className="fas fa-exclamation-circle"></i>
                          {/* <span>{field.name === undefined ? field.value : field.name}</span> {t("is_required")} */}
                          {errors[field.name === undefined ? field.value : field.name]}
                          {setDisplayCategoryForm("errorBrdr")}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </Form>
            )}
          </Formik>
        </div>
      ))}
    </>
  );
}

export default DisplayCategoryForm;