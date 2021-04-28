import React, { useState } from 'react'
import { Menu, Button, MenuItem, Icon } from '@material-ui/core';
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

type RefType = {
    className? : string,
    lable : string,
    router? : object
}

type propsTypes = {
    wrapper? : string,
    name : string,
    btnClass : string,
    id? : any,
    disableRipple? : boolean,
    children : React.ReactNode,
    className? : string,
    iconButton? : boolean,
    iconHtml? : React.ReactNode,
    MenuList : RefType[]

}


const Menus = ({id, iconHtml, iconButton, className, disableRipple, wrapper, name, btnClass, MenuList} : propsTypes) => {
    
    const customClass = DropdownStyle()
    const [open, setAnchorOpen] = useState(null);
    const [active , setActive] = useState<boolean>(false);
    const handleOpenMenu = (event : any) => {
        
        setAnchorOpen(event.currentTarget);
        setActive(true);
    };
    
    const handleCloseMenu = () => {
        setAnchorOpen(null);
        setActive(false);
    };

    const activeClass:string = active ? "active" : "remove" ;

    const buttonChild = iconButton ? iconHtml : name;

    const ListOfMenu = MenuList.map((item:any, index:number) => {
        return <MenuItem key={index}>{item.label}</MenuItem>
    });
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
                {buttonChild}
                {iconButton ? " " : <Icon className="CRXDRPIcon"><ArrowDropDownIcon /></Icon>}
            </Button>
            <Menu
                anchorEl={open}
                id={id}
                elevation={0}
                getContentAnchorEl={null}
                keepMounted
                open={Boolean(open)}
                onClose={handleCloseMenu}
                classes = {{
                    paper : className 
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
            
            >
            {ListOfMenu}
            </Menu>
        </div>
    )
}

export default Menus;