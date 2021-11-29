import React, {useState} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import './globalSelectBox.scss'

const icon = <i className="far fa-square selectBoxIcon"></i>//<CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <i className="far fa-check-square selectBoxIconCecked "></i>


const useSelectBoxStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor : "#fff",
      border: "2px solid transparent",
      outline:"1px solid #888787",
      paddingLeft:"6px",
     fontFamily:"Arial",
      '&:hover' : {
        outline:"1px solid #888787",
      },
      
      '& > *': {
        margin: theme.spacing(0),
      },
    },

    focused: {
      border: "2px solid #fff",
      outline:"1px solid #888787",
      '&:over' : {
        border: "2px solid #fff",
        outline:"1px solid #888787",
      }
    },
    icon : {
        color : "#D1D2D4",
        fontSize:"14px",
        fontWeight : "normal",
        paddingRight:"7px",
        marginTop: "1px",
        '&:hover' : {
          color : "#333333"
        }
    },

    paper : {
        borderRadius:"0px",
        border: "1px solid #707070",
        boxShadow: "0px 0px 5px #00000033",
        marginTop:"0px",
        marginLeft:"0px",
        maxHeight:"332px",
        minHeight:"165px",
        overflowY: "auto",
        width:"326px",
        position:"relative",
        backgroundColor:"#404041",
        top:"3px",
        left:"-8px",
        '& > ul' : {
            padding: "0px",
            maxHeight: "100vh",
            overflow: "hidden"
        }
    },  
    popper: {
      
    },
    clearIndicator: {
      color: "#333333",
      background:"transparent",
      fontSize:"12px",
      padding : "0px 0px 0px",
      '&:hover' : {
        background:"transparent",
      },
      "&:i" : {
        fontWeight:"bold",
      }
    },
    endAdornment : {
      right : "10px !important",
      top:"3px"
      
    },
    option: {
        height: '33px',
        fontFamily : "Arial, Helvetica, sans-serif",
        color: "#D1D2D4",
        fontSize: "14px",
        alignItems: 'flex-start',
        padding: "0px 15px",
        placeItems: "center",
        '&[aria-selected="true"]': {
            backgroundColor : "#231F20",
            color:"#D1D2D4",
            '&:hover' : {
              backgroundColor : "#6E6E6E",
              color: "#F5F5F5",
            }
        },
        // '&[data-focus="true"]': {
        //   backgroundColor: "#6E6E6E",
        //   color: "#F5F5F5",
        // },
        '&:hover' : {
            backgroundColor : "#231F20",
            color:"#D1D2D4"
        },
        '&:focus' : {
            backgroundColor : "#6E6E6E",
            color:"#F5F5F5",
        },
      },
      popupIndicator: {
        backgroundColor: "transparent",
        color:"#333",
        fontSize:"21px",
        paddingRight : "3px",
        paddingTop:"0px",
        '&:hover' : {
          backgroundColor: "transparent",
        }
      },

      popupIndicatorOpen : {
        transform: "rotate(0deg)"
      },
      tag: {
        backgroundColor:'#fff',
        border:"1px solid #bebebe",
        borderRadius:"1px",
        color:"#333",
        padding:"0px",
        height:"22px",
        position: "relative",
        marginRight:"4px",
        marginLeft:"3px",
        top: "0px",
        '&:hover' : {
          backgroundColor:'#F3F4F5',
          border:"1px solid #888787",
          color: "#333333",
          '&:after' : {
            color : "#333333"
          }
        },
        '&:span' : {
          padding : "0px"
        },
      }
    }),
);


interface selectBoxProps {
    multiple? : boolean,
    options: any[],
    value?: any[],
    CheckBox?: boolean,
    id? : string,
    className?: string,
    onChange: (e:any) => void,
    onInputChange?: (e:any) => void,
    autoComplete? : boolean,
    // autoSelect? : boolean,
    open?: boolean,
    getOptionLabel: (option : any) => string
    inputFocus?: any,
    getOptionSelected? : (option : any, value : any) => boolean,
    checkSign? : boolean,
    onClose? : (e : object, reason : string) => void,
    filterOptions? : any,
    clearSelectedItems? : (e:React.SyntheticEvent) => void
}

interface renderCheck {
    selected? : boolean
    value? : string,
    id? : string,   
    
}

const CRXGlobalSelectFilter = ({multiple = false, clearSelectedItems, value, checkSign=false, getOptionLabel, getOptionSelected, autoComplete = false, onChange, options, onInputChange, CheckBox, id, className} : selectBoxProps) => {
    const data = options;
    const classes = useSelectBoxStyle()
    const changeStyle = multiple ? "filteredStyle" : " ";
    const opupOpenCret = checkSign || CheckBox ?  <i className="fas fa-caret-down"></i> : " ";
    const [disableClearableState, setDisableClearableState] = useState(false);
    const [changeDesign, setChangeDesign] = useState<boolean>(false)
    const [opens, setOpen] = useState<boolean>(false)
    const [valState, setValState] = useState<any[]>();
    //const inputRefs = useRef(null)
    const renderCheckBox = (option  : renderCheck , selected : boolean) => {
        
        if(CheckBox === true) {
          
        return (
            <>
            {console.log("selected", selected)}
            {setDisableClearableState(true)}
            <Checkbox
                disableRipple
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 5, paddingLeft:0 }}
                checked={selected}
            />
            {option.value ? option.value : " "}
            </>
        )
        } else if(checkSign == true) {
          setDisableClearableState(true);
            return (
              <React.Fragment>
              <i
                className="fas fa-check checkIcon"
                style={{ visibility: selected ? 'visible' : 'hidden' }}
              />
              {option.value}
              
            </React.Fragment>
            );
        }else {
          return (
          <React.Fragment>
          {option.value}
          </React.Fragment>
          )
        }
    }
  
  // const selectedValue = () => {
  //   value && value.map((d, _) => {
  //   debugger;
  //    return setValState(d.value);
  //  });
  // }
  
  const onCloseHandler = (e: any, v:any) => {
    console.log(e, v)
    setOpen(false);
    value && value.length > 0 ? setChangeDesign(true) : setChangeDesign(false)
  }
  
  const conditionlOpen = (e : any) => {
    setOpen(true);
    setChangeDesign(false);
    return overlayFunction(e);
    // !inputRefs && inputRefs.current.focus();
  }

  const overlayFunction = (_:any) => {
    setOpen(true);
    setChangeDesign(false)
  }

  React.useEffect(() => {
    
    if(value === []){
      setChangeDesign(false);
    }
    setValState(value)
   
  },[valState])
  const closeIcon = <i className="icon-cross"></i>

  return (
    
    <div className="gridFilterGlobal">   
    {
      changeDesign && <div className="afterSelectedValue">
        <button onClick={conditionlOpen} className="filterOpenButton">
          <i className="fas fa-filter"></i>
        </button>
        <button className="filterCloseButton" onClick={clearSelectedItems}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    }
    
    <Autocomplete
      multiple = {multiple}
      autoComplete={autoComplete}
      disableClearable={disableClearableState}
      className={ "crx-global-Select darkTheme " + className + " " + classes.root + " " + changeStyle}
      id={id}
      open={opens}
      closeIcon={closeIcon}
      onClose={(e: any, v:any) => {return onCloseHandler(e, v)}}
      onMouseDown={() => console.log("opens", opens)}
      value={valState}
      options={data}
      popupIcon={opupOpenCret}
      disableCloseOnSelect
      autoSelect={false}
      openOnFocus={false}
      onOpen={(e : any) => conditionlOpen(e)}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      renderOption={(option : any, { selected }) => (
        renderCheckBox(option, selected)
      )}
      // onFocus ={(e:any) => { 
      //   setOpen(true)
      // }}
      // onBlur={(e:any)=>{ 
      //   setOpen(false)
      // }}
      classes={classes}
      onInputChange={onInputChange}
      onChange={onChange}
      renderInput={(params : object) => (
        <>
        
        <TextField className="selectBoxTextField" onClick={(e:any) => overlayFunction(e)} {...params} variant="outlined"/>
      </>
      )}
    
    />
    
    </div>
  );
}

export default CRXGlobalSelectFilter;