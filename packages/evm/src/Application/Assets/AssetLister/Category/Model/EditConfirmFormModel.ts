import { Dispatch, SetStateAction } from "react";
import { Evidence } from "../../../../../utils/Api/models/EvidenceModels";
import { SelectedCategoryModel } from "./FormContainerModel";

export type EditConfirmFormProps = {
    evidence: Evidence | undefined;
    setremoveClassName: any;
    setOpenForm: () => void;
    closeModal: (param: boolean) => void;
    setIsformUpdated: (param: boolean) => void;
    setModalTitle: (param: string) => void;
    setActiveForm: Dispatch<SetStateAction<number>>;
    categorizedBy : number | null;
    isCategorizedBy : boolean;
};

export interface FormValues {
    reason: string;
}
