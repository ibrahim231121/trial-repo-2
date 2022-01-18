import { TextField } from "@cb/shared";
import { FormatAlignCenter } from "@material-ui/icons";
import React, { useEffect } from "react";
import "../index.scss";
import { GroupInfoModel } from '..'

type infoProps = {
  info: GroupInfoModel,
  onChangeGroupInfo: any
}
const GroupInfo: React.FC<infoProps> = ({ info, onChangeGroupInfo }) => {
  const [name, setName] = React.useState(info.name);
  const [description, setDescription] = React.useState(info.description);
  const onChangeName = (e: any) => {
    onChangeGroupInfo(e.target.value, description);
    setName(e.target.value);
  }
  const onChangeDescription = (e: any) => {
    onChangeGroupInfo(name, e.target.value);
    setDescription(e.target.value);
  }
  useEffect(() => {
    setName(info.name);
    setDescription(info.description);
  }, [info])

  return (
    <div className="crx-group-info-form CBX-input">
      <label className="indicates-label"><b>*</b> Indicates required field</label>
      <div className="crx-group-info">
        <div className="groupInfoInputs">
          <TextField required={true} label="Group Name" value={name} className="userError" onChange={onChangeName} errorMsg={"Group name is required"}/>
        </div>
        <div className="groupInfoInputs">
          <TextField label="Description" multiline variant="outlined" rows={4} value={description} onChange={onChangeDescription} />
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
