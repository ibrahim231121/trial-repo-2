import React, { useEffect } from "react";
import "./categoryFormsDetail.scss"
import { Field, FormikErrors, FormikTouched } from "formik";
import { TextField } from "@material-ui/core";
import { CategoryFormsModel } from "./CategoryFormsDetail";
import { useTranslation } from "react-i18next";

type infoProps = {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  name: string;
  description: string;
  errors: FormikErrors<CategoryFormsModel>;
  touched: FormikTouched<CategoryFormsModel>;
}

const FormFieldInfo: React.FC<infoProps> = ({ setFieldValue, name, description, errors, touched }) => {
  const { t } = useTranslation<string>();

  return (
    <>
      <div className="formDetailInfo">
        <div className="category_create_form_fields">

          <div className="text-field">
            <div className="CBX-input">
              <label htmlFor="name">
                Name <span>*</span>
              </label>
              <Field
                value={name}
                id="name"
                name="name"
                key="name"
                className="CBX-input"
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
            </div>
          </div>
          <div className="text-field">
            <div className="CBX-input">
              <label htmlFor="name">
                Description
              </label>
              <TextField
                id="description"
                required={false}
                value={description}
                className="categories-input"
                onChange={(e: any) => setFieldValue("description", e.target.value)}
                disabled={false}
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FormFieldInfo;
