import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


const CRXVideoPlayerStyle = makeStyles((theme: Theme) => 
    createStyles({
        colorPrimary : {
            background : "transparent"
        },
        root: {
            color: '#333333',
            border: "0px solid #333333",
            height : "4px",
            opacity: 1,
            padding: "0px",
            '&::before' : {
                position : "absolute",
                content : "",
                width: "2px",
                height : "inherit",
                background : "#D79903",
                left:"0px",
                top: "0px"
            },
            '&::after' : {
                position : "absolute",
                content : "",
                width: "2px",
                height : "inherit",
                background : "#D79903",
                right:"0px",
                top: "0px"
            },
            '&:hover .MuiSlider-rail, &:hover .MuiSlider-track' : {
                    transform: "scaley(2.5)",
            },
            
        },
        rail : {
            height : "4px",
            opacity: 1,
            transition: "all 0.25s", 
        },

        thumb : {
            visibility : "hidden",
            color: '#D1D2D4',
            width: '16px',
            height: '16px',
            marginTop: '-6px',
            boxShadow : 'none',
            zIndex : 99,
            '&:hover ' : {
                boxShadow : 'none',
            },
            '&:focus ' : {
                boxShadow : 'none',
            },
        },
        thumbColorSecondary : {
            background : "transparent",
            color: 'transparent',
        },
        track: {
            color: '#D1D2D4',
            height: 4,
            borderRadius:0,
            transition: "all 0.25s easeInOut",
        },

        focusVisible : {
            visibility : "visible",
        }

    })

)

export default CRXVideoPlayerStyle;