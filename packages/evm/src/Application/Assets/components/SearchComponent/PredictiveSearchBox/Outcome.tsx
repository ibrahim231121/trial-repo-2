import React from "react";
import "./Outcome.scss";

const Outcome = ({ data, setValue }: { data: any; setValue: any }) => {
  const [outCome, setOutCome] = React.useState<string[]>();

  React.useEffect(() => {
    getUniqueRecords();
  }, [data]);

  const getUniqueRecords = () => {
    var uniqueRec: string[] = [];
    data.forEach((x: any) => {
      if (uniqueRec.indexOf(x) === -1) {
        uniqueRec.push(x);
      }
    });
    setOutCome(uniqueRec);
  };

  return (
    <>
      {outCome?.map((x, i) => (
        <li onClick={(e: any) => setValue(e.target.id)} id={x}>
          {x}
        </li>
      ))}
    </>
  );
};

export default Outcome;
