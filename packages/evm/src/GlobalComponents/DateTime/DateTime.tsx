import React, { useEffect, useContext } from "react";
import DatePickerIcon from "./DatePickerIcon";
import { CRXDropDown, CRXSelectBox, CRXDropContainer } from "@cb/shared";
import { basicDateDefaultValue, approachingDateDefaultValue, dateOptions , dateOptionsTypes} from "../../utils/constant";
import "./DateTime.scss";
import { DateContext, DateTimeObject, DateTimeProp } from "./index";
import { convertTimeToAmPm } from "../../utils/convertTimeToAmPm";
import { useState } from "react";
import moment from 'moment';

interface AssetDateTime {
  startDate: string,
  endDate: string
}

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
  const [customRangeDateTime, setCustomRangeDateTime] = React.useState<AssetDateTime>()
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
    let dateValues: (DateTimeProp | undefined)[] = SetDropDownValues();
    
    if (dateTimeDetail?.value === customRange) {
      let dataArray = [...dateValues]
      setCustomRangeDateTime({ startDate: dateTimeDetail.startDate, endDate: dateTimeDetail.endDate })
      var defaultDateValue: DateTimeProp = {
        startDate: function () { return (dateTimeDetail.startDate) },
        endDate: function () { return dateTimeDetail.endDate },
        value: dateTimeDetail.value,
        displayText: dateTimeDetail.displayText
      }
      dateValues = [...dataArray, defaultDateValue];
    }

    if(!showCompact){
      setDateOptions(dateValues);
    }
    else if(showCompact && CheckMinAndMaxDate()){
      
      let requiredDateOptions = dateValues.filter((x, i) => {
        if(x && x.value === "custom")
        return x

        if (x && moment(x.startDate()) >=  moment(dateTimeDetail.startDate) && x.value != "custom" &&
          moment(x.endDate()) <= moment(dateTimeDetail.endDate)) { // add this check because by default it is showing DateTimeProp or undefined . 
            return x;       
        }
      });
      if(IsApproachingDeletion())
      {
        requiredDateOptions = dateOptions.basicoptions;
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

  function CheckMinAndMaxDate()
  {
    return (minDate === "" || minDate === undefined)  && ( maxDate === "" || maxDate === undefined);
  }

  function IsApproachingDeletion()
  {
    return dateTimeDetail.displayText === "tomorrow" || dateTimeDetail.displayText === "next 7 days" || dateTimeDetail.displayText === "next 30 days";
  }

  function SetDropDownValues()
  {
    let dateValues: (DateTimeProp | undefined)[] = [];
    if (dateOptionType === dateOptionsTypes.basicoptions) {
      dateValues = dateOptions.basicoptions;
    } else if (dateOptionType === dateOptionsTypes.approachingDeletion) {
      dateValues = dateOptions.approachingDeletion;
    } else {
      dateValues = dateOptions.basicoptions;
    }

    return dateValues;
  }

  function GetStartAndEndDate(dateValues: any) {
    let assetDateTime: AssetDateTime = { startDate: "", endDate: "" };
    let lastIndex = dateValues.find((x: DateTimeProp | undefined) => x?.value === "anytime") ? 0 : dateValues?.length - 1;
    let isCustomValueExist = lastIndex != 0 && dateValues.find((x: DateTimeProp | undefined) => x?.value === customRange) ? 2 : 1;
    debugger
    if (lastIndex >= isCustomValueExist) {
      let lastDate = dateValues[lastIndex - isCustomValueExist];
      if (lastDate) {
        assetDateTime = {
          startDate: lastDate.startDate(),
          endDate: lastDate.endDate()
        }
      }
    }
    else {
      assetDateTime = {
        startDate: "",
        endDate: moment().format().toString()
      }
    }
    return assetDateTime;
  }

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
      if (value === customRange) {
        var dateObject = dateOptionsValues.find((x: DateTimeProp | undefined) => x?.value === customRange);
        onSelectionChange(dateObject);
      }
      else {
        let basicOption = dateOptions.basicoptions.find((x: DateTimeProp | undefined) => x?.value === value);
        let approachingDeletion = dateOptions.approachingDeletion.find((x: DateTimeProp | undefined) => x?.value === value);
        if (basicOption) {
          if (value == "custom") {
            let dateValues = [...dateOptionsValues];
            let dateObject = dateValues.find((x: DateTimeProp | undefined) => x?.value === customRange);
            if (dateObject) {
              if (customRangeDateTime) {
                basicOption.startDate = () => customRangeDateTime.startDate;
                basicOption.endDate = () => customRangeDateTime.endDate;
              }
              else {
                let assetDateTime = GetStartAndEndDate(dateValues)
                basicOption.startDate = () => assetDateTime.startDate;
                basicOption.endDate = () => assetDateTime.endDate;
              }
            }
            else {
              let assetDateTime = GetStartAndEndDate(dateValues)
              basicOption.startDate = () => assetDateTime.startDate;
              basicOption.endDate = () => assetDateTime.endDate;
            }
          }
          onSelectionChange(basicOption);
        }
        else if (approachingDeletion) {
          onSelectionChange(approachingDeletion);
        }
      }
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
