import React, { useEffect, useContext } from "react";
import DatePickerIcon from "./DatePickerIcon";
import { CRXDropDown, CRXSelectBox, CRXDropContainer } from "@cb/shared";
import { basicDateDefaultValue, approachingDateDefaultValue, dateOptions , dateOptionsTypes} from "../../utils/constant";
import "./DateTime.scss";
import { DateContext, DateTimeObject, DateTimeProp } from "./index";
import { convertTimeToAmPm } from "../../utils/convertTimeToAmPm";
import { useState } from "react";
import moment from 'moment';

const DateTime = () => {

  const {

    disabled,
    onSelectionChange,
    openContainerState,
    setOpenContainerState,
    showCompact,
    dateTimeDetail,
    getDateTimeDropDown,
    dateOptionType,   
    reset,
    minDate,
    maxDate
  } = useContext(DateContext);

  const ref: any = React.useRef(null);

  const [dateOptionsValues, setDateOptions]= useState<Array<DateTimeProp|undefined>>([]);
  const [selectedDateOptionType, setSelectedDateOptionType] = useState<string>(dateOptionType);

  const customRange = "customRange";

  useEffect(()=>{
    changeDateOption();

  },[])

  useEffect(()=>{

    if(dateOptionType !== selectedDateOptionType){
      setSelectedDateOptionType(dateOptionType);
      changeDateOption();
    }
  },[dateOptionType])

  useEffect(()=>{

    if(reset){
        var defaultValue : string = '';
        if(dateOptionType === dateOptionsTypes.basicoptions){
          defaultValue = basicDateDefaultValue;
        }

        else if(selectedDateOptionType === dateOptionsTypes.approachingDeletion){
          defaultValue = approachingDateDefaultValue;
        }

        var dateValue  = dateOptionsValues.find(x=> x?.value === defaultValue);
        if(dateValue != null){

          var defaultDateValue : DateTimeObject = {
            startDate : dateValue.startDate(),
            endDate : dateValue.endDate(),
            value : dateValue.value,
            displayText : dateValue.displayText
          }
          getDateTimeDropDown(defaultDateValue);
        }

        var nonCustomDataOptionsValues = dateOptionsValues.filter(x=> x?.value !== customRange)
        setDateOptions(nonCustomDataOptionsValues);
    }

  },[reset])

  const changeDateOption = () =>{

    let dateValues : (DateTimeProp | undefined)[] = [];
    if(dateOptionType === dateOptionsTypes.basicoptions ){
      dateValues = dateOptions.basicoptions;
    }else if(dateOptionType === dateOptionsTypes.approachingDeletion ){
      dateValues = dateOptions.approachingDeletion;
    }else{
      dateValues = dateOptions.basicoptions;
    }
    
    if(!showCompact){
      setDateOptions(dateValues);
    }


    else if(showCompact && (minDate === "" || minDate === undefined)  && ( maxDate === "" || maxDate === undefined) ){
      let requiredDateOptions = dateValues.filter((x, i) => {
        if(x && x.value === "custom")
        return x

        if (x && moment(x.startDate()) >=  moment(dateTimeDetail.startDate) && x.value != "custom" &&
          moment(x.endDate()) <= moment(dateTimeDetail.endDate)) { // add this check because by default it is showing DateTimeProp or undefined . 
            return x;       
        }
      });

      if(dateTimeDetail.displayText === "tomorrow" || dateTimeDetail.displayText === "next 7 days" || dateTimeDetail.displayText === "next 30 days")
      {
          requiredDateOptions = dateOptions.approachingDeletion.filter((x, i) => {
          
          if (x && moment(x.startDate()) >=  moment(dateTimeDetail.startDate) &&
            moment(x.endDate()) <= moment(dateTimeDetail.endDate)) { // add this check because by default it is showing DateTimeProp or undefined . 
              return x;       
          }
      });
    }
  
      if(requiredDateOptions != null && requiredDateOptions.length > 0 ){
        setDateOptions(requiredDateOptions);
      }
    }
    else if (showCompact && minDate !== "" && maxDate !== ""){
      setDateOptions(dateValues);
    }

  }

  const convertDateTime = (date: string) => {
    const newDate = date.split("T");
    const [yy, mm, dd] = newDate[0].split("-");
    newDate[0] = `${mm}/${dd}/${yy}`;
    newDate[1] = convertTimeToAmPm(newDate[1]);
    return newDate;
  };


  const onOptionChange = (e: any, startDate : string = "", endDate : string = "", isCustomRange : boolean = false) => {
    const { value } = e.target;
    if (value === "custom" && !openContainerState ) {
      setOpenContainerState(true);
    }
    else if (isCustomRange ) {
      const filterDataValues = dateOptionsValues.filter((x: DateTimeProp | undefined) => x?.value !== customRange);

      const newStartDateTime = startDate &&  convertDateTime(startDate);
      const newEndDateTime = endDate &&  convertDateTime(endDate);

      var dateTime = {
        value: customRange,
        displayText: `${newStartDateTime[0]}  ${newStartDateTime[1]}  -  ${newEndDateTime[0]}   ${newEndDateTime[1]} `,
        endDate : ()=> endDate,
        startDate : () => startDate
      }

      var datesOptionWithCustomRange = filterDataValues.concat(dateTime);
      setDateOptions(datesOptionWithCustomRange);
      onSelectionChange(dateTime)

    }
    else {
      const dateOption = dateOptionsValues.find((x: DateTimeProp|undefined) => x?.value === value);
      
      if (dateOption) {
        dateOption.startDate = dateOptions.basicoptions[0].startDate;
        dateOption.endDate = dateOptions.basicoptions[0].endDate;
      }
      
      onSelectionChange(dateOption);
    }
  };

  const data = ( 
            <DatePickerIcon 
              dateOptionsValues={dateOptionsValues}
              onOptionChange ={onOptionChange}
              setDateOptions = { (dateOptions : (DateTimeProp | undefined)[]) =>{ setDateOptions(dateOptions)}} 
               />
            );

  const img = <i className="far fa-calendar-alt"></i>;
  return (
    <div className="dateRangeContainer" ref={ref}>
      <CRXDropDown
        value={dateTimeDetail.value}
        onChange={onOptionChange}
        options={dateOptionsValues}
        disabled={disabled}>
        <CRXDropContainer
          icon={img}
          content={data}
          openState={openContainerState}
          stateStatus={(status: boolean) => setOpenContainerState(status)}
        />
      </CRXDropDown>
    </div>
  );
};

export default DateTime;
