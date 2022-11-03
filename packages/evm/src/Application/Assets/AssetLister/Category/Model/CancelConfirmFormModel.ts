import { Dispatch, SetStateAction } from "react";
import { SelectedCategoryModel } from "./FormContainerModel";

export type CancelConfirmFormProps = {
    isCategoryEmpty: boolean;
    setremoveClassName: any;
    removedOption: any;
    previousActive: number;
    setActiveForm: (param: any) => void;
    setOpenForm: () => void;
    setSelectedCategoryValues: Dispatch<SetStateAction<Array<SelectedCategoryModel>>>;
    closeModal: (param: boolean) => void;
    setRemovedOption: (param: any) => void;
    setIsformUpdated: (param: boolean) => void;
    setIndicateTxt: (param: boolean) => void;
    setModalTitle: (param: string) => void;
};

export interface FormValues {}
