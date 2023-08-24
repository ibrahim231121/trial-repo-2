import React from "react";
import { CRXCheckBox } from "@cb/shared";
import { FieldCheckedBoxModel } from "../../Model/FieldTypeModels";
import { setOptionsCheckBoxList } from "./Utility";

interface FieldCheckedBoxListType {
    formikProps: any;
    options: Array<any>;
    setFieldsFunction: (param: any) => void;
}

const FieldCheckedBoxListType: React.FC<FieldCheckedBoxListType> = ({ formikProps, options, setFieldsFunction }) => {
    const { field, form } = formikProps;
    const [checkBoxSelected, setCheckBoxSelected] = React.useState<FieldCheckedBoxModel[]>(setOptionsCheckBoxList(options));

    React.useEffect(() => {
        if (field.value !== "") {
            const values = [...checkBoxSelected];
            let results: any = [];
            if (field.value.includes(','))
                results = field.value.split(',');
            else
                results.push(field.value);
            for (const i of results) {
                const index = values.findIndex(x => x.value === i);
                values[index].isChecked = true;
            }
            setCheckBoxSelected(values);
        }
    }, []);

    const handleChange = (e: any, index: number) => {
        const { id, value, checked } = e.target;
        const values = [...checkBoxSelected];
        values[index].isChecked = checked;
        let valueToStore = '';
        let checkedTrue = values.filter(x => x.isChecked === true);
        for (let i = 0; i <= checkedTrue.length - 1; i++) {
            valueToStore = valueToStore + checkedTrue[i].value + ','
        }
        const removeComma = valueToStore.slice(0, -1);
        setFieldsFunction({ name: field.name, value: removeComma });
        form.setFieldValue(field.name, removeComma, true);
        form.setFieldTouched(field.name, true, false);
    }

    return (
        <>
            {checkBoxSelected.map((x, index) =>
                <CRXCheckBox
                    id={x.id}
                    name={field.name}
                    value={x.value}
                    checked={x.isChecked}
                    lightMode={true}
                    className='crxCheckBoxCreate '
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                />
            )}
        </>

    );
}

export default FieldCheckedBoxListType;