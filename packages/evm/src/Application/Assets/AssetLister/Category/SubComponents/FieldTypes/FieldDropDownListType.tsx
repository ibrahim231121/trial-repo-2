import React from "react";
import { CRXMultiSelectBoxLight } from "@cb/shared";
import { setOptionsFieldDropDownList } from "./Utility";
import { FieldDropDownListModel } from "../../Model/FieldTypeModels";

type FieldDropDownListType = {
    formikProps: any;
    options: Array<any>;
    setFieldsFunction: (param: any) => void;
}

const FieldDropDownListType: React.FC<FieldDropDownListType> = ({ formikProps, options, setFieldsFunction }) => {
    const { field, form } = formikProps;
    const [dropdownValue, setDropdownValue] = React.useState<FieldDropDownListModel | null>(null);

    React.useEffect(() => {
        if (options.length > 0 && field.value !== "") {
            const result = setOptionsFieldDropDownList(options).find((x) => x.label === field.value);
            result && setDropdownValue(result);
        }
    }, []);

    const handleChange = (e: any, value: any) => {
        e.preventDefault();
        const selectedValue = value == null ? "" : value.label;
        form.setFieldValue(field.name, selectedValue, true);
        form.setFieldTouched(field.name, true, false);
        setFieldsFunction({ name: field.name, value: selectedValue });
    }

    return (
        <CRXMultiSelectBoxLight
            id="categoryFormMultiSelect"
            name={field.name}
            multiple={false}
            value={dropdownValue}
            options={setOptionsFieldDropDownList(options)}
            onChange={(e: any, value: any) => handleChange(e, value)}
            CheckBox={false}
            checkSign={false}
        />
    );
}

export default FieldDropDownListType;