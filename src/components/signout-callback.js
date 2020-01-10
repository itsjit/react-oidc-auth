import PropTypes from 'prop-types';
import { UserManager } from 'oidc-client';

const SignoutCallback = ({ onSuccess, onError, children }) => {
  console.debug('OIDC SIGNOUT:', 'Signout callback.');
  new UserManager()
    .signoutRedirectCallback()
    .then(() => {
      console.debug('OIDC SIGNOUT:', 'Signout callback done.');
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch(error => {
      console.error('OIDC SIGNOUT:', error);
      if (onError) {
        onError(error);
      }
    });
  return children || null;
};

SignoutCallback.propTypes = {
  /**
   * @property {func} onSuccess Raised when a user has been signed out.
   */
  onSuccess: PropTypes.func,
  /**
   * @property {func} onError Raised when an error has been encountered.
   */
  onError: PropTypes.func
};

export default SignoutCallback;
