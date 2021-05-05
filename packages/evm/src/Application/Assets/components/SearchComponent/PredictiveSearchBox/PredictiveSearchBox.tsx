import React, { useState, useRef } from "react";
import "./PredictiveSearchBox.scss";
import useSearchWorker from "../../../utils/useSearchWorker";
import Outcome from "./Outcome";
import {EditableSelect} from '@cb/shared'
interface Props {
  onSet: (e: any) => void;
}
const PredictiveSearchBox: React.FC<Props> = ({ children, onSet }) => {
  const url = "/Evidence?Size=10&Page=1";
  const [showSearch, setShowSearch] = useState<any>(false);
  const [outCome, setOutCome] = useState<any>([]);
  const [inputValue, setInputValue] = useState<string>("");

  //onChange
  const handleOnChange = async (e: any) => {
    const { value } = e.target; 
    const worker = useSearchWorker.getInstance();

    //message recieved from worker.
    worker.addEventListener("message",(e) => {
        setOutCome(e.data);},false);

    if(value){
      if (value && value.length >= 3) {
        const data = await fetchData(value);
        if (data) {
          worker.postMessage({ data, value });
          setShowSearch(true);
        }
      }
      if(value && value.length < 3){
        setShowSearch(false);
        setOutCome([]);
      }
      onSet(value);
    }else{
      onSet("");
      setOutCome([]);
    }
  };

  const getQuery = (searchVal: string) => {
    return {
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
    };
  };
  const fetchData = async (searchVal: string) => {
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

  const onChangeAutoComplete = (e : any,value:any) =>{
    if(value && value != null){
      setInputValue(value);
    }
    setShowSearch(false);
  }

  return (
    <div>
      <EditableSelect
          id="combo-box-demo"
          options={outCome}
          placeHolder={"Search for asset by AssetID#, CAD#, Categories and RecordedBy"}
          onChange={onChangeAutoComplete}
          onInputChange={handleOnChange}
          clearText={()=>setInputValue("")}
      />
    </div>
  );
};

export default PredictiveSearchBox;
