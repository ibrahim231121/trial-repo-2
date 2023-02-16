import { TextField } from "@cb/shared";
import { FormatAlignCenter } from "@material-ui/icons";
import React, { useEffect } from "react";
import "../index.scss";
import { GroupInfoModel } from '..'
import { useTranslation } from "react-i18next";

type infoProps = {
  info: GroupInfoModel,
  onChangeGroupInfo: any,
  setIsSaveButtonDisabled: any,
  setErrorMessage: any,
  errorMessage: string
}
const GroupInfo: React.FC<infoProps> = ({ info, onChangeGroupInfo, setIsSaveButtonDisabled, errorMessage, setErrorMessage }) => {
  const { t } = useTranslation<string>();
  const [name, setName] = React.useState(info.name);
  const [description, setDescription] = React.useState(info.description);
  
  const onChangeName = (e: any) => {
    let groupName = e.target.value;
   
    if(groupName.length > 2)
    {
      setErrorMessage("")
    }

    onChangeGroupInfo(groupName, description);
    setName(groupName);
  }

  const OnFieldlBur = () => {

    if(name.length > 0 && name.length <=2)
    {
      setErrorMessage("Group Name is Less than 3 characters")
      setIsSaveButtonDisabled(true)
    }
    else if(name.length > 128)
    {
      setErrorMessage("Group Name is Greater than 128 characters")
      setIsSaveButtonDisabled(true)
    }
    else if(name.length == 0)
    {
      setErrorMessage("Group Name is required");
      setIsSaveButtonDisabled(true)
    }
    else {
      const chracterRegx = /^[a-zA-Z0-9-.\s]+$/.test(String(name).toLowerCase());
      if (!chracterRegx) {
        setErrorMessage("Please Provide a Valid Group Name");
        setIsSaveButtonDisabled(true)
      }
      else {
        setErrorMessage("");
        // setIsSaveButtonDisabled(false)
      }
    }
  }

  const onChangeDescription = (e: any) => {
    if(name.length == 0)
    {
      setErrorMessage("Group Name is required");
      setIsSaveButtonDisabled(true)
    }
    onChangeGroupInfo(name, e.target.value);
    setDescription(e.target.value);
  }
  useEffect(() => {
    setName(info.name);
    setDescription(info.description);
  }, [info])

  return (
    <div className="crx-group-info-form CBX-input">
      <label className="indicates-label"><b>*</b> {t("Indicates_required_field")}</label>
      <div className="crx-group-info">
        <div className="groupInfoInputs">
          <TextField required={true} label={t("Group_Name")} value={name} className="userError" onChange={onChangeName} error={errorMessage.length > 0} errorMsg={errorMessage} onBlur={OnFieldlBur}/>
       
        </div>
        <div className="groupInfoInputs">
          <TextField label={t("Description")} multiline variant="outlined" rows={4} value={description} onChange={onChangeDescription} />
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
