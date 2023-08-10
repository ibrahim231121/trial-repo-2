import React, { useState, useRef } from "react";
import "./AlprAdvanceOption.scss";
import { CRXButton, CRXSelectBox, CRXRows, CRXColumn } from "@cb/shared";
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
  className: string,
  closeSearchPanel: () => void;
  searchPanelIdentifer: boolean,
  setAdvanceSearchText: any;
  setFieldsNumber: any;
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
  setAdvanceSearchText,
  setFieldsNumber,
}) => {

  const { t } = useTranslation<string>();
  const advancedSearchOptions = [

    {
      value: t("Unit"),
      key: "unitId",
      _id: "1",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
    {
      value: t("User"),
      key: "userId",
      _id: "2",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
    {
      value: t("HotList"),
      key: "hotlist",
      _id: "3",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
    {
      value: t("state"),
      key: "state",
      _id: "4",
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
  const [options, setOptions] = useState<IOptions[]>(advancedSearchOptions);
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
    if (selectsLength <= 4) {
      setSelectsLength((state: any) => state + 1);
    }
    if (selectsLength === 5) {
      setDisableButton(false);
      setShowSearchCriteria(false);
    }
  };

  const onSelectInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    textBoxIndex: number
  ) => {
    const { value, id } = e.target;
    let selection: any = [...advanceSelect];
    selection[textBoxIndex].value = value;
    selection[textBoxIndex]._id = textBoxIndex.toString();
    selection[textBoxIndex].isUsed = true;
    selection[textBoxIndex].inputValue = "";
    setAdvanceSelect(selection);
    setCurrentSelect(value);
    if (currentInput && value) {
      setShowSearchCriteria(true);
      setDisableButton(false);
    }
    if (selectsLength === 5) {
      setShowSearchCriteria(false);
    }
    let foundByUsedBy: IOptions | undefined = options.find(
      (opt: any) => textBoxIndex == opt.usedBy
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
      found.usedBy = textBoxIndex;
      found.isUsed = true;
      setOptions([...options]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, textBoxIndex: number) => {
    const { value, id } = e.target;

    let selection = [...advanceSelect];
    selection[textBoxIndex].inputValue = value;
    setCurrentInput(value);

    let found = options.find((opt: any) => textBoxIndex == opt.usedBy);

    if (found) {
      found.inputValue = value;
    }
    if (selectsLength === 5) {
      setShowSearchCriteria(false);
    }
    if (currentSelect && value) {
      setShowSearchCriteria(true);
      setDisableButton(false);
    } else {
      setShowSearchCriteria(false);
      setDisableButton(true);
    }
    if (selectsLength === 5) {
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
    setAdvanceSearchText([...advanceOption])
  };

  const AdvancedSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    for (let textBoxIndex = 0; textBoxIndex < selectsLength; textBoxIndex++) {
      const value = advanceSelect[textBoxIndex].inputValue;
      const selectValue = advanceSelect[textBoxIndex].value;
      let findOpt = options.find((opt: any) => textBoxIndex == opt.usedBy);
      let index = options.findIndex((opt: any) => textBoxIndex == opt.usedBy);
      if (findOpt) {
        findOpt.inputValue = value;
        options[index] = findOpt;
        setOptions([...options]);
      } else {
        findOpt = options.find(
          (opt: any) => currentSelect == opt.value && (opt.inputValue == null || opt.inputValue =='')
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
    setAdvanceSearchText(options);
    closeSearchPanel();
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

  const selectBoxArray = advanceSelect?.map((select, textBoxIndex) => {
    newOptions = options.filter(
      (opt: IOptions) => opt.usedBy == textBoxIndex || !opt.isUsed

    );

    return (
      <div className="Alpr_AdvanceSearch_advRow" key={textBoxIndex}>
        <CRXRows container spacing={2}>
          <CRXColumn item xs={6}>
            <CRXSelectBox
              ref={selectRef}
              className="Alpr_AdvanceSearch_adVSelectBox"
              id={"select_" + textBoxIndex.toString()}
              value={
                select.isUsed === true ? select.value : t("Please_Select")
              }
              onChange={(e: any) => onSelectInputChange(e, textBoxIndex)}
              options={newOptions}
              defaultValue={t("Please_Select")}
              defaultOption={false}
              popover={"CRXDaySelection"}
            />
          </CRXColumn>
          {select?.isUsed && (
            <CRXColumn item xs={6}>
              <div className="Alpr_AdvanceSearch_advanceInputBoxContent">
                <input
                  id={"input_" + textBoxIndex.toString()}
                  className="Alpr_AdvanceSearch_adVInputBox"
                  onChange={(e: any) => onInputChange(e, textBoxIndex)}
                  value={select?.inputValue}
                  placeholder={`${t("Search_by")} ${select.value}`}
                  autoComplete="off"
                />
                <button
                  className="Alpr_AdvanceSearch_removeBtn"
                  onClick={() => Remove(textBoxIndex)}
                >
                </button>
              </div>
            </CRXColumn>
          )}
        </CRXRows>
      </div>
    );
  });
  return (
    <div id="Alpr_advanceSearchBox" className={"Alpr_advanceSerach_Container Alpr_CRXAdvanceSearchBox" + className}>
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
      <div className="Alpr_AdvanceSearch_searchText">Search Number Plate</div>
      {selectBoxArray}

      <div className="Alpr_advancedSearchBottom">
        <button
          className="Alpr_AddRemove-Search-Criteria-btn"
          type="button"
          onClick={() => addSearchCriteria()}
          disabled={showSearchCriteria ? false : true}
        >
          <i className="fa fa-plus"></i>{" "}
          <span className="btn-text">{t("Add_search_criteria")} </span>
        </button>
        <button
          className="Alpr_resetAdvancedSearchBtn"
          type="button"
          disabled={showSearchCriteria ? false : true}
        >
          <span className="btn-text" onClick={() => reset()}>
            {t("Reset_advanced_search")}
          </span>
        </button>
      </div>
      <CRXButton
        color="primary"
        variant="contained"
        className="Alpr_advanceSearchButton"
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
