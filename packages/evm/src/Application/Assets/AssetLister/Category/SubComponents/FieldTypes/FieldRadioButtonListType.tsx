import React from 'react';
import { CRXRadio } from '@cb/shared';
import { setOptionsRadioButtonList } from './Utility';

interface FieldRadioButtonListType {
    formikProps: any;
    options: Array<any>;
    setFieldsFunction: (param: any) => void;
}

const FieldRadioButtonListType: React.FC<FieldRadioButtonListType> = ({ formikProps, options, setFieldsFunction }) => {
    const { field, form } = formikProps;
    const [radioValue, setRadioValue] = React.useState<string | null>(null);
    const radioDefaultOptions = setOptionsRadioButtonList(options);
    React.useEffect(() => {
        if (field.value != "")
            setRadioValue(field.value);
    }, []);

    const radioButtonOnChange = (e: React.ChangeEvent<HTMLInputElement>,) => {
        setFieldsFunction({ name: field.name, value: e.target.value });
        form.setFieldValue(field.name, e.target.value, true);
        form.setFieldTouched(field.name, true, false);
    }

    return (
        <CRXRadio
            className='crxEditRadioBtn'
            disableRipple={true}
            content={radioDefaultOptions}
            value={radioValue}
            onChange={radioButtonOnChange}
        />
    );
}

export default FieldRadioButtonListType;