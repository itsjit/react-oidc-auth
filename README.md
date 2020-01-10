# React Components for OAuth2 Implicit Flow

![package](https://github.com/itsjit/react-oidc-auth/workflows/Package/badge.svg)
[![npm version](https://badge.fury.io/js/react-oidc-auth.svg)](https://badge.fury.io/js/react-oidc-auth)

Uses **_oidc-client_** package internally to provide couple of components for OAuth2 implicit flow.

Basically the app sits on **/** route.
Plus there are **/signin-oidc** and **/signout-oidc** callbacks registered in the OAuth2 provider (for example in Google or Facebook).

## Authenticated Component

The **_Authenticated_** component is the core. Callback **_onUserLoaded_** is called whenever user logs in and/or tokens are refreshed. Callback **_onUserUnloaded_** is called whenever OAuth2 provider redirects to sign-out route and should be used to remove the user from app state.

The component displays it's children only if the user is authenticated. In the example below, there is context used to pass OIDC user manager and configuration. It may be used to initiate sign-out for example.

## Sign-in + Sign-out

If there is no user logged in, then the **_Authenticated_** component redirects to OAuth2 provider, see **_authority_** in OIDC configuration. Then user logs in, usually enters it's credentials, and the provider redirects to sign-in callback, in our case to **/signin-oidc**. If the **_SignInCallback_** component detects an user, then the **_onSuccess_** callback is called with appropriate user object. Sign-out works analogically.

## Silent Refresh

The silent refresh is supported as well. The **_SilentRefreshCallback_** component basically wraps logic from _UserManager_. The logic is implemented in **_Authenticated_** component. If tokens are close to expiration, the automatic refresh is performed and the **_onUserLoaded_** callback is called with appropriate user object. In order to enable the silent refresh, the configuration must be set: **automaticSilentRenew=true** and **silent_redirect_uri=".../silent-refresh"**. And the client in OAuth2 provider must be set to appropriate URLs as well.

## Configuration

Generally the client in OAuth2 provider must be set up with appropriate callback URLs for sign-in, sign-out and silent refresh. See **_redirect_uri_**, **_post_logout_redirect_uri_** and **_silent_redirect_uri_** values. Don't forget to configure appropriate **_scope_**, **_client_id_** and **_client_secret_**.

## Example Code

```jsx
import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import {
  Authenticated,
  SignInCallback,
  SignOutCallback,
  SilentRefreshCallback,
  OidcContext
} from 'react-oidc-auth/dist';

// TODO: Provide you configuration in better way
const oidcConfiguration = {
  authority: 'https://some.authority.net',
  client_id: 'your_client',
  redirect_uri: `${window.location.origin}/signin-oidc`,
  response_type: 'id_token token',
  scope: 'openid profile someScope',
  post_logout_redirect_uri: `${window.location.origin}/signout-oidc`,
  silent_redirect_uri: `${window.location.origin}/silent-refresh`,
  automaticSilentRenew: true
};

const App = ({ setUser, clearUser }) => {
  // setUser - adds the user (incl. tokens) to state/store
  // clearUse - removes the user from state/store
  return (
    <Router>
      <Switch>
        <Route
          exact={true}
          path="/signin-oidc"
          render={routeProps => <SignInCallback onSuccess={user => routeProps.history.push('/')} />}
        />
        <Route
          exact={true}
          path="/signout-oidc"
          render={routeProps => <SignOutCallback onSuccess={() => routeProps.history.push('/')} />}
        />
        <Route exact={true} path="/silent-refresh" render={routeProps => <SilentRefreshCallback />} />

        <Route exact={false} path="/">
          <Authenticated oidcConfiguration={oidcConfiguration} onUserLoaded={setUser} onUserUnloaded={clearUser}>
            <OidcContext.Consumer>
              {value => (
                <button floated="right" basic icon onClick={() => value.userManager.signoutRedirect()}>
                  Log out
                </button>
              )}
            </OidcContext.Consumer>

            <Route exact={true} path="/">
              I'm logged in.
            </Route>
            <Switch>
              <Route path="/new">New item</Route>
              <Route path="/:id">Item detail</Route>
            </Switch>
          </Authenticated>
        </Route>
      </Switch>
    </Router>
  );
};
```
