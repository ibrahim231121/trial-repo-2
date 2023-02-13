export type FormContainerProps = {
    openForm: boolean;
    isCategoryEmpty: boolean;
    evidenceId: number;
    setOpenForm: () => void;
    setIsCategoryEmpty: (param: boolean) => void;
    formActionButton?: React.ReactNode;
    categorizedBy : number | null;
    isCategorizedBy : boolean;
};

export type SelectedCategoryModel = {
    id: string;
    label: string;
};
