import { Dispatch, SetStateAction } from 'react';
import { Evidence } from '../../../../../utils/Api/models/EvidenceModels';
import { SelectedCategoryModel } from './FormContainerModel';

export type DropdownFormProps = {
    selectedCategoryValues: Array<SelectedCategoryModel>;
    setremoveClassName: any;
    activeForm: number;
    evidence: Evidence | undefined;
    isCategoryEmpty: boolean;
    setSelectedCategoryValues: Dispatch<SetStateAction<Array<SelectedCategoryModel>>>;
    setOpenForm: () => void;
    closeModal: (param: boolean) => void;
    setActiveForm: Dispatch<SetStateAction<number>>;
    setRemovedOption: (param: any) => void;
    setModalTitle: (param: string) => void;
    setIsformUpdated: (param: boolean) => void;
    setIndicateTxt: (param: boolean) => void;
    isMultiSelectAssetHaveSameCategory : boolean;
    selectedItems : any[];
};
