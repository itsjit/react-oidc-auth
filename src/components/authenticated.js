import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserManager } from 'oidc-client';

import OidcContext from './oidc-context';

const Authenticated = ({ onUserLoaded, onUserUnloaded, onError, onExpired, oidcConfiguration, children }) => {
  const [hasUser, setHasUser] = useState(false);
  const [userManager, setUserManager] = useState(null);

  useEffect(() => {
    const newUserManager = new UserManager(oidcConfiguration);
    console.debug('OIDC AUTH:', 'Init.');
    setUserManager(newUserManager);
  }, [oidcConfiguration, setUserManager]);

  useEffect(() => {
    if (userManager) {
      userManager.events.addUserLoaded(user => {
        console.debug('OIDC AUTH:', 'User loaded.');
        if (onUserLoaded) {
          onUserLoaded(user);
        }
      });
      userManager.events.addUserUnloaded(() => {
        console.debug('OIDC AUTH:', 'User unloaded.');
        if (onUserUnloaded) {
          onUserUnloaded();
        }
      });
      userManager.events.addAccessTokenExpired(() => {
        console.debug('OIDC AUTH:', 'Token expired.');
        userManager.removeUser().then(() => {
          setHasUser(false);
          if (onExpired) {
            onExpired();
          }
        });
      });
    }
  }, [userManager, onUserLoaded, onUserUnloaded, onExpired]);

  useEffect(() => {
    //If we don't has any user, then we try to get it from user manager.
    if (userManager && !hasUser) {
      console.debug('OIDC AUTH:', 'Asking for user.');
      console.log(hasUser, userManager, onError, onUserLoaded, onUserUnloaded);
      userManager
        .getUser()
        .then(user => {
          console.debug('OIDC AUTH:', 'GetUser callback.');
          if (user !== null && user !== undefined) {
            console.debug('OIDC AUTH:', 'Have got an user');
            if (onUserLoaded) {
              onUserLoaded(user);
            }
            setHasUser(true);
          } else {
            console.debug('OIDC AUTH:', "Don't have got any user.");
            if (onUserUnloaded) {
              onUserUnloaded();
            }
            setHasUser(false);
            console.debug('OIDC AUTH:', 'Redirect to login.');
            userManager.signinRedirect();
          }
        })
        .catch(error => {
          console.error('OIDC AUTH:', error);
          if (onError) {
            onError(error);
          }
        });
    }
  }, [hasUser, onError, onUserLoaded, onUserUnloaded, userManager]);

  // We render only if user has arrived.
  return (
    <OidcContext.Provider
      value={{
        userManager: userManager,
        configuration: oidcConfiguration
      }}
    >
      {hasUser ? children || null : null}
    </OidcContext.Provider>
  );
};

Authenticated.propTypes = {
  /**
   * @property {object} oidcConfiguration Instance of OIDC Configuration object.
   */
  oidcConfiguration: PropTypes.object.isRequired,
  /**
   * @property {func} onUserLoaded Raised when an user has been extracted from sign in callback.
   */
  onUserLoaded: PropTypes.func,
  /**
   * @property {func} onUserUnloaded Raised when an user has been signed out.
   */
  onUserUnloaded: PropTypes.func,
  /**
   * @property {func} onError Raised when an error has been encountered.
   */
  onError: PropTypes.func
};

export default Authenticated;
