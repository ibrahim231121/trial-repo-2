import {useEffect, useState} from "react";
import "./innerDeviceTemplate.scss";
import { TextField} from "@cb/shared";


const UnitSettings = ({formVal} : any) => {

    const [UnitSettingsField, setUnitSettingsField ] = useState({
        ModeField:'',
        GroupNameField: '',
        CategoriesField:''
    })

    const onChange = (e: any) => {
        const {name , value} = e.target;
        setUnitSettingsField({...UnitSettingsField,[name]: value });
    }
    
    const {ModeField , GroupNameField , CategoriesField} = UnitSettingsField;
    const valid = ModeField.length === 0 || GroupNameField.length ===0 || CategoriesField.length === 0;
    formVal(valid);

    return (
        <div className="crxUnitSetting  ">
            <TextField onChange={onChange} placeholder="loremipusus-template name"  name="ModeField" label="Mode" />
            <TextField onChange={onChange} placeholder="lorem" name="GroupNameField"  label="Group Name" />
            <label className="cusLabel">Categorize Mandatory?</label>
            <TextField onChange={onChange} placeholder="lorem"  name="CategoriesField" label="Categories" />
        </div>
    )
}


export default UnitSettings;