export type FormContainerProps = {
    openForm: boolean;
    isCategoryEmpty: boolean;
    evidenceId: number;
    setOpenForm: () => void;
    setIsCategoryEmpty: (param: boolean) => void;
    setSelectedItems?: (obj: any) => void;
    formActionButton?: React.ReactNode;
    categorizedBy : number | null;
    isCategorizedBy : boolean;
    selectedItems : any[];
};

export type SelectedCategoryModel = {
    id: string;
    label: string;
};

export enum CategoryRemovalType {
    NotEffectingRetentionRemoval = 0,
    HighestRetentionCategoryRemoval = 1,
    LastCategoryRemoval = 2,
    DecreaseAssetRetentionByApplyingCategory = 3,
    HighestRetentionCategoryRemovalInMultiSelect = 4
  }