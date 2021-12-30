import { CRXCheckBox } from "@cb/shared";
import { CRXButton } from "@cb/shared";
import { TextField, CRXConfirmDialog, CRXRadio, CRXToaster } from "@cb/shared";
import { url } from "inspector";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { AUTHENTICATION_EMAIL_SERVICE, GROUP_USER_LIST, USER } from "../../../../utils/Api/url";
import { EditableSelect, CRXMultiSelectBoxLight } from "@cb/shared";
import useGetFetch from "../../../../utils/Api/useGetFetch";
import { DateFormat } from "../../../../utils/globalDataTableFunctions"
import { CRXAlert } from "@cb/shared";
import moment from "moment";
import { CRXInputDatePicker } from "@cb/shared";
import "./createUserForm.scss";
import constants from "../../../Assets/utils/constants";

let USER_DATA = {};
interface Props {
  onClose: any;
  setCloseWithConfirm: any;
  id?: any;
  showToastMsg : (obj: any) => void
}

type NameAndValue = {
  groupId: string;
  groupName: string;
};

interface userStateProps {
  userName: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userGroups: string[];
  deactivation_Date: string;
}

type account = {
  isAdministrator: number;
  lastLogin: Date;
  passwordDetail: any;
  status: number;
  userName: string;
  password: string;
  isPasswordResetRequired: boolean;
}

const CreateUserForm: React.FC<Props> = ({
  onClose,
  setCloseWithConfirm,
  id,
  showToastMsg
}) => {
  const [error, setError] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState("sendAct");
  const [generatePassword, setGeneratePassword] = React.useState("");
  const [formpayload, setFormPayload] = React.useState<userStateProps>({
    userName: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userGroups: [],
    deactivation_Date: "",
  });

  const [formpayloadErr, setFormPayloadErr] = React.useState({
    userNameErr: "",
    firstNameErr: "",
    middleInitialErr: "",
    lastNameErr: "",
    emailErr: "",
    phoneNumberErr: "",
    userGroupErr: "",
    deactivationDateErr: "",
    passwordErr: "",
    confirmPasswordErr: "",
  });

  const [disableSave, setDisableSave] = React.useState(true);
  const [userGroupsList, setUserGroupsList] = React.useState<NameAndValue[]>();
  const [userPayload, setUserPayload] = React.useState<any>();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [responseError, setResponseError] = React.useState<string>("");
  const [alert, setAlert] = React.useState<boolean>(false);

  const [isPasswordResetRequired, setIsPasswordResetRequired] = React.useState<boolean>(false);

  const [disableLink, setDisableLink] = React.useState(false);
  const toasterRef = useRef<typeof CRXToaster>(null)

 const [ActivationLinkLabel, setActivationLinkLabel] = React.useState<string>('Send Activation Link');


  React.useEffect(() => {
    if (id)
      fetchUser();
  }, [id]);



  React.useEffect(() => {
    if (userPayload && id) {
      const {
        email,
        name: { first: firstName, last: lastName, middle: middleInitial },
        account: { userName },
        contacts,
        userGroups,
        deactivation_Date
      } = userPayload;

      const phoneNumber =
        userPayload.contacts.length > 0
          ? userPayload.contacts.find((x: any) => x.contactType === 1).number
          : "";

      const userGroupNames = userGroups?.map((x: any) => x.groupName);

      USER_DATA = {
        userName,
        firstName,
        middleInitial,
        lastName,
        email,
        phoneNumber: "",
        userGroups: [],
        deactivation_Date: "",
      };
      setFormPayload({
        ...formpayload,
        email,
        userName,
        firstName,
        middleInitial,
        lastName,
        phoneNumber,
        deactivation_Date,
        userGroups: userGroupNames,

      });
      setActivationLinkLabel('Resend Activation Link');
      setRadioValue("");
    }
  }, [userPayload]);


  var current_date
  if (formpayload.deactivation_Date != null) {
    current_date = formpayload.deactivation_Date.split("Z")[0];
  }


  const minStartDate = () => {
    var currentDate = new Date();
    var mm = '' + (currentDate.getMonth() + 1);
    var dd = '' + currentDate.getDate();
    var yyyy = currentDate.getFullYear();

    if (mm.length < 2)
      mm = '0' + mm;
    if (dd.length < 2)
      dd = '0' + dd;
    return [yyyy, mm, dd].join('-') + "T00:00:00";
  }

  const fetchUser = async () => {
    const res = await fetch(`${USER}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "TenantId": "1" },
    });
    var response = await res.json();
    setUserPayload(response);
  };

  const generateTempPassComp = () => {
    const onClickPass = () => {
      var chars =
        "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var passwordLength = 12;
      var password = "";
      for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
      }
      setGeneratePassword(password);
    };
    return (
      <>
        <div className="crx-Generate-pass">
          <div className="crxGeneratePassword">
            <CRXButton className="primary" onClick={onClickPass}>
              Generate
            </CRXButton>
            <TextField className="crx-generate-btn" value={generatePassword} />
          </div>
          <div style={{ textAlign: "right" }}>
            <button
              className="copyButton"
              onClick={() => {
                navigator.clipboard.writeText(generatePassword);
              }}
            >
              Copy
            </button>
          </div>


          <div className="crx-requird-check">
            <CRXCheckBox
              checked={isPasswordResetRequired}
              lightMode={true}
              className="crxCheckBoxCreate "
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIsPasswordResetRequired(e.target.checked)
              }
            />
            <label>Require user to change password on next login</label>
          </div>
        </div>
      </>
    );
  };

  const manuallyGeneratePass = () => {
    return (
      <div className="crx-manually-generate-pass">
        <TextField
          className="crx-gente-field"
          error={!!formpayloadErr.passwordErr}
          errorMsg={formpayloadErr.passwordErr}
          label="Password"
          type="password"
          required={true}
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          onBlur={checkPassword}
        />
        <TextField
          className="crx-gente-field"
          error={!!formpayloadErr.confirmPasswordErr}
          errorMsg={formpayloadErr.confirmPasswordErr}
          label="Confirm Password"
          required={true}
          type="password"
          value={confirmPassword}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
          onBlur={checkConfirmPassword}
        />
        <div className="crx-requird-check">
          <CRXCheckBox
            checked={isPasswordResetRequired}
            lightMode={true}
            className="crxCheckBoxCreate "
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIsPasswordResetRequired(e.target.checked)
            }
          />
          <label>Require user to change password on next login</label>
        </div>
      </div>
    );
  };

  const content = [
    {
      label: ActivationLinkLabel,
      // label: "Send Activation Link",
      value: "sendAct",
      Comp: () => sendActivationLink(),
    },
    {
      label: "Generate Temporary Password",
      value: "genTemp",
      Comp: () => generateTempPassComp(),
    },
    {
      label: "Manually Set Password",
      value: "manual",
      Comp: () => manuallyGeneratePass(),
    },
  ];

  const fetchGroups = async () => {
    const res = await fetch(GROUP_USER_LIST, {
      method: "GET",
      headers: { "Content-Type": "application/json", TenantId: "1" },
    });
    var response = await res.json();
    var groupNames = response.map((x: any) => {
      let j: NameAndValue = {
        groupId: x.id,
        groupName: x.name,
      };
      return j;
    });
    groupNames = groupNames.sort(function (a: any, b: any) {
      return a.groupName.localeCompare(b.groupName);
    });
    setUserGroupsList(groupNames);
    sendOptionList(groupNames)
  };

  const [optionList, setOptionList] = useState<any>([]);
  const sendOptionList = (data : any[]) => {
    const dateOfArry : any = [];
    data?.map((item, index) => {
      dateOfArry.push ({
        id : item.groupId,
        label : item.groupName
      })
    })
    return setOptionList(dateOfArry);
  }

  React.useEffect(() => {
    setCloseWithConfirm(false);
    fetchGroups();
  }, []);

  React.useEffect(() => {
    const {
      userName,
      firstName,
      middleInitial,
      lastName,
      email,
      userGroups,
      deactivation_Date,
      phoneNumber
    } = formpayload;
    if (userGroups.length > 0) {
      setError(false);
    }
    if (
      userName ||
      firstName ||
      lastName ||
      email ||
      userGroups.length ||
      deactivation_Date
    ) {
      setCloseWithConfirm(true);
    }
    if (JSON.stringify(formpayload) === JSON.stringify(USER_DATA)) {
      setDisableSave(true);
      setCloseWithConfirm(false);
    } else if (userName && firstName && lastName && email && middleInitial && phoneNumber) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }

  }, [formpayload]);

  const setAddPayload = () => {
    let userGroupsListIDs = userGroupsList
      ?.filter((item: any) => {
        return formpayload.userGroups.some((e: any) => e === item.groupName);
      })
      .map((i: any) => i.groupId);

    const name = {
      first: formpayload.firstName,
      last: formpayload.lastName,
      middle: formpayload.middleInitial,
    };

    let contacts = [];
    if (contacts.length === 0) {
      contacts.push({ contactType: 1, number: formpayload.phoneNumber });
    }

    const account: account = {
      isAdministrator: 1,
      status: 1,
      userName: formpayload.userName,
      password: onSelectPasswordType(),
      isPasswordResetRequired,
      lastLogin: moment().toDate(),
      passwordDetail: null,
    };

    const payload = {
      email: formpayload.email,
      deactivation_Date: formpayload.deactivation_Date,
      name,
      account,
      contacts,
      assignedGroupIds: userGroupsListIDs,
      timeZone: "America/Chicago",
    };

    return payload
  }

  const onAdd = async () => {
    if (formpayload.userGroups.length === 0) {
      setError(true);
      return;
    }

    const payload = setAddPayload()
    await fetch(USER, {
      method: "POST",
      headers: { "Content-Type": "application/json", TenantId: "1" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (res.ok) return res.json();
        else if (res.status == 500) {
          setAlert(true);
          setResponseError("We're sorry. The form was unable to be saved. Please retry or contact your System Administrator.");
        }
        else return res.text();
      })
      .then((resp) => {
        if (resp !== undefined) {
          let error = JSON.parse(resp);
          if (error.errors !== undefined) {
            if (
              error.errors.Middle !== undefined &&
              error.errors.Middle.length > 0
            ) {
              setAlert(true);
              setResponseError(error.errors.Middle[0]);
            }
            if (
              error.errors.Email !== undefined &&
              error.errors.Email.length > 0
            ) {
              setAlert(true);
              setResponseError(error.errors.Email[0]);
            }
            if (
              error.errors.Number !== undefined &&
              error.errors.Number.length > 0
            ) {
              setAlert(true);
              setResponseError(error.errors.Number[0]);
            }

            if (
              error.errors.Password !== undefined &&
              error.errors.Password.length > 0
            ) {
              setAlert(true);
              setResponseError(error.errors.Password[0]);
            }
          } else if (!isNaN(+error)) {
            const userName = formpayload.firstName + " " + formpayload.lastName;
            sendEmail(formpayload.email, parseInt(error), userName);
            showToastMsg({ message: "You have created the user account.", variant: "success", duration: 7000 });
            onClose();
          } else {
            setAlert(true);
            setResponseError(error);
          }
        }
      })
      .catch(function (error) {
        return error;
      });
  };

  const onSelectPasswordType = () => {
    if (radioValue === "genTemp") return generatePassword;
    else if (radioValue === "manual") return password;
    else return "hello123456789";
  };

  const setEditPayload = () => {
    let userGroupsListIDs = userGroupsList
      ?.filter((item: any) => {
        return formpayload.userGroups.some((e: any) => e === item.groupName);
      })
      .map((i: any) => i.groupId);

    const name = {
      first: formpayload.firstName,
      last: formpayload.lastName,
      middle: formpayload.middleInitial,
    };

    let contacts = userPayload.contacts.map((x: any) => {
      if (x.contactType === 1) {
        x.number = formpayload.phoneNumber;
      }
      return x;
    });

    const account = { ...userPayload.account, userName: formpayload.userName };
    if (contacts.length === 0) {
      contacts.push({ contactType: 1, number: formpayload.phoneNumber });
    }

    const payload = {
      ...userPayload,
      email: formpayload.email,
      deactivation_Date: formpayload.deactivation_Date,
      name,
      account,
      contacts,
      assignedGroupIds: userGroupsListIDs,
      timeZone: "America/Chicago",
    };

    return payload
  }

  const onEdit = async () => {
    if (formpayload.userGroups.length === 0) {
      setError(true);
      return;
    }

    const urlEdit = USER + "/" + `${id}`;

    const payload = setEditPayload()

    await fetch(urlEdit, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "TenantId": "1" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (res.ok) {
          if (disableLink) {
            const userName = userPayload.name.first + ' ' + userPayload.name.last;
            sendEmail(payload.email, userPayload.id, userName);
            showToastMsg({ message: "You have resent the activation link.", variant: "success", duration: 7000 });
          }
          onClose();
          showToastMsg({ message: "You have updated the user account.", variant: "success", duration: 7000 });
        }
        else if (res.status == 500) {
          setAlert(true);
          setResponseError("We're sorry. The form was unable to be saved. Please retry or contact your System Administrator.");
        }
        else
          return res.text();
      })
      .then((resp) => {
        if (resp !== undefined) {
          let error = JSON.parse(resp);

          if (error.errors !== undefined) {
            if (
              error.errors.Email !== undefined &&
              error.errors.Email.length > 0
            ) {
              setAlert(true);
              setResponseError(error.errors.Email[0]);
            }
            if (
              error.errors.Number !== undefined &&
              error.errors.Number.length > 0
            ) {
              setAlert(true);
              setResponseError(error.errors.Password[0]);
            }
            if (
              error.errors.Password !== undefined &&
              error.errors.Password.length > 0
            ) {
              setAlert(true);
              setResponseError(error.errors.Password[0]);
            }
          } else {
            setAlert(true);
            setResponseError(error);
          }
        }
      })
      .catch(function (error) {
        return error;
      });
  };

  const onSubmit = async (e: any) => {
    setResponseError("");
    setAlert(false);
    if (id) await onEdit();
    else {
      await onAdd();
    }
  };

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const checkEmail = () => {
    const isEmailValid = validateEmail(formpayload.email);

    if (!formpayload.email) {
      setFormPayloadErr({
        ...formpayloadErr,
        emailErr: "Email is required",
      });
    } else if (!isEmailValid) {
      setFormPayloadErr({
        ...formpayloadErr,
        emailErr: "Please provide a valid email address",
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, emailErr: "" });
    }
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return re.test(String(password).toLowerCase());
  };

  const checkPassword = () => {
    const isPasswwordValid = validatePassword(password);

    if (!password) {
      setFormPayloadErr({
        ...formpayloadErr,
        passwordErr: "Password is required",
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, passwordErr: "" });
    }
  };

  const checkConfirmPassword = () => {
    if (!confirmPassword) {
      setFormPayloadErr({
        ...formpayloadErr,
        confirmPasswordErr: "Confirm Password is required",
      });
    } else if (password !== confirmPassword) {
      setFormPayloadErr({
        ...formpayloadErr,
        confirmPasswordErr: "Passwords are not same",
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, confirmPasswordErr: "" });
    }
  };

  const sendEmail = (
    email: string,
    clientId: number,
    applicationName: string
  ) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        TenantId: "1",
      },
    };
    const url = `${AUTHENTICATION_EMAIL_SERVICE}?email=${email}&client_id=${clientId}&applicationName=${applicationName}`;
    fetch(url, requestOptions);
  };

  const sendActivationLink = () => {
    const linkClick = () => {
      setDisableLink(true);
    };
    return (
      <>
        {userPayload && (
          <div className="crxCreateEditFormActivationLink">
          <div className="crxActivationLink">
            <CRXButton
              className="secondary"
              onClick={linkClick}
              disabled={disableLink}
            >
              Resend Activation Link
            </CRXButton>
            <label>(Link will be sent after saving this form.)</label>
          </div>
          </div>
        )}
      </>
    );
  };


  const validatePhone = (phoneNumber: string) => {
    const re =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{1,4})[-. ]*(\d{4})?(?: *x(\d+))?\s*$/;
    return re.test(String(phoneNumber));
  }

  // const checkPhoneumber = () => {
  //   const isPhoneValidate = validatePhone(formpayload.phoneNumber);
  //   if (!formpayload.phoneNumber) {
  //     setFormPayloadErr({ ...formpayloadErr, phoneNumberErr: "Phone number required" });
  //   }

  const checkPhoneumber = () => {
    const isPhoneValidate = validatePhone(formpayload.phoneNumber);
    if (!formpayload.phoneNumber) {
      setFormPayloadErr({ ...formpayloadErr, phoneNumberErr: "" });
    }
    else if (!isPhoneValidate) {
      setFormPayloadErr({
        ...formpayloadErr,
        phoneNumberErr: "Please provide a valid phone number",
      });
    }
    else {
      setFormPayloadErr({ ...formpayloadErr, phoneNumberErr: "" });
    }
  };


  const checkMiddleInitial = () => {
    if (!formpayload.middleInitial) {
      setFormPayloadErr({ ...formpayloadErr, middleInitialErr: "Middle Initial is required" });
    }
    else if (formpayload.middleInitial.length < 3) {
      setFormPayloadErr({ ...formpayloadErr, middleInitialErr: "Middle Initial should be greater than 3 " })
    }
    else {
      setFormPayloadErr({ ...formpayloadErr, middleInitialErr: "" })

    }
  }


  const checkUserGroup = () => {

    if (formpayload.userGroups.length === 0 || !formpayload.userGroups) {
      setFormPayloadErr({
        ...formpayloadErr,
        userGroupErr: "User group is required",
      });
    }
    else {
      setFormPayloadErr({ ...formpayloadErr, userGroupErr: "" });
    }
  };

  
return (
    <div className="">
      <div className="modalEditCrx">
        <CRXToaster ref={toasterRef} />
        <CRXAlert
          message={responseError}
          alertType="inline"
          type="error"
          className="crxAlertUserEditForm"
          open={alert}
          setShowSucess={() => null}
        />
        <div className="CrxEditForm">
          <TextField
            error={!!formpayloadErr.userNameErr}
            errorMsg={formpayloadErr.userNameErr}
            required={true}
            value={formpayload.userName}
            label="Username"
            className="users-input"
            onChange={(e: any) =>
              setFormPayload({ ...formpayload, userName: e.target.value })
            }
            onBlur={(e: any) =>
              !formpayload.userName
                ? setFormPayloadErr({
                  ...formpayloadErr,
                  userNameErr: "Username is required",
                })
                : setFormPayloadErr({ ...formpayloadErr, userNameErr: "" })
            }
          />
          <TextField
            error={!!formpayloadErr.firstNameErr}
            errorMsg={formpayloadErr.firstNameErr}
            required={true}
            label="First Name"
            className="users-input"
            value={formpayload.firstName}
            onChange={(e: any) =>
              setFormPayload({ ...formpayload, firstName: e.target.value })
            }
            onBlur={(e: any) =>
              !formpayload.firstName
                ? setFormPayloadErr({
                  ...formpayloadErr,
                  firstNameErr: "First Name is required",
                })
                : setFormPayloadErr({ ...formpayloadErr, firstNameErr: "" })
            }
          />
          <TextField
            error={!!formpayloadErr.middleInitialErr}
            errorMsg={formpayloadErr.middleInitialErr}
            value={formpayload.middleInitial}
            required={true}
            label="Middle Initial"
            className="users-input"
            onChange={(e: any) =>
              setFormPayload({ ...formpayload, middleInitial: e.target.value })
            }
            onBlur={checkMiddleInitial}
          />
          <TextField
            error={!!formpayloadErr.lastNameErr}
            errorMsg={formpayloadErr.lastNameErr}
            required={true}
            value={formpayload.lastName}
            label="Last Name"
            className="users-input"
            onChange={(e: any) =>
              setFormPayload({ ...formpayload, lastName: e.target.value })
            }
            onBlur={(e: any) =>
              !formpayload.lastName
                ? setFormPayloadErr({
                  ...formpayloadErr,
                  lastNameErr: "Last Name is required",
                })
                : setFormPayloadErr({ ...formpayloadErr, lastNameErr: "" })
            }
          />
          <TextField
            error={!!formpayloadErr.emailErr}
            errorMsg={formpayloadErr.emailErr}
            required={true}
            value={formpayload.email}
            label="Email"
            className="users-input"
            onChange={(e: any) =>
              setFormPayload({ ...formpayload, email: e.target.value })
            }
            onBlur={checkEmail}
          />
          <TextField
            error={!!formpayloadErr.phoneNumberErr}
            errorMsg={formpayloadErr.phoneNumberErr}
            value={formpayload.phoneNumber}
            required={true}
            label="Phone Number"
            className="users-input"
            onChange={(e: any) =>
              setFormPayload({ ...formpayload, phoneNumber: e.target.value })
            }
            onBlur={checkPhoneumber}
          />

          {
            <div className="crxEditFilter">
             
              <CRXMultiSelectBoxLight
                className='categortAutocomplete CrxUserEditForm'
                label="User Group"
                multiple={true}
                CheckBox={true}
                required={true}
                error={!!formpayloadErr.userGroupErr}
                errorMsg={formpayloadErr.userGroupErr}
                options={optionList}
                value={formpayload.userGroups}
                autoComplete={false}
                isSearchable={true}
                onBlur={checkUserGroup}
                onChange={(e: React.SyntheticEvent, value: string[]) => {
                  setFormPayload({ ...formpayload, userGroups: value });
                }}
              />
            </div>

        }
        
        <div className="dataPickerCustom crxCreateEditDate">
          <label>Deactivation Date</label>
          <CRXInputDatePicker
            value={current_date}
            type="datetime-local"
            className="users-input"
            onChange={(e: any) =>
              setFormPayload({ ...formpayload, deactivation_Date: e.target.value })}
            minDate={minStartDate()}
            maxDate=""
          />
        </div>




          <div className="crxRadioBtn" style={{ display: "flex" }}>
            <label>User Password Setup</label>
            <div className="user-radio-group">
              <CRXRadio
                className="crxEditRadioBtn"
                disableRipple={true}
                content={content}
                value={radioValue}
                setValue={setRadioValue}
              />
            </div>
          </div>
        </div>
        <div className="crxFooterEditFormBtn">
          <CRXButton
            className="primary"
            disabled={disableSave}
            onClick={onSubmit}
          >
            Save
          </CRXButton>
          <CRXButton className="secondary" onClick={onClose}>
            Cancel
          </CRXButton>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
