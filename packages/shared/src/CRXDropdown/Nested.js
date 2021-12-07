import React, { useState } from "react";
import NestedMenuItem from "material-ui-nested-menu-item";
import { makeStyles} from '@material-ui/core';

const nestedStyle = makeStyles({
    root : {
        backgroundColor : "transparent",
        color: "#444",//"#d1d2d4",
        border:"1px solid #444",
        textTransform : "none",
        "&:hover" : {
            backgroundColor : "#282828",
            color: "#fff",
        },
    },
})

const handleItemClick = (e) => {
    console.log(e)
}

export const Nested = (props) => {
    const classes = nestedStyle()
    return (
        <NestedMenuItem
            label={props.label}
            parentMenuOpen={props.position}
            onClick={handleItemClick}
        >
            {props.children}
        </NestedMenuItem>
    )
}