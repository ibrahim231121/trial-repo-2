export type SaveConfirmFormProps = {
    removedOption: any;
    setremoveClassName: any;
    evidenceResponse : any;
    differenceOfDays: number;
    removalType: number;
    removeMessage: string;
    holdUntill: string;
    setActiveForm: (param: any) => void;
    setOpenForm: () => void;
    setFilterValue: (param: any) => void;
    closeModal: (param: boolean) => void;
    setRemovedOption: (param: any) => void;
    setModalTitle: (param: string) => void;
    setIndicateTxt: (param: boolean) => void;
  }

  export interface FormValues { }