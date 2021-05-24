import React, { useState, useRef } from "react";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import { CRXButton } from "@cb/shared";
import "./PredictiveSearchBox/PredictiveSearchBox.scss";
import queries from "../../QueryManagement/queries";
import constants from '../../utils/constants'

interface Props {
  shortcutData: {
    text: string,
    query:any,
    renderData:() => any
  }[]
}


const SelectedAsset : React.FC<Props> =  ({shortcutData}) => {
  return (
    <>
     {
       shortcutData.map((data : any,index:number) =>{
         return <div key={index} className="listOfContent" onClick={() => data.renderData()} >
                  <div className="listButton">
                    <CRXButton className="listParentBtn">
                    <i className="far fa-file-search listIcon"></i>
                    </CRXButton>
                    <div className="count-badge">15</div>
                  </div>
                  <div className="iconBtnLabel">{data.text}</div>
                </div>
       })
     }
    </>
  );
};

export default SelectedAsset;
