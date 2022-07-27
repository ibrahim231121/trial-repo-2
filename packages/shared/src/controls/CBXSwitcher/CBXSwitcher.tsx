import React from 'react'
import Switch  from '@material-ui/core/Switch';
import { SmallSwitcher, LargeSwitcher } from './CBXSwitcherStyle'
import './CBXSwitcher.scss'

type styleProps = "dark" | "light"

type sizeProps = 'small' | "large"


type SwitcherProps = {
    checked : any,
    onChange : (e : any) => void,
    size  : sizeProps,
    name  : string,
    theme : styleProps | undefined,
    disabled: boolean | undefined,
    toggleActiveText : string,
    toggleInActiveText : string,
    labelWidth : number
}
const CBXSwitcher = (props : SwitcherProps) => {
    
    const {
        checked, 
        onChange, 
        size, 
        name, 
        theme = 'light', 
        disabled,
        toggleInActiveText = "OFF",
        toggleActiveText = "ON",
        labelWidth = 32
    } : SwitcherProps = props
    const SmallSwitcherStyle = SmallSwitcher(props)
    const LargeSwitcherStyle = LargeSwitcher(props)
    return (
        <div className='_CBX_customized_Switcher'>
            
            <div className={
                `${theme === "dark" ? "_darkSwitcherLabel" : "_LightSwitcherLabel" }
                 _switcher_label`}
                 style={{width : labelWidth + "px"}}
            >
                {checked === true ? toggleActiveText : toggleInActiveText}
            </div>
            
            {size === "small" ?
            <div className={`small_toggle_button ${(theme === "light") ? "lightBorder" : "darkBorder" }`}> <Switch 
            checked={checked} 
            onChange={onChange} 
            className=""
            classes={{
                ...SmallSwitcherStyle
            }}
            disabled={disabled}
            name={name} />
            </div>
            : 
            <div className={`large_toggle_button ${(theme === "light") ? "lightBorder" : "darkBorder" }`}>
            <Switch 
                
                checked={checked} 
                onChange={onChange} 
                className=""
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