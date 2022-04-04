import { TextField, CRXSelectBox } from "@cb/shared";
import { FormatAlignCenter } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { UnitInfoModel } from './UnitDetail'
import useGetFetch from "../../utils/Api/useGetFetch";
import {
  BASE_URL_UNIT_SERVICE
} from "../../utils/Api/url";


type infoProps = {
  info: UnitInfoModel,
  onChangeGroupInfo: any
}

const UnitConfigurationInfo: React.FC<infoProps> = ({ info, onChangeGroupInfo }) => {
  const [name, setName] = React.useState(info.name);
  const [description, setDescription] = React.useState(info.description);
  const [groupName, setGroupName] = React.useState(info.groupName);
  const [configTemplate, setconfigTemplate] = React.useState(info.configTemp);

  const [configList, setconfigList] = React.useState(info.configTemplateList);
  console.log(configList);

  const onChangeName = (e: any) => {
    onChangeGroupInfo(e.target.value, description, groupName, configTemplate, configList);
    setName(e.target.value);
  }
  const onChangeDescription = (e: any) => {
    onChangeGroupInfo(name, e.target.value, groupName, configTemplate, configList);
    setDescription(e.target.value);
  }
  const onChangeGroupName = (e: any) => {
    onChangeGroupInfo(name, description, e.target.value, configTemplate, configList);
    setGroupName(e.target.value);
  }
  useEffect(() => {
    setName(info.name);
    setDescription(info.description);
    setGroupName(info.groupName);
    setconfigTemplate(info.configTemp);
    setconfigList(info.configTemplateList);

  }, [info])

  const [fieldName, setFieldName] = useState({
    template: '',
    station: ''

  });
  const onChange = (e: any) => {
    onChangeGroupInfo(name, description, groupName, e.target.value, configList);
    setconfigTemplate(e.target.value);
    // const { name, value } = e.target;
    // setFieldName({ ...fieldName, [name]: value });
  }
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
          <TextField required={true} label="Unit ID" value={name} className="userError" onChange={onChangeName} />
        </div>
        <div className="groupInfoInputs">
          <TextField label="Description" multiline variant="outlined" rows={1} value={description} onChange={onChangeDescription} />
        </div>
        <div className="groupInfoInputs">
          <TextField label="Group Name" variant="outlined" rows={2} value={groupName} onChange={onChangeGroupName} />
        </div>
      </div>
    </div>
  );
};

export default UnitConfigurationInfo;
