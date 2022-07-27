import React from 'react';
import {
  CRXMultiSelectBoxLight,
  CBXSwitcher
} from '@cb/shared';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

interface renderCheck {
  inputValue? : string,
  label?: string,
  id?: number,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

const darkUseStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: "#444",
      background: "#404041"
    },
  }),
);

const TabsDemo = () => {
  const classes = useStyles();
  const clx = darkUseStyles()
  const searchAbleOpt:renderCheck[] =  [
    { label: 'The Shawshank Redemption', id: 1994 },
    { label: 'The Godfather', id: 1972 },
    { label: 'The Godfather: Part II', id: 1974 },
    { label: 'The Dark Knight', id: 2008 },
    { label: '12 Angry Men', id: 1957 },
    { label: "Schindler's List", id: 1993 },
    { label: 'Pulp Fiction', id: 1994 },
    { label: 'The Good, the Bad and the Ugly', id: 1966 },
    { label: 'Fight Club', id: 1999 },
    { label: 'Naked weppan', id: 2000 },
    { label: 'Avengers', id: 2001 },
  ];
  
  const [singleSelect, setSingleSelect] = React.useState<renderCheck[]>();

  const onChangeSelectSingle = (e: React.SyntheticEvent, val: renderCheck[]) => {
    setSingleSelect(val);
  }

  const [state, setState] = React.useState<any>({
    checkedC : false,
    checkedD : false,
    checkedDark : false,
    checkedBD : false,
    disabledLight : false
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked});
  };
  return (
    <div className="App" style={{ marginTop: "130px", marginLeft: "90px" }}>
      <div className="inlineDiv">
        {/* <div className="columnse">
          <CRXMultiSelectBoxLight
            id="multiSelect"
            multiple={true}
            value={singleSelect}
            onChange={(e: React.SyntheticEvent, option: renderCheck[]) => { return onChangeSelectSingle(e, option) }}
            options={searchAbleOpt}
            CheckBox={true}
            checkSign={false}
            required={true}
            freeSolo={true}
          />
        </div>
         */}
       

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <CBXSwitcher 
          checked={state.checkedC} onChange={handleChange} theme="light" name="checkedC" size="small"
        />
        </Paper>
        </Grid>
        <Grid item xs={4}>
        <Paper className={clx.paper}>
          <CBXSwitcher 
          checked={state.checkedDark} 
          theme="dark" 
          onChange={handleChange} 
          name="checkedDark" 
          size="small"
          toggleActiveText="SHOW"
          toggleInActiveText="HIDE"
          labelWidth={44}
          />
          </Paper>
        </Grid>
        <Grid item xs={4}>
        <Paper className={classes.paper}>
        <CBXSwitcher 
          checked={state.disabledLight} disabled={true} theme="light" onChange={handleChange} name="disabledLight" size="small"
          />
        </Paper>
        </Grid>

        <Grid item xs={4}>
        <Paper className={classes.paper}>
          <CBXSwitcher 
          checked={state.checkedD} onChange={handleChange} theme="light" name="checkedD" size="large"
        />
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper className={clx.paper}>
          <CBXSwitcher 
          checked={state.checkedBD} onChange={handleChange} theme="dark" name="checkedBD" size="large"
        />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
          <CBXSwitcher 
            checked={state.disabledBig}  disabled={true} onChange={handleChange} theme="light" name="disabledBig" size="large"
          />
          </Paper>
        </Grid>
        
      </Grid>
      </div>

    </div>
  );
}

export default TabsDemo;