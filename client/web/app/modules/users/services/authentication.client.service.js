(function () {
  'use strict';

  // Authentication service for user variables
  angular
    .module('users')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$rootScope', '$state', '$localStorage', 'MEANRestangular'];

  function Authentication($rootScope, $state, $localStorage, MEANRestangular) {
    const auth = {
      user: $localStorage.user,
      login,
      logout,
      signup,
      forgot,
      reset,
      token,
      getToken,
    };

    updateHeader();

    return auth;

    // implementations

    function updateHeader() {
      // Update previous headers
      const headers = MEANRestangular.defaultHeaders;
      if ($localStorage.token) {
        headers.Authorization = 'JWT ' + $localStorage.token;
        // Set default headers
        MEANRestangular.setDefaultHeaders(headers);
      }
    }

    function removeHeader() {
      // Update previous headers
      const headers = MEANRestangular.defaultHeaders;
      headers.Authorization = undefined;
      // Set default headers
      MEANRestangular.setDefaultHeaders(headers);
    }

    function getToken() {
      return $localStorage.token;
    }

    /**
     * Do user login
     * param credentials: {email: user_email, password: user_password}
     */
    function login(credentials) {
      return MEANRestangular.all('token').post(credentials)
        .then(loginCompleted)
        .catch(loginFailed);

      function loginCompleted(response) {
        auth.user = response.user;
        $localStorage.user = response.user;
        $localStorage.token = response.token;
        updateHeader();

        // broadcast user logged message and user data
        $rootScope.$broadcast('user-login', response.user);

        return response.user;
      }

      function loginFailed(err) {
        throw err;
      }
    }

    /**
     * Do user logout
     */
    function logout() {
      auth.user = null;
      delete $localStorage.user;
      delete $localStorage.token;
      delete $localStorage.getstated;
      delete $localStorage.uuid;

      removeHeader();

      $state.go('home');

      // broadcast user logout message
      $rootScope.$broadcast('user-logout');
    }

    /**
     * Do user signup
     * param credentials: {firstName, lastName, email, password, ...}
     */
    function signup(credentials) {
      return MEANRestangular.all('users').post(credentials)
        .then(signupCompleted)
        .catch(signupFailed);

      function signupCompleted(response) {
        return response;
      }

      function signupFailed(err) {
        throw err;
      }
    }

    /**
     * Password forgot/recovery
     * param credentials : object {email: example@domain.name}
     */
    function forgot(credentials) {
      return MEANRestangular.one('users').post('forgot', credentials)
        .then(forgotCompleted)
        .catch(forgotFailed);

      function forgotCompleted(response) {
        return response;
      }

      function forgotFailed(err) {
        throw err.data;
      }
    }

    /**
     * Password reset
     * param token: password reset token
     * param credentials : object {password: password}
     */
    function reset(paramToken, credentials) {
      return MEANRestangular.one('users/reset', 'password').post(paramToken, credentials)
        .then(resetCompleted)
        .catch(resetFailed);

      function resetCompleted(response) {
        return response;
      }

      function resetFailed(err) {
        throw err.data;
      }
    }

    /**
     * Password reset token validation
     * param token: token to validate
     */
    function token(paramToken) {
      return MEANRestangular.one('users/reset', 'validate').customGET(paramToken)
        .then(validateCompleted)
        .catch(validateFailed);

      function validateCompleted(response) {
        return response;
      }

      function validateFailed(err) {
        throw err.data;
      }
    }
  }
}());
