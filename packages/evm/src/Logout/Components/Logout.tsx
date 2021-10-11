import {CRXButton} from '@cb/shared';
import {CRXPaper} from '@cb/shared';
import getacVideoSolution from '../../Assets/Images/getacVideoSolution.png';
import { useHistory } from "react-router";
export default function Logout (){
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
