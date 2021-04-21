import React, { useState, useRef } from "react";
import "./PredictiveSearchBox.scss";
import SearchWorker from "../../../utils/search.worker";
import Outcome from "./Outcome";

interface Props {
  onSet: (e: any) => void;
}
const PredictiveSearchBox: React.FC<Props> = ({ children, onSet }) => {
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);
  const [searchData, setSearchData] = useState<any>();
  const [searchQuerry, setSearchQuerry] = useState<any>();
  const [showSearch, setShowSearch] = useState<any>(false);
  const [outCome, setOutCome] = useState<any>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  //onChange
  const handleOnChange = async (e: any) => {
    const { value } = e.target;
    onSet(value);

    const worker: Worker = new SearchWorker();
    worker.postMessage({ value });

    worker.addEventListener(
      "message",
      function (e) {
        setOutCome((state: any) => [...state, e.data]);
      },
      false
    );

    setSearchQuerry(value);
    if (value.length >= 3) {
      const data = await fetchData();

      if (data) {
        worker.postMessage({ searchData, value });
      }
    }
    setShowSearch(true);
  };
  const url = "/Evidence?Size=10&Page=1";
  const querry = {
    bool: {
      must: [
        {
          query_string: {
            query: `${searchQuerry}*`,
            fields: [
              "asset.assetName",
              "categories",
              "cADId",
              "asset.recordedBy",
            ],
          },
        },
      ],
    },
  };
  const fetchData = async () => {
    let data = await fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Group-Ids": "1,2,3,4,5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(querry),
    });
    data = await data.json();
    await setSearchData(data);
    await setShowSearch(true);
    return data;
  };
  const handleClickOutSide = (e: MouseEvent) => {
    const { current: wrap } = wrapperRef;
    if (
      wrapperRef.current !== null &&
      !wrapperRef.current.contains(e.target as HTMLElement)
    ) {
      setShowSearch(false);
    }
  };
  const onKeyDown = async (code: any) => {
    if (code === "Backspace") {
      setSearchData([]);
      setShowSearch(false);
      setOutCome([]);
      const data = await fetchData();
      await setSearchData(data);
      await setShowSearch(true);
    }
  };
  // console.log(showSearch);
  // console.log(searchQuerry);
  return (
    <div className="wrapper" ref={wrapperRef}>
      <div className="search-input">
        <a href="" target="_blank" hidden></a>
        <input
          type="text"
          placeholder="Type to search.."
          onChange={handleOnChange}
          onKeyDown={(e: any) => onKeyDown(e.code)}
        />
        <div className="autocom-box">
          {showSearch && outCome && <Outcome data={outCome} />}
        </div>
        {children}
      </div>
    </div>
  );
};

export default PredictiveSearchBox;
