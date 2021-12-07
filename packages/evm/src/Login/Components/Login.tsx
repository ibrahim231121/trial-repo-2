import {CRXButton} from '@cb/shared';
import {CRXPaper} from '@cb/shared';
import { useEffect } from "react";
import getacVideoSolution from '../../Assets/Images/getacVideoSolution.png';
import { utils } from "../../utils/settings";
import { AUTHENTICATION_LOGIN_URL } from '../../utils/Api/url'

export default function Login (){

  useEffect(() => {
    const listener = (event: { code: string; preventDefault: () => void; }) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        buttonClick()
        
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);
  
    const buttonClick = () => {
        window.location.href = AUTHENTICATION_LOGIN_URL+`${utils()}`;
      };
        return (
            <div className="login_box" >
            <CRXPaper className="main_box">
            <CRXPaper className="box_paper">
                <div className="inner_paper_box">
                  <img  src={getacVideoSolution} className="box_paper_h1"/>
                  <p className="box_paper_h2">
                Login To Getac Enterprise using Getac Authentication
                  </p>

                  <p className="box_paper_h3">
                  Inspiring statement about Getac / Getac product that is relevant to user
                  </p>
                  
                  <p className="box_paper_span">
                You are accessing a restricated information system. Your usage may be monitored, recoreded and subject to
                audit. Unauthorized use of the system is prohibited and may be subject to criminal and/or civil penalities. By 
                using this system and clicking "Log In" , you consent to your usage being monitored and recorded.
                  </p>
                  <CRXButton className="button_login" 
                  onClick={() => {
            buttonClick();
          }}
          >
                  Log In
                  </CRXButton>
                </div>
            </CRXPaper>
            </CRXPaper>
            </div>
        )
    
}
