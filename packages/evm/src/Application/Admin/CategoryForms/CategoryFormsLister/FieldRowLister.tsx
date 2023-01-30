
import React from "react";
import "./categoryFormsDetail.scss"
import { FormFieldsTemplate } from "../TypeConstant/types";
import FormFieldRowValue from "./FormFieldRowValue";

type infoProps = {
    selectedFields: FormFieldsTemplate[];
    setSelectedFields: React.Dispatch<React.SetStateAction<FormFieldsTemplate[]>>;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

const FieldRowLister: React.FC<infoProps> = ({ selectedFields, setSelectedFields, setFieldValue }) => {
    return (
        <>
            <div className="crx_add_ex_from_rows">
                <div>
                    {
                        selectedFields?.map((fieldRow, i) => {
                            return <FormFieldRowValue selectedFields={selectedFields} rowField={fieldRow} setSelectedFields={setSelectedFields} setFieldValue={setFieldValue}></FormFieldRowValue>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default FieldRowLister;
