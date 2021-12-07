import React from "react";
import "./Outcome.scss";

const Outcome = ({ data, setValue }: { data: string[]; setValue: any }) => {
  return (
    <>
      {data?.map((x, i) => (
        <li key={i} onClick={(e: any) => setValue(e.target.id)} id={x}>
          {x}
        </li>
      ))}
    </>
  );
};

export default Outcome;
