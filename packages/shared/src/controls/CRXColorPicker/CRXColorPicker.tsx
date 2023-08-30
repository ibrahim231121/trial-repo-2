import React from "react";
import Typography from "@material-ui/core/Typography";
import './CRXColorPicker.scss';
import { ColorPicker,Color } from "material-ui-color";

interface errorMessageType {
  required: string;
  validation: string;
}

interface ColorPickerProps {
  value: any;
  onChange: (event: any) => void;
  className?: string;
  id?: string;
  label?: string | undefined;
  disableTextfield?: boolean;
  hideTextfield?: boolean;
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  error? : boolean,
  errorMsg?: errorMessageType | string;
}

const CRXColorPicker = ({
  value,
  defaultValue,
  onChange,
  errorMsg,
  disableTextfield=false,
  hideTextfield=false,
  required = false,
  error,
  label,
  }: ColorPickerProps) => {

  const reformatedLabel = () => {
    if (required) {
      return (
        <label className="requiredLable">
          <span className="inputLabel">{label} </span>
          <span
            className="inputLabelReq"
            style={{ color: `${error ? "#aa1d1d" : "#000"}` }}
          >
            *
          </span>
        </label>
      );
    } else {
      return <span className="inputLabelNoReq">{label} </span>;
    }
  };
  const errorMsgIcon = (
    <i className="fas fa-exclamation-circle">
      <span className="crxErrorMsg"> {errorMsg}</span>
    </i>
  );
  return (    

    <React.Fragment>
          <div id={"colorPickerLabel"} className="gridFilterTextBox">
        <Typography variant="subtitle1" className="label">
          {reformatedLabel()}
        </Typography>
        <div className={`gridFilterSpanUi`}>
        <div className="colorBox">
          
          <ColorPicker 
          defaultValue={defaultValue}
          value={value || null} 
          onChange={(event:Color) => onChange(event)} 
          disableTextfield={disableTextfield}
          hideTextfield={hideTextfield}
          />
        </div>
        {error && (
            <Typography
              className="errorStateContent"
              variant="caption"
              display="block"
              gutterBottom
            >
              {errorMsgIcon}
            </Typography>
          )}
          </div>
      </div>
      
    </React.Fragment>
  );
}
export default CRXColorPicker;