import { CRXButton } from "@cb/shared";
import { TextField, CRXConfirmDialog } from "@cb/shared";
import { url } from "inspector";
import React, { SyntheticEvent, useEffect } from "react";
import { GROUP_USER_LIST, USER } from "../../../../utils/Api/url";
import { EditableSelect } from "@cb/shared";
import useGetFetch from "../../../../utils/Api/useGetFetch";

let USER_DATA = {};
interface Props {
  onClose: any;
  setCloseWithConfirm: any;
  id?: any;
}

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
const CreateUserForm: React.FC<Props> = ({
  onClose,
  setCloseWithConfirm,
  id,
}) => {
  const [error, setError] = React.useState(false);
  const [formpayload, setFormPayload] = React.useState<userStateProps>({
    userName: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userGroups: [],
    deactivationDate: "",
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
  });

  const [disableSave, setDisableSave] = React.useState(true);
  const [userGroupsList, setUserGroupsList] = React.useState<string[]>();
  const [userPayload, setUserPayload] = React.useState<any>();

  React.useEffect(() => {
    fetchUser();
  }, [id]);

  React.useEffect(() => {
    if (userPayload && id) {
      const {
        email,
        name: { first: firstName, last: lastName, middle: middleInitial },
        account: { userName },
        contacts,
      } = userPayload;
      const phoneNumber =
        userPayload.contacts.length > 0
          ? userPayload.contacts.find((x: any) => x.contactType === 1).number
          : "";
      USER_DATA = {
        userName,
        firstName,
        middleInitial,
        lastName,
        email,
        phoneNumber,
        userGroups: [],
        deactivationDate: "",
      };
      setFormPayload({
        ...formpayload,
        email,
        userName,
        firstName,
        middleInitial,
        lastName,
        phoneNumber,
      });
    }
  }, [userPayload]);

  const fetchUser = async () => {
    const res = await fetch(`${USER}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", TenantId: "1" },
    });
    var response = await res.json();
    setUserPayload(response);
  };

  const fetchGroups = async () => {
    const res = await fetch(GROUP_USER_LIST, {
      method: "GET",
      headers: { "Content-Type": "application/json", TenantId: "1" },
    });
    var response = await res.json();
    var groupNames = response.map((x: any) => x.name);
    groupNames = groupNames.sort(function (a: any, b: any) {
      return a.localeCompare(b);
    });
    setUserGroupsList(groupNames);
  };
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
      phoneNumber,
      userGroups,
      deactivationDate,
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
      deactivationDate
    ) {
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

  const onSubmit = async (e:any) => {
    if (formpayload.userGroups.length === 0) {
      setError(true);
    }
    const url = `http://10.227.141.128:8088/Users/${id}`;

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
      contacts.push({contactType:1, number:formpayload.phoneNumber})
    }

    const payload = {
      ...userPayload,
      email: formpayload.email,
      name,
      account,
      contacts,
    };

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", TenantId: "1" },
      body: JSON.stringify(payload),
    });
    onClose(e)
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
  return (
    <div className="modal_user_crx">
      <div>
        <label>* Indicates required field</label>
        <TextField
          error={!!formpayloadErr.userNameErr}
          errorMsg={formpayloadErr.userNameErr}
          required={true}
          value={formpayload.userName}
          label="Username"
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
          value={formpayload.firstName}
          label="First Name"
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
          label="Middle Initial"
          onChange={(e: any) =>
            setFormPayload({ ...formpayload, middleInitial: e.target.value })
          }
        />
        <TextField
          error={!!formpayloadErr.lastNameErr}
          errorMsg={formpayloadErr.lastNameErr}
          required={true}
          value={formpayload.lastName}
          label="Last Name"
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
          onChange={(e: any) =>
            setFormPayload({ ...formpayload, email: e.target.value })
          }
          onBlur={checkEmail}
        />
        <TextField
          error={!!formpayloadErr.phoneNumberErr}
          errorMsg={formpayloadErr.phoneNumberErr}
          value={formpayload.phoneNumber}
          label="Phone Number"
          onChange={(e: any) =>
            setFormPayload({ ...formpayload, phoneNumber: e.target.value })
          }
        />
        {/* <TextField
          value={formpayload.userGroup}
          label="User Group"
          onChange={(e: any) =>
            setFormPayload({ ...formpayload, userGroup: e.target.value })
          }
        /> */}
        {
          <div>
            <label>User Group *</label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <EditableSelect
                multiple={true}
                onChange={(e: React.SyntheticEvent, value: string[]) => {
                  setFormPayload({ ...formpayload, userGroups: value });
                }}
                onInputChange={(e: any) => {}}
                options={userGroupsList}
                id="userGroupList"
                placeHolder="User Groups Name"
                value={formpayload.userGroups}
              />
              <div>
                {error && (
                  <label
                    style={{
                      fontSize: " 0.75rem",
                      color: "red",
                      margin: "0px",
                    }}
                  >
                    User group is required.
                  </label>
                )}
              </div>
            </div>
          </div>
        }
        <TextField
          error={!!formpayloadErr.deactivationDateErr}
          errorMsg={formpayloadErr.deactivationDateErr}
          value={formpayload.deactivationDate}
          type="date"
          label="Deactivation Date"
          onChange={(e: any) =>
            setFormPayload({ ...formpayload, deactivationDate: e.target.value })
          }
        />
      </div>
      <div>
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
  );
};

export default CreateUserForm;
