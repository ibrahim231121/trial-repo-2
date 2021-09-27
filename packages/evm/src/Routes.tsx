import React from "react";
import { Switch, Route } from "react-router-dom";
import clsx from 'clsx';
import { CRXAppBar, CRXPanelStyle, } from "@cb/shared";
import AppHeader from './Application/Headeer/Header'
import Footer from './Application/Headeer/Footer'
import MannageAsset from "./Application/Assets/pages/MannageAsset";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Login from './Login/index';
import Token from './Login/Components/Token';
import PrivateRoute from "./Routes/PrivateRoute";
import HomeRoute from "./Routes/HomeRoute";
const Routes = () => {
  const [open, setOpen] = React.useState(true);
  const classes = CRXPanelStyle();

  const handleDrawerToggle = () => {

    setOpen(!open);
    
  };

  return (
    <div>
    <HomeRoute  path="/"  exact={true} component={Login} />
    <Route path={'/(.+)'} render={()=>(
      <>
      <CRXAppBar position="fixed">
      <AppHeader onClick={handleDrawerToggle} onClose={handleDrawerToggle} open={open} />
      </CRXAppBar>
      <main 
    className={clsx(classes.content, {
      [classes.contentShift]: open,
    })}
    >
    <Switch>
    
      {/* <Route path="/" exact={true} component={() => <>Home componentss</>} /> */}
    <PrivateRoute path="/assets"  exact={true} component={MannageAsset} />
    <Route path="/token/:token" exact={true} component={Token}/>
    <PrivateRoute  path="*"  component={ErrorPage} />
    </Switch>
    </main>
    <footer>
        <Footer />        
    </footer>
      </>

    )}>
      
    </Route>
    </div>
   
  );
};

export default Routes;
