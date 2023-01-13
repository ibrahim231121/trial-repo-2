import React, { useEffect } from "react";
import "./categoryFormsDetail.scss"
import { Field, FormikErrors, FormikTouched } from "formik";
import { TextField } from "@material-ui/core";
import { CategoryFormsModel } from "./CategoryFormsDetail";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllTypes } from "../../../../Redux/FormFields";
import { RootState } from "../../../../Redux/rootReducer";
import { DropdownModel } from "../../../../utils/Api/models/CategoryModels";
import { CRXSelectBox } from "@cb/shared";

type infoProps = {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  name: string;
  description: string;
  type: string;
  errors: FormikErrors<CategoryFormsModel>;
  touched: FormikTouched<CategoryFormsModel>;
  handleBlur: any;
  setTouched: any;
}

const FormFieldInfo: React.FC<infoProps> = ({ setFieldValue, name, description, type, errors, touched, handleBlur, setTouched }) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const getAllType: any = useSelector((state: RootState) => state.FormFieldsSlice.getAllTypes);
  const [typesOptions, setTypesOptions] = React.useState<DropdownModel[]>([]);

  useEffect(() => {
    dispatch(getAllTypes());
  }, []);

  const setTypes = () => {
    let TypesTemplateRows: DropdownModel[] = [];
    if (getAllType?.length > 0) {
      TypesTemplateRows = getAllType?.map((template: any) => {
        return {
          value: template.name,
          displayText: template.name,
        }
      })
    }
    setTypesOptions(TypesTemplateRows);
  }

  useEffect(() => {
    setTypes();
  }, [getAllType]);


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

          <div className="typeSelectBox">
            <label className="">
              {t("Type")} <span>*</span>
            </label>
            <CRXSelectBox
              id="type"
              name="ty[e"
              value={type}
              onChange={(e: any) => {
                setFieldValue("type", e.target.value)
              }
              }
              options={typesOptions}
              onClose={(e: any) => {
                handleBlur(e);
                setTouched({
                  ...touched,
                  ["type"]: true,
                });
              }}
              isRequried={touched.type && ((errors.type?.length ?? 0) > 0)}
              error={!((errors.type?.length ?? 0) > 0)}
              errorMsg={errors.type}
            />
          </div>

        </div>
      </div>
    </>
  )
}

export default FormFieldInfo;
