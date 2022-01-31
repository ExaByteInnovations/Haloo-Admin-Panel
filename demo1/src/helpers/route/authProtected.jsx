import React from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from "../Auth";

const AuthProtected = ({ component: Component, ...rest }) => {
  const userinfo = Auth.getUserDetail();
  return (
    <Route
      {...rest}
      render={(props) =>
        (Auth.isUserAuthenticat() === true) &
        (userinfo?.admin?.role?.roleName === "user") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default AuthProtected;
