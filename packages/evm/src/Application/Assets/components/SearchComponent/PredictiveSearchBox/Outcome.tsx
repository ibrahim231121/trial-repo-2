import React from "react";

const Outcome = ({ data }: { data: any }) => {
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
    <div>
      {outCome?.map((x) => (
        <div>{x}</div>
      ))}
    </div>
  );
};

export default Outcome;
