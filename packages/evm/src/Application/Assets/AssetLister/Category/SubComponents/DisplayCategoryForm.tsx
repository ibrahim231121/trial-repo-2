import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CRXHeading } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { DisplayCategoryFormProps } from "../Model/DisplayCategoryForm";
import { FieldTypes } from "../Model/FieldTypes";
import { CADID, CaseNO, FieldCheckedBoxListType, FieldCheckedBoxType, FieldDropDownListType, FieldRadioButtonListType, PolygraphLogNumber } from "./FieldTypes/Index";

const DisplayCategoryForm: React.FC<DisplayCategoryFormProps> = (props) => {
  const { t } = useTranslation<string>();
  
  function IsFieldtypeEquals(field: any, fieldType: any) {
    if ((field.type == fieldType) || (field.dataType == fieldType)) {
      return true
    }
    return false;
  }

  return (
    <>
      {(Object.keys(props.initialValueObjects).length > 0) &&
        props.formCollection.map((categoryObject: any) => (
          categoryObject.form.map((formObj: any) => (
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
                  ...props.validationSchema,
                })}>
                {({ errors }) => (
                  <Form>
                    {formObj.fields.map((field: any) => (
                      <div className={`categoryInnerField`} key={field.id}>
                        <label className="categoryFormLabel" htmlFor={field.id}>
                          {field.name === undefined ? field.key : field.name}
                        </label>
                        <b className={errors[field.name === undefined ? field.key : field.name] ? "errorStaric" : "formStaric"}>*</b>
                        <div className="CBX-input">

                          {(IsFieldtypeEquals(field, FieldTypes.FieldTextBoxType) || IsFieldtypeEquals(field, FieldTypes.CaseNO) || IsFieldtypeEquals(field, FieldTypes.PolygraphLogNumber) || IsFieldtypeEquals(field, FieldTypes.CADID) || IsFieldtypeEquals(field, FieldTypes.Unknown)) &&
                            <Field
                              className={
                                `editCategoryField ${errors[field.name === undefined ? field.key : field.name] ? 'errorBrdr' : ''}`
                              }
                              id={field.id}
                              name={
                                field.name === undefined ? field.key : field.name
                              }
                              onKeyUp={(e: any) => {
                                props.setFieldsFunction({ name: e.target.name, value: e.target.value });
                              }}
                            />
                          }

                          {((field.type == FieldTypes.FieldDropDownListType) || (field.dataType == FieldTypes.FieldDropDownListType)) &&
                            <Field
                              id={field.id}
                              name={
                                field.name === undefined ? field.key : field.name
                              }
                              component={(formikProps: any) =>
                                <FieldDropDownListType
                                  formikProps={formikProps}
                                  options={field.defaultFieldValue.split('|')}
                                  setFieldsFunction={(e) => { props.setFieldsFunction({ name: e.name, value: e.value }); }}
                                />
                              }
                            />
                          }

                          {((field.type == FieldTypes.FieldCheckedBoxType) || (field.dataType == FieldTypes.FieldCheckedBoxType)) &&
                            <Field
                              id={field.id}
                              name={
                                field.name === undefined ? field.key : field.name
                              }
                              component={(formikProps: any) =>
                                <FieldCheckedBoxType
                                  formikProps={formikProps}
                                  setFieldsFunction={(e) => props.setFieldsFunction({ name: e.name, value: e.value })}
                                />
                              }
                            />
                          }

                          {((field.type == FieldTypes.FieldTextAreaType) || (field.dataType == FieldTypes.FieldTextAreaType)) &&
                            <Field
                              as="textarea"
                              className={
                                `editCategoryField ${errors[field.name === undefined ? field.key : field.name] ? 'errorBrdr' : ''}`
                              }
                              id={field.id}
                              name={
                                field.name === undefined ? field.key : field.name
                              }
                              onKeyUp={(e: any) => {
                                props.setFieldsFunction({ name: e.target.name, value: e.target.value });
                              }}
                            />
                          }

                          {((field.type == FieldTypes.FieldCheckedBoxListType) || (field.dataType == FieldTypes.FieldCheckedBoxListType)) &&
                            <Field
                              id={field.id}
                              name={
                                field.name === undefined ? field.key : field.name
                              }
                              component={(formikProps: any) =>
                                <FieldCheckedBoxListType
                                  formikProps={formikProps}
                                  options={field.defaultFieldValue.split('|')}
                                  setFieldsFunction={(e) => props.setFieldsFunction({ name: e.name, value: e.value })}
                                />
                              }
                            />
                          }

                          {((field.type == FieldTypes.FieldRadioButtonListType) || (field.dataType == FieldTypes.FieldRadioButtonListType)) &&
                            <Field
                              id={field.id}
                              name={
                                field.name === undefined ? field.key : field.name
                              }
                              component={(formikProps: any) =>
                                <FieldRadioButtonListType
                                  formikProps={formikProps}
                                  options={field.defaultFieldValue.split('|')}
                                  setFieldsFunction={(e) => props.setFieldsFunction({ name: e.name, value: e.value })}
                                />
                              }
                            />
                          }

                          {errors[field.name === undefined ? field.key : field.name] !== undefined && (
                            <div className="errorStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors[field.name === undefined ? field.key : field.name]}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </Form>
                )}
              </Formik>
            </div>
          ))
        ))
      }
    </>
  );
}

export default DisplayCategoryForm;