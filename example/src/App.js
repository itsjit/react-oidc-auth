import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {
  SignInCallback,
  SignOutCallback,
  SilentRefreshCallback,
  Authenticated,
  OidcContext
} from 'react-oidc-auth';

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

function App() {
  const setUser = user => console.log('New user: ', user);
  const clearUser = () => console.log('Clear user.');
  return (
    <BrowserRouter>
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
        <Route
          exact={true}
          path="/silent-refresh"
          render={routeProps => <SilentRefreshCallback />}
        />

        <Route exact={false} path="/">
          <Authenticated
            oidcConfiguration={oidcConfiguration}
            onUserLoaded={setUser}
            onUserUnloaded={clearUser}
          >
            <OidcContext.Consumer>
              {value => (
                <button onClick={() => value.userManager.signoutRedirect()}>Log out</button>
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
    </BrowserRouter>
  );
}

export default App;
