import { TextField , CRXSelectBox} from "@cb/shared";
import AppsIcon from '@material-ui/icons/Apps';
import "./innerDeviceTemplate.scss";
import { useEffect, useState } from "react";




const listItem = [
    {
        value:1,
        displayText: "station 1"
    },
    {
        value:2,
        displayText: "station 2"
    },
    {
        value:3,
        displayText: "station 3"
    }
]


const TemplateInformation = ({formVal} :any ) => {


    const [fieldName,setFieldName] = useState({
        template: '',
        station:''
    
    });

    const onChange = (e: any) => {
        const { name, value } = e.target;
        setFieldName({ ...fieldName, [name]: value });
    }
    
    const { template  } = fieldName;
    const vb = !template   ;   
    formVal(vb)


    return (
        
        <div className="crxTemplateInformation crx-group-info-form CBX-input">
            <label className="label">* Indicates required field</label>
            <div className="crx-group-info">
                <TextField onChange={onChange}  placeholder="loremipusus-template name"  name="template" required={true} label="Template Name" />
                <div className="stationLabel">
                    <label>Station</label>
                    <CRXSelectBox 
                    name="station"
                    defaultOptionText="station"
                    options={listItem}
                    onChange={onChange}
                    />
                </div>
            </div>
        </div>
    )
}


export default TemplateInformation;