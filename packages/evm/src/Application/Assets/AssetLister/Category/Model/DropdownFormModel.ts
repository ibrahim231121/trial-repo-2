export type DropdownFormProps = {
    filterValue: any[];
    setremoveClassName: any;
    activeForm: number;
    evidenceResponse: any;
    isCategoryEmpty: boolean;
    setFilterValue: (param: any) => void;
    setOpenForm: () => void;
    closeModal: (param: boolean) => void;
    setActiveForm: (param: any) => void;
    setRemovedOption: (param: any) => void;
    setModalTitle: (param: string) => void;
    setIsformUpdated: (param: boolean) => void;
    setIndicateTxt: (param: boolean) => void;
};
