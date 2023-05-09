import * as React from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CRXTooltip from "../CRXTooltip/CRXTooltip"
import './crx_MultiSelectBoxLight.scss'

const useSelectBoxStyle = makeStyles((theme: any) =>
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
      width: "auto",
      minHeight: "auto",
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#fff",
      zIndex : "inherit" as any,
      top: "2px",
      left: "0px",
      '& > ul': {
        padding: "0px",
        minHeight: "auto",
        overflowY: "auto",
        maxHeight: "332px",
      }
    },
    popper: {
      zIndex : 13001
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
    },
    noOptions: {
      color: "#333",
      backgroundColor: "#fff",
      fontSize : "14px",
    }
  }),
);

interface renderCheck {
  inputValue? : string,
  label?: string,
  id?: number,
}

const filter = createFilterOptions<renderCheck>();

interface multiSelectProps {
  multiple?: boolean,
  options: renderCheck[],
  onChange: (e: any, v: any) => void,
  onOpen: (e: any) => void,
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
  disabled?: boolean;
  freeSolo? : boolean
  isSuggestion? :boolean
  onInputChange: (e: any) => void,
}

const CRXMultiSelectBoxLight = ({
  id,
  multiple,
  options,
  onChange,
  onOpen,
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
  disabled,
  freeSolo=false,
  isSuggestion=true,
  onInputChange,

}: multiSelectProps) => {

  const classes = useSelectBoxStyle();
  const [styelHeight, setAutoHeight] = React.useState<string>('31px');
  const [isClear, setIsClearIcon] = React.useState<any>(true);
  const [controled, setControled] = React.useState<any>(<i className="fas fa-caret-down"></i>);

  const closeIcon: any = <CRXTooltip title="clear" placement="bottom-right" iconName="fas fa-times" className={classes.closeIcon} />

  const errorMessage = (error && <div className='crxDropdownValidationError'><i className="fas fa-exclamation-circle"></i>  <span className="crxErrorMsg"> {errorMsg}</span> </div>)
  const errClx = error && error ? " inputError" : " ";
  const lightBox = React.useRef(null)
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

  const [getSaveValue, setSaveValue] = React.useState<any>();
  React.useEffect(() => {
    setSaveValue(value)
  },[value])
  return (



    <>
      {label &&
        <>
          <Typography variant="subtitle1" className="label">
            {reformatedLabel()}
          </Typography>
        </>
      }
      <div className='selectInner_content selectInner_content_autoComplete '>
      <Autocomplete
        ref={lightBox}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        filterSelectedOptions={false}
        disableClearable={isClear}
        disableCloseOnSelect={true}
        freeSolo={freeSolo}
        // open={true}
        noOptionsText="No option available"
        autoHighlight={true}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        closeText=""
        clearText=""
        openText=""
        style={{ height: styelHeight }}
        className={"crx_MultiSelectBoxLight " + className + " " + errClx + " " + classes.root}
        classes={classes}
        multiple={multiple}
        id={id}
        value={value}
        disabled = {disabled}
        inputValue = {getSaveValue}
        onChange={(e: any, val:any) => {
          return onChange(e,val)
        }}
        onOpen={(e: any) => {
          return onOpen(e)
        }}
        options={options}
        getOptionLabel={option => option.label || option.inputValue}
        getOptionSelected={(option: any, value: any) => option.label == value.label}
        popupIcon={controled}
        closeIcon={closeIcon}
        renderOption={(option: any, { selected }) => (
          optionLabel(option, selected)
        )}
        onInputChange={typeof onInputChange === "function" ? onInputChange : () => {}}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if(isSuggestion) {
          // Suggest the creation of a new value
            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                label: params.inputValue,
              });
            }
          }
  
          return filtered;
        }}

        renderInput={(params: any) => (
          <TextField
            placeholder={value && value.length == 0 ? placeHolder : ""}
            onBlur={onBlur}
            error={error}
            variant="filled"
            InputLabelProps={{ required: required }}
            {...params}

          />
        )}
      />
      {error && errorMessage}
      </div>
    </>
  );
}

export default CRXMultiSelectBoxLight;