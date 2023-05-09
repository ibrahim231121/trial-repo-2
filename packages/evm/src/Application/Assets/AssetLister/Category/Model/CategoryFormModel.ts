import { Dispatch, SetStateAction } from 'react';
import { Category, Evidence } from '../../../../../utils/Api/models/EvidenceModels';
import { SetupConfigurationsModel } from '../../../../../utils/Api/models/SetupConfigurations';
import { FieldTypes } from './FieldTypes';
import { CategoryRemovalType, SelectedCategoryModel } from './FormContainerModel';
export type CategoryFormProps = {
    selectedCategoryValues: Array<SelectedCategoryModel>;
    setremoveClassName: any;
    activeForm: number;
    isCategoryEmpty: boolean;
    evidence: Evidence | undefined;
    setSelectedCategoryValues: Dispatch<SetStateAction<Array<SelectedCategoryModel>>>;
    closeModal: (param: boolean) => void;
    setActiveForm: Dispatch<SetStateAction<number>>;
    setOpenForm: () => void;
    setModalTitle: (param: string) => void;
    setIsformUpdated: (param: boolean) => void;
    setIndicateTxt: (param: boolean) => void;
    setshowSSticky: (param: boolean) => void;
    setRemovalType: (param: CategoryRemovalType) => void;
    setSelectedItems?: (obj: any) => void;
    categorizedBy: number | null;
    isCategorizedBy: boolean;
    selectedItems : any[];
    isMultiSelectAssetHaveSameCategory : boolean;
};

export enum SubmitType {
    WithForm = 1,
    WithoutForm = 2
}

export type FormInitialValues = {
    key: string;
    value: string;
    fieldType: FieldTypes;
};

export enum FormOperationType {
    Add = 'add',
    Update = 'update',
    MultiSelect = 'multiselect',
    MultiSelectAdd = 'multiselectAdd',
    MultiSelectUpdate = 'multiselectUpdate',
    MultiSelectDelete = 'multiselectDelete'

}
