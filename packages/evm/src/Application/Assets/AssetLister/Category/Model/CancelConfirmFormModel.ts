export type CancelConfirmFormProps = {
    isCategoryEmpty: boolean;
    setremoveClassName: any;
    removedOption: any;
    previousActive: number;
    setActiveForm: (param: any) => void;
    setOpenForm: () => void;
    setFilterValue: (param: any) => void;
    closeModal: (param: boolean) => void;
    setRemovedOption: (param: any) => void;
    setIsformUpdated: (param: boolean) => void;
    setIndicateTxt: (param: boolean) => void;
    setModalTitle: (param: string) => void;
};

export interface FormValues {}
