import React from 'react';
import { CRXModalDialog, CRXButton } from '@cb/shared';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    CRXSectionList: {
      width: '100%',
      maxWidth: '100%',
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 300,
      border: '1px solid #d1d2d4',
      paddingTop:'0'
    },
  }),
);


const TestModalPage = () => {

  const classes = useStyles();


    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
      setOpen(false);
      
    };
    
    const saveServerData = (v : React.MouseEvent<HTMLElement>) => {
        console.log("Open and close my popup", v);
        setOpen(false);
    }
    return (
      <div className="testClass">
        
        <CRXButton variant="outlined" color="primary" onClick={handleClickOpen}>
          Open simple dialog
        </CRXButton>
        <CRXModalDialog 
          maxWidth="lg" 
          saveButtonTxt="Primary action" 
          cancelButtonTxt="Secondary action" 
          title="Modal title here" 
          onSave={saveServerData} 
          modelOpen={open} 
          onClose={(e : React.MouseEvent<HTMLElement>) => handleClose(e)}
          secondaryButton={true}
        >
            Determine the max-width of the <b>dialog</b>. The dialog width grows with the size of the screen. Set to false to disable maxWidth.


            {/* <List className={classes.CRXSectionList + ' CRXSecList'}>
            {[0, 1, 2, 3, 4, 5 , 6 , 7 , 8 , 9 , 10 ,11 ,12 ,13 ,14 ,15].map((sectionId) => (
            
                  <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
           
            ))}
          </List> */}
          <div className="dailogBottonText">
            Another paragraph for information if needed. 
          </div>
        </CRXModalDialog>
      </div>
    );
}

export default TestModalPage;