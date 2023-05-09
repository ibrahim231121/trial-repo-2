import { Dispatch, SetStateAction } from "react";
import { Evidence } from "../../../../../utils/Api/models/EvidenceModels";
import { CategoryRemovalType, SelectedCategoryModel } from "./FormContainerModel";

export type EditConfirmFormProps = {
    evidence: Evidence | undefined;
    setremoveClassName: any;
    setOpenForm: () => void;
    closeModal: (param: boolean) => void;
    setIsformUpdated: (param: boolean) => void;
    setModalTitle: (param: string) => void;
    setActiveForm: Dispatch<SetStateAction<number>>;
    setSelectedItems?: (obj: any) => void;
    categorizedBy : number | null;
    isCategorizedBy : boolean;
    removalType: CategoryRemovalType;
    selectedItems : Array<any>;
    selectedCategoryValues: Array<SelectedCategoryModel>;
    isCategoryEmpty : boolean;
};

export interface FormValues {
    reason: string;
}
