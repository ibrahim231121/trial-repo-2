export type EditConfirmFormProps = {
    evidenceResponse: any;
    filterValue: any[];
    setremoveClassName: any;
    setOpenForm: () => void;
    closeModal: (param: boolean) => void;
    setIsformUpdated: (param: boolean) => void;
    setModalTitle: (param: string) => void;
    setActiveForm: (param: number) => void;
  };
  
export interface FormValues {
    reason: string;
  }