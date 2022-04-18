import { TextField, CRXSelectBox } from "@cb/shared";
import React, { useEffect, useState } from "react";
import { UnitInfoModel } from "./UnitDetail";


type infoProps = {
  info: UnitInfoModel;
  onChangeGroupInfo: any;
};

const UnitConfigurationInfo: React.FC<infoProps> = ({
  info,
  onChangeGroupInfo,
}) => {
  const [name, setName] = React.useState(info.name);
  const [description, setDescription] = React.useState(info.description);
  const [groupName, setGroupName] = React.useState(info.groupName);
  const [configTemplate, setconfigTemplate] = React.useState(info.configTemp);
  const [configList, setconfigList] = React.useState(info.configTemplateList);

  const onChangeName = (e: any) => {
    onChangeGroupInfo(
      e.target.value,
      description,
      groupName,
      configTemplate,
      configList
    );
    setName(e.target.value);
  };
  const onChangeDescription = (e: any) => {
    onChangeGroupInfo(
      name,
      e.target.value,
      groupName,
      configTemplate,
      configList
    );
    setDescription(e.target.value);
  };
  const onChangeGroupName = (e: any) => {
    onChangeGroupInfo(
      name,
      description,
      e.target.value,
      configTemplate,
      configList
    );
    setGroupName(e.target.value);
  };
  useEffect(() => {
    setName(info.name);
    setDescription(info.description);
    setGroupName(info.groupName);
    setconfigTemplate(info.configTemp);
    setconfigList(info.configTemplateList);
  }, [info]);

  const [formpayloadErr, setFormPayloadErr] = React.useState({
    nameErr: "",
  });
  const onChange = (e: any) => {
    onChangeGroupInfo(name, description, groupName, e.target.value, configList);
    setconfigTemplate(e.target.value);
  };

  const validateUserName = ( name: string):{ error: boolean; errorMessage: string } => {
    const chracterRegx = /^[a-zA-Z0-9-_.]+$/.test(
      String(name).toLowerCase()
    );
    if (!chracterRegx) {
      return { error: true, errorMessage: `Please provide a valid Unit Id.` };
    } else if (name.length < 3) {
      return {
        error: true,
        errorMessage: `Unit Id must contains atleast three characters.`,
      };
    } else if (name.length > 128) {
      return {
        error: true,
        errorMessage: `Unit Id must not exceed 128 characters.`,
      };
    }
    return { error: false, errorMessage: "" };
  };
  const checkUserName = () => {
    const isUserNameValid = validateUserName(name);
    if (!name) {
      setFormPayloadErr({
        ...formpayloadErr,
        nameErr: "Unit Id is Required",
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

  return (
    <div className="crx-group-info-form CBX-input">
      <div className="crx-group-info">
        <div className="configurationTemplateLabel">
          <label>Unit Configuration Template</label>
          <CRXSelectBox
            name="configurationTemplate"
            value={info.configTemp == "" ? 0 : info.configTemp}
            icon={true}
            options={configList}
            onChange={onChange}
          />
        </div>
        <div className="groupInfoInputs">
          <TextField
            error={!!formpayloadErr.nameErr}
            errorMsg={formpayloadErr.nameErr}
            onBlur={checkUserName}
            required={true}
            label="Unit ID"
            value={name}
            className='users-input'
            onChange={onChangeName}
          />
        </div>
        <div className="groupInfoInputs">
          <TextField
            label="Description"
            multiline
            variant="outlined"
            rows={1}
            value={description}
            onChange={onChangeDescription}
          />
        </div>
        <div className="groupInfoInputs">
          <TextField
            label="Group Name"
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
