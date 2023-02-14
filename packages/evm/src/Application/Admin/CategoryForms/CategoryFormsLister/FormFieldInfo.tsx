import React, { useEffect, useRef, useState } from "react";
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
  const [position, setPosition] = useState<string>("relative")
  const stickyForm : any = useRef()
  useEffect(() => {
    window.addEventListener('scroll', function() {
       const win = window.pageYOffset;
       if(win > 0) {
        stickyForm && (stickyForm.current.style.position = "sticky");
        stickyForm && (stickyForm.current.style.top = "135px")
            
       }else {
          stickyForm && (stickyForm.current.style.position = "relative");
          stickyForm && (stickyForm.current.style.top = "55px")
       }
    });
},[])
  return (
    <>
      <div className="formDetailInfo" ref={stickyForm}>
        <div className="category_create_form_fields">

          <div className="text-field">
              <label htmlFor="name">
                Name <span className={`${errors.name !== undefined &&
                touched.name ? "staric-error" : ""}`}>*</span>
              </label>
              <div className={`CBX-input ${errors.name !== undefined &&
                touched.name ? "error" : ""}`}>
              <Field
                value={name}
                id="name"
                name="name"
                key="name"
                className="name-field"
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
              <label htmlFor="Description">
                Description
              </label>
              <TextField
                id="description"
                required={false}
                value={description}
                className="CBX-input categories-input"
                onChange={(e: any) => setFieldValue("description", e.target.value)}
                disabled={false}
                type="text"
              />
          </div>
        </div>
      </div>
    </>
  )
}

export default FormFieldInfo;
