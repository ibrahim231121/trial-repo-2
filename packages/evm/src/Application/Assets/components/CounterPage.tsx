import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { CRXButton } from "@cb/shared";

import "./CounterPage.css";
import {
  decrementActionCreator,
  incrementActionCreator,
} from "../../../Redux/counterReducer";
import { inc, dec } from "../../../Redux/counterTwoReducer";

const CounterPage = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = React.useState<number>(0);
  return (
    <div className="alignCenter">
      Redux: {JSON.stringify(state)}
      <div className="counterOne">
        <h1>Counter</h1>
        <input onChange={(e) => setInputValue(Number(e.target.value))} />
        <CRXButton
          onClick={() => dispatch(incrementActionCreator({ val: inputValue }))}
        >
          Add
        </CRXButton>
        <CRXButton onClick={() => dispatch(decrementActionCreator())}>
          Decrement
        </CRXButton>
      </div>
      <div className="counterTwo">
        <h1>CounterTwo</h1>
        <CRXButton onClick={() => dispatch(inc())}>Add 1</CRXButton>
        <CRXButton onClick={() => dispatch(dec())}>Dec 1</CRXButton>
      </div>
    </div>
  );
};

export default CounterPage;
