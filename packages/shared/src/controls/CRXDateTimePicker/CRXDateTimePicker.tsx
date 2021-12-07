import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import './CRXDateTimePicker.scss'
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
type Props = {
  date: any;
  onChange: (e: any) => void;
  className? : string 
};
const CRXDateTimePicker: React.FC<Props> = ({ date, onChange, className }) => {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        style={{ width: "260px" }}
        id="datetime-local"
        type="datetime-local"
        value={date}
        defaultValue={date}
        className={"calenderInput CBX-datePicker "  + className}
        variant="outlined"
        onChange={onChange}
      />
    </form>
  );
};

export default CRXDateTimePicker;
