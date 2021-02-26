import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@cb/shared";

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
        <Button
          onClick={() => dispatch(incrementActionCreator({ val: inputValue }))}
        >
          Add
        </Button>
        <Button onClick={() => dispatch(decrementActionCreator())}>
          Decrement
        </Button>
      </div>
      <div className="counterTwo">
        <h1>CounterTwo</h1>
        <Button onClick={() => dispatch(inc())}>Add 1</Button>
        <Button onClick={() => dispatch(dec())}>Dec 1</Button>
      </div>
    </div>
  );
};

export default CounterPage;
