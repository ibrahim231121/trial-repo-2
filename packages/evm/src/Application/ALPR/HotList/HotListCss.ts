import {
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";


export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    MainContainer: {
      width: '90%',
      margin: '126px 126px 126px 100px',
      paddingLeft: 29,
      height: '100px'

    },
    RequiredContainer:
    {
      paddingBottom: 10,
      borderBottom: '1px solid #dedede'
    },
    EditContainer:
    {
      marginTop: 5,
      width: '100%',
      overflowY: 'scroll',
      padding: '0px 130px 0 36px',
      height: '350px',
      border: '1px solid black',
      display: 'flex'
    },
    divTextBox: {
      display: 'flex',
      // marginLeft:
      marginBottom: 33
    },
    TextBox: {
      width: 281
    },
    ChildContainer1:
    {
      width: '40%',
      display: 'flex',
      border: '1px solid black',
      margin: '25px 126px 0px 100px',
    },
    ContainerFooter:
    {
      marginTop: '10px',
      position: 'fixed',
      width: '100%',
      height: '900px'
    },
    span:
    {
      width: 133
    },
    HotlistAutoComplete:
    {
      marginTop: 30,
    },
    colorPalette:
    {
      width:'30px',
      height:'30px',
      marginLeft:'50px'
      // border: '1px solid black',
    },
    uploadButton:
    {
      textAlign: 'end',
      margin: '-27px 6px 0 0 ',
    },
    MainContainer2:
    {
      margin:'5% 0 0 9%',
    }
  })
)