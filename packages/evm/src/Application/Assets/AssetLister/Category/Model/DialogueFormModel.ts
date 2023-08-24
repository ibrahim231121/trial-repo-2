import { Dispatch, SetStateAction } from "react";
import { Evidence } from "../../../../../utils/Api/models/EvidenceModels";
import { SelectedCategoryModel } from "./CategoryFormContainerModel";

export type DialogueFormProps = {
    setremoveClassName: any;
    formCollection: any;
    evidence: Evidence | undefined;
    selectedItems : any[];
    selectedCategoryValues: Array<SelectedCategoryModel>;
    setActiveForm: (param: any) => void;
    setOpenForm: () => void;
    setSelectedCategoryValues: Dispatch<SetStateAction<Array<SelectedCategoryModel>>>;
    closeModal: (param: boolean) => void;
    setModalTitle: (param: string) => void;
    setIndicateTxt: (param: boolean) => void;
    toasterMessages: (param: { message: string, variant: string }) => void;
    categorizedBy : number | null;
    isCategorizedBy : boolean;
};


export type CategoryRequest = {
    assignedCategory: Array<SelectedCategoryModel>,
    updatedCategory: Array<SelectedCategoryModel>,
    evidenceId: number;
}
