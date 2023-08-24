import { Dispatch, SetStateAction } from "react";
import { Evidence } from "../../../../../utils/Api/models/EvidenceModels";
import { CategoryRemovalType, SelectedCategoryModel } from "./CategoryFormContainerModel";

export type RemoveCategoryConfirmFormProps = {
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
    toasterMessages: (param: { message: string, variant: string }) => void;
    categorizedBy: number | null;
    isCategorizedBy : boolean;
    selectedItems : any[];
  }

  export interface FormValues { }