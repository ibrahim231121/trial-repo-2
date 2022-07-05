import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


const VolumeControlStyle = makeStyles((theme: Theme) => (
    createStyles({
        main: {
            background: "#231F20",
            padding: "11px 6px",
        },
        track: {
            background: "#D1D2D4",
            width: "6px !important",
            marginLeft: "-2px"
        },
        rail: {
            background: "#404040",
            width: "6px !important",
            marginLeft: "-2px"
        },
        thumb: {
            color: "#ffffff",
            boxShadow: "none !important",
            '&:hover': {
                boxShadow: "none !important",
                cursor: "grabbing",
                width: "16px",
                height: "16px",
                left: "11px"
            }
        }
    })

))

export default VolumeControlStyle;
