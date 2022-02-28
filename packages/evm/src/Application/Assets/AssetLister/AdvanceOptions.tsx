import React, { useState, useRef, useEffect } from "react";
import "./AdvancedSearch.scss";
import { CRXButton, CRXSelectBox, CRXRows, CRXColumn } from "@cb/shared";
import { advancedSearchOptions } from "../utils/constants";
import { dateOptions, basicDateDefaultValue } from "../../../utils/constant";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";

interface IOptions {
  value: string;
  key: string;
  _id: string;
  usedBy: number | null;
  isUsed: boolean;
  inputValue: string;
}
interface OptionsProps {
  value: string;
  id: string;
}
interface Props {
  getOptions: (options: any) => void;
  hideOptions: () => void;
  dateOptionType: string;
  dateTimeDetail: DateTimeObject;
}

type DateTimeObject = {
  startDate: string;
  endDate: string;
  value: string;
  displayText: string;
};

const AdvancedSearch: React.FC<Props> = ({
  getOptions,
  hideOptions,
  dateOptionType,
  dateTimeDetail,
}) => {
  const selectRef = useRef<any>(null);
  const refs: any = [useRef(), useRef(), useRef()];
  const [selectsLength, setSelectsLength] = useState(1);
  const [showSearchCriteria, setShowSearchCriteria] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [currentInput, setCurrentInput] = useState<string | null>(null);
  const [currentSelect, setCurrentSelect] = useState<string | null>(null);
  const arrowIcon = <i className="fas fa-caret-down"></i>;
  const [options, setOptions] = useState<IOptions[]>(advancedSearchOptions);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [dateOptionsState, setDateOptionsState] = React.useState(
    dateOptions.basicoptions
  );
  const [defaultDateValue, setDefaultDateValue] = React.useState("");
  const [selectedDateOptionValue, setSelectedDateOptionValue] =
    React.useState("");

  const [resetDateOptions, setResetDateOptions] = useState(false);
  const [dateTimeDropDown, setDateTimeDropDown] =
    React.useState<DateTimeObject>(dateTimeDetail);
  const initialState = advancedSearchOptions;
  React.useEffect(() => {
    //cleanUp after unmounting
    return () => {
      options.forEach((x) => {
        x.usedBy = null;
        x.isUsed = false;
        x.inputValue = "";
      });
    };
  }, []);

  const Select = () => {
    var select: any = [];
    let newOptions = options;
    console.log("testing", selectRef);
    let selectedOpt;
    for (let i = 0; i < selectsLength; i++) {
      newOptions = options.filter(
        (opt: IOptions) => opt.usedBy == i || !opt.isUsed
      );
      console.log("newOpt0",newOptions)
      selectedOpt = newOptions.find((opt: any) => opt.usedBy == i);
      // console.log("select", select);
      // console.log("newopt", newOptions);
      // console.log("currentSelect", selectRef);

      // console.log("i", i.toString());
      console.log("selectedOpt", selectedOpt);
      select.push(
        <div className="advRow" key={i}>
          <CRXRows container spacing={2}>
            <CRXColumn item xs={6}>
              <span ref={selectRef} id={i.toString()}>
                <CRXSelectBox
                
                  className="adVSelectBox"
                  id={i.toString()}
                  value={selectedOpt ? selectedOpt.value : "Please Select"}
                  onChange={(e: any) => onSelectInputChange(e)}
                  options={newOptions}
                  defaultValue="Please Select"
                />
              </span>
            </CRXColumn>
            {selectedOpt?.isUsed && (
              <CRXColumn item xs={6}>
                <div className="advanceInputBoxContent">
                  <input
                    ref={refs[i]}
                    id={i.toString()}
                    className="adVInputBox"
                    onChange={(e: any) => onInputChange(e)}
                    value={selectedOpt?.inputValue}
                    placeholder={`Search by ${selectedOpt?.value}`}
                    autoComplete="off"
                  />

                  <button
                    className="removeBtn"
                    onClick={() => Remove(i)}
                  ></button>
                </div>
              </CRXColumn>
            )}
          </CRXRows>
        </div>
      );
    }
    return select;
  };

  console.log("select", selectsLength);

  const onSelectInputChange = (e: any) => {
    const { value, id } = e.target;

    console.log("value", value);
    console.log("id", id);
    setCurrentSelect(value);
    console.log("currentInput", currentInput);
    if (currentInput && value) {
      setShowSearchCriteria(true);
      setDisableButton(false);
    }
    if (selectsLength === 3) {
      setShowSearchCriteria(false);
    }
    options.forEach((opt: IOptions) => {
      if (selectsLength - 1 == opt.usedBy) {
        opt.usedBy = null;
        opt.isUsed = false;
        opt.inputValue = "";
      }
    });
    console.log("options",options)
    let found: IOptions | undefined = options.find(
      (opt: any) => value == opt.value
    );
    if (found) {
      found.usedBy = selectsLength - 1;
      found.isUsed = true;
      setOptions([...options]);
      console.log("options", options);
    }
  };

  const onInputChange = (e: any) => {
    const { value, id } = e.target;
    setCurrentInput(value);
    console.log("input", value);
    console.log("curent", currentInput);
    let found = options.find((opt: any) => id == opt.usedBy);
    if (found) {
      found.inputValue = value;
    }
    if (selectsLength === 3) {
      setShowSearchCriteria(false);
    }
    if (currentSelect && value) {
      setShowSearchCriteria(true);
      setDisableButton(false);
    } else {
      setShowSearchCriteria(false);
      setDisableButton(true);
    }
    if (selectsLength === 3) {
      setShowSearchCriteria(false);
    }
  };

  const Add = () => {
    setDisableButton(true);
    setCurrentInput(null);
    setCurrentSelect(null);
    setShowSearchCriteria(false);
    let found = options.find((opt: any) => currentSelect === opt.value);
    console.log("advancefound", found);
    if (found) {
      found.usedBy = Number(selectsLength - 1);
      found.isUsed = true;
      setOptions([...options]);
      console.log("setopt", ...options);
    }

    if (selectsLength <= 2) {
      setSelectsLength((state: any) => state + 1);
    }
    console.log("length", selectsLength);
    if (selectsLength === 3) {
      setDisableButton(false);
      setShowSearchCriteria(false);
    }
  };

  const Remove = (id: number) => {
    setShowSearchCriteria(true);
    setDisableButton(false);
    setCurrentSelect(null);
    let found = options.find((opt: any) => id == opt.usedBy);

    if (found && selectsLength > 1) {
      found.usedBy = null;
      found.isUsed = false;
      found.inputValue = "";
      setOptions([...options]);

      if (selectsLength - 1 !== id) {
        options.forEach((opt: any) => {
          if (opt.usedBy > 0) {
            let val = opt.usedBy - 1;
            opt.usedBy = val < 0 ? null : val;
            return opt;
          }
        });
      }
      setSelectsLength((state: any) => state - 1);
    } else if (selectsLength === 1) {
      hideOptions();
    } else {
      setSelectsLength((state: any) => state - 1);
      setShowSearchCriteria(true);
    }
  };

  const AdvancedSearch = () => {
    for (let i = 0; i < selectsLength; i++) {
      const { value } = refs[i].current;

      console.log("val",value)

      let findOpt = options.find((opt: any) => i == opt.usedBy);
      let index = options.findIndex((opt: any) => i == opt.usedBy);
      if (findOpt) {
        findOpt.inputValue = value;
        options[index] = findOpt;
        setOptions([...options]);
      } else {
        // findOpt = options.find((opt:any) => (i + 1).toString() == opt._id);
        findOpt = options.find(
          (opt: any) => currentSelect == opt.value && opt.inputValue == null
        );

        const findCurrentIndex = options.findIndex(
          (opt: any) => currentSelect == opt.value
        );
        if (findOpt && currentInput) {
          findOpt.inputValue = currentInput;
          options[findCurrentIndex] = findOpt;
          setOptions([...options]);
        } else {
          findOpt = options.find(
            (opt: any) => selectRef.current.value == opt.value
          );

          const findCurrentIndex = options.findIndex(
            (opt: any) => selectRef.current.value == opt.value
          );
          if (findOpt && currentInput) {
            findOpt.inputValue = currentInput;
            options[findCurrentIndex] = findOpt;
            setOptions([...options]);
          }
        }
      }
    }
    console.log("opty: ", { options });
    getOptions({ options, dateTimeDropDown });
  };

  React.useEffect(() => {
    setResetDateOptions(false);
  }, [resetDateOptions]);

  const reset = () => {
    setSelectsLength(1);
    setDisableButton(true);
    options.forEach((x) => {
      x.usedBy = null;
      x.isUsed = false;
      x.inputValue = "";
    });
    setOptions([...options]);
    setResetDateOptions(true);
  };
  const SearchBox = () => {};
  return (
    <div className="advanceSerachContainer">
      <CRXRows container spacing={2}>
        <CRXColumn item xs={3}>
          <label className="dateTimeLabel">Date and Time</label>
        </CRXColumn>
        <CRXColumn item xs={9}>
          <DateTimeComponent
            dateTimeDetail={dateTimeDropDown}
            reset={resetDateOptions}
            getDateTimeDropDown={(dateTime: any) =>
              setDateTimeDropDown(dateTime)
            }
            dateOptionType={dateOptionType}
          />
        </CRXColumn>
      </CRXRows>
      {Select()}
      <div className="advancedSearchBottom">
        <button
          className="AddRemove-Search-Criteria-btn"
          type="button"
          onClick={() => Add()}
          disabled={showSearchCriteria ? false : true}
        >
          <i className="fa fa-plus"></i>{" "}
          <span className="btn-text">Add search criteria </span>
        </button>
        <button
          className="resetAdvancedSearchBtn"
          type="button"
          disabled={showSearchCriteria ? false : true}
        >
          <span className="btn-text" onClick={() => reset()}>
            Reset advanced search
          </span>
        </button>
      </div>
      <CRXButton
        color="primary"
        variant="contained"
        className="advanceSearchButton"
        type="button"
        onClick={AdvancedSearch}
        disabled={disableButton}
      >
        <span className="btn-text">Advanced Search</span>
      </CRXButton>
    </div>
  );
};

const Options: React.FC<OptionsProps> = ({ id, value }) => {
  return <option value={value}>{value}</option>;
};
export default AdvancedSearch;
