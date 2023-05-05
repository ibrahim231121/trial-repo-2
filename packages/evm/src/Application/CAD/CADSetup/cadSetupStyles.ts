import {
    createStyles,
    makeStyles,
    Theme,
  } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cadSetupMainContainer: {
      width: '100%',
      paddingTop: 110,
      padding: '0 4px 0px 65px',
      transition: '0.5s padding ease-out'
    },

    mappingMainContainer: {
      width: '100%',
      display: 'flex'
    },

    tabsContainer: {
      transition: 'width 2s',
      paddingTop: '5px',
    },

    xmlContainer: {
      transition: 'width 2s',
      position: 'relative',
      //background: '#F2F3F4',
      border: '1px solid #878787',
      height: '800px',
      zIndex: 100
    },

    settingsButton: {
      position: 'absolute',
      left: 1,
      top: 0.5,
      height: '44px',
      outline: 'none',
      background: '#333333',
      border: 'none',
    },

    tabsHolder: {
      width: '99%'
    },

    settingsContainer: {
      width: '90%',
      margin: 20,
      marginTop: 80
    },

    formError: {
      marginTop: 10,
      color: 'red'
    },

    errorIcon: {
      marginRight: 5
    },

    uploadButton: {
      marginLeft: "20px"
    },

    viewWindow: {
      width: '100%',
      height: '500px',
      overflowY: 'scroll',
    },

    tableHolder: {
      wdith: '100%',
      height: '700px',
    },

    btnContainer: {
      wdith: '100%',
      position: 'relative'
    },

    saveToDBBtn: {
      position: 'absolute',
      right: 30
    },

    saveBtn: {
      position: 'absolute',
      right: 150,
      height: '37px !important'
    },

    formContainer: {
      width: '100%',
      display: 'flex'
    },

    formSection: {
      width: '50%'
    },

    specifierContainer: {
      width: 'auto',
      position: 'relative'
    },

    specifierInfoIcon: {
      position: 'absolute',
      left: '135px',
      bottom: '34px'
    },

    questionMarkInfoIcon: {
      position: 'absolute',
      left: '87px',
      top: '46px'
    },

    dependantContainer: {
      width: 'auto',
      position: 'relative'
    },

    questionMarkContainer: {
      width: '7%',
      paddingTop: '6px',
      textAlign: 'center',
      fontWeight: 'bold',
      position: 'absolute',
      border: '1px solid #d1d2d4',
      top: '-1px',
      height: '32px',
      left: '5px'
    },

    friendlyNameContainer: {
      width: '47.5%',
      position: 'absolute',
      left: '27px'
    },

    valueContainer: {
      width: '47.5%',
      position: 'absolute',
      left: '196px'
    }
  })
)