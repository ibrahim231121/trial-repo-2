import React, { useState } from 'react'
import { Menu, Button, MenuItem, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
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
        fontSize: "14px",
        "&:hover" : {
            backgroundColor : "transparent",
            color: "#fff",
            boxShadow: "none",
        },
    },
    paper : {
        maxHeight : "300px",
        width:"auto",
        minWidth : "180px",
        boxShadow: "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)"
    }
})

type RefType = {
    className? : string,
    lable : string,
    router? : object
}

// type horizontalPro = 'left' | 'right' | 'center';
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
    MenuList : RefType[],
    onClick:any //needs to be corrected
}


const Menus = ({id, iconHtml, iconButton, className, disableRipple = true, wrapper, name, btnClass, MenuList} : propsTypes) => {
    
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
        return <Link to={item.router}><MenuItem key={index}  onClick={item.onClick}>{item.label}</MenuItem></Link>
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
                <div className="menuLabel">{buttonChild}</div>
                {iconButton ? " " : <Icon className="CRXDRPIcon"><i className="fas fa-caret-down"></i></Icon>}
            </Button>
            <Menu
                anchorEl={open}
                id={id}
                elevation={0}
                getContentAnchorEl={null}
                keepMounted
                open={Boolean(open)}
                onClick={handleCloseMenu}
                onClose={handleCloseMenu}
                classes = {{
                    paper : customClass.paper + " " +  className
                }}
                
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
            
            >
            {ListOfMenu}
            </Menu>
        </div>
    )
}

export default Menus;