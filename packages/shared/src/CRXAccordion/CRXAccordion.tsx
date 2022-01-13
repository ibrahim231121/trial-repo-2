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
    className? : string,
    defaultExpanded? : boolean,
    ariaControls : string,
    name: string,
    expanded : any,
    isExpanedChange : React.Dispatch<React.SetStateAction<string | boolean>>
}

const CrxAccordion = ({disabled, isExpanedChange, expanded, id, name, title, children, defaultExpanded, className, ariaControls} : AccordiaonProps) => {
    
const AccordionStyle = makeStyles({
  root: {
      backgroundColor: "#fff",
      border:"0px solid #D1D2D4",
      borderRadius : "0px !important",
      boxShadow : "none",
  },
});

const AccordionSummaryStyle = makeStyles({
    root: {
        backgroundColor: "#fff",
        color : "#333",
        fontSize: "18px",
        minHeight:"50px",
        height : "50px",
        borderRadius : "0px",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "0px 22px",
        borderBottom:"1px solid #E3E4E5",
        '&.Mui-expanded' : {
                minHeight:"48px",
                height : "48px",
                padding: "0px 22px",
            },
    },

    expandIcon : {
        color : "#333",
        fontSize: "18px",
        background: "transparent",
        border:"0px solid #fff",
        order: -1,
        paddingRIght : "30px",
        '&.Mui-expanded' : {
            color:"#333",
            transform:"rotate(90deg)"
        },
        '&:focus' : {
            background: "transparent",
        }
    }
});

const AccordionDetailsStyle = makeStyles ({
    root : {
        borderRadius: "0px",
        padding : "47px 25px",
        
    }
})

const AccordionTitleStyle = makeStyles({
    root : {
        paddingLeft : "32px",
        textTransform : "uppercase"
    }
})
    const accordionStyle = AccordionStyle() ;
    const SummaryStyle = AccordionSummaryStyle();
    const DetailsStyle = AccordionDetailsStyle();
    const titleStyle = AccordionTitleStyle();
    const expandIcon = <i className="fas fa-chevron-right"></i>;
    
    const handleChange = (panel: string) => (_: React.ChangeEvent<{}>, isExpanded: boolean) => {
       
        isExpanedChange(isExpanded ? panel : false);

    };
    
    return (
        <div>
        
        <Accordion 
            disabled={disabled} 
            className={className + " " + name } 
            defaultExpanded={defaultExpanded}
            classes={accordionStyle}
            expanded={expanded} 
            onChange={handleChange(name)}
        >

            <AccordionSummary
                expandIcon={expandIcon}
                aria-controls={ariaControls}
                id={id}
                classes={SummaryStyle}>

                <Typography classes={titleStyle}>{title}</Typography>

            </AccordionSummary>
            <AccordionDetails classes={DetailsStyle}>
                {children}
            </AccordionDetails>
        </Accordion>
      </div>
    )
}

export default CrxAccordion;