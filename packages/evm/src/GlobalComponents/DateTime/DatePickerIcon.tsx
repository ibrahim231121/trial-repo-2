import React, { useState,useContext } from "react";
import { CRXSelectBox,CRXInputDatePicker,CRXButton ,CRXTooltip} from "@cb/shared";
import { basicDateDefaultValue , approachingDateDefaultValue,  dateOptionsTypes} from "../../utils/constant";
import { DateContext, DateTimeProp, DateTimeObject } from "./index";



type Props = {
  onOptionChange: (v: any, startDate:string, endDate:string, isCustomRange:boolean) => void;
  dateOptionsValues:Array<DateTimeProp|undefined>;
  setDateOptions : (dateOptions:(DateTimeProp | undefined)[])=> void
};

  const DatePickerIcon : React.FC<Props> = ({onOptionChange,dateOptionsValues,setDateOptions}) => {
 
  const {
    dateTimeDetail,
    getDateTimeDropDown,
    dateOptionType,
    showCompact,
    minDate,
    maxDate
  } = useContext(DateContext);

  const onReset = () => {
    var dateValue : DateTimeProp | undefined ;
    if(dateOptionType === dateOptionsTypes.basicoptions){
        dateValue =  dateOptionsValues.find(x=> x?.value === basicDateDefaultValue);
    }

    else if(dateOptionType === dateOptionsTypes.approachingDeletion){
      dateValue =  dateOptionsValues.find(x=> x?.value === approachingDateDefaultValue);
    }else{
      dateValue =  dateOptionsValues.find(x=> x?.value === basicDateDefaultValue);
    }

    setDateOptions(dateOptionsValues.filter(x => x?.value !== "customRange"))

    if(dateValue != null){
      var defaultDateValue : DateTimeObject = {
        startDate : dateValue.startDate(),
        endDate : dateValue.endDate(),
        value : dateValue.value,
        displayText : dateValue.displayText
    }
      getDateTimeDropDown(defaultDateValue);
    
    }
};

   var startDate : string = dateTimeDetail.startDate?.split("+")[0];
   var endDate  : string  = dateTimeDetail.endDate?.split("+")[0];

   var minStartDate : string = "";
   var maxEndDate : string = "9999-12-31T23:59";

   if(showCompact && ( minDate && minDate !== "") && ( maxDate &&  maxDate !== "") ){

    
    minStartDate = minDate.split("+")[0];
    maxEndDate = maxDate.split("+")[0];     
   }
   else if(showCompact){
    minStartDate = startDate;
    maxEndDate = endDate ;
   }

    if (dateTimeDetail?.value === "anytime" || dateTimeDetail.startDate === "") {
      startDate = endDate;
      minStartDate = "";
      maxEndDate = "9999-12-31T23:59";
    }

  return (
    <div className="calenderContent">
      <div className="calenderDTP">
        <CRXInputDatePicker
          value={startDate}
          type="datetime-local"
          onChange={(e: any) => { onOptionChange(e,e.target.value, dateTimeDetail.endDate,true)}}
          minDate={minStartDate}
          maxDate={maxEndDate}
          
        />

        <div className="centerContent">to</div>
        <CRXInputDatePicker
          value={endDate}
          type="datetime-local"
          onChange={(e: any) => { onOptionChange(e,dateTimeDetail.startDate,e.target.value, true)}}
          minDate={minStartDate}
          maxDate={maxEndDate}
        />
      </div>

     <div className="selectBoxContent">
        <CRXSelectBox
          value={dateTimeDetail.value}
          defaultOption={false}
          popover={"CRXDaySelection"}
          onChange={onOptionChange}
          options={dateOptionsValues}
          className="daysSelection"
        />
        <CRXTooltip className="crxTooltipdate" disablePortal={true} iconName="fas fa-info-circle" title="Select from pre-selection" placement="right" />
      </div>

      <div className="paperFooter">
        <CRXButton className="clearButton" color="primary" variant="contained" onClick={onReset}>
          Reset to default
        </CRXButton>
      </div>
    </div>
  );
};

export default DatePickerIcon;
