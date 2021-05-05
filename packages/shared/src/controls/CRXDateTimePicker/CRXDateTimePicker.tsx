import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  })
);

export default function CRXDateTimePicker() {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        style={{ width: "260px" }}
        id="datetime-local"
        type="datetime-local"
        defaultValue="2017-05-24T10:30"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        onChange={(e) => console.log(e.target.value)}
      />
    </form>
  );
}
