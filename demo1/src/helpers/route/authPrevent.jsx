import React from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from "../Auth";

const AuthPrevented = ({ component: Component, ...rest }) => {
  const userinfo = Auth.getUserDetail();
  return (
    <Route
      {...rest}
      render={(props) =>
        (userinfo?.admin?.role?.roleName === "superadmin") &
        (Auth.isUserAuthenticat() === true) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default AuthPrevented;
