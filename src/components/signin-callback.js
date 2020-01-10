import PropTypes from 'prop-types';
import { UserManager } from 'oidc-client';

const SigninCallback = ({ onSuccess, onError, children }) => {
  console.debug('OIDC SIGNIN:', 'Signin callback.');
  new UserManager()
    .signinRedirectCallback()
    .then(user => {
      console.debug('OIDC SIGNIN:', 'Signin callback done.');
      if (onSuccess) {
        onSuccess(user);
      }
    })
    .catch(error => {
      console.error('OIDC SIGNIN:', error);
      if (onError) {
        onError(error);
      }
    });
  return children || null;
};

SigninCallback.propTypes = {
  /**
   * @property {func} onSuccess Raised when an user has been extracted from sign in callback.
   */
  onSuccess: PropTypes.func,
  /**
   * @property {func} onError Raised when an error has been encountered.
   */
  onError: PropTypes.func
};

export default SigninCallback;
