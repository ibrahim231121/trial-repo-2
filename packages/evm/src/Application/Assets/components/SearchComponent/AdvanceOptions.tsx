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

const AdvancedSearch = () => {
  const selectRef = useRef<any>(null);
  const refs: any = [useRef(), useRef(), useRef()];
  const [selectsLength, setSelectsLength] = useState(1);
  const [disableButton, setDisableButton] = useState(true);
  const [currentInput, setCurrentInput] = useState<string | null>(null);

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

  const Select = () => {
    var select: any = [];
    let newOptions = options;
    for (let i = 0; i < selectsLength; i++) {
      newOptions = options.filter((opt) => opt.usedBy == i || !opt.isUsed);
      select.push(
        <div className="advRow" key={i}>
          <select className="adVSelectBox" ref={selectRef} id={i.toString()}>
            {newOptions.map((val, i) => (
              <Options key={i} id={val._id} value={val.value} />
            ))}
          </select>
          <input
            ref={refs[i]}
            className="adVInputBox"
            onChange={(e) => {
              setDisableButton(false);
              setCurrentInput(e.target.value);
            }}
          />
          <button className="removeBtn" onClick={() => Remove(i)}>
            X
          </button>
        </div>
      );
    }
    return select;
  };

  const Add = () => {
    setDisableButton(true);
    setCurrentInput(null);
    let found = options.find((opt) => selectRef.current.value === opt.value);
    // let index = options.findIndex(
    //   (opt) => selectRef.current.value === opt.value
    // );
    if (found) {
      found.usedBy = selectRef.current.id;
      found.isUsed = true;
      setOptions([...options]);
    }

    if (selectsLength <= 2) {
      setSelectsLength((state) => state + 1);
    }
  };
  const Remove = (id: number) => {
    let found = options.find((opt) => id == opt.usedBy);
    let index = options.findIndex(
      (opt) => selectRef.current.value === opt.value
    );
    if (found) {
      found.usedBy = null;
      found.isUsed = false;
      setOptions([...options]);
    }
  };

  const AdvancedSearch = () => {
    const values = [{ key: "", value: "" }];
    for (let i = 0; i < selectsLength; i++) {
      const { value } = refs[i].current;

      let findCurrent: number;

      let findOpt = options.find((opt) => i == opt.usedBy);
      let index = options.findIndex((opt) => i == opt.usedBy);
      if (findOpt) {
        findOpt.inputValue = value;
        options[index] = findOpt;
        setOptions([...options]);
      } else {
        findOpt = options.find((opt) => (i + 1).toString() == opt._id);

        const findCurrentIndex = options.findIndex(
          (opt) => (i + 1).toString() == opt._id
        );
        if (findOpt) {
          findOpt.inputValue = currentInput;
          options[findCurrentIndex] = findOpt;
          setOptions([...options]);
        }
      }
    }
  };
  console.log(options);
  const SearchBox = () => {};
  return (
    <div className="advanceSerachContainer">
      {Select()}

      <button
        className="AddRemove-Search-Criteria-btn"
        type="button"
        onClick={() => Add()}
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
  return (
    <option defaultValue="username" value={value}>
      {value}
    </option>
  );
};
export default AdvancedSearch;
