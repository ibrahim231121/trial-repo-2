import { useContext, ReactDOM } from 'react'
import {
  Route,
  Redirect,
} from "react-router-dom";
import ApplicationPermissionContext from '../ApplicationPermission/ApplicationPermissionContext'
import { isAuthenticated, getToken } from "../Login/API/auth";

const PrivateRoute = ({ component:Component, ...rest }) => {
   
  const {
    getModuleIds
  } = useContext(ApplicationPermissionContext);
  const {moduleId} = rest
return (
      <Route
        {...rest}
        exact={true}
        render={(props) =>{
          var component = <Component {...props} />;
          var redirectToLoginComponent =  <Redirect
                                              to={{
                                                pathname: "/",
                                                state: { from: props.location }
                                              }}
                                          />

          var redirectToNotFoundComponent =  <Redirect
                                                to={{
                                                  pathname: "/notfound",
                                                  state: { from: props.location }
                                                }}
                                            />
          if (isAuthenticated()){
            if( getModuleIds().includes(moduleId)){
              return component;
            }else{
              return redirectToNotFoundComponent;
            }  
          }
          else{
              return redirectToLoginComponent;
          }
        }}
      />
)
  }
  

  export default PrivateRoute