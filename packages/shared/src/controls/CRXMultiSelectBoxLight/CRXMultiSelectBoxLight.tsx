import * as React from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import './crx_MultiSelectBoxLight.scss'

const useSelectBoxStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#fff",
      outline: "none",
      width:"384px",
      border:"1px solid #d1d2d4",
      paddingLeft:"5px",
      '&:hover' : {
        border:"1px solid #888787",
        transition:"all 0.25s ease-in-out",
        outline: "none",
      },

      '& > *': {
        margin: theme.spacing(0),
      },
    },

    focused: {
      outline: "3px solid #888787",
      border: "1px solid transparent",
      transition: "all 0.25s ease-in-out",
      '&:hover': {
        outline: "3px solid #888787",
        border: "1px solid transparent",
        transition: "all 0.25s ease-in-out",
      }
    },
    icon : {
        color : "#d1d2d4",
        fontSize:"14px",
        fontWeight : "normal",
        paddingRight:"7px",
        marginTop: "1px",
        '&:hover' : {
          color : "#333333"
        }
    },

    paper: {
      borderRadius: "0px",
      border: "1px solid #707070",
      boxShadow: "0px 0px 5px #00000033",
      marginTop: "0px",
      marginLeft: "-7px",
      maxHeight: "332px",
      width: "388px",
      minHeight: "165px",
      overflowY: "auto",
      position: "relative",
      backgroundColor: "#fff",
      top: "2px",
      left: "0px",
      '& > ul': {
        padding: "0px",
        maxHeight: "100vh",
        overflow: "hidden",
      }
    },
    popper: {

    },
    option: {
      height: '33px',
      fontFamily: "Arial, Helvetica, sans-serif",
      color: "#333",
      fontSize: "14px",
      alignItems: 'flex-start',
      padding: "0px 2px",
      placeItems: "center",
      '&[aria-selected="true"]': {
        backgroundColor: "#6E6E6E",
        color: "#F5F5F5",
        '&:hover': {
          backgroundColor: "#6E6E6E",
          color: "#F5F5F5",
        }
      },
      // '&[data-focus="true"]': {
      //   backgroundColor: "#6E6E6E",
      //   color: "#F5F5F5",
      // },
      '&:hover': {
        backgroundColor: "#F5F5F5",
      },
      '&:focus': {
        backgroundColor: "#6E6E6E",
        color: "#F5F5F5",
      },
    },
    popupIndicator: {
      backgroundColor: "transparent",
      color: "#333",
      fontSize: "21px",
      paddingRight: "3px",
      paddingTop: "4px",
      '&:hover': {
        backgroundColor: "transparent",
      }
    },

    popupIndicatorOpen: {
      transform: "rotate(0deg)"
    },
    tag: {
      backgroundColor: '#fff',
      border: "1px solid #bebebe",
      borderRadius: "1px",
      color: "#333",
      padding: "0px",
      height: "20px",
      lineHeight: "20px",
      position: "relative",
      marginRight: "16px",
      marginLeft: "2px",
      marginTop: "0",
      marginBottom: "6px",
      top: "0",
      '&:hover': {
        backgroundColor: '#F3F4F5',
        border: "1px solid #888787",
        color: "#333333",
        '&:after': {
          color: "#333333"
        }
      },
      '&.MuiChip-label': {
        padding: "0px"
      },

    },
    closeIcon: {
      position: "relative",
      fontSize: "16px",
      left: "4px",
      top: "2px"
    },

    clearIndicator: {
      visibility: "visible",
      '&:hover': {
        background: "none"
      }
    }
  }),
);

interface multiSelectProps {
  multiple?: boolean,
  options: any[],
  onChange: (e: any, v: any) => void,
  id: string,
  defaultValue?: any[],
  className?: string,
  value: any[],
  autoComplete?: boolean,
  placeHolder?: string,
  onBlur?: (e: any) => void,
  error?: boolean,
  required?: boolean,
  errorMsg?: string,
  label?: string,

}

const CRXMultiSelectBoxLight = ({
  id,
  multiple,
  options,
  onChange,
  defaultValue,
  className,
  value,
  label,
  autoComplete = false,
  onBlur,
  placeHolder,
  error,
  required,
  errorMsg,
}: multiSelectProps) => {

  const classes = useSelectBoxStyle();
  const [styelHeight, setAutoHeight] = React.useState<string>('31px');
  const [isClear, setIsClearIcon] = React.useState<any>(true);
  const [controled, setControled] = React.useState<any>(<i className="fas fa-caret-down"></i>);
  const closeIcon: any = <i className={"fas fa-times" + " " + classes.closeIcon}></i>
  const errorMessage = (error && <div className='crxDropdownValidationError'><i className="fas fa-exclamation-circle"></i>  <span className="crxErrorMsg"> {errorMsg}</span> </div>)
  const errClx = error && error ? " inputError" : " ";

  React.useEffect(() => {

    value && value.length > 1 ? setAutoHeight("auto") : setAutoHeight("31px");

    if (multiple == false && value != undefined) {
      if (Object.keys(value).length > 0) {
        setControled('')
        setIsClearIcon(false);
      }
    } else {
      setControled(<i className="fas fa-caret-down"></i>)
      setIsClearIcon(true);
    }
  }, [value, styelHeight])


  const reformatedLabel = () => {
    if (required) {
      return (
        <span className="requiredLable">
          {label}{" "}
          <span style={{ color: `${error ? "#aa1d1d" : "#000"}`, paddingLeft: "8px", fontWeight: "bold" }}>*</span>
        </span>
      );
    } else {
      return <span>{label} </span>;
    }
  };

  const optionLabel = (option: any, selected: boolean) => {
    if (multiple && multiple == true) {
      return (<> <i
        className="far fa-check checkIconSingle"
        style={{ visibility: selected && multiple ? 'visible' : 'hidden' }}
      ></i>
        {option.label}
      </>)
    } else {
      return <span className="singleLabel">{option.label}</span>
    }
  }
  return (



    <>
      {label &&
        <span>
          <Typography variant="subtitle1" className="label">
            {reformatedLabel()}
          </Typography>
        </span>
      }
      <Autocomplete
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        filterSelectedOptions={false}
        disableClearable={isClear}
        disableCloseOnSelect={true}
        // freeSolo
        //open={true}
        closeText=""
        openText=""
        style={{ height: styelHeight }}
        className={"crx_MultiSelectBoxLight " + className + " " + errClx + " " + classes.root}
        classes={classes}
        multiple={multiple}
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        getOptionLabel={option => option.label || ""}
        getOptionSelected={(option: any, value: any) => option.label == value.label}
        popupIcon={controled}
        closeIcon={closeIcon}
        renderOption={(option: any, { selected }) => (
          optionLabel(option, selected)
        )}

        renderInput={(params: any) => (
          <TextField
            placeholder={placeHolder}
            onBlur={onBlur}
            error={error}
            helperText={errorMessage}
            variant="filled"
            InputLabelProps={{ required: required }}
            {...params}

          />
        )}
      />

    </>
  );
}

export default CRXMultiSelectBoxLight;