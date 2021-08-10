import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import clsx from 'clsx';
import { CRXAppBar, CRXContainer, CRXPanelStyle, } from "@cb/shared";
import AppHeader from './Application/Headeer/Header'
import Footer from './Application/Headeer/Footer'
import {useTranslation} from 'react-i18next'; 
import "../../evm/src/utils/Localizer/i18n"

function App() {
  let culture: string = "en"
  const [resources, setResources] = useState<any>('')
  const {i18n} = useTranslation<string>();
  const [rtl, setRTL] = useState<string>()

  const [open, setOpen] = useState(true);
  const classes = CRXPanelStyle()
   
  const handleDrawerToggle = () => {
      setOpen(!open);
  };

  useEffect(() => {
    import(`../../evm/src/utils/Localizer/resources/${culture}`).then(res => {
      setResources(res.resources);
    });

    i18n
    .init({
      resources: resources,
      lng: culture
    });

    if(i18n.language === 'en')
    {
      i18n.changeLanguage('en')
      setRTL("ltr")
    }
    else if(i18n.language === 'ar')
    {
      i18n.changeLanguage('ar')
      setRTL("rtl")
    }
    else if(i18n.language === 'fr')
    {
      i18n.changeLanguage('fr')
      setRTL("ltr")
    }
  },[culture,resources])

  return (
    
    <div dir={rtl}>
      <CRXAppBar position="fixed">
          <AppHeader onClick={handleDrawerToggle} onClose={handleDrawerToggle} open={open} />
      </CRXAppBar>
      
      <main 
      className={clsx(classes.content, {
        [classes.contentShift]: open,
      })}
      >
      <CRXContainer className="mainContainer" maxWidth="xl" disableGutters={true}>
        <Routes />
      </CRXContainer>
      </main>

      <footer>
        <Footer />        
      </footer>

    </div>
  );
}

export default App;

