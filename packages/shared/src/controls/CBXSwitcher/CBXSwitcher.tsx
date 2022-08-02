import React from 'react'
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
    className : string
}
const CBXSwitcher = (props : SwitcherProps) => {
    
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
        className
    } : SwitcherProps = props
    const SmallSwitcherStyle = SmallSwitcher(props)
    const LargeSwitcherStyle = LargeSwitcher(props)
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
            <div className={`small_toggle_button ${(theme === "light") ? "lightBorder" : "darkBorder" }`}> <Switch 
            id={id}
            checked={checked} 
            onChange={onChange} 
            className={className}
            classes={{
                ...SmallSwitcherStyle
            }}
            disabled={disabled}
            name={name} />
            </div>
            : 
            <div className={`large_toggle_button ${(theme === "light") ? "lightBorder" : "darkBorder" }`}>
            <Switch 
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