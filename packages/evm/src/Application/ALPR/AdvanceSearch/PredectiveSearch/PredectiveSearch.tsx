import React from 'react';
// import "./PredictiveSearchBox.scss";
import { EditableSelect } from '@cb/shared'
import usePostFetch from "../../../../utils/Api/usePostFetch";
import { BASE_URL_ALPR_Service } from '../../../../utils/Api/url'
import { getToken, IDecoded } from "../../../../Login/API/auth";
import { useTranslation } from "react-i18next";
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import { GenerateLockFilterQuery } from '../../../Assets/utils/constants';
import useGetFetch from '../../../../utils/Api/useGetFetch';
import ParamUseGetFetch from '../../../../utils/Api/ParamUseGetFetch';

interface Props {
  onSet: (e: any) => void;
  value: string;
  decoded: IDecoded;
  onKeyUp: (event: React.KeyboardEvent<HTMLImageElement>) => void;
}

const AlprPredictiveSearchBox: React.FC<Props> = ({ children, onSet, value, decoded,onKeyUp }) => {
  const ADVANCE_SEARCH_URL=BASE_URL_ALPR_Service+'/ALPR/Search/NumberPlate/';
  const { t } = useTranslation<string>();
  const [showSearch, setShowSearch] = React.useState<any>(false);
  const [outCome, setOutCome] = React.useState<any>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [methodFromHook, responseFromHook] = ParamUseGetFetch<any>(ADVANCE_SEARCH_URL,
    { "Content-Type": "application/json", TenantId: "1",UserId:"1",'Authorization': `Bearer ${getToken()}` });
  const cookies = new Cookies();
  let decodedToken : IDecoded = jwt_decode(cookies.get("access_token"));

  React.useEffect(() => {
    if (responseFromHook) {
      setOutCome(responseFromHook);
      setShowSearch(true);
    }
  }, [responseFromHook]);

  const handleOnChange = async (e: any) => {
    if (e && e.target && e.target != null) {
      const { value } = e.target;
      if (value) {
        if (value && value.length >= 3 && !value.startsWith("#")) {
         fetchData(value);
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

 
  const fetchData = async (searchVal: string) => {
    methodFromHook(`${searchVal}`);
  };

  const onChangeAutoComplete = (e: any, value: any) => {
    if (value && value != null) {
      setInputValue(value);
      onSet(value);
    }
    setShowSearch(false);
  }

  return (
    <div className="Alpr_combo-box-Search">
      <i className="fal fa-search customIcon"></i>
      <EditableSelect
        id="combo-box-demo"
        options={outCome}
        placeHolder={t("Search_by_Number_Plate")}
        onChange={onChangeAutoComplete}
        onInputChange={handleOnChange}
        clearText={() => setInputValue("")}
        value={value}
        onKeyUp = {onKeyUp}
        

      />
    </div>
  );
};

export default AlprPredictiveSearchBox;
