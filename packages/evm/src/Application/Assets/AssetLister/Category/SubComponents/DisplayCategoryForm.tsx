import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CRXHeading } from "@cb/shared";

type DisplayCategoryFormProps = {
  isCategoryEmpty: boolean;
  categoryObject: any;
  initialValueObjects: Array<any>;
  setFieldsFunction: (param: any) => void;
};

const DisplayCategoryForm: React.FC<DisplayCategoryFormProps> = (props) => {
  const [displayErrors, setDisplayCategoryForm] = React.useState<string>('');
  const initialValueArray = [];
  for (const initialValue in props.initialValueObjects) {
    initialValueArray.push(initialValue);
  }

  const validationSchema = initialValueArray.reduce(
    (obj, item) => ({ ...obj, [item]: Yup.string().required('Required') }),
    {}
  );
  
  return (
    <>
      {Object.keys(props.initialValueObjects).length > 0 && props.categoryObject.form.map((formObj: any) => (
        <div className="categoryFormAdded" key={formObj.formId}>
          <CRXHeading variant="h4" className="categoryFormTitle">
            Category Forms{" "}
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
                          <span>{field.name === undefined ? field.value : field.name}</span> is required
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
