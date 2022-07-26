import React from 'react'
import Switch  from '@material-ui/core/Switch';
import { SmallSwitcher, LargeSwitcher } from './CBXSwitcherStyle'

type styleProps = "dark" | "light"

type sizeProps = 'small' | "large"


type SwitcherProps = {
    checked : any,
    onChange : (e : any) => void,
    size  : sizeProps,
    name  : string,
    theme : styleProps | undefined,
    disabled: boolean | undefined
}
const CBXSwitcher = (props : SwitcherProps) => {
    
    const {checked, onChange, size, name, theme = 'light', disabled} : SwitcherProps = props
    const SmallSwitcherStyle = SmallSwitcher(props)
    const LargeSwitcherStyle = LargeSwitcher(props)
    return (
        <div className='_CBX_customized_Switcher'>
            <div className={
                `${theme === "dark" ? "_darkSwitcherLabel" : "_LightSwitcherLabel" }
                 _switcher_label`}
            >
                {checked === true ? "ON" : "OFF"}
            </div>
            
            {size === "small" ? <Switch 
            checked={checked} 
            onChange={onChange} 
            className={`${checked && "small_checked "}${(checked && theme === "light") ? "lightBorder" : "darkBorder" }`}
            classes={{
                ...SmallSwitcherStyle
            }}
            disabled={disabled}
            name={name} />
            : 
            <Switch 
                
                checked={checked} 
                onChange={onChange} 
                className={`${checked && "large_checked "}${(checked && theme === "light") ? "lightBorder" : "darkBorder" }`}
                disabled={disabled}
                classes={{
                    ...LargeSwitcherStyle
                }}
                name={name} />
            }
        </div>
    )
}

export default CBXSwitcher;