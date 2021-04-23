import React, { useState, useRef } from "react";
import "./AdvancedSearch.scss";
import AddIcon from "@material-ui/icons/Add";
import { CRXButton } from "@cb/shared";
interface IOptions {
  value: string;
  key: string;
  _id: string;
  usedBy: number | null;
  isUsed: boolean;
  inputValue: string | null;
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
      inputValue: null,
    },
    {
      value: "unitId",
      key: "Unit Id",
      _id: "2",
      usedBy: null,
      isUsed: false,
      inputValue: null,
    },
    {
      value: "category",
      key: "Category",
      _id: "3",
      usedBy: null,
      isUsed: false,
      inputValue: null,
    },
  ]);

  const onInputChange = (e: any) => {
    const { value, id } = e.target;
    setShowSearchCriteria(true);
    setDisableButton(false);
    setCurrentInput(e.target.value);
    if (!value) {
      setShowSearchCriteria(false);
    }
    if (selectsLength === 2) {
      setShowSearchCriteria(false);
    }
    let found = options.find((opt: any) => id === opt._id);

    console.log(found);
  };

  const Select = () => {
    var select: any = [];
    let newOptions = options;
    for (let i = 0; i < selectsLength; i++) {
      newOptions = options.filter(
        (opt: IOptions) => opt.usedBy == i || !opt.isUsed
      );
      console.log(newOptions);
      select.push(
        <div className="advRow" key={i}>
          <select
            className="adVSelectBox"
            ref={selectRef}
            id={i.toString()}
            onChange={(e) => onSelectInputChange(e.target.value)}
          >
            <option value="" selected disabled hidden>
              Please Select
            </option>

            {newOptions.map((val: any, i: number) => (
              <Options key={i} id={val._id} value={val.value} />
            ))}
          </select>
          <input
            ref={refs[i]}
            id={(i + 1).toString()}
            className="adVInputBox"
            onChange={(e: any) => onInputChange(e)}
          />
          <button className="removeBtn" onClick={() => Remove(i)}>
            X
          </button>
        </div>
      );
    }
    return select;
  };

  const onSelectInputChange = (value: string) => {
    setCurrentSelect(value);
  };

  const Add = () => {
    setDisableButton(true);
    setCurrentInput(null);
    setShowSearchCriteria(false);
    let found = options.find((opt: any) => currentSelect === opt.value);
    if (found) {
      found.usedBy = selectRef.current.id;
      found.isUsed = true;
      setOptions([...options]);
    }
    if (selectsLength <= 2) {
      setSelectsLength((state: any) => state + 1);
    }
  };

  const Remove = (id: number) => {
    let found = options.find((opt: any) => id == opt.usedBy);
    if (found && selectsLength > 1) {
      setRemovingOption(found.value);
      found.usedBy = null;
      found.isUsed = false;
      setOptions([...options]);
      setSelectsLength((state: any) => state - 1);
    } else {
      hideOptions();
    }
  };

  const AdvancedSearch = () => {
    for (let i = 0; i < selectsLength; i++) {
      const { value } = refs[i].current;

      // currentSelect
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
        if (findOpt) {
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
          if (findOpt) {
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
        color="secondary"
        variant="outlined"
        className="PreSearchButton"
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
