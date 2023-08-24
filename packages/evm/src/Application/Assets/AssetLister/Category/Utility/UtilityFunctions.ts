import * as Yup from 'yup';
import { SetupConfigurationsModel } from '../../../../../utils/Api/models/SetupConfigurations';
import { CategoryScenarioCallingFrom, FormInitialValues } from '../Model/CategoryFormModel';
import { FieldTypes } from '../Model/FieldTypes';
import { AssetLog, AssetLogType, AuditTableNames, Category, EvdenceCategoryAssignment, EvidenceCategory, FormData } from '../../../../../utils/Api/models/EvidenceModels';
import { SelectedCategoryModel } from '../Model/CategoryFormContainerModel';
import { AssetCategoryObject } from '../../ActionMenu/types';
import moment from 'moment';
import { addAssetLog } from '../../../../../Redux/AssetLogReducer';

interface categoryretentionDetails {
  categoryName: string; 
  retentionId: number; 
  hours: number;
}

const filterCategory = (arr: Array<any>): Array<SelectedCategoryModel> => {
    let sortedArray: Array<SelectedCategoryModel> = [];
    if (arr && arr.length > 0) {
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

const applyValidation = (arg: Array<FormInitialValues>) => {
    const Initial_Values_Validation_Schema = [];
    for (const field of arg) {
        let validationObject: any;
        if (
            IsFieldtypeEquals(field.fieldType, FieldTypes.FieldTextBoxType) ||
            IsFieldtypeEquals(field.fieldType, FieldTypes.FieldTextAreaType)
        ) {
            if (field.isRequired)
                validationObject = Yup.string().max(1024, 'Maximum_lenght_is_1024').required('required');
            else validationObject = Yup.string().max(1024, 'Maximum_lenght_is_1024').notRequired();
        } else if (IsFieldtypeEquals(field.fieldType, FieldTypes.FieldDropDownListType)) {
            if (field.isRequired) validationObject = Yup.string().required('required');
            else validationObject = Yup.string().notRequired();
        } else if (IsFieldtypeEquals(field.fieldType, FieldTypes.FieldCheckedBoxType)) {
            if (field.isRequired) validationObject = Yup.string().oneOf(['true'], 'required').required('required');
            else validationObject = Yup.string().notRequired();
        } else if (IsFieldtypeEquals(field.fieldType, FieldTypes.FieldCheckedBoxListType)) {
            if (field.isRequired) validationObject = Yup.string().required('required');
            else validationObject = Yup.string().notRequired();
        } else if (IsFieldtypeEquals(field.fieldType, FieldTypes.FieldRadioButtonListType)) {
            if (field.isRequired) validationObject = Yup.string().required('required');
            else validationObject = Yup.string().notRequired();
        } else if (IsFieldtypeEquals(field.fieldType, FieldTypes.CaseNO)) {
            if (field.isRequired) validationObject = Yup.string().required('required');
            else validationObject = Yup.string().notRequired();
        } else if (IsFieldtypeEquals(field.fieldType, FieldTypes.PolygraphLogNumber)) {
            if (field.isRequired) validationObject = Yup.string().required('required');
            else validationObject = Yup.string().notRequired();
        } else if (IsFieldtypeEquals(field.fieldType, FieldTypes.CADID)) {
            if (field.isRequired) validationObject = Yup.string().required('required');
            else validationObject = Yup.string().notRequired();
        }
        Initial_Values_Validation_Schema.push({ key: field.key, value: validationObject });
    }
    const reducedFormSchema = Initial_Values_Validation_Schema.reduce(
        (obj, item: any) => ({ ...obj, [item.key]: item.value }),
        {}
    );
    return Yup.object({
        ...reducedFormSchema
    });
}

const IsFieldtypeEquals = (field: any, fieldType: FieldTypes): boolean => {
    if (field.type == fieldType || field.dataType == fieldType || field == fieldType)
        return true;
    return false;
}

const RemapFormFieldKeyName = (formsCollection: Array<any>, categoryId: number): Array<any> => {
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
                              name: `${field.name}|${form.id ?? form.formId}|${categoryId}`
                          };
                } else {
                    return field.key.includes('|')
                        ? {
                              ...field
                          }
                        : {
                              ...field,
                              key: `${field.key}|${form.id ?? form.formId}|${categoryId}`
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

const MapSetupCategoryFormToEvidenceCategoryForm = (setupCategories: Array<SetupConfigurationsModel.Category>, evidenceCategories: Array<Category>): Array<any> => {
    const categoryArray: any = [];
    for (const evidenceCategory of evidenceCategories) {
        const setupCategory = setupCategories.find((x) => x.name === evidenceCategory.name);
        if (setupCategory) {
            const formCollection: any[] = [];
            for (const evidenceForm of evidenceCategory.formData) {
                const setupCategoryForm = setupCategory.forms.find((o) => o.id.toString() === evidenceForm.formId.toString());
                if (setupCategoryForm) {
                    const remapedFields = evidenceForm.fields.map((field) => {
                        const setupCategoryFields = setupCategoryForm?.fields.find((x) => x.name === field.key);
                        const fieldsPropFetchedFromSetupCategory = {
                            defaultFieldValue: setupCategoryFields?.defaultFieldValue,
                            display: setupCategoryFields?.display,
                            isRequired: setupCategoryFields?.isRequired
                        };
                        return {
                            ...field,
                           ...fieldsPropFetchedFromSetupCategory
                        };
                    });
                    formCollection.push({ ...evidenceForm, fields:  remapedFields});
                }
            }
            categoryArray.push({ ...evidenceCategory, formData: formCollection });
        }
    }
    return categoryArray;
};

const instanceOfEvdenceCategoryAssignment = (anonymousObject: any): anonymousObject is EvdenceCategoryAssignment => {
  return (anonymousObject as EvdenceCategoryAssignment).assignedCategories !== undefined;
}

const GetResponseToUpdateAssetBucketCategory = (body: Array<EvdenceCategoryAssignment> | Array<EvidenceCategory>, setupCategories: Array<SetupConfigurationsModel.Category>, previouslyAttachedCategories?: Array<string>) => {
    const assetCategories: Array<AssetCategoryObject> = [];
    for (const o of body) {
        const assetCategory: AssetCategoryObject = {
            evidenceId: o.evidenceId,
            categories: []
        };
        if (instanceOfEvdenceCategoryAssignment(o)) {
            if (o.assignedCategories.length > 0) {
                const categoriesName = setupCategories
                    .filter((s: any) => o.assignedCategories.some((e: any) => s.id === e.id))
                    .map((i: any) => i.name) as Array<string>;
                
                assetCategory.categories.push(...categoriesName);
            }
            if (o.updateCategories.length > 0) {
                const categoriesName = setupCategories
                    .filter((s: any) => o.updateCategories.some((e: any) => s.id === e.id))
                    .map((i: any) => i.name) as Array<string>;
                assetCategory.categories.push(...categoriesName);
            }
            if (o.unAssignCategories.length > 0) {
                previouslyAttachedCategories && assetCategory.categories.push(...previouslyAttachedCategories);
            }
        }
        else if(previouslyAttachedCategories){
            assetCategory.categories.push(...previouslyAttachedCategories)
        } 
        else {
          const categoriesName = setupCategories
              .filter((s: any) => o.categories.some((e: any) => s.id === e.id))
              .map((i: any) => i.name) as Array<string>;
          assetCategory.categories.push(...categoriesName);
        }
        assetCategories.push(assetCategory);
    }
    return assetCategories;
}

const GetPreviouslyAttachedCategories = (asset: any, unAssignCategory: Category, setupCategories: Array<SetupConfigurationsModel.Category>, isSignleSelectCase: boolean) : Array<string> => {
    const _unAssignCategory = setupCategories.find((x) => x.id == unAssignCategory.id);
    const previousAttachedCategories = asset.categories;
    if (isSignleSelectCase) {
        const afterUnAssignedAttachedCategories = previousAttachedCategories.filter(
            (x: any) => x.name != _unAssignCategory?.name
        );
        const categoriesName = afterUnAssignedAttachedCategories.map((x: any) => x.name);
        return categoriesName;
    } else {
        const afterUnAssignedAttachedCategories = previousAttachedCategories.filter(
            (x: any) => x != _unAssignCategory?.name
        );
        return afterUnAssignedAttachedCategories;
    }
}


const CalculateCategoryRetentionDetail = (selectedCategoriesObject: Array<any>) : {retentionList: string, retentionDetails : Array<categoryretentionDetails>} => {
    let retentionList = '';
    let count = 0;
    const retentionDetails: Array<categoryretentionDetails> = [];
    for (const i of selectedCategoriesObject) {
        retentionList += selectedCategoriesObject.length !== count + 1 ? `PolicyIDList=${i.policies.retentionPolicyId}&` : `PolicyIDList=${i.policies.retentionPolicyId}`;
        retentionDetails.push({
          categoryName: i.name,
          retentionId: i.policies.retentionPolicyId,
          hours: 0
        });
        count++;
      }
      return {
        retentionList : retentionList,
        retentionDetails : retentionDetails
      };
}

const CreateCategoryFormObjectCollection = (categoryCollection: any[], isWithForm : boolean, initialValuesOfFormForFormik : any, callingFrom : CategoryScenarioCallingFrom) : Array<any> => {
    const _categoryCollection: any[] = [];
    for (const category of categoryCollection) {
      const categoryId = category.id;
      const categoryName = category.name;
      const categoryFormCollection: any[] = [];
      if (isWithForm) {
        for (const form of category.form) {
          const fieldsArray = [];
          for (const field of form.fields) {
            const formFields = Object.entries(initialValuesOfFormForFormik).map((o: any) => {
              return {
                key: o[0],
                value: o[1]
              };
            });
            const searchBy = field.hasOwnProperty('key') ? field.key : field.name;
            const value = formFields.find((x: any) => x.key == searchBy)?.value;
            fieldsArray.push({
                key: RevertKeyName(field.key ?? field.name),
                value: value,
                dataType: field.type ?? field.dataType,
                defaultFieldValue: field.defaultFieldValue
            });
          }
          categoryFormCollection.push({
            formId: form.formId ?? form.id,
            fields: fieldsArray
          });
        }
      }
      callingFrom === CategoryScenarioCallingFrom.AddAssetMetaData
          ? _categoryCollection.push({
                id: categoryId,
                name: categoryName,
                retentionId: category.retentionId,
                formData: categoryFormCollection
            })
          : _categoryCollection.push({
                id: categoryId,
                name: categoryName,
                formData: categoryFormCollection,
                assignedOn: moment().format('YYYY-MM-DDTHH:mm:ss'),
                type: category.type
            });
    }
    return _categoryCollection;
}

const CategoryLog = (dispatch: any, body: Array<EvdenceCategoryAssignment> | Array<EvidenceCategory>, reason: string, method: string) => {
    body.forEach(async (x: EvdenceCategoryAssignment | EvidenceCategory) =>
    {
        let text = "Category Added: "
        let text1 = "";
        let isEvdenceCategoryAssignment = await instanceOfEvdenceCategoryAssignment(x);
        if(isEvdenceCategoryAssignment){
            let obj : EvdenceCategoryAssignment = JSON.parse(JSON.stringify(x));
            obj.assignedCategories.forEach((y: Category) => {
                text1 = y.name;
                y.formData.forEach((z: FormData) => {
                    z.fields.forEach((fieldData: any) => {
                        text1 = text1 + ', ' + fieldData.key + ': ' + fieldData.value;
                    });
                });
            });
            text = text + text1;
            if (obj.assignedCategories.length > 0) {
                let assetLog: AssetLog = {
                    action: 'Add',
                    notes: text,
                    auditTableNamesEnum: AuditTableNames.EvidenceAsset
                };
                let assetLogType: AssetLogType = { evidenceId: obj.evidenceId, assetId: 0, assetLog: assetLog };
                dispatch(addAssetLog(assetLogType));
            }

            text = "Category Form Edited: "
            text1 = "";
            obj.updateCategories.forEach((y: Category) => {
                text1 = y.name;
                y.formData.forEach((z:FormData)=> {
                    z.fields.forEach((fieldData:any)=> {
                        text1 = text1+", "+  fieldData.key + ": "+fieldData.value
                    })
                })
            });
            text = text + text1 +", Edit Reason: "+reason+"";
            if(obj.updateCategories.length > 0){
                let assetLog : AssetLog = { action : "Update", notes : text, auditTableNamesEnum :  AuditTableNames.EvidenceAsset};
                let assetLogType : AssetLogType = { evidenceId : obj.evidenceId, assetId : 0, assetLog : assetLog};
                dispatch(addAssetLog(assetLogType));
            }

            obj.unAssignCategories.forEach((y: Category) => {
                let assetLog : AssetLog = { action : "Delete", notes : "Category Removed: "+y.name+", Removal Reason: "+reason+"", auditTableNamesEnum :  AuditTableNames.EvidenceAsset};
                let assetLogType : AssetLogType = { evidenceId : obj.evidenceId, assetId : 0, assetLog : assetLog};
                dispatch(addAssetLog(assetLogType));
            })
        }
        else{
            let obj : EvidenceCategory = JSON.parse(JSON.stringify(x));
            if(method == "add"){
                obj.categories.forEach((y: Category) => {
                    text1 = y.name;
                    y.formData.forEach((z: FormData) => {
                        z.fields.forEach((fieldData: any) => {
                            text1 = text1 + ', ' + fieldData.key + ': ' + fieldData.value;
                        });
                    });
                });
                text = text + text1;
                if (obj.categories.length > 0) {
                    let assetLog: AssetLog = {
                        action: 'Add',
                        notes: text,
                        auditTableNamesEnum: AuditTableNames.EvidenceAsset
                    };
                    let assetLogType: AssetLogType = { evidenceId: obj.evidenceId, assetId: 0, assetLog: assetLog };
                    dispatch(addAssetLog(assetLogType));
                }
            }
            else if(method == "remove"){
                obj.categories.forEach((y: Category) => {
                    let assetLog : AssetLog = { action : "Delete", notes : "Category Removed: "+y.name+", Removal Reason: "+reason+"", auditTableNamesEnum :  AuditTableNames.EvidenceAsset};
                    let assetLogType : AssetLogType = { evidenceId : obj.evidenceId, assetId : 0, assetLog : assetLog};
                    dispatch(addAssetLog(assetLogType));
                })
            }
        }
    });
}

export {
    filterCategory,
    applyValidation,
    IsFieldtypeEquals,
    RemapFormFieldKeyName,
    RevertKeyName,
    MapSetupCategoryFormToEvidenceCategoryForm,
    GetResponseToUpdateAssetBucketCategory,
    CalculateCategoryRetentionDetail,
    CreateCategoryFormObjectCollection,
    CategoryScenarioCallingFrom,
    GetPreviouslyAttachedCategories,
    CategoryLog
};
