import React, {useEffect, useRef} from 'react'
import Switch  from '@material-ui/core/Switch';
import { SmallSwitcher, LargeSwitcher } from './CBXSwitcherStyle'
import './CBXSwitcher.scss'

type styleProps = "dark" | "light"

type sizeProps = 'small' | "large"


type SwitcherProps = {
    id: string,
    checked : any,
    onChange : (e : any) => void,
    size  : sizeProps,
    name  : string,
    theme : styleProps | undefined,
    disabled: boolean | undefined,
    toggleActiveText : string,
    toggleInActiveText : string,
    labelWidth : number,
    toggleLabel? : boolean,
    rootClass : string,
    className : string,
    tabIndex: number
}
const CBXSwitcher = (props : SwitcherProps) => {
    const inputRef = useRef(null);
    const togRef = useRef<any>(null)
    const {
        id,
        checked, 
        onChange, 
        size, 
        name, 
        theme = 'light', 
        disabled,
        toggleInActiveText = "OFF",
        toggleActiveText = "ON",
        toggleLabel = false,
        labelWidth = 32,
        rootClass,
        className,
        tabIndex,
    } : SwitcherProps = props
    const SmallSwitcherStyle = SmallSwitcher(props)
    const LargeSwitcherStyle = LargeSwitcher(props)
    
    useEffect(() => {
        const divPaent =  togRef.current
        const parent = document.getElementById("_toggle_button_" + name)
        const toggleClass = document.querySelectorAll(".crxToggle")
        
        divPaent && parent?.addEventListener('keyup', () => {
            
            toggleClass.forEach(element => {
                if(element.id === togRef.current.id) {
                    divPaent.classList.toggle("toggleFocus")
                }else {
                    element.classList.remove("toggleFocus")
                }
            })
                
        })
       
    },[])
   
    return (
        <div className={rootClass + ' _CBX_customized_Switcher'}>
              
            {toggleLabel &&
                <div className={
                    `${theme === "dark" ? "_darkSwitcherLabel" : "_LightSwitcherLabel" }
                    _switcher_label`}
                    style={{width : labelWidth + "px"}}
                >
                    {checked === true ? toggleActiveText : toggleInActiveText}
                </div>
            }
            {size === "small" ?
            <div id={"_toggle_button_" + name}  ref={togRef} className={`small_toggle_button crxToggle ${(theme === "light") ? "lightBorder" : "darkBorder " }`}>
              
            <Switch
                inputRef={inputRef} 
                tabIndex={tabIndex}
                id={id}
                checked={checked} 
                onChange={onChange} 
                className={className}
                classes={{
                    ...SmallSwitcherStyle
                }}
                disabled={disabled}
                name={name} 
            />
            </div>
            : 
            <div id={"_toggle_button_" + name}  ref={togRef}  className={`large_toggle_button crxToggle  ${(theme === "light") ? "lightBorder" : "darkBorder" }`}>
            <Switch 
                inputRef={inputRef} 
                tabIndex={tabIndex}
                id={id}
                checked={checked} 
                onChange={onChange} 
                className={className}
                disabled={disabled}
                classes={{
                    ...LargeSwitcherStyle
                }}
                name={name} />
            </div>
            }
            
        </div>
    )
}

export default CBXSwitcher;