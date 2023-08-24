import { Dispatch, SetStateAction } from 'react';
import { Evidence } from '../../../../../utils/Api/models/EvidenceModels';
import { CategoryRemovalType, SelectedCategoryModel } from './CategoryFormContainerModel';

export type RemoveCategoryFormProps = {
    selectedCategoryValues: Array<SelectedCategoryModel>;
    setremoveClassName: any;
    removedOption: any;
    evidence: Evidence | undefined;
    setActiveForm: Dispatch<SetStateAction<number>>;
    setOpenForm: () => void;
    setSelectedCategoryValues: Dispatch<SetStateAction<Array<SelectedCategoryModel>>>;
    closeModal: (param: boolean) => void;
    setDifferenceOfRetentionTime: (param: string) => void;
    setRemovedOption: (param: any) => void;
    setIsformUpdated: (param: boolean) => void;
    setModalTitle: (param: string) => void;
    setRemovalType: (param: CategoryRemovalType) => void;
    setRemoveMessage: (param: string) => void;
    setHoldUntill: (param: string) => void;
    setIndicateTxt: (param: boolean) => void;
    selectedItems : any[];
};

export interface FormValues {}

export type RetentionDetailForCalculation = {
    categoryName: string;
    retentionId: number;
    hours: number;
};
