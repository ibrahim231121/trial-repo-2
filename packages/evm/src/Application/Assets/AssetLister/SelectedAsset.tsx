import React, { useState, useRef } from "react";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import { CRXButton , CRXBadge } from "@cb/shared";
import "./PredictiveSearchBox/PredictiveSearchBox.scss";
import queries from "../QueryManagement/queries";
import { useDispatch } from "react-redux";
import { DateTimeObject } from '../../../GlobalComponents/DateTime';
import {navigationUpdate} from "../../../Redux/NavigationStateReducer"

interface Props {
  shortcutData: {
    text: string,
    query:Object,
    renderData:(data : DateTimeObject | undefined) => void
  }[]
}

const SelectedAsset : React.FC<Props> =  ({shortcutData}) => {
  const dispatch  = useDispatch();
  const renderDataAsset = (item: any) => {
    dispatch(navigationUpdate(item));
  } 
  return (
    <>
     {
       shortcutData.map((data : any,index:number) =>{
         return <button key={index} className="listOfContent" onClick={() => {data.renderData(); renderDataAsset("Assets")}} >
                  {/* <div className="listButton">
                    <CRXButton className="listParentBtn">
                    <span className="listIcon"></span>            
                    </CRXButton>
                    <CRXBadge color="secondary" className="count-badge">{15}</CRXBadge>
                  </div> */}
                  <div className="iconBtnLabel">{data.text}</div>
                </button>
       })
     }
    </>
  );
};

export default SelectedAsset;
