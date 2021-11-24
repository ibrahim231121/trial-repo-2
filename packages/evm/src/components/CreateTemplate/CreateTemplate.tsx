import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { CRXMenu } from "@cb/shared";
import "./CreateElement.scss";

const useStyles = makeStyles({
    vb:{
        marginTop:"250px",
        marginLeft:"250px"
    }
});

const list = [
    {label: "BC03" , router: "BC03"},
    {label: "BC04" , router: "BC04"},
    {label: "In-Car" , router: "In-Car"},
    {label: "Master Dock" , router: "Master Dock"}
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