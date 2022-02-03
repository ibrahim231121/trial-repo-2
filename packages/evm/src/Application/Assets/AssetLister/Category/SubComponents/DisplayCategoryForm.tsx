import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CRXHeading, TextField } from "@cb/shared";

type DisplayCategoryFormProps = {
  isCategoryEmpty: boolean;
  categoryObject: any;
  initialValuesObjects: Array<any>;
  setFieldsFunction: (param: any) => void;
};

const DisplayCategoryForm: React.FC<DisplayCategoryFormProps> = (props) => {
  const [displayErrors, setDisplayCategoryForm] = React.useState<string>("");
  const initialValuesArray = [];

  for (const i in props.initialValuesObjects) {
    
    initialValuesArray.push(i);
  }

  const formSchema = initialValuesArray.reduce(
    
    (obj, item) => ({ ...obj, [item]: Yup.string().required("Required") }),
    {}
  );

useEffect(() => {

},[displayErrors])

  return (
    <>
      {props.categoryObject.form.map((formObj: any, key: number) => (
        <div className="categoryFormAdded" key={key}>
          <CRXHeading variant="h4" className="categoryFormTitle">
            Category Forms{" "}
            {formObj.record !== undefined
              ? formObj.record.record.find((x: any) => x.key === "Name").value
              : formObj.name}
          </CRXHeading>
          <Formik
            enableReinitialize={true}
            initialValues={props.initialValuesObjects}
            onSubmit={() => {}}
            validationSchema={Yup.object({
              ...formSchema,
            })}
          >
            {({ errors, touched }) => (
            <Form>
              {formObj.fields.map((field: any, fieldKey: any) => (
                <div className={`categoryInnerField` } key={fieldKey}>
                  <label className="categoryFormLabel" htmlFor={field.id}>
                    {field.key === undefined ? field.name : field.key}
                  </label>
                  
                  <b className={errors[field.name] && touched[field.name] == true? "errorStaric" :  "formStaric" }>*</b>
                 
                  <div className="CBX-input">
                    
                    <Field
                      className={
                        "editCategoryField " + 
                        ` ${errors[field.name] && touched[field.name] == true? displayErrors : ""}`
                      }
                      id={field.id}
                      name={
                        field.name
                      }
                      onKeyUp={(e : any) => {
                        props.setFieldsFunction(e);
                    }}
                     
                    />
                    
                    {errors[field.name] !== undefined && touched[field.name] === true && field.name && field.value === undefined ? (
                      <div className="errorStyle">

                        <i className="fas fa-exclamation-circle"></i>
                        <span>{field.name}</span> is required
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
};

export default DisplayCategoryForm;
