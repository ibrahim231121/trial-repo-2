import { Dispatch, SetStateAction } from "react";
import { Evidence } from "../../../../../utils/Api/models/EvidenceModels";
import { SelectedCategoryModel } from "./FormContainerModel";

export type DialogueFormProps = {
    setremoveClassName: any;
    formCollection: any;
    evidence: Evidence | undefined;
    selectedCategoryValues: Array<SelectedCategoryModel>;
    setActiveForm: (param: any) => void;
    setOpenForm: () => void;
    setSelectedCategoryValues: Dispatch<SetStateAction<Array<SelectedCategoryModel>>>;
    closeModal: (param: boolean) => void;
    setModalTitle: (param: string) => void;
    setIndicateTxt: (param: boolean) => void;
    categorizedBy : number | null;
};
