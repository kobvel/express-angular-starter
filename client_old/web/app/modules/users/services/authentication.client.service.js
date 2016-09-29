(function () {
  'use strict';

  // Authentication service for user variables
  angular
    .module('users')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$rootScope', '$state', '$auth', '$localStorage', '$http',
  '$configuration'];

  function Authentication($rootScope, $state, $auth, $localStorage, $http,
  $configuration) {
    const apiUrl = $configuration.baseUrlApi;
    const auth = {
      user: $localStorage.user,
      login,
      logout,
      signup,
      forgot,
      reset,
      token,
      getToken,
      authenticate,
    };

    updateHeader();

    return auth;

    // implementations

    function updateHeader() {
      // Update previous headers
      if ($localStorage.token) {
        // Set default headers
        $http.defaults.headers.common.Authorization = 'JWT ' + $localStorage.token;
      }
      delete localStorage.satellizer_token;
    }

    function removeHeader() {
      // Update previous headers
      $http.defaults.headers.common.Authorization = undefined;
      delete localStorage.satellizer_token;
    }

    function getToken() {
      return $localStorage.token;
    }

    /*
     * Social network authenticate
     */
    function authenticate(provider) {
      return $auth.authenticate(provider)
      .then((response) => {
        auth.user = response.data.user;
        $localStorage.user = response.data.user;
        $localStorage.token = response.data.token;
        updateHeader();

        // broadcast user logged message and user data
        $rootScope.$broadcast('user-login', response.data.user);
        // $uibModalInstance.close();
        return Authentication.user;
      })
      .catch((err) => {
        console.log('err ', err);
        throw err;
      });
    }

    /**
     * Do user login
     * param credentials: {email: user_email, password: user_password}
     */
    function login(credentials) {
      return $http.post(apiUrl + 'token', credentials)
        .then(loginCompleted)
        .catch(loginFailed);

      function loginCompleted(response) {
        auth.user = response.data.user;
        $localStorage.user = response.data.user;
        $localStorage.token = response.data.token;
        updateHeader();

        // broadcast user logged message and user data
        $rootScope.$broadcast('user-login', response.data.user);

        return response.data.user;
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
      return $http.post(apiUrl + 'users', credentials)
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
      return $http.post(apiUrl + 'users/forgot', credentials)
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
      return $http.post(apiUrl + 'users/reset/password/' + paramToken, credentials)
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
      return $http.get(apiUrl + 'users/reset/validate/' + paramToken)
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
