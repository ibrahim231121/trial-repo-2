import { Dispatch, SetStateAction } from "react";
import { Evidence } from "../../../../../utils/Api/models/EvidenceModels";
import { SelectedCategoryModel } from "./FormContainerModel";

export type SaveConfirmFormProps = {
    removedOption: any;
    setremoveClassName: any;
    evidence : Evidence | undefined;
    differenceOfDays: number;
    removalType: number;
    removeMessage: string;
    holdUntill: string;
    setActiveForm: (param: any) => void;
    setOpenForm: () => void;
    setSelectedCategoryValues: Dispatch<SetStateAction<Array<SelectedCategoryModel>>>;
    closeModal: (param: boolean) => void;
    setRemovedOption: (param: any) => void;
    setModalTitle: (param: string) => void;
    setIndicateTxt: (param: boolean) => void;
    categorizedBy: number | null;
  }

  export interface FormValues { }