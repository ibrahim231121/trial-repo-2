import { TextField, CRXSelectBox } from "@cb/shared";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UnitInfoModel } from "./UnitDetail";
import { useTranslation } from "react-i18next";
import { UnitTemplateConfigurationInfo } from "../../utils/Api/models/UnitModels";
import { CRXConfirmDialog } from "@cb/shared";
import { CRXButton } from "@cb/shared";
import { urlList, urlNames } from "../../utils/urlList";
import { useHistory } from "react-router";


type infoProps = {
  info: UnitInfoModel;
  onChangeGroupInfo: any;
  onSave: (e: React.MouseEventHandler<HTMLInputElement>) => void;
  isSaveButtonDisabled: boolean;
  redirectPage: () => void;
  closeDialog: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  setIsSaveButtonDisabled: any;
}

const UnitConfigurationInfo: React.FC<infoProps> = ({
  info,
  onChangeGroupInfo,
  onSave,
  isSaveButtonDisabled,
  redirectPage,
  setIsOpen,
  closeDialog,
  isOpen,
  setIsSaveButtonDisabled
}) => {
  const { t } = useTranslation<string>();
  const [name, setName] = React.useState(info.name);
  const [description, setDescription] = React.useState(info.description);
  const [groupName, setGroupName] = React.useState(info.groupName);
  const [configTemplate, setconfigTemplate] = React.useState(info.configTemp);
  const [configList, setconfigList] = React.useState(info.configTemplateList);
  const [stationlst, setstationList] = React.useState(info.stationList);
  const [stationId, setstationId] = React.useState(info.stationId);

  const history = useHistory();

  const filterTemplatesByStation = (templates: any[], stationId: number) => {
    var filteredTemplates = templates.filter(function (item: any) {
      if (item.stationId == stationId) {
        return { displayText: item.displayText, value: item.value }
      }
    })
    return filteredTemplates;
  }
  const onChangeName = (e: any) => {
    onChangeGroupInfo(
      e.target.value,
      description,
      groupName,
      configTemplate,
      configList,
      stationlst,
      stationId
    );
    setName(e.target.value);
  };
  const onChangeDescription = (e: any) => {
    onChangeGroupInfo(
      name,
      e.target.value,
      groupName,
      configTemplate,
      configList,
      stationlst,
      stationId
    );
    setDescription(e.target.value);
  };
  const onChangeGroupName = (e: any) => {
    onChangeGroupInfo(
      name,
      description,
      e.target.value,
      configTemplate,
      configList,
      stationlst,
      stationId,
    );
    setGroupName(e.target.value);
  };
  useEffect(() => {
    setName(info.name);
    setDescription(info.description);
    setGroupName(info.groupName);
    setconfigTemplate(info.configTemp);
    setconfigList([{ displayText: t("None"), value: "0" }, ...filterTemplatesByStation(info.allconfigTemplateList, info.stationId)]);
    setstationList(info.stationList);
    setstationId(info.stationId);
  }, [info]);

  const [formpayloadErr, setFormPayloadErr] = React.useState({
    nameErr: "",
    groupnameErr: "",
  });
  const onChange = (e: any) => {
    onChangeGroupInfo(name, description, groupName, e.target.value, configList, stationlst, stationId);
    setconfigTemplate(e.target.value);
  };

  const onChangeStation = (e: any) => {
    console.log([{ displayText: t("None"), value: "0" }, ...filterTemplatesByStation(info.allconfigTemplateList, e.target.value)], "templates")
    onChangeGroupInfo(
      name,
      description,
      groupName,
      "0",
      [{ displayText: t("None"), value: "0" }, ...filterTemplatesByStation(info.allconfigTemplateList, e.target.value)],
      stationlst,
      e.target.value);
    setconfigList(filterTemplatesByStation(info.allconfigTemplateList, e.target.value))
    setstationId(e.target.value);
  };

  const validateUserName = (name: string): { error: boolean; errorMessage: string } => {
    const chracterRegx = /^[a-zA-Z0-9-_.]+$/.test(
      String(name).toLowerCase()
    );
    if (!chracterRegx) {
      return { error: true, errorMessage: t("Please_provide_a_valid_Unit_Id.") };
    } else if (name.length < 3) {
      return {
        error: true,
        errorMessage: t("Minimum_3_character_and_maximum_15"),
      };
    } else if (name.length > 15) {
      return {
        error: true,
        errorMessage: t("Minimum_3_character_and_maximum_15"),
      };
    }
    return { error: false, errorMessage: "" };
  };
  const validateGroupName = (groupName: string): { error: boolean; errorMessage: string } => {
    const chracterRegx = /^[a-zA-Z0-9-.\s]+$/.test(String(groupName).toLowerCase());
    if (!chracterRegx && groupName.length > 0) {
      return { 
        error: true, 
        errorMessage: t("Please Provide a Valid Group Name.") 
      };
    } else if (groupName.length > 0 && groupName.length < 3) {
      return {
        error: true,
        errorMessage: t("Group Name is Less than 3 characters"),
      };
    } else if (groupName.length > 6) {
      return {
        error: true,
        errorMessage: t("Group Name is Greater than 6 characters"),
      };
    }
    return { error: false, errorMessage: "" };
  };
  const checkUserName = () => {
    const isUserNameValid = validateUserName(name);
    if (!name) {
      setFormPayloadErr({
        ...formpayloadErr,
        nameErr: t("Unit_Id_is_Required"),
      });
    } else if (isUserNameValid.error) {
      setFormPayloadErr({
        ...formpayloadErr,
        nameErr: isUserNameValid.errorMessage,
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, nameErr: "" });
    }
  };
  const checkGroupName = () => {
    const isGroupNameValid = validateGroupName(groupName);
    if (isGroupNameValid.error) {
      setFormPayloadErr({
        ...formpayloadErr,
        groupnameErr: isGroupNameValid.errorMessage,
      });
    } else {
      setFormPayloadErr({ ...formpayloadErr, groupnameErr: "" });
    }
  }

  React.useEffect(() => {
    if(!!formpayloadErr.groupnameErr || !!formpayloadErr.nameErr){
      setIsSaveButtonDisabled(true)
    }
    else{
      setIsSaveButtonDisabled(false)
    }
  }, [formpayloadErr])

  return (
    <div className="crx-group-info-form CBX-input unit_device_configuration_form">
      <div className="crx-group-info unitConfiguration">

        <div className="configurationTemplateLabel groupInfoInputs unitConfiguration_select">
          <div className="select_label">{t("Unit_Configuration_Template")}</div>
          <CRXSelectBox
            name="configurationTemplate"
            value={info.configTemp == "" ? 0 : info.configTemp}
            icon={true}
            options={configList}
            onChange={onChange}
          />
        </div>


        <div className="configurationTemplateLabel groupInfoInputs unitConfiguration_select">
          <div className="select_label">{t("Station")}</div>
          <div>
            <CRXSelectBox
              label={t("Station")}
              name="Station"
              value={info.stationId == "" ? 0 : info.stationId}
              icon={true}
              options={stationlst}
              onChange={onChangeStation}
            />
          </div>
        </div>


        <div className="groupInfoInputs">
          <TextField
            error={!!formpayloadErr.nameErr}
            errorMsg={formpayloadErr.nameErr}
            onBlur={checkUserName}
            required={true}
            label={t("Unit_ID")}
            value={name}
            className='users-input'
            onChange={onChangeName}
          />
        </div>
        <div className="groupInfoInputs">
          <TextField
            label={t("Description")}
            multiline
            variant="outlined"
            rows={1}
            value={description}
            onChange={onChangeDescription}
          />
        </div>
        <div className="groupInfoInputs UnitDevice_GroupName_Field">
          <TextField
            label={t("Group_Name")}
            variant="outlined"
            rows={2}
            value={groupName}
            error={!!formpayloadErr.groupnameErr}
            onChange={onChangeGroupName}
            errorMsg={formpayloadErr.groupnameErr} 
            onBlur={checkGroupName}
          />
        </div>
      </div>
      <div className="tab-bottom-buttons pd-b-50 tab-bottom-buttons-ui">
        <div className="save-cancel-unitDevice">
          <CRXButton
            variant="contained"
            className="groupInfoTabButtons"
            onClick={onSave}
            disabled={isSaveButtonDisabled}
          >
            {t("Save")}
          </CRXButton>
          <CRXButton
            className="groupInfoTabButtons secondary"
            color="secondary"
            variant="outlined"
            onClick={() =>
              history.push(
                urlList.filter(
                  (item: any) => item.name === urlNames.unitsAndDevices
                )[0].url
              )
            }
          >
            {t("Cancel")}
          </CRXButton>
        </div>
        <CRXButton
          onClick={() => redirectPage()}
          className="groupInfoTabButtons-Close secondary"
          color="secondary"
          variant="outlined"
        >
          {t("Close")}
        </CRXButton>
      </div>
      <CRXConfirmDialog
        setIsOpen={() => setIsOpen(false)}
        onConfirm={closeDialog}
        isOpen={isOpen}
        className="userGroupNameConfirm"
        primary="Yes, close"
        secondary="No, do not close"
        text="unit configuration form"
      >
        <div className="confirmMessage">
          {t("You_are_attempting_to")} <strong>{t("close")}</strong> {t("the")}{" "}
          <strong>{t("'unit_configuration_form'")}</strong>. {t("If_you_close_the_form")},
          {t("any_changes_you_ve_made_will_not_be_saved.")}
          {t("You_will_not_be_able_to_undo_this_action.")}
          <div className="confirmMessageBottom">
            {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
          </div>
        </div>
      </CRXConfirmDialog>
    </div>
  );
};

export default UnitConfigurationInfo;
