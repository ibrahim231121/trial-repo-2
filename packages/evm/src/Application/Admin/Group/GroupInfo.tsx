import { TextField } from "@cb/shared";
import { FormatAlignCenter } from "@material-ui/icons";
import React, { useEffect } from "react";
import "./group.scss";
import { GroupInfoModel } from '../Group/Group'

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
      <label className="label">* Indicates required field</label>
      <div className="crx-group-info">
        <TextField required={true} label="Group Name" value={name} onChange={onChangeName} />
        <TextField label="Description" multiline variant="outlined" rows={4} value={description} onChange={onChangeDescription} />
      </div>
    </div>
  );
};

export default GroupInfo;
