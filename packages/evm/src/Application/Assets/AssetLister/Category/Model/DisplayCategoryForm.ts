export type DisplayCategoryFormProps = {
    formCollection: any[];
    initialValueObjects: Array<any>;
    validationSchema : any;
    setFieldsFunction: (param: FieldsFunctionType) => void;
};


export type FieldsFunctionType = {
    name : string;
    value : any;
}
