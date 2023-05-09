import { Dispatch, SetStateAction } from "react";
import { Evidence } from "../../../../../utils/Api/models/EvidenceModels";
import { CategoryRemovalType, SelectedCategoryModel } from "./FormContainerModel";

export type SaveConfirmFormProps = {
    removedOption: any;
    setremoveClassName: any;
    evidence : Evidence | undefined;
    differenceOfRetentionTime: string;
    removalType: CategoryRemovalType;
    removeMessage: string;
    holdUntill: string;
    setActiveForm: (param: any) => void;
    setOpenForm: () => void;
    setSelectedCategoryValues: Dispatch<SetStateAction<Array<SelectedCategoryModel>>>;
    closeModal: (param: boolean) => void;
    setRemovedOption: (param: any) => void;
    setModalTitle: (param: string) => void;
    setIndicateTxt: (param: boolean) => void;
    setSelectedItems?: (obj: any) => void;
    categorizedBy: number | null;
    isCategorizedBy : boolean;
    selectedItems : any[];
  }

  export interface FormValues { }