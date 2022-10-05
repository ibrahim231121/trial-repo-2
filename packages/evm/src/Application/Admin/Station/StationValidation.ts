import * as Yup from 'yup';

const regex = /^[a-zA-Z0-9]+[a-zA-Z0-9\b]*$/;
const regex_PhoneNumber = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
const regexForNumberOnly = new RegExp('^[0-9]+$');
export const stationValidationSchema = Yup.object().shape({
    Name: Yup.string().required('Station_Name_is_required'),
    Passcode: Yup.string()
        .test(
            'len',
            'Minimum_5_characters_are_allowed.',
            (val) => val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
        )
        .trim()
        .matches(regexForNumberOnly, 'Only_digits_are_allowed.')
        .required('Pass_Code_is_required'),
    Phone: Yup.string().matches(regex_PhoneNumber, 'Phone_Number_is_not_valid!').nullable().notRequired(),
    SSId: Yup.string().min(5).matches(regex, 'Only_alphabets_and_digits_are_allowed.').nullable().notRequired(),
    Password: Yup.string()
        .min(5)
        .trim()
        .matches(regex, 'Only_alphabets_and_digits_are_allowed.')
        .nullable()
        .notRequired(),
    RetentionPolicy: Yup.object().shape({
        id: Yup.string().required('Retention_Policy_is_required')
    }),
    BlackboxRetentionPolicy: Yup.object().shape({
        id: Yup.string().required('Blackbox_Retention_Policy_is_required')
    }),
    UploadPolicy: Yup.object().shape({
        id: Yup.string().required('Upload_Policy_is_required')
    })
});
