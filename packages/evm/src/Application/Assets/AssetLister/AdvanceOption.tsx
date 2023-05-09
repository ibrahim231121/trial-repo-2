import React, { useState, useRef, useEffect } from "react";
import "./AdvancedSearch.scss";
import { CRXButton, CRXSelectBox, CRXRows, CRXColumn } from "@cb/shared";
//import { advancedSearchOptions } from "../utils/constants";
import { dateOptions, basicDateDefaultValue } from "../../../utils/constant";
import { DateTimeComponent } from "../../../GlobalComponents/DateTime";
import { useTranslation } from "react-i18next";
import { CRXTooltip } from "@cb/shared";

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
  className : string,
  closeSearchPanel: () => void,
  searchPanelIdentifer: boolean,
  setSdvanceSearchText : any,
  setFieldsNumber: any
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
  className,
  closeSearchPanel,
  searchPanelIdentifer,
  setSdvanceSearchText,
  setFieldsNumber
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
  const [advanceSelect, setAdvanceSelect] = React.useState<IOptions[]>([]);
  const [resetDateOptions, setResetDateOptions] = useState(false);
  const [dateTimeDropDown, setDateTimeDropDown] =
    React.useState<DateTimeObject>(dateTimeDetail);
  const initialState = advancedSearchOptions;
  let newOptions: any;
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

  React.useEffect(() => {
    if (advanceSelect != undefined && advanceSelect.length > 0) {
    } else {
      addDefaultSearch();
    }
  }, []);

  const defaultSearchCriteria = {
    value: t("Please_Select"),
    key: "",
    _id: "0",
    usedBy: null,
    isUsed: false,
    inputValue: "",
  };

  const addDefaultSearch = () => {
    let advanceSelects = Object.assign({}, defaultSearchCriteria);
    setAdvanceSelect((select: any) => {
      return [...select, advanceSelects];
    });
  };

  const addSearchCriteria = () => {
    addDefaultSearch();
    setDisableButton(true);
    setCurrentInput(null);
    setCurrentSelect(null);
    setShowSearchCriteria(false);
    if (selectsLength <= 2) {
      setSelectsLength((state: any) => state + 1);
    }
    if (selectsLength === 3) {
      setDisableButton(false);
      setShowSearchCriteria(false);
    }
  };

  const onSelectInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { value, id } = e.target;
    let selection: any = [...advanceSelect];
    selection[i].value = value;
    selection[i]._id = i.toString();
    selection[i].isUsed = true;
    selection[i].inputValue = "";
    setAdvanceSelect(selection);
    setCurrentSelect(value);
    if (currentInput && value) {
      setShowSearchCriteria(true);
      setDisableButton(false);
    }
    if (selectsLength === 3) {
      setShowSearchCriteria(false);
    }
    let foundByUsedBy: IOptions | undefined = options.find(
      (opt: any) => i == opt.usedBy
    );

    if (foundByUsedBy) {
      foundByUsedBy.usedBy = null;
      foundByUsedBy.isUsed = false;
      foundByUsedBy.inputValue = "";
    }

    let found: IOptions | undefined = options.find(
      (opt: any) => value == opt.value
    );
    if (found) {
      found.usedBy = i;
      found.isUsed = true;
      setOptions([...options]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const { value, id } = e.target;

    let selection = [...advanceSelect];
    selection[i].inputValue = value;
    setCurrentInput(value);

    let found = options.find((opt: any) => i == opt.usedBy);
   
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

  const Remove = (id: number) => {
    setShowSearchCriteria(true);
    setDisableButton(false);
    setCurrentSelect(null);
    let optionFound: any = options.find((opt: any) => id == opt.usedBy);
    let advanceOption = advanceSelect;
    advanceOption.splice(id, 1);
    if (optionFound && selectsLength > 1) {
      setSelectsLength((state: any) => state - 1);
      optionFound.usedBy = null;
      optionFound.isUsed = false;
      optionFound.inputValue = "";
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
    } else if (selectsLength === 1) {
      hideOptions();
    } else {
      setSelectsLength((state: any) => state - 1);
      setShowSearchCriteria(true);
    }
    setAdvanceSelect([...advanceOption]);
    setSdvanceSearchText([...advanceOption])
  };

  const AdvancedSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    for (let i = 0; i < selectsLength; i++) {
      const value = advanceSelect[i].inputValue;
      const selectValue = advanceSelect[i].value;
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
          findOpt = options.find((opt: any) => selectValue == opt.value);

          const findCurrentIndex = options.findIndex(
            (opt: any) => selectValue == opt.value
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
    console.log("select", options)
    setSdvanceSearchText(options)
    closeSearchPanel()
  };

  React.useEffect(() => {
    setResetDateOptions(false);
  }, [resetDateOptions]);

  const reset = () => {
    setSelectsLength(1);
    setDisableButton(true);
    let advanceOption = advanceSelect;
    advanceOption.splice(0, selectsLength);
    advanceOption.push(defaultSearchCriteria);
    options.forEach((x) => {
      x.usedBy = null;
      x.isUsed = false;
      x.inputValue = "";
    });
    setAdvanceSelect([...advanceOption]);
    setOptions([...options]);
    setResetDateOptions(true);
  };

  const selectBoxArray = advanceSelect?.map((select, i) => {
    newOptions = options.filter(
      (opt: IOptions) => opt.usedBy == i || !opt.isUsed
    );
    setFieldsNumber(i)
    return (
      <div className="advRow" key={i}>
        <CRXRows container spacing={2}>
          <CRXColumn item xs={6}>
            <CRXSelectBox
              ref={selectRef}
              className="adVSelectBox"
              id={"select_" + i.toString()}
              value={
                select.isUsed === true ? select.value : t("Please_Select")
              }
              onChange={(e: any) => onSelectInputChange(e, i)}
              options={newOptions}
              defaultValue={t("Please_Select")}
              defaultOption={false}
              popover={"CRXDaySelection"}
            />
          </CRXColumn>
          {select?.isUsed && (
            <CRXColumn item xs={6}>
              <div className="advanceInputBoxContent">
                <input
                  id={"input_" + i.toString()}
                  className="adVInputBox"
                  onChange={(e: any) => onInputChange(e, i)}
                  value={select?.inputValue}
                  placeholder={`${t("Search_by")} ${select.value}`}
                  autoComplete="off"
                />

                <button
                  className="removeBtn"
                  onClick={() => Remove(i)}
                >
                <CRXTooltip iconName="fas fa-circle-minus" arrow={false} title="Remove" placement="right" disablePortal={true} className="crxTooltipNotificationIcon" />

                </button>
              </div>
            </CRXColumn>
          )}
        </CRXRows>
      </div>
    );
  });
  return (
    <div id="advanceSearchBox" className={"advanceSerachContainer CRXAdvanceSearchBox " + className}>
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
       <div className="searchAssetText">Search Assets By</div>
      {selectBoxArray}

      <div className="advancedSearchBottom">
        <button
          className={`AddRemove-Search-Criteria-btn ${!showSearchCriteria && "AddRemove-Search-Disabled"}`}
          type="button"
          onClick={() => addSearchCriteria()}
          disabled={showSearchCriteria ? false : true}
        >
          <i className="fa fa-plus"></i>{" "}
          <span className="btn-text">{t("Add_search_criteria")} </span>
        </button>
        <button
          className="resetAdvancedSearchBtn"
          type="button"
          disabled={showSearchCriteria ? false : true}
        >
          {/* <span className="btn-text" onClick={() => reset()}>
          {t("Reset_advanced_search")}
          </span> */}
        </button>
      </div>
      <CRXButton
        color="primary"
        variant="contained"
        className="advanceSearchButton"
        type="button"
        onClick={(e: any) => AdvancedSearch(e)}
        disabled={disableButton}
      >
        <span className="btn-text">{t("Advanced_Search")}</span>
      </CRXButton>
    </div>
  );
};

export default AdvancedSearch;
