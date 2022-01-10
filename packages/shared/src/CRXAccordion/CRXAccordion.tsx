import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

type AccordiaonProps = {
    disabled? : boolean,
    id : string,
    title : string,
    children : ReactNode,
    className : string,
    defaultExpanded? : boolean,
    ariaControls : string
}

const CrxAccordion = ({disabled, id, title, children, className, ariaControls} : AccordiaonProps) => {
    
const AccordionStyle = makeStyles({
  root: {
      backgroundColor: "#fff",
      border:"1px solid #D1D2D4",
      borderRadius : "0px !important",
      boxShadow : "none",
  },
});

const AccordionSummaryStyle = makeStyles({
    root: {
        backgroundColor: "#333333",
        color : "#D1D2D4",
        fontSize: "14px",
        minHeight:"50px",
        height : "50px",
        borderRadius : "0px",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "0px 25px",
        borderBottom:"2px solid #D1D2D4",
        '&.Mui-expanded' : {
                minHeight:"48px",
                height : "48px",
                padding: "0px 25px",
                borderBottom:"2px solid #D74B00",
                backgroundColor: "#fff",
                color : "#333",
            },
        // '&.Mui-expanded' : {
        //     minHeight:"50px",
        //     height : "50px",
        //     padding: "0px 25px"
        // },
        '&:hover' : {
            backgroundColor: "#6E6E6E",
            color : "#F5F5F5",
        },
        '&:focus' : {
            backgroundColor: "#231F20",
            color : "#F5F5F5",
        }
    },

    expandIcon : {
        color : "#D1D2D4",
        fontSize: "22px",
        background: "transparent",
        border:"0px solid #fff",
        '&.Mui-expanded' : {
            color:"#333"
        }
    }
});

const AccordionDetailsStyle = makeStyles ({
    root : {
        borderRadius: "0px",
        padding : "25px"
    }
})

    const accordionStyle = AccordionStyle() ;
    const SummaryStyle = AccordionSummaryStyle();
    const DetailsStyle = AccordionDetailsStyle();
    const expandIcon = <i className="fas fa-caret-down"></i>;
    
    // const [expanded, setExpanded] = React.useState<string | false>(false);
    // const [defaultExpandedState, setDefaultExpandedState] = React.useState<boolean>(!disabled);

    // React.useEffect(() => {
    // disabled === true?
    //     setDefaultExpandedState(false)
    //     : setDefaultExpandedState(true) 
    // },[])

    // //console.log("titles" , titles)
    // const handleChange = (panel: string) => (_: React.ChangeEvent<{}>, isExpanded: boolean) => {
    //     setExpanded(isExpanded ? panel : false);

    //   };
      
    
    return (
        <div>
        <Accordion 
            disabled={disabled} 
            className={className} 
            defaultExpanded={!disabled}
            classes={accordionStyle}>
            {/* expanded={expanded === id} onChange={handleChange(id)}> */}

            <AccordionSummary
                expandIcon={expandIcon}
                aria-controls={ariaControls}
                id={id}
                classes={SummaryStyle}>

                <Typography>{title}</Typography>

            </AccordionSummary>
            <AccordionDetails classes={DetailsStyle}>
                {children}
            </AccordionDetails>
        </Accordion>
      </div>
    )
}

export default CrxAccordion;