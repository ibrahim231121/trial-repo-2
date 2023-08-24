import React from 'react';
import { CRXCheckBox } from '@cb/shared';

interface FieldCheckedBoxType {
    formikProps: any;
    setFieldsFunction: (param: any) => void;
}
const FieldCheckedBoxType: React.FC<FieldCheckedBoxType> = ({ formikProps, setFieldsFunction }) => {
    const { field, form } = formikProps;
    const [isChecked, setIsChecked] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (field.value != '') {
            const boolOutput = (field.value === 'true');
            setIsChecked(boolOutput);
        }
    }, []);
    const handleChange = (e: any) => {
        form.setFieldValue(field.name, e.target.checked.toString(), true);
        form.setFieldTouched(field.name, true, false);
        setFieldsFunction({ name: field.name, value: e.target.checked.toString() });
    }
    return (
        <CRXCheckBox
            checked={isChecked}
            lightMode={true}
            className='crxCheckBoxCreate '
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
    );
}

export default FieldCheckedBoxType;