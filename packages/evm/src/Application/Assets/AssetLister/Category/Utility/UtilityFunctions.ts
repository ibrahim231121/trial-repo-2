import * as Yup from 'yup';
import { FormInitialValues } from '../Model/CategoryFormModel';
import { FieldTypes } from '../Model/FieldTypes';
import { SelectedCategoryModel } from "../Model/FormContainerModel";

const filterCategory = (arr: Array<any>): Array<SelectedCategoryModel> => {
  let sortedArray: Array<SelectedCategoryModel> = [];
  if (arr.length > 0) {
    for (const element of arr) {
      sortedArray.push({
        id: element.id,
        label: element.name
      });
    }
  }
  sortedArray = sortedArray.sort((a, b) =>
    a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
  );
  return sortedArray;
};

const applyValidation = (arg: Array<FormInitialValues>): {} => {
  const Initial_Values_Validation_Schema = [];
  for (const field of arg) {
    let validationObject: any;
    if (field.fieldType === FieldTypes.FieldTextBoxType || field.fieldType === FieldTypes.FieldTextAreaType) {
      validationObject = Yup.string().max(1024, "Maximum_lenght_is_1024").required("required");
    }
    else if (field.fieldType === FieldTypes.FieldDropDownListType) {
      validationObject = Yup.string().required("required");
    }
    else if (field.fieldType === FieldTypes.FieldCheckedBoxType) {
    }

    else if (field.fieldType === FieldTypes.FieldCheckedBoxListType) {
      validationObject = Yup.string().required("required");
    }
    else if (field.fieldType === FieldTypes.FieldRadioButtonListType) {
      validationObject = Yup.string().required("required");
    }
    else if (field.fieldType === FieldTypes.CaseNO) {
      validationObject = Yup.string().required("required");
    }
    else if (field.fieldType === FieldTypes.PolygraphLogNumber) {
      validationObject = Yup.string().required("required");
    }
    else if (field.fieldType === FieldTypes.CADID) {
      validationObject = Yup.string().required("required");
    }

    Initial_Values_Validation_Schema.push({ key: field.key, value: validationObject });
  }
  const reducedFormSchema = Initial_Values_Validation_Schema.reduce((obj, item: any) => ({ ...obj, [item.key]: item.value }), {});
  return reducedFormSchema;
}

export { filterCategory, applyValidation };