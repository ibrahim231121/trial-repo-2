import React from "react";
import { useHistory } from "react-router-dom";

const Index = () => {
  let history = useHistory();

  const [inputValue, setInputValue] = React.useState<null | String>(null);

  const NavigationPreloadManager = () => {
    history.push("/counter");
  };

  return (
    <div>
      <h1> Asset Page</h1>
      <input onChange={(e) => setInputValue(e.target.value)} />
      <div>State: {inputValue}</div>

      <button type="button" onClick={NavigationPreloadManager}>
        Go home
      </button>
    </div>
  );
};

export default Index;
