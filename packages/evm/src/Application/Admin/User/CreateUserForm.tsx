import { url } from 'inspector';
import React, { SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';
import { AUTHENTICATION_EMAIL_SERVICE, GROUP_USER_LIST, USER } from '../../../utils/Api/url';
import useGetFetch from '../../../utils/Api/useGetFetch';
import { DateFormat } from '../../../GlobalFunctions/globalDataTableFunctions';
import moment from 'moment';
import './createUserForm.scss';
import constants from '../../Assets/utils/constants';
import { useDispatch } from 'react-redux';
import { addNotificationMessages } from '../../../Redux/notificationPanelMessages';
import dateDisplayFormat from '../../../GlobalFunctions/DateFormat';
import { NotificationMessage } from '../../Header/CRXNotifications/notificationsTypes';
import {
  CRXAlert,
  CRXInputDatePicker,
  CRXCheckBox,
  CRXButton,
  TextField,
  CRXConfirmDialog,
  CRXRadio,
  CRXToaster,
  EditableSelect,
  CRXMultiSelectBoxLight
} from '@cb/shared';
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import Cookies from 'universal-cookie';

let USER_DATA = {};
interface Props {
  onClose: any;
  setCloseWithConfirm: any;
  id?: any;
  showToastMsg: (obj: any) => void;
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
  deactivationDate: string;
}

type account = {
  isAdministrator: number;
  lastLogin: Date;
  passwordDetail: any;
  status: number;
  userName: string;
  password: string;
  isPasswordResetRequired: boolean;
};

const CreateUserForm: React.FC<Props> = ({ onClose, setCloseWithConfirm, id, showToastMsg }) => {
  const [error, setError] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState('sendAct');
  const [generatePassword, setGeneratePassword] = React.useState('');
  const [formpayload, setFormPayload] = React.useState<userStateProps>({
    userName: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    userGroups: [],
    deactivationDate: ''
  });

  const [formpayloadErr, setFormPayloadErr] = React.useState({
    userNameErr: '',
    firstNameErr: '',
    middleInitialErr: '',
    lastNameErr: '',
    emailErr: '',
    phoneNumberErr: '',
    userGroupErr: '',
    deactivationDateErr: '',
    passwordErr: '',
    confirmPasswordErr: ''
  });

  const [disableSave, setDisableSave] = React.useState(true);
  const [userGroupsList, setUserGroupsList] = React.useState<NameAndValue[]>();
  const [userPayload, setUserPayload] = React.useState<any>();

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [responseError, setResponseError] = React.useState<string>('');
  const [alert, setAlert] = React.useState<boolean>(false);

  const [isPasswordResetRequired, setIsPasswordResetRequired] = React.useState<boolean>(false);
  const alertRef = useRef(null);
  const [disableLink, setDisableLink] = React.useState(false);
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [isExtUsers, setIsExtUsers] = useState<string>('');
  const [isExtEmail, setIsExtEmail] = useState<string>('');
  const [ActivationLinkLabel, setActivationLinkLabel] = React.useState<string>('Send Activation Link');
  const [alertType, setAlertType] = useState<string>('inline');
  const [errorType, setErrorType] = useState<string>('error');
  const {getModuleIds} = useContext(ApplicationPermissionContext);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  React.useEffect(() => {
    if (userPayload && id) {
      const {
        email,
        name: { first: firstName, last: lastName, middle: middleInitial },
        account: { userName,password },
        contacts,
        userGroups,
        deactivationDate
      } = userPayload;

      const phoneNumber =
        userPayload.contacts.length > 0
          ? userPayload.contacts.find((x: any) => x.contactType === 1).number
          : '';

      const userGroupNames = userGroups?.map((x: any) => x.groupName);

      USER_DATA = {
        userName,
        password,
        firstName,
        middleInitial,
        lastName,
        email,
        phoneNumber: '',
        userGroups: [],
        deactivationDate: ''
      };
      setFormPayload({
        ...formpayload,
        email,
        userName,
        firstName,
        middleInitial,
        lastName,
        phoneNumber,
        deactivationDate,
        userGroups: userGroupNames
      });
      setActivationLinkLabel('Resend Activation Link');
      setRadioValue('');
    }
  }, [userPayload]);

  const cookies = new Cookies();

  var current_date;
  if (formpayload.deactivationDate != null) {
    current_date = formpayload.deactivationDate.split('Z')[0];
  }

  const minStartDate = () => {
    var currentDate = new Date();
    var mm = '' + (currentDate.getMonth() + 1);
    var dd = '' + currentDate.getDate();
    var yyyy = currentDate.getFullYear();

    if (mm.length < 2) mm = '0' + mm;
    if (dd.length < 2) dd = '0' + dd;
    return [yyyy, mm, dd].join('-') + 'T00:00:00';
  };

  const fetchUser = async () => {
    const res = await fetch(`${USER}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', TenantId: '1' }
    });
    var response = await res.json();
    setUserPayload(response);
  };

  const generateTempPassComp = () => {
    const onClickPass = () => {
      var chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var passwordLength = 12;
      var password = '';
      for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
      }
      setGeneratePassword(password);
    };
    return (
      <>
        <div className='crx-Generate-pass'>
          <div className='crxGeneratePassword'>
            <CRXButton className='primary' onClick={onClickPass}>
              Generate
            </CRXButton>
            <TextField className='crx-generate-btn' value={generatePassword} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              className='copyButton'
              onClick={() => {
                navigator.clipboard.writeText(generatePassword);
              }}>
              Copy
            </button>
          </div>

          <div className='crx-requird-check'>
            <CRXCheckBox
              checked={isPasswordResetRequired}
              lightMode={true}
              className='crxCheckBoxCreate '
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
      <div className='crx-manually-generate-pass'>
        <TextField
          className='crx-gente-field'
          error={!!formpayloadErr.passwordErr}
          errorMsg={formpayloadErr.passwordErr}
          label='Password'
          type='password'
          required={true}
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          onBlur={checkPassword}
        />
        <TextField
          className='crx-gente-field'
          error={!!formpayloadErr.confirmPasswordErr}
          errorMsg={formpayloadErr.confirmPasswordErr}
          label='Confirm Password'
          required={true}
          type='password'
          value={confirmPassword}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
          onBlur={checkConfirmPassword}
        />
        <div className='crx-requird-check'>
          <CRXCheckBox
            checked={isPasswordResetRequired}
            lightMode={true}
            className='crxCheckBoxCreate '
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
      moduleIds: 11,
      label: ActivationLinkLabel,
      // label: "Send Activation Link",
      value: 'sendAct',
      Comp: () => sendActivationLink()
    },
    {
      moduleIds: 0,
      label: "Generate Temporary Password",
      value: "genTemp",
      Comp: () => generateTempPassComp(),
    },
    {
      moduleIds: 0,
      label: "Manually Set Password",
      value: "manual",
      Comp: () => manuallyGeneratePass(),
    },
  ];

  //Permission applied when user doesnot have permission of Activate and Deactivate Users
  const activationLinkPermission = content.filter((x:any) => getModuleIds().includes(x.moduleIds) || x.moduleIds === 0);

  const fetchGroups = async () => {
    const res = await fetch(GROUP_USER_LIST, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', TenantId: '1', 'Authorization': `Bearer ${cookies.get('access_token')}` }
    });
    var response = await res.json();
    var groupNames = response.map((x: any) => {
      let j: NameAndValue = {
        groupId: x.id,
        groupName: x.name
      };
      return j;
    });
    groupNames = groupNames.sort(function (a: any, b: any) {
      return a.groupName.localeCompare(b.groupName);
    });
    setUserGroupsList(groupNames);
    sendOptionList(groupNames);
  };

  const [optionList, setOptionList] = useState<any>([]);
  const sendOptionList = (data: any[]) => {
    const dateOfArry: any = [];
    data?.map((item, index) => {
      dateOfArry.push({
        id: item.groupId,
        label: item.groupName
      });
    });
    return setOptionList(dateOfArry);
  };

  React.useEffect(() => {
    setCloseWithConfirm(false);
    fetchGroups();
  }, []);

  React.useEffect(() => {
    const { userName, firstName, middleInitial, lastName, email, userGroups, deactivationDate, phoneNumber } =
      formpayload;
    if (userGroups.length > 0) {
      setError(false);
    }
    if (userName || firstName || lastName || email || userGroups.length || deactivationDate) {
      setCloseWithConfirm(true);
    }
    if (JSON.stringify(formpayload) === JSON.stringify(USER_DATA)) {
      setDisableSave(true);
      setCloseWithConfirm(false);
    } else if (userName && firstName && lastName && email) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  }, [formpayload]);

  useEffect(() => {
    if (responseError !== undefined && responseError !== '') {
      let notificationMessage: NotificationMessage = {
        title: 'User',
        message: responseError,
        type: errorType,
        date: moment(moment().toDate()).local().format('YYYY / MM / DD HH:mm:ss')
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [responseError]);

  const onSelectEditPasswordType = () => {
    if (radioValue === "genTemp") return generatePassword;
    else if (radioValue === "manual") return password;
    else return "";
  };

  const setAddPayload = () => {
    let userGroupsListIDs = userGroupsList
      ?.filter((item: any) => {
        return formpayload.userGroups.some((e: any) => e === item.groupName);
      })
      .map((i: any) => i.groupId);

    const name = {
      first: formpayload.firstName,
      last: formpayload.lastName,
      middle: formpayload.middleInitial
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
      passwordDetail: null
    };

     /*
     * * setting status to pending if user enable change password on next login checkbox 
     */
      if (isPasswordResetRequired) {
        account.status = 3;
      }

    const payload = {
      email: formpayload.email,
      deactivationDate: formpayload.deactivationDate,
      name,
      account,
      contacts,
      assignedGroupIds: userGroupsListIDs,
      timeZone: 'America/Chicago'
    };
    return payload;
  };

  const onAdd = async () => {
    if (formpayload.userGroups.length === 0) {
      setError(true);
      return;
    }

    const payload = setAddPayload();
    await fetch(USER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', TenantId: '1' ,  'Authorization': `Bearer ${cookies.get('access_token')}` },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (res.ok) return res.json();
        else if (res.status == 500) {
          setAlert(true);
          setResponseError(
            "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
          );
        } else return res.text();
      })
      .then((resp) => {
        if (resp !== undefined) {
          let error = JSON.parse(resp);
          if (error.errors !== undefined) {
            if (error.errors.UserName !== undefined && error.errors.UserName.length > 0) {
              setAlert(true);
              setResponseError(error.errors.UserName[0]);
            }
            if (error.errors.First !== undefined && error.errors.First.length > 0) {
              setAlert(true);
              setResponseError(error.errors.First[0]);
            }
            if (error.errors.Last !== undefined && error.errors.Last.length > 0) {
              setAlert(true);
              setResponseError(error.errors.Last[0]);
            }
            if (error.errors.Middle !== undefined && error.errors.Middle.length > 0) {
              setAlert(true);
              setResponseError(error.errors.Middle[0]);
            }
            if (error.errors.Email !== undefined && error.errors.Email.length > 0) {
              setAlert(true);
              setResponseError(error.errors.Email[0]);
            }
            if (error.errors.Number !== undefined && error.errors.Number.length > 0) {
              setAlert(true);
              setResponseError(error.errors.Number[0]);
            }

            if (error.errors.Password !== undefined && error.errors.Password.length > 0) {
              setAlert(true);
              setResponseError(error.errors.Password[0]);
            }
          } else if (!isNaN(+error)) {
            const userName = formpayload.firstName + ' ' + formpayload.lastName;
            sendEmail(formpayload.email, parseInt(error), userName);
            showToastMsg({
              message: 'You have created the user account.',
              variant: 'success',
              duration: 7000
            });
            onClose();
          } else {
            setAlert(true);
            setResponseError(error);
            const errorString = error;
            if (errorString.includes('email') === true) {
              setIsExtEmail('isExtEmail');
            } else {
              setIsExtEmail('');
            }

            if (errorString.includes('username') === true) {
              setIsExtUsers('isExtUserName');
            } else {
              setIsExtUsers('');
            }
          }
        }
      })
      .catch(function (error) {
        return error;
      });
  };

  const onSelectPasswordType = () => {
    if (radioValue === 'genTemp') return generatePassword;
    else if (radioValue === 'manual') return password;
    else return 'hello123456789';
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
      middle: formpayload.middleInitial
    };

    let contacts = userPayload.contacts.map((x: any) => {
      if (x.contactType === 1) {
        x.number = formpayload.phoneNumber;
      }
      return x;
    });

    /*
     * * setting status to pending if user check Resend Activation Link radio button or enable change password on next login checkbox 
    */
    if (disableLink || isPasswordResetRequired) {
      userPayload.account.status = 3;
    }
    const account = { ...userPayload.account, userName: formpayload.userName, password: onSelectEditPasswordType() };
    if (contacts.length === 0) {
      contacts.push({ contactType: 1, number: formpayload.phoneNumber });
    }

    const payload = {
      ...userPayload,
      email: formpayload.email,
      deactivationDate: formpayload.deactivationDate,
      name,
      account,
      contacts,
      assignedGroupIds: userGroupsListIDs,
      timeZone: 'America/Chicago'
    };

    return payload;
  };

  const onEdit = async () => {
    if (formpayload.userGroups.length === 0) {
      setError(true);
      return;
    }

    const urlEdit = USER + '/' + `${id}`;

    const payload = setEditPayload();

    await fetch(urlEdit, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', TenantId: '1' ,  'Authorization': `Bearer ${cookies.get('access_token')}` },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (res.ok) {
          if (disableLink) {
            const userName = userPayload.name.first + ' ' + userPayload.name.last;
            sendEmail(payload.email, userPayload.id, userName);
            showToastMsg({
              message: 'You have resent the activation link.',
              variant: 'success',
              duration: 7000
            });
          }
          onClose();
          showToastMsg({ message: 'You have updated the user account.', variant: 'success', duration: 7000 });
        } else if (res.status == 500) {
          setAlert(true);
          setResponseError(
            "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
          );
        } else return res.text();
      })
      .then((resp) => {
        if (resp !== undefined) {
          let error = JSON.parse(resp);

          if (error.errors !== undefined) {
            if (error.errors.UserName !== undefined && error.errors.UserName.length > 0) {
              setAlert(true);
              setResponseError(error.errors.UserName[0]);
            }
            if (error.errors.First !== undefined && error.errors.First.length > 0) {
              setAlert(true);
              setResponseError(error.errors.First[0]);
            }
            if (error.errors.Last !== undefined && error.errors.Last.length > 0) {
              setAlert(true);
              setResponseError(error.errors.Last[0]);
            }
            if (error.errors.Email !== undefined && error.errors.Email.length > 0) {
              setAlert(true);
              setResponseError(error.errors.Email[0]);
            }
            if (error.errors.Number !== undefined && error.errors.Number.length > 0) {
              setAlert(true);
              setResponseError(error.errors.Password[0]);
            }
            if (error.errors.Password !== undefined && error.errors.Password.length > 0) {
              setAlert(true);
              setResponseError(error.errors.Password[0]);
            }
          } else {
            setAlert(true);
            setResponseError(error);
            const errorString = error;
            if (errorString.includes('email') === true) {
              setIsExtEmail('isExtEmail');
            } else {
              setIsExtEmail('');
            }

            if (errorString.includes('username') === true) {
              setIsExtUsers('isExtUserName');
            } else {
              setIsExtUsers('');
            }
          }
        }
      })
      .catch(function (error) {
        return error;
      });
  };

  const onSubmit = async (e: any) => {
    setResponseError('');
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

  const validateUserName = (userName: string) : { error: boolean, errorMessage: string } => {
    const chracterRegx = /^[a-zA-Z0-9-_.]+$/.test(String(userName).toLowerCase());
    if (!chracterRegx) {
      return { error: true, errorMessage: `Please provide a valid User name.` };
    } else if (userName.length < 3) {
      return { error: true, errorMessage: `User name must contain atleast three characters.` };
    }
    else if (userName.length > 128) {
      return { error: true, errorMessage: `User name must not exceed 128 characters.` };
    }
    return { error: false, errorMessage: '' };
  };

  const validateFirstLastAndMiddleName = (userName: string, _type: string): { error: boolean, errorMessage: string } => {
    const characterReg = /^[a-zA-Z0-9 ]+$/.test(String(userName).toLowerCase());
    if (!characterReg) {
      return { error: true, errorMessage: `Please provide a valid ${_type}.` };
    } else if (userName.length < 3) {
      return { error: true, errorMessage: `${_type} must contain atleast three characters.` };
    }
    else if (userName.length > 128) {
      return { error: true, errorMessage: `${_type} must not exceed 128 characters.` };
    }
    return { error: false, errorMessage: '' };
  }

  const checkFirstName = () => {
    const isUserFirstNameValid = validateFirstLastAndMiddleName(formpayload.firstName, 'First Name');
    if (!formpayload.firstName) {
      setFormPayloadErr({
        ...formpayloadErr,
        firstNameErr: 'First Name is required'
      });
    } else if (isUserFirstNameValid.error) {
      setFormPayloadErr({
        ...formpayloadErr,
        firstNameErr: isUserFirstNameValid.errorMessage
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, firstNameErr: '' });
    }
  };

  const checkLastName = () => {
    const isUserLastNameValid = validateFirstLastAndMiddleName(formpayload.lastName, 'Last Name');
    if (!formpayload.lastName) {
      setFormPayloadErr({
        ...formpayloadErr,
        lastNameErr: 'Last Name is required'
      });
    } else if (isUserLastNameValid.error) {
      setFormPayloadErr({
        ...formpayloadErr,
        lastNameErr: isUserLastNameValid.errorMessage
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, lastNameErr: '' });
    }
  }

  const checkUserName = () => {
    const isUserNameValid = validateUserName(formpayload.userName);
    if (!formpayload.userName) {
      setFormPayloadErr({
        ...formpayloadErr,
        userNameErr: 'Username is required'
      });
    } else if (isUserNameValid.error) {
      setFormPayloadErr({
        ...formpayloadErr,
        userNameErr: isUserNameValid.errorMessage
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, userNameErr: '' });
    }
  }

  const checkEmail = () => {
    const isEmailValid = validateEmail(formpayload.email);

    if (!formpayload.email) {
      setFormPayloadErr({
        ...formpayloadErr,
        emailErr: 'Email is required'
      });
    } else if (!isEmailValid) {
      setFormPayloadErr({
        ...formpayloadErr,
        emailErr: 'Please provide a valid email address'
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, emailErr: '' });
    }
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return re.test(String(password).toLowerCase());
  }

  const checkPassword = () => {
    const isPasswwordValid = validatePassword(password);

    if (!password) {
      setFormPayloadErr({
        ...formpayloadErr,
        passwordErr: 'Password is required'
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, passwordErr: '' });
    }
  };

  const checkConfirmPassword = () => {
    if (!confirmPassword) {
      setFormPayloadErr({
        ...formpayloadErr,
        confirmPasswordErr: 'Confirm Password is required'
      });
    } else if (password !== confirmPassword) {
      setFormPayloadErr({
        ...formpayloadErr,
        confirmPasswordErr: 'Passwords are not same'
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, confirmPasswordErr: '' });
    }
  };

  const sendEmail = (email: string, clientId: number, applicationName: string) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        TenantId: '1'
      }
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
          <div className='crxCreateEditFormActivationLink'>
            <div className='crxActivationLink'>
              <CRXButton className='secondary' onClick={linkClick} disabled={disableLink}>
                Resend Activation Link
              </CRXButton>
              <label>(Link will be sent after saving this form.)</label>
            </div>
          </div>
        )}
      </>
    );
  };

  const validatePhone = (phoneNumber: string): { error: boolean, errorMessage: string } => {
    const phoneCharacter = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{1,4})[-. ]*(\d{4})?(?: *x(\d+))?\s*$/.test(String(phoneNumber));
    if (!phoneCharacter) {
      return { error: true, errorMessage: `Please provide a valid phone number.` };
    } else if (phoneNumber.length > 15) {
      return { error: true, errorMessage: `Number must not exceed 15 characters.` };
    }
    return { error: false, errorMessage: '' };
  }

  const checkPhoneumber = () => {
    const isPhoneValidate = validatePhone(formpayload.phoneNumber);
    if (!formpayload.phoneNumber) {
      setFormPayloadErr({ ...formpayloadErr, phoneNumberErr: '' });
    } else if (isPhoneValidate.error) {
      setFormPayloadErr({
        ...formpayloadErr,
        phoneNumberErr: isPhoneValidate.errorMessage
      });
    }
    else {
      setFormPayloadErr({ ...formpayloadErr, phoneNumberErr: '' });
    }
  }

  const checkMiddleInitial = () => {
    if (!formpayload.middleInitial) {
      setFormPayloadErr({ ...formpayloadErr, middleInitialErr: '' });
    } else {
      setFormPayloadErr({ ...formpayloadErr, middleInitialErr: '' });
    }
  };

  const checkUserGroup = () => {
    if (formpayload.userGroups.length === 0 || !formpayload.userGroups) {
      setFormPayloadErr({
        ...formpayloadErr,
        userGroupErr: 'User group is required'
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, userGroupErr: '' });
    }
  };

useEffect(() => {
  const alertClx:any = document.getElementsByClassName("crxAlertUserEditForm");
  const crxIndicate : any = document.getElementsByClassName("CrxIndicates");
  const modalEditCrx : any = document.getElementsByClassName("modalEditCrx");
  const optionalSticky : any = document.getElementsByClassName("optionalSticky");
  const altRef = alertRef.current;
  
  if(alert === false && altRef === null  && optionalSticky.length > 0) {
    
    alertClx[0].style.display = "none";
    crxIndicate[0].style.top = "42px";
    modalEditCrx[0].style.paddingTop = "42px";
    optionalSticky[0].style.height = "79px"
  }else {
    alertClx[0].setAttribute("style", "display:flex;margin-top:42px;margin-bottom:42px");
    crxIndicate[0].style.top = "83px";
    modalEditCrx[0].style.paddingTop = "2px";
    if(optionalSticky.length > 0) {
        optionalSticky[0].style.height = "119px"
      }
    }
  }, [alert]);
  return (
    <div className=''>
      <CRXToaster ref={toasterRef} />
      <CRXAlert
        ref={alertRef}
        message={responseError}
        className='crxAlertUserEditForm'
        alertType={alertType}
        type={errorType}
        open={alert}
        setShowSucess={() => null}
      />
      <div className='CrxIndicates'>
        <sup>*</sup> Indicates required field
      </div>
      <div className='modalEditCrx'>
        <div className='CrxEditForm'>
          <TextField
            error={!!formpayloadErr.userNameErr}
            errorMsg={formpayloadErr.userNameErr}
            required={true}
            value={formpayload.userName}
            label='Username'
            className={'users-input ' + isExtUsers}
            onChange={(e: any) => setFormPayload({ ...formpayload, userName: e.target.value })}
            // onBlur={(e: any) => {
            //   !formpayload.userName
            //     ? setFormPayloadErr({
            //       ...formpayloadErr,
            //       userNameErr: 'Username is required'
            //     })
            //     : setFormPayloadErr({ ...formpayloadErr, userNameErr: '' });
            // }}
            onBlur={checkUserName}
          />
          <TextField
            error={!!formpayloadErr.firstNameErr}
            errorMsg={formpayloadErr.firstNameErr}
            required={true}
            label='First Name'
            className='users-input'
            value={formpayload.firstName}
            onChange={(e: any) => setFormPayload({ ...formpayload, firstName: e.target.value })}
            onBlur={checkFirstName}
          />
          <TextField
            error={!!formpayloadErr.middleInitialErr}
            errorMsg={formpayloadErr.middleInitialErr}
            value={formpayload.middleInitial}
            label='Middle Initial'
            className='users-input'
            onChange={(e: any) => setFormPayload({ ...formpayload, middleInitial: e.target.value })}
            onBlur={checkMiddleInitial}
          />
          <TextField
            error={!!formpayloadErr.lastNameErr}
            errorMsg={formpayloadErr.lastNameErr}
            required={true}
            value={formpayload.lastName}
            label='Last Name'
            className='users-input'
            onChange={(e: any) => setFormPayload({ ...formpayload, lastName: e.target.value })}
            onBlur={checkLastName}
          />
          <TextField
            error={!!formpayloadErr.emailErr}
            errorMsg={formpayloadErr.emailErr}
            required={true}
            value={formpayload.email}
            label='Email'
            className={'users-input ' + isExtEmail}
            onChange={(e: any) => setFormPayload({ ...formpayload, email: e.target.value })}
            onBlur={checkEmail}
          />
          <TextField
            error={!!formpayloadErr.phoneNumberErr}
            errorMsg={formpayloadErr.phoneNumberErr}
            value={formpayload.phoneNumber}
            label='Phone Number'
            className='users-input'
            onChange={(e: any) => setFormPayload({ ...formpayload, phoneNumber: e.target.value })}
            onBlur={checkPhoneumber}
          />

          {
            <div className='crxEditFilter'>
              <CRXMultiSelectBoxLight
                className='categortAutocomplete CrxUserEditForm'
                label='User Group'
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

          <div className='dataPickerCustom crxCreateEditDate'>
            <label>Deactivation Date</label>
            <CRXInputDatePicker
              value={current_date}
              type='datetime-local'
              className='users-input'
              onChange={(e: any) => setFormPayload({ ...formpayload, deactivationDate: e.target.value })}
              minDate={minStartDate()}
              maxDate=''
            />
          </div>

          <div className='crxRadioBtn' style={{ display: 'flex' }}>
            <label>User Password Setup</label>
            <div className='user-radio-group'>
              <CRXRadio
                className='crxEditRadioBtn'
                disableRipple={true}
                content={activationLinkPermission}
                value={radioValue}
                setValue={setRadioValue}
              />
            </div>
          </div>
        </div>
        <div className='crxFooterEditFormBtn'>
          <CRXButton className='primary' disabled={disableSave} onClick={onSubmit}>
            Save
          </CRXButton>
          <CRXButton className='secondary' onClick={onClose}>
            Cancel
          </CRXButton>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
