import { TextField, CRXSelectBox } from "@cb/shared";
import { FormatAlignCenter } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { GroupInfoModel } from './UnitCreate'

const listItem = [
    {
        value:1,
        displayText: "Template 1"
    },
    {
        value:2,
        displayText: "Template 2"
    },
    {
        value:3,
        displayText: "Template 3"
    }
]

type infoProps = {
  info: GroupInfoModel,
  onChangeGroupInfo: any
}
const UnitConfigurationInfo: React.FC<infoProps> = ({ info, onChangeGroupInfo }) => {
  const [name, setName] = React.useState(info.name);
  const [description, setDescription] = React.useState(info.description);
  const [groupName, setGroupName] = React.useState(info.groupName);
  const onChangeName = (e: any) => {
    onChangeGroupInfo(e.target.value, description, groupName);
    setName(e.target.value);
  }
  const onChangeDescription = (e: any) => {
    onChangeGroupInfo(name, e.target.value);
    setDescription(e.target.value);
  }
  const onChangeGroupName = (e: any) => {
    onChangeGroupInfo(name,description, e.target.value);
    setGroupName(e.target.value);
  }
  useEffect(() => {
    setName(info.name);
    setDescription(info.description);
    setGroupName(info.groupName);
  }, [info])

  const [fieldName,setFieldName] = useState({
    template: '',
    station:''

});
  const onChange = (e: any) => {
    const { name, value } = e.target;
    setFieldName({ ...fieldName, [name]: value });
}
  return (
    <div className="crx-group-info-form CBX-input">
      <div className="crx-group-info">
      <div className="stationLabel">
                    <label>Unit Configuration Template</label>
                    <CRXSelectBox 
                    name="station"
                    defaultOptionText="None"
                    options={listItem}
                    onChange={onChange}
                    />
                </div>
        <div className="groupInfoInputs">
          <TextField required={true} label="Unit Id" value={name} className="userError" onChange={onChangeName} />
        </div>
        <div className="groupInfoInputs">
          <TextField label="Description" multiline variant="outlined" rows={1} value={description} onChange={onChangeDescription} />
        </div>
        <div className="groupInfoInputs">
          <TextField label="Group Name" multiline variant="outlined" rows={2} value={groupName} onChange={onChangeGroupName} />
        </div>
      </div>
    </div>
  );
};

export default UnitConfigurationInfo;
