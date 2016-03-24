(function () {
  'use strict';

  angular
    .module('users')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$state', '$uibModalInstance', '$localStorage', '$auth',
    'Authentication', 'AuthenticationModal'];

  function LoginController($state, $uibModalInstance, $localStorage, $auth,
    Authentication, AuthenticationModal) {
    const vm = this;
    // signup button status
    vm.enabled = true;
    // user credentials
    vm.credentials = {
      email: undefined,
      password: undefined,
    };
    // error messages
    vm.messages = {
      error: undefined,
      email: undefined,
      password: undefined,
    };
    // functions
    vm.login = login;
    vm.openSignup = openSignup;
    vm.openRecovery = openRecovery;
    vm.isValidData = isValidData;
    vm.authenticate = authenticate;

    function authenticate(provider) {
      $auth.authenticate(provider);
    }

    /**
     * Try to login
     */
    function login() {
      // first validate data
      if (!isValidData() || !vm.enabled) {
        return;
      }

      // Disable interaction
      vm.enabled = false;

      // do login
      Authentication.login(vm.credentials)
        .then(loginCompleted)
        .catch(loginFailed);

      // if login completed close modalt
      function loginCompleted(user) {
        $uibModalInstance.close();
      }

      // show error if login failed
      function loginFailed(err) {
        // re enable login
        vm.enabled = true;
        // show error
        vm.messages.error = err;
      }
    }

    // open signup modal
    function openSignup() {
      $uibModalInstance.dismiss();
      AuthenticationModal.openSignup();
    }

    // open recovery modal
    function openRecovery() {
      $uibModalInstance.dismiss();
      AuthenticationModal.openRecovery();
    }

    /*
     * Check if the form has valid data
     */
    function isValidData(field) {
      // validation result
      let res = true;

      // Email validation
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      // Clear global error message
      vm.messages.error = null;

      // Validate Email
      if ((field && field === 'email') || !field) {
        if (regex.exec(vm.credentials.email) !== null) {
          res &= true;
          vm.messages.email = null;
        } else {
          res &= false;
          vm.messages.email = 'Please insert a valid email address';
        }
      }

      // Validate Password
      if ((field && field === 'password') || !field) {
        if ((typeof vm.credentials.password !== 'undefined') &&
          (vm.credentials.password.trim() !== '')) {
          res &= true;
          vm.messages.password = null;
        } else {
          res &= false;
          vm.messages.password = 'Please insert your account password';
        }
      }

      return res;
    }
  }
}());


(function () {
  'use strict';

  angular.module('users')
    .config(authProvider());

  authProvider.$inject = ['$authProvider'];

  function authProvider($authProvider) {
    $authProvider.facebook({
      clientId: '1670753953186317',
    });

    // Optional: For client-side use (Implicit Grant), set responseType to 'token'

    $authProvider.google({
      clientId: 'Google Client ID',
    });

    $authProvider.github({
      clientId: 'GitHub Client ID',
    });

    $authProvider.linkedin({
      clientId: 'LinkedIn Client ID',
    });

    $authProvider.instagram({
      clientId: 'Instagram Client ID',
    });

    $authProvider.yahoo({
      clientId: 'Yahoo Client ID / Consumer Key',
    });

    $authProvider.live({
      clientId: 'Microsoft Client ID',
    });

    $authProvider.twitch({
      clientId: 'Twitch Client ID',
    });

    $authProvider.bitbucket({
      clientId: 'Bitbucket Client ID',
    });

    // No additional setup required for Twitter

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: 'Foursquare Client ID',
      redirectUri: window.location.origin,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
    });
  }
}());
