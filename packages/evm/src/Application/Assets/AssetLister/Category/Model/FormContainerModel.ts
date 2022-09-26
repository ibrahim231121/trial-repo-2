export type FormContainerProps = {
    openForm: boolean;
    isCategoryEmpty: boolean;
    rowData: any;
    setOpenForm: () => void;
    setIsCategoryEmpty: (param: boolean) => void;
    formActionButton?: React.ReactNode;
};
