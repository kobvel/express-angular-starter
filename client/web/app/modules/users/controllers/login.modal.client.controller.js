(function () {
  'use strict';

  angular
    .module('users')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$state', '$uibModalInstance', '$localStorage', '$auth',
    'Authentication', 'AuthenticationModal', 'MEANRestangular'];

  function LoginController($rootScope, $state, $uibModalInstance, $localStorage, $auth,
    Authentication, AuthenticationModal, MEANRestangular) {
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

    function updateHeader() {
      // Update previous headers
      const headers = MEANRestangular.defaultHeaders;
      if ($localStorage.token) {
        headers.Authorization = 'JWT ' + $localStorage.token;
        // Set default headers
        MEANRestangular.setDefaultHeaders(headers);
      }
    }

    function authenticate(provider) {
      $auth.authenticate(provider)
      .then((response) => {
        console.log('response.user ', response.data.user);
        Authentication.user = response.data.user;
        $localStorage.user = response.data.user;
        $localStorage.token = response.data.token;
        updateHeader();

        // broadcast user logged message and user data
        $rootScope.$broadcast('user-login', response.user);
        $uibModalInstance.close();
      })
      .catch((err) => {
        console.log('err ', err);
      });
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
