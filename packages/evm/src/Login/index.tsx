import {useState,useEffect} from 'react';
import './Login.scss';
import Login from './Components/Login'
import image1 from '../Assets/Images/loginPageImages/1.jpg';
import image2 from '../Assets/Images/loginPageImages/2.jpg';
import image3 from '../Assets/Images/loginPageImages/3.jpg';
import image4 from '../Assets/Images/loginPageImages/4.jpg';
import image5 from '../Assets/Images/loginPageImages/5.jpg';
import image6 from '../Assets/Images/loginPageImages/6.jpg';
import Fade from '@material-ui/core/Fade';


export default function LoginPage () {
   

    const [images] = useState([image1,image2,image3,image4,image5,image6])
    const timeoutObj = {
        appear: 0, enter: 2000, exit: 4000
    }

    const [activeImageIndex,setActiveImageIndex] = useState(5)
    const timer = () => setActiveImageIndex(activeImageIndex - 1);

    useEffect(
        () => {
            
        
            if (activeImageIndex == 0)(
                setActiveImageIndex(5) 
            )
            const id = setInterval(timer, 4000);
            return () => clearInterval(id);
        },
        [activeImageIndex]
    );
    
   


        return (
            <div className="main_page">
               <Login/>  
              
               <Fade in={activeImageIndex == 5 || activeImageIndex == 0 ? true : false} timeout={timeoutObj} >  
                    <img src={images[0]}  className="DottedBox"/>
               </Fade>
               <Fade in={activeImageIndex == 4 ? true : false} timeout={timeoutObj} >  
                    <img src={images[1]}  className="DottedBox"/>
               </Fade>
               <Fade in={activeImageIndex == 3 ? true : false} timeout={timeoutObj} >  
                    <img src={images[2]}  className="DottedBox"/>
               </Fade>
               <Fade in={activeImageIndex == 2 ? true : false} timeout={timeoutObj} >  
                    <img src={images[3]}  className="DottedBox"/>
               </Fade>
               <Fade in={activeImageIndex == 1 ? true : false} timeout={timeoutObj} >  
                    <img src={images[4]}  className="DottedBox"/>
               </Fade>
               <Fade in={activeImageIndex == 0 ? true : false} timeout={timeoutObj} >  
                    <img src={images[5]}  className="DottedBox"/>
               </Fade>
           </div>
        )
    }
