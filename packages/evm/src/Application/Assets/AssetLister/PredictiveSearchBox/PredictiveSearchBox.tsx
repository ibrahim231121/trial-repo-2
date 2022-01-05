import React from 'react';
import "./PredictiveSearchBox.scss";
import useSearchWorker from "../../utils/useSearchWorker";
import Outcome from "./Outcome";
import { EditableSelect } from '@cb/shared'
import { useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../../../Redux/breadCrumbReducer";
import usePostFetch from "../../../../utils/Api/usePostFetch";
import { EVIDENCE_PREDITIVE_URL } from '../../../../utils/Api/url'
interface Props {
  onSet: (e: any) => void;
  value: string;
}
const PredictiveSearchBox: React.FC<Props> = ({ children, onSet, value }) => {

  const [showSearch, setShowSearch] = React.useState<any>(false);
  const [outCome, setOutCome] = React.useState<any>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [methodFromHook, responseFromHook] = usePostFetch<any>(EVIDENCE_PREDITIVE_URL);

  React.useEffect(() => {
    if (responseFromHook) {
      setOutCome(responseFromHook);
      setShowSearch(true);
    }
  }, [responseFromHook]);

  //onChange
  const handleOnChange = async (e: any) => {
    if (e && e.target && e.target != null) {
      const { value } = e.target;
      // const worker = useSearchWorker.getInstance();
      if (value) {
        if (value && value.length >= 3 && !value.startsWith("#")) {
          /* Previous Logic */
          // const data = await fetchData(value);
          /* Current Logic */
          fetchData(value);
          /* Previous Logic */
          // if (data) {
          //   // worker.postMessage({ data, value });
          //   setOutCome(data);
          //   setShowSearch(true);
          // }
          /* Since above snippet depends on the reponse 'data', so i have written that logic in line no 35, where the response will be handled in useEffect.*/
        }
        if (value && value.length < 3) {
          setShowSearch(false);
          setOutCome([]);
        }
        onSet(value);
      } else {
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
    /* Previous Fetch Logic */
    // let data = await fetch(predictiveUrl, {
    //   method: "POST", // or 'PUT'
    //   headers: {
    //     "Group-Ids": "1,2,3,4,5,6,7,8,9",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(getQuery(searchVal)),
    // });
    // data = await data.json();
    // return data;

    /* Applying usePostFetch Hook*/
    methodFromHook(getQuery(searchVal), {
      "Group-Ids": "1,2,3,4,5,6,7,8,9",
      "Content-Type": "application/json",
    });
  };

  const onChangeAutoComplete = (e: any, value: any) => {
    if (value && value != null) {
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
        clearText={() => setInputValue("")}
        value={value}

      />
    </div>
  );
};

export default PredictiveSearchBox;
