import {
    Route,
    Redirect,
  } from "react-router-dom";
  
  import { isAuthenticated } from "../Login/API/auth";
  import {SessionRouteT} from '../Logout/API/auth'
  
  const SessionRoute = ({ component:Component, ...rest }) => {
     
  return (
        <Route
          {...rest}
          render={ props =>
            !isAuthenticated() && SessionRouteT()? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: props.location }
                }}
              />
            )
          }
        />
  )
    }
    
  
    export default SessionRoute