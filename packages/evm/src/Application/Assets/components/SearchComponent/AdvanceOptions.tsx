import React, { useState, useRef } from "react";
import "./AdvancedSearch.scss";
import AddIcon from "@material-ui/icons/Add";
import MinimizeIcon from "@material-ui/icons/Minimize";
import { CRXButton, CRXSelectBox, CRXRows, CRXColumn } from "@cb/shared";
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
}

const AdvancedSearch: React.FC<Props> = ({ getOptions, hideOptions }) => {
  const selectRef = useRef<any>(null);
  const refs: any = [useRef(), useRef(), useRef()];
  const [selectsLength, setSelectsLength] = useState(1);
  const [showSearchCriteria, setShowSearchCriteria] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [currentInput, setCurrentInput] = useState<string | null>(null);
  const [currentSelect, setCurrentSelect] = useState<string | null>(null);
  const [removingOption, setRemovingOption] = useState<string | null>(null);

  const [options, setOptions] = useState<IOptions[]>([
    {
      value: "username",
      key: "User Name",
      _id: "1",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
    {
      value: "unitId",
      key: "Unit Id",
      _id: "2",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
    {
      value: "category",
      key: "Category",
      _id: "3",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
  ]);

  const Select = () => {
    var select: any = [];
    let newOptions = options;
    let selectedOpt;
    for (let i = 0; i < selectsLength; i++) {
      newOptions = options.filter(
        (opt: IOptions) => opt.usedBy == i || !opt.isUsed
      );
      selectedOpt = newOptions.find((opt: any) => opt.usedBy == i);
      select.push(
        <div className="advRow" key={i}>
          <CRXRows container spacing={2}>
            <CRXColumn item xs={6}>
              <select
                className="adVSelectBox"
                ref={selectRef}
                id={i.toString()}
                onChange={(e) => onSelectInputChange(e)}
                value={selectedOpt?.value}
              >
                <option value="" selected disabled hidden>
                  -- Select a search criteria --
                </option>

                {newOptions.map((val: any, i: number) => (
                  <Options key={i} id={val._id} value={val.value} />
                ))}
              </select>
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
                />

                <button className="removeBtn" onClick={() => Remove(i)}>
                  
                </button>
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
      if (id == opt.usedBy) {
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
      found.usedBy = Number(selectRef.current.id);
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
      setRemovingOption(found.value);
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
    getOptions(options);
  };
  const SearchBox = () => {};
  return (
    <div className="advanceSerachContainer">
      {Select()}

      <button
        className="AddRemove-Search-Criteria-btn"
        type="button"
        onClick={() => Add()}
        disabled={showSearchCriteria ? false : true}
      >
        <AddIcon fontSize="small" />{" "}
        <span className="btn-text">Add search criteria </span>
      </button>
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
