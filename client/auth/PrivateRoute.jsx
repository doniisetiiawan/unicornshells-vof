// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import auth from './auth-helper';

const PrivateRoute = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (auth.isAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/signin',
          state: { from: props.location },
        }}
      />
    ))}
  />
);

export default PrivateRoute;
