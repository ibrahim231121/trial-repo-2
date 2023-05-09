import React, { useState, useRef, useEffect } from "react";
import "./AdvancedSearch.scss";
import { CRXButton, CRXSelectBox, CRXRows, CRXColumn } from "@cb/shared";
//import { advancedSearchOptions } from "../utils/constants";
import { dateOptions, basicDateDefaultValue } from "../../../utils/constant";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation<string>();
  const advancedSearchOptions= [
  
    {
      value: t("User_Name"),
      key: "username",
      _id: "1",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    }, 
    {
      value: t("Unit_ID"),
      key: "unit",
      _id: "2",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
    {
      value: t("Category"),
      key: "category",
      _id: "3",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
  ]
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
   
    let selectedOpt;
    for (let i = 0; i < selectsLength; i++) {
      newOptions = options.filter(
        (opt: IOptions) => opt.usedBy == i || !opt.isUsed
      );
     
      selectedOpt = newOptions.find((opt: any) => opt.usedBy == i);
      //
      //
      //

      //
     
      select.push(
        <div className="advRow" key={i}>
          <CRXRows container spacing={2}>
            <CRXColumn item xs={6}>
              <span ref={selectRef} id={i.toString()}>
                <CRXSelectBox
                
                  className="adVSelectBox"
                  id={i.toString()}
                  value={selectedOpt ? selectedOpt.value : t("Please_Select")}
                  onChange={(e: any) => onSelectInputChange(e)}
                  options={newOptions}
                  defaultValue={t("Please_Select")}
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
                    placeholder={`${t("Search_by")} ${selectedOpt?.value}`}
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

 

  const onSelectInputChange = (e: any) => {
    const { value, id } = e.target;

   
   
    setCurrentSelect(value);
   
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
   
    let found: IOptions | undefined = options.find(
      (opt: any) => value == opt.value
    );
    if (found) {
      found.usedBy = selectsLength - 1;
      found.isUsed = true;
      setOptions([...options]);
     
    }
  };

  const onInputChange = (e: any) => {
    const { value, id } = e.target;
    setCurrentInput(value);
   
   
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
   
    if (found) {
      found.usedBy = Number(selectsLength - 1);
      found.isUsed = true;
      setOptions([...options]);
     
    }

    if (selectsLength <= 2) {
      setSelectsLength((state: any) => state + 1);
    }
   
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
          <label className="dateTimeLabel">{t("Date_and_Time")}</label>
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
          <span className="btn-text">{t("Add_search_criteria")} </span>
        </button>
        {/* <button
          className="resetAdvancedSearchBtn"
          type="button"
          disabled={showSearchCriteria ? false : true}
        >
          <span className="btn-text" onClick={() => reset()}>
          {t("Reset_advanced_search")}
          </span>
        </button> */}
      </div>
      <CRXButton
        color="primary"
        variant="contained"
        className="advanceSearchButton"
        type="button"
        onClick={AdvancedSearch}
        disabled={disableButton}
      >
        <span className="btn-text">{t("Advanced_Search")}</span>
      </CRXButton>
    </div>
  );
};

const Options: React.FC<OptionsProps> = ({ id, value }) => {
  return <option value={value}>{value}</option>;
};
export default AdvancedSearch;
