import { TextField, CRXSelectBox } from "@cb/shared";
import React, { useEffect, useState } from "react";
import { UnitInfoModel } from "./UnitDetail";
import { useTranslation } from "react-i18next";


type infoProps = {
  info: UnitInfoModel;
  onChangeGroupInfo: any;
  validationCheckOnButton:(p: boolean) => void;
}

const UnitConfigurationInfo: React.FC<infoProps> = ({
  info,
  onChangeGroupInfo,
  validationCheckOnButton
}) => {
  const { t } = useTranslation<string>();
  const [name, setName] = React.useState(info.name);
  const [description, setDescription] = React.useState(info.description);
  const [groupName, setGroupName] = React.useState(info.groupName);
  const [configTemplate, setconfigTemplate] = React.useState(info.configTemp);
  const [configList, setconfigList] = React.useState(info.configTemplateList);
  const [stationlst, setstationList] = React.useState(info.stationList);
  const [stationId, setstationId] = React.useState(info.stationId);

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
    setconfigList(info.configTemplateList);
    setstationList(info.stationList);
    setstationId(info.stationId);
  }, [info]);

  const [formpayloadErr, setFormPayloadErr] = React.useState({
    nameErr: "",
  });
  const onChange = (e: any) => {
    onChangeGroupInfo(name, description, groupName, e.target.value, configList, stationlst, stationId);
    setconfigTemplate(e.target.value);
  };

  const onChangeStation = (e: any) => {
    onChangeGroupInfo(name, description, groupName, configTemplate, configList, stationlst, e.target.value);
    setstationId(e.target.value);
  };

  const validateUserName = ( name: string):{ error: boolean; errorMessage: string } => {
    const chracterRegx = /^[a-zA-Z0-9-_.]+$/.test(
      String(name).toLowerCase()
    );
    if (!chracterRegx) {
      return { error: true, errorMessage: t("Please_provide_a_valid_Unit_Id.") };
    } else if (name.length < 3) {
      return {
        error: true,
        errorMessage: t("Unit_Id_must_contains_atleast_three_characters."),
      };
    } else if (name.length > 128) {
      return {
        error: true,
        errorMessage: t("Unit_Id_must_not_exceed_128_characters."),
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

  React.useEffect(()=>{
       validationCheckOnButton(!!formpayloadErr.nameErr)
  },[formpayloadErr.nameErr])
  return (
    <div className="crx-group-info-form CBX-input">
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
<div className="groupInfoInputs"> 
  <TextField
    label={t("Group_Name")}
    variant="outlined"
    rows={2}
    value={groupName}
    onChange={onChangeGroupName}
  />
</div>
</div>
    </div>
  );
};

export default UnitConfigurationInfo;
