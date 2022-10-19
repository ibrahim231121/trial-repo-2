import { makeStyles, Theme } from '@material-ui/core/styles';

const CRXMultiViewStyle = makeStyles((_: Theme) => 
({
    iconGrey: {
      fontSize: "18px",
      color: "#d1d2d4",
      "&:hover": {
        background: "transparent",
      },
    },
    checkedIconGrey: {
      fontSize: "18px",
      color: "#d1d2d4",
      "&:hover": {
        background: "transparent",
      },
    },
    colorSecondary: {
      "&:hover": {
        background: "transparent",
      },
    },
  })

)

export default CRXMultiViewStyle;