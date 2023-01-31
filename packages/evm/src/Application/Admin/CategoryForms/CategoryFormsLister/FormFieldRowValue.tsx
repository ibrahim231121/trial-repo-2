
import React from "react";
import { CRXRows, CRXColumn, CRXTooltip } from "@cb/shared";
import "./categoryFormsDetail.scss"
import { FormFieldsTemplate } from "../TypeConstant/types";

type infoProps = {
    selectedFields: FormFieldsTemplate[];
    setSelectedFields: React.Dispatch<React.SetStateAction<FormFieldsTemplate[]>>;
    rowField: FormFieldsTemplate;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

const FormFieldRowValue: React.FC<infoProps> = ({ selectedFields, setSelectedFields, rowField, setFieldValue }) => {
    const [row, setRow] = React.useState<FormFieldsTemplate>(rowField);
    const onRemovePermission = (id: number) => {
        let selectedItems = selectedFields.filter(x => x.id !== id);
        setFieldValue("fields", selectedItems.map((x: any) => { return x.id }));
        setSelectedFields(selectedItems);
    }
    React.useEffect(() => {
        setRow(rowField);
    }, [rowField]);

    return (
        <>
            <div className="crx-fields-col">
                <CRXRows container="container" spacing={0}>
                    <CRXColumn className="fieldsCol" container="container" item="item" xs={3} spacing={0}>
                        <label>{rowField?.displayName}</label>
                    </CRXColumn>
                    <CRXColumn className="fieldsCol" container="container" item="item" xs={3} spacing={0}>
                        <label>{rowField?.name}</label>
                    </CRXColumn>
                    <CRXColumn className="fieldsCol" container="container" item="item" xs={3} spacing={0}>
                        <label>{rowField?.controlType}</label>
                    </CRXColumn>
                    <CRXColumn className="fieldsCol" container="container" item="item" xs={2} spacing={0}>
                        <label>{rowField?.isRequired.toString() == "true" ? "Yes" : "No"}</label>
                    </CRXColumn>
                    <CRXColumn className="crx-fieldsCol-btn" container="container" item="item" xs={1} spacing={0} >
                        <button
                            className="removeBtn"
                            onClick={() => onRemovePermission(rowField?.id)}
                        ><CRXTooltip iconName="fas fa-circle-minus" arrow={false} title="remove" placement="bottom" className="crxTooltipNotificationIcon" /></button>

                    </CRXColumn>
                </CRXRows>
            </div>
        </>
    )
}

export default FormFieldRowValue;
