import {CRXButton} from '@cb/shared';
import {CRXPaper} from '@cb/shared';
import { useEffect } from "react";
import getacVideoSolution from '../../Assets/Images/getacVideoSolution.png';
import { useHistory } from "react-router";


export default function Login (){
    const history = useHistory();
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
        localStorage.removeItem("sessionRoute");
        history.push('/');
      };
        return (
            <div className="login_box" >
            <CRXPaper className="main_box">
            <CRXPaper className="box_paper">
                <img  src={getacVideoSolution} className="box_paper_h1"/>
                <p className="box_paper_h2">
                The System has logged you out due to Inactivity
                </p>

                <CRXButton className="button_login" 
                 onClick={() => {
          buttonClick();
        }}
        >
                 Log In
                </CRXButton>
            </CRXPaper>
            </CRXPaper>
            </div>
        )
    
}
