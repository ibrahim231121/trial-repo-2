import React from "react";
import { makeStyles } from '@material-ui/core/styles';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  const useStyles = makeStyles({
    root: {
        border:"1px solid #878787",
        borderTop: "0px",
        padding:"25px",
        paddingBottom : "0px",
        overflowY:"auto",
        '@media only screen and (max-width: 1920px)': {
          height : "644px"
        },
        '@media only screen and (max-width: 1600px)': {
          height : "432px"
        },
        '@media only screen and (max-width: 1366px)': {
          height : "305px"
        }
    },
  });

const CrxTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    const classes = useStyles()
    return (
      <div
        className={classes.root}
        role="tabpanel"
        hidden={value !== index}
        id={`crx-tabpanel-${index}`}
        aria-labelledby={`crx-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div key={index}>{children}</div>
        )}
      </div>
    );
  }

  export default CrxTabPanel;