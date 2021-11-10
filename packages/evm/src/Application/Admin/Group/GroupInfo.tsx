import { TextField } from "@cb/shared";
import { FormatAlignCenter } from "@material-ui/icons";
import React from "react";
import "./group.scss";

const GroupInfo = () => {
  return (
    <div className="crx-group-info-form CBX-input">
      <label className="label">* Indicates required field</label>
      <div className="crx-group-info">
      <TextField  required={true} label="Group Name" />
      <TextField label="Description" multiline variant="outlined" rows={4} />
    </div>
    </div>
  );
};

export default GroupInfo;
