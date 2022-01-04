import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { CRXMenu } from "@cb/shared";
import { urlList } from "../../utils/urlList";
import "./CreateElement.scss";


const useStyles = makeStyles({
    vb:{
        marginTop:"250px",
        marginLeft:"250px"
    }
});

const list = [
    {label: "BC03" , router: Object.entries(urlList)[16][0].toString()},
    {label: "BC04" , router: Object.entries(urlList)[15][0].toString()},
    {label: "In-Car" , router: Object.entries(urlList)[0][0].toString()},
    {label: "Master Dock" , router: Object.entries(urlList)[0][0].toString()}
]
const CreateComponent = () => {
    const classes = useStyles();
    return (
        <div className={classes.vb}>
            <CRXMenu 
                id="menuCreateTemplate"
                name="Create Template"
                btnClass="CreateElementButton"
                className="CreateElementMenu"
                MenuList = {list}
                disableRipple={true}
                horizontal="left"
            />
        </div>
    )
}

export default CreateComponent