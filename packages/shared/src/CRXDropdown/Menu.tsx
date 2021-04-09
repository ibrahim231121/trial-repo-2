import React, { useState } from 'react'
import { Menu, Button, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import "./DropDown.scss"
const DropdownStyle = makeStyles({
    button : {
        backgroundColor : "transparent",
        color: "#d1d2d4",//"#d1d2d4",
        border:"0px solid #fff",
        textTransform : "none",
        boxShadow: "none",
        alignItems: "flex-end",
        padding: "0px",
        fontSize: "13px",
        "&:hover" : {
            backgroundColor : "transparent",
            color: "#fff",
            boxShadow: "none",
        },
    },
})

type propsTypes = {
    wrapper? : string,
    name : string,
    ref : React.RefAttributes<any>,
    btnClass : string,
    id : any,
    disableRipple? : boolean,
    children : React.ReactNode,
    className? : string,
}
const Menus = React.forwardRef(({id, className, disableRipple = true, children, wrapper, name, btnClass} : propsTypes) => {
    
    const customClass = DropdownStyle()
    const [open, setAnchorOpen] = useState(null);
    const [active , setActive] = useState<boolean>(false);
    const drpMenu = React.useRef();
    const handleOpenMenu = (event : any) => {
        
        setAnchorOpen(event.currentTarget);
        setActive(true);
    };
    
    const handleCloseMenu = () => {
        setAnchorOpen(null);
        setActive(false);
    };

    const activeClass:string = active ? "active" : "remove" ;
    return (
        <div className={"GetacMenu " + wrapper}>
            <Button
                aria-controls={id}
                aria-haspopup="true"
                variant="contained"
                className={"CRXDropDownBtn " + customClass.button + " " + btnClass + " " +  activeClass }
                onClick={handleOpenMenu}
                disableRipple={disableRipple}
                >
                 {name}
                <Icon className="CRXDRPIcon"><ArrowDropDownIcon /></Icon>
            </Button>
            <Menu
            anchorEl={open}
            ref={drpMenu}
            id={id}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
                keepMounted
                open={Boolean(open)}
                onClose={handleCloseMenu}
                classes = {{
                    paper : className 
                }}
            
            >
            {children}
            </Menu>
        </div>
    )
})

export default Menus;