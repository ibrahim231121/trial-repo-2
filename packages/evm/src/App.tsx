import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { Button } from "@cb/shared";

import Assets from "./Application/Assets";
import { useFetchData } from "./utils/Api/ApiCustomHook";
import CounterPage from "./Application/Assets/components/CounterPage";

// Type for Data Required
// type UserState = {
//   activity: string;
//   type: string;
//   participants: number;
//   price: number;
//   link: string;
//   key: number;
//   accessibility: number;
// };

// const { data, isDataFetched } = useFetchData<UserState[]>(
//   "https://www.boredapi.com/api/activity"
// );
// console.log("isDataFetched", isDataFetched);
// console.log("data", data);

function App() {
  const [state, setstate] = React.useState("");

  return (
    <BrowserRouter>
      Nav bar
      <Route path="/" component={Assets} exact={true} />
      <Route path="/counter" component={CounterPage} exact={true} />
    </BrowserRouter>
  );
}

export default App;
