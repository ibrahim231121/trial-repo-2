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
  
  const url = "/Evidence?Size=10&Page=1";
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
        setOutCome(e.data);
      },
      false
    );

    
    if (value.length >= 3) {
      const data = await fetchData(value);
      if (data) {
        worker.postMessage({ data, value });
        setShowSearch(true);
      }
    }
    if(value.length < 3){
      setShowSearch(false);
    }
  };

  const getQuery = (searchVal:string) =>{
    return{ 
        bool: {
        must: [
          {
            query_string: {
              query: `${searchVal}*`,
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
    }
  }
  const fetchData = async (searchVal:string) => {
    let data = await fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Group-Ids": "1,2,3,4,5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getQuery(searchVal)),
    });
    data = await data.json();
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
  return (
    <div className="wrapper" ref={wrapperRef}>
      <div className="search-input">
        <a href="" target="_blank" hidden></a>
        <input
          type="text"
          placeholder="Type to search.."
          value={inputValue}
          onChange={handleOnChange}
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
