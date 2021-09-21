import {
  Route,
  Redirect,
} from "react-router-dom";

import { isAuthenticated } from "../Login/API/auth";

const HomeRoute = ({ component:Component, ...rest }) => {
   
return (
      <Route
        {...rest}
        render={ props =>
          !isAuthenticated() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/assets",
                state: { from: props.location }
              }}
            />
          )
        }
      />
)
  }
  

  export default HomeRoute