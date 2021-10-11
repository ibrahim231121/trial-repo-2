import { useState } from 'react';
import LanguageIcon from '@material-ui/icons/Language';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography, makeStyles } from '@material-ui/core';
const useStyles = makeStyles({
    icon: {
        fill: 'white',
    }
  })
export default function Language() {


  const classes = useStyles()
  return (
    <div  style={{
        backgroundColor:'rgb(15 13 14 / 60%)',
        position: 'absolute',
        top: '0px',
        right: '0px',
        zIndex: 9,
        display: "flex",
        width: "149px",
        height: "40px",
        justifyContent: 'center',
        alignItems: 'center',
        overflow:'hidden'
    }}>
      <LanguageIcon style={{
        color: 'white',
        marginRight:'10px'
    }}/>
       
    
         <Select
        disableUnderline
        style={{
            color: 'white',
        }}
        labelId="label" id="select" value="10"
        inputProps={{
            classes: {
                icon: classes.icon,
            },
        }}>
           
          <MenuItem value={10}>English</MenuItem>
          <MenuItem value={20}>Spanish</MenuItem>
          <MenuItem value={30}>French</MenuItem>
        </Select> 
     
    </div>
  );
}

