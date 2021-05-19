import React from "react";
import moment from "moment";
import DatePickerIcon from "./DatePickerIcon";
import { CRXDropDown, CRXSelectBox, CRXDropContainer } from "@cb/shared";
import { dateOptions } from "../../../../../utils/constant";
import "./DateTime.scss";
import { DateContext } from "../DateContext";

const DateTime: React.FC = () => {
  const { setSelectedOption, selectedOptionValue } =
    React.useContext(DateContext);
  const [startDate, setStartDate] = React.useState<Object>();
  const [endDate, setEndDate] = React.useState<Object>();

  const [open, setOpen] = React.useState(false);

  const [selectOption, setSelectOption] = React.useState("");

  const onChange = (e: any) => {
    setSelectedOption(e.target.value);
    var now = moment();
    var m = moment();
    debugger;

    // console.log("Moment Date = " , now);
    // console.log("Current Date = " , now.format())
    // console.log("UTC Date 1 = " , now.utc(true).format()) // keeplocaltime : true
    // console.log("UTC Date 2  = " , now.utc(false).format()) // keeplocaltime : false
    // console.log(typeof(now.utc(false).format()));

    // console.log('now ' + now.toString())
    // console.log('start ' + now.startOf('day').toString())
    // console.log('end ' + now.endOf('day').toString())

    //console.log(typeof(new Date()))
    const { value } = e.target;
    setSelectOption(value);

    switch (value) {
      case "Please Select":
        setStartDate("");
        setEndDate("");
        break;

      case "today":
        // setStartDate(
        //   new Date(new Date().setHours(0, 0, 0, 0)).toISOString().split(".")[0]
        // );
        // setEndDate(new Date().toISOString().split(".")[0]);
        // var date  = new Date();
        // date.get
        // console.log('start1 ' + now.startOf('day'))
        // console.log('end1 ' + now.endOf('day'))

        // console.log( typeof(now.endOf('day')))
        console.log("AAA");
        console.log(typeof now.startOf("day").toDate());
        setStartDate(now.startOf("day").toDate());
        setEndDate(now.endOf("day").toDate());

        break;

      case "yesterday":
        const date = ((d) => new Date(d.setDate(d.getDate() - 1)))(new Date());
        setStartDate(
          new Date(date.setHours(0, 0, 0, 0)).toISOString().split(".")[0]
        );
        setEndDate(new Date().toISOString().split(".")[0]);
        break;
    }
  };

  const data = (
    <DatePickerIcon
      selectedOption={selectOption}
      onClose={() => setOpen(false)}
      startDate={startDate}
      endDate={endDate}
    />
  );
  const img = <i className="far fa-calendar-alt"></i>;
  return (
    <div className="dateRangeContainer">
      <label className="dateTimeLabel">Date and Time</label>
      <CRXDropDown
        value={selectedOptionValue}
        onChange={onChange}
        options={dateOptions}
      >
        <CRXDropContainer
          icon={img}
          content={data}
          className="dateRangeButton"
          paperClass="CRXDateRange"
        />
      </CRXDropDown>

      {/* <CRXSelectBox
        value={selectedOptionValue}
        onChange={onChange}
        options={dateOptions}
      /> */}
    </div>
  );
};

export default DateTime;
