import { ExtendRetention } from '../../../../utils/Api/models/EvidenceModels';

export type ManageRetentionProps = {
    items: any[];
    filterValue: any[];
    //setFilterValue: (param: any) => void;
    rowData: any;
    setOnClose: () => void;
    setRemovedOption: (param: any) => void;
    showToastMsg: (obj: any) => any;
    setIsformUpdated: (param: boolean) => void;
};

export type RetentionModel = {
    value: string;
    label: string;
    Comp: any;
};

export type RetentionFormType = {
    RetentionStatus: RetentionStatusEnum;
    CurrentRetention: string;
    OriginalRetention: string;
    RetentionList: ExtendRetention[];
    RetentionDays: number;
    RetentionOptions: RetentionModel[];
    SaveButtonIsDisable : boolean;
};


export enum RetentionStatusEnum {
    CustomExtention = '1',
    IndefiniteExtention = '2',
    RevertToOriginal = '3'
  }
