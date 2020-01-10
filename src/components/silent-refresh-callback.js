import PropTypes from 'prop-types';
import { UserManager } from 'oidc-client';

const SilentRefreshCallback = ({ onSuccess, onError, children }) => {
  console.debug('OIDC SILENT REFRESH:', 'Silent refresh callback.');
  new UserManager()
    .signinSilentCallback()
    .then(() => {
      console.debug('OIDC SILENT REFRESH:', 'Silent refresh done.');
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch(error => {
      console.error('OIDC SILENT REFRESH:', error);
      if (onError) {
        onError(error);
      }
    });

  return children || null;
};

SilentRefreshCallback.propTypes = {
  /**
   * @property {func} onSuccess Raised when a user has been signed out.
   */
  onSuccess: PropTypes.func,
  /**
   * @property {func} onError Raised when an error has been encountered.
   */
  onError: PropTypes.func
};

export default SilentRefreshCallback;
