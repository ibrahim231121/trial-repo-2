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
        padding:"57px 25px",
        paddingBottom : "55px",
        overflowY:"auto",
        minHeight: "calc(100vh - 220px)",
    },
  });

const CrxTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    const classes = useStyles()
    return (
      <div
        className={"cbxTabsContent " + classes.root}
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