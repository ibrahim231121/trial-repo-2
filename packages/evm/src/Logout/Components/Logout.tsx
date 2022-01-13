import {CRXButton} from '@cb/shared';
import {CRXPaper} from '@cb/shared';
import getacVideoSolution from '../../Assets/Images/getacVideoSolution.png';
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { timerActionCreator } from "./../../Redux/timerslice";
export default function Logout (){
    const dispatch = useDispatch()
    useEffect(() => {
    dispatch(timerActionCreator(3480)) },)

    const history = useHistory();
    const buttonClick = () => {
            
      history.push('/')

      };
        return (
            <div className="login_box" >
            <CRXPaper className="main_box">
            <CRXPaper className="box_paper">
                <img  src={getacVideoSolution} className="box_paper_h1"/>
                <p className="box_paper_h2">
               You have logged out of Getac Enterprise
                </p>

                <CRXButton className="button_login" 
                 onClick={buttonClick}
        >
                 Log In
                </CRXButton>
            </CRXPaper>
            </CRXPaper>
            </div>
        )
    
}
