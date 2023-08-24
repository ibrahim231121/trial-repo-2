import React from "react";
import { Formik, Form, Field } from "formik";
import { CRXHeading } from "@cb/shared";
import { DisplayCategoryFormProps, FieldsFunctionType } from "../Model/DisplayCategoryForm";
import { useTranslation } from "react-i18next";
import { FieldTypes } from "../Model/FieldTypes";
import { FieldCheckedBoxListType, FieldCheckedBoxType, FieldDropDownListType, FieldRadioButtonListType } from "./FieldTypes/Index";
import { IsFieldtypeEquals } from "../Utility/UtilityFunctions";
import "./DisplayCategoryForm.scss";
import _ from "lodash";

const IsPropsEqual = (prevProps: DisplayCategoryFormProps, nextProps: DisplayCategoryFormProps) => !_.isEqual(prevProps, nextProps);
const DisplayCategoryForm: React.FC<DisplayCategoryFormProps> = React.memo(({initialValueObjects, formCollection, validationSchema, setFieldsFunction}) => {
  const { t } = useTranslation<string>();
  return (
    <>
      {(Object.keys(initialValueObjects).length > 0) &&
        formCollection.map((categoryObject: any) => (
          categoryObject.form.map((formObj: any) => (
            <div className="categoryFormAdded" key={formObj.formId}>
              <CRXHeading variant="h4" className="categoryFormTitle">
                {formObj.record !== undefined
                  ? formObj.record.record.find((x: any) => x.key === "Name").value
                  : formObj.name}
              </CRXHeading>
              <Formik
                enableReinitialize={true}
                initialValues={initialValueObjects}
                onSubmit={() => { }}
                validationSchema={validationSchema}>
                {({ errors, touched }) => (
                  <Form>
                    {formObj.fields.map((field: any) => (
                      <div className={`categoryInnerField `} key={field.id}>
                        <div className="categoryFormLabel_UI">
                          <label className="categoryFormLabel  " htmlFor={field.id}>
                            {field?.display?.caption}
                          </label>
                          {field.isRequired &&
                            <div className={errors[field.name ?? field.key] && touched[field.name ?? field.key] ? "errorStaric" : "formStaric"}>*</div>
                          }
                        </div>
                        <div className="CBX-input">
                          {(IsFieldtypeEquals(field, FieldTypes.FieldTextBoxType) || IsFieldtypeEquals(field, FieldTypes.CaseNO) || IsFieldtypeEquals(field, FieldTypes.PolygraphLogNumber) || IsFieldtypeEquals(field, FieldTypes.CADID) || IsFieldtypeEquals(field, FieldTypes.Unknown)) &&
                            <Field
                              className={
                                `editCategoryField ${errors[field.name ?? field.key] && touched[field.name ?? field.key] ? 'errorBrdr' : ''}`
                              }
                              id={field.id}
                              name={
                                field.name ?? field.key
                              }
                              onBlur={(e: React.FocusEvent<HTMLInputElement>) => setFieldsFunction({ name: e.target.name, value: e.target.value })
                              }
                            />
                          }
                          {(IsFieldtypeEquals(field, FieldTypes.FieldDropDownListType)) &&
                            <div className="categoryFormDropDown_UI">
                              <Field
                                id={field.id}
                                name={
                                  field.name ?? field.key
                                }
                                component={(formikProps: any) =>
                                  <FieldDropDownListType
                                    formikProps={formikProps}
                                    options={field.defaultFieldValue.split('|')}
                                    setFieldsFunction={(e) => setFieldsFunction({ name: e.name, value: e.value })}
                                  />
                                }
                              />
                            </div>
                          }
                          {(IsFieldtypeEquals(field, FieldTypes.FieldCheckedBoxType)) &&
                            <Field
                              id={field.id}
                              name={
                                field.name ?? field.key
                              }
                              component={(formikProps: any) =>
                                <FieldCheckedBoxType
                                  formikProps={formikProps}
                                  setFieldsFunction={(e) => setFieldsFunction({ name: e.name, value: e.value })}
                                />
                              }
                            />
                          }
                          {(IsFieldtypeEquals(field, FieldTypes.FieldTextAreaType)) &&
                            <Field
                              as="textarea"
                              className={
                                `editCategoryField ${errors[field.name ?? field.key] ? 'errorBrdr' : ''}`
                              }
                              id={field.id}
                              name={
                                field.name ?? field.key
                              }
                              onBlur={(e: React.FocusEvent<HTMLInputElement>) => setFieldsFunction({ name: e.target.name, value: e.target.value })}
                            />
                          }
                          {(IsFieldtypeEquals(field, FieldTypes.FieldCheckedBoxListType)) &&
                            <Field
                              id={field.id}
                              name={
                                field.name ?? field.key
                              }
                              component={(formikProps: any) =>
                                <FieldCheckedBoxListType
                                  formikProps={formikProps}
                                  options={field.defaultFieldValue.split('|')}
                                  setFieldsFunction={(e) => setFieldsFunction({ name: e.name, value: e.value })}
                                />
                              }
                            />
                          }
                          {(IsFieldtypeEquals(field, FieldTypes.FieldRadioButtonListType)) &&
                            <Field
                              id={field.id}
                              name={
                                field.name ?? field.key
                              }
                              component={(formikProps: any) =>
                                <FieldRadioButtonListType
                                  formikProps={formikProps}
                                  options={field.defaultFieldValue.split('|')}
                                  setFieldsFunction={(e) => setFieldsFunction({ name: e.name, value: e.value })}
                                />
                              }
                            />
                          }
                          {errors[field.name ?? field.key] && (
                            <div className="errorStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {t(`${errors[field.name ?? field.key]}`)}
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
}, IsPropsEqual);

export default DisplayCategoryForm;