import React, { useState, useRef } from "react";
import "./PredictiveSearchBox.scss";
import useSearchWorker from "../../../utils/useSearchWorker";
import Outcome from "./Outcome";
import {EditableSelect} from '@cb/shared'
import { useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../../../../Redux/breadCrumbReducer";
interface Props {
  onSet: (e: any) => void;
  value:string;
}
const PredictiveSearchBox: React.FC<Props> = ({ children, onSet,value }) => {
// const dispatch = useDispatch()
//   React.useEffect(() => {
//     const worker = useSearchWorker.getInstance();
//     var showDataList = (e:any) =>{
//       setOutCome(e.data);
//     }
//     //message recieved from worker.
//     worker.addEventListener("message",showDataList,false);
//     return () => {
//       worker.removeEventListener("message",showDataList);
//     };
//   },[]);
  

  const url = "/Evidence?Size=10&Page=1";
  const predictiveUrl="/Evidence/predictive";
  const [showSearch, setShowSearch] = useState<any>(false);
  const [outCome, setOutCome] = useState<any>([]);
  const [inputValue, setInputValue] = useState<string>("");

  //onChange
  const handleOnChange = async (e: any) => {
    if( e &&  e.target && e.target != null){
    const { value } = e.target; 
    const worker = useSearchWorker.getInstance();
    if(value){
      if (value && value.length >= 3 && !value.startsWith("#")) {
        const data = await fetchData(value);
        if (data) {
         // worker.postMessage({ data, value });
         setOutCome(data);
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
    let data = await fetch(predictiveUrl, {
      method: "POST", // or 'PUT'
      headers: {
        "Group-Ids": "1,2,3,4,5,6,7,8,9",
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
      onSet(value);
    }
    setShowSearch(false);
  }

  return (
    <div className="combo-box-Search">
      <i className="fal fa-search customIcon"></i>
      <EditableSelect
          id="combo-box-demo"
          options={outCome}
          placeHolder={"Search assets by ID#, case#, CAD#, categories, etc."}
          onChange={onChangeAutoComplete}
          onInputChange={handleOnChange}
          clearText={()=>setInputValue("")}
          value={value}

      />
    </div>
  );
};

export default PredictiveSearchBox;
