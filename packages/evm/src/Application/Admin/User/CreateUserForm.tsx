
import React, { useContext, useRef, useState } from 'react';
import { AUTHENTICATION_EMAIL_SERVICE, GROUP_USER_LIST, USER } from '../../../utils/Api/url';
import moment from 'moment';
import './createUserForm.scss';
import { useDispatch } from 'react-redux';
import { addNotificationMessages } from '../../../Redux/notificationPanelMessages';
import { NotificationMessage } from '../../Header/CRXNotifications/notificationsTypes';
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import { useHistory, useParams } from "react-router";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import { urlList, urlNames } from "../../../utils/urlList";
import {
  CRXAlert,
  CRXInputDatePicker,
  CRXCheckBox,
  CRXButton,
  TextField,
  CRXRadio,
  CRXToaster,
  CRXMultiSelectBoxLight,
  CRXConfirmDialog
} from '@cb/shared';
import Cookies from 'universal-cookie';
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import { useTranslation } from "react-i18next";
import { PageiGrid } from "../../../GlobalFunctions/globalDataTableFunctions";
import { REACT_APP_CLIENT_ID } from '../../../../../evm/src/utils/Api/url'
import { UsersAndIdentitiesServiceAgent } from '../../../utils/Api/ApiAgent';
import { Account, User, UserGroups, UserList } from '../../../utils/Api/models/UsersAndIdentitiesModel';
import { UserStatus } from './UserEnum';
import {NameAndValue, AutoCompleteOptionType, userStateProps } from './UserTypes';
let USER_DATA : userStateProps = {
  userName: '',
  firstName: '',
  middleInitial: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  userGroups: [],
  deactivationDate: '',
  pin: null
}

const CreateUserForm = () => {
  const { t } = useTranslation<string>();
  const { id } = useParams<{ id: string }>();

  const [error, setError] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState('sendAct');
  const [generatePassword, setGeneratePassword] = React.useState('');
  const [formpayload, setFormPayload] = React.useState<userStateProps>({
    userName: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    userGroups: [],
    deactivationDate: '',
    pin: null
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
    confirmPasswordErr: '',
    pinErr: ''
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
  const userMsgFormRef = useRef<typeof CRXToaster>(null);
  const [isExtUsers, setIsExtUsers] = useState<string>('');
  const [isExtEmail, setIsExtEmail] = useState<string>('');
  const [ActivationLinkLabel, setActivationLinkLabel] = React.useState<string>(t('Send Activation Link'));
  const [alertType, setAlertType] = useState<string>('inline');
  const [errorType, setErrorType] = useState<string>('error');
  const [isADUser, setIsADUser] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { getModuleIds } = useContext(ApplicationPermissionContext);
  const dispatch = useDispatch();
  const userFormMessages = (obj: any) => {
    userMsgFormRef.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  }

  const checkFormPayload = () =>{
    const { userName, firstName, middleInitial, lastName, email, userGroups, deactivationDate, mobileNumber, pin } =
      formpayload;

      if (!validateUserName(userName).error && !validateFirstLastAndMiddleName(firstName,t('First_Name')).error && !validateFirstLastAndMiddleName(lastName,t('Last_Name')).error && validateEmail(email) && userGroups.length>0 && !validatePin(pin).error && !validatePhone(mobileNumber).error) {
      
        return true;
      }

      return false;
  }

  const [actual_formPayload, setactual_formPayload] = useState<userStateProps>(formpayload);
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: 1,
    size: 25
  })

  React.useEffect(() => {
    fetchGroups();
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, []);

  React.useEffect(() => {
if(radioValue == 'sendAct' && disableLink){
  setDisableSave(false)
}
else if(radioValue == 'genTemp' && generatePassword){
  setDisableSave(false)
}
else {
  setDisableSave(true)
}
  },[disableLink,radioValue,generatePassword])

  React.useEffect(() => {
    if (id) { fetchUser(); }
  }, [id]);

  React.useEffect(() => {
    if (userPayload && id) {
      const {
        email,
        name: { first: firstName, last: lastName, middle: middleInitial },
        account: { userName, password },
        mobileNumber,
        userGroups,
        deactivationDate,
        isADUser,
        pin
      } = userPayload;

      const phoneNumber = userPayload.mobileNumber;

      let userGroupNames: any = [];
      for (const elem of userGroups) {
        userGroupNames.push({
          id: elem.groupId,
          label: elem.groupName,
        });
      }
      if (isADUser) {
        setIsADUser(true)

      }
      else {
        setIsADUser(false)
      }

      USER_DATA = {
        email,
        userName,
        firstName,
        middleInitial,
        lastName,
        mobileNumber,
        deactivationDate,
        userGroups: userGroupNames,
        pin
      };
      setFormPayload({
        email,
        userName,
        firstName,
        middleInitial,
        lastName,
        mobileNumber,
        deactivationDate,
        userGroups: userGroupNames,
        pin
      });
      setActivationLinkLabel(t('Resend Activation Link'));
      setRadioValue('');
    }
  }, [userPayload]);

  React.useEffect(() => {
    const { userGroups } = formpayload;

    if (userGroups.length > 0) {
      setError(false);
    }

    if (JSON.stringify(formpayload) === JSON.stringify(USER_DATA)) {
      setDisableSave(true);

    } else if (checkFormPayload()) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  }, [formpayload]);

  React.useEffect(() => {
    if (responseError !== undefined && responseError !== '') {
      let notificationMessage: NotificationMessage = {
        title: t('User'),
        message: responseError,
        type: errorType,
        date: moment(moment().toDate()).local().format('YYYY / MM / DD HH:mm:ss')
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [responseError]);

  React.useEffect(() => {
    const alertClx: any = document.getElementsByClassName("crxAlertUserEditForm");
    const crxIndicate: any = document.getElementsByClassName("CrxIndicates");
    const modalEditCrx: any = document.getElementsByClassName("modalEditCrx");
    const altRef = alertRef.current;

    if (alert === false && altRef === null) {

      alertClx[0].style.display = "none";
      crxIndicate[0].style.top = "42px";
      modalEditCrx[0].style.paddingTop = "42px";
      
    } else {
      alertClx[0].setAttribute("style", "margin-top:42px;margin-bottom:42px");
      crxIndicate[0].style.top = "83px";
      modalEditCrx[0].style.paddingTop = "2px";
      
    }
  }, [alert]);

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
    UsersAndIdentitiesServiceAgent.getUser(id).then((response: UserList) => {
      dispatch(enterPathActionCreator({ val: response.account.userName }));
      setUserPayload(response);
    });
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
      setDisableSave(false);
      
    };
    return (
      <>
        <div className='crx-Generate-pass'>
          <div className='crxGeneratePassword'>
            <CRXButton className='primary' onClick={onClickPass}>
              {t("Generate")}
            </CRXButton>
            <TextField className='crx-generate-btn' value={generatePassword} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              className='copyButton'
              onClick={() => {
                navigator.clipboard.writeText(generatePassword);
              }}>
              {t("Copy")}
            </button>
          </div>

          <div className='crx-requird-check ConfirmCheckUi '>
            <CRXCheckBox
              checked={isPasswordResetRequired}
              lightMode={true}
              className='crxCheckBoxCreate '
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIsPasswordResetRequired(e.target.checked)
              }
            />
            <label>{t("Require_user_to_change_password_on_next_login")}</label>
          </div>
        </div>
      </>
    );
  };

  const manuallyGeneratePass = () => {
    return (
      <div className='crx-manually-generate-pass'>
        <TextField
          className='crx-gente-field crx-gente-field-pass'
          error={!!formpayloadErr.passwordErr}
          errorMsg={formpayloadErr.passwordErr}
          label={"Password"}
          type='password'
          required={true}
          onChange={(e: any) => setPassword(e.target.value)}
          onBlur={checkPassword}
        />
        <TextField
          className='crx-gente-field crx-gente-field-confrim '
          error={!!formpayloadErr.confirmPasswordErr}
          errorMsg={formpayloadErr.confirmPasswordErr}
          label={t("Confirm_Password")}
          required={true}
          type='password'
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
          <label>{t("Require_user_to_change_password_on_next_login")}</label>
        </div>
      </div>
    );
  };

  const content = [
    {
      moduleIds: 11,
      label: ActivationLinkLabel,
      isDisabled: isADUser,
      value: 'sendAct',
      Comp: () => sendActivationLink()
    },
    {
      moduleIds: 0,
      label: t("Generate_Temporary_Password"),
      isDisabled: isADUser,
      value: "genTemp",
      Comp: () => generateTempPassComp(),
    },
    {
      moduleIds: 0,
      label: t("Manually_Set_Password"),
      isDisabled: isADUser,
      value: "manual",
      Comp: () => manuallyGeneratePass(),
    },
  ];

  //Permission applied when user doesnot have permission of Activate and Deactivate Users
  const activationLinkPermission = content.filter((x: any) => getModuleIds().includes(x.moduleIds) || x.moduleIds === 0);

  const fetchGroups = () => {

    UsersAndIdentitiesServiceAgent.getUsersGroups().then((response: UserGroups[]) => {
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
    })
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

  const onSelectEditPasswordType = () => {
    if (radioValue === "genTemp") return generatePassword;
    else if (radioValue === "manual") return password;
    else return "";
  };

  const setAddPayload = () => {

    let userGroupsListIDs = userGroupsList
      ?.filter((item: any) => {
        return formpayload.userGroups.some((e: any) => e.id === item.groupId);

      })
      .map((i: any) => i.groupId);

    const name = {
      first: formpayload.firstName,
      last: formpayload.lastName,
      middle: formpayload.middleInitial
    };

  


    const account: Account = {
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
      account.status = UserStatus.Pending;
    }
    if (radioValue == 'sendAct') {
      account.status = UserStatus.Pending;
    }

    const payload: User = {
      email: formpayload.email,
      deactivationDate: formpayload.deactivationDate,
      name,
      account,
      mobileNumber: formpayload.mobileNumber,
      assignedGroupIds: userGroupsListIDs,
      timeZone: 'America/Chicago',
      pin : formpayload.pin
    };
    return payload;
  };

  const onAdd = async () => {
    if (formpayload.userGroups.length === 0) {
      setError(true);
      return;
    }
    const payload = setAddPayload();
    const errorUndefined = (error : any) =>{
      
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
    }
    const errorDefined = (error : any) => {
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
    const AddUser = "/Users";
    UsersAndIdentitiesServiceAgent.addUser(AddUser, payload)
    // .then(function (res: number) {
    //   if (res)
    //     return res;
    //   })
      .then((resp: any) => {
        if (resp) {
          let error = JSON.parse(resp);
          if (error.errors !== undefined) {
            errorUndefined(error);
          } 
          
          else if (!isNaN(+error)) {
            const userName = formpayload.firstName + ' ' + formpayload.lastName;
            if(radioValue == 'sendAct'){
            sendEmail(formpayload.email, '', userName);}
            userFormMessages({
              message: t('You_have_created_the_user_account.'),
              variant: 'success',
              duration: 7000
            });
            dispatch(getUsersInfoAsync(pageiGrid));
            setDisableSave(true)
            const path = `${urlList.filter((item: any) => item.name === urlNames.editUser)[0].url}`;
            history.push(path.substring(0, path.lastIndexOf("/")) + "/" + resp);
            history.go(0)
          } 
          else {
         errorDefined(error);
          }
        }
        
      })
      .catch(function (e: any) {
        catchError(e);
      });
  };

  const catchError = (e : any) => {
    if(e.request.status == 409) {
      userFormMessages({
        message: e.response.data,
        variant: 'error',
        duration: 7000
      });

    }
    else if (e.request.status == 500) {
      setAlert(true);
      userFormMessages({
        message: t('We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator.'),
        variant: 'error',
        duration: 7000
      });
      setResponseError(
        t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
      );
    }
    return e;
  }
  
  const onSelectPasswordType = () => {
    if (radioValue === 'genTemp') return generatePassword;
    else if (radioValue === 'manual') return password;
    else return '123456';
  };

  const setEditPayload = () => {
    let userGroupsListIDs: any = userGroupsList
      ?.filter((item: any) => {
        return formpayload.userGroups.find((e: any) => e === item.groupName || e.label === item.groupName);
      })
      .map((i: any) => i.groupId);

    const name = {
      first: formpayload.firstName,
      last: formpayload.lastName,
      middle: formpayload.middleInitial
    };

 

    /*
     * * setting status to pending if user check Resend Activation Link radio button or enable change password on next login checkbox 
    */
    if (disableLink || isPasswordResetRequired) {
      userPayload.account.status = 3;
    }
    const account = { ...userPayload.account, userName: formpayload.userName, password: onSelectEditPasswordType(), isPasswordResetRequired: isPasswordResetRequired };
    

    const payload: User = {
      ...userPayload,
      email: formpayload.email,
      deactivationDate: formpayload.deactivationDate,
      name,
      account,
      mobileNumber: formpayload.mobileNumber,
      assignedGroupIds: userGroupsListIDs,
      timeZone: 'America/Chicago',
      pin : formpayload.pin
    };


    return payload;
  };
  const functionalityAfterRequest = () => {


  }
  const onEdit = async () => {
    if (formpayload.userGroups.length === 0) {
      setError(true);
      return;
    }
    const urlEdit = USER + '/' + `${id}`;

    const payload = setEditPayload();
    UsersAndIdentitiesServiceAgent.editUser(urlEdit, payload).then(() => {
      dispatch(enterPathActionCreator({ val: payload.account.userName }));
      if (disableLink) {
        const userName = userPayload.name.first + ' ' + userPayload.name.last;
        sendEmail(payload.email, userPayload.id, userName, true);
        userFormMessages({
          message: t('You_have_resent_the_activation_link.'),
          variant: 'success',
          duration: 7000
        });
        dispatch(getUsersInfoAsync(pageiGrid));
        setDisableSave(true)
      }
      userFormMessages({ message: t('You_have_updated_the_user_account.'), variant: 'success', duration: 7000 });
      dispatch(getUsersInfoAsync(pageiGrid));
      setDisableSave(true)

      functionalityAfterRequest()
    }).catch((e: any) => {

      if (e !== undefined) {
        let error = JSON.parse(e);

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
      else if (e.status == 500) {
        setAlert(true);
        setResponseError(
          t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
        );
      }
      return error;
    });
  };

  const onSubmit = async (e: any) => {
    setResponseError('');
    checkUserGroup()
    setAlert(false);
    if (id) await onEdit();
    else {
      await onAdd();
    }
  };

  const history = useHistory();

  const onCancelUser = () => {
    history.goBack();
  }

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateUserName = (userName: string): { error: boolean, errorMessage: string } => {
    const chracterRegx = /^[a-zA-Z0-9-_.]+$/.test(String(userName).toLowerCase());
    if (!chracterRegx) {
      return { error: true, errorMessage: t("Please_provide_a_valid_User_name") };
    } else if (userName.length < 3) {
      return { error: true, errorMessage: t("User_name_must_contain_atleast_three_characters.") };
    }
    else if (userName.length > 128) {
      return { error: true, errorMessage: t("User_name_must_not_exceed_128_characters.") };
    }
    return { error: false, errorMessage: '' };
  };

  const validateFirstLastAndMiddleName = (userName: string, _type: string): { error: boolean, errorMessage: string } => {
    const characterReg = /^[a-zA-Z0-9 ]+$/.test(String(userName).toLowerCase());
    if (!characterReg) {
      return { error: true, errorMessage: `${t("Please_provide_a_valid")} ${_type}.` };
    } else if (userName.length < 3) {
      return { error: true, errorMessage: `${_type} ${t("must_contain_atleast_three_characters.")}` };
    }
    else if (userName.length > 128) {
      return { error: true, errorMessage: `${_type} ${t("must_not_exceed_128_characters.")}` };
    }
    return { error: false, errorMessage: '' };
  }

  const checkFirstName = () => {
    const isUserFirstNameValid = validateFirstLastAndMiddleName(formpayload.firstName, t('First_Name'));
    if (!formpayload.firstName) {
      setFormPayloadErr({
        ...formpayloadErr,
        firstNameErr: t('First_Name_is_required')
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
    const isUserLastNameValid = validateFirstLastAndMiddleName(formpayload.lastName, t('Last_Name'));
    if (!formpayload.lastName) {
      setFormPayloadErr({
        ...formpayloadErr,
        lastNameErr: t('Last_Name_is_required')
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

  const validatePin = (pin: string | null): { error: boolean, errorMessage: string } => {
    if (pin != null) {
      const characterReg = /^[0-9 ]+$/.test(String(pin));
      if (pin.length === 0)
        return { error: false, errorMessage: '' };
      else if (!characterReg) {
        return { error: true, errorMessage: `${t("Pin_should_be_numeric_value")}.` };
      } else if (pin.length !== 4) {
        return { error: true, errorMessage: `${t("Pin_must_be_4_numbers")}` };
      }
    }

    return { error: false, errorMessage: '' };
  }

  const checkPin = () => {
    if (formpayload.pin !== null) {
      const isPinValid = validatePin(formpayload.pin.toString());
      if (isPinValid.error) {
        setFormPayloadErr({ ...formpayloadErr, pinErr: isPinValid.errorMessage });
      }
      else {
        setFormPayloadErr({ ...formpayloadErr, pinErr: '' });
      }
    }
  }

  const checkUserName = () => {
    const isUserNameValid = validateUserName(formpayload.userName);
    if (!formpayload.userName) {
      setFormPayloadErr({
        ...formpayloadErr,
        userNameErr: t('Username is required')
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
        emailErr: t("Email_is_required")
      });
    } else if (!isEmailValid) {
      setFormPayloadErr({
        ...formpayloadErr,
        emailErr: t('Please_provide_a_valid_email_address')
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
        passwordErr: t("Password_is_required")
      });
      setDisableSave(true)
    }
    else if (password.length < 6) {
      setFormPayloadErr({ ...formpayloadErr, passwordErr: `${t("Password_should_be_greater_than_six_characters")}` });
      setDisableSave(true)
    }
    else {
      setFormPayloadErr({ ...formpayloadErr, passwordErr: '' });
    }
  };

  const checkConfirmPassword = () => {
    if (!confirmPassword) {
      setFormPayloadErr({
        ...formpayloadErr,
        confirmPasswordErr: t("Confirm_Password_is_required")
      });
      setDisableSave(true)
    } else if (password !== confirmPassword) {
      setFormPayloadErr({
        ...formpayloadErr,
        confirmPasswordErr: t("Passwords_are_not_same")
      });
      setDisableSave(true)
    }else if (confirmPassword.length < 6) {
      setFormPayloadErr({ ...formpayloadErr, confirmPasswordErr: `${t("Confirm_Password_should_be_greater_than_six_characters")}` });
      setDisableSave(true)
    } else {
      setFormPayloadErr({ ...formpayloadErr, confirmPasswordErr: '' });
      
      if(checkFormPayload())
      {
        setDisableSave(false)
      }
    }
  };

  const sendEmail = (email: string, clientId: string, applicationName: string, ResendActivation : boolean = false) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        TenantId: '1'
      }
    };
    const url = `${AUTHENTICATION_EMAIL_SERVICE}?email=${email}&client_id=${REACT_APP_CLIENT_ID}&applicationName=${applicationName}&resendActivation=${ResendActivation}`;
    fetch(url, requestOptions);
  };

  const sendActivationLink = () => {
    const linkClick = () => {
      setDisableLink(true);
      setDisableSave(false)
    };
    return (
      <>
        {userPayload && (
          <div className='crxCreateEditFormActivationLink'>
            <div className='crxActivationLink'>
              <CRXButton className='secondary' onClick={linkClick} disabled={disableLink}>
                {t("Resend_Activation_Link")}
              </CRXButton>
              <label>{t("(Link_will_be_sent_after_saving_this_form.)")}</label>
            </div>
          </div>
        )}
      </>
    );
  };

  const validatePhone = (phoneNumber: string): { error: boolean, errorMessage: string } => {
    if (phoneNumber) {
      const phoneCharacter = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{1,4})[-. ]*(\d{4})?(?: *x(\d+))?\s*$/.test(String(phoneNumber));
      if (!phoneCharacter) {
        return { error: true, errorMessage: t("Please_provide_a_valid_mobile_number.") };
      } else if (phoneNumber.length > 15) {
        return { error: true, errorMessage: t("Number_must_not_exceed_15_characters.") };
      }
    }
    return { error: false, errorMessage: '' };
  }

  const checkPhoneumber = () => {
    const isPhoneValidate = validatePhone(formpayload.mobileNumber);
    if (!formpayload.mobileNumber) {
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
        userGroupErr: t("User_group_is_required")
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, userGroupErr: '' });
    }
  };

  const redirectPage = () => {

    if (id) {
      const phoneNumber = userPayload.mobileNumber;
        const userGroupNames = userPayload.userGroups?.map((x: any) => x.groupName);
        const user_temp = {
        userName: userPayload.account.userName,
        firstName: userPayload.name.first,
        middleInitial: userPayload.name.middle,
        lastName: userPayload.name.last,
        email: userPayload.email,
        mobileNumber: phoneNumber,
        userGroups: userGroupNames,
        deactivationDate: userPayload.deactivationDate,
      }
      if (JSON.stringify(formpayload) !== JSON.stringify(user_temp)) {
        setIsOpen(true);
      }
      else {
        history.push(
          urlList.filter((item: any) => item.name === urlNames.adminUsers)[0].url
        );
      }
    }
    else {
      if (JSON.stringify(formpayload) !== JSON.stringify(actual_formPayload))
        setIsOpen(true);
      else {
        history.push(
          urlList.filter((item: any) => item.name === urlNames.adminUsers)[0].url
        );
      }
    }
  }

  const closeDialog = () => {
    setIsOpen(false);
    history.push(
      urlList.filter((item: any) => item.name === urlNames.adminUsers)[0]
        .url
    );
  };

  return (
    <div className='createUser CrxCreateUser CreateUserUi searchComponents'>
      <CRXToaster ref={userMsgFormRef} />
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
        <sup>*</sup> {t("Indicates_required_field")}
      </div>
      <div className='modalEditCrx'>
        <div className='CrxEditForm'>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={5} >
              <TextField
                error={!!formpayloadErr.userNameErr}
                errorMsg={formpayloadErr.userNameErr}
                required={true}
                value={formpayload.userName}
                label={t("User_Name")}
                className={'users-input ' + isExtUsers}
                onChange={(e: any) => setFormPayload({ ...formpayload, userName: e.target.value })}
                disabled={isADUser}
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
                label={t("First_Name")}
                className='users-input'
                value={formpayload.firstName}
                onChange={(e: any) => setFormPayload({ ...formpayload, firstName: e.target.value })}
                onBlur={checkFirstName}
              />
              <TextField
                error={!!formpayloadErr.middleInitialErr}
                errorMsg={formpayloadErr.middleInitialErr}
                value={formpayload.middleInitial}
                label={t("Middle_Initial")}
                className='users-input'
                onChange={(e: any) => setFormPayload({ ...formpayload, middleInitial: e.target.value })}
                onBlur={checkMiddleInitial}
              />
              <TextField
                error={!!formpayloadErr.lastNameErr}
                errorMsg={formpayloadErr.lastNameErr}
                required={true}
                value={formpayload.lastName}
                label={t("Last_Name")}
                className='users-input'
                onChange={(e: any) => setFormPayload({ ...formpayload, lastName: e.target.value })}
                onBlur={checkLastName}
              />
            </Grid>
            <div className='grid_spacer'>
            </div>
            <Grid item xs={12} sm={12} md={12} lg={5}>
              <TextField
                error={!!formpayloadErr.emailErr}
                errorMsg={formpayloadErr.emailErr}
                required={true}
                value={formpayload.email}
                disabled={isADUser}
                label={t("Email")}
                className={'users-input ' + isExtEmail}
                onChange={(e: any) => setFormPayload({ ...formpayload, email: e.target.value })}
                onBlur={checkEmail}
              />
              <TextField
                error={!!formpayloadErr.phoneNumberErr}
                errorMsg={formpayloadErr.phoneNumberErr}
                value={formpayload.mobileNumber}
                label={t("Mobile_Number")}
                className='users-input'
                onChange={(e: any) => setFormPayload({ ...formpayload, mobileNumber: e.target.value })}
                onBlur={checkPhoneumber}
              />

              {
                <div className='crxEditFilter editFilterUi'>
                  
                  <CRXMultiSelectBoxLight
                    className='categortAutocomplete CrxUserEditForm'
                    label={t("User_Group")}
                    multiple={true}
                    CheckBox={true}
                    required={true}
                    error={!!formpayloadErr.userGroupErr}
                    errorMsg={formpayloadErr.userGroupErr}
                    options={optionList}
                    value={formpayload.userGroups}
                    //value={[{id:'2226',label:'dev23215ds'}]}
                    autoComplete={false}
                    isSearchable={true}
                    disabled={isADUser}
                    onBlur={checkUserGroup}
                    onChange={(_e: React.SyntheticEvent, value: AutoCompleteOptionType[]) => {
                      setFormPayload({ ...formpayload, userGroups: value });
                    }}
                    isSuggestion={false}
                  />
                </div>
              }

              <div className='dataPickerCustom crxCreateEditDate DeactivationDateUi'>
                <label>{t("Deactivation_Date")}</label>
                <CRXInputDatePicker
                  value={current_date}
                  type='datetime-local'
                  className='users-input'
                  onChange={(e: any) => setFormPayload({ ...formpayload, deactivationDate: e.target.value })}
                  minDate={minStartDate()}
                  disabled={isADUser}
                  maxDate=''
                />
              </div>

              <div className='_create_user_pin_field'>
                {/* NOTE: Class removed, due to styling issue in displaying error message */}
                <TextField
                  // className='crx-gente-field crx-gente-field-confrim '
                  error={!!formpayloadErr.pinErr}
                  errorMsg={formpayloadErr.pinErr}
                  label={t("Pin")}
                  required={false}
                  type='text'
                  value={formpayload.pin}
                  onChange={(e: any) => setFormPayload({ ...formpayload, pin: e.target.value })}
                  onBlur={checkPin}
                />
              </div>

              <div className={`crxRadioBtn crxRadioBtnUi ${radioValue == "genTemp" || radioValue == "manual" ? "radioBtnUiSpacer" : ""}`}>
                <label>{t("User_Password_Setup")}</label>
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
            </Grid>
          </Grid>
        </div>
        <div className='crxFooterEditFormBtn'>
          <div className='__crxFooterBtnUser__'>
            <CRXButton className='primary' disabled={disableSave} onClick={onSubmit}>
              {t("Save")}
            </CRXButton>

            <Link to={urlList.filter((item: any) => item.name === urlNames.adminUsers)[0].url} className="btnCancelAssign">
              {t("Cancel")}
            </Link>
          </div>
          <div className='__crxFooterBtnUser__'>
            <CRXButton
              onClick={() => redirectPage()}
              className="groupInfoTabButtons-Close secondary"
              color="secondary"
              variant="outlined"
            >
              Close
            </CRXButton>
          </div>
        </div>
        <CRXConfirmDialog
          setIsOpen={() => setIsOpen(false)}
          onConfirm={closeDialog}
          isOpen={isOpen}
          className="userGroupNameConfirm"
          primary={t("Yes,_close")}
          secondary={t("No,_do_not_close")}
          text="user group form"
        >
          <div className="confirmMessage __crx__Please__confirm__modal">
            {t("You_are_attempting_to")} <strong> {t("close_out_of_this_screen_with_unsaved_changes.")}</strong><strong className='__crx__please_confirm_'>{t(" ")}</strong>{" "}
            {t("If_you_close_this_screen")}, {t("any_un-saved_any_changes_will_not_be_saved. You_will_not_be_able_to_undo_this_action.")}
            <div className="confirmMessageBottom">
              {t("Would_you_like_to")} <strong>{t("close")}</strong> {t("this_screen?")}
            </div>
          </div>
        </CRXConfirmDialog>
      </div>
    </div>
  );
};

export default CreateUserForm;
