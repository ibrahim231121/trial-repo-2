import React, { useCallback, useEffect, useState } from "react";
import {
  CRXRows,
  CRXColumn,
  CRXMultiSelectBoxLight,
  CRXConfirmDialog,
  CRXButton,
  CRXTooltip,
  CRXAlert,
} from "@cb/shared";
import { useTranslation } from "react-i18next";
import "./ADGroupsMapping.scss";
import { UsersAndIdentitiesServiceAgent } from "../../../utils/Api/ApiAgent";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { SetupConfigurationAgent } from "../../../utils/Api/ApiAgent";
import {
  KeyValue,
  ADGroups,
  AddGroup,
  UserGroups,
} from "../../../utils/Api/models/UsersAndIdentitiesModel";
import { urlList, urlNames } from "../../../utils/urlList";

const ADGroupsMapping: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isClose, setIsClose] = React.useState(false);
  let defaultGroup: AddGroup = {
    id: 0,
    rowId: 0,
    adGroupRecId: 0,
    serverType: 0,
    isChanged: false,
    isDeleted: false,
    groupRecIds: [],
  };
  const [success, setSuccess] = React.useState<boolean>(false);
  const [authServer, setAuthServer] = useState<number>(0);
  let [row, setRow] = useState<any>({
    rowId: 0,
    Id: 0,
  });
  let [payload, setPayload] = useState<AddGroup[]>([]);
  let [formValues, setFormValues] = useState<AddGroup[]>([]);
  const [userGroupOptions, setUserGroupOptions] = React.useState<any[]>([]);
  const [aDGroupOptions, setADGroupOptions] = React.useState<any[]>([]);

  const onUserGroupsUpdate = (e: any, i: number) => {
    let newArr = [...payload];
    newArr[i].groupRecIds = e.map((x: any) => parseInt(x.value));
    newArr[i].groupObj = e;
    setPayload(newArr);
  };
  const onADGroupsUpdate = (e: any, i: number) => {
    let newArr = [...payload];
    newArr[i].adGroupRecId = e.value;
    newArr[i].adGroupObj = e;
    setPayload(newArr);
  };

  useEffect(() => {
    dispatch(setLoaderValue({ isLoading: true, message: "" }));
    SetupConfigurationAgent.getTenantSetting("/TenantSettings/KeyValues/6")
      .then((authServerType: any) => {
        setAuthServer(parseInt(authServerType.AuthServer));
        dispatch(
          setLoaderValue({ isLoading: false, message: "", error: true })
        );
      })
      .catch(() => {
        dispatch(
          setLoaderValue({ isLoading: false, message: "", error: true })
        );
      });
  }, []);

  useEffect(() => {
    // dispatch(setLoaderValue({ isLoading: true, message: "" }))
    UsersAndIdentitiesServiceAgent.getUsersGroups()
      .then((userGroups: UserGroups[]) => {
        setUserGroupOptions(
          userGroups.map((x) => {
            return {
              label: x.name,
              value: x.id,
            };
          })
        );
        //dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
      })
      .catch(() => {
        //dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
      });
  }, []);

  useEffect(() => {
    // dispatch(setLoaderValue({ isLoading: true, message: "" }))
    if (authServer > 0) {
      UsersAndIdentitiesServiceAgent.getADGroups(
        "/ADGroups/GetAllGroupKeyValues/" + authServer
      )
        .then((ADgroups: ADGroups[]) => {
          setADGroupOptions(
            ADgroups.map((x) => {
              return {
                label: x.name,
                value: x.id,
              };
            })
          );
          // dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
        })
        .catch(() => {
          // dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
        });
    }
  }, [authServer]);

  React.useEffect(() => {
    dispatch(setLoaderValue({ isLoading: true, message: "" }));
    UsersAndIdentitiesServiceAgent.getADGroupsMapping().then(
      (ADGroupsMapping: AddGroup[]) => {
        if (
          ADGroupsMapping &&
          ADGroupsMapping != null &&
          ADGroupsMapping.length > 0
        ) {
          ADGroupsMapping.forEach((x) => console.log("ABCDDDDDDDDDD" + x));
          setFormValues(ADGroupsMapping);
        } else {
          let temp = defaultGroup;
          temp.rowId = payload?.length + 1;
          setPayload((prevState) => [...prevState, temp]);
        }
        dispatch(
          setLoaderValue({ isLoading: false, message: "", error: true })
        );
      }
    );
  }, []);

  useEffect(() => {
    console.log(formValues);
    if (
      formValues.length > 0 &&
      userGroupOptions?.length > 0 &&
      aDGroupOptions?.length > 0
    ) {
      let temp = [...formValues];
      let tempUsergrp: KeyValue[] = [...userGroupOptions];
      let tempAdgrps: KeyValue[] = [...aDGroupOptions];

      temp.forEach((x: AddGroup, i: number) => {
        var thisGroup = tempAdgrps.find(
          (y) => y.value == x.adGroupRecId.toString()
        );
        var thisUser = tempUsergrp.filter((y) =>
          x.groupRecIds.some((z) => z.toString() == y.value)
        );
        x.adGroupObj = thisGroup;
        x.groupObj = thisUser;
      });
      setPayload(temp);
    }
  }, [formValues, userGroupOptions, aDGroupOptions]);

  const upsertRecords = (body: AddGroup[]) => {
    let temp: any = body.map((x) => {
      console.log("AUTH SERVER" + authServer);
      return {
        ...x,
        id: x.id.toString(),
        serverType: authServer,
        adGroupRecId: parseInt(x.adGroupRecId + ""),
        userGroup: x.groupRecIds,
      };
    });

    UsersAndIdentitiesServiceAgent.upsertADRecords(
      "/GroupADGroupMapping/Upsert",
      temp
    )
      .then((res: any) => {
        setSuccess(true);
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };
  const onAddGroup = () => {
    let temp = defaultGroup;
    temp.rowId = payload?.length + 1;
    setPayload((prevState) => [...prevState, temp]);
  };
  const onRemoveGroup = (RID: number, RecID: number) => {
    let temp = row;
    row.Id = RecID;
    row.rowId = RID;
    setRow(row);
    setIsOpen(true);
    // let sadsad = [...payload];
    // sadsad.splice(i, 1);
    // setPayload(sadsad);
  };
  const handleDelete = () => {
    if (row.Id > 0) {
      UsersAndIdentitiesServiceAgent.deleteADGroupsMapping(
        "/GroupADGroupMapping/" + row.Id
      )
        .then((res: any) => {})
        .catch();
    } else {
      setPayload((current) =>
        current.filter((entry) => entry.rowId != row.rowId)
      );
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    history.push(
      urlList.filter((item: any) => item.name === urlNames.assets)[0].url
    );
    setIsClose(false);
  };

  return (
    <div>
      <div className="crx-ADGroupMapping-tab">
        {success && (
          <CRXAlert
            message="Success: You have saved AD Mapping"
            alertType="toast"
            open={true}
          />
        )}
        <div className="ADGroupMappingContent">
          <CRXRows container="container" spacing={0}>
            <CRXColumn
              className="ADGroupMappingColumn"
              container="container"
              item="item"
              xs={4}
              spacing={0}
            >
              {t("User Groups")}
            </CRXColumn>
            <CRXColumn
              className="ADGroupMappingColumn"
              container="container"
              item="item"
              xs={5}
              spacing={0}
            >
              {t("Active Directory Groups")}
            </CRXColumn>
          </CRXRows>
          <div className="crxPermissionPageScroll">
            <div>
              <div className="crx-ADGroupMapping-col">
                {payload &&
                  payload.map((group, i) => {
                    console.log(group.adGroupObj);
                    console.log(group.id);
                    console.log(group.rowId);
                    return (
                      <CRXRows container="container" spacing={0}>
                        <CRXColumn
                          className="permissionCol"
                          container="container"
                          item="item"
                          xs={6}
                          spacing={0}
                        >
                          <CRXMultiSelectBoxLight
                            className="UserGroupsAutocomplete"
                            multiple={true}
                            CheckBox={true}
                            required={true}
                            options={userGroupOptions}
                            placeHolder={"Select EVM Group(s)"}
                            value={group.groupObj ? group.groupObj : []}
                            isSearchable={true}
                            onChange={(e: any, value: any) =>
                              onUserGroupsUpdate(value, i)
                            }
                          />
                        </CRXColumn>
                        <CRXColumn
                          className="permissionCol"
                          container="container"
                          item="item"
                          xs={3}
                          spacing={0}
                        >
                          <CRXMultiSelectBoxLight
                            className="ADGroupsAutocomplete"
                            CheckBox={true}
                            multiple={false}
                            required={true}
                            options={aDGroupOptions}
                            placeHolder={"Select AD Group"}
                            value={group.adGroupObj}
                            isSearchable={true}
                            onChange={(e: any, value: any) => {
                              onADGroupsUpdate(value, i);
                            }}
                          />
                        </CRXColumn>

                        <CRXColumn
                          className="crx-permission-btn"
                          container="container"
                          item="item"
                          xs={3}
                          spacing={0}
                        >
                          {
                            <button
                              className="removeBtn"
                              onClick={() =>
                                onRemoveGroup(group.rowId, group.id)
                              }
                            >
                              <CRXTooltip
                                iconName="fas fa-circle-minus"
                                arrow={false}
                                title="remove"
                                placement="bottom"
                                className="crxTooltipNotificationIcon"
                              />
                            </button>
                          }
                        </CRXColumn>
                      </CRXRows>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="crxPermissionBtnUSers crxPermissionBtnUSers_addBtn ">
          <CRXButton
            //disabled={isdisable}
            className="PreSearchButton"
            onClick={onAddGroup}
            color="primary"
            variant="contained"
          >
            {" "}
            {t("Add_user_groups")}
          </CRXButton>
        </div>

        <div className="crxPermissionBtnUSers crxPermissionBtnUSers_saveBtn">
          <div className="save-cancel-button-box">
            <CRXButton
              variant="contained"
              className="groupInfoTabButtons"
              onClick={() => {
                upsertRecords(payload);
              }}
              //disabled={0}
            >
              {t("Save")}
            </CRXButton>
            <CRXButton
              className="groupInfoTabButtons secondary"
              color="secondary"
              variant="outlined"
              onClick={() => setIsClose(true)}
            >
              {t("Cancel")}
            </CRXButton>
          </div>
        </div>

        <CRXConfirmDialog
          setIsOpen={() => setIsClose(false)}
          onConfirm={handleClose}
          isOpen={isClose}
          className="userGroupNameConfirm"
          primary={t("Yes_close")}
          secondary={t("No,_do_not_close")}
          text="user group form"
        >
          <div className="confirmMessage __crx__Please__confirm__modal">
            {t("You_are_attempting_to")} <strong> {t("close")}</strong>{" "}
            {t("the")} <strong>{t("'user_group_form'")}</strong>.{" "}
            {t("If_you_close_the_form")},
            {t("any_changes_you_ve_made_will_not_be_saved.")}{" "}
            {t("You_will_not_be_able_to_undo_this_action.")}
            <div className="confirmMessageBottom">
              {t("Are_you_sure_you_would_like_to")}{" "}
              <strong>{t("close")}</strong> {t("the_form?")}
            </div>
          </div>
        </CRXConfirmDialog>

        <CRXConfirmDialog
          setIsOpen={() => setIsOpen(false)}
          onConfirm={handleDelete}
          isOpen={isOpen}
          className="userGroupNameConfirm"
          primary="Yes Delete"
          secondary="No Do not Delete"
          text="Delete row"
        >
          <div className="confirmMessage __crx__Please__confirm__modal">
            {t("You_are_attempting_to")} <strong> {"delete"}</strong> {t("the")}{" "}
            <strong>{"AD group row"}</strong>.{" "}
            {t("You_will_not_be_able_to_undo_this_action.")}
            <div className="confirmMessageBottom">
              {"Are you sure you want to "}
              <strong>{t("delete")}</strong> {" the associated group"}
            </div>
          </div>
        </CRXConfirmDialog>
      </div>
    </div>
  );
};
export default ADGroupsMapping;
