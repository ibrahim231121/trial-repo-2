import * as Yup from 'yup';

const regex = /^[a-zA-Z0-9]+[a-zA-Z0-9\b]*$/;
const regex_PhoneNumber = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
const regexForNumberOnly = new RegExp("^[0-9]+$");
export const stationValidationSchema = Yup.object().shape({
    Name: Yup.string().required("Station_Name_is_required"),
    StreetAddress: Yup.string()
      .test(
        'len',
        "Minimum_3_characters_are_allowed.",
        (val) => val != undefined && (val.length == 0 || (val.length >= 3 && val.length <= 128))
      )
      .trim().matches(regex, "Only_alphabets_and_digits_are_allowed.").required("Street_Address_is_required"),
    Passcode: Yup.string()
      .test(
        'len',
        "Minimum_5_characters_are_allowed.",
        (val) => val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
      )
      .trim().matches(regexForNumberOnly, "Only_digits_are_allowed.").required("Pass_Code_is_required"),
    Phone: Yup.string()
      .trim().matches(regex_PhoneNumber, "Phone_Number_is_not_valid!").notRequired(),
    SSId: Yup.string()
      .test(
        'len',
        "Minimum_5_characters_are_allowed.",
        (val) => val === undefined || val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
      )
      .trim().matches(regex, "Only_alphabets_and_digits_are_allowed.").notRequired(),
    Password: Yup.string()
      .test(
        'len',
        "Minimum_5_characters_are_allowed.",
        (val) => val === undefined || val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
      )
      .trim().matches(regex, "Only_alphabets_and_digits_are_allowed.").notRequired(),
    //RetentionPolicy: Yup.string().required("Retention policy is required"),
  });
  