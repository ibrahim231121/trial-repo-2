import React, { useState, useRef } from "react";
import "./PredictiveSearchBox.scss";
import SearchWorker from "../../../utils/search.worker";
import useSearchWorker from "../../../utils/useSearchWorker";
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
  const [showSearch, setShowSearch] = useState<any>(false);
  const [outCome, setOutCome] = useState<any>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  //onChange
  const handleOnChange = async (e: any) => {
    const { value } = e.target;
    setInputValue(value);
    onSet(value);

    const worker = useSearchWorker.getInstance();

    //message recieved from worker.
    worker.addEventListener(
      "message",
      function (e) {
        setOutCome((state: any) => [...state, e.data]);
      },
      false
    );

    if (value.length >= 3) {
      await fetchData();
      await worker.postMessage({ searchData, value });
    }
    setShowSearch(true);
  };
  const url = "/Evidence?Size=10&Page=1";
  const querry = {
    bool: {
      must: [
        {
          query_string: {
            query: `${inputValue}*`,
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
  // console.log("searchData", searchData);
  // console.log("outcome", outCome);
  return (
    <div className="wrapper" ref={wrapperRef}>
      <div className="search-input">
        <a href="" target="_blank" hidden></a>
        <input
          type="text"
          placeholder="Type to search.."
          value={inputValue}
          onChange={handleOnChange}
          onKeyDown={(e: any) => onKeyDown(e.code)}
        />
        <div className="autocom-box">
          {showSearch && outCome && (
            <Outcome
              data={outCome}
              setValue={(val: any) => {
                setShowSearch(false);
                setInputValue(val);
              }}
            />
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default PredictiveSearchBox;
