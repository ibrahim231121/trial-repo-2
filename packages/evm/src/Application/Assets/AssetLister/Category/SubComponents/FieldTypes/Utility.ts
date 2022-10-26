import { FieldCheckedBoxModel, FieldDropDownListModel, FieldRadioButtonListModel } from '../../Model/FieldTypeModels';

const setOptionsFieldDropDownList = (source: Array<any>): Array<FieldDropDownListModel> => {
    const result: Array<FieldDropDownListModel> = [];
    for (let i = 0; i < source.length; i++) {
        result.push({
            id: i + 1,
            label: source[i]
        });
    }
    return result;
};

const setOptionsCheckBoxList = (source: Array<any>): Array<FieldCheckedBoxModel> => {
    const result: Array<FieldCheckedBoxModel> = [];
    for (let i = 0; i < source.length; i++) {
        result.push({
            id: i + 1,
            value: source[i],
            isChecked: false
        });
    }
    return result;
};

const setOptionsRadioButtonList = (source: Array<any>): Array<FieldRadioButtonListModel> => {
    const result: Array<FieldRadioButtonListModel> = [];
    for (let i = 0; i < source.length; i++) {
        result.push({
            label: source[i],
            value: source[i],
            Comp: () => { }
        });
    }
    return result;
};

export { setOptionsFieldDropDownList, setOptionsCheckBoxList, setOptionsRadioButtonList };
