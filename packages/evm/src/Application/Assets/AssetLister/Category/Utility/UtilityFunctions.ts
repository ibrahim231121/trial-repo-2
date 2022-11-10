import * as Yup from 'yup';
import { SetupConfigurationsModel } from '../../../../../utils/Api/models/SetupConfigurations';
import { FormInitialValues } from '../Model/CategoryFormModel';
import { FieldTypes } from '../Model/FieldTypes';
import { SelectedCategoryModel } from '../Model/FormContainerModel';
import { Category } from '../../../../../utils/Api/models/EvidenceModels';

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
    sortedArray = sortedArray.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1));
    return sortedArray;
};

const applyValidation = (arg: Array<FormInitialValues>): {} => {
    const Initial_Values_Validation_Schema = [];
    for (const field of arg) {
        let validationObject: any;
        if (field.fieldType === FieldTypes.FieldTextBoxType || field.fieldType === FieldTypes.FieldTextAreaType) {
            validationObject = Yup.string().max(1024, 'Maximum_lenght_is_1024').required('required');
        } else if (field.fieldType === FieldTypes.FieldDropDownListType) {
            validationObject = Yup.string().required('required');
        } else if (field.fieldType === FieldTypes.FieldCheckedBoxType) {
            validationObject = Yup.string().required('required');
        } else if (field.fieldType === FieldTypes.FieldCheckedBoxListType) {
            validationObject = Yup.string().required('required');
        } else if (field.fieldType === FieldTypes.FieldRadioButtonListType) {
            validationObject = Yup.string().required('required');
        } else if (field.fieldType === FieldTypes.CaseNO) {
            validationObject = Yup.string().required('required');
        } else if (field.fieldType === FieldTypes.PolygraphLogNumber) {
            validationObject = Yup.string().required('required');
        } else if (field.fieldType === FieldTypes.CADID) {
            validationObject = Yup.string().required('required');
        }
        Initial_Values_Validation_Schema.push({ key: field.key, value: validationObject });
    }
    const reducedFormSchema = Initial_Values_Validation_Schema.reduce(
        (obj, item: any) => ({ ...obj, [item.key]: item.value }),
        {}
    );
    return reducedFormSchema;
};

const IsFieldtypeEquals = (field: any, fieldType: FieldTypes): boolean => {
    if (field.type == fieldType || field.dataType == fieldType) {
        return true;
    }
    return false;
};

const RemapFormFieldKeyName = (formsCollection: Array<any>): Array<any> => {
    const remapedFormCollection = formsCollection.map((form: any) => {
        return {
            ...form,
            fields: form.fields.map((field: any) => {
                if (field.hasOwnProperty('name')) {
                    return field.name.includes('|')
                        ? {
                              ...field
                          }
                        : {
                              ...field,
                              name: `${field.name}|${form.id ?? form.formId}`
                          };
                } else {
                    return field.key.includes('|')
                        ? {
                              ...field
                          }
                        : {
                              ...field,
                              key: `${field.key}|${form.id ?? form.formId}`
                          };
                }
            })
        };
    });
    return remapedFormCollection;
};

const RevertKeyName = (keyNameText: string): string => {
    const n = keyNameText.indexOf('|');
    const result = keyNameText.substring(0, n != -1 ? n : keyNameText.length);
    return result;
};

const MapSetupCategoryFormToEvidenceCategoryForm = (
    setupCategories: Array<SetupConfigurationsModel.Category>,
    evidenceCategories: Array<Category>
): Array<any> => {
    const categoryArray: any = [];
    for (const evidenceCategory of evidenceCategories) {
        const setupCategory = setupCategories.find((x) => x.name === evidenceCategory.name);
        if (setupCategory) {
            const formCollection: any[] = [];
            for (const evidenceForm of evidenceCategory.formData) {
                const setupForm = setupCategory.forms.find((o) => o.id.toString() === evidenceForm.formId.toString());
                if (setupForm) {
                    formCollection.push({ ...evidenceForm, fields: evidenceForm.fields.map((field) => {
                        return {
                            ...field,
                            defaultFieldValue: setupForm?.fields.find((x) => x.name === field.key)?.defaultFieldValue,
                            display: setupForm?.fields.find((x) => x.name === field.key)?.display
                        };
                    }) });
                }
            }
            categoryArray.push({ ...evidenceCategory, formData: formCollection });
        }
    }
    return categoryArray;
};
export {
    filterCategory,
    applyValidation,
    IsFieldtypeEquals,
    RemapFormFieldKeyName,
    RevertKeyName,
    MapSetupCategoryFormToEvidenceCategoryForm
};
